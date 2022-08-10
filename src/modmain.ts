import { getPrefabCopy } from "./scripts/omnikey/cache";
import { getBestItem, SingleThread } from "./scripts/omnikey/utils";
import {
  armorBodyValue,
  armorHeadValue,
  axeValue,
  caneValue,
  clothValue,
  lightValue,
  pickaxeValue,
  weaponValue,
} from "./scripts/omnikey/values";
import { InventoryButton } from "./scripts/omnikey/widget";

const showEquipButtons = GetModConfigData("SHOW_EQUIP") as boolean;
const showButtons = GetModConfigData("SHOW_BUTTONS") as boolean;
const showKeybinding = GetModConfigData("SHOW_KEYBINDING") as boolean;
const addKeybindings = GetModConfigData("BIND_KEYS") as boolean;
const workFast = GetModConfigData("WORK_FAST") as boolean;
const useHambat = GetModConfigData("USE_HAMBAT") as boolean;

const DEFAULT_IMAGE = "cutgrass";

const ACTION_DISTANCE = 40;

export interface PrefabCopy extends ReturnType<typeof getPrefabCopy> {
  original: Prefab;
}

interface TaskConfig {
  tags?: string[];
  action: GLOBAL.Action;
  filter?: (this: void, item: Prefabs.Item) => boolean | undefined;
  recipes?: string[];
  equip?: (this: void, item: PrefabCopy) => number;
  faster?: boolean;
  exclude?: string[];
}

let pc = null as any as Prefabs.Player["components"]["playercontroller"];

function main() {
  setupTaskKeys();
  setupGearKeys();
}

const hambatOrWeaponValue = (item: PrefabCopy) =>
  item.prefab === "hambat" ? 10000 : weaponValue(item);

function setupGearKeys() {
  let index = 0;
  for (const [key, fn, image] of [
    [GetModConfigData("WEAPON"), useHambat ? hambatOrWeaponValue : weaponValue, "spear"],
    [GetModConfigData("HELMET"), armorHeadValue, "footballhat"],
    [GetModConfigData("ARMOR"), armorBodyValue, "armorwood"],
    [GetModConfigData("LIGHT"), lightValue, "torch"],
  ]) {
    const start = () => {
      if (isReady()) ensureEquipped(fn, true);
    };
    if (showEquipButtons) {
      addButton({
        image: image || DEFAULT_IMAGE,
        position: index,
        text: String.fromCharCode(key).toUpperCase(),
        onClick: start,
      });
      index++;
    }
    GLOBAL.TheInput.AddKeyUpHandler(key, start);
  }
}

function setupTaskKeys() {
  const taskConfig = {
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
    [GetModConfigData("PICKUP"), taskConfig.pickup],
    [GetModConfigData("PICK"), taskConfig.pick],
    [GetModConfigData("CHOP"), taskConfig.chop],
    [GetModConfigData("MINE"), taskConfig.mine],
  ]) {
    index += 1;
    const start = () => {
      if (isReady())
        thread.start(() => {
          while (doThreadAction(data));
        });
    };
    if (showButtons) {
      addButton({
        image: data.image || DEFAULT_IMAGE,
        position: 10 + index,
        text: String.fromCharCode(key).toUpperCase(),
        onClick: start,
      });
    }
    if (addKeybindings) {
      GLOBAL.TheInput.AddKeyUpHandler(key, start);
    }
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
      action.GetActionPoint() || (target && target.GetPosition()) || player.GetPosition();

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

function doThreadAction({ action, tags, filter, faster, equip, recipes, exclude }: TaskConfig) {
  const target = GLOBAL.FindEntity(GLOBAL.ThePlayer, ACTION_DISTANCE, filter, tags, exclude);
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
  if (equipped !== item) GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(item);
  else if (unequip)
    if (copy.components.equippable.equipslot === GLOBAL.EQUIPSLOTS.HANDS)
      ensureEquipped(caneValue) || GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(item);
    else
      ensureEquipped((item: PrefabCopy) =>
        clothValue(item, copy.components.equippable!.equipslot)
      ) || GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(item);
  return true;
}

let ready = false;
let inventorybar = null as any as Module.Widget;

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

function addButton(props: {
  image: string;
  position: number;
  text?: string;
  onClick: (this: void) => void;
}) {
  props.text = showKeybinding && addKeybindings ? props.text! : undefined;
  inventorybar.AddChild(InventoryButton(props));
}
