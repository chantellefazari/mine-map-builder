/**
 * Container Fitout Specifications
 * 
 * All dimensions in millimetres (mm).
 * Coordinate system: origin at top-left of internal space.
 *   x → along container length (long axis)
 *   y → along container width (short axis)
 * 
 * "Top wall" = rear long wall (no door)
 * "Bottom wall" = door long wall
 * "Left wall" = end wall 1
 * "Right wall" = end wall 2
 */

export type FurnitureType =
  | "shelving-bay"
  | "bin-wall"
  | "cabinet"
  | "drawer-unit"
  | "rack"
  | "conduit-bracket"
  | "foam-totes"
  | "ppe-rack"
  | "bunded-shelf"
  | "flat-shelf"
  | "esd-panel"
  | "reinforced-shelf";

export interface FitoutItem {
  id: string;
  label: string;
  shortLabel: string;
  type: FurnitureType;
  x: number;
  y: number;
  width: number;  // along x
  height: number; // along y
}

export interface DoorSpec {
  wall: "top" | "bottom" | "left" | "right";
  offsetMm: number;
  widthMm: number;
  label: string;
}

export interface ContainerFitout {
  containerId: string;
  internalLengthMm: number;
  internalWidthMm: number;
  door: DoorSpec;
  items: FitoutItem[];
  notes: string[];
}

/** Colour palette by furniture type */
export const FURNITURE_COLORS: Record<FurnitureType, { fill: string; stroke: string }> = {
  "shelving-bay":     { fill: "rgba(59,130,246,0.18)",  stroke: "#3b82f6" },
  "bin-wall":         { fill: "rgba(245,158,11,0.20)",  stroke: "#f59e0b" },
  "cabinet":          { fill: "rgba(71,85,105,0.22)",   stroke: "#475569" },
  "drawer-unit":      { fill: "rgba(99,102,241,0.18)",  stroke: "#6366f1" },
  "rack":             { fill: "rgba(20,184,166,0.18)",   stroke: "#14b8a6" },
  "conduit-bracket":  { fill: "rgba(156,163,175,0.20)", stroke: "#9ca3af" },
  "foam-totes":       { fill: "rgba(56,189,248,0.18)",  stroke: "#38bdf8" },
  "ppe-rack":         { fill: "rgba(34,197,94,0.20)",   stroke: "#22c55e" },
  "bunded-shelf":     { fill: "rgba(234,88,12,0.20)",   stroke: "#ea580c" },
  "flat-shelf":       { fill: "rgba(139,92,246,0.18)",   stroke: "#8b5cf6" },
  "esd-panel":        { fill: "rgba(236,72,153,0.18)",   stroke: "#ec4899" },
  "reinforced-shelf": { fill: "rgba(37,99,235,0.22)",    stroke: "#2563eb" },
};

const RACK_D = 600; // standard racking depth mm
const BAY_W = 900;  // standard bay width mm
const DRAWER_W = 700;
const END_D = 500;  // depth of end-wall items into container

// ─── C01-EL  Electrical (20ft, side-door on long wall) ──────────────────
const C01_L = 5900;
const C01_W = 2350;
const C01_DOOR_OFFSET = 2200;
const C01_DOOR_W = 900;
const C01_DOOR_END = C01_DOOR_OFFSET + C01_DOOR_W;

export const C01_FITOUT: ContainerFitout = {
  containerId: "C01",
  internalLengthMm: C01_L,
  internalWidthMm: C01_W,
  door: { wall: "bottom", offsetMm: C01_DOOR_OFFSET, widthMm: C01_DOOR_W, label: "Side Personnel Door (900mm)" },
  items: [
    // ── Top wall (rear): 5 steel shelving bays + 1 reinforced section ──
    { id: "c01-bay1", label: "Steel Shelving Bay 1", shortLabel: "Bay 1", type: "shelving-bay", x: 50, y: 0, width: BAY_W, height: RACK_D },
    { id: "c01-bay2", label: "Steel Shelving Bay 2", shortLabel: "Bay 2", type: "shelving-bay", x: 1000, y: 0, width: BAY_W, height: RACK_D },
    { id: "c01-bay3", label: "Steel Shelving Bay 3", shortLabel: "Bay 3", type: "shelving-bay", x: 1950, y: 0, width: BAY_W, height: RACK_D },
    { id: "c01-bay4", label: "Steel Shelving Bay 4", shortLabel: "Bay 4", type: "shelving-bay", x: 2900, y: 0, width: BAY_W, height: RACK_D },
    { id: "c01-bay5", label: "Steel Shelving Bay 5", shortLabel: "Bay 5", type: "shelving-bay", x: 3850, y: 0, width: BAY_W, height: RACK_D },
    { id: "c01-reinf", label: "Reinforced VSD Shelf Section", shortLabel: "VSD Shelf", type: "reinforced-shelf", x: 4850, y: 0, width: 950, height: RACK_D },

    // ── Bottom wall (door side): left of door ──
    { id: "c01-esd1", label: "ESD Bin Wall 1", shortLabel: "ESD 1", type: "esd-panel", x: 100, y: C01_W - RACK_D, width: BAY_W, height: RACK_D },
    { id: "c01-esd2", label: "ESD Bin Wall 2", shortLabel: "ESD 2", type: "esd-panel", x: 1100, y: C01_W - RACK_D, width: BAY_W, height: RACK_D },

    // ── Bottom wall: right of door ──
    { id: "c01-vsd", label: "Reinforced VSD Shelving", shortLabel: "VSD Rack", type: "reinforced-shelf", x: C01_DOOR_END + 100, y: C01_W - RACK_D, width: 2600, height: RACK_D },

    // ── Left end wall: sealed PLC cabinet ──
    { id: "c01-plc", label: "Sealed PLC Cabinet", shortLabel: "PLC Cab.", type: "cabinet", x: 0, y: 750, width: END_D, height: 800 },

    // ── Right end wall: conduit brackets + fan rack ──
    { id: "c01-conduit", label: "Conduit Brackets (×6) + Panel Fan Rack", shortLabel: "Conduit", type: "conduit-bracket", x: C01_L - END_D, y: 200, width: END_D, height: 500 },
    { id: "c01-fan", label: "Panel Fan/Filter Vertical Rack", shortLabel: "Fan Rack", type: "rack", x: C01_L - END_D, y: 800, width: END_D, height: 600 },
  ],
  notes: [
    "Anti-static mats inside sealed PLC cabinet",
    "Door reinforced with weather strip — keeps dust out",
    "Conduit brackets mounted near ceiling (above top shelf line)",
    "ESD panels protect sensitive components from electrostatic discharge",
  ],
};

// ─── C02-IN  Instrumentation (20ft, side-door) ─────────────────────────
const C02_L = 5900;
const C02_W = 2350;
const C02_DOOR_OFFSET = 2500;
const C02_DOOR_W = 900;
const C02_DOOR_END = C02_DOOR_OFFSET + C02_DOOR_W;

export const C02_FITOUT: ContainerFitout = {
  containerId: "C02",
  internalLengthMm: C02_L,
  internalWidthMm: C02_W,
  door: { wall: "bottom", offsetMm: C02_DOOR_OFFSET, widthMm: C02_DOOR_W, label: "Side Personnel Door (900mm)" },
  items: [
    // ── Top wall (rear): 4 foam-lined bays ──
    { id: "c02-bay1", label: "Foam-Lined Bay 1", shortLabel: "Bay 1", type: "shelving-bay", x: 200, y: 0, width: BAY_W, height: RACK_D },
    { id: "c02-bay2", label: "Foam-Lined Bay 2", shortLabel: "Bay 2", type: "shelving-bay", x: 1150, y: 0, width: BAY_W, height: RACK_D },
    { id: "c02-bay3", label: "Foam-Lined Bay 3", shortLabel: "Bay 3", type: "shelving-bay", x: 2100, y: 0, width: BAY_W, height: RACK_D },
    { id: "c02-bay4", label: "Foam-Lined Bay 4", shortLabel: "Bay 4", type: "shelving-bay", x: 3050, y: 0, width: BAY_W, height: RACK_D },
    // Additional foam totes area
    { id: "c02-foam", label: "40× Foam Storage Totes", shortLabel: "Foam Totes", type: "foam-totes", x: 4050, y: 0, width: 1600, height: RACK_D },

    // ── Bottom wall: left of door — drawer cabinets ──
    { id: "c02-drw1", label: "Drawer Cabinet 1 (Swagelok)", shortLabel: "Drw. 1", type: "drawer-unit", x: 200, y: C02_W - RACK_D, width: DRAWER_W, height: RACK_D },
    { id: "c02-drw2", label: "Drawer Cabinet 2 (Fittings)", shortLabel: "Drw. 2", type: "drawer-unit", x: 1000, y: C02_W - RACK_D, width: DRAWER_W, height: RACK_D },

    // ── Bottom wall: right of door — shelving ──
    { id: "c02-bay5", label: "Boxed Instruments Bay 1", shortLabel: "Instr. 1", type: "shelving-bay", x: C02_DOOR_END + 100, y: C02_W - RACK_D, width: BAY_W, height: RACK_D },
    { id: "c02-bay6", label: "Boxed Instruments Bay 2", shortLabel: "Instr. 2", type: "shelving-bay", x: C02_DOOR_END + 1100, y: C02_W - RACK_D, width: BAY_W, height: RACK_D },

    // ── Left end wall: tubing rack ──
    { id: "c02-tube", label: "Tubing Reel Rack (Vertical)", shortLabel: "Tubing", type: "rack", x: 0, y: 650, width: END_D, height: 1000 },
  ],
  notes: [
    "Foam-lined shelves to protect fragile instruments",
    "40 foam totes (400×300×120mm) for delicate parts",
    "Tubing rack stores instrument tubing vertically",
    "Fragile zone signage at entry",
  ],
};

// ─── C03-ME  Mechanical 40ft (side-door on long wall) ───────────────────
const C03_L = 12030;
const C03_W = 2350;
const C03_DOOR_OFFSET = 4865;
const C03_DOOR_W = 2300; // double cargo doors
const C03_DOOR_END = C03_DOOR_OFFSET + C03_DOOR_W;

export const C03_FITOUT: ContainerFitout = {
  containerId: "C03",
  internalLengthMm: C03_L,
  internalWidthMm: C03_W,
  door: { wall: "bottom", offsetMm: C03_DOOR_OFFSET, widthMm: C03_DOOR_W, label: "Double Cargo Doors (2300mm)" },
  items: [
    // ── Top wall (rear): 9 heavy-duty bays ──
    ...Array.from({ length: 9 }, (_, i) => ({
      id: `c03-bay${i + 1}`,
      label: `Heavy-Duty Bay ${i + 1}`,
      shortLabel: `HD ${i + 1}`,
      type: "shelving-bay" as FurnitureType,
      x: 100 + i * 1100,
      y: 0,
      width: BAY_W,
      height: RACK_D,
    })),

    // ── Bottom wall: left of door — 4 heavy-duty bays ──
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `c03-bay${10 + i}`,
      label: `Heavy-Duty Bay ${10 + i}`,
      shortLabel: `HD ${10 + i}`,
      type: "shelving-bay" as FurnitureType,
      x: 200 + i * 1050,
      y: C03_W - RACK_D,
      width: BAY_W,
      height: RACK_D,
    })),

    // ── Bottom wall: right of door — 4 heavy-duty bays ──
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `c03-bay${14 + i}`,
      label: `Heavy-Duty Bay ${14 + i}`,
      shortLabel: `HD ${14 + i}`,
      type: "shelving-bay" as FurnitureType,
      x: C03_DOOR_END + 200 + i * 1050,
      y: C03_W - RACK_D,
      width: BAY_W,
      height: RACK_D,
    })),

    // ── Left end wall: V-belt rack ──
    { id: "c03-vbelt", label: "Custom V-Belt Rack (Fabricated)", shortLabel: "V-Belt", type: "rack", x: 0, y: 550, width: 600, height: 1200 },

    // ── Right end wall: long material rack ──
    { id: "c03-longmat", label: "Long Material Rack (Conduit, Flat Bar)", shortLabel: "Long Mat.", type: "rack", x: C03_L - 600, y: 550, width: 600, height: 1200 },
  ],
  notes: [
    "16–17 heavy-duty bays total (9 rear + 4+4 opposite)",
    "80 heavy totes distributed across bays",
    "All manual handling ≤15 kg — no pallet racks, no forklifts",
    "Door cut reinforced: top beam + vertical posts",
    "Do NOT mount shelving to cut frame — freestanding bays only",
  ],
};

// ─── C04-MP  Mechanical Precision (20ft, side-door) ─────────────────────
const C04_L = 5900;
const C04_W = 2350;
const C04_DOOR_OFFSET = 2500;
const C04_DOOR_W = 900;
const C04_DOOR_END = C04_DOOR_OFFSET + C04_DOOR_W;

export const C04_FITOUT: ContainerFitout = {
  containerId: "C04",
  internalLengthMm: C04_L,
  internalWidthMm: C04_W,
  door: { wall: "bottom", offsetMm: C04_DOOR_OFFSET, widthMm: C04_DOOR_W, label: "Side Personnel Door (900mm)" },
  items: [
    // ── Top wall (rear): 6 steel shelving bays ──
    { id: "c04-bay1", label: "Steel Shelving Bay 1", shortLabel: "Bay 1", type: "shelving-bay", x: 50, y: 0, width: BAY_W, height: RACK_D },
    { id: "c04-bay2", label: "Steel Shelving Bay 2", shortLabel: "Bay 2", type: "shelving-bay", x: 1000, y: 0, width: BAY_W, height: RACK_D },
    { id: "c04-bay3", label: "Steel Shelving Bay 3", shortLabel: "Bay 3", type: "shelving-bay", x: 1950, y: 0, width: BAY_W, height: RACK_D },
    { id: "c04-bay4", label: "Steel Shelving Bay 4", shortLabel: "Bay 4", type: "shelving-bay", x: 2900, y: 0, width: BAY_W, height: RACK_D },
    { id: "c04-bay5", label: "Steel Shelving Bay 5", shortLabel: "Bay 5", type: "shelving-bay", x: 3850, y: 0, width: BAY_W, height: RACK_D },
    { id: "c04-bay6", label: "Steel Shelving Bay 6", shortLabel: "Bay 6", type: "shelving-bay", x: 4800, y: 0, width: BAY_W, height: RACK_D },

    // ── Bottom wall: left of door — seal drawer cabinets ──
    { id: "c04-drw1", label: "Seal Drawer Cabinet 1", shortLabel: "Seal Drw 1", type: "drawer-unit", x: 200, y: C04_W - RACK_D, width: DRAWER_W, height: RACK_D },
    { id: "c04-drw2", label: "Seal Drawer Cabinet 2", shortLabel: "Seal Drw 2", type: "drawer-unit", x: 1000, y: C04_W - RACK_D, width: DRAWER_W, height: RACK_D },

    // ── Bottom wall: right of door — flat gasket shelves ──
    { id: "c04-flat", label: "Flat Gasket Shelf Section", shortLabel: "Gasket Flat", type: "flat-shelf", x: C04_DOOR_END + 100, y: C04_W - RACK_D, width: 2200, height: RACK_D },

    // ── Left end wall: small bin trays ──
    { id: "c04-bins", label: "Small Bin Trays (30×) — Circlips & Shims", shortLabel: "Bin Trays", type: "bin-wall", x: 0, y: 700, width: END_D, height: 900 },
  ],
  notes: [
    "6 × 900mm steel shelving bays on rear wall",
    "2 drawer cabinets for seals, O-rings",
    "Flat file-style shelf for gaskets (horizontal storage)",
    "30 small trays for circlips, shims, retaining rings",
  ],
};

// ─── C05-CS  Consumables & Supplies (20ft, side-door) ───────────────────
const C05_L = 5900;
const C05_W = 2350;
const C05_DOOR_OFFSET = 2200;
const C05_DOOR_W = 900;
const C05_DOOR_END = C05_DOOR_OFFSET + C05_DOOR_W;

export const C05_FITOUT: ContainerFitout = {
  containerId: "C05",
  internalLengthMm: C05_L,
  internalWidthMm: C05_W,
  door: { wall: "bottom", offsetMm: C05_DOOR_OFFSET, widthMm: C05_DOOR_W, label: "Side Personnel Door (900mm)" },
  items: [
    // ── Top wall (rear): 6 steel shelving bays ──
    { id: "c05-bay1", label: "Steel Shelving Bay 1 (Bolts)", shortLabel: "Bay 1", type: "shelving-bay", x: 50, y: 0, width: BAY_W, height: RACK_D },
    { id: "c05-bay2", label: "Steel Shelving Bay 2 (Bolts)", shortLabel: "Bay 2", type: "shelving-bay", x: 1000, y: 0, width: BAY_W, height: RACK_D },
    { id: "c05-bay3", label: "Steel Shelving Bay 3 (Nuts/Washers)", shortLabel: "Bay 3", type: "shelving-bay", x: 1950, y: 0, width: BAY_W, height: RACK_D },
    { id: "c05-bay4", label: "Steel Shelving Bay 4 (Nuts/Washers)", shortLabel: "Bay 4", type: "shelving-bay", x: 2900, y: 0, width: BAY_W, height: RACK_D },
    { id: "c05-bay5", label: "Steel Shelving Bay 5 (Hose/Clamps)", shortLabel: "Bay 5", type: "shelving-bay", x: 3850, y: 0, width: BAY_W, height: RACK_D },
    { id: "c05-bay6", label: "Steel Shelving Bay 6 (Sealants)", shortLabel: "Bay 6", type: "shelving-bay", x: 4800, y: 0, width: BAY_W, height: RACK_D },

    // ── Bottom wall: left of door — 2 bin walls ──
    { id: "c05-bin1", label: "High-Frequency Bin Wall 1", shortLabel: "Bin Wall 1", type: "bin-wall", x: 100, y: C05_W - RACK_D, width: BAY_W, height: RACK_D },
    { id: "c05-bin2", label: "High-Frequency Bin Wall 2", shortLabel: "Bin Wall 2", type: "bin-wall", x: 1100, y: C05_W - RACK_D, width: BAY_W, height: RACK_D },

    // ── Bottom wall: right of door ──
    { id: "c05-ppe", label: "PPE Rack", shortLabel: "PPE", type: "ppe-rack", x: C05_DOOR_END + 100, y: C05_W - RACK_D, width: 700, height: RACK_D },
    { id: "c05-bund", label: "Bunded Grease/Oil Shelf", shortLabel: "Bunded", type: "bunded-shelf", x: C05_DOOR_END + 900, y: C05_W - RACK_D, width: 1000, height: RACK_D },

    // ── Left end wall: lockable tool cabinet ──
    { id: "c05-tool", label: "Lockable Tool Cabinet", shortLabel: "Tool Cab.", type: "cabinet", x: 0, y: 700, width: END_D, height: 900 },

    // ── Right end wall: additional PPE rack ──
    { id: "c05-ppe2", label: "PPE / Consumables Overflow Rack", shortLabel: "PPE Oflow", type: "ppe-rack", x: C05_L - END_D, y: 700, width: END_D, height: 900 },
  ],
  notes: [
    "High-turn items near door for fast access",
    "Bin walls for Kanban-style restocking of fasteners",
    "Bunded shelf contains spills from grease/oil containers",
    "Lockable tool cabinet for controlled-issue items",
    "PPE rack: gloves, earplugs, safety glasses",
  ],
};

/** Look up fitout by container ID */
export const CONTAINER_FITOUTS: Record<string, ContainerFitout> = {
  C01: C01_FITOUT,
  C02: C02_FITOUT,
  C03: C03_FITOUT,
  C04: C04_FITOUT,
  C05: C05_FITOUT,
};

/** Unique furniture types used in a fitout — for legend */
export function getUniqueFurnitureTypes(fitout: ContainerFitout): FurnitureType[] {
  const types = new Set(fitout.items.map((i) => i.type));
  return Array.from(types);
}
