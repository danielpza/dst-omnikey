---@meta

---@class ds.replicas.equippable
local Equippable = {}

---@return ds.equipslot
function Equippable:EquipSlot() end

---@return boolean
function Equippable:IsEquipped() end

return Equippable
