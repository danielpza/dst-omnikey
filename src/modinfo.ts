/** @noSelfInFile **/
var name = "OmniKey";
var version = "$VERSION";
var description = "$DESCRIPTION\n\n$HOMEPAGE";
var author = "Daniel Perez Alvarez";

var api_version = 10;

var dont_starve_compatible = false;
var reign_of_giants_compatible = false;
var all_clients_require_mod = false;
var dst_compatible = true;
var client_only_mod = true;
var keyslist: { description: string; data: string }[] = [];
var priority = 0;

var icon = "modicon.tex";
var icon_atlas = "modicon.xml";
string = "";

let keys = [] as any[];
generateKeys(keys, "0", "9");
generateKeys(keys, "a", "z");

const boolOptions = [
  { description: "No", data: false },
  { description: "Yes", data: true },
];

var configuration_options = [
  BooleanOption(
    "USE_HAMBAT",
    true,
    "Use hambat",
    "Prioritize hambat when choosing best weapon"
  ),
  BooleanOption("SHOW_EQUIP", false, "Show equipment buttons"),
  Keybind("WEAPON", "g", "Weapon Key"),
  Keybind("LIGHT", "t", "Light"),
  Keybind("ARMOR", "c", "Armor"),
  Keybind("HELMET", "v", "Helmet"),
  BooleanOption(
    "WORK_FAST",
    false,
    "Work fast?",
    "Faster chop, mine, etc, ie hacky mode"
  ),
  BooleanOption("SHOW_BUTTONS", true, "Show buttons"),
  BooleanOption("BIND_KEYS", true, "Add keybindings"),
  BooleanOption("SHOW_KEYBINDING", true, "Show keys"),
  Keybind(
    "PICK",
    "k",
    "Pick (harvest) key",
    'Must enable "Add keybindings" options to work'
  ),
  Keybind(
    "PICKUP",
    "l",
    "Pick up key",
    'Must enable "Add keybindings" options to work'
  ),
  Keybind(
    "CHOP",
    "j",
    "Chop key",
    'Must enable "Add keybindings" options to work'
  ),
  Keybind(
    "MINE",
    "o",
    "Mine key",
    'Must enable "Add keybindings" options to work'
  ),
];

declare var string: string;
function generateKeys(
  result: { description: string; data: number }[],
  from: string,
  to: string
) {
  const s = from.charCodeAt(0);
  const e = to.charCodeAt(0);
  for (let i = s; i <= e; i++) {
    const key = String.fromCharCode(i);
    result[result.length] = { description: key, data: i };
  }
}

function BooleanOption(
  name: string,
  def: boolean,
  label: string,
  hover?: string
) {
  return { name, default: def, options: boolOptions, label, hover };
}

function Keybind(name: string, def: string, label: string, hover?: string) {
  return {
    name,
    label,
    default: def.charCodeAt(0),
    options: keys,
    hover,
  };
}
