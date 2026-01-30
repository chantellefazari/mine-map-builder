/**
 * Criticality Classification Utility
 * 
 * Classifies spare parts into HIGH/MEDIUM/LOW criticality based on description keywords.
 * 
 * HIGH (Red): Production/Safety critical - immediate plant stoppage, long lead times
 * MEDIUM (Orange): Reliability/Throughput impact - degraded mode, manageable delay
 * LOW (Green): Operational/Consumable - minimal disruption, readily available
 * 
 * PRIORITY ORDER: LOW keywords are checked FIRST to ensure fittings/consumables
 * are never falsely elevated to HIGH even if they contain equipment keywords.
 */

export type CriticalityLevel = "HIGH" | "MEDIUM" | "LOW";

// LOW Criticality Keywords - Operational/Consumable
// These are checked FIRST to ensure pipe fittings and consumables don't get flagged as critical
const LOW_KEYWORDS = [
  // Pipe fittings - these are NEVER critical (most common false positives)
  "socket", "nipple", "elbow", "tee", "reducer", "union", "flange", "blind flange",
  "pipe fitting", "threaded", "bsp", "npt", "coupler", "coupling fitting",
  "compression fitting", "electrofusion", "stub flange", "poly nipple",
  "reducing bush", "reducing nipple", "hex reducing", "pipe clamp",
  // Fasteners
  "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor", "rivet",
  // Hoses and tubes - not assemblies
  "hose", "tubing", "flexible hose", "hydraulic hose", "air hose", "nylon tubing",
  "drag hose", "tpr hose", "pvc hose",
  // Filters - consumable
  "filter element", "filter cartridge", "strainer", "air filter", "oil filter", "fuel filter",
  // Electrical consumables - tapes, ties, terminals
  "electrical tape", "insulation tape", "insulating tape", "pvc tape",
  "cable tie", "wire", "terminal", "lug", "heat shrink", "cable gland",
  // Grease fittings
  "grease nipple", "zerk", "lubrication fitting",
  // Minor fittings
  "clamp", "clip", "bracket", "shim", "spacer", "key", "keyway",
  // Skirting and liners - consumable wear items
  "skirting rubber",
  // PPE-related
  "ppe", "glove", "safety", "earmuff", "glasses", "respirator",
  // Non-critical items
  "indicator light", "lamp", "led", "signage",
  // General consumables
  "consumable", "disposable", "cleaning", "rag", "degreaser",
  // Small parts
  "pin", "cotter", "circlip", "snap ring", "dowel",
  // Belts - transmission belts are consumables
  "vee belt", "v-belt", "v belt", "transmission belt", "drive belt",
  // Pipe materials
  "hdpe pipe", "pvc pipe", "poly pipe",
  // Packing
  "gland packing", "packing ring",
  // Shims and covers
  "bearing cap", "shim bearing",
  // Wedges and scrapers
  "wedge", "scraper",
  // Extension cables and connectors
  "extension", "connector extension",
  // Divider valves - small lubrication components
  "divider valve",
];

// HIGH Criticality Keywords - Production/Safety Critical
// Only match complete equipment assemblies, not parts or fittings
const HIGH_KEYWORDS = [
  // Motors - specific to complete drive motors (not motor parts)
  "drive motor", "mill motor", "conveyor motor", "electric motor", "motor assembly",
  "main motor", "pump motor", "fan motor", "agitator motor", "feeder motor",
  // Gearboxes - actual gearbox assemblies
  "gearbox", "gear box", "gear reducer", "speed reducer", "drive gearbox",
  "reducer gearbox", "helical gearbox", "planetary gearbox",
  "sew-eurodrive", "sew eurodrive", // Major gearbox brand
  // Major Pumps - complete pump units, not pump parts
  "slurry pump", "tailings pump", "process pump", "transfer pump", "feed pump",
  "cip pump", "thickener pump", "reagent pump", "water pump assembly",
  // Mill components - major items
  "pinion", "girth gear", "ball mill", "mill liner",
  // Control systems - complete units
  "plc", "control module", "hmi panel", "scada", "vfd", "variable frequency drive",
  "inverter", "soft starter",
  // Crushers & Feeders - complete units
  "crusher", "jaw crusher", "cone crusher", "impact crusher",
  "apron feeder", "vibrating feeder", "belt feeder", "feeder drive",
  // Major equipment - complete units
  "agitator", "thickener", "filter press", "centrifuge", "cyclone",
  // Electrical critical - major switchgear only
  "transformer", "switchgear", "main breaker", "mcc panel",
];

// MEDIUM Criticality Keywords - Reliability/Throughput Impact
const MEDIUM_KEYWORDS = [
  // Bearings - important but replaceable
  "bearing", "pillow block", "spherical roller", "ball bearing", "tapered roller",
  "bush", "bushing",
  // Seals - important wear items
  "mechanical seal", "shaft seal", "oil seal", "lip seal", "o-ring", "gasket set",
  // Rollers - conveyor components
  "idler", "return roller", "trough roller", "guide roller", "impact roller",
  "head pulley", "tail pulley", "snub pulley", "take-up",
  // Valves - process valves (distinct from fittings)
  "knife gate", "pinch valve", "slurry valve", "butterfly valve", "ball valve assembly",
  "check valve", "pressure relief", "control valve", "solenoid valve",
  "safety valve",
  // Instrumentation
  "transmitter", "pressure gauge", "flow meter", "level sensor", "thermocouple", "rtd",
  "ph probe", "conductivity", "turbidity",
  // Lubrication systems
  "lubrication pump", "oil cooler", "grease pump", "lubrication system",
  // Conveyor components - major items
  "conveyor belt", "splice kit", "belt scraper",
  // Screens and liners - wear items
  "screen panel", "wear liner", "chute liner", "impact liner",
  // Couplings - drive couplings (not pipe couplings)
  "flexible coupling", "fluid coupling", "gear coupling",
  // Cylinders
  "hydraulic cylinder", "pneumatic cylinder", "actuator",
  // Pump parts - components that need replacement
  "impeller", "pump casing", "volute", "wear ring", "throat bush",
  // Motor parts (not whole motors)
  "motor bearing", "motor fan", "motor terminal",
  // Electrical components - contactors/relays
  "contactor", "overload relay", "circuit breaker", "fuse",
  // Belt alignment
  "belt misalignment", "misalignment switch", "misalignment arm",
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
      return "High - Production Critical";
    case "MEDIUM":
      return "Medium - Reliability Impact";
    case "LOW":
      return "Low - Consumable";
  }
};
