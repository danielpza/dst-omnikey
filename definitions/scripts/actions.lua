---@meta

---@class Action
---@overload fun(data: any): Action
Action = {
	instant = false,
	rmb = false,
	canforce = false,
	distance = 0,
}

ACTIONS = {
	REPAIR = Action(),
	READ = Action(),
	DROP = Action(),
	TRAVEL = Action(),
	CHOP = Action(),
	ATTACK = Action(),
	EAT = Action(),
	PICK = Action(),
	PICKUP = Action(),
	MINE = Action(),
	DIG = Action(),
	GIVE = Action(),
	GIVETOPLAYER = Action(),
	GIVEALLTOPLAYER = Action(),
	FEEDPLAYER = Action(),
	DECORATEVASE = Action(),
	COOK = Action(),
	FILL = Action(),
	FILL_OCEAN = Action(),
	DRY = Action(),
	ADDFUEL = Action(),
	ADDWETFUEL = Action(),
	LIGHT = Action(),
	EXTINGUISH = Action(),
	LOOKAT = Action(),
	TALKTO = Action(),
	WALKTO = Action(),
	INTERACT_WITH = Action(),
	BAIT = Action(),
	CHECKTRAP = Action(),
	BUILD = Action(),
	PLANT = Action(),
	HARVEST = Action(),
	GOHOME = Action(),
	SLEEPIN = Action(),
	CHANGEIN = Action(),
	HITCHUP = Action(),
	MARK = Action(),
	UNHITCH = Action(),
	HITCH = Action(),
	EQUIP = Action(),
	UNEQUIP = Action(),
	--OPEN_SHOP = Action(),
	SHAVE = Action(),
	STORE = Action(),
	RUMMAGE = Action(),
	DEPLOY = Action(),
	DEPLOY_TILEARRIVE = Action(), -- Note: If this is used for non-farming in the future, this would need to be swapped to theme_music_fn
	PLAY = Action(),
	CREATE = Action(),
	JOIN = Action(),
	NET = Action(),
	CATCH = Action(),
	FISH_OCEAN = Action(),
	FISH = Action(),
	REEL = Action(),
	OCEAN_FISHING_POND = Action(),
	OCEAN_FISHING_CAST = Action(),
	OCEAN_FISHING_REEL = Action(),
	OCEAN_FISHING_STOP = Action(),
	OCEAN_FISHING_CATCH = Action(),
	CHANGE_TACKLE = Action(), -- this is now a generic "put item into the container of the equipped hand item"
	POLLINATE = Action(),
	FERTILIZE = Action(),
	SMOTHER = Action(),
	MANUALEXTINGUISH = Action(),
	LAYEGG = Action(),
	HAMMER = Action(),
	TERRAFORM = Action(),
	JUMPIN = Action(),
	TELEPORT = Action(),
	RESETMINE = Action(),
	ACTIVATE = Action(),
	OPEN_CRAFTING = Action(),
	MURDER = Action(),
	HEAL = Action(),
	INVESTIGATE = Action(),
	UNLOCK = Action(),
	USEKLAUSSACKKEY = Action(),
	TEACH = Action(),
	TURNON = Action(),
	TURNOFF = Action(),
	SEW = Action(),
	STEAL = Action(),
	USEITEM = Action(),
	USEITEMON = Action(),
	STOPUSINGITEM = Action(),
	TAKEITEM = Action(),
	MAKEBALLOON = Action(),
	CASTSPELL = Action(),
	CAST_POCKETWATCH = Action(), -- to actually use the mounted action, the pocket watch will need the pocketwatch_mountedcast tag
	BLINK = Action(),
	BLINK_MAP = Action(),
	COMBINESTACK = Action(),
	TOGGLE_DEPLOY_MODE = Action(),
	SUMMONGUARDIAN = Action(),
	HAUNT = Action(),
	UNPIN = Action(),
	STEALMOLEBAIT = Action(),
	MAKEMOLEHILL = Action(),
	MOLEPEEK = Action(),
	FEED = Action(),
	UPGRADE = Action(),
	HAIRBALL = Action(),
	CATPLAYGROUND = Action(),
	CATPLAYAIR = Action(),
	FAN = Action(),
	DRAW = Action(),
	BUNDLE = Action(),
	BUNDLESTORE = Action(),
	WRAPBUNDLE = Action(),
	UNWRAP = Action(),
	BREAK = Action(),
	CONSTRUCT = Action(),
	STOPCONSTRUCTION = Action(),
	APPLYCONSTRUCTION = Action(),
	STARTCHANNELING = Action(), -- Keep higher priority over smother for waterpump but do something else if channelable is added to more things.
	STOPCHANNELING = Action(),
	APPLYPRESERVATIVE = Action(),
	COMPARE_WEIGHABLE = Action(),
	WEIGH_ITEM = Action(),
	START_CARRAT_RACE = Action(),
	CASTSUMMON = Action(),
	CASTUNSUMMON = Action(),
	COMMUNEWITHSUMMONED = Action(),
	TELLSTORY = Action(),

	TOSS = Action(),
	NUZZLE = Action(),
	WRITE = Action(),
	ATTUNE = Action(),
	REMOTERESURRECT = Action(),
	REVIVE_CORPSE = Action(),
	MIGRATE = Action(),
	MOUNT = Action(),
	DISMOUNT = Action(),
	SADDLE = Action(),
	UNSADDLE = Action(),
	BRUSH = Action(),
	ABANDON = Action(),
	PET = Action(),
	DISMANTLE = Action(),
	TACKLE = Action(),
	GIVE_TACKLESKETCH = Action(),
	REMOVE_FROM_TROPHYSCALE = Action(),
	CYCLE = Action(),

	CASTAOE = Action(),

	HALLOWEENMOONMUTATE = Action(),

	WINTERSFEAST_FEAST = Action(),

	BEGIN_QUEST = Action(),
	ABANDON_QUEST = Action(),

	SING = Action(),
	SING_FAIL = Action(),

	--Quagmire
	TILL = Action(),
	PLANTSOIL = Action(),
	INSTALL = Action(),
	TAPTREE = Action(),
	SLAUGHTER = Action(),
	REPLATE = Action(),
	SALT = Action(),

	BATHBOMB = Action(),

	COMMENT = Action(),
	WATER_TOSS = Action(),

	-- boats
	RAISE_SAIL = Action(),
	LOWER_SAIL = Action(),
	LOWER_SAIL_BOOST = Action(),
	LOWER_SAIL_FAIL = Action(),
	RAISE_ANCHOR = Action(),
	LOWER_ANCHOR = Action(),
	EXTEND_PLANK = Action(),
	RETRACT_PLANK = Action(),
	ABANDON_SHIP = Action(),
	MOUNT_PLANK = Action(),
	DISMOUNT_PLANK = Action(),
	REPAIR_LEAK = Action(),
	STEER_BOAT = Action(),
	SET_HEADING = Action(),
	STOP_STEERING_BOAT = Action(),
	CAST_NET = Action(),
	ROW_FAIL = Action(),
	ROW = Action(),
	ROW_CONTROLLER = Action(),
	BOARDPLATFORM = Action(),
	OCEAN_TOSS = Action(),
	UNPATCH = Action(),
	POUR_WATER = Action(),
	POUR_WATER_GROUNDTILE = Action(),
	PLANTREGISTRY_RESEARCH_FAIL = Action(),
	PLANTREGISTRY_RESEARCH = Action(),
	ASSESSPLANTHAPPINESS = Action(),
	ATTACKPLANT = Action(),
	PLANTWEED = Action(),
	ADDCOMPOSTABLE = Action(),
	WAX = Action(),
	APPRAISE = Action(),
	UNLOAD_WINCH = Action(),
	USE_HEAVY_OBSTACLE = Action(),
	ADVANCE_TREE_GROWTH = Action(),

	ROTATE_BOAT_CLOCKWISE = Action(),
	ROTATE_BOAT_COUNTERCLOCKWISE = Action(),
	ROTATE_BOAT_STOP = Action(),

	BOAT_MAGNET_ACTIVATE = Action(),
	BOAT_MAGNET_DEACTIVATE = Action(),
	BOAT_MAGNET_BEACON_TURN_ON = Action(),
	BOAT_MAGNET_BEACON_TURN_OFF = Action(),

	BOAT_CANNON_LOAD_AMMO = Action(),
	BOAT_CANNON_START_AIMING = Action(),
	BOAT_CANNON_SHOOT = Action(),
	BOAT_CANNON_STOP_AIMING = Action(),

	OCEAN_TRAWLER_LOWER = Action(),
	OCEAN_TRAWLER_RAISE = Action(),
	OCEAN_TRAWLER_FIX = Action(),

	EMPTY_CONTAINER = Action(),

	CARNIVAL_HOST_SUMMON = Action(),

	-- YOTB
	YOTB_SEW = Action(),
	YOTB_STARTCONTEST = Action(),
	YOTB_UNLOCKSKIN = Action(),

	CARNIVALGAME_FEED = Action(),

	-- YOT_Catcoon
	RETURN_FOLLOWER = Action(),
	HIDEANSEEK_FIND = Action(),

	-- WEBBER
	MUTATE_SPIDER = Action(),
	HERD_FOLLOWERS = Action(),
	REPEL = Action(),
	BEDAZZLE = Action(),

	-- WANDA
	DISMANTLE_POCKETWATCH = Action(),

	-- WOLFGANG
	LIFT_DUMBBELL = Action(), -- Higher than TOSS

	STOP_LIFT_DUMBBELL = Action(),
	ENTER_GYM = Action(),
	UNLOAD_GYM = Action(),

	-- Minigame actions:
	LEAVE_GYM = Action(),
	LIFT_GYM_SUCCEED_PERFECT = Action(),
	LIFT_GYM_SUCCEED = Action(),
	LIFT_GYM_FAIL = Action(),

	-- WX78
	APPLYMODULE = Action(),
	APPLYMODULE_FAIL = Action(),
	REMOVEMODULES = Action(),
	REMOVEMODULES_FAIL = Action(),
	CHARGE_FROM = Action(),

	ROTATE_FENCE = Action(),
}
