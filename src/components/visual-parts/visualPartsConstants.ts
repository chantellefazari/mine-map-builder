export const PART_CATEGORIES = [
  "General",
  "Pump Component",
  "Valve",
  "Fastener",
  "Liner",
  "Electrical",
  "Bearing",
  "Seal / Gasket",
  "Belt / Chain",
  "Filter",
  "Motor Component",
  "Gearbox Component",
  "Instrumentation",
  "Hydraulic",
  "Pneumatic",
  "Structural",
  "Wear Part",
  "Safety Equipment",
  "Tooling",
  "Rigging",
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
