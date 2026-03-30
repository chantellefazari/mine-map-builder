/**
 * Category Classification Utility
 *
 * Auto-classifies spare parts into categories based on description keywords.
 * Categories are aligned 1:1 with the Site Parts Numbering Standard (TCMG)
 * and the live site_spares database category values.
 *
 * FALLBACK: Items that don't match any keyword list default to "Consumables".
 */

export type SpareCategory =
  | "Pump Component"              // CC 01
  | "Motor Component"             // CC 02
  | "Gearbox"                     // CC 03
  | "Bearing"                     // CC 04
  | "Valve"                       // CC 05
  | "Instrumentation"             // CC 06
  | "Electrical"                  // CC 07
  | "Conveyor Component"          // CC 08
  | "Wear Parts"                  // CC 09
  | "Mechanical"                  // CC 10
  | "Structural Steel"            // CC 23
  | "Pipe Fitting"                // CC 11
  | "Seal"                        // CC 12
  | "Filter"                      // CC 13
  | "Lubrication System"          // CC 14
  | "Air & Pneumatic"             // CC 15
  | "Tanks & Vessels"             // CC 16
  | "Safety Equipment"            // CC 17
  | "Power Generation"            // CC 18
  | "Tooling"                     // CC 19
  | "Rigging"                     // CC 19 (sub-category)
  | "PPE"                         // CC 19 (sub-category)
  | "OEM Assembly"                // CC 20
  | "Fastener"                    // CC 21
  | "Consumables";                // CC 22 (also the fallback)

// Category keyword mappings - checked in priority order
const CATEGORY_KEYWORDS: Record<SpareCategory, string[]> = {
  // CC 21 – Fastener
  "Fastener": [
    "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor", "rivet",
    "hex bolt", "cap screw", "set screw", "lock nut", "nyloc", "spring washer",
    "hex nut", "zinc plated", "gr8", "grade 8", "asme b18",
  ],

  // CC 11 – Pipe Fitting
  "Pipe Fitting": [
    "nipple", "elbow", "tee", "reducer", "union", "flange", "blind flange",
    "pipe fitting", "threaded", "bsp", "npt", "coupler", "coupling fitting",
    "compression fitting", "electrofusion", "stub flange", "poly nipple",
    "reducing bush", "reducing nipple", "hex reducing", "pipe clamp",
    "female tee", "male tee", "socket", "street elbow", "cap fitting",
    "hdpe pipe", "pvc pipe", "poly pipe", "pipe coupling",
    "hose", "tubing", "flexible hose", "hydraulic hose", "air hose", "nylon tubing",
    "drag hose", "tpr hose", "pvc hose", "hose coupling", "claw coupling",
    "camlock", "hosetail", "hose assembly", "suction hose", "delivery hose",
    "plasson", "saddle", "backing ring", "pe100 pipe", "pipe spool",
    "rapid clamp", "repair clamp", "pinchweld", "poly saddle",
  ],

  // CC 10 (sub-category) – Structural Steel
  "Structural Steel": [
    "shs", "rhs", "square hollow section", "rectangular hollow section",
    "c-channel", "c channel", "channel beam", "channel steel",
    "equal angle", "angle iron", "flat bar", "steel plate",
    "star picket", "bollard", "stay bracket", "universal beam", "i-beam",
    "structural steel",
  ],

  // CC 19 (sub-category) – Rigging
  "Rigging": [
    "sling", "round sling", "flat sling", "web sling",
    "chain block", "lever hoist", "come-along", "come along",
    "shackle", "dee shackle", "bow shackle", "screw pin shackle",
    "wire rope", "wire sling", "wire rope clip",
    "turnbuckle", "hook and eye", "eye bolt", "swivel hook",
    "rigging", "lifting gear", "lifting sling",
    "crane hook", "master link", "hoist ring",
    "garrick", "ear-lokt", "jack chain",
  ],

  // CC 19 (sub-category) – PPE
  "PPE": [
    "hard hat", "safety helmet", "bump cap",
    "safety glasses", "safety glass", "safety spectacles", "safety goggles",
    "face shield", "faceshield", "browguard", "visor",
    "respirator", "half face", "full face respirator", "respirator filter",
    "earmuff", "ear muff", "ear plug", "earplug", "hearing protection",
    "glove", "nitrile glove", "riggers glove", "welding glove",
    "hi-vis", "hi vis", "high vis", "high visibility", "safety vest",
    "safety harness", "fall arrest", "lanyard",
    "pro choice",
  ],

  // CC 19 – Tooling
  "Tooling": [
    "torque wrench", "torque tool", "workshop",
    "tool", "hand tool", "power tool",
    "wrench", "adjustable wrench", "pipe wrench", "spanner",
    "drill bit", "drill set", "annular cutter", "holemaker",
    "burr set", "rotary burr",
    "buff pad", "chuck", "drill chuck",
    "power wrench", "power punch", "impact wrench",
    "site box", "storage box", "tool box",
    "star picket driver", "trolley", "dispenser trolley",
    "milwaukee", "xtorque", "makita", "dewalt", "bosch",
    "daytona", "fluid extractor",
    "sydney tools", "sydneytools",
    "gravity table",
  ],

  // CC 17 – Safety Equipment
  "Safety Equipment": [
    "safety shower", "eyewash", "emergency shower", "guarding",
    "machine guard", "safety cage", "pull wire", "e-stop",
    "safety interlock", "light curtain",
    "fire extinguisher", "fire blanket", "first aid",
    "spill kit", "bund", "safety sign",
  ],

  // CC 09 – Wear Parts
  "Wear Parts": [
    "wear part", "wear plate", "wear ring", "wear strip", "impact plate",
    "screen panel", "screen mesh", "crusher liner",
    "liner", "wear liner", "chute liner", "mill liner", "rubber liner",
    "side lining", "pu wedge", "pu side", "cleat",
    "concave", "mantle", "cone liner", "jaw plate", "cheek plate",
    "crushing screen", "cyclone liner", "cover liner",
    "repair strip", "lifter", "lifter bar",
    "crusher part",
  ],

  // CC 08 – Conveyor Component
  "Conveyor Component": [
    "conveyor", "idler", "roller", "return roller", "trough roller",
    "impact roller", "guide roller", "head pulley", "tail pulley",
    "snub pulley", "take-up", "belt scraper", "belt cleaner",
    "skirting", "belt misalignment", "misalignment switch",
    "vee belt", "v-belt", "v belt", "transmission belt", "drive belt",
    "timing belt", "serpentine", "wedge belt", "spb", "spa", "spc",
    "belt tensioner", "belt pulley", "chain", "sprocket",
    "fenner pulley",
  ],

  // CC 12 – Seal
  "Seal": [
    "seal", "o-ring", "gasket", "packing", "gland packing", "mechanical seal",
    "shaft seal", "oil seal", "lip seal", "diaphragm seal", "gasket set",
    "o ring", "seal kit", "ptfe sheet", "ptfe expanded",
    "joint ring", "intake joint",
  ],

  // CC 04 – Bearing
  "Bearing": [
    "bearing", "pillow block", "spherical roller", "ball bearing", "tapered roller",
    "roller bearing", "needle bearing", "thrust bearing", "bearing housing",
    "plummer block", "bearing adapter", "bearing isolator", "bearing insert",
    "cylindrical roller", "angular contact", "flinger",
  ],

  // CC 13 – Filter
  "Filter": [
    "filter", "filter element", "filter cartridge", "strainer",
    "air filter", "oil filter", "fuel filter", "hydraulic filter",
    "filter plate", "filter cloth", "filter press",
    "element assembly", "fuel water separator", "breather",
    "puretec", "replacement pack",
  ],

  // CC 05 – Valve
  "Valve": [
    "valve", "knife gate", "butterfly valve", "ball valve", "check valve",
    "safety valve", "pressure relief", "control valve", "solenoid valve",
    "gate valve", "globe valve", "pinch valve", "diaphragm valve",
    "needle valve", "plug valve", "isolation valve",
    "directional vale", "cetop",
  ],

  // CC 01 – Pump Component
  "Pump Component": [
    "pump", "impeller", "volute", "throat bush", "pump casing",
    "slurry pump", "centrifugal pump", "submersible", "diaphragm pump",
    "aodd", "dosing pump", "transfer pump", "wet end",
    "grundfos", "fluid extractor", "lantern ring", "pump sleeve",
  ],

  // CC 02 – Motor Component
  "Motor Component": [
    "motor", "drive motor", "electric motor", "motor assembly",
    "motor fan", "motor terminal", "motor bearing", "motor coupling",
  ],

  // CC 03 – Gearbox
  "Gearbox": [
    "gearbox", "gear box", "gear reducer", "speed reducer",
    "sew-eurodrive", "sew eurodrive", "helical gearbox", "planetary gearbox",
    "worm gear", "right angle drive",
  ],

  // CC 06 – Instrumentation
  "Instrumentation": [
    "transmitter", "sensor", "gauge", "pressure gauge", "flow meter",
    "level sensor", "thermocouple", "rtd", "ph probe", "conductivity",
    "turbidity", "indicator", "controller", "recorder",
    "thermometer", "bimetal thermometer",
    "encoder", "incremental encoder", "isolating amplifier",
    "analyser", "analyzer",
  ],

  // CC 07 – Electrical
  "Electrical": [
    "electrical", "electric", "cable", "wire", "connector", "switch",
    "terminal", "lug", "heat shrink", "cable gland", "contactor", "relay",
    "circuit breaker", "fuse", "vsd", "vfd", "inverter", "motor starter",
    "plc", "control module", "transformer", "switchgear", "mcc",
    "insulation tape", "insulating tape", "pvc tape", "electrical tape",
    "cable tie", "volt", "extension cable", "power cable", "flex cable",
    "copper crimp", "crimp lug", "crimp link", "boot lace pin",
    "clipsal", "plug", "power outlet", "rcbo", "rcd",
    "soft starter", "micrologix", "guardlogix", "compactlogix",
    "allen-bradley", "allen bradley",
    "fuseco", "mini-kit",
    "din socket", "cat6", "smart-ups", "ups",
    "enclosure", "junction box", "entry box",
    "appliance test", "test tag",
    "cable tray", "ezystrut", "cable ladder",
    "magnetic adaptor", "conduit",
  ],

  // CC 15 – Air & Pneumatic
  "Air & Pneumatic": [
    "pneumatic", "air cylinder", "air valve", "pneumatic fitting",
    "pneumatic actuator", "air regulator", "frl", "compressor",
    "air receiver", "air reciever",
    "hydraulic", "hydraulic valve", "hydraulic pump",
    "hydraulic motor", "hydraulic cylinder", "hydraulic fitting",
    "blower", "side channel blower",
    "norgen", "norgren",
  ],

  // CC 16 – Tanks & Vessels
  "Tanks & Vessels": [
    "tank", "vessel", "sump", "hopper", "reagent tank", "cip tank",
    "process tank", "storage tank",
    "heat exchanger", "exchanger", "dynacool",
  ],

  // CC 18 – Power Generation
  "Power Generation": [
    "generator", "alternator", "substation", "distribution board",
    "power factor", "capacitor bank", "busbar",
  ],

  // CC 14 – Lubrication System
  "Lubrication System": [
    "lube pump", "lube cooler", "lube injector", "lube manifold",
    "grease pump", "lubrication system", "oil cooler",
    "divider valve", "graco",
  ],

  // CC 20 – OEM Assembly
  "OEM Assembly": [
    "pump skid", "lube skid", "filter press package", "oem assembly",
    "complete assembly", "skid mounted",
  ],

  // CC 10 – Mechanical
  "Mechanical": [
    "coupling", "flexible coupling", "gear coupling", "chain coupling",
    "pulley", "sheave", "keyway", "key",
    "shaft", "spindle",
    "actuator", "bracket", "clamp", "mount",
    "frame", "guard", "support", "handrail",
    "flexseal", "durasleeve",
  ],

  // CC 22 – Consumables (fallback)
  "Consumables": [
    "flap disc", "cutting wheel", "cut off wheel", "grinding disc",
    "abrasive", "fibre disc", "slotted fibre disc", "cubitron",
    "lubricant", "grease", "oil", "degreaser", "cleaning", "rag",
    "adhesive", "sealant", "paint", "marker",
    "grease nipple", "zerk",
    "battery", "batteries", "energizer",
    "anti-corrosion", "vci",
    "compliance certificate",
  ],
};

// Priority order for checking categories (more specific first)
const CATEGORY_PRIORITY: SpareCategory[] = [
  "Fastener",
  "Structural Steel",
  "Pipe Fitting",
  "Rigging",
  "PPE",
  "Tooling",
  "Safety Equipment",
  "Wear Parts",
  "Conveyor Component",
  "Seal",
  "Bearing",
  "Filter",
  "Valve",
  "Pump Component",
  "Motor Component",
  "Gearbox",
  "Instrumentation",
  "Electrical",
  "Air & Pneumatic",
  "Tanks & Vessels",
  "Power Generation",
  "Lubrication System",
  "OEM Assembly",
  "Mechanical",
  "Consumables",
];

/**
 * Normalize text for keyword matching
 */
const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

/**
 * Check if description contains any keyword from the list
 */
const containsKeyword = (description: string, keywords: string[]): boolean => {
  const normalized = normalizeText(description);
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\s|[^a-z])${escapedKeyword}($|\\s|[^a-z])`, 'i');
    return regex.test(normalized);
  });
};

/**
 * Classify a spare part into a category based on its description.
 * Falls back to "Consumables" — no "General" or "Unknown" bucket.
 */
export const classifyCategory = (description: string): SpareCategory => {
  if (!description) return "Consumables";

  for (const category of CATEGORY_PRIORITY) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.length > 0 && containsKeyword(description, keywords)) {
      return category;
    }
  }

  return "Consumables";
};

/**
 * Get subcategory based on category and description
 */
export const classifySubcategory = (category: SpareCategory, description: string): string => {
  const normalized = normalizeText(description);

  switch (category) {
    case "Fastener":
      if (normalized.includes("bolt")) return "Bolt";
      if (normalized.includes("nut")) return "Nut";
      if (normalized.includes("washer")) return "Washer";
      if (normalized.includes("screw")) return "Screw";
      if (normalized.includes("stud")) return "Stud";
      return "";
    case "Pipe Fitting":
      if (normalized.includes("elbow")) return "Elbow";
      if (normalized.includes("tee")) return "Tee";
      if (normalized.includes("nipple")) return "Nipple";
      if (normalized.includes("bush")) return "Bush";
      if (normalized.includes("reducer")) return "Reducer";
      if (normalized.includes("flange")) return "Flange";
      if (normalized.includes("union")) return "Union";
      if (normalized.includes("coupling")) return "Coupling";
      if (normalized.includes("hose")) return "Hose";
      return "";
    case "Bearing":
      if (normalized.includes("pillow block")) return "Pillow Block";
      if (normalized.includes("spherical")) return "Spherical Roller";
      if (normalized.includes("ball bearing")) return "Ball Bearing";
      if (normalized.includes("tapered")) return "Tapered Roller";
      if (normalized.includes("cylindrical")) return "Cylindrical Roller";
      return "";
    case "Valve":
      if (normalized.includes("butterfly")) return "Butterfly";
      if (normalized.includes("knife gate")) return "Knife Gate";
      if (normalized.includes("ball valve")) return "Ball";
      if (normalized.includes("check valve")) return "Check";
      if (normalized.includes("safety valve")) return "Safety";
      if (normalized.includes("solenoid")) return "Solenoid";
      return "";
    case "Pump Component":
      if (normalized.includes("slurry")) return "Slurry";
      if (normalized.includes("submersible")) return "Submersible";
      if (normalized.includes("centrifugal")) return "Centrifugal";
      if (normalized.includes("diaphragm") || normalized.includes("aodd")) return "Diaphragm";
      if (normalized.includes("impeller")) return "Impeller";
      return "";
    case "Filter":
      if (normalized.includes("air filter")) return "Air Filter";
      if (normalized.includes("oil filter")) return "Oil Filter";
      if (normalized.includes("fuel filter")) return "Fuel Filter";
      if (normalized.includes("filter press")) return "Filter Press";
      return "";
    default:
      return "";
  }
};

/**
 * Get all available categories
 */
export const getAllCategories = (): SpareCategory[] => {
  return CATEGORY_PRIORITY;
};

/**
 * Get badge colour for category display
 */
export const getCategoryColor = (category: SpareCategory | string): string => {
  switch (category) {
    case "Pump Component":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Motor Component":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Gearbox":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Bearing":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Valve":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Instrumentation":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "Electrical":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Conveyor Component":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Wear Parts":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Mechanical":
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    case "Structural Steel":
      return "bg-stone-100 text-stone-700 border-stone-200";
    case "Pipe Fitting":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "Seal":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Filter":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "Lubrication System":
      return "bg-lime-100 text-lime-700 border-lime-200";
    case "Air & Pneumatic":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Tanks & Vessels":
      return "bg-stone-100 text-stone-700 border-stone-200";
    case "Safety Equipment":
      return "bg-red-100 text-red-700 border-red-200";
    case "Power Generation":
      return "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200";
    case "Tooling":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Rigging":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "PPE":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "OEM Assembly":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "Fastener":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Consumables":
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
};
