/**
 * Visual Parts Category Classification Utility
 * 
 * Auto-classifies parts into Visual Parts Catalogue categories based on:
 * 1. Supplier name (known supplier specializations)
 * 2. Description keywords (fallback pattern matching)
 */

// Visual Parts Catalogue categories (from visualPartsConstants.ts)
export type VisualPartCategory = 
  | "General"
  | "Pump Component"
  | "Valve"
  | "Fastener"
  | "Liner"
  | "Electrical"
  | "Bearing"
  | "Seal / Gasket"
  | "Belt / Chain"
  | "Filter"
  | "Motor Component"
  | "Gearbox Component"
  | "Instrumentation"
  | "Hydraulic"
  | "Pneumatic"
  | "Structural"
  | "Wear Part"
  | "Safety Equipment";

// Supplier specialization mappings
// Based on known supplier categories at Tennant Creek
const SUPPLIER_CATEGORY_MAP: Record<string, VisualPartCategory> = {
  // PPS = Pump components
  "pps": "Pump Component",
  "pps australia": "Pump Component",
  "pump power services": "Pump Component",
  
  // GWG = Poly fittings (Pipe/Hydraulic)
  "gwg": "Hydraulic",
  "gwg poly": "Hydraulic",
  
  // Newman/Newmans = Electric motors
  "newman": "Motor Component",
  "newmans": "Motor Component",
  "newmans electrical": "Motor Component",
  
  // Keyflo = Valves
  "keyflo": "Valve",
  "keyflo valves": "Valve",
  
  // Britrac = Conveyor parts (wear parts)
  "britrac": "Wear Part",
  "britrac conveyor": "Wear Part",
  
  // Motion = Bearings and power transmission
  "motion": "Bearing",
  "motion australia": "Bearing",
  
  // MME = Mechanical/Mining equipment
  "mme": "Wear Part",
  
  // Matec = Filter press components
  "matec": "Filter",
};

// Description keyword mappings for Visual Parts categories
const DESCRIPTION_KEYWORDS: Record<VisualPartCategory, string[]> = {
  "Pump Component": [
    "pump", "impeller", "volute", "wear ring", "throat bush", "pump casing",
    "slurry pump", "centrifugal pump", "submersible", "diaphragm pump",
    "aodd", "dosing pump", "transfer pump", "wet end", "pump shaft",
    "pump bearing", "pump seal", "lantern ring", "frame plate liner",
    "cover plate liner", "stuffing box", "shaft sleeve", "discharge joint",
    "intake joint", "joint ring", "gland packing", "cotter", "lantern restrictor",
    "keto", "warman", "multifit", "thkmultifit", "throat bush liner",
    "djr/l", "njr-", "trb-", "kfpl-", "kcpl-", "kslv", "ksbox", "kpak",
  ],
  
  "Valve": [
    "valve", "knife gate", "butterfly valve", "ball valve", "check valve",
    "safety valve", "pressure relief", "control valve", "solenoid valve",
    "gate valve", "globe valve", "pinch valve", "diaphragm valve",
    "needle valve", "plug valve", "isolation valve", "keyflo", "clarkson",
    "actuator", "keystone",
  ],
  
  "Fastener": [
    "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor", "rivet",
    "hex bolt", "cap screw", "set screw", "lock nut", "nyloc", "spring washer",
    "hex nut", "zinc plated", "gr8", "grade 8", "superscrew", "flexco bolt",
    "m12h5", "m12z3", "m12z23", "extra large washer", "hex, m12",
  ],
  
  "Bearing": [
    "bearing", "pillow block", "spherical roller", "ball bearing", "tapered roller",
    "roller bearing", "needle bearing", "thrust bearing", "bearing housing",
    "plummer block", "bearing adapter", "bearing isolator", "bearing insert",
    "cylindrical roller", "angular contact", "skf", "nsk", "ntn",
  ],
  
  "Seal / Gasket": [
    "seal", "o-ring", "gasket", "packing", "gland packing", "mechanical seal",
    "shaft seal", "oil seal", "lip seal", "diaphragm seal", "gasket set",
    "o ring", "seal kit", "viton", "epdm", "ptfe seal", "sigma", "sigma533",
    "flange gasket", "ff gasket",
  ],
  
  "Belt / Chain": [
    "belt", "conveyor belt", "vee belt", "v-belt", "v belt", "drive belt",
    "timing belt", "chain", "roller chain", "drive chain", "sprocket",
    "belt splice", "splice kit", "belt scraper", "belt cleaner", "belt plough",
    "skirting", "blt-",
  ],
  
  "Filter": [
    "filter", "filter element", "filter cartridge", "strainer",
    "air filter", "oil filter", "fuel filter", "hydraulic filter",
    "filter plate", "filter cloth", "filter press", "matec",
  ],
  
  "Motor Component": [
    "motor", "drive motor", "electric motor", "motor assembly",
    "motor fan", "motor terminal", "motor bearing", "fan cover",
    "cooling fan", "motor shaft",
  ],
  
  "Gearbox Component": [
    "gearbox", "gear box", "gear reducer", "speed reducer", "reducer",
    "sew-eurodrive", "sew eurodrive", "helical gearbox", "planetary gearbox",
    "worm gear", "right angle drive", "gear oil",
  ],
  
  "Electrical": [
    "electrical", "electric", "cable", "wire", "connector", "switch",
    "terminal", "lug", "heat shrink", "cable gland", "contactor", "relay",
    "circuit breaker", "fuse", "vsd", "vfd", "inverter", "motor starter",
    "plc", "control module", "transformer", "switchgear", "mcc",
    "cable tie", "extension cable", "power cable",
  ],
  
  "Instrumentation": [
    "transmitter", "sensor", "gauge", "pressure gauge", "flow meter",
    "level sensor", "thermocouple", "rtd", "ph probe", "conductivity",
    "turbidity", "indicator", "controller", "recorder", "proximity",
    "ifm", "sick", "endress", "electrode", "temp prob", "tihp",
  ],
  
  "Hydraulic": [
    "hydraulic", "hydraulic hose", "hydraulic cylinder", "hydraulic pump",
    "hydraulic fitting", "quick connect", "camlock", "hosetail",
    "hose assembly", "poly pipe", "hdpe", "pvc pipe", "nipple", "elbow",
    "reducer", "coupling", "flange", "gwg", "poly fitting",
  ],
  
  "Pneumatic": [
    "pneumatic", "air cylinder", "air valve", "solenoid", "frl",
    "filter regulator", "air hose", "smc", "festo", "pneumatic fitting",
  ],
  
  "Liner": [
    "liner", "wear liner", "chute liner", "hopper liner", "rubber liner",
    "ceramic liner", "liner plate", "mill liner",
  ],
  
  "Wear Part": [
    "wear part", "idler", "roller", "return roller", "trough roller",
    "impact roller", "guide roller", "head pulley", "tail pulley",
    "snub pulley", "take-up", "primary cleaner", "secondary cleaner",
    "conveyor frame", "tracking frame", "britrac", "k-commander",
  ],
  
  "Structural": [
    "bracket", "mount", "frame", "support", "structural",
    "handrail", "walkway", "platform", "grating",
  ],
  
  "Safety Equipment": [
    "safety", "ppe", "glove", "respirator", "earmuff", "glasses",
    "harness", "lanyard", "helmet", "safety shower", "eyewash",
  ],
  
  "General": [],
};

// Priority order for description matching (more specific first)
const CATEGORY_PRIORITY: VisualPartCategory[] = [
  "Fastener",
  "Seal / Gasket",
  "Bearing",
  "Belt / Chain",
  "Filter",
  "Valve",
  "Pump Component",
  "Motor Component",
  "Gearbox Component",
  "Wear Part",
  "Liner",
  "Instrumentation",
  "Electrical",
  "Hydraulic",
  "Pneumatic",
  "Structural",
  "Safety Equipment",
  "General",
];

/**
 * Normalize text for matching
 */
const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

/**
 * Check if text contains any keyword from the list
 */
const containsKeyword = (text: string, keywords: string[]): boolean => {
  const normalized = normalizeText(text);
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    // Escape special regex characters
    const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match at word boundaries or as substring for hyphenated terms
    const regex = new RegExp(`(^|\\s|[^a-z])${escapedKeyword}($|\\s|[^a-z])`, 'i');
    return regex.test(normalized) || normalized.includes(normalizedKeyword);
  });
};

/**
 * Classify a part by supplier name first, then fall back to description
 */
export const classifyVisualPartCategory = (
  description: string,
  supplier?: string | null
): VisualPartCategory => {
  // First try supplier-based classification
  if (supplier) {
    const normalizedSupplier = normalizeText(supplier);
    for (const [key, category] of Object.entries(SUPPLIER_CATEGORY_MAP)) {
      if (normalizedSupplier.includes(key) || key.includes(normalizedSupplier)) {
        return category;
      }
    }
  }

  // Fall back to description-based classification
  if (!description) return "General";

  for (const category of CATEGORY_PRIORITY) {
    const keywords = DESCRIPTION_KEYWORDS[category];
    if (keywords.length > 0 && containsKeyword(description, keywords)) {
      return category;
    }
  }

  return "General";
};

/**
 * Get all visual part categories
 */
export const getAllVisualPartCategories = (): VisualPartCategory[] => {
  return CATEGORY_PRIORITY;
};
