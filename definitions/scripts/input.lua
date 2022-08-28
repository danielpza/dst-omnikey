---@class Input
---@overload fun(): Input
local Input = {
	-- -- all keys, down and up, with key param
	-- onkey = EventProcessor(),
	-- -- specific key up, no parameters
	-- onkeyup = EventProcessor(),
	-- -- specific key down, no parameters
	-- onkeydown = EventProcessor(),
	-- onmousebutton = EventProcessor(),

	-- position = EventProcessor(),
	-- oncontrol = EventProcessor(),
	-- ontextinput = EventProcessor(),
	-- ongesture = EventProcessor(),

	-- hoverinst = nil,
	-- enabledebugtoggle = false,

	-- mouse_enabled = false,

	-- overridepos = nil,
	-- controllerid_cached = nil,
}

function Input:DisableAllControllers() end

function Input:EnableAllControllers() end

function Input:IsControllerLoggedIn(controller) end

---@param cb fun(b: boolean)
function Input:LogUserAsync(controller, cb) end

---@param cb fun(b: boolean)
function Input:LogSecondaryUserAsync(controller, cb) end

---@param enable boolean
function Input:EnableMouse(enable) end

function Input:ClearCachedController() end

function Input:CacheController() end

function Input:TryRecacheController() end

function Input:GetControllerID() end

function Input:ControllerAttached() end

function Input:ControllerConnected() end

-- Get a list of connected input devices and their ids
function Input:GetInputDevices() end

---@param fn fun()
---@return EventHandler
function Input:AddTextInputHandler(fn) end

---@param key number
---@param fn fun()
---@return EventHandler
function Input:AddKeyUpHandler(key, fn) end

---@param key number
---@param fn fun()
---@return EventHandler
function Input:AddKeyDownHandler(key, fn) end

---@param fn fun()
---@return EventHandler
function Input:AddKeyHandler(fn) end

---@param fn fun()
---@return EventHandler
function Input:AddMouseButtonHandler(fn) end

---@param fn fun()
---@return EventHandler
function Input:AddMoveHandler(fn) end

---@param fn fun()
---@return EventHandler
function Input:AddControlHandler(control, fn) end

---@param fn fun()
---@return EventHandler
function Input:AddGeneralControlHandler(fn) end

---@param fn fun()
---@return EventHandler
function Input:AddControlMappingHandler(fn) end

---@param fn fun()
---@return EventHandler
function Input:AddGestureHandler(gesture, fn) end

-- Is for all the button devices (mouse, joystick (even the analog parts), keyboard as well, keyboard

---@return Vector3
function Input:GetScreenPosition() end

---@return Vector3
function Input:GetWorldPosition() end

---@return Entity[]
function Input:GetAllEntitiesUnderMouse() end

---@return Entity | nil
function Input:GetWorldEntityUnderMouse() end

-- function Input:EnableDebugToggle(enable) end

-- function Input:IsDebugToggleEnabled() end

-- function Input:GetHUDEntityUnderMouse() end

---@return boolean
function Input:IsMouseDown(button) end

---@param key number
---@return boolean
function Input:IsKeyDown(key) end

---@return boolean
function Input:IsControlPressed(control) end

-- function Input:GetAnalogControlValue(control) end

-- function Input:IsPasteKey(key) end

-- function Input:UpdateEntitiesUnderMouse()
-- 	self.entitiesundermouse = TheSim:GetEntitiesAtScreenPoint(TheSim:GetPosition())
-- end

-- function Input:OnUpdate()
-- 	if self.mouse_enabled then
-- 		self.entitiesundermouse = TheSim:GetEntitiesAtScreenPoint(TheSim:GetPosition())

-- 		local inst = self.entitiesundermouse[1]
-- 		if inst ~= nil and inst.CanMouseThrough ~= nil then
-- 			local mousethrough, keepnone = inst:CanMouseThrough()
-- 			if mousethrough then
-- 				for i = 2, #self.entitiesundermouse do
-- 					local nextinst = self.entitiesundermouse[i]
-- 					if
-- 						nextinst == nil
-- 						or nextinst:HasTag("player")
-- 						or (nextinst.Transform ~= nil) ~= (inst.Transform ~= nil)
-- 					then
-- 						if keepnone then
-- 							inst = nextinst
-- 							mousethrough, keepnone = false, false
-- 						end
-- 						break
-- 					end
-- 					inst = nextinst
-- 					if nextinst.CanMouseThrough == nil then
-- 						mousethrough, keepnone = false, false
-- 					else
-- 						mousethrough, keepnone = nextinst:CanMouseThrough()
-- 					end
-- 					if not mousethrough then
-- 						break
-- 					end
-- 				end
-- 				if mousethrough and keepnone then
-- 					inst = nil
-- 				end
-- 			end
-- 		end

-- 		if inst ~= self.hoverinst then
-- 			if inst ~= nil and inst.Transform ~= nil then
-- 				inst:PushEvent("mouseover")
-- 			end

-- 			if self.hoverinst ~= nil and self.hoverinst.Transform ~= nil then
-- 				self.hoverinst:PushEvent("mouseout")
-- 			end

-- 			self.hoverinst = inst
-- 		end
-- 	end
-- end

-- function Input:GetLocalizedControl(deviceId, controlId, use_default_mapping, use_control_mapper)
-- 	local device, numInputs, input1, input2, input3, input4, intParam =
-- 		TheInputProxy:GetLocalizedControl(deviceId, controlId, use_default_mapping == true, use_control_mapper ~= false)

-- 	if device == nil then
-- 		return STRINGS.UI.CONTROLSSCREEN.INPUTS[9][1]
-- 	elseif numInputs < 1 then
-- 		return ""
-- 	end

-- 	local inputs = { input1, input2, input3, input4 }
-- 	local text = STRINGS.UI.CONTROLSSCREEN.INPUTS[device][input1]
-- 	-- concatenate the inputs
-- 	for idx = 2, numInputs do
-- 		text = text .. " + " .. STRINGS.UI.CONTROLSSCREEN.INPUTS[device][inputs[idx]]
-- 	end

-- 	-- process string format params if there are any
-- 	return intParam ~= nil and string.format(text, intParam) or text
-- end

-- function Input:GetControlIsMouseWheel(controlId)
-- 	if self:ControllerAttached() then
-- 		return false
-- 	end
-- 	local localized = self:GetLocalizedControl(0, controlId)
-- 	local stringtable = STRINGS.UI.CONTROLSSCREEN.INPUTS[1]
-- 	return localized == stringtable[1003] or localized == stringtable[1004]
-- end

-- function Input:GetStringIsButtonImage(str)
-- 	return table.contains(STRINGS.UI.CONTROLSSCREEN.INPUTS[2], str)
-- 		or table.contains(STRINGS.UI.CONTROLSSCREEN.INPUTS[4], str)
-- 		or table.contains(STRINGS.UI.CONTROLSSCREEN.INPUTS[5], str)
-- 		or table.contains(STRINGS.UI.CONTROLSSCREEN.INPUTS[7], str)
-- 		or table.contains(STRINGS.UI.CONTROLSSCREEN.INPUTS[8], str)
-- end

-- function Input:PlatformUsesVirtualKeyboard()
-- 	if IsConsole() or IsSteamDeck() then
-- 		return true
-- 	end

-- 	return false
-- end

---------------- Globals

TheInput = Input()

return Input
