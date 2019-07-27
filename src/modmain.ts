/** @noSelfInFile **/

const configData = [
  {
    key: GetModConfigData("WEAPON"),
    getValue: (item: Prefab) => valueByDamage(item)
  },
  {
    key: GetModConfigData("HEAL"),
    getValue: (item: Prefab) => valueByHeal(item)
  },
  {
    key: GetModConfigData("EAT"),
    getValue: (item: Prefab) => valueByEdible(item)
  },
  {
    key: GetModConfigData("AXE"),
    getValue: (item: Prefab) => toolValue(item, GLOBAL.ACTIONS.CHOP)
  },
  {
    key: GetModConfigData("PICKAXE"),
    getValue: (item: Prefab) => toolValue(item, GLOBAL.ACTIONS.MINE)
  },
  {
    key: GetModConfigData("SHOVEL"),
    getValue: (item: Prefab) => toolValue(item, GLOBAL.ACTIONS.DIG)
  },
  {
    key: GetModConfigData("ARMOR"),
    getValue: (item: Prefab) => armorValue(item, GLOBAL.EQUIPSLOTS.BODY)
  },
  {
    key: GetModConfigData("HELMET"),
    getValue: (item: Prefab) => armorValue(item, GLOBAL.EQUIPSLOTS.HEAD)
  },
  {
    key: GetModConfigData("LIGHT"),
    getValue: (item: Prefab) => {
      const index = [
        "gears_hat_goggles",
        "molehat",
        "bottlelantern",
        "lantern",
        "minerhat",
        "tarlamp",
        "lighter",
        "torch"
      ].indexOf(item.prefab);
      if (index === -1) return 0;
      return 1 / index;
    }
  }
];

function main() {
  for (const data of configData) {
    GLOBAL.TheInput.AddKeyUpHandler(data.key, () => {
      if (
        !GLOBAL.IsPaused() &&
        GLOBAL.TheFrontEnd.GetActiveScreen() &&
        GLOBAL.TheFrontEnd.GetActiveScreen().name &&
        typeof GLOBAL.TheFrontEnd.GetActiveScreen().name === "string" &&
        GLOBAL.TheFrontEnd.GetActiveScreen().name === "HUD"
      ) {
        const item = getBestItem(data.getValue);
        const cane = getBestItem((item: Prefab) => hasPrefab(item, "cane"));
        const equippedItem = GLOBAL.ThePlayer.replica.inventory.GetEquippedItem(
          "hands"
        );
        if (item)
          if (equippedItem === item && cane)
            GLOBAL.ThePlayer.components.inventory.UseItemFromInvTile(cane);
          else GLOBAL.ThePlayer.components.inventory.UseItemFromInvTile(item);
      }
    });
  }
}

function getBestItem(getValue: (item: Prefab) => number): Prefab | undefined {
  const items = GLOBAL.ThePlayer.replica.inventory.GetItems();
  const equips = GLOBAL.ThePlayer.replica.inventory.GetEquips();
  const activeItem = GLOBAL.ThePlayer.replica.inventory.GetActiveItem();
  const equippedItems = [
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem("body"),
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem("hands"),
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem("head")
  ] as List<Prefab>;
  return getBestItemInList(
    [
      getBestItemInList(equippedItems, getValue),
      getBestItemInList(items, getValue),
      getBestItemInList(equips, getValue),
      activeItem
    ],
    getValue
  );
}

function getBestItemInList(
  items: List<Prefab | undefined>,
  getValue: (item: Prefab) => number
): Prefab | undefined {
  let best: Prefab | undefined = undefined;
  for (const item of Object.values(items)) {
    if (item !== undefined) {
      const value = getValue(item);
      if (value > 0 && (best === undefined || value > getValue(best))) {
        best = item;
      }
    }
  }
  return best;
}

main();

// prefabs helpers
function valueByEdible(item: Prefab) {
  if (
    !item.components.edible ||
    item.components.edible.healthvalue < -5 ||
    item.components.edible.foodtype === GLOBAL.FOODTYPE.ELEMENTAL
  )
    return 0;
  return (
    500 / item.components.edible.hungervalue +
    (item.components.edible.sanityvalue + item.components.edible.healthvalue) /
      2
  );
}

function valueByHeal(item: Prefab) {
  return (item.components.healer && item.components.healer.health) || 0;
}

function canBeEquipped(item: Prefab, slot: any) {
  return (
    item.components.equippable && item.components.equippable.equipslot === slot
  );
}

function valueByDamage(item: Prefab) {
  return (
    (item.components.weapon &&
      item.components.weapon.damage * 100 + valueByUsage(item)) ||
    0
  );
}

function valueByUsage(item: Prefab): number {
  return (
    (item.components.finiteuses !== undefined &&
      item.components.finiteuses.total * 10 -
        item.components.finiteuses.current) ||
    0
  );
}

function valueByConsumption(item: Prefab, action: any): number {
  return (
    (item.components.finiteuses !== undefined &&
      1 / item.components.finiteuses.consumption[action]) ||
    100
  );
}

function valueByArmor(item: Prefab) {
  return (
    (item.components.armor &&
      item.components.armor.absorb_percent * 100000 -
        item.components.armor.condition) ||
    0
  );
}

function armorValue(item: Prefab, slot: any) {
  return (canBeEquipped(item, slot) && valueByArmor(item)) || 0;
}

function toolValue(item: Prefab, action: any) {
  return (
    (item.components.tool !== undefined &&
      item.components.tool.CanDoAction(action) &&
      valueByConsumption(item, action) * 1000 + valueByUsage(item)) ||
    0
  );
}

function hasPrefab(item: Prefab, prefab: string) {
  return item.prefab === prefab ? 1 : 0;
}
