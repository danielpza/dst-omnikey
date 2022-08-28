-- for debugging
GLOBAL.CHEATS_ENABLED = true
GLOBAL.require("debugkeys")
--

---@module 'scripts.omnikey.values'
local values = require("omnikey/values")

local EQUIP_KEYS = {
	{
		key = GetModConfigData("WEAPON"),
		comparator = values.weaponValue,
	},
	{
		key = GetModConfigData("LIGHT"),
		comparator = values.lightValue,
	},
	{
		key = GetModConfigData("ARMOR"),
		comparator = values.armorValue(GLOBAL.EQUIPSLOTS.BODY),
	},
	{
		key = GetModConfigData("HELMET"),
		comparator = values.armorValue(GLOBAL.EQUIPSLOTS.HEAD),
	},
}

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

---@param fn fun(item: ds.entity): number
local function useMastersimPrefab(fn)
	---@param item ds.entity
	return function(item)
		return WithMastersimPrefab(item.prefab, fn)
	end
end

---@param comparator fun(item: ds.entity): number|nil
local function EquipUnequipItem(comparator)
	local item = GetBestItemInInventory(useMastersimPrefab(comparator))
	if item == nil or not item.replica.equippable then
		return
	end
	if item.replica.equippable:IsEquipped() then
		local equipslot = item.replica.equippable:EquipSlot()
		if equipslot == GLOBAL.EQUIPSLOTS.HANDS then
			local cane = GetBestItemInInventory(useMastersimPrefab(values.caneValue))
			if cane then
				GLOBAL.ThePlayer.replica.inventory:UseItemFromInvTile(cane)
			else
				GLOBAL.ThePlayer.replica.inventory:UseItemFromInvTile(item)
			end
		else
			local clothEquip = GetBestItemInInventory(useMastersimPrefab(values.clothValue(equipslot)))
			if clothEquip then
				GLOBAL.ThePlayer.replica.inventory:UseItemFromInvTile(clothEquip)
			else
				GLOBAL.ThePlayer.replica.inventory:UseItemFromInvTile(item)
			end
		end
	else
		GLOBAL.ThePlayer.replica.inventory:UseItemFromInvTile(item)
	end
end

AddComponentPostInit("playercontroller", function()
	for _, action in ipairs(EQUIP_KEYS) do
		GLOBAL.TheInput:AddKeyUpHandler(action.key, function()
			EquipUnequipItem(action.comparator)
		end)
	end
end)
