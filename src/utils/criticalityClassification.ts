/**
 * Criticality Classification Utility
 * 
 * Classifies spare parts into HIGH/MEDIUM/LOW criticality based on description keywords.
 * 
 * HIGH (Red): Production/Safety critical - immediate plant stoppage, long lead times
 * MEDIUM (Orange): Reliability/Throughput impact - degraded mode, manageable delay
 * LOW (Green): Operational/Consumable - minimal disruption, readily available
 */

export type CriticalityLevel = "HIGH" | "MEDIUM" | "LOW";

// HIGH Criticality Keywords - Production/Safety Critical
// These must be specific to avoid false positives on fittings/consumables
const HIGH_KEYWORDS = [
  // Motors - specific to drive motors
  "drive motor", "mill motor", "conveyor motor", "electric motor", "motor assembly",
  "main motor", "pump motor", "fan motor", "agitator motor", "feeder motor",
  // Gearboxes - actual gearbox assemblies
  "gearbox", "gear box", "gear reducer", "speed reducer", "drive gearbox",
  "reducer gearbox", "helical gearbox", "planetary gearbox",
  // Major Pumps - not pump parts
  "slurry pump", "tailings pump", "process pump", "transfer pump", "feed pump",
  "cip pump", "thickener pump", "reagent pump", "water pump assembly",
  // Mill components
  "pinion", "girth gear", "ball mill", "mill liner",
  // Control systems
  "plc", "control module", "hmi panel", "scada", "vfd", "variable frequency drive",
  "inverter", "soft starter",
  // Crushers & Feeders - actual units
  "crusher", "jaw crusher", "cone crusher", "impact crusher",
  "apron feeder", "vibrating feeder", "belt feeder", "feeder drive",
  // Major equipment
  "agitator", "thickener", "filter press", "centrifuge", "cyclone",
  // Electrical critical - major items only
  "transformer", "switchgear", "main breaker", "mcc panel",
];

// MEDIUM Criticality Keywords - Reliability/Throughput Impact
const MEDIUM_KEYWORDS = [
  // Bearings
  "bearing", "pillow block", "spherical roller", "ball bearing", "tapered roller",
  "bush", "bushing",
  // Seals
  "mechanical seal", "shaft seal", "oil seal", "lip seal", "o-ring", "gasket set", "packing",
  // Rollers - conveyor components
  "idler", "return roller", "trough roller", "guide roller", "impact roller",
  "head pulley", "tail pulley", "snub pulley", "take-up",
  // Valves - process valves (not fittings)
  "knife gate", "pinch valve", "slurry valve", "butterfly valve", "ball valve assembly",
  "check valve", "pressure relief", "control valve", "solenoid valve",
  // Instrumentation
  "transmitter", "pressure gauge", "flow meter", "level sensor", "thermocouple", "rtd",
  "ph probe", "conductivity", "turbidity",
  // Lubrication systems
  "lubrication pump", "oil cooler", "grease pump", "lubrication system",
  // Conveyor components
  "conveyor belt", "splice kit", "belt scraper", "skirting rubber",
  // Screens and liners
  "screen panel", "wear liner", "chute liner", "impact liner",
  // Couplings
  "coupling", "flexible coupling", "fluid coupling", "gear coupling",
  // Cylinders
  "hydraulic cylinder", "pneumatic cylinder", "actuator",
  // Pump parts
  "impeller", "pump casing", "volute", "wear ring", "throat bush",
  // Motor parts (not whole motors)
  "motor bearing", "motor fan", "motor terminal",
  // Electrical components
  "contactor", "overload relay", "circuit breaker", "fuse",
];

// LOW Criticality Keywords - Operational/Consumable
const LOW_KEYWORDS = [
  // Pipe fittings - these are NOT critical
  "socket", "nipple", "elbow", "tee", "reducer", "union", "flange", "blind flange",
  "pipe fitting", "threaded", "bsp", "npt",
  // Fasteners
  "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor", "rivet",
  // Hoses and tubes
  "hose", "tubing", "flexible hose", "hydraulic hose", "air hose",
  // Filters - consumable
  "filter element", "filter cartridge", "strainer", "air filter", "oil filter", "fuel filter",
  // Grease fittings
  "grease nipple", "zerk", "lubrication fitting",
  // Minor fittings
  "clamp", "clip", "bracket", "shim", "spacer", "key", "keyway",
  // Electrical consumables
  "cable tie", "wire", "terminal", "lug", "tape", "heat shrink", "cable gland",
  // PPE-related
  "ppe", "glove", "safety", "earmuff", "glasses", "respirator",
  // Non-critical items
  "indicator light", "lamp", "led", "signage",
  // General consumables
  "consumable", "disposable", "cleaning", "rag", "degreaser",
  // Small parts
  "pin", "cotter", "circlip", "snap ring", "dowel",
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
    // Match whole words or as part of compound words
    const regex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
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
