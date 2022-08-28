---@class ToolComponent
---@field actions { [Action]: number }
local ToolComponent = {}
---@param action Action
function ToolComponent:GetEffectiveness(action) end
---@param action Action
function ToolComponent:CanDoAction(action) end

---@class EquippableReplica
local EquippableReplica = {}
---@return EquipSlot
function EquippableReplica:EquipSlot() end
---@return boolean
function EquippableReplica:IsEquipped() end

---@class Entity
---@overload fun(): Entity
local Entity = {
	prefab = "",
	components = {
		weapon = nil,
		---@type ToolComponent | nil
		tool = nil,
		armor = nil,
	},
	replica = {
		---@type EquippableReplica | nil
		equippable = nil,
	},
}

function Entity:Remove() end

function Entity:HasTag(tag) end

function Entity:HasTags(tags) end

function Entity:HasOneOfTags(tags) end

--Can be used on clients
function Entity:GetIsWet() end
