/** @noSelfInFile **/

import { getPrefabCopy } from "./scripts/omnikey/cache";
import {
  axeValue,
  pickaxeValue,
  weaponValue,
  lightValue,
  caneValue,
  clothValue,
  armorHeadValue,
  armorBodyValue,
} from "./scripts/omnikey/values";
import { SingleThread, getBestItem } from "./scripts/omnikey/utils";

const showButtons = GetModConfigData("SHOW_BUTTONS");
const showKeybinding = GetModConfigData("SHOW_KEYBINDING");
const workFast = GetModConfigData("WORK_FAST");

type Klass = (...params: any[]) => any;

const IMAGE_SIZE = 68; // or 63
const VERTICAL_OFFSET = 160;
// const Widget = GLOBAL.require("widgets/widget");
const Image = GLOBAL.require("widgets/image") as Klass;
const ImageButton = GLOBAL.require("widgets/imagebutton") as Klass;
const Button = GLOBAL.require("widgets/button") as Klass;
const DEFAULT_IMAGE = "cutgrass";

const ACTION_DISTANCE = 40;

export interface PrefabCopy extends ReturnType<typeof getPrefabCopy> {
  original: Prefab;
}

interface Config {
  tags?: string[];
  action: GLOBAL.Action;
  filter?: (this: void, item: Prefabs.Item) => boolean | undefined;
  recipes?: string[];
  equip?: (this: void, item: PrefabCopy) => number;
  faster?: boolean;
  exclude?: string[];
}

const config = {
  pick: {
    action: GLOBAL.ACTIONS.PICK,
    tags: ["pickable"],
    exclude: ["flower"],
    image: "dug_grass",
  },
  pickup: {
    action: GLOBAL.ACTIONS.PICKUP,
    tags: ["_inventoryitem"],
    filter: (item: Prefabs.Item) =>
      item.replica.inventoryitem && item.replica.inventoryitem.CanBePickedUp(),
    image: "cutgrass",
  },
  chop: {
    action: GLOBAL.ACTIONS.CHOP,
    tags: ["CHOP_workable"],
    equip: axeValue,
    recipes: ["goldenaxe", "axe"],
    faster: workFast && true,
    image: "axe",
  },
  mine: {
    action: GLOBAL.ACTIONS.MINE,
    tags: ["MINE_workable"],
    equip: pickaxeValue,
    recipes: ["goldenpickaxe", "pickaxe"],
    faster: workFast && true,
    image: "pickaxe",
  },
};

let pc = (null as any) as Prefabs.Player["components"]["playercontroller"];
let inventorybar = null as any;

function main() {
  const thread = new SingleThread();
  const prevOnControl = pc.OnControl;
  pc.OnControl = function (this, control, down) {
    if (
      control === GLOBAL.CONTROL_MOVE_UP ||
      control === GLOBAL.CONTROL_MOVE_DOWN ||
      control === GLOBAL.CONTROL_MOVE_LEFT ||
      control === GLOBAL.CONTROL_MOVE_RIGHT
    )
      thread.stop();
    prevOnControl.call(this, control, down);
  };
  let index = 0;
  for (const [key, data] of [
    [GetModConfigData("PICKUP"), config.pickup],
    [GetModConfigData("PICK"), config.pick],
    [GetModConfigData("CHOP"), config.chop],
    [GetModConfigData("MINE"), config.mine],
  ]) {
    index += 1;
    const start = () => {
      if (isReady())
        thread.start(() => {
          while (doThreadAction(data));
        });
    };
    if (showButtons) {
      addButton(inventorybar, {
        image: data.image || DEFAULT_IMAGE,
        position: 10 + index,
        text: String.fromCharCode(key).toUpperCase(),
        onClick: start,
      });
    }
    GLOBAL.TheInput.AddKeyUpHandler(key, start);
  }
  for (const [key, fn] of [
    [GetModConfigData("WEAPON"), weaponValue],
    [GetModConfigData("HELMET"), armorHeadValue],
    [GetModConfigData("ARMOR"), armorBodyValue],
    [GetModConfigData("LIGHT"), lightValue],
  ]) {
    GLOBAL.TheInput.AddKeyUpHandler(key, () => {
      if (isReady()) ensureEquipped(fn, true);
    });
  }
}

function isReady() {
  return (
    !GLOBAL.IsPaused() &&
    GLOBAL.TheFrontEnd.GetActiveScreen() &&
    GLOBAL.TheFrontEnd.GetActiveScreen().name &&
    typeof GLOBAL.TheFrontEnd.GetActiveScreen().name === "string" &&
    GLOBAL.TheFrontEnd.GetActiveScreen().name === "HUD" &&
    GLOBAL.ThePlayer
  );
}

function isBusy() {
  const player = GLOBAL.ThePlayer;
  return (
    player.replica.builder.IsBusy() ||
    player.components.playercontroller.IsDoingOrWorking() ||
    !player.HasTag("idle") ||
    player.HasTag("moving")
  );
}

function doAction(action: any) {
  const player = GLOBAL.ThePlayer;
  const ctrl = action.control || GLOBAL.CONTROL_PRIMARY;

  if (ctrl === GLOBAL.CONTROL_PRIMARY) {
    const target = action.target || null;
    const position =
      action.GetActionPoint() ||
      (target && target.GetPosition()) ||
      player.GetPosition();

    GLOBAL.SendRPCToServer(
      GLOBAL.RPC.LeftClick,
      action.action.code,
      position.x,
      position.z,
      target,
      action.rotation,
      player.components.playercontroller.EncodeControlMods(),
      action.action.canforce,
      action.action.modname
    );
  }
}

function canMakeRecipe(recipeName: string) {
  const builder = GLOBAL.ThePlayer.replica.builder;
  return builder.KnowsRecipe(recipeName) && builder.CanBuild(recipeName);
}

function makeRecipe(recipeName: string) {
  const recipe = GLOBAL.GetValidRecipe(recipeName);
  if (recipe && canMakeRecipe(recipeName)) {
    GLOBAL.ThePlayer.replica.builder.MakeRecipeFromMenu(recipe);
    return true;
  }
  return false;
}

function tryMakeRecipes(recipes: string[]): boolean {
  const index = recipes.findIndex((recipeName) => canMakeRecipe(recipeName));
  if (index === -1) return false;
  makeRecipe(recipes[index]);
  return true;
}

function doThreadAction({
  action,
  tags,
  filter,
  faster,
  equip,
  recipes,
  exclude,
}: Config) {
  const target = GLOBAL.FindEntity(
    GLOBAL.ThePlayer,
    ACTION_DISTANCE,
    filter,
    tags,
    exclude
  );
  if (!target) return false;
  if (equip) {
    if (!ensureEquipped(equip)) {
      if (!recipes || !tryMakeRecipes(recipes)) return;
      GLOBAL.Sleep(GLOBAL.FRAMES * 6);
      while (isBusy()) GLOBAL.Sleep(GLOBAL.FRAMES * 3);
      ensureEquipped(equip);
    }
  }

  const act = GLOBAL.BufferedAction(GLOBAL.ThePlayer, target, action);
  GLOBAL.ThePlayer.components.playercontroller.DoAction(act);
  doAction(act);
  GLOBAL.Sleep(GLOBAL.FRAMES * 6);
  while (isBusy()) {
    if (faster) doAction(act);
    GLOBAL.Sleep(GLOBAL.FRAMES * 3);
  }
  return true;
}

function ensureEquipped(fn: (item: PrefabCopy) => number, unequip = false) {
  const item = getBestItem(fn);
  if (!item) return false;
  const copy = getPrefabCopy(item.prefab);
  if (!copy.components.equippable) return;
  const equipped = GLOBAL.ThePlayer.replica.inventory.GetEquippedItem(
    copy.components.equippable.equipslot
  );
  if (equipped !== item)
    GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(item);
  else if (unequip)
    if (copy.components.equippable.equipslot === GLOBAL.EQUIPSLOTS.HANDS)
      ensureEquipped(caneValue) ||
        GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(item);
    else
      ensureEquipped((item: PrefabCopy) =>
        clothValue(item, copy.components.equippable!.equipslot)
      ) || GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(item);
  return true;
}

function addButton(
  parent: any,
  {
    position,
    text,
    onClick,
    image,
  }: {
    image: string;
    position: number;
    text: string;
    onClick: () => void;
  }
) {
  const button = parent.AddChild(ImageButton("images/hud.xml", "inv_slot.tex"));
  const x = IMAGE_SIZE * (-10 + position);
  button.SetPosition(x, VERTICAL_OFFSET, 0);
  button.SetOnClick(onClick);
  button.MoveToFront();

  const icon = button.AddChild(
    Image(GLOBAL.GetInventoryItemAtlas(image + ".tex"), `${image}.tex`)
  );
  // GLOBAL.EQUIPSLOTS
  icon.SetScale(0.8, 0.8, 0.8);
  icon.MoveToFront();

  if (showKeybinding) {
    const letter = button.AddChild(Button());
    letter.SetText(text);
    letter.SetPosition(5, 0, 0);
    letter.SetFont("stint-ucr");
    letter.SetTextColour(1, 1, 1, 1);
    letter.SetTextFocusColour(1, 1, 1, 1);
    letter.SetTextSize(50);
    letter.MoveToFront();
  }
}

let ready = false;

AddClassPostConstruct("widgets/inventorybar", function (this: any) {
  inventorybar = this;
  if (ready) main();
  ready = true;
});

AddComponentPostInit("playercontroller", function (playercontrol: any) {
  pc = playercontrol;
  if (ready) main();
  ready = true;
});
