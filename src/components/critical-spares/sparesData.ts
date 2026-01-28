// Critical Spares Register Data
// IMPORTANT: All quantities are PROVISIONAL - Pending P&ID Walkdown & Engineering Review
// Data populated ONLY from user-provided documents. TBC = To Be Confirmed
// Criticality marked as "Assumed" until user explicitly confirms

export interface SpareItem {
  id: string;
  // Hierarchy linkage
  area: string;
  subArea: string;
  system: string;
  parentAsset: string;
  // Component details
  componentName: string;
  componentType: string;
  sparePartDescription: string;
  oemPartNumber: string;
  // Criticality
  spareCriticality: "High" | "Medium" | "Low" | "";
  criticalitySource: "Confirmed" | "Assumed" | "";
  reasonCritical: string;
  // Provisional quantities
  minQtyProvisional: string; // "TBC" if not supported by documents
  maxQtyProvisional: string; // "TBC" if not supported by documents
  quantityConfidence: "Low" | "Medium" | "High" | "";
  // Other fields
  leadTime: string;
  storageRequirement: string;
  notes: string;
  status: "Provisional" | "Confirmed" | "TBC";
}

// Empty array - Critical spares will be populated only when user explicitly marks items as critical
// Full site catalogue is separate and will contain all spares
export const sparesData: SpareItem[] = [];

// Component types for filtering
export const componentTypes = [
  "Motor",
  "Gearbox",
  "Pump",
  "Valve",
  "Roller",
  "Bearing",
  "Seal",
  "Coupling",
  "Belt",
  "Chain",
  "Sprocket",
  "Impeller",
  "Liner",
  "Screen",
  "Sensor",
  "Actuator",
  "Pulley",
  "Consumable",
  "Heater",
  "Injector",
  "Turbo",
  "Membrane",
  "Gear",
];

// Criticality colors
export const criticalityColors: Record<string, string> = {
  "High": "bg-destructive/20 text-destructive",
  "Medium": "bg-amber-500/20 text-amber-700",
  "Low": "bg-muted text-muted-foreground",
  "": "",
};

// Status colors
export const statusColors: Record<string, string> = {
  "Provisional": "bg-amber-500/20 text-amber-700",
  "Confirmed": "bg-green-500/20 text-green-700",
  "TBC": "bg-muted text-muted-foreground",
};

// Confidence colors
export const confidenceColors: Record<string, string> = {
  "High": "bg-green-500/20 text-green-700",
  "Medium": "bg-amber-500/20 text-amber-700",
  "Low": "bg-red-500/20 text-red-700",
  "": "bg-muted text-muted-foreground",
};

// Criticality source colors
export const criticalitySourceColors: Record<string, string> = {
  "Confirmed": "bg-green-500/20 text-green-700",
  "Assumed": "bg-amber-500/20 text-amber-700",
  "": "",
};
