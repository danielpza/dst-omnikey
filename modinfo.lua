---@diagnostic disable:lowercase-global
name = "Omnikey"
description = "Add some extra keybindings to select best weapon from inventory, armor, etc"
author = "danielpza"
version = "2.0.0"

-- icon_atlas = "icon_atlas.xml"
-- icon = "icon.tex"

api_version = 10

dont_starve_compatible = false
dst_compatible = true

all_clients_require_mod = false
client_only_mod = true

-- ---@class Option
-- ---@field description string
-- ---@field data any

-- ---@param result Option[]
-- ---@param from string
-- ---@param to string
-- local function generateKeys(result, from, to)
-- 	for i = string.byte(string.lower(from)), string.byte(string.lower(to)), 1 do
-- 		result[#result + 1] = { description = string.upper(string.char(i)), data = i }
-- 	end
-- end

configuration_options = {}
