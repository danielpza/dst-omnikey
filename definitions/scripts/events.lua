---@meta

---@class EventHandler
---@overload fun(self, event, fn, processor): EventHandler
local EventHandler = {
   -- event = {},
   -- fn = {},
   -- processor = {},
}

function EventHandler:Remove() end

------------------------

---@class EventProcessor
---@overload fun(): EventProcessor
EventProcessor = {
   -- events = {},
}

---@param event string
---@param fn fun()
---@return EventHandler
function EventProcessor:AddEventHandler(event, fn) end

---@param handler EventHandler
function EventProcessor:RemoveHandler(handler) end

---@param event string
---@return nil | {[EventHandler]: fun()}
function EventProcessor:GetHandlersForEvent(event) end

---@param event string
---@param ... any
function EventProcessor:HandleEvent(event, ...) end

---------------------------------------------
