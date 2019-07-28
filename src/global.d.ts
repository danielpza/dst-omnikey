/** @noSelfInFile **/
type Slot = "head" | "body" | "hands";

type List<T> = Record<any, T> | T[];

type ComponentBundle<T extends keyof Component> = { [K in T]: Component[K] } &
  { [K in Exclude<keyof Component, T>]?: Component[K] };
declare namespace Component {
  interface Edible {
    healthvalue: number;
    hungervalue: number;
    sanityvalue: number;
    ismeat: boolean;
    foodtype: any;
  }
  interface Armor {
    condition: number;
    absorb_percent: number;
  }
  interface Finiteuses {
    current: number;
    total: number;
    consumption: { [K in string]: number };
  }
  interface Tool {
    CanDoAction(action: any): boolean;
  }
  interface Weapon {
    damage: number;
  }
  interface Equippable {
    equipslot: any;
  }
  interface Healer {
    health: number;
  }
  interface Inventory {
    GetEquippedItem: (slot: Slot) => Prefab | undefined;
    UseItemFromInvTile: (item: Prefab) => any;
    GetEquips: () => List<Prefab | undefined>;
    GetItems: () => List<Prefab | undefined>;
    GetActiveItem: () => Prefab | undefined;
    GetOverflowContainer: () => { inst: Prefab } | undefined;
  }
  interface Container {
    GetItems: () => List<Prefab | undefined>;
  }
}
interface Component {
  edible: Component.Edible;
  armor: Component.Armor;
  finiteuses: Component.Finiteuses;
  tool: Component.Tool;
  weapon: Component.Weapon;
  equippable: Component.Equippable;
  healer: Component.Healer;
  inventory: Component.Inventory;
  container: Component.Container;
}

interface PrefabBase {
  prefab: string;
  DoTaskInTime: (time: number, fn: (this: void) => void) => void;
  ClearBufferedAction(): void;
  ListenForEvent: (
    ev: string,
    fn: (this: void, inst: any, data: any) => void
  ) => void;
  Remove(): void;
}

interface Prefab<T extends keyof Component = never> extends PrefabBase {
  components: ComponentBundle<T>;
  replica: ComponentBundle<T>;
}

interface Player extends Prefab<"inventory"> {}

declare namespace Module {
  /** @customConstructor GLOBAL.require("widget/widget") */
  class Widget {}
  /** @customConstructor GLOBAL.require("widget/image") */
  class Image {
    constructor(atlas: string, image: string);
  }
  /** @customConstructor GLOBAL.require("widget/imagebutton") */
  class ImageButton extends Button {
    constructor(
      image?: string,
      normal?: string,
      forcus?: string,
      disabled?: string,
      disabled2?: string,
      disabled3?: string
    );
  }
  /** @customConstructor GLOBAL.require("widget/button") */
  class Button extends Widget {}
}

declare namespace GLOBAL {
  const TheWorld: {
    ismastersim: any;
  };
  const ThePlayer: Player;
  const TheFrontEnd: {
    GetActiveScreen: () => any;
  };
  const TheInput: {
    AddKeyUpHandler: (keycode: number, cb: () => void) => any;
  };
  function IsPaused(): boolean;
  function require(mod: string): void;
  function SpawnPrefab(prefab: string): Prefab;
  enum ACTIONS {
    CHOP,
    MINE,
    DIG
  }
  enum EQUIPSLOTS {
    HEAD,
    BODY
  }
  enum FOODTYPE {
    MEAT,
    VEGGIE,
    HORRIBLE,
    RAW,
    ELEMENTAL,
    ROUGHAGE
  }
}
declare let print: (data: string) => void;
declare let GetModConfigData: (key: string) => any;
declare let AddPlayerPostInit: (cb: (inst: Player) => void) => void;
declare function AddComponentPostInit<T extends keyof Component>(
  kind: T,
  cb: (comp: Component[T]) => void
): void;
