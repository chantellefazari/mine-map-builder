/**
 * Criticality Classification Utility
 * 
 * Classifies spare parts into HIGH/MEDIUM/LOW criticality based on description keywords.
 * 
 * 🔴 HIGH (Red): Production/Safety critical - immediate plant stoppage, long lead times
 *    - Motors, Gearboxes, Major Pumps, PLCs, Crushers, Mill components
 * 
 * 🟠 MEDIUM (Orange): Reliability/Throughput impact - degraded mode, manageable delay
 *    - Bearings, Seals, Rollers, Valves, Instrumentation, Screens, Liners
 * 
 * 🟢 LOW (Green): Operational/Consumable - minimal disruption, readily available
 *    - Fasteners, Hoses, Filters, Fittings, Electrical consumables
 * 
 * PRIORITY ORDER: LOW keywords are checked FIRST to ensure fittings/consumables
 * are never falsely elevated to HIGH even if they contain equipment keywords.
 */

export type CriticalityLevel = "HIGH" | "MEDIUM" | "LOW";

// ============================================================================
// 🟢 LOW Criticality Keywords - Operational / Consumable
// ============================================================================
// These are checked FIRST to ensure pipe fittings and consumables don't get flagged as critical
// Rule of thumb: If it's easy to replace or source and doesn't affect production, it's LOW.
const LOW_KEYWORDS = [
  // ---- Fasteners (most common) ----
  "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor", "rivet",
  "set screw", "hex bolt", "socket head", "cap screw", "u-bolt", "j-bolt",
  "lock nut", "nyloc", "flange nut", "wing nut", "spring washer", "flat washer",
  
  // ---- Pipe Fittings (NEVER critical - common false positives) ----
  "socket", "nipple", "elbow", "tee", "reducer fitting", "union", "flange blank",
  "blind flange", "pipe fitting", "threaded", "bsp", "npt", "coupler", 
  "coupling fitting", "compression fitting", "electrofusion", "stub flange", 
  "poly nipple", "reducing bush", "reducing nipple", "hex reducing", "pipe clamp",
  "camlock", "victaulic", "grooved fitting", "barb fitting", "hose barb",
  "quick connect", "push fit", "ferrule", "olive",
  
  // ---- Filters (consumable) ----
  "filter element", "filter cartridge", "strainer element", 
  "air filter", "oil filter", "fuel filter", "hydraulic filter", "bag filter",
  "filter sock", "filter bag", "breather", "breather cap",
  
  // ---- Grease fittings / Lubrication consumables ----
  "grease nipple", "zerk", "lubrication fitting", "grease fitting",
  "grease cartridge", "oil bottle", "lubricant",

  // ---- Non-critical pumps (hand/manual/transfer — not production) ----
  "hand pump", "hand operated pump", "oil transfer pump", "drum pump",
  "grease gun", "manual pump",
  
  // ---- Electrical Consumables ----
  "electrical tape", "insulation tape", "insulating tape", "pvc tape",
  "cable tie", "wire", "terminal", "lug", "heat shrink", "cable gland",
  "conduit", "raceway", "junction box", "cable tray", "grommet",
  "indicator light", "lamp", "led", "bulb", "globe", "signage", "label",
  
  // ---- Minor Fittings / Hardware ----
  "clamp", "clip", "bracket", "shim", "spacer", "key", "keyway", "keystock",
  "pin", "cotter", "circlip", "snap ring", "dowel", "roll pin", "split pin",
  "hinge", "latch", "hasp", "padlock",
  
  // ---- PPE-related ----
  "ppe", "glove", "safety glasses", "earmuff", "ear plug", "respirator",
  "hard hat", "helmet", "hi-vis", "boot", "coverall", "mask",
  
  // ---- General Consumables ----
  "consumable", "disposable", "cleaning", "rag", "degreaser", "solvent",
  "tape", "adhesive", "sealant", "silicone", "loctite", "threadlocker",
  
  // ---- Belts (transmission belts are consumables) ----
  "vee belt", "v-belt", "v belt", "transmission belt", "drive belt", 
  "timing belt", "ribbed belt", "multi-rib",
  
  // ---- Pipe Materials (not fittings) ----
  "hdpe pipe", "pvc pipe", "poly pipe", "copper pipe", "steel pipe length",
  
  // ---- Packing & Gaskets (single items, not kits) ----
  "gland packing", "packing ring", "rope packing", "single gasket",
  "flange gasket", "sheet gasket", "gasket", "o-ring", "joint ring",
  "piston ring",
  
  // ---- Skirting / Rubber (wear consumables) ----
  "skirting rubber", "rubber sheet", "mud flap", "dust seal strip",
  "skirting", "scraper",
  
  // ---- Small Components ----
  "wedge", "scraper blade", "wiper", "squeegee",
  "extension cable", "extension lead", "power board",
  "divider valve", "flow divider",
  "bearing cap", "shim bearing", "dust cap", "end cap",
  
  // ---- Non-critical Sensors ----
  "proximity switch", "limit switch", "micro switch", "reed switch",

  // ---- Coupling parts (not drive couplings — just adaptor/fitting) ----
  "motor coupling", "coupling insert", "coupling element",
  "muff coupling", "hosetail", "hose coupling", "hose end",

  // ---- Liner singles (wear consumables, not crusher assemblies) ----
  "crusher liner", "crusher wear", "polyurethane liner", "pu liner",
  "cover liner", "cover plate liner",

  // ---- Circuit breaker accessories (not main switchgear) ----
  "motor circuit breaker", "motor protection", "motor protector",

  // ---- Pump PARTS (not complete pump assemblies — keeps them from hitting generic "pump" HIGH) ----
  "pump sleeve", "pump shaft sleeve", "pump clamp", "pump tubing",
  "pump parts", "pump rebuild kit", "pump repair kit", "pump kit",
  "pump casing", "pump component",
  "impeller", "volute", "wear ring", "throat bush",
  "suction liner", "frame plate", "stuffing box", "lantern ring",
  "pump shaft", "flinger", "cotter",
  "pipe float", "flexibore", "pump drive coupling",
  "wear part", "kit wear", "rotating element kit",
  "lantern restrictor", "shaft sleeve",
  
  // ---- Motor PARTS (not complete motors) ----
  "motor hub", "motor starter",

  // ---- Filter PARTS (not filter press assemblies) ----
  "filter element", "filter cartridge", "filter sock", "filter bag",
  "suction filter", "filter press plates",

  // ---- Fan parts (not complete fan/blower assemblies) ----
  "fan part", "fan blade",

  // ---- Bearing parts (MEDIUM, not HIGH) ----
  "bearing kit", "pillow block",

  // ---- Conveyor parts (MEDIUM, not HIGH) ----
  "conveyor roller", "guide roller", "conveyor belt",

  // ---- Rubber cord / packing (consumable, not hose) ----
  "rubber cord", "solid rubber cord",

  // ---- Nylon tubing (fitting, not process hose) ----
  "nylon tubing", "pvc tubing", "pvc flexing",

  // ---- Vee belts / transmission belts (consumables) ----
  "vee belt", "v-belt", "v belt", "transmission belt", "drive belt",
  "timing belt", "ribbed belt", "multi-rib",
];

// ============================================================================
// 🔴 HIGH Criticality Keywords - Production / Safety Critical
// ============================================================================
// Rule of thumb: If this fails and you can't run, it's HIGH.
// Only match complete equipment assemblies, not parts or fittings
const HIGH_KEYWORDS = [
  // ---- Motors (primary drives) ----
  "motor", "electric motor", "drive motor", "mill motor", "conveyor motor",
  "motor assembly", "main motor", "pump motor", "fan motor", "agitator motor", 
  "feeder motor", "ac motor", "dc motor", "induction motor",
  "gear motor", "vibrator motor", "hydraulic motor",
  
  // ---- Gearboxes / Gear Reducers ----
  "gearbox", "gear box", "gear reducer", "speed reducer", "reduction gearbox",
  "drive gearbox", "helical gearbox", "planetary gearbox", "worm gearbox",
  "bevel gearbox", "right angle gearbox", "mixer gearbox",
  "sew-eurodrive", "sew eurodrive", "nord", "flender", "hansen", // Major brands
  
  // ---- Pumps (complete assemblies — ALL pump units are production critical) ----
  "pump", "pumpset", "pump set",
  "slurry pump", "tailings pump", "process pump", "transfer pump", "feed pump",
  "cip pump", "thickener pump", "reagent pump", "water pump assembly",
  "centrifugal pump", "positive displacement", "diaphragm pump", "peristaltic pump",
  "submersible pump", "borehole pump", "booster pump", "main pump",
  "dosing pump", "aodd pump", "multistage pump", "vertical pump",
  "drainage pump", "diesel pump", "triple pump",
  "warman", "metso", "weir", "krebs", "grundfos", "lowara", "keto", "wilden",
  "ebara", "matec",
  
  // ---- Ball Mill / Mill Components ----
  "pinion", "girth gear", "ball mill", "mill liner set", "mill drive",
  "trunnion", "mill bearing", "ring gear",
  
  // ---- PLC / Critical Control Modules ----
  "plc", "control module", "hmi panel", "hmi screen", "scada", 
  "vfd", "variable frequency drive", "vsd", "variable speed drive",
  "inverter", "soft starter", "power supply module", "cpu module",
  "io module", "comms module", "ethernet module",
  "allen bradley", "siemens s7", "ab plc", "rockwell",
  
  // ---- Crushers / Feeder Drive Assemblies ----
  "crusher", "jaw crusher", "cone crusher", "impact crusher", "gyratory",
  "crusher bowl", "crusher mantle", "crusher concave",
  "apron feeder", "vibrating feeder", "belt feeder", "feeder drive",
  "vibratory feeder", "reciprocating feeder",
  
  // ---- Major Equipment (complete units) ----
  "agitator", "agitator gearbox", "agitator motor",
  "thickener", "thickener drive", "thickener rake",
  "filter press", "plate filter", 
  "centrifuge", "decanter",
  "cyclone", "hydrocyclone",
  "compressor", "air compressor", "screw compressor",
  "blower", "lobe blower", "roots blower",
  "concentrator", "knelson",
  
  // ---- OEM Assemblies / Major Drive Units ----
  "hydraulic drive", "kiln drive", "powder feed drive", "mill feed",
  "mixer", "mixing",
  
  // ---- Hoses (critical process hoses — site-specific HIGH) ----
  "hose", "tubing", "flexible hose", "hydraulic hose", "air hose", "nylon tubing",
  "drag hose", "tpr hose", "pvc hose", "rubber hose", "suction hose", 
  "discharge hose", "layflat hose", "fuel hose", "coolant hose",
  "mining hose", "bellows hose",
  
  // ---- Electrical Critical (major switchgear) ----
  "transformer", "power transformer", "distribution transformer",
  "control transformer",
  "switchgear", "main breaker", "acb", "air circuit breaker",
  "mcc panel", "mcc bucket", "motor control center",
  "generator", "alternator", "genset",
  "ups", "uninterruptible power",
];

// ============================================================================
// 🟠 MEDIUM Criticality Keywords - Reliability / Throughput Impact
// ============================================================================
// Rule of thumb: If failure hurts performance but doesn't stop everything immediately, it's MEDIUM.
const MEDIUM_KEYWORDS = [
  // ---- Bearings ----
  "bearing", "pillow block", "plummer block", "spherical roller", 
  "ball bearing", "tapered roller", "needle bearing", "thrust bearing",
  "split bearing", "self-aligning", "insert bearing", "flange bearing",
  "bearing housing", "bearing unit",
  "bush", "bushing", "bronze bush", "nylon bush",
  "skf", "nsk", "fag", "timken", "ntn", // Major bearing brands
  
  // ---- Seals ----
  "mechanical seal", "shaft seal", "oil seal", "lip seal", 
  "o-ring kit", "seal kit", "gasket set", "gasket kit",
  "face seal", "labyrinth seal", "v-ring", "rotary seal",
  "hydraulic seal kit", "pneumatic seal kit",
  
  // ---- Rollers (conveyor) ----
  "idler", "idler roller", "return roller", "trough roller", "guide roller", 
  "impact roller", "training roller", "tracking roller",
  "head pulley", "tail pulley", "snub pulley", "bend pulley",
  "take-up", "take up pulley", "tension pulley",
  "drum pulley", "drive pulley", "wing pulley",
  
  // ---- Valves (process, slurry, water) ----
  "knife gate", "knife gate valve", "pinch valve", "slurry valve", 
  "butterfly valve", "ball valve", "ball valve assembly", "gate valve", "globe valve",
  "check valve", "non-return valve", "pressure relief valve", "prv",
  "control valve", "modulating valve", "solenoid valve", "pneumatic valve",
  "safety valve", "pressure safety", "actuated valve",
  "diaphragm valve", "plug valve", "needle valve",
  "poly ball valve",
  "clarkson", "isogate", "orbinox", // Major valve brands
  
  // ---- Instrumentation (pressure, flow, level) ----
  "transmitter", "pressure transmitter", "level transmitter", "flow transmitter",
  "pressure gauge", "flow meter", "level sensor", "level indicator",
  "thermocouple", "rtd", "temperature sensor", "temp probe",
  "ph probe", "ph sensor", "conductivity sensor", "turbidity sensor",
  "density meter", "mass flow", "mag flow", "ultrasonic level",
  "radar level", "float switch", "pressure switch",
  "analyser", "analyzer",
  "endress", "rosemount", "yokogawa", "krohne", // Major instrument brands
  
  // ---- Lubrication System Components ----
  "lubrication pump", "lube pump", "oil pump", "grease pump assembly",
  "oil cooler", "lube cooler", "heat exchanger",
  "lubrication system", "auto lube", "centralised lubrication",
  "oil reservoir", "lube reservoir", "oil tank",
  "lincoln", "skf lincoln", "graco", // Major lube brands
  
  // ---- Conveyor Belts (non-primary) ----
  "conveyor belt", "belt splice", "splice kit", "vulcanising kit",
  "belt scraper", "belt cleaner", "belt plough",
  "belt clamp", "belt fastener", "belt lacing",
  
  // ---- Screens and Liners (wear items) ----
  "screen panel", "screen deck", "vibrating screen", "screen cloth",
  "wear liner", "chute liner", "impact liner", "ceramic liner",
  "wear plate", "backing liner", "rubber liner",
  "polyurethane liner", "pu liner", "manganese liner",
  
  // ---- Couplings (drive couplings, not pipe) ----
  "flexible coupling", "fluid coupling", "gear coupling", "jaw coupling",
  "disc coupling", "grid coupling", "elastomeric coupling",
  "coupling element", "coupling insert", "spider coupling",
  "lovejoy", "falk", "rexnord", "dodge", // Major coupling brands
  
  // ---- Cylinders / Actuators ----
  "hydraulic cylinder", "pneumatic cylinder", "actuator", 
  "linear actuator", "rotary actuator", "cylinder kit",
  "piston", "cylinder rod", "cylinder seal kit",
  
  // ---- Pump Parts (moved to LOW to prevent generic "pump" HIGH match) ----
  // (Now handled in LOW_KEYWORDS section)
  
  // ---- Electrical Components (contactors/relays) ----
  "contactor", "motor contactor", "auxiliary contactor",
  "overload relay", "thermal overload", "electronic overload",
  "circuit breaker", "mccb", "mcb", "rcbo", "rcd",
  "fuse", "hrc fuse", "fuse holder", "fuse link",
  "relay", "timer relay", "safety relay", "control relay",
  
  // ---- Belt Alignment / Safety ----
  "belt misalignment", "misalignment switch", "misalignment sensor",
  "pull wire", "pull cord", "emergency stop", "e-stop",
  "belt rip", "rip detector",
  
  // ---- Sprockets / Chain ----
  "sprocket", "chain", "roller chain", "drive chain",
  "chain tensioner", "chain guide",
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
    // Match at word boundaries - the keyword should appear as whole words
    // or at the start/end of compound words
    const regex = new RegExp(`(^|\\s|[^a-z])${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|\\s|[^a-z])`, 'i');
    return regex.test(normalized);
  });
};

/**
 * Classify a spare part based on its description
 * 
 * Priority order: Check LOW first (to exclude fittings/consumables), then HIGH, then MEDIUM
 * This prevents false positives where a fitting contains a HIGH keyword
 */
export const classifyCriticality = (description: string): CriticalityLevel => {
  if (!description) return "LOW";

  // Check LOW first - these are definitely not critical (fittings, consumables)
  if (containsKeyword(description, LOW_KEYWORDS)) {
    return "LOW";
  }

  // Check HIGH - major equipment/components
  if (containsKeyword(description, HIGH_KEYWORDS)) {
    return "HIGH";
  }

  // Check MEDIUM - reliability items
  if (containsKeyword(description, MEDIUM_KEYWORDS)) {
    return "MEDIUM";
  }

  // Default to LOW for unclassified items
  return "LOW";
};

/**
 * Determine if an item should be flagged as critical (is_critical = true)
 * Only HIGH criticality items are flagged as critical
 */
export const isCriticalItem = (description: string): boolean => {
  return classifyCriticality(description) === "HIGH";
};

/**
 * Get criticality level from is_critical flag (legacy support)
 */
export const getCriticalityFromFlag = (isCritical: boolean): CriticalityLevel => {
  return isCritical ? "HIGH" : "MEDIUM"; // Assume MEDIUM if not critical, actual LOW requires keyword check
};

/**
 * Get display color for criticality level using semantic design tokens
 */
export const getCriticalityColor = (level: CriticalityLevel): string => {
  switch (level) {
    case "HIGH":
      return "text-destructive bg-destructive/10 border-destructive/20";
    case "MEDIUM":
      return "text-warning bg-warning/10 border-warning/20";
    case "LOW":
      return "text-primary bg-primary/10 border-primary/20";
  }
};

/**
 * Get display label for criticality level
 */
export const getCriticalityLabel = (level: CriticalityLevel): string => {
  switch (level) {
    case "HIGH":
      return "🔴 High - Production Critical";
    case "MEDIUM":
      return "🟠 Medium - Reliability Impact";
    case "LOW":
      return "🟢 Low - Consumable";
  }
};
