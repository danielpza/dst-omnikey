-- for debugging
GLOBAL.CHEATS_ENABLED = true
GLOBAL.require("debugkeys")
--

---@generic T
---@param prefab string
---@param fn fun(item: ds.entity): T
---@return T
local function WithMastersimPrefab(prefab, fn)
	local isMasterSim = GLOBAL.TheWorld.ismastersim
	GLOBAL.TheWorld.ismastersim = true
	local entity = GLOBAL.SpawnPrefab(prefab)
	local result = fn(entity)
	entity:Remove()
	GLOBAL.TheWorld.ismastersim = isMasterSim
	return result
end

---@param fn fun(item: ds.entity)
local function ForEachItemInInventory(fn)
	for _, item in pairs(GLOBAL.ThePlayer.replica.inventory:GetItems()) do
		fn(item)
	end

	for _, item in pairs(GLOBAL.ThePlayer.replica.inventory:GetEquips()) do
		fn(item)
	end

	local activeitem = GLOBAL.ThePlayer.replica.inventory:GetActiveItem()
	if activeitem then
		fn(activeitem)
	end

	-- TODO backpack items

	-- local backpack = ThePlayer.replica.inventory:GetOverflowContainer()
	-- local backpackItems = backpack and backpack.inst.replica.container and backpack.inst.replica.container:GetItems()
	-- 	or {}
end

---@param comp fun(item: ds.entity): number | nil
---@return (nil | ds.entity)
local function GetBestItemInInventory(comp)
	local bestValue = 0
	local bestItem = nil
	ForEachItemInInventory(function(item)
		local currentValue = comp(item)
		if currentValue ~= nil and currentValue > bestValue then
			bestValue = currentValue
			bestItem = item
		end
	end)
	return bestItem
end

AddComponentPostInit("playercontroller", function()
	local keys = {
		{
			key = "k",
			---@param item ds.entity
			comparator = function(item)
				return WithMastersimPrefab(item.prefab, function(mastersimItem)
					return mastersimItem.components.tool
						and mastersimItem.components.tool:GetEffectiveness(GLOBAL.ACTIONS.CHOP)
				end)
			end,
		},
	}

	for _, action in ipairs(keys) do
		GLOBAL.TheInput:AddKeyUpHandler(string.byte(action.key), function()
			local item = GetBestItemInInventory(action.comparator)
			if item == nil or not item.replica.equippable then
				return
			end
			GLOBAL.ThePlayer.replica.inventory:UseItemFromInvTile(item)
		end)
	end
end)
