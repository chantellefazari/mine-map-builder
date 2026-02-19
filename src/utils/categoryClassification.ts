/**
 * Category Classification Utility
 * 
 * Auto-classifies spare parts into categories based on description keywords.
 * Categories are aligned 1:1 with the Site Parts Numbering Standard (TCMG)
 * Part Category Codes (CC = 01–23).
 *
 * FALLBACK: Items that don't match any keyword list default to "Consumables" (CC 22).
 * There is no "General" or "Unknown" bucket — everything gets a real category.
 */

export type SpareCategory = 
  | "Pumps"                          // CC 01
  | "Motors"                         // CC 02
  | "Gearboxes / Reducers"          // CC 03
  | "Bearings"                       // CC 04
  | "Valves"                         // CC 05
  | "Instrumentation"                // CC 06
  | "Electrical Components"          // CC 07
  | "Conveying Components"           // CC 08
  | "Wear Parts"                     // CC 09
  | "Mechanical"                     // CC 10
  | "Hoses & Pipework"              // CC 11
  | "Seals & Gaskets"               // CC 12
  | "Filters"                        // CC 13
  | "Lubrication System Components"  // CC 14
  | "Air & Pneumatic Components"     // CC 15
  | "Tanks & Vessels"                // CC 16
  | "Safety Equipment"               // CC 17
  | "Power Generation & Distribution" // CC 18
  | "Tooling"                         // CC 19
  | "Rigging"                        // CC 19b – lifting & rigging gear
  | "PPE"                            // CC 19c – personal protective equipment
  | "OEM Assemblies / Packages"      // CC 20
  | "Fasteners"                      // CC 21
  | "Consumables";                   // CC 22 (also the fallback)

// Category keyword mappings - checked in priority order
const CATEGORY_KEYWORDS: Record<SpareCategory, string[]> = {
  // CC 21 – Fasteners (high priority to catch bolts/nuts early)
  "Fasteners": [
    "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor", "rivet",
    "hex bolt", "cap screw", "set screw", "lock nut", "nyloc", "spring washer",
    "hex nut", "zinc plated", "gr8", "grade 8", "asme b18",
  ],

  // CC 11 – Hoses & Pipework
  "Hoses & Pipework": [
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

  // CC 19b – Rigging (lifting & rigging equipment — All Rig, slings, hoists, chains)
  "Rigging": [
    "sling", "round sling", "flat sling", "web sling",
    "chain block", "lever hoist", "come-along", "come along",
    "shackle", "dee shackle", "bow shackle", "screw pin shackle",
    "wire rope", "wire sling", "wire rope clip",
    "turnbuckle", "hook and eye", "eye bolt", "swivel hook",
    "rigging", "lifting gear", "lifting sling",
    "crane hook", "master link", "hoist ring",
    "garrick",
  ],

  // CC 19c – PPE (personal protective equipment)
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

  // CC 19 – Tooling (hand/power tools, workshop equipment)
  "Tooling": [
    "torque wrench", "torque tool", "workshop",
    "tool", "hand tool", "power tool",
    "wrench", "adjustable wrench", "pipe wrench", "spanner",
    "drill bit", "drill set", "annular cutter", "holemaker",
    "burr set", "rotary burr",
    "buff pad", "chuck", "drill chuck",
    "power wrench", "power punch", "impact wrench",
    "site box", "storage box", "tool box",
    "star picket", "trolley", "dispenser trolley",
    "milwaukee", "xtorque", "makita", "dewalt", "bosch",
    "daytona",
    "sydney tools", "sydneytools",
  ],

  // CC 17 – Safety Equipment
  "Safety Equipment": [
    "safety shower", "eyewash", "emergency shower", "guarding",
    "machine guard", "safety cage", "pull wire", "e-stop",
    "safety interlock", "light curtain",
    "fire extinguisher", "fire blanket", "first aid",
    "spill kit", "bund", "safety sign",
  ],

  // CC 09 – Wear Parts (liners, screen panels, crusher parts)
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

  // CC 08 – Conveying Components
  "Conveying Components": [
    "conveyor", "idler", "roller", "return roller", "trough roller",
    "impact roller", "guide roller", "head pulley", "tail pulley",
    "snub pulley", "take-up", "belt scraper", "belt cleaner",
    "skirting", "belt misalignment", "misalignment switch",
    "vee belt", "v-belt", "v belt", "transmission belt", "drive belt",
    "timing belt", "serpentine", "wedge belt", "spb", "spa", "spc",
    "belt tensioner", "belt pulley", "chain", "sprocket",
    "fenner pulley",
  ],

  // CC 12 – Seals & Gaskets
  "Seals & Gaskets": [
    "seal", "o-ring", "gasket", "packing", "gland packing", "mechanical seal",
    "shaft seal", "oil seal", "lip seal", "diaphragm seal", "gasket set",
    "o ring", "seal kit", "ptfe sheet", "ptfe expanded",
    "joint ring", "intake joint",
  ],

  // CC 04 – Bearings
  "Bearings": [
    "bearing", "pillow block", "spherical roller", "ball bearing", "tapered roller",
    "roller bearing", "needle bearing", "thrust bearing", "bearing housing",
    "plummer block", "bearing adapter", "bearing isolator", "bearing insert",
    "cylindrical roller", "angular contact", "flinger",
  ],

  // CC 13 – Filters
  "Filters": [
    "filter", "filter element", "filter cartridge", "strainer",
    "air filter", "oil filter", "fuel filter", "hydraulic filter",
    "filter plate", "filter cloth", "filter press",
    "element assembly", "fuel water separator", "breather",
    "puretec", "replacement pack",
  ],

  // CC 05 – Valves
  "Valves": [
    "valve", "knife gate", "butterfly valve", "ball valve", "check valve",
    "safety valve", "pressure relief", "control valve", "solenoid valve",
    "gate valve", "globe valve", "pinch valve", "diaphragm valve",
    "needle valve", "plug valve", "isolation valve",
    "directional vale", "cetop",
  ],

  // CC 01 – Pumps
  "Pumps": [
    "pump", "impeller", "volute", "throat bush", "pump casing",
    "slurry pump", "centrifugal pump", "submersible", "diaphragm pump",
    "aodd", "dosing pump", "transfer pump", "wet end",
    "grundfos", "fluid extractor",
  ],

  // CC 02 – Motors
  "Motors": [
    "motor", "drive motor", "electric motor", "motor assembly",
    "motor fan", "motor terminal", "motor bearing",
  ],

  // CC 03 – Gearboxes / Reducers
  "Gearboxes / Reducers": [
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

  // CC 07 – Electrical Components
  "Electrical Components": [
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
    "magnetic adaptor",
  ],

  // CC 15 – Air & Pneumatic Components (includes hydraulic)
  "Air & Pneumatic Components": [
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

  // CC 18 – Power Generation & Distribution
  "Power Generation & Distribution": [
    "generator", "alternator", "substation", "distribution board",
    "power factor", "capacitor bank", "busbar",
  ],

  // CC 14 – Lubrication System Components
  "Lubrication System Components": [
    "lube pump", "lube cooler", "lube injector", "lube manifold",
    "grease pump", "lubrication system", "oil cooler",
    "divider valve", "graco",
  ],

  // CC 20 – OEM Assemblies / Packages
  "OEM Assemblies / Packages": [
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
    "equal angle", "angle iron", "channel steel", "flat bar",
    "structural steel", "gravity table",
  ],

  // CC 22 – Consumables (also the fallback for unclassified items)
  "Consumables": [
    "flap disc", "cutting wheel", "cut off wheel", "grinding disc",
    "abrasive", "fibre disc", "slotted fibre disc", "cubitron",
    "glove", "ppe", "respirator", "earmuff", "glasses",
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
  "Fasteners",
  "Hoses & Pipework",
  "Rigging",
  "PPE",
  "Tooling",
  "Safety Equipment",
  "Wear Parts",
  "Conveying Components",
  "Seals & Gaskets",
  "Bearings",
  "Filters",
  "Valves",
  "Pumps",
  "Motors",
  "Gearboxes / Reducers",
  "Instrumentation",
  "Electrical Components",
  "Air & Pneumatic Components",
  "Tanks & Vessels",
  "Power Generation & Distribution",
  "Lubrication System Components",
  "OEM Assemblies / Packages",
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
 * Falls back to "Consumables" (CC 22) — no "General" or "Unknown" bucket.
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
    case "Fasteners":
      if (normalized.includes("bolt")) return "Bolt";
      if (normalized.includes("nut")) return "Nut";
      if (normalized.includes("washer")) return "Washer";
      if (normalized.includes("screw")) return "Screw";
      if (normalized.includes("stud")) return "Stud";
      return "";
    case "Hoses & Pipework":
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
    case "Bearings":
      if (normalized.includes("pillow block")) return "Pillow Block";
      if (normalized.includes("spherical")) return "Spherical Roller";
      if (normalized.includes("ball bearing")) return "Ball Bearing";
      if (normalized.includes("tapered")) return "Tapered Roller";
      if (normalized.includes("cylindrical")) return "Cylindrical Roller";
      return "";
    case "Valves":
      if (normalized.includes("butterfly")) return "Butterfly";
      if (normalized.includes("knife gate")) return "Knife Gate";
      if (normalized.includes("ball valve")) return "Ball";
      if (normalized.includes("check valve")) return "Check";
      if (normalized.includes("safety valve")) return "Safety";
      if (normalized.includes("solenoid")) return "Solenoid";
      return "";
    case "Pumps":
      if (normalized.includes("slurry")) return "Slurry";
      if (normalized.includes("submersible")) return "Submersible";
      if (normalized.includes("centrifugal")) return "Centrifugal";
      if (normalized.includes("diaphragm") || normalized.includes("aodd")) return "Diaphragm";
      if (normalized.includes("impeller")) return "Impeller";
      return "";
    case "Filters":
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
 * Get badge color for category display
 */
export const getCategoryColor = (category: SpareCategory | string): string => {
  switch (category) {
    case "Pumps":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Motors":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Gearboxes / Reducers":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Bearings":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Valves":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Instrumentation":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "Electrical Components":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Conveying Components":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Wear Parts":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Mechanical":
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    case "Hoses & Pipework":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "Seals & Gaskets":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Filters":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "Lubrication System Components":
      return "bg-lime-100 text-lime-700 border-lime-200";
    case "Air & Pneumatic Components":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Tanks & Vessels":
      return "bg-stone-100 text-stone-700 border-stone-200";
    case "Safety Equipment":
      return "bg-red-100 text-red-700 border-red-200";
    case "Power Generation & Distribution":
      return "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200";
    case "Tooling":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Rigging":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "PPE":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "OEM Assemblies / Packages":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "Fasteners":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Consumables":
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
};
