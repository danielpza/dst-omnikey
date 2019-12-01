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
          GLOBAL.EQUIPSLOTS.HANDS
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

function copyPrefab(prefab: string) {
  const isMasterSim = GLOBAL.TheWorld.ismastersim;
  GLOBAL.TheWorld.ismastersim = true;
  const copy = GLOBAL.SpawnPrefab(prefab);
  const cache = {
    prefab,
    components: {
      eater: pick(copy.components.eater, ["preferseating"]),
      finiteuses: pick(copy.components.finiteuses, [
        "current",
        "total",
        "consumption"
      ]),
      tool: pick(copy.components.tool, ["actions"]),
      weapon: pick(copy.components.weapon, ["damage"]),
      armor: pick(copy.components.armor, [
        "absorb_percent",
        "condition",
        "maxcondition"
      ]),
      healer: pick(copy.components.healer, ["health"]),
      equippable: pick(copy.components.equippable, [
        "equipslot",
        "walkspeedmult"
      ]),
      edible: pick(copy.components.edible, [
        "healthvalue",
        "hungervalue",
        "sanityvalue",
        "foodtype"
      ])
    }
  };
  copy.Remove();
  GLOBAL.TheWorld.ismastersim = isMasterSim;
  return cache;
}

interface PrefabCopy extends ReturnType<typeof copyPrefab> {
  original: Prefab;
}

const prefabCache: Record<string, ReturnType<typeof copyPrefab>> = {};

function getPrefabCopy(prefab: string) {
  if (prefabCache[prefab] === undefined) {
    prefabCache[prefab] = copyPrefab(prefab);
  }
  return prefabCache[prefab];
}

function getBestItem(getValue: (item: PrefabCopy) => number) {
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
      getBestItemInList(equippedItems as any, getValue) as any,
      getBestItemInList(items as any, getValue) as any,
      getBestItemInList(equips as any, getValue) as any,
      getBestItemInList(backpackItems as any, getValue) as any,
      activeItem
    ],
    getValue
  ) as any;
}

function getBestItemInList(
  items: Record<number, Prefab | undefined>,
  getValue: (item: PrefabCopy) => number
): Prefab<never, "inventory"> | undefined {
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

main();

// prefabs helpers
function valueByEdible(item: PrefabCopy) {
  const player = getPrefabCopy(GLOBAL.ThePlayer.prefab);
  if (
    !player.components.eater ||
    !item.components.edible ||
    player.components.eater.preferseating.indexOf(
      item.components.edible.foodtype
    ) === -1 ||
    item.components.edible.healthvalue < -5 ||
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

function pick<T, K extends keyof T>(
  t: T | undefined,
  ks: K[]
): Pick<T, K> | undefined {
  if (t === undefined) return undefined;
  const result = {} as Pick<T, K>;
  for (const k of ks) {
    result[k] = t[k];
  }
  return result;
}
