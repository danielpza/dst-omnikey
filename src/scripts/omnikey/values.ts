/** @noSelfInFile **/

import { PrefabCopy } from "../../modmain";

export function weaponValue(item: PrefabCopy) {
  return valueByDamage(item);
}

export function axeValue(item: PrefabCopy) {
  return toolValue(item, GLOBAL.ACTIONS.CHOP);
}

export function pickaxeValue(item: PrefabCopy) {
  return toolValue(item, GLOBAL.ACTIONS.MINE);
}

export function clothHeadValue(item: PrefabCopy) {
  return clothValue(item, GLOBAL.EQUIPSLOTS.HEAD);
}

export function clothBodyValue(item: PrefabCopy) {
  return clothValue(item, GLOBAL.EQUIPSLOTS.BODY);
}

export function armorHeadValue(item: PrefabCopy) {
  return armorValue(item, GLOBAL.EQUIPSLOTS.HEAD);
}

export function armorBodyValue(item: PrefabCopy) {
  return armorValue(item, GLOBAL.EQUIPSLOTS.BODY);
}

export function lightValue(item: PrefabCopy) {
  const index = [
    "torch",
    "lighter",
    "tarlamp",
    "minerhat",
    "lantern",
    "bottlelantern",
    "molehat",
    "gears_hat_goggles",
  ].indexOf(item.prefab);
  if (index === -1) return 0;
  return 1 / index;
}

export function caneValue(item: PrefabCopy) {
  return (
    (item.components.equippable &&
      item.components.equippable.walkspeedmult &&
      item.components.equippable.walkspeedmult > 1 &&
      item.components.equippable.walkspeedmult) ||
    0
  );
}

export function clothValue(item: PrefabCopy, slot: GLOBAL.EQUIPSLOTS) {
  return (
    (canBeEquipped(item, slot) &&
      valueByInsulation(item) + valueByDapperness(item) / 10) ||
    0
  );
}

export function armorValue(item: PrefabCopy, slot: GLOBAL.EQUIPSLOTS) {
  return (
    (canBeEquipped(item, slot) &&
      valueByArmor(item) + clothValue(item, slot)) ||
    0
  );
}

export function toolValue(item: PrefabCopy, action: any) {
  return (
    (item.components.tool !== undefined &&
      item.components.tool.actions[action] &&
      valueByConsumption(item, action) * 1000 + valueByUsage(item)) ||
    0
  );
}

function valueByDapperness(item: PrefabCopy) {
  if (!item.components.equippable) return 0;
  return item.components.equippable.dapperness || 0;
}

function valueByInsulation(item: PrefabCopy) {
  if (!item.components.insulator) return 0;
  return item.components.insulator.insulation || 0;
}

function canBeEquipped(item: PrefabCopy, slot: any) {
  return (
    item.components.equippable && item.components.equippable.equipslot === slot
  );
}

function valueByDamage(item: PrefabCopy) {
  return (
    (item.components.weapon &&
      item.components.weapon.damage * 100 + valueByUsage(item)) ||
    0
  );
}

function valueByUsage(item: PrefabCopy): number {
  return (
    (item.components.finiteuses !== undefined &&
      item.components.finiteuses.total * 10 -
        item.components.finiteuses.current) ||
    0
  );
}

function valueByConsumption(item: PrefabCopy, action: any): number {
  return (
    (item.components.finiteuses !== undefined &&
      1 / item.components.finiteuses.consumption[action]) ||
    100
  );
}

function valueByArmor(item: PrefabCopy) {
  return (
    (item.components.armor &&
      item.components.armor.absorb_percent * 100000 -
        item.components.armor.condition) ||
    0
  );
}
