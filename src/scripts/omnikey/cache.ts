const prefabCache: Record<string, ReturnType<typeof copyPrefab>> = {};

export function getPrefabCopy(prefab: string) {
  if (prefabCache[prefab] === undefined) {
    prefabCache[prefab] = copyPrefab(prefab);
  }
  return prefabCache[prefab];
}

function copyPrefab(prefab: string) {
  const isMasterSim = GLOBAL.TheWorld.ismastersim;
  GLOBAL.TheWorld.ismastersim = true;
  const copy = GLOBAL.SpawnPrefab(prefab);
  const cache = {
    prefab,
    components: {
      waterproofer: pick(copy.components.waterproofer, ["effectiveness"]),
      insulator: pick(copy.components.insulator, ["insulation"]),
      eater: pick(copy.components.eater, ["preferseating"]),
      finiteuses: pick(copy.components.finiteuses, ["current", "total", "consumption"]),
      tool: pick(copy.components.tool, ["actions"]),
      weapon: pick(copy.components.weapon, ["damage"]),
      armor: pick(copy.components.armor, ["absorb_percent", "condition", "maxcondition"]),
      healer: pick(copy.components.healer, ["health"]),
      equippable: pick(copy.components.equippable, ["dapperness", "equipslot", "walkspeedmult"]),
      edible: pick(copy.components.edible, [
        "healthvalue",
        "hungervalue",
        "sanityvalue",
        "foodtype",
      ]),
    },
  };
  copy.Remove();
  GLOBAL.TheWorld.ismastersim = isMasterSim;
  return cache;
}

function pick<T, K extends keyof T>(t: T | undefined, ks: K[]): Pick<T, K> | undefined {
  if (t === undefined) return undefined;
  const result = {} as Pick<T, K>;
  for (const k of ks) {
    result[k] = t[k];
  }
  return result;
}
