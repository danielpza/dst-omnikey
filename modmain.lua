-- for debugging
GLOBAL.CHEATS_ENABLED = true
GLOBAL.require("debugkeys")
--

---@generic T
---@param prefab string
---@param fn fun(item: Entity): T
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

---@param fn fun(item: Entity)
local function ForEachItemInInventory(fn)
	local items = GLOBAL.ThePlayer.replica.inventory:GetItems()
	-- local equips = ThePlayer.replica.inventory:GetEquips()
	-- local activeItem = ThePlayer.replica.inventory:GetActiveItem()
	-- local equippedItems = {
	-- 	ThePlayer.replica.inventory:GetEquippedItem(EQUIPSLOTS.BODY),
	-- 	ThePlayer.replica.inventory:GetEquippedItem(EQUIPSLOTS.HANDS),
	-- 	ThePlayer.replica.inventory:GetEquippedItem(EQUIPSLOTS.HEAD),
	-- }
	-- local backpack = ThePlayer.replica.inventory:GetOverflowContainer()
	-- local backpackItems = backpack and backpack.inst.replica.container and backpack.inst.replica.container:GetItems()
	-- 	or {}

	for _, item in pairs(items) do
		fn(item)
	end
end

---@param comp fun(item: Entity): number | nil
---@return (nil | Entity)
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
			---@param item Entity
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
