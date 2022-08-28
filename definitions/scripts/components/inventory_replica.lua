---@class ds.replicas.inventory
local Inventory = {}

---@param slot ds.EquipSlot
---@return ds.entity | nil
function Inventory:GetEquippedItem(slot) end

---@return ds.entity[]
function Inventory:GetItems() end

---@return ds.entity | nil
function Inventory:GetActiveItem() end

---@return { [ds.EquipSlot]: ds.entity }
function Inventory:GetEquips() end

return Inventory
