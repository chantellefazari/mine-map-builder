/**
 * Stores Asset Tree Data
 * 
 * Hierarchical structure for the interactive container navigator.
 * Derived from ContainerStockingScopeSection and CapacityAnalysis data.
 */

export type StoresNodeType = "site" | "container" | "subCategory" | "item" | "zone";

export interface ContainerInfo {
  containerType: string;
  specialRequirement: string;
  skuCount: number;
  binPositions: number;
  ratio: number;
  status: "ok" | "warning" | "critical";
  furniture: { type: string; qty: number; positions: number }[];
  accessFrequency: string;
  growthAllowance: string;
}

export interface StoresTreeNode {
  id: string;
  name: string;
  code?: string;
  type: StoresNodeType;
  containerInfo?: ContainerInfo;
  children?: StoresTreeNode[];
}

export const storesTreeData: StoresTreeNode = {
  id: "tcmg-stores",
  name: "TCMG Stores",
  type: "site",
  children: [
    {
      id: "c01-el",
      name: "Electrical (20ft – Positive Airflow)",
      code: "C01-EL",
      type: "container",
      containerInfo: {
        containerType: "20ft Modified Container",
        specialRequirement: "Dust-controlled airflow, sealed cabinets",
        skuCount: 444,
        binPositions: 274,
        ratio: 1.62,
        status: "ok",
        furniture: [
          { type: "Shelving Bay (900mm, 5 levels × 6 bins)", qty: 6, positions: 180 },
          { type: "ESD Bin Panel (40 slots ea.)", qty: 2, positions: 80 },
          { type: "Reinforced VSD Shelf", qty: 1, positions: 8 },
          { type: "PLC Cabinet (lockable)", qty: 1, positions: 6 },
        ],
        accessFrequency: "Daily",
        growthAllowance: "Low — near capacity but ESD panels absorb bulk small parts",
      },
      children: [
        { id: "c01-1", name: "Fuses (all types)", type: "item" },
        { id: "c01-2", name: "Circuit breakers (MCB, MCCB)", type: "item" },
        { id: "c01-3", name: "RCBOs", type: "item" },
        { id: "c01-4", name: "Contactors", type: "item" },
        { id: "c01-5", name: "Overload relays", type: "item" },
        { id: "c01-6", name: "Control relays", type: "item" },
        { id: "c01-7", name: "Power supplies", type: "item" },
        { id: "c01-8", name: "Terminal blocks", type: "item" },
        { id: "c01-9", name: "Isolator handles & internals", type: "item" },
        { id: "c01-10", name: "Push buttons", type: "item" },
        { id: "c01-11", name: "Selector switches", type: "item" },
        { id: "c01-12", name: "Indicator lights", type: "item" },
        { id: "c01-13", name: "VSD/VFD spare boards", type: "item" },
        { id: "c01-14", name: "PLC I/O cards", type: "item" },
        { id: "c01-15", name: "PLC CPUs", type: "item" },
        { id: "c01-16", name: "Sensors (photo, proximity)", type: "item" },
        { id: "c01-17", name: "Cable glands", type: "item" },
        { id: "c01-18", name: "Cable lugs", type: "item" },
        { id: "c01-19", name: "Ferrules", type: "item" },
        { id: "c01-20", name: "Control cables (cut lengths)", type: "item" },
        { id: "c01-21", name: "Panel cooling fans", type: "item" },
        { id: "c01-22", name: "Panel filters", type: "item" },
      ],
    },
    {
      id: "c02-in",
      name: "Instrumentation & Pneumatics (20ft – Clean/Fragile)",
      code: "C02-IN",
      type: "container",
      containerInfo: {
        containerType: "20ft Modified Container",
        specialRequirement: "Labelled bins, clean storage, fragile care",
        skuCount: 349,
        binPositions: 273,
        ratio: 1.28,
        status: "ok",
        furniture: [
          { type: "Foam-Lined Shelving Bay (5 levels × 5 bins)", qty: 5, positions: 125 },
          { type: "Foam Storage Totes (40 totes)", qty: 1, positions: 40 },
          { type: "Drawer Cabinet (Swagelok/Fittings)", qty: 2, positions: 60 },
          { type: "Boxed Instruments Bay", qty: 2, positions: 40 },
          { type: "Tubing Reel Rack (end wall)", qty: 1, positions: 8 },
        ],
        accessFrequency: "Weekly",
        growthAllowance: "Moderate — 1.28 items/bin with drawer cabinets absorbing fittings",
      },
      children: [
        { id: "c02-1", name: "Pressure transmitters", type: "item" },
        { id: "c02-2", name: "Pressure gauges", type: "item" },
        { id: "c02-3", name: "Flow switches", type: "item" },
        { id: "c02-4", name: "Flow meters (small)", type: "item" },
        { id: "c02-5", name: "Level switches", type: "item" },
        { id: "c02-6", name: "Temperature probes (RTD / thermocouple)", type: "item" },
        { id: "c02-7", name: "Solenoid valves (small)", type: "item" },
        { id: "c02-8", name: "Positioners", type: "item" },
        { id: "c02-9", name: "Instrument air regulators / FRLs", type: "item" },
        { id: "c02-10", name: "Small actuators", type: "item" },
        { id: "c02-11", name: "Instrument fittings (SS, brass)", type: "item" },
        { id: "c02-12", name: "Swagelok fittings", type: "item" },
        { id: "c02-13", name: "Tubing (coiled lengths)", type: "item" },
        { id: "c02-14", name: "Manifolds (small)", type: "item" },
        { id: "c02-15", name: "Instrument filters", type: "item" },
        { id: "c02-16", name: "Pneumatic push-in fittings", type: "item" },
        { id: "c02-17", name: "Quick connects", type: "item" },
        { id: "c02-18", name: "Air hoses (small)", type: "item" },
        { id: "c02-19", name: "Mufflers", type: "item" },
        { id: "c02-20", name: "Needle valves (small)", type: "item" },
      ],
    },
    {
      id: "c03-me",
      name: "Mechanical (40ft – High Volume)",
      code: "C03-ME",
      type: "container",
      containerInfo: {
        containerType: "40ft Standard Container",
        specialRequirement: "Dry storage, high-density bins, heavy items at bottom",
        skuCount: 545,
        binPositions: 540,
        ratio: 1.01,
        status: "ok",
        furniture: [
          { type: "Heavy-Duty Shelving Bay (5 levels × 6 bins)", qty: 17, positions: 510 },
          { type: "V-Belt Rack (end wall)", qty: 1, positions: 20 },
          { type: "Long Material Rack (end wall)", qty: 1, positions: 10 },
        ],
        accessFrequency: "Daily",
        growthAllowance: "Minimal — near 1:1 ratio, 40ft length maximised",
      },
      children: [
        {
          id: "c03-sub1",
          name: "Wear Parts & Liners",
          type: "subCategory",
          children: [
            { id: "c03-1", name: "Small wear plates (<15 kg)", type: "item" },
            { id: "c03-2", name: "Chute liners (rubber, ceramic, <15 kg)", type: "item" },
          ],
        },
        {
          id: "c03-sub2",
          name: "Conveyor & Drive",
          type: "subCategory",
          children: [
            { id: "c03-3", name: "Rollers", type: "item" },
            { id: "c03-4", name: "Idlers", type: "item" },
            { id: "c03-5", name: "Pulleys", type: "item" },
            { id: "c03-6", name: "Scraper blades", type: "item" },
            { id: "c03-7", name: "Belt cleaners", type: "item" },
            { id: "c03-8", name: "Belts (V-belt, drive belt)", type: "item" },
            { id: "c03-9", name: "Belt fasteners", type: "item" },
            { id: "c03-10", name: "Sprockets", type: "item" },
            { id: "c03-11", name: "Chains", type: "item" },
          ],
        },
        {
          id: "c03-sub3",
          name: "Valves, Pipe & Fittings",
          type: "subCategory",
          children: [
            { id: "c03-12", name: "Valves (ball, butterfly, knife gate, check — <DN150)", type: "item" },
            { id: "c03-13", name: "Pipe fittings", type: "item" },
            { id: "c03-14", name: "Flanges", type: "item" },
            { id: "c03-15", name: "Elbows", type: "item" },
            { id: "c03-16", name: "Tees", type: "item" },
            { id: "c03-17", name: "Reducers", type: "item" },
            { id: "c03-18", name: "Nipples", type: "item" },
            { id: "c03-19", name: "Hoses", type: "item" },
            { id: "c03-20", name: "Couplings (heavy)", type: "item" },
          ],
        },
        {
          id: "c03-sub4",
          name: "Pump Spares",
          type: "subCategory",
          children: [
            { id: "c03-21", name: "Pump seal kits (application-specific)", type: "item" },
            { id: "c03-22", name: "Impellers (small)", type: "item" },
            { id: "c03-23", name: "Wear rings", type: "item" },
            { id: "c03-24", name: "Shaft sleeves", type: "item" },
            { id: "c03-25", name: "Gland packing", type: "item" },
          ],
        },
      ],
    },
    {
      id: "c04-mp",
      name: "Mechanical Precision (20ft)",
      code: "C04-MP",
      type: "container",
      containerInfo: {
        containerType: "20ft Standard Container",
        specialRequirement: "Dry, precision bins, anti-contamination",
        skuCount: 227,
        binPositions: 302,
        ratio: 0.75,
        status: "ok",
        furniture: [
          { type: "Steel Shelving Bay (5 levels × 6 bins)", qty: 6, positions: 180 },
          { type: "Seal Drawer Cabinet (40 drawers ea.)", qty: 2, positions: 80 },
          { type: "Flat Gasket Shelf (horizontal storage)", qty: 1, positions: 12 },
          { type: "Small Bin Tray Array (30 trays)", qty: 1, positions: 30 },
        ],
        accessFrequency: "Weekly",
        growthAllowance: "High — 25% buffer, best headroom of all containers",
      },
      children: [
        { id: "c04-1", name: "Bearings (all types)", type: "item" },
        { id: "c04-2", name: "Pillow blocks", type: "item" },
        { id: "c04-3", name: "Spherical roller bearings", type: "item" },
        { id: "c04-4", name: "Ball bearings", type: "item" },
        { id: "c04-5", name: "Seals (oil, lip, mechanical)", type: "item" },
        { id: "c04-6", name: "O-rings", type: "item" },
        { id: "c04-7", name: "Gaskets", type: "item" },
        { id: "c04-8", name: "Shims", type: "item" },
        { id: "c04-9", name: "Keys & key stock", type: "item" },
        { id: "c04-10", name: "Retaining rings (circlips)", type: "item" },
        { id: "c04-11", name: "Bushes", type: "item" },
        { id: "c04-12", name: "Small couplings", type: "item" },
        { id: "c04-13", name: "Small shafts", type: "item" },
        { id: "c04-14", name: "Precision parts", type: "item" },
        { id: "c04-15", name: "Locknuts", type: "item" },
      ],
    },
    {
      id: "c05-cs",
      name: "Consumables & Supplies (20ft)",
      code: "C05-CS",
      type: "container",
      containerInfo: {
        containerType: "20ft Standard Container",
        specialRequirement: "High-organisation Kanban bins, spill kit accessible",
        skuCount: 462,
        binPositions: 338,
        ratio: 1.37,
        status: "ok",
        furniture: [
          { type: "Steel Shelving Bay (5 levels × 6 bins)", qty: 6, positions: 180 },
          { type: "High-Frequency Bin Wall (60 slots ea.)", qty: 2, positions: 120 },
          { type: "PPE Rack", qty: 2, positions: 20 },
          { type: "Bunded Grease/Oil Shelf", qty: 1, positions: 8 },
          { type: "Lockable Tool Cabinet", qty: 1, positions: 10 },
        ],
        accessFrequency: "Daily",
        growthAllowance: "Low — fastener SKUs consolidate at 3-5 per bin via Kanban walls",
      },
      children: [
        {
          id: "c05-sub1",
          name: "Fasteners & Hardware",
          type: "subCategory",
          children: [
            { id: "c05-1", name: "Bolts", type: "item" },
            { id: "c05-2", name: "Nuts", type: "item" },
            { id: "c05-3", name: "Washers", type: "item" },
            { id: "c05-4", name: "Studs", type: "item" },
            { id: "c05-5", name: "Anchors", type: "item" },
            { id: "c05-6", name: "Threaded rod", type: "item" },
            { id: "c05-7", name: "U-bolts", type: "item" },
            { id: "c05-8", name: "Hose clamps", type: "item" },
            { id: "c05-9", name: "Retaining clips", type: "item" },
            { id: "c05-10", name: "Pins", type: "item" },
            { id: "c05-11", name: "Screws", type: "item" },
          ],
        },
        {
          id: "c05-sub2",
          name: "Sealants & Adhesives",
          type: "subCategory",
          children: [
            { id: "c05-12", name: "Loctite", type: "item" },
            { id: "c05-13", name: "Silicone", type: "item" },
            { id: "c05-14", name: "Threadlocker", type: "item" },
            { id: "c05-15", name: "PTFE tape", type: "item" },
            { id: "c05-16", name: "Thread sealant", type: "item" },
            { id: "c05-17", name: "Adhesives", type: "item" },
          ],
        },
        {
          id: "c05-sub3",
          name: "Consumables & PPE",
          type: "subCategory",
          children: [
            { id: "c05-18", name: "Gloves", type: "item" },
            { id: "c05-19", name: "Respirators", type: "item" },
            { id: "c05-20", name: "Hard hats", type: "item" },
            { id: "c05-21", name: "Rags", type: "item" },
            { id: "c05-22", name: "Absorbents", type: "item" },
            { id: "c05-23", name: "Zip ties", type: "item" },
            { id: "c05-24", name: "Tape", type: "item" },
            { id: "c05-25", name: "Batteries", type: "item" },
          ],
        },
        {
          id: "c05-sub4",
          name: "Lubrication",
          type: "subCategory",
          children: [
            { id: "c05-26", name: "Grease cartridges", type: "item" },
            { id: "c05-27", name: "Grease nipples", type: "item" },
            { id: "c05-28", name: "Grease fittings", type: "item" },
            { id: "c05-29", name: "Oil filters (small)", type: "item" },
            { id: "c05-30", name: "Breathers", type: "item" },
            { id: "c05-31", name: "Sight glasses", type: "item" },
            { id: "c05-32", name: "Auto-lube injectors", type: "item" },
            { id: "c05-33", name: "Oil sample bottles", type: "item" },
            { id: "c05-34", name: "Desiccant breathers", type: "item" },
          ],
        },
      ],
    },
    {
      id: "ld",
      name: "Laydown Yard (External)",
      code: "LD",
      type: "container",
      containerInfo: {
        containerType: "Open Yard — Forklift Accessible",
        specialRequirement: "Heavy assemblies (>15 kg), oversized items, palletised goods",
        skuCount: 113,
        binPositions: 0,
        ratio: 0,
        status: "ok",
        furniture: [],
        accessFrequency: "As needed",
        growthAllowance: "High — open yard with scalable bay allocation",
      },
      children: [
        { id: "ld-a", name: "Critical Parts Overflow (Dome Row A)", code: "LD-A", type: "zone" },
        { id: "ld-b", name: "Critical Parts Overflow (Dome Row B)", code: "LD-B", type: "zone" },
        { id: "ld-c", name: "Pumps", code: "LD-C", type: "zone" },
        { id: "ld-d", name: "Matec", code: "LD-D", type: "zone" },
        { id: "ld-e", name: "Electrical", code: "LD-E", type: "zone" },
        { id: "ld-f", name: "Mechanical", code: "LD-F", type: "zone" },
      ],
    },
  ],
};

/** Count all leaf items in a node subtree */
export function countItems(node: StoresTreeNode): number {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + countItems(child), 0);
}
