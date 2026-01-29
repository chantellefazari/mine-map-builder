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
const HIGH_KEYWORDS = [
  // Motors
  "motor", "drive motor", "mill motor", "conveyor motor",
  // Gearboxes
  "gearbox", "gear box", "gear reducer", "reducer",
  // Pumps
  "pump", "cip pump", "tailings pump", "process pump", "water pump", "slurry pump",
  // Mill components
  "pinion", "girth gear", "mill liner", "ball mill",
  // Control systems
  "plc", "control module", "hmi", "scada", "vfd", "variable frequency", "inverter",
  // Crushers & Feeders
  "crusher", "feeder", "apron feeder", "vibrating feeder",
  // Major equipment
  "agitator", "thickener", "filter press", "centrifuge",
  // Electrical critical
  "transformer", "switchgear", "circuit breaker", "contactor",
];

// MEDIUM Criticality Keywords - Reliability/Throughput Impact
const MEDIUM_KEYWORDS = [
  // Bearings
  "bearing", "bush", "bushing",
  // Seals
  "seal", "o-ring", "gasket", "packing",
  // Rollers
  "roller", "idler", "pulley", "trough roller", "return roller", "guide roller",
  // Valves
  "valve", "gate valve", "ball valve", "butterfly valve", "check valve", "solenoid valve",
  // Instrumentation
  "sensor", "transmitter", "gauge", "meter", "probe", "thermocouple", "rtd",
  "pressure", "flow", "level", "temperature",
  // Lubrication
  "lubrication", "oil cooler", "grease pump", "lubrication pump",
  // Conveyor components
  "belt", "conveyor belt", "splice", "scraper", "skirting",
  // Screens and liners
  "screen", "liner", "wear plate", "chute liner",
  // Couplings
  "coupling", "flexible coupling",
  // Cylinders
  "cylinder", "hydraulic cylinder", "pneumatic cylinder",
];

// LOW Criticality Keywords - Operational/Consumable
const LOW_KEYWORDS = [
  // Fasteners
  "bolt", "nut", "washer", "screw", "stud", "fastener", "anchor",
  // Hoses
  "hose", "tubing", "pipe fitting", "fitting",
  // Filters
  "filter", "filter element", "strainer",
  // Grease fittings
  "grease nipple", "zerk", "lubrication fitting",
  // Minor fittings
  "clamp", "clip", "bracket", "shim",
  // Electrical consumables
  "cable tie", "wire", "terminal", "lug", "tape", "heat shrink",
  // PPE-related
  "ppe", "glove", "safety", "earmuff", "glasses",
  // Non-critical sensors
  "indicator", "light", "lamp", "led",
  // General consumables
  "consumable", "disposable", "cleaning",
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
 * Priority order: HIGH > MEDIUM > LOW
 * If no keywords match, defaults to LOW
 */
export const classifyCriticality = (description: string): CriticalityLevel => {
  if (!description) return "LOW";

  // Check HIGH first (most critical)
  if (containsKeyword(description, HIGH_KEYWORDS)) {
    return "HIGH";
  }

  // Check MEDIUM next
  if (containsKeyword(description, MEDIUM_KEYWORDS)) {
    return "MEDIUM";
  }

  // Default to LOW
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
