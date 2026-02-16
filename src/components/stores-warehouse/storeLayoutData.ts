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

export interface LaydownZone {
  id: string;
  label: string;
  shortLabel: string;
  type: "dome-row" | "yard-bay";
  color: string;
  bgColor: string;
  borderColor: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  physicalWidthM: number;
  physicalDepthM: number;
  description: string;
}

export interface SiteFeature {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  position: { x: number; y: number };
  width: number;
  height: number;
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
  ldGapM: number;
}

// U-shape yard dimensions
export const YARD_DIMENSIONS: YardDimensions = {
  totalWidthM: 24,
  totalDepthM: 30,
  accessRoadWidthM: 4,
  walkwayWidthM: 1.5,
  containerSpacingM: 0.4,
  courtyardWidthM: 12, // 12m between left and right legs
  courtyardDepthM: 12,
  forkliftGapM: 0,
  outerClearanceM: 2.5,
  ldGapM: 5, // 5m gap between compound and laydown
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
 *    C02 (20ft)                   C04 (20ft)
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

// Compute 3D positions from 2D layout so they always match
const YARD_CENTRE_X = (LEFT_X + RIGHT_X + CONTAINER_20FT_W) / 2;
const YARD_CENTRE_Z = (TOP_Y + BASE_Y + CONTAINER_40FT_H) / 2;
const S3D = 0.5; // 3D scale: 0.5 units per metre

function pos3D(posX: number, posY: number, w: number, h: number) {
  return {
    x: ((posX + w / 2) - YARD_CENTRE_X) / PX_PER_M * S3D,
    y: 0,
    z: ((posY + h / 2) - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}

// Export for 3D ground/dome alignment
export const YARD_3D_CENTRE = { x: YARD_CENTRE_X, z: YARD_CENTRE_Z };

export function dome3DPosition() {
  const cx = COURTYARD_START_X + (YARD_DIMENSIONS.courtyardWidthM * PX_PER_M) / 2;
  const cz = TOP_Y + (DOME_DIMENSIONS.depthM * PX_PER_M) / 2;
  return {
    x: (cx - YARD_CENTRE_X) / PX_PER_M * S3D,
    z: (cz - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}

export function base3DPosition() {
  const cx = C03_X + CONTAINER_40FT_W / 2;
  const cz = BASE_Y + CONTAINER_40FT_H / 2;
  return {
    x: (cx - YARD_CENTRE_X) / PX_PER_M * S3D,
    z: (cz - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}

export function leftLeg3DPosition() {
  const cx = LEFT_X + CONTAINER_20FT_W / 2;
  const cz = TOP_Y + (CONTAINER_20FT_H * 2 + GAP_BETWEEN) / 2;
  return {
    x: (cx - YARD_CENTRE_X) / PX_PER_M * S3D,
    z: (cz - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}

export function rightLeg3DPosition() {
  const cx = RIGHT_X + CONTAINER_20FT_W / 2;
  const cz = TOP_Y + (CONTAINER_20FT_H * 2 + GAP_BETWEEN) / 2;
  return {
    x: (cx - YARD_CENTRE_X) / PX_PER_M * S3D,
    z: (cz - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}

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
    label: "Right Leg — Precision & Access",
    description: "Fasteners & Mechanical Precision (daily access)",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.06)",
    position: { x: RIGHT_X - 5, y: TOP_Y - 5, width: CONTAINER_20FT_W + 10, height: CONTAINER_20FT_H * 2 + GAP_BETWEEN + 10 },
  },
  {
    id: "base",
    label: "Base — Mechanical Wear",
    description: "40ft container, wear parts & heavy mechanical",
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
    zone: "EL",
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
    position3D: pos3D(LEFT_X, TOP_Y, CONTAINER_20FT_W, CONTAINER_20FT_H),
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
    zone: "IN",
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
    position3D: pos3D(LEFT_X, BOTTOM_20FT_Y, CONTAINER_20FT_W, CONTAINER_20FT_H),
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
    zone: "ME",
    zoneCode: "ME",
    label: "Mechanical",
    shortLabel: "Mechanical",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    borderColor: "#3b82f6",
    environment: "Standard industrial, dry storage, high-density",
    containerType: "40ft Standard Container",
    shelves: ["A", "B", "C", "D", "E", "F", "G", "H"],
    binsPerShelf: 12,
    position: { x: C03_X, y: BASE_Y },
    width: CONTAINER_40FT_W,
    height: CONTAINER_40FT_H,
    position3D: pos3D(C03_X, BASE_Y, CONTAINER_40FT_W, CONTAINER_40FT_H),
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
      { name: "Wear Parts", items: ["Wear plates", "Liners (rubber, ceramic)", "Screen panels", "Crusher liners"] },
      { name: "Conveyor", items: ["Rollers", "Idlers", "Scraper blades", "Belt cleaners", "Belts", "Pulleys"] },
      { name: "Transmission", items: ["Couplings (heavy)", "Sprockets", "Chains"] },
      { name: "Valves & Pipe", items: ["Valves (small–medium)", "Pipe fittings", "Flanges", "Elbows", "Hoses"] },
      { name: "Pumps (spares)", items: ["Seal kits", "Impellers (small)", "Wear rings", "Shaft sleeves", "Gland packing"] },
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
    zone: "CS",
    zoneCode: "CS",
    label: "Consumables & Supplies",
    shortLabel: "Consumables",
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
    position3D: pos3D(RIGHT_X, TOP_Y, CONTAINER_20FT_W, CONTAINER_20FT_H),
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
    id: "C04",
    zone: "MP",
    zoneCode: "MP",
    label: "Mechanical Precision",
    shortLabel: "Precision",
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.15)",
    borderColor: "#06b6d4",
    environment: "Dry, organised precision bins",
    containerType: "20ft Standard Container",
    shelves: ["A", "B", "C", "D", "E"],
    binsPerShelf: 9,
    position: { x: RIGHT_X, y: BOTTOM_20FT_Y },
    width: CONTAINER_20FT_W,
    height: CONTAINER_20FT_H,
    position3D: pos3D(RIGHT_X, BOTTOM_20FT_Y, CONTAINER_20FT_W, CONTAINER_20FT_H),
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
    growthAllowance: "15%",
    specialRequirements: ["Dry storage", "Precision bins", "Anti-contamination"],
    stockingCategories: [
      { name: "Bearings", items: ["Bearings (all types)", "Pillow blocks", "Spherical rollers"] },
      { name: "Seals", items: ["O-rings", "Gaskets", "Mechanical seals", "Oil seals"] },
      { name: "Precision", items: ["Shims", "Keys & key stock", "Retaining rings", "Circlips", "Bushes"] },
      { name: "Small Mech", items: ["Small couplings", "Small shafts", "Small valves (<DN150)"] },
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
  { code: "EL", label: "Electrical" },
  { code: "IN", label: "Instrumentation & Pneumatics" },
  { code: "ME", label: "Mechanical" },
  { code: "MP", label: "Mechanical Precision" },
  { code: "CS", label: "Consumables & Supplies" },
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

/* ============ LAYDOWN ZONES ============ */

// Laydown area starts 5m below the compound base
const LD_START_Y = BASE_Y + CONTAINER_40FT_H + YARD_DIMENSIONS.ldGapM * PX_PER_M;
const LD_ROW_W = 7 * PX_PER_M; // 7m wide pallet rows
const LD_ROW_H = 2.5 * PX_PER_M; // 2.5m deep
const LD_ROW_GAP = 0.5 * PX_PER_M;
const FORKLIFT_X = LEFT_X + LD_ROW_W + 1 * PX_PER_M;
const FORKLIFT_W = 3 * PX_PER_M;
const LD_BAY_W = 2 * PX_PER_M; // 2m wide vertical bays
const LD_BAY_H = 5 * PX_PER_M; // 5m deep
const LD_BAY_GAP = 0.5 * PX_PER_M;
const LD_BAY_START_X = FORKLIFT_X + FORKLIFT_W + 1 * PX_PER_M;

export const LAYDOWN_ZONES: LaydownZone[] = [
  {
    id: "LD-B",
    label: "Dome Internal Row B",
    shortLabel: "LD-B",
    type: "dome-row",
    color: "#16a34a",
    bgColor: "rgba(22, 163, 74, 0.12)",
    borderColor: "#16a34a",
    position: { x: LEFT_X, y: LD_START_Y },
    width: LD_ROW_W,
    height: LD_ROW_H,
    physicalWidthM: 7,
    physicalDepthM: 2.5,
    description: "Dome-sheltered pallet row — heavy liners, large pump assemblies",
  },
  {
    id: "LD-A",
    label: "Dome Internal Row A",
    shortLabel: "LD-A",
    type: "dome-row",
    color: "#16a34a",
    bgColor: "rgba(22, 163, 74, 0.15)",
    borderColor: "#16a34a",
    position: { x: LEFT_X, y: LD_START_Y + LD_ROW_H + LD_ROW_GAP },
    width: LD_ROW_W,
    height: LD_ROW_H,
    physicalWidthM: 7,
    physicalDepthM: 2.5,
    description: "Dome-sheltered pallet row — structural steel, pipe lengths",
  },
  {
    id: "LD-C",
    label: "Laydown Bay C",
    shortLabel: "LD-C",
    type: "yard-bay",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.12)",
    borderColor: "#78716c",
    position: { x: LD_BAY_START_X, y: LD_START_Y },
    width: LD_BAY_W,
    height: LD_BAY_H,
    physicalWidthM: 2,
    physicalDepthM: 5,
    description: "Open yard bay — heavy equipment, palletised spares",
  },
  {
    id: "LD-D",
    label: "Laydown Bay D",
    shortLabel: "LD-D",
    type: "yard-bay",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.15)",
    borderColor: "#78716c",
    position: { x: LD_BAY_START_X + LD_BAY_W + LD_BAY_GAP, y: LD_START_Y },
    width: LD_BAY_W,
    height: LD_BAY_H,
    physicalWidthM: 2,
    physicalDepthM: 5,
    description: "Open yard bay — crusher liners, screen panels",
  },
  {
    id: "LD-E",
    label: "Laydown Bay E",
    shortLabel: "LD-E",
    type: "yard-bay",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.12)",
    borderColor: "#78716c",
    position: { x: LD_BAY_START_X + 2 * (LD_BAY_W + LD_BAY_GAP), y: LD_START_Y },
    width: LD_BAY_W,
    height: LD_BAY_H,
    physicalWidthM: 2,
    physicalDepthM: 5,
    description: "Open yard bay — air receivers, large motors",
  },
  {
    id: "LD-F",
    label: "Laydown Bay F",
    shortLabel: "LD-F",
    type: "yard-bay",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.15)",
    borderColor: "#78716c",
    position: { x: LD_BAY_START_X + 3 * (LD_BAY_W + LD_BAY_GAP), y: LD_START_Y },
    width: LD_BAY_W,
    height: LD_BAY_H,
    physicalWidthM: 2,
    physicalDepthM: 5,
    description: "Open yard bay — overflow / project staging",
  },
];

/** Forklift access lane geometry */
export const FORKLIFT_LANE: SiteFeature = {
  id: "forklift-access",
  label: "Forklift Access",
  color: "#ca8a04",
  bgColor: "rgba(202, 138, 4, 0.15)",
  borderColor: "#ca8a04",
  position: { x: FORKLIFT_X, y: LD_START_Y },
  width: FORKLIFT_W,
  height: LD_ROW_H * 2 + LD_ROW_GAP,
};

/** Delivery / receival zone */
export const DELIVERY_ZONE: SiteFeature = {
  id: "delivery",
  label: "Delivery",
  color: "#dc2626",
  bgColor: "rgba(220, 38, 38, 0.15)",
  borderColor: "#dc2626",
  position: {
    x: LD_BAY_START_X + 2 * (LD_BAY_W + LD_BAY_GAP),
    y: LD_START_Y + LD_BAY_H + 3 * PX_PER_M,
  },
  width: 5 * PX_PER_M,
  height: 3 * PX_PER_M,
};

/** Laydown zone group for the legend */
export const LAYDOWN_ZONE_GROUP: LayoutZoneGroup = {
  id: "laydown",
  label: "Laydown & External Storage",
  description: "LD-A/B dome rows, LD-C→F open yard bays",
  color: "#16a34a",
  bgColor: "rgba(22, 163, 74, 0.04)",
  position: {
    x: LEFT_X - 5,
    y: LD_START_Y - 20,
    width: LD_BAY_START_X + 4 * (LD_BAY_W + LD_BAY_GAP) - LEFT_X + 15,
    height: LD_BAY_H + 30,
  },
};

/** SVG dimensions for the full site */
export const SVG_DIMENSIONS = {
  width: Math.max(620, LD_BAY_START_X + 4 * (LD_BAY_W + LD_BAY_GAP) + 30),
  height: LD_START_Y + LD_BAY_H + 3 * PX_PER_M + 3 * PX_PER_M + 40,
};

/** 3D helpers for laydown zones */
export function ldZone3DPosition(zone: LaydownZone) {
  const cx = zone.position.x + zone.width / 2;
  const cz = zone.position.y + zone.height / 2;
  return {
    x: (cx - YARD_CENTRE_X) / PX_PER_M * S3D,
    z: (cz - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}

export function forkliftLane3DPosition() {
  const cx = FORKLIFT_LANE.position.x + FORKLIFT_LANE.width / 2;
  const cz = FORKLIFT_LANE.position.y + FORKLIFT_LANE.height / 2;
  return {
    x: (cx - YARD_CENTRE_X) / PX_PER_M * S3D,
    z: (cz - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}

export function deliveryZone3DPosition() {
  const cx = DELIVERY_ZONE.position.x + DELIVERY_ZONE.width / 2;
  const cz = DELIVERY_ZONE.position.y + DELIVERY_ZONE.height / 2;
  return {
    x: (cx - YARD_CENTRE_X) / PX_PER_M * S3D,
    z: (cz - YARD_CENTRE_Z) / PX_PER_M * S3D,
  };
}
