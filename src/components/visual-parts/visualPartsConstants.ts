/**
 * Visual Parts Catalogue Constants
 * Aligned with Site Parts Numbering Standard (TCMG) Part Category Codes CC 01–23
 */
export const PART_CATEGORIES = [
  "Pumps",                          // CC 01
  "Motors",                         // CC 02
  "Gearboxes / Reducers",          // CC 03
  "Bearings",                       // CC 04
  "Valves",                         // CC 05
  "Instrumentation",                // CC 06
  "Electrical Components",          // CC 07
  "Conveying Components",           // CC 08
  "Wear Parts",                     // CC 09
  "Mechanical",                     // CC 10
  "Hoses & Pipework",              // CC 11
  "Seals & Gaskets",               // CC 12
  "Filters",                        // CC 13
  "Lubrication System Components",  // CC 14
  "Air & Pneumatic Components",     // CC 15
  "Tanks & Vessels",                // CC 16
  "Safety Equipment",               // CC 17
  "Power Generation & Distribution", // CC 18
  "Tooling",                        // CC 19
  "Rigging",                        // CC 19b
  "PPE",                            // CC 19c
  "OEM Assemblies / Packages",      // CC 20
  "Fasteners",                      // CC 21
  "Consumables",                    // CC 22
] as const;

export const CRITICALITY_LEVELS = ["HIGH", "MEDIUM", "LOW"] as const;

export const getCriticalityColor = (criticality: string): string => {
  const upper = criticality?.toUpperCase() || "";
  switch (upper) {
    case "HIGH":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "MEDIUM":
      return "bg-warning/20 text-warning border-warning/30";
    case "LOW":
    default:
      return "bg-success/20 text-success border-success/30";
  }
};
