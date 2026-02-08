export interface ShelfBin {
  id: string; // e.g., "A1"
  shelf: string; // e.g., "A"
  bin: number; // e.g., 1
}

export interface ContainerZone {
  code: string; // e.g., "ME"
  label: string;
}

export interface StoreContainer {
  id: string; // e.g., "C01"
  zone: string; // e.g., "STO-EL"
  zoneCode: string; // e.g., "EL"
  label: string;
  shortLabel: string;
  color: string; // tailwind color class
  bgColor: string;
  borderColor: string;
  environment: string;
  containerType: string;
  shelves: string[]; // ["A", "B", "C", "D"]
  binsPerShelf: number;
  // 2D layout position (percentage-based)
  position: { x: number; y: number };
  width: number;
  height: number;
  // 3D position
  position3D: { x: number; y: number; z: number };
}

export interface LayoutZoneGroup {
  id: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  position: { x: number; y: number; width: number; height: number };
}

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
    containerType: "10ft Container or Cage",
    shelves: ["A", "B", "C"],
    binsPerShelf: 4,
    position: { x: 430, y: 230 },
    width: 130,
    height: 120,
    position3D: { x: 5, y: 0, z: 0 },
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
