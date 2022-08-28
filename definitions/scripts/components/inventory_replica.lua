---@meta

---@class ds.replicas.inventory
local Inventory = {}

---@param slot ds.equipslot
---@return ds.entity | nil
function Inventory:GetEquippedItem(slot) end

---@return ds.entity[]
function Inventory:GetItems() end

---@return ds.entity | nil
function Inventory:GetActiveItem() end

---@return { [ds.equipslot]: ds.entity }
function Inventory:GetEquips() end

return Inventory
