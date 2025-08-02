---@meta

---@class ds.entity.components
---@field tool? ds.components.tool|nil
---@field equippable? ds.components.equippable|nil

---@class ds.entity.replica
---@field inventory? ds.replicas.inventory|nil
---@field equippable? ds.replicas.equippable|nil

---@class ds.entity
---@field prefab string
---@field components? ds.entity.components
---@field replica? ds.entity.replica
---@overload fun(): ds.entity
local EntityScript = {}

function EntityScript:Remove() end

function EntityScript:HasTag(tag) end

function EntityScript:HasTags(tags) end

function EntityScript:HasOneOfTags(tags) end

--Can be used on clients
function EntityScript:GetIsWet() end
