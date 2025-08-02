---@meta

---@class Task
---@overload fun(fn, id, param): Task
local Task = { id = "", param = {}, fn = {} }

---@class Periodic
---@overload fun(fn, period, limit, id, nexttick, ...): Periodic
local Periodic = { id = "", param = {}, fn = {} }

function Periodic:Cancel() end

---@return nil | number
function Periodic:NextTime() end

function Periodic:Cleanup() end
-------------------------------

---@class Scheduler
---@overload fun(isstatic): Scheduler
local Scheduler = {
   tasks = {},
   running = {},
   waitingfortick = {},
   waking = {},
   hibernating = {},
   attime = {},
   isstatic = nil,
}

---@param task Task
function Scheduler:KillTask(task) end

---@return Task
function Scheduler:AddTask(fn, id, param) end

-- function Scheduler:OnTick(tick) end

function Scheduler:Run() end

function Scheduler:KillAll() end

function Scheduler:ExecuteInTime(timefromnow, fn, id, ...) end

------------------------------------------------------------------------------------

--These are to be called from within a thread

function Wake() end

function Hibernate() end

function Yield() end

---@param time number
function Sleep(time) end

---@param task Task
function KillThread(task) end

------

---@param task Task
function WakeTask(task) end

--This is to start a thread
---@param fn fun()
---@param id? any
---@param param? any
---@return Task
function StartThread(fn, id, param) end

---@param fn fun()
---@param id? any
---@param param? any
---@return Task
function StartStaticThread(fn, id, param) end
