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
] as const;

export const CRITICALITY_LEVELS = ["High", "Medium", "Non-Critical"] as const;

export const getCriticalityColor = (criticality: string): string => {
  switch (criticality) {
    case "High":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "Medium":
      return "bg-warning/20 text-warning border-warning/30";
    case "Non-Critical":
    default:
      return "bg-muted text-muted-foreground";
  }
};
