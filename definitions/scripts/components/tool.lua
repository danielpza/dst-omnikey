---@meta

---@class ds.components.tool
---@field actions { [Action]: number }
local Tool = {}

---@param action Action
function Tool:GetEffectiveness(action) end

---@param action Action
function Tool:CanDoAction(action) end

return Tool
