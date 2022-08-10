let name = "OmniKey";
let version = "$VERSION";
let description = "$DESCRIPTION\n\n$HOMEPAGE";
let author = "Daniel Perez Alvarez";

let api_version = 10;

let dont_starve_compatible = false;
let reign_of_giants_compatible = false;
let all_clients_require_mod = false;
let dst_compatible = true;
let client_only_mod = true;

let icon = "modicon.tex";
let icon_atlas = "modicon.xml";
string = "";

let keyslist: { description: string; data: string }[] = [];
let priority = 0;

let keys = [] as any[];
generateKeys(keys, "0", "9");
generateKeys(keys, "a", "z");

const boolOptions = [
  { description: "No", data: false },
  { description: "Yes", data: true },
];

let configuration_options: {
  name: string;
  default?: any;
  options: { description: string; data: any }[];
  label: string;
  hover?: string;
}[] = [
  BooleanOption("USE_HAMBAT", true, "Use hambat", "Prioritize hambat when choosing best weapon"),
  BooleanOption("SHOW_EQUIP", false, "Show equipment buttons"),
  Keybind("WEAPON", "g", "Weapon Key"),
  Keybind("LIGHT", "t", "Light"),
  Keybind("ARMOR", "c", "Armor"),
  Keybind("HELMET", "v", "Helmet"),
  BooleanOption("WORK_FAST", false, "Work fast?", "Faster chop, mine, etc, ie hacky mode"),
  BooleanOption("SHOW_BUTTONS", true, "Show buttons"),
  BooleanOption("BIND_KEYS", true, "Add keybindings"),
  BooleanOption("SHOW_KEYBINDING", true, "Show keys"),
  Keybind("PICK", "k", "Pick (harvest) key", 'Must enable "Add keybindings" options to work'),
  Keybind("PICKUP", "l", "Pick up key", 'Must enable "Add keybindings" options to work'),
  Keybind("CHOP", "j", "Chop key", 'Must enable "Add keybindings" options to work'),
  Keybind("MINE", "o", "Mine key", 'Must enable "Add keybindings" options to work'),
];

declare var string: string; // HACK for generating keys
function generateKeys(result: { description: string; data: number }[], from: string, to: string) {
  const s = from.charCodeAt(0);
  const e = to.charCodeAt(0);
  for (let i = s; i <= e; i++) {
    const key = String.fromCharCode(i);
    result[result.length] = { description: key, data: i };
  }
}

function BooleanOption(name: string, def: boolean, label: string, hover?: string) {
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
