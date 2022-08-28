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

---@class Entity
---@field prefab string
---@field components {}

---@class TheWorld
TheWorld = { ismastersim = false }

---@type Entity
ThePlayer = {}

---@param prefab string
---@return Entity
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
