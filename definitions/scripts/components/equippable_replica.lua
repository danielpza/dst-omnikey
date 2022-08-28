---@meta

---@class ds.replicas.equippable
local Equippable = {}

---@return ds.EquipSlot
function Equippable:EquipSlot() end

---@return boolean
function Equippable:IsEquipped() end

return Equippable
