-- for debugging
-- GLOBAL.CHEATS_ENABLED = true
-- GLOBAL.require("debugkeys")
--

local Widget = require("widgets/widget")

local values = require("omnikey/values")
local OmnikeyWidgets = require("omnikey/widgets")

local DEFAULT_IMAGE = "cutgrass"

local CONFIG_BIND_KEYS = GetModConfigData("BIND_KEYS")
local CONFIG_SHOW_KEYBINDING = GetModConfigData("SHOW_KEYBINDING")
local CONFIG_USE_HAMBAT = GetModConfigData("USE_HAMBAT")
local CONFIG_SHOW_EQUIP = GetModConfigData("SHOW_EQUIP")

local weaponComparator = CONFIG_USE_HAMBAT and values.weaponValuePrioritizeHambat or values.weaponValue

local EQUIP_KEYS = {
   {
      key = GetModConfigData("WEAPON"),
      comparator = function(item)
         return GLOBAL.ThePlayer:HasTag("slingshot_sharpshooter") and item:HasTag("slingshot") and 1000
            or weaponComparator(item)
      end,
      image = "spear",
   },
   {
      key = GetModConfigData("HELMET"),
      comparator = values.armorValue(GLOBAL.EQUIPSLOTS.HEAD),
      image = "footballhat",
   },
   {
      key = GetModConfigData("ARMOR"),
      comparator = values.armorValue(GLOBAL.EQUIPSLOTS.BODY),
      image = "armorwood",
   },
   {
      key = GetModConfigData("LIGHT"),
      comparator = values.lightValue,
      image = "torch",
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

   local backpack = GLOBAL.ThePlayer.replica.inventory:GetOverflowContainer()
   if backpack and backpack.inst.replica.container then
      for _, item in pairs(backpack.inst.replica.container:GetItems()) do
         fn(item)
      end
   end
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

---@param self ds.widgets.inventorybar
AddClassPostConstruct("widgets/inventorybar", function(self)
   local inventorybar = self

   local root = Widget("omnikkey_root")

   for index, action in ipairs(EQUIP_KEYS) do
      local function doit()
         EquipUnequipItem(action.comparator)
      end

      if CONFIG_BIND_KEYS then
         GLOBAL.TheInput:AddKeyUpHandler(action.key, doit)
      end

      if CONFIG_SHOW_EQUIP then
         root:AddChild(
            OmnikeyWidgets.InventoryButton(
               action.image or DEFAULT_IMAGE,
               CONFIG_SHOW_KEYBINDING and string.upper(string.char(action.key)) or nil,
               doit,
               index - 1
            )
         )
      end
   end

   if CONFIG_SHOW_EQUIP then
      local X_OFFSET = -750
      local Y_OFFSET = 160
      local INTEGRATED_BACKPACK_OFFSET = 74

      root:SetPosition(X_OFFSET, Y_OFFSET, 0)
      root:MoveToBack()
      inventorybar:AddChild(root)

      local Refresh = inventorybar.Refresh
      inventorybar.Refresh = function(self)
         -- monkey patch the Refresh function to update the position when a backpack is added in integrated mode
         Refresh(self)

         -- code taken directly from dst scripts
         local inventory = self.owner.replica.inventory
         local overflow = inventory and inventory:GetOverflowContainer()
         overflow = (overflow ~= nil and overflow:IsOpenedBy(self.owner)) and overflow or nil
         local do_integrated_backpack = overflow ~= nil and self.integrated_backpack
         ---

         root:SetPosition(X_OFFSET, Y_OFFSET + (do_integrated_backpack and INTEGRATED_BACKPACK_OFFSET or 0), 0)
      end
   end
end)
