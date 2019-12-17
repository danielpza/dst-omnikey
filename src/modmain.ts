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
  armorBodyValue
} from "./scripts/omnikey/values";

const ACTION_DISTANCE = 40;

class SingleThread {
  thread: GLOBAL.Thread | null = null;
  start(fn: () => void) {
    this.stop();
    this.thread = GLOBAL.StartThread(fn);
  }
  stop() {
    if (this.thread) {
      GLOBAL.KillThread(this.thread);
      this.thread = null;
    }
  }
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
    exclude: ["flower"]
  },
  pickup: {
    action: GLOBAL.ACTIONS.PICKUP,
    tags: ["_inventoryitem"],
    filter: (item: Prefabs.Item) =>
      item.replica.inventoryitem && item.replica.inventoryitem.CanBePickedUp()
  },
  chop: {
    action: GLOBAL.ACTIONS.CHOP,
    tags: ["CHOP_workable"],
    equip: axeValue,
    recipes: ["goldenaxe", "axe"],
    faster: true
  },
  mine: {
    action: GLOBAL.ACTIONS.MINE,
    tags: ["MINE_workable"],
    equip: pickaxeValue,
    recipes: ["goldenpickaxe", "pickaxe"],
    faster: true
  }
};

function main(pc: Prefabs.Player["components"]["playercontroller"]) {
  const thread = new SingleThread();
  const prevOnControl = pc.OnControl;
  pc.OnControl = function(this, control, down) {
    if (
      control === GLOBAL.CONTROL_MOVE_UP ||
      control === GLOBAL.CONTROL_MOVE_DOWN ||
      control === GLOBAL.CONTROL_MOVE_LEFT ||
      control === GLOBAL.CONTROL_MOVE_RIGHT
    )
      thread.stop();
    prevOnControl.call(this, control, down);
  };
  for (const [key, data] of [
    [GetModConfigData("MINE"), config.mine],
    [GetModConfigData("CHOP"), config.chop],
    [GetModConfigData("PICK"), config.pick],
    [GetModConfigData("PICKUP"), config.pickup]
  ]) {
    GLOBAL.TheInput.AddKeyUpHandler(key, () => {
      if (isReady())
        thread.start(() => {
          while (doThreadAction(data));
        });
    });
  }
  for (const [key, fn] of [
    [GetModConfigData("WEAPON"), weaponValue],
    [GetModConfigData("HELMET"), armorHeadValue],
    [GetModConfigData("ARMOR"), armorBodyValue],
    [GetModConfigData("LIGHT"), lightValue]
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
  const index = recipes.findIndex(recipeName => canMakeRecipe(recipeName));
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
  exclude
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

export interface PrefabCopy extends ReturnType<typeof getPrefabCopy> {
  original: Prefab;
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

function getBestItem(
  getValue: (item: PrefabCopy) => number
): Prefabs.Item | undefined {
  const items = GLOBAL.ThePlayer.replica.inventory.GetItems();
  const equips = GLOBAL.ThePlayer.replica.inventory.GetEquips();
  const activeItem = GLOBAL.ThePlayer.replica.inventory.GetActiveItem();
  const equippedItems = [
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem(GLOBAL.EQUIPSLOTS.BODY),
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS),
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem(GLOBAL.EQUIPSLOTS.HEAD)
  ] as Record<number, Prefabs.Item | undefined>;
  const backpack = GLOBAL.ThePlayer.replica.inventory.GetOverflowContainer();
  const backpackItems =
    (backpack &&
      backpack.inst.replica.container &&
      backpack.inst.replica.container.GetItems()) ||
    [];
  return getBestItemInList(
    [
      getBestItemInList(equippedItems, getValue),
      getBestItemInList(items, getValue),
      getBestItemInList(equips, getValue),
      getBestItemInList(backpackItems, getValue),
      activeItem
    ],
    getValue
  );
}

function getBestItemInList(
  items: Record<number, Prefab | undefined>,
  getValue: (item: PrefabCopy) => number
): Prefabs.Item | undefined {
  let best: Prefab | undefined = undefined;
  let bestValue = 0;
  for (const item of Object.values(items)) {
    if (item !== undefined) {
      const copy = getCopy(getPrefabCopy(item.prefab)) as PrefabCopy;
      copy.original = item;
      if (
        copy.components.finiteuses &&
        item.replica.inventoryitem &&
        item.replica.inventoryitem.classified.percentused
      )
        copy.components.finiteuses.current =
          (item.replica.inventoryitem.classified.percentused.value() *
            copy.components.finiteuses.total) /
          100;
      const value = getValue(copy);
      if (value > 0 && value > bestValue) {
        best = item;
        bestValue = value;
      }
    }
  }
  return best as any;
}

function getCopy<T>(obj: T): T {
  if (typeof obj !== "object") return obj;
  const result = {} as T;
  for (const key in obj) {
    result[key] = getCopy(obj[key]);
  }
  return result;
}

AddComponentPostInit("playercontroller", main as any);
