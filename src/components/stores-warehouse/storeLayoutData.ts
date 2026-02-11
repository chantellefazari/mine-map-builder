export interface ShelfBin {
  id: string; // e.g., "A1"
  shelf: string; // e.g., "A"
  bin: number; // e.g., 1
}

export interface ContainerZone {
  code: string; // e.g., "ME"
  label: string;
}

export interface StockingCategory {
  name: string;
  items: string[];
}

export interface PhysicalDimensions {
  /** External length in metres */
  externalLengthM: number;
  /** External width in metres */
  externalWidthM: number;
  /** External height in metres */
  externalHeightM: number;
  /** Internal usable length in metres */
  internalLengthM: number;
  /** Internal usable width in metres */
  internalWidthM: number;
  /** Internal usable height in metres */
  internalHeightM: number;
  /** Aisle width inside container in cm */
  aisleWidthCm: number;
  /** Racking depth in cm */
  rackingDepthCm: number;
}

export type EntryType = "end-single" | "end-double" | "side-door" | "cage-front" | "roll-up";
export type EntrySide = "left" | "right" | "front" | "back";

export interface EntryPoint {
  type: EntryType;
  side: EntrySide;
  widthCm: number;
  /** Describes door operation */
  description: string;
}

export interface StoreContainer {
  id: string;
  zone: string;
  zoneCode: string;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  environment: string;
  containerType: string;
  shelves: string[];
  binsPerShelf: number;
  // 2D layout position (yard)
  position: { x: number; y: number };
  width: number;
  height: number;
  // 3D position
  position3D: { x: number; y: number; z: number };
  // Physical dimensions
  physicalDimensions: PhysicalDimensions;
  entryPoints: EntryPoint[];
  // Design info
  accessFrequency: "Daily" | "Weekly" | "Monthly";
  growthAllowance: string;
  specialRequirements: string[];
  stockingCategories: StockingCategory[];
  shelfHeightCm: number;
  binWidthCm: number;
  binDepthCm: number;
  maxItemWeightKg: number;
  /** Bottom shelf height from floor in cm */
  bottomShelfHeightCm: number;
  /** Top shelf max height from floor in cm */
  topShelfMaxHeightCm: number;
}

export interface LayoutZoneGroup {
  id: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  position: { x: number; y: number; width: number; height: number };
}

export interface YardDimensions {
  totalWidthM: number;
  totalDepthM: number;
  accessRoadWidthM: number;
  walkwayWidthM: number;
  containerSpacingM: number;
}

export const YARD_DIMENSIONS: YardDimensions = {
  totalWidthM: 25,
  totalDepthM: 18,
  accessRoadWidthM: 4,
  walkwayWidthM: 1.5,
  containerSpacingM: 2,
};

// Optimized grouped layout for mining store yard
export const LAYOUT_ZONE_GROUPS: LayoutZoneGroup[] = [
  {
    id: "clean",
    label: "Clean Zone",
    description: "Dust-controlled, climate-stable",
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.08)",
    position: { x: 30, y: 20, width: 540, height: 160 },
  },
  {
    id: "mechanical",
    label: "Mechanical Zone",
    description: "Standard industrial, dry storage",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.08)",
    position: { x: 30, y: 210, width: 360, height: 160 },
  },
  {
    id: "highaccess",
    label: "High-Access Zone",
    description: "Near entry, daily access",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.08)",
    position: { x: 30, y: 400, width: 360, height: 160 },
  },
  {
    id: "fittings",
    label: "Fittings Zone",
    description: "Pipe fittings & plumbing, size-sorted",
    color: "#0ea5e9",
    bgColor: "rgba(14, 165, 233, 0.08)",
    position: { x: 30, y: 560, width: 360, height: 160 },
  },
  {
    id: "hazmat",
    label: "Hazmat Zone",
    description: "Ventilated, spill containment",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.08)",
    position: { x: 420, y: 210, width: 150, height: 160 },
  },
];

export const STORE_CONTAINERS: StoreContainer[] = [
  {
    id: "C01",
    zone: "STO-EL",
    zoneCode: "EL",
    label: "Electrical Components",
    shortLabel: "Electrical",
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.15)",
    borderColor: "#eab308",
    environment: "Dust-controlled, airflow, sealed cabinets",
    containerType: "20ft Modified Container",
    shelves: ["A", "B", "C", "D"],
    binsPerShelf: 6,
    position: { x: 50, y: 40 },
    width: 240,
    height: 120,
    position3D: { x: -3, y: 0, z: -3 },
    physicalDimensions: {
      externalLengthM: 6.06,
      externalWidthM: 2.44,
      externalHeightM: 2.59,
      internalLengthM: 5.9,
      internalWidthM: 2.35,
      internalHeightM: 2.39,
      aisleWidthCm: 90,
      rackingDepthCm: 60,
    },
    entryPoints: [
      { type: "side-door", side: "right", widthCm: 90, description: "Sealed personnel door with weather strip — keeps dust out" },
    ],
    accessFrequency: "Daily",
    growthAllowance: "20%",
    specialRequirements: ["Dust-controlled airflow", "Sealed cabinets for PLC/VSD", "Anti-static mats"],
    stockingCategories: [
      { name: "Protection", items: ["Fuses", "Circuit breakers (MCB, MCCB)", "Overload relays"] },
      { name: "Control", items: ["Contactors", "Control relays", "Power supplies", "Terminal blocks"] },
      { name: "Switching", items: ["Push buttons", "Selector switches", "Indicator lights", "Isolator handles"] },
      { name: "PLC / Drives", items: ["VSD spare boards", "PLC I/O cards", "PLC CPUs"] },
      { name: "Sensors", items: ["Photo sensors", "Proximity sensors", "Cable glands", "Ferrules"] },
      { name: "Cooling", items: ["Panel cooling fans", "Panel filters"] },
    ],
    shelfHeightCm: 50,
    binWidthCm: 40,
    binDepthCm: 50,
    maxItemWeightKg: 15,
    bottomShelfHeightCm: 30,
    topShelfMaxHeightCm: 180,
  },
  {
    id: "C02",
    zone: "STO-IN",
    zoneCode: "IN",
    label: "Instrumentation & Control",
    shortLabel: "Instruments",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.15)",
    borderColor: "#a855f7",
    environment: "Clean, dust-free, climate preferred",
    containerType: "20ft Modified Container",
    shelves: ["A", "B", "C", "D"],
    binsPerShelf: 6,
    position: { x: 310, y: 40 },
    width: 240,
    height: 120,
    position3D: { x: 3, y: 0, z: -3 },
    physicalDimensions: {
      externalLengthM: 6.06,
      externalWidthM: 2.44,
      externalHeightM: 2.59,
      internalLengthM: 5.9,
      internalWidthM: 2.35,
      internalHeightM: 2.39,
      aisleWidthCm: 90,
      rackingDepthCm: 60,
    },
    entryPoints: [
      { type: "end-single", side: "front", widthCm: 90, description: "Single end door — standard personnel access" },
    ],
    accessFrequency: "Weekly",
    growthAllowance: "10%",
    specialRequirements: ["Clean/dust-free environment", "Labelled bins", "Fragile item protection"],
    stockingCategories: [
      { name: "Pressure", items: ["Pressure transmitters", "Pressure gauges"] },
      { name: "Flow", items: ["Flow switches", "Flow meters (small)"] },
      { name: "Level / Temp", items: ["Level switches", "Temperature probes (RTD/TC)"] },
      { name: "Control", items: ["Solenoid valves", "Position switches", "Small actuators"] },
      { name: "Fittings", items: ["Instrument fittings (SS, brass)", "Tubing", "Manifolds", "Instrument filters"] },
    ],
    shelfHeightCm: 50,
    binWidthCm: 40,
    binDepthCm: 50,
    maxItemWeightKg: 10,
    bottomShelfHeightCm: 30,
    topShelfMaxHeightCm: 180,
  },
  {
    id: "C03",
    zone: "STO-ME",
    zoneCode: "ME",
    label: "Mechanical Small Parts",
    shortLabel: "Mechanical",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    borderColor: "#3b82f6",
    environment: "Standard industrial, dry storage",
    containerType: "20ft Standard Container",
    shelves: ["A", "B", "C", "D", "E"],
    binsPerShelf: 9,
    position: { x: 50, y: 230 },
    width: 320,
    height: 120,
    position3D: { x: 0, y: 0, z: 0 },
    physicalDimensions: {
      externalLengthM: 6.06,
      externalWidthM: 2.44,
      externalHeightM: 2.59,
      internalLengthM: 5.9,
      internalWidthM: 2.35,
      internalHeightM: 2.39,
      aisleWidthCm: 80,
      rackingDepthCm: 60,
    },
    entryPoints: [
      { type: "end-double", side: "front", widthCm: 230, description: "Double cargo doors — full-width access for loading" },
    ],
    accessFrequency: "Daily",
    growthAllowance: "15%",
    specialRequirements: ["Dry storage", "Organised bins", "Heavy bins at bottom shelves"],
    stockingCategories: [
      { name: "Bearings", items: ["Bearings (all sizes)", "Bearing housings (small)"] },
      { name: "Seals", items: ["Oil seals", "Lip seals", "Mechanical seals", "O-rings", "Gaskets"] },
      { name: "Transmission", items: ["Couplings", "Coupling inserts", "Keys & key stock", "Shims"] },
      { name: "Conveyor", items: ["Idler rollers", "Scraper blades", "Belt fasteners", "Pulley lagging"] },
      { name: "Pumps", items: ["Seal kits", "Impellers (small)", "Wear rings", "Shaft sleeves", "Gland packing"] },
      { name: "Valves", items: ["Small valves", "Ball valves", "Check valves", "Valve seal kits", "Diaphragms"] },
    ],
    shelfHeightCm: 40,
    binWidthCm: 26,
    binDepthCm: 50,
    maxItemWeightKg: 15,
    bottomShelfHeightCm: 20,
    topShelfMaxHeightCm: 180,
  },
  {
    id: "C04",
    zone: "STO-LU",
    zoneCode: "LU",
    label: "Lubrication & Oils",
    shortLabel: "Lubrication",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "#f59e0b",
    environment: "Ventilated, spill containment",
    containerType: "10ft Container / Cage",
    shelves: ["A", "B", "C"],
    binsPerShelf: 4,
    position: { x: 430, y: 230 },
    width: 130,
    height: 120,
    position3D: { x: 5, y: 0, z: 0 },
    physicalDimensions: {
      externalLengthM: 2.99,
      externalWidthM: 2.44,
      externalHeightM: 2.59,
      internalLengthM: 2.8,
      internalWidthM: 2.35,
      internalHeightM: 2.39,
      aisleWidthCm: 80,
      rackingDepthCm: 70,
    },
    entryPoints: [
      { type: "cage-front", side: "front", widthCm: 240, description: "Open cage front — full ventilation, mesh sides for airflow" },
    ],
    accessFrequency: "Daily",
    growthAllowance: "10%",
    specialRequirements: ["Ventilated area", "Spill containment tray", "Spill kit accessible", "No ignition sources"],
    stockingCategories: [
      { name: "Grease", items: ["Grease cartridges", "Grease nipples", "Auto-lube injectors"] },
      { name: "Oil", items: ["Oil sample bottles", "Oil filters", "Lube lines & fittings"] },
      { name: "Monitoring", items: ["Breathers", "Sight glasses", "Level indicators", "Desiccant breathers"] },
    ],
    shelfHeightCm: 55,
    binWidthCm: 70,
    binDepthCm: 60,
    maxItemWeightKg: 15,
    bottomShelfHeightCm: 25,
    topShelfMaxHeightCm: 165,
  },
  {
    id: "C05",
    zone: "STO-FA",
    zoneCode: "FA",
    label: "Fasteners & Consumables",
    shortLabel: "Fasteners",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.15)",
    borderColor: "#64748b",
    environment: "Standard, high-access bins",
    containerType: "20ft Standard Container",
    shelves: ["A", "B", "C", "D", "E", "F"],
    binsPerShelf: 9,
    position: { x: 50, y: 420 },
    width: 320,
    height: 120,
    position3D: { x: 0, y: 0, z: 3 },
    physicalDimensions: {
      externalLengthM: 6.06,
      externalWidthM: 2.44,
      externalHeightM: 2.59,
      internalLengthM: 5.9,
      internalWidthM: 2.35,
      internalHeightM: 2.39,
      aisleWidthCm: 75,
      rackingDepthCm: 55,
    },
    entryPoints: [
      { type: "end-double", side: "front", widthCm: 230, description: "Double cargo doors — full-width for daily high-volume access" },
    ],
    accessFrequency: "Daily",
    growthAllowance: "25%",
    specialRequirements: ["High-organisation bins (Kanban friendly)", "Clear labelling", "Small parts trays"],
    stockingCategories: [
      { name: "Fasteners", items: ["Bolts", "Nuts", "Washers", "Studs", "Anchors", "Threaded rod"] },
      { name: "Clips", items: ["U-bolts", "Hose clamps", "Retaining clips", "Pins"] },
      { name: "Hoses", items: ["Hydraulic hoses (short)", "Hose ends", "Adaptors"] },
      { name: "Sealants", items: ["PTFE tape", "Thread sealant", "Adhesives"] },
      { name: "Consumables", items: ["Rags", "Absorbents", "PPE consumables (gloves, earplugs)"] },
    ],
    shelfHeightCm: 35,
    binWidthCm: 26,
    binDepthCm: 45,
    maxItemWeightKg: 15,
    bottomShelfHeightCm: 15,
    topShelfMaxHeightCm: 180,
  },
  {
    id: "C06",
    zone: "STO-FT",
    zoneCode: "FT",
    label: "Pipe Fittings & Plumbing",
    shortLabel: "Fittings",
    color: "#0ea5e9",
    bgColor: "rgba(14, 165, 233, 0.15)",
    borderColor: "#0ea5e9",
    environment: "Standard industrial, dry storage",
    containerType: "20ft Standard Container",
    shelves: ["A", "B", "C", "D", "E"],
    binsPerShelf: 9,
    position: { x: 50, y: 580 },
    width: 320,
    height: 120,
    position3D: { x: 0, y: 0, z: 6 },
    physicalDimensions: {
      externalLengthM: 6.06,
      externalWidthM: 2.44,
      externalHeightM: 2.59,
      internalLengthM: 5.9,
      internalWidthM: 2.35,
      internalHeightM: 2.39,
      aisleWidthCm: 80,
      rackingDepthCm: 60,
    },
    entryPoints: [
      { type: "end-double", side: "front", widthCm: 230, description: "Double cargo doors — full-width access for loading pipe fittings" },
    ],
    accessFrequency: "Daily",
    growthAllowance: "20%",
    specialRequirements: ["Size-sorted bins", "Clearly labelled by type & size", "Heavy fittings on lower shelves"],
    stockingCategories: [
      { name: "Fittings", items: ["Elbows", "Tees", "Reducers", "Unions", "Couplings", "Flanges"] },
      { name: "Nipples", items: ["Barrel nipples", "Hex nipples", "Reducing nipples", "Close nipples"] },
      { name: "Valves (small)", items: ["Gate valves (≤50mm)", "Ball valves (≤50mm)", "Check valves (≤50mm)"] },
      { name: "Adaptors", items: ["BSP adaptors", "NPT adaptors", "Camlock fittings", "Barb fittings"] },
      { name: "Pipe Clamps", items: ["Pipe supports", "U-bolts (pipe)", "Saddle clamps", "Pipe hangers"] },
    ],
    shelfHeightCm: 40,
    binWidthCm: 26,
    binDepthCm: 50,
    maxItemWeightKg: 15,
    bottomShelfHeightCm: 20,
    topShelfMaxHeightCm: 180,
  },
];

export const ZONE_CODES: ContainerZone[] = [
  { code: "ME", label: "Mechanical" },
  { code: "EL", label: "Electrical" },
  { code: "IN", label: "Instrumentation" },
  { code: "HY", label: "Hydraulics" },
  { code: "PN", label: "Pneumatics" },
  { code: "FI", label: "Filters" },
  { code: "BR", label: "Bearings" },
  { code: "FT", label: "Fasteners" },
  { code: "SE", label: "Seals" },
  { code: "LU", label: "Lubrication" },
  { code: "SA", label: "Safety / PPE" },
  { code: "FT", label: "Fittings" },
];

export function generateBinsForContainer(container: StoreContainer): ShelfBin[] {
  const bins: ShelfBin[] = [];
  for (const shelf of container.shelves) {
    for (let bin = 1; bin <= container.binsPerShelf; bin++) {
      bins.push({ id: `${shelf}${bin}`, shelf, bin });
    }
  }
  return bins;
}

/** Get total container internal area in m² */
export function getContainerAreaM2(container: StoreContainer): number {
  const d = container.physicalDimensions;
  return Math.round(d.internalLengthM * d.internalWidthM * 100) / 100;
}

/** Get usable racking area (both sides minus aisle) in m² */
export function getRackingAreaM2(container: StoreContainer): number {
  const d = container.physicalDimensions;
  const rackingWidthM = (d.internalWidthM * 100 - d.aisleWidthCm) / 100;
  return Math.round(rackingWidthM * d.internalLengthM * 100) / 100;
}
