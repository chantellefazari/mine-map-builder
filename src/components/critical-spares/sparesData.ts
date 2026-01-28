// Critical Spares Register Data
// Only items explicitly flagged as critical from the Site Spares Catalogue appear here
// This register is for high-priority spares that require special stock management

export interface SpareItem {
  id: string;
  // Hierarchy linkage
  area: string;
  subArea: string;
  system: string;
  parentAsset: string;
  pidTag: string;
  // Component details
  componentName: string;
  componentType: string;
  sparePartDescription: string;
  oemPartNumber: string;
  manufacturer: string;
  vendor: string;
  assetManufacturer: string;
  assetModel: string;
  // Criticality
  spareCriticality: "High" | "Medium" | "Low" | "";
  criticalitySource: "Confirmed" | "Assumed" | "";
  reasonCritical: string;
  // Quantities
  minQty: string;
  maxQty: string;
  qtyPerSystem: string;
  unitPrice: string;
  uom: string;
  // Other fields
  notes: string;
  status: "Provisional" | "Confirmed" | "TBC";
}

// Critical Spares data - Populated when items are flagged as critical in Site Spares Catalogue
// Currently empty - flag items in Site Spares to populate this register
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
  "Impeller",
  "Liner",
  "Screen",
  "Sensor",
  "Actuator",
  "Pulley",
  "Consumable",
  "Heater",
  "Filter",
  "Electrical",
  "Mechanical",
  "Wear Items",
  "Pillow Block",
];

// Area codes for filtering
export const areaCodes = [
  "Grinding",
  "Leaching",
  "Adsorption",
  "Reagents",
  "Gold System",
  "Thickener",
  "Filter Press",
  "Water Services",
  "Air Services",
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

// Criticality source colors
export const criticalitySourceColors: Record<string, string> = {
  "Confirmed": "bg-green-500/20 text-green-700",
  "Assumed": "bg-amber-500/20 text-amber-700",
  "": "",
};
