---@meta

---@param modconfig string
---@return any
function GetModConfigData(modconfig) end

---@param class string
---@param cb fun(component: any)
function AddComponentPostInit(class, cb) end

---@param class string
---@param cb fun(self: any)
function AddClassPostConstruct(class, cb) end

---@class TheWorld
TheWorld = { ismastersim = false }

---@type ds.entity
ThePlayer = {}

---@param prefab string
---@return ds.entity
function SpawnPrefab(prefab) end

---@class GLOBAL
GLOBAL = {
	CHEATS_ENABLED = false,
	ACTIONS = ACTIONS,
	EQUIPSLOTS = EQUIPSLOTS,

	require = require,

	TheInput = TheInput,
	ThePlayer = ThePlayer,
	TheWorld = TheWorld,

	SpawnPrefab = SpawnPrefab,

	StartThread = StartThread,
	KillThread = KillThread,

	Sleep = Sleep,
}
