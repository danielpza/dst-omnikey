local exports = {}

local function valueByUsage(item)
	return item.components.finiteuses ~= nil
			and item.components.finiteuses.total * 10 - item.components.finiteuses.current
		or 0
end

local function valueByDapperness(item)
	if not item.components.equippable then
		return 0
	end
	return item.components.equippable.dapperness or 0
end

local function valueByInsulation(item)
	if not item.components.insulator then
		return 0
	end
	return item.components.insulator.insulation or 0
end

local function canBeEquipped(item, slot)
	return item.components.equippable and item.components.equippable.equipslot == slot
end

local function valueByDamage(item)
	return item.components.weapon and item.components.weapon.damage * 100 + valueByUsage(item) or 0
end

local function valueByConsumption(item, action)
	return item.components.finiteuses ~= nil and 1 / item.components.finiteuses.consumption[action] or 100
end

local function valueByArmor(item)
	return item.components.armor and item.components.armor.absorb_percent * 100000 - item.components.armor.condition
		or 0
end

local function valueByToolAction(item, action)
	return item.components.tool
			and item.components.tool.actions[action]
			and valueByConsumption(item, action) * 1000 + valueByUsage(item)
		or 0
end

---@param item ds.entity
---@param slot ds.equipslot
local function valueByClothEquipSlot(item, slot)
	return canBeEquipped(item, slot) and valueByInsulation(item) + valueByDapperness(item) / 10 or 0
end

---@param item ds.entity
---@param slot ds.equipslot
local function valueByArmorEquipSlot(item, slot)
	return canBeEquipped(item, slot) and valueByArmor(item) + valueByClothEquipSlot(item, slot) or 0
end

---@param action ds.action
function exports.toolValue(action)
	---@param item ds.entity
	return function(item)
		return valueByToolAction(item, action)
	end
end

---@param item ds.entity
function exports.weaponValue(item)
	return valueByDamage(item)
end

---@param slot ds.equipslot
function exports.clothValue(slot)
	---@param item ds.entity
	return function(item)
		return valueByClothEquipSlot(item, slot)
	end
end

---@param slot ds.equipslot
function exports.armorValue(slot)
	---@param item ds.entity
	return function(item)
		return valueByArmorEquipSlot(item, slot)
	end
end

---@param item ds.entity
function exports.lightValue(item)
	for i, v in ipairs({
		"torch",
		"lighter",
		"tarlamp",
		"minerhat",
		"lantern",
		"bottlelantern",
		"molehat",
		"gears_hat_goggles",
	}) do
		if item.prefab == v then
			return 1 / i
		end
	end
	return 0
end

---@param item ds.entity
function exports.caneValue(item)
	return item.components.equippable
			and item.components.equippable.walkspeedmult
			and item.components.equippable.walkspeedmult > 1
			and item.components.equippable.walkspeedmult
		or 0
end

---@param item ds.entity
function exports.weaponValuePrioritizeHambat(item)
	return item.prefab == "hambat" and 10000 or exports.weaponValue(item)
end

return exports
