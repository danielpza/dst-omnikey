---@diagnostic disable:lowercase-global

local keys, dividers, boolOptions

local function GenerateOptions()
	keys = {}
	string = ""

	for i = string.byte("0"), string.byte("9") do
		keys[#keys + 1] = { description = string.upper(string.char(i)), data = i }
	end
	for i = string.byte("a"), string.byte("z") do
		keys[#keys + 1] = { description = string.upper(string.char(i)), data = i }
	end

	dividers = 0

	boolOptions = { { description = "No", data = false }, { description = "Yes", data = true } }
end

local function BooleanOption(name, def, label, hover)
	return { name = name, default = def, options = boolOptions, label = label, hover = hover }
end

local function Keybind(name, def, label, hover)
	return { name = name, label = label, default = string.byte(def), options = keys, hover = hover }
end

local function Title(title, hover)
	-- https://dst-api-docs.fandom.com/wiki/Modinfo.lua#How_to_make_title_in_options:
	dividers = dividers + 1
	return {
		name = "__" .. string.format("%d", dividers) .. "title",
		label = title,
		hover = hover,
		options = { { description = "", data = false } }, -- A list of one item - boolean option without a description
		default = false,
	}
end

name = "Omnikey"
description = "Add some extra keybindings to select best weapon from inventory, armor, etc"
author = "danielpza"
version = "0.9.0"

-- icon_atlas = "icon_atlas.xml"
-- icon = "icon.tex"

api_version = 10

dont_starve_compatible = false
dst_compatible = true

all_clients_require_mod = false
client_only_mod = true

GenerateOptions()

configuration_options = {
	Title("Options"),
	-- BooleanOption("BIND_KEYS", true, "Add keybindings"),
	-- BooleanOption("SHOW_BUTTONS", true, "Show buttons"),
	-- BooleanOption("SHOW_KEYBINDING", true, "Show keys in the buttons"),
	BooleanOption("USE_HAMBAT", true, "Prioritize hambat", "Prioritize hambat when choosing best weapon"),
	-- BooleanOption("SHOW_EQUIP", false, "Show equipment buttons"),
	Title("Item keybindings"),
	Keybind("WEAPON", "g", "Weapon"),
	Keybind("LIGHT", "t", "Light"),
	Keybind("ARMOR", "c", "Armor"),
	Keybind("HELMET", "v", "Helmet"),
	-- BooleanOption("WORK_FAST", false, "Work fast?", "Faster chop, mine, etc, ie hacky mode"),
	-- Keybind("PICK", "k", "Pick (harvest) key", 'Must enable "Add keybindings" options to work'),
	-- Keybind("PICKUP", "l", "Pick up key", 'Must enable "Add keybindings" options to work'),
	-- Keybind("CHOP", "j", "Chop key", 'Must enable "Add keybindings" options to work'),
	-- Keybind("MINE", "o", "Mine key", 'Must enable "Add keybindings" options to work'),
}
