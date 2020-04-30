/** @noSelfInFile **/
var name = "OmniKey";
var version = "$VERSION";
var description = "$DESCRIPTION\n\n$HOMEPAGE";
var author = "Daniel Perez Alvarez";

var api_version = 10;

var dont_starve_compatible = true;
var reign_of_giants_compatible = true;
var all_clients_require_mod = false;
var dst_compatible = true;
var client_only_mod = true;
var keyslist: { description: string; data: string }[] = [];

string = "";

let keys = [] as any[];
generateKeys(keys, "0", "9");
generateKeys(keys, "a", "z");

var configuration_options = [
  Keybind("WEAPON", "g", "Weapon Key"),
  Keybind("LIGHT", "t", "Light"),
  Keybind("ARMOR", "c", "Armor"),
  Keybind("HELMET", "v", "Helmet"),
  Keybind("PICK", "k", "Pick (harvest) key"),
  Keybind("PICKUP", "l", "Pick up key"),
  Keybind("CHOP", "j", "Chop key"),
  Keybind("MINE", "o", "Mine key")
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

function Keybind(name: string, def: string, label: string) {
  return { name, label, default: def.charCodeAt(0), options: keys };
}
