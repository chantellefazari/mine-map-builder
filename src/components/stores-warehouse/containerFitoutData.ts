/**
 * Container Fitout Specifications
 * 
 * All dimensions in millimetres (mm).
 * Coordinate system: origin at top-left of internal space.
 *   x → along container length (long axis)
 *   y → along container width (short axis)
 * 
 * "Top wall" = rear long wall (no door) → Bays A, B, C, D
 * "Bottom wall" = door long wall → Bays E, F, G, H
 * "Left wall" = end wall 1 → Bay J
 * "Right wall" = end wall 2 → Bay K
 */

import { CONTAINER_DISCIPLINE_MAP } from "@/utils/storeLocationValidation";

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
  /** Bay letter from location coding standard (A-H, J-K) */
  bayLetter: string;
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

/** Get the full location code prefix for a fitout item (e.g. "C01-EL-A") */
export function getLocationPrefix(containerId: string, bayLetter: string): string {
  const disc = CONTAINER_DISCIPLINE_MAP[containerId] || "??";
  return `${containerId}-${disc}-${bayLetter}`;
}

/** Get full bin code (e.g. "C01-EL-A3") */
export function getBinCode(containerId: string, bayLetter: string, bin: number): string {
  return `${getLocationPrefix(containerId, bayLetter)}${bin}`;
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
    // ── Top wall (rear): Bays A–D + reinforced ──
    { id: "c01-bay1", label: "Steel Shelving Bay 1", shortLabel: "Bay A", type: "shelving-bay", x: 50, y: 0, width: BAY_W, height: RACK_D, bayLetter: "A" },
    { id: "c01-bay2", label: "Steel Shelving Bay 2", shortLabel: "Bay B", type: "shelving-bay", x: 1000, y: 0, width: BAY_W, height: RACK_D, bayLetter: "B" },
    { id: "c01-bay3", label: "Steel Shelving Bay 3", shortLabel: "Bay C", type: "shelving-bay", x: 1950, y: 0, width: BAY_W, height: RACK_D, bayLetter: "C" },
    { id: "c01-bay4", label: "Steel Shelving Bay 4", shortLabel: "Bay D", type: "shelving-bay", x: 2900, y: 0, width: BAY_W, height: RACK_D, bayLetter: "D" },
    { id: "c01-bay5", label: "Steel Shelving Bay 5", shortLabel: "Bay E (Rear ext.)", type: "shelving-bay", x: 3850, y: 0, width: BAY_W, height: RACK_D, bayLetter: "E" },
    { id: "c01-reinf", label: "Reinforced VSD Shelf Section", shortLabel: "Bay F (VSD)", type: "reinforced-shelf", x: 4850, y: 0, width: 950, height: RACK_D, bayLetter: "F" },

    // ── Bottom wall (door side): left of door → G, H ──
    { id: "c01-esd1", label: "ESD Bin Wall 1", shortLabel: "Bay G (ESD)", type: "esd-panel", x: 100, y: C01_W - RACK_D, width: BAY_W, height: RACK_D, bayLetter: "G" },
    { id: "c01-esd2", label: "ESD Bin Wall 2", shortLabel: "Bay H (ESD)", type: "esd-panel", x: 1100, y: C01_W - RACK_D, width: BAY_W, height: RACK_D, bayLetter: "H" },

    // ── Bottom wall: right of door ──
    { id: "c01-vsd", label: "Reinforced VSD Shelving", shortLabel: "Bay J (VSD)", type: "reinforced-shelf", x: C01_DOOR_END + 100, y: C01_W - RACK_D, width: 2600, height: RACK_D, bayLetter: "J" },

    // ── Left end wall: sealed PLC cabinet ──
    { id: "c01-plc", label: "Sealed PLC Cabinet", shortLabel: "Bay K (PLC)", type: "cabinet", x: 0, y: 750, width: END_D, height: 800, bayLetter: "K" },

    // ── Right end wall: conduit brackets + fan rack ──
    { id: "c01-conduit", label: "Conduit Brackets (×6) + Panel Fan Rack", shortLabel: "Conduit", type: "conduit-bracket", x: C01_L - END_D, y: 200, width: END_D, height: 500, bayLetter: "K" },
    { id: "c01-fan", label: "Panel Fan/Filter Vertical Rack", shortLabel: "Fan Rack", type: "rack", x: C01_L - END_D, y: 800, width: END_D, height: 600, bayLetter: "K" },
  ],
  notes: [
    "Anti-static mats inside sealed PLC cabinet",
    "Door reinforced with weather strip — keeps dust out",
    "Conduit brackets mounted near ceiling (above top shelf line)",
    "ESD panels protect sensitive components from electrostatic discharge",
    "Bay letters: A–F rear wall, G–H door wall (left), J door wall (right), K end walls",
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
    // ── Top wall (rear): Bays A–D ──
    { id: "c02-bay1", label: "Foam-Lined Bay 1", shortLabel: "Bay A", type: "shelving-bay", x: 200, y: 0, width: BAY_W, height: RACK_D, bayLetter: "A" },
    { id: "c02-bay2", label: "Foam-Lined Bay 2", shortLabel: "Bay B", type: "shelving-bay", x: 1150, y: 0, width: BAY_W, height: RACK_D, bayLetter: "B" },
    { id: "c02-bay3", label: "Foam-Lined Bay 3", shortLabel: "Bay C", type: "shelving-bay", x: 2100, y: 0, width: BAY_W, height: RACK_D, bayLetter: "C" },
    { id: "c02-bay4", label: "Foam-Lined Bay 4", shortLabel: "Bay D", type: "shelving-bay", x: 3050, y: 0, width: BAY_W, height: RACK_D, bayLetter: "D" },
    // Foam totes area
    { id: "c02-foam", label: "40× Foam Storage Totes", shortLabel: "Bay E (Totes)", type: "foam-totes", x: 4050, y: 0, width: 1600, height: RACK_D, bayLetter: "E" },

    // ── Bottom wall: left of door — drawer cabinets → F, G ──
    { id: "c02-drw1", label: "Drawer Cabinet 1 (Swagelok)", shortLabel: "Bay F (Drw)", type: "drawer-unit", x: 200, y: C02_W - RACK_D, width: DRAWER_W, height: RACK_D, bayLetter: "F" },
    { id: "c02-drw2", label: "Drawer Cabinet 2 (Fittings)", shortLabel: "Bay G (Drw)", type: "drawer-unit", x: 1000, y: C02_W - RACK_D, width: DRAWER_W, height: RACK_D, bayLetter: "G" },

    // ── Bottom wall: right of door — shelving → H ──
    { id: "c02-bay5", label: "Boxed Instruments Bay 1", shortLabel: "Bay H", type: "shelving-bay", x: C02_DOOR_END + 100, y: C02_W - RACK_D, width: BAY_W, height: RACK_D, bayLetter: "H" },
    { id: "c02-bay6", label: "Boxed Instruments Bay 2", shortLabel: "Bay J", type: "shelving-bay", x: C02_DOOR_END + 1100, y: C02_W - RACK_D, width: BAY_W, height: RACK_D, bayLetter: "J" },

    // ── Left end wall: tubing rack → K ──
    { id: "c02-tube", label: "Tubing Reel Rack (Vertical)", shortLabel: "Bay K (Tube)", type: "rack", x: 0, y: 650, width: END_D, height: 1000, bayLetter: "K" },
  ],
  notes: [
    "Foam-lined shelves to protect fragile instruments",
    "40 foam totes (400×300×120mm) for delicate parts",
    "Tubing rack stores instrument tubing vertically",
    "Fragile zone signage at entry",
    "Bay letters: A–E rear wall, F–G door wall (left), H–J door wall (right), K end wall",
  ],
};

// ─── C03-ME  Mechanical 40ft (side-door on long wall) ───────────────────
const C03_L = 12030;
const C03_W = 2350;
const C03_DOOR_OFFSET = 4865;
const C03_DOOR_W = 2300; // double cargo doors
const C03_DOOR_END = C03_DOOR_OFFSET + C03_DOOR_W;

// Bay letters for C03: rear wall A–H (9 bays, skip I), door left E2–H2 mapped to continued letters
// With 17 bays total, we use: A–D rear (first 4), then continue
const C03_REAR_BAYS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const C03_DOOR_LEFT_BAYS = ["J", "K"];  // using rear-wall designated letters for overflow
const C03_DOOR_RIGHT_BAYS = ["J", "K"]; // sub-positions

export const C03_FITOUT: ContainerFitout = {
  containerId: "C03",
  internalLengthMm: C03_L,
  internalWidthMm: C03_W,
  door: { wall: "bottom", offsetMm: C03_DOOR_OFFSET, widthMm: C03_DOOR_W, label: "Double Cargo Doors (2300mm)" },
  items: [
    // ── Top wall (rear): 9 heavy-duty bays → A through H (9th shares H position) ──
    ...Array.from({ length: 9 }, (_, i) => {
      // A, B, C, D, E, F, G, H for first 8, then 9th is a sub-bay
      const bayLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const bay = i < 8 ? bayLetters[i] : "H"; // 9th bay shares position
      return {
        id: `c03-bay${i + 1}`,
        label: `Heavy-Duty Bay ${i + 1}`,
        shortLabel: `Bay ${bay}${i >= 8 ? "+" : ""}`,
        type: "shelving-bay" as FurnitureType,
        x: 100 + i * 1100,
        y: 0,
        width: BAY_W,
        height: RACK_D,
        bayLetter: bay,
      };
    }),

    // ── Bottom wall: left of door — 4 heavy-duty bays → J sequential ──
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `c03-bay${10 + i}`,
      label: `Heavy-Duty Bay ${10 + i}`,
      shortLabel: `Bay J${i + 1}`,
      type: "shelving-bay" as FurnitureType,
      x: 200 + i * 1050,
      y: C03_W - RACK_D,
      width: BAY_W,
      height: RACK_D,
      bayLetter: "J",
    })),

    // ── Bottom wall: right of door — 4 heavy-duty bays → K sequential ──
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `c03-bay${14 + i}`,
      label: `Heavy-Duty Bay ${14 + i}`,
      shortLabel: `Bay K${i + 1}`,
      type: "shelving-bay" as FurnitureType,
      x: C03_DOOR_END + 200 + i * 1050,
      y: C03_W - RACK_D,
      width: BAY_W,
      height: RACK_D,
      bayLetter: "K",
    })),

    // ── Left end wall: V-belt rack ──
    { id: "c03-vbelt", label: "Custom V-Belt Rack (Fabricated)", shortLabel: "V-Belt", type: "rack", x: 0, y: 550, width: 600, height: 1200, bayLetter: "J" },

    // ── Right end wall: long material rack ──
    { id: "c03-longmat", label: "Long Material Rack (Conduit, Flat Bar)", shortLabel: "Long Mat.", type: "rack", x: C03_L - 600, y: 550, width: 600, height: 1200, bayLetter: "K" },
  ],
  notes: [
    "16–17 heavy-duty bays total (9 rear + 4+4 opposite)",
    "80 heavy totes distributed across bays",
    "All manual handling ≤15 kg — no pallet racks, no forklifts",
    "Door cut reinforced: top beam + vertical posts",
    "Do NOT mount shelving to cut frame — freestanding bays only",
    "Bay letters: A–H rear wall (9 bays), J door-left + end, K door-right + end",
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
    // ── Top wall (rear): Bays A–F ──
    { id: "c04-bay1", label: "Steel Shelving Bay 1", shortLabel: "Bay A", type: "shelving-bay", x: 50, y: 0, width: BAY_W, height: RACK_D, bayLetter: "A" },
    { id: "c04-bay2", label: "Steel Shelving Bay 2", shortLabel: "Bay B", type: "shelving-bay", x: 1000, y: 0, width: BAY_W, height: RACK_D, bayLetter: "B" },
    { id: "c04-bay3", label: "Steel Shelving Bay 3", shortLabel: "Bay C", type: "shelving-bay", x: 1950, y: 0, width: BAY_W, height: RACK_D, bayLetter: "C" },
    { id: "c04-bay4", label: "Steel Shelving Bay 4", shortLabel: "Bay D", type: "shelving-bay", x: 2900, y: 0, width: BAY_W, height: RACK_D, bayLetter: "D" },
    { id: "c04-bay5", label: "Steel Shelving Bay 5", shortLabel: "Bay E", type: "shelving-bay", x: 3850, y: 0, width: BAY_W, height: RACK_D, bayLetter: "E" },
    { id: "c04-bay6", label: "Steel Shelving Bay 6", shortLabel: "Bay F", type: "shelving-bay", x: 4800, y: 0, width: BAY_W, height: RACK_D, bayLetter: "F" },

    // ── Bottom wall: left of door — seal drawer cabinets → G, H ──
    { id: "c04-drw1", label: "Seal Drawer Cabinet 1", shortLabel: "Bay G (Drw)", type: "drawer-unit", x: 200, y: C04_W - RACK_D, width: DRAWER_W, height: RACK_D, bayLetter: "G" },
    { id: "c04-drw2", label: "Seal Drawer Cabinet 2", shortLabel: "Bay H (Drw)", type: "drawer-unit", x: 1000, y: C04_W - RACK_D, width: DRAWER_W, height: RACK_D, bayLetter: "H" },

    // ── Bottom wall: right of door — flat gasket shelves → J ──
    { id: "c04-flat", label: "Flat Gasket Shelf Section", shortLabel: "Bay J (Gasket)", type: "flat-shelf", x: C04_DOOR_END + 100, y: C04_W - RACK_D, width: 2200, height: RACK_D, bayLetter: "J" },

    // ── Left end wall: small bin trays → K ──
    { id: "c04-bins", label: "Small Bin Trays (30×) — Circlips & Shims", shortLabel: "Bay K (Bins)", type: "bin-wall", x: 0, y: 700, width: END_D, height: 900, bayLetter: "K" },
  ],
  notes: [
    "6 × 900mm steel shelving bays on rear wall",
    "2 drawer cabinets for seals, O-rings",
    "Flat file-style shelf for gaskets (horizontal storage)",
    "30 small trays for circlips, shims, retaining rings",
    "Bay letters: A–F rear wall, G–H door wall (left), J door wall (right), K end wall",
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
    // ── Top wall (rear): Bays A–F ──
    { id: "c05-bay1", label: "Steel Shelving Bay 1 (Bolts)", shortLabel: "Bay A", type: "shelving-bay", x: 50, y: 0, width: BAY_W, height: RACK_D, bayLetter: "A" },
    { id: "c05-bay2", label: "Steel Shelving Bay 2 (Bolts)", shortLabel: "Bay B", type: "shelving-bay", x: 1000, y: 0, width: BAY_W, height: RACK_D, bayLetter: "B" },
    { id: "c05-bay3", label: "Steel Shelving Bay 3 (Nuts/Washers)", shortLabel: "Bay C", type: "shelving-bay", x: 1950, y: 0, width: BAY_W, height: RACK_D, bayLetter: "C" },
    { id: "c05-bay4", label: "Steel Shelving Bay 4 (Nuts/Washers)", shortLabel: "Bay D", type: "shelving-bay", x: 2900, y: 0, width: BAY_W, height: RACK_D, bayLetter: "D" },
    { id: "c05-bay5", label: "Steel Shelving Bay 5 (Hose/Clamps)", shortLabel: "Bay E", type: "shelving-bay", x: 3850, y: 0, width: BAY_W, height: RACK_D, bayLetter: "E" },
    { id: "c05-bay6", label: "Steel Shelving Bay 6 (Sealants)", shortLabel: "Bay F", type: "shelving-bay", x: 4800, y: 0, width: BAY_W, height: RACK_D, bayLetter: "F" },

    // ── Bottom wall: left of door — 2 bin walls → G, H ──
    { id: "c05-bin1", label: "High-Frequency Bin Wall 1", shortLabel: "Bay G (Bins)", type: "bin-wall", x: 100, y: C05_W - RACK_D, width: BAY_W, height: RACK_D, bayLetter: "G" },
    { id: "c05-bin2", label: "High-Frequency Bin Wall 2", shortLabel: "Bay H (Bins)", type: "bin-wall", x: 1100, y: C05_W - RACK_D, width: BAY_W, height: RACK_D, bayLetter: "H" },

    // ── Bottom wall: right of door ──
    { id: "c05-ppe", label: "PPE Rack", shortLabel: "PPE (J)", type: "ppe-rack", x: C05_DOOR_END + 100, y: C05_W - RACK_D, width: 700, height: RACK_D, bayLetter: "J" },
    { id: "c05-bund", label: "Bunded Grease/Oil Shelf", shortLabel: "Bunded (J)", type: "bunded-shelf", x: C05_DOOR_END + 900, y: C05_W - RACK_D, width: 1000, height: RACK_D, bayLetter: "J" },

    // ── Left end wall: lockable tool cabinet → K ──
    { id: "c05-tool", label: "Lockable Tool Cabinet", shortLabel: "Bay K (Tools)", type: "cabinet", x: 0, y: 700, width: END_D, height: 900, bayLetter: "K" },

    // ── Right end wall: additional PPE rack → K ──
    { id: "c05-ppe2", label: "PPE / Consumables Overflow Rack", shortLabel: "PPE (K)", type: "ppe-rack", x: C05_L - END_D, y: 700, width: END_D, height: 900, bayLetter: "K" },
  ],
  notes: [
    "High-turn items near door for fast access",
    "Bin walls for Kanban-style restocking of fasteners",
    "Bunded shelf contains spills from grease/oil containers",
    "Lockable tool cabinet for controlled-issue items",
    "PPE rack: gloves, earplugs, safety glasses",
    "Bay letters: A–F rear wall, G–H door wall (left), J door wall (right), K end walls",
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
