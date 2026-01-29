export type SupplierType = "OEM" | "Critical Spares Supplier" | "Trade / General Supplier" | "Service Provider";

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  type: SupplierType;
  workPhone: string;
  mobile: string;
  email: string;
  whatUsedFor: string;
  notes: string;
}

export const supplierTypes: SupplierType[] = [
  "OEM",
  "Critical Spares Supplier",
  "Trade / General Supplier",
  "Service Provider",
];

export const supplyCategories = [
  "Motors",
  "Gearboxes",
  "Valves",
  "Electrical",
  "Consumables",
  "Pumps",
  "Bearings",
  "Belts & Pulleys",
  "Hydraulics",
  "Pneumatics",
  "Filtration",
  "Instrumentation",
  "Safety Equipment",
  "Structural Steel",
  "Welding Supplies",
  "Lubricants",
  "Fasteners",
  "Seals & Gaskets",
];

// Empty array - suppliers will be manually added
export const suppliers: Supplier[] = [];
