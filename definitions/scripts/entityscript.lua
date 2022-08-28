---@meta

---@class ds.entity
---@overload fun(): ds.entity
local EntityScript = {
	prefab = "",
	components = {
		weapon = nil,
		---@type ds.components.tool | nil
		tool = nil,
		armor = nil,
	},
	replica = {
		---@type ds.replicas.equippable|nil
		equippable = nil,
		---@type ds.replicas.inventory|nil
		inventory = nil,
	},
}

EntityScript.replica.equippable:EquipSlot()

function EntityScript:Remove() end

function EntityScript:HasTag(tag) end

function EntityScript:HasTags(tags) end

function EntityScript:HasOneOfTags(tags) end

--Can be used on clients
function EntityScript:GetIsWet() end
