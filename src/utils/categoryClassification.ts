/**
 * Category Classification Utility
 * 
 * Auto-classifies spare parts into categories based on description keywords.
 * Used to ensure items are properly categorized rather than defaulting to "General".
 */

export type SpareCategory = 
  | "Bearing"
  | "Consumable"
  | "Electrical"
  | "Fastener"
  | "Filter"
  | "Gearbox"
  | "Hose & Tubing"
  | "Hydraulic"
  | "Instrumentation"
  | "Liner"
  | "Mechanical"
  | "Motor Component"
  | "Pipe Fitting"
  | "Pneumatic"
  | "Pump Component"
  | "Seal"
  | "Valve"
  | "Conveyor Component"
  | "Wear Part"
  | "General";

// Category keyword mappings - checked in priority order
const CATEGORY_KEYWORDS: Record<SpareCategory, string[]> = {
  // Fasteners - bolts, nuts, washers, screws (high priority)
  "Fastener": [
    "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor", "rivet",
    "hex bolt", "cap screw", "set screw", "lock nut", "nyloc", "spring washer",
    "hex nut", "zinc plated", "gr8", "grade 8", "asme b18",
  ],
  
  // Pipe Fittings - nipples, elbows, tees, bushes
  "Pipe Fitting": [
    "nipple", "elbow", "tee", "reducer", "union", "flange", "blind flange",
    "pipe fitting", "threaded", "bsp", "npt", "coupler", "coupling fitting",
    "compression fitting", "electrofusion", "stub flange", "poly nipple",
    "reducing bush", "reducing nipple", "hex reducing", "pipe clamp",
    "female tee", "male tee", "socket", "street elbow", "cap fitting",
    "pipe clamp", "hdpe pipe", "pvc pipe", "poly pipe", "pipe coupling",
  ],
  
  // Hoses & Tubing
  "Hose & Tubing": [
    "hose", "tubing", "flexible hose", "hydraulic hose", "air hose", "nylon tubing",
    "drag hose", "tpr hose", "pvc hose", "hose coupling", "claw coupling",
    "camlock", "hosetail", "hose assembly", "suction hose", "delivery hose",
  ],
  
  // Electrical - cables, switches, panels
  "Electrical": [
    "electrical", "electric", "cable", "wire", "connector", "switch",
    "terminal", "lug", "heat shrink", "cable gland", "contactor", "relay",
    "circuit breaker", "fuse", "vsd", "vfd", "inverter", "motor starter",
    "plc", "control module", "transformer", "switchgear", "mcc",
    "insulation tape", "insulating tape", "pvc tape", "electrical tape",
    "cable tie", "volt", "extension cable", "power cable", "flex cable",
  ],
  
  // Conveyor Components - belts, idlers, pulleys, chains
  "Conveyor Component": [
    "conveyor", "idler", "roller", "return roller", "trough roller",
    "impact roller", "guide roller", "head pulley", "tail pulley",
    "snub pulley", "take-up", "belt scraper", "belt cleaner",
    "skirting", "belt misalignment", "misalignment switch",
    "vee belt", "v-belt", "v belt", "transmission belt", "drive belt",
    "timing belt", "serpentine", "wedge belt", "spb", "spa", "spc",
    "belt tensioner", "belt pulley", "chain", "sprocket",
  ],
  
  // Bearings
  "Bearing": [
    "bearing", "pillow block", "spherical roller", "ball bearing", "tapered roller",
    "roller bearing", "needle bearing", "thrust bearing", "bearing housing",
    "plummer block", "bearing adapter", "bearing isolator", "bearing insert",
    "cylindrical roller", "angular contact",
  ],
  
  // Seals & Gaskets
  "Seal": [
    "seal", "o-ring", "gasket", "packing", "gland packing", "mechanical seal",
    "shaft seal", "oil seal", "lip seal", "diaphragm seal", "gasket set",
    "o ring", "seal kit",
  ],
  
  // Valves
  "Valve": [
    "valve", "knife gate", "butterfly valve", "ball valve", "check valve",
    "safety valve", "pressure relief", "control valve", "solenoid valve",
    "gate valve", "globe valve", "pinch valve", "diaphragm valve",
    "needle valve", "plug valve", "isolation valve",
  ],
  
  // Pump Components
  "Pump Component": [
    "pump", "impeller", "volute", "wear ring", "throat bush", "pump casing",
    "slurry pump", "centrifugal pump", "submersible", "diaphragm pump",
    "aodd", "dosing pump", "transfer pump", "wet end",
  ],
  
  // Motor Components
  "Motor Component": [
    "motor", "drive motor", "electric motor", "motor assembly",
    "motor fan", "motor terminal", "motor bearing",
  ],
  
  // Gearboxes
  "Gearbox": [
    "gearbox", "gear box", "gear reducer", "speed reducer", "reducer",
    "sew-eurodrive", "sew eurodrive", "helical gearbox", "planetary gearbox",
    "worm gear", "right angle drive",
  ],
  
  // Filters
  "Filter": [
    "filter", "filter element", "filter cartridge", "strainer",
    "air filter", "oil filter", "fuel filter", "hydraulic filter",
    "filter plate", "filter cloth", "filter press",
  ],
  
  
  // Instrumentation
  "Instrumentation": [
    "transmitter", "sensor", "gauge", "pressure gauge", "flow meter",
    "level sensor", "thermocouple", "rtd", "ph probe", "conductivity",
    "turbidity", "indicator", "controller", "recorder",
  ],
  
  // Mechanical - general mechanical components
  "Mechanical": [
    "coupling", "flexible coupling", "gear coupling", "chain coupling",
    "sprocket", "chain", "pulley", "sheave", "keyway", "key",
    "shaft", "spindle", "cylinder", "hydraulic cylinder", "pneumatic cylinder",
    "actuator", "bracket", "clamp", "mount",
  ],
  
  // Consumables - PPE, lubricants, cleaning
  "Consumable": [
    "glove", "ppe", "respirator", "earmuff", "glasses",
    "lubricant", "grease", "oil", "degreaser", "cleaning", "rag",
    "tape", "adhesive", "sealant", "paint", "marker",
    "grease nipple", "zerk", "divider valve",
  ],
  
  // Hydraulic components
  "Hydraulic": [
    "hydraulic", "hydraulic valve", "hydraulic pump", "hydraulic motor",
    "hydraulic cylinder", "hydraulic fitting", "hydraulic oil",
  ],
  
  // Pneumatic components
  "Pneumatic": [
    "pneumatic", "air cylinder", "air valve", "pneumatic fitting",
    "pneumatic actuator", "air regulator", "frl",
  ],
  
  // Liners
  "Liner": [
    "liner", "wear liner", "chute liner", "mill liner", "rubber liner",
  ],
  
  // Wear Parts
  "Wear Part": [
    "wear part", "wear plate", "wear ring", "wear strip", "impact plate",
    "screen panel", "screen mesh", "crusher liner",
  ],
  
  // General - fallback (no keywords)
  "General": [],
};

// Priority order for checking categories (more specific first)
const CATEGORY_PRIORITY: SpareCategory[] = [
  "Fastener",
  "Pipe Fitting",
  "Hose & Tubing",
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
  "Hydraulic",
  "Pneumatic",
  "Liner",
  "Wear Part",
  "Mechanical",
  "Consumable",
  "General",
];

/**
 * Normalize text for keyword matching
 */
const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

/**
 * Check if description contains any keyword from the list
 * Uses word boundary matching to avoid partial false positives
 */
const containsKeyword = (description: string, keywords: string[]): boolean => {
  const normalized = normalizeText(description);
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    // Escape special regex characters
    const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match at word boundaries
    const regex = new RegExp(`(^|\\s|[^a-z])${escapedKeyword}($|\\s|[^a-z])`, 'i');
    return regex.test(normalized);
  });
};

/**
 * Classify a spare part into a category based on its description
 */
export const classifyCategory = (description: string): SpareCategory => {
  if (!description) return "General";

  // Check categories in priority order
  for (const category of CATEGORY_PRIORITY) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.length > 0 && containsKeyword(description, keywords)) {
      return category;
    }
  }

  return "General";
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
 * Get badge color for category display
 */
export const getCategoryColor = (category: SpareCategory): string => {
  switch (category) {
    case "Fastener":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Pipe Fitting":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Hose & Tubing":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "Conveyor Component":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Bearing":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Seal":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Valve":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Pump Component":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Motor Component":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Gearbox":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Filter":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "Instrumentation":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "Electrical":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "Mechanical":
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    case "Consumable":
      return "bg-green-100 text-green-700 border-green-200";
    case "Hydraulic":
      return "bg-red-100 text-red-700 border-red-200";
    case "Pneumatic":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Liner":
      return "bg-stone-100 text-stone-700 border-stone-200";
    case "Wear Part":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
