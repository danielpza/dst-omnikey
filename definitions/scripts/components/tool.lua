---@meta

---@class ds.components.tool
---@field actions { [ds.action]: number }
local Tool = {}

---@param action ds.action
function Tool:GetEffectiveness(action) end

---@param action ds.action
function Tool:CanDoAction(action) end

return Tool
