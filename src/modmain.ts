/** @noSelfInFile **/

const configData = [
  {
    key: GetModConfigData("WEAPON"),
    getValue: valueByDamage
  },
  {
    key: GetModConfigData("HEAL"),
    getValue: valueByHeal
  },
  {
    key: GetModConfigData("EAT"),
    getValue: valueByEdible
  },
  {
    key: GetModConfigData("AXE"),
    getValue: (item: PrefabCopy) => toolValue(item, GLOBAL.ACTIONS.CHOP)
  },
  {
    key: GetModConfigData("PICKAXE"),
    getValue: (item: PrefabCopy) => toolValue(item, GLOBAL.ACTIONS.MINE)
  },
  {
    key: GetModConfigData("SHOVEL"),
    getValue: (item: PrefabCopy) => toolValue(item, GLOBAL.ACTIONS.DIG)
  },
  {
    key: GetModConfigData("HAMMER"),
    getValue: (item: PrefabCopy) => toolValue(item, GLOBAL.ACTIONS.HAMMER)
  },
  {
    key: GetModConfigData("SCYTHE"),
    getValue: scytheToolValue
  },
  {
    key: GetModConfigData("ARMOR"),
    getValue: (item: PrefabCopy) => armorValue(item, GLOBAL.EQUIPSLOTS.BODY)
  },
  {
    key: GetModConfigData("HELMET"),
    getValue: (item: PrefabCopy) => armorValue(item, GLOBAL.EQUIPSLOTS.HEAD)
  },
  {
    key: GetModConfigData("LIGHT"),
    getValue: (item: PrefabCopy) => {
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
        const cane = getBestItem(caneValue);
        const equippedItem = GLOBAL.ThePlayer.replica.inventory.GetEquippedItem(
          "hands"
        );
        if (item) {
          if (equippedItem === item && cane)
            GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(cane);
          else GLOBAL.ThePlayer.replica.inventory.UseItemFromInvTile(item);
        }
      }
    });
  }
}

interface PrefabCopy {
  original: Prefab;
  prefab: string;
  components: ComponentBundle;
}

const prefabCache: Record<
  string,
  { prefab: string; components: ComponentBundle }
> = {};

function getPrefabCopy(prefab: string) {
  if (prefabCache[prefab] === undefined) {
    const isMasterSim = GLOBAL.TheWorld.ismastersim;
    GLOBAL.TheWorld.ismastersim = true;
    const copy = GLOBAL.SpawnPrefab(prefab);
    const cache = { prefab, components: {} } as PrefabCopy;
    if (copy.components.finiteuses) {
      const { current, total, consumption } = copy.components.finiteuses;
      cache.components.finiteuses = { current, total, consumption };
    }
    if (copy.components.tool) {
      const { actions } = copy.components.tool;
      cache.components.tool = { actions } as any;
    }
    if (copy.components.weapon) {
      const { damage } = copy.components.weapon;
      cache.components.weapon = { damage };
    }
    if (copy.components.armor) {
      const { absorb_percent, condition, maxcondition } = copy.components.armor;
      cache.components.armor = { absorb_percent, condition, maxcondition };
    }
    if (copy.components.healer) {
      const { health } = copy.components.healer;
      cache.components.healer = { health };
    }
    if (copy.components.equippable) {
      const { equipslot, walkspeedmult } = copy.components.equippable;
      cache.components.equippable = { equipslot, walkspeedmult };
    }
    if (copy.components.edible) {
      const {
        healthvalue,
        hungervalue,
        sanityvalue,
        ismeat,
        foodtype
      } = copy.components.edible;
      cache.components.edible = {
        healthvalue,
        hungervalue,
        sanityvalue,
        ismeat,
        foodtype
      };
    }
    copy.Remove();
    GLOBAL.TheWorld.ismastersim = isMasterSim;
    prefabCache[prefab] = cache;
  }
  return prefabCache[prefab];
}

function getBestItem(
  getValue: (item: PrefabCopy) => number
): Prefab | undefined {
  const items = GLOBAL.ThePlayer.replica.inventory.GetItems();
  const equips = GLOBAL.ThePlayer.replica.inventory.GetEquips();
  const activeItem = GLOBAL.ThePlayer.replica.inventory.GetActiveItem();
  const equippedItems = [
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem("body"),
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem("hands"),
    GLOBAL.ThePlayer.replica.inventory.GetEquippedItem("head")
  ] as List<Prefab>;
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
  items: List<Prefab | undefined>,
  getValue: (item: PrefabCopy) => number
): Prefab | undefined {
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
  return best;
}

function getCopy<T>(obj: T): T {
  if (typeof obj !== "object") return obj;
  const result = {} as T;
  for (const key in obj) {
    result[key] = getCopy(obj[key]);
  }
  return result;
}

main();

// prefabs helpers
function valueByEdible(item: PrefabCopy) {
  if (
    !item.components.edible ||
    item.components.edible.healthvalue < -5 ||
    item.components.edible.foodtype === GLOBAL.FOODTYPE.ELEMENTAL ||
    item.components.edible.foodtype === GLOBAL.FOODTYPE.ROUGHAGE ||
    item.components.edible.hungervalue <= 0
  )
    return 0;
  return (
    500 / item.components.edible.hungervalue +
    (item.components.edible.sanityvalue + item.components.edible.healthvalue) /
      2
  );
}

function valueByHeal(item: PrefabCopy) {
  return (
    (item.components.healer && item.components.healer.health) ||
    (item.components.edible &&
      item.components.edible.healthvalue >= 10 &&
      item.components.edible.healthvalue) ||
    0
  );
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

function armorValue(item: PrefabCopy, slot: any) {
  return (canBeEquipped(item, slot) && valueByArmor(item)) || 0;
}

function toolValue(item: PrefabCopy, action: any) {
  return (
    (item.components.tool !== undefined &&
      item.components.tool.actions[action] &&
      valueByConsumption(item, action) * 1000 + valueByUsage(item)) ||
    0
  );
}

function scytheToolValue(item: PrefabCopy) {
  return (
    (item.original.HasTag("mower") &&
      valueByConsumption(item, GLOBAL.ACTIONS.PICK) * 1000 +
        valueByUsage(item)) ||
    0
  );
}

function hasPrefab(item: PrefabCopy, prefab: string) {
  return item.prefab === prefab ? 1 : 0;
}

function caneValue(item: PrefabCopy) {
  return (
    (item.components.equippable &&
      item.components.equippable.walkspeedmult &&
      item.components.equippable.walkspeedmult > 1 &&
      item.components.equippable.walkspeedmult) ||
    0
  );
}
