/**
 * Visual Parts Catalogue Constants
 * Aligned with Site Parts Numbering Standard (TCMG) Part Category Codes CC 01–22
 * and live site_spares database category values.
 */
export const PART_CATEGORIES = [
  "Pump Component",             // CC 01
  "Motor Component",            // CC 02
  "Gearbox",                    // CC 03
  "Bearing",                    // CC 04
  "Valve",                      // CC 05
  "Instrumentation",            // CC 06
  "Electrical",                 // CC 07
  "Conveyor Component",         // CC 08
  "Wear Parts",                 // CC 09
  "Mechanical",                 // CC 10
  "Structural Steel",           // CC 23
  "Pipe Fitting",               // CC 11
  "Seal",                       // CC 12
  "Filter",                     // CC 13
  "Lubrication System",         // CC 14
  "Air & Pneumatic",            // CC 15
  "Tanks & Vessels",            // CC 16
  "Safety Equipment",           // CC 17
  "Power Generation",           // CC 18
  "Tooling",                    // CC 19
  "Rigging",                    // CC 19 (sub-category)
  "PPE",                        // CC 19 (sub-category)
  "OEM Assembly",               // CC 20
  "Fastener",                   // CC 21
  "Consumables",                // CC 22
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
