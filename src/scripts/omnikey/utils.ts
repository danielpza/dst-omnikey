/** @noSelfInFile **/

import { PrefabCopy } from "../../modmain";
import { getPrefabCopy } from "./cache";

export class SingleThread {
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

export function getBestItem(
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
