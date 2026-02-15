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

export type ContainerOrientation = "horizontal" | "vertical";

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
  /** Orientation in yard layout: "vertical" = length along depth, "horizontal" = length along width */
  orientation: ContainerOrientation;
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
  courtyardWidthM: number;
  courtyardDepthM: number;
  forkliftGapM: number;
  outerClearanceM: number;
}

// U-shape yard dimensions
export const YARD_DIMENSIONS: YardDimensions = {
  totalWidthM: 22,
  totalDepthM: 18,
  accessRoadWidthM: 4,
  walkwayWidthM: 1.5,
  containerSpacingM: 0.4,
  courtyardWidthM: 12, // 12m between left and right legs
  courtyardDepthM: 12,
  forkliftGapM: 0,
  outerClearanceM: 2.5,
};

// Dome physical footprint (sits inside courtyard)
export const DOME_DIMENSIONS = {
  widthM: 12,
  depthM: 9.5,
};

/*
 * U-SHAPE LAYOUT (scale: 25px per metre)
 *
 *  Left Leg (vertical):        Right Leg (vertical):
 *    C01 (20ft)                   C05 (20ft)
 *    C02 (20ft)                   C06 (20ft)
 *
 *  Base (horizontal):
 *    C03 (40ft) — spans full base between legs
 *
 *  Dome footprint (9.5m × 12m) sits inside the courtyard
 */

// Scale: 25px per metre
const PX_PER_M = 25;

// Derived positions
const LEFT_X = YARD_DIMENSIONS.outerClearanceM * PX_PER_M;
const CONTAINER_20FT_W = 2.44 * PX_PER_M; // 61
const CONTAINER_20FT_H = 6.06 * PX_PER_M; // 151.5
const CONTAINER_40FT_W = 12.19 * PX_PER_M; // 305
const CONTAINER_40FT_H = 2.44 * PX_PER_M; // 61
const COURTYARD_START_X = LEFT_X + CONTAINER_20FT_W;
const RIGHT_X = COURTYARD_START_X + YARD_DIMENSIONS.courtyardWidthM * PX_PER_M;
const TOP_Y = 30;
const GAP_BETWEEN = YARD_DIMENSIONS.containerSpacingM * PX_PER_M;
const BOTTOM_20FT_Y = TOP_Y + CONTAINER_20FT_H + GAP_BETWEEN;
// C03 sits behind the dome concrete (9.5m deep), flush between the legs
const BASE_Y = TOP_Y + DOME_DIMENSIONS.depthM * PX_PER_M;
// C03 starts flush with left leg inner edge
const C03_X = COURTYARD_START_X;

// Zone groups for the U-shape layout
export const LAYOUT_ZONE_GROUPS: LayoutZoneGroup[] = [
  {
    id: "left-leg",
    label: "Left Leg — Clean Zone",
    description: "Electrical & Instrumentation (dust-controlled)",
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.06)",
    position: { x: LEFT_X - 5, y: TOP_Y - 5, width: CONTAINER_20FT_W + 10, height: CONTAINER_20FT_H * 2 + GAP_BETWEEN + 10 },
  },
  {
    id: "right-leg",
    label: "Right Leg — High-Access",
    description: "Fasteners & Lubrication (daily access)",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.06)",
    position: { x: RIGHT_X - 5, y: TOP_Y - 5, width: CONTAINER_20FT_W + 10, height: CONTAINER_20FT_H * 2 + GAP_BETWEEN + 10 },
  },
  {
    id: "base",
    label: "Base — Mechanical",
    description: "40ft container, main mechanical stores",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.06)",
    position: { x: C03_X - 5, y: BASE_Y - 5, width: CONTAINER_40FT_W + 10, height: CONTAINER_40FT_H + 10 },
  },
  {
    id: "dome",
    label: "Dome Area",
    description: `${DOME_DIMENSIONS.widthM}m × ${DOME_DIMENSIONS.depthM}m covered courtyard`,
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.04)",
    position: {
      x: COURTYARD_START_X,
      y: TOP_Y,
      width: YARD_DIMENSIONS.courtyardWidthM * PX_PER_M,
      height: DOME_DIMENSIONS.depthM * PX_PER_M,
    },
  },
];

export const STORE_CONTAINERS: StoreContainer[] = [
  // ===== LEFT LEG (vertical) =====
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
    position: { x: LEFT_X, y: TOP_Y },
    width: CONTAINER_20FT_W,
    height: CONTAINER_20FT_H,
    position3D: { x: -3.6, y: 0, z: -1.6 },
    orientation: "vertical",
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
    position: { x: LEFT_X, y: BOTTOM_20FT_Y },
    width: CONTAINER_20FT_W,
    height: CONTAINER_20FT_H,
    position3D: { x: -3.6, y: 0, z: 1.6 },
    orientation: "vertical",
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

  // ===== BASE OF U (horizontal — 40ft) =====
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
    containerType: "40ft Standard Container",
    shelves: ["A", "B", "C", "D", "E", "F", "G", "H"],
    binsPerShelf: 12,
    position: { x: C03_X, y: BASE_Y },
    width: CONTAINER_40FT_W,
    height: CONTAINER_40FT_H,
    position3D: { x: -0.6, y: 0, z: 4.8 },
    orientation: "horizontal",
    physicalDimensions: {
      externalLengthM: 12.19,
      externalWidthM: 2.44,
      externalHeightM: 2.59,
      internalLengthM: 12.03,
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

  // ===== RIGHT LEG (vertical) =====
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
    position: { x: RIGHT_X, y: TOP_Y },
    width: CONTAINER_20FT_W,
    height: CONTAINER_20FT_H,
    position3D: { x: 3.6, y: 0, z: -1.6 },
    orientation: "vertical",
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

  // ===== RIGHT LEG LOWER (vertical) =====
  {
    id: "C06",
    zone: "STO-LU",
    zoneCode: "LU",
    label: "Lubrication & Oils",
    shortLabel: "Lubrication",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "#f59e0b",
    environment: "Ventilated, spill containment",
    containerType: "20ft Standard Container",
    shelves: ["A", "B", "C", "D", "E"],
    binsPerShelf: 9,
    position: { x: RIGHT_X, y: BOTTOM_20FT_Y },
    width: CONTAINER_20FT_W,
    height: CONTAINER_20FT_H,
    position3D: { x: 3.6, y: 0, z: 1.6 },
    orientation: "vertical",
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
      { type: "end-double", side: "front", widthCm: 230, description: "Double cargo doors — full-width access" },
    ],
    accessFrequency: "Daily",
    growthAllowance: "20%",
    specialRequirements: ["Ventilated area", "Spill containment tray", "Spill kit accessible", "No ignition sources"],
    stockingCategories: [
      { name: "Grease", items: ["Grease cartridges", "Grease nipples", "Auto-lube injectors"] },
      { name: "Oil", items: ["Oil sample bottles", "Oil filters", "Lube lines & fittings"] },
      { name: "Monitoring", items: ["Breathers", "Sight glasses", "Level indicators", "Desiccant breathers"] },
      { name: "Fittings", items: ["Elbows", "Tees", "Reducers", "Unions", "Couplings", "Flanges"] },
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
  { code: "FA", label: "Fasteners" },
  { code: "SE", label: "Seals" },
  { code: "SA", label: "Safety / PPE" },
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
