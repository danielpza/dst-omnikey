# OmniKey

A Don't Starve Together Mod. Add keybindings to use with tools, weapons, armor and much more.
Now including automatic actions like picking up items from the ground, harvesting, choping and mining.

# Usage

Keybindings can be changed in the configuration:

| Default Key |                    Function |
| :---------- | --------------------------: |
| G           | Equip best weapon by damage |
| C           |            Equip best armor |
| V           |           Equip best helmet |
| L           |         Start picking items |
| K           |            Start harvesting |
| J           |           Starting chopping |
| O           |                Start mining |

Also when unequiping the hand slot using the keybindings it automatically equips
a cane if available, as well as insulating/dapper cloth for the body and head.

## Installing

Download latest release from [github](https://github.com/danielpza/dst-omnikey/releases/)

## Building

```sh
$ npm run build
```

## Contributting

Install nodejs and npm:

```sh
$ npm install
$ ln -sr lib /path/to/dst/mods/folder # make link to mods folder
$ npm run dev
```
