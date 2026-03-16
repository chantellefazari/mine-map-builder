import { writeXlsxFile, loadXLSX } from "@/utils/safariDownload";

let XLSX: any;
import {
  CONTAINER_DISCIPLINE_MAP,
  VALID_BAYS,
  BAY_LAYOUT,
  EXTERNAL_BAY_LAYOUT,
  VALID_EXTERNAL_BAYS,
} from "@/utils/storeLocationValidation";

// ── Helpers ──────────────────────────────────────────────────────────────────
const setColWidths = (ws: XLSX.WorkSheet, widths: number[]) => {
  ws["!cols"] = widths.map((w) => ({ wch: w }));
};

// ── Sheet 1 — Design Principles ─────────────────────────────────────────────
function addDesignPrinciples(wb: XLSX.WorkBook) {
  const rows: string[][] = [
    ["#", "Principle", "Description"],
    ["1", "Manual Handling Limit", "All container-stored items must be ≤15 kg and safely handled by one person without mechanical assistance."],
    ["2", "Electrical / Mechanical Separation", "Electrical components must be stored separately from mechanical parts to prevent contamination and ensure clean storage conditions."],
    ["3", "Dust Control & Airflow", "Electrical and instrumentation containers require dust-controlled environments with adequate ventilation and airflow."],
    ["4", "Clear Labelling & Visibility", "All storage locations, bins, and shelves must have clear, standardised labels visible from access aisles."],
    ["5", "Fast vs Slow-Moving Separation", "High-frequency items placed at accessible heights and near entry points. Slow-moving items stored in less accessible areas."],
    ["6", "Safety, Access & Housekeeping", "Clear walkways, emergency egress, proper lighting, and regular housekeeping schedules. No floor storage blocking access."],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [4, 35, 90]);
  XLSX.utils.book_append_sheet(wb, ws, "Design Principles");
}

// ── Sheet 2 — Container Stocking Scope ──────────────────────────────────────
function addStockingScope(wb: XLSX.WorkBook) {
  const rows: string[][] = [
    ["Container", "Title", "Container Type", "Special Requirement", "Sub-Category", "Item"],
  ];

  const categories = [
    {
      code: "C01-EL", title: "Electrical (20ft – Positive Airflow)",
      containerType: "20ft Modified Container", specialReq: "Dust-controlled airflow, sealed cabinets",
      items: ["Fuses (all types)", "Circuit breakers (MCB, MCCB)", "RCBOs", "Contactors", "Overload relays", "Control relays", "Power supplies", "Terminal blocks", "Isolator handles & internals", "Push buttons", "Selector switches", "Indicator lights", "VSD/VFD spare boards", "PLC I/O cards", "PLC CPUs", "Sensors (photo, proximity)", "Cable glands", "Cable lugs", "Ferrules", "Control cables (cut lengths)", "Panel cooling fans", "Panel filters"],
    },
    {
      code: "C02-IN", title: "Instrumentation & Pneumatics (20ft – Clean/Fragile)",
      containerType: "20ft Modified Container", specialReq: "Labelled bins, clean storage, fragile care",
      items: ["Pressure transmitters", "Pressure gauges", "Flow switches", "Flow meters (small)", "Level switches", "Temperature probes (RTD / thermocouple)", "Solenoid valves (small)", "Positioners", "Instrument air regulators / FRLs", "Small actuators", "Instrument fittings (SS, brass)", "Swagelok fittings", "Tubing (coiled lengths)", "Manifolds (small)", "Instrument filters", "Pneumatic push-in fittings", "Quick connects", "Air hoses (small)", "Mufflers", "Needle valves (small)"],
    },
    {
      code: "C03-ME", title: "Mechanical (40ft – High Volume)",
      containerType: "40ft Standard Container", specialReq: "Dry storage, high-density bins, heavy items at bottom",
      subCategories: [
        { name: "Wear Parts & Liners", items: ["Small wear plates (<15 kg)", "Chute liners (rubber, ceramic, <15 kg)"] },
        { name: "Conveyor & Drive", items: ["Rollers", "Idlers", "Pulleys", "Scraper blades", "Belt cleaners", "Belts (V-belt, drive belt)", "Belt fasteners", "Sprockets", "Chains"] },
        { name: "Valves, Pipe & Fittings", items: ["Valves (ball, butterfly, knife gate, check — <DN150)", "Pipe fittings", "Flanges", "Elbows", "Tees", "Reducers", "Nipples", "Hoses", "Couplings (heavy)"] },
        { name: "Pump Spares", items: ["Pump seal kits (application-specific)", "Impellers (small)", "Wear rings", "Shaft sleeves", "Gland packing"] },
      ],
    },
    {
      code: "C04-MP", title: "Mechanical Precision (20ft)",
      containerType: "20ft Standard Container", specialReq: "Dry, precision bins, anti-contamination",
      items: ["Bearings (all types)", "Pillow blocks", "Spherical roller bearings", "Ball bearings", "Seals (oil, lip, mechanical)", "O-rings", "Gaskets", "Shims", "Keys & key stock", "Retaining rings (circlips)", "Bushes", "Small couplings", "Small shafts", "Precision parts", "Locknuts"],
    },
    {
      code: "C05-CS", title: "Consumables & Supplies (20ft)",
      containerType: "20ft Standard Container", specialReq: "High-organisation Kanban bins, spill kit accessible",
      subCategories: [
        { name: "Fasteners & Hardware", items: ["Bolts", "Nuts", "Washers", "Studs", "Anchors", "Threaded rod", "U-bolts", "Hose clamps", "Retaining clips", "Pins", "Screws"] },
        { name: "Sealants & Adhesives", items: ["Loctite", "Silicone", "Threadlocker", "PTFE tape", "Thread sealant", "Adhesives"] },
        { name: "Consumables & PPE", items: ["Gloves", "Respirators", "Hard hats", "Rags", "Absorbents", "Zip ties", "Tape", "Batteries"] },
        { name: "Lubrication", items: ["Grease cartridges", "Grease nipples", "Grease fittings", "Oil filters (small)", "Breathers", "Sight glasses", "Auto-lube injectors", "Oil sample bottles", "Desiccant breathers"] },
      ],
    },
  ];

  for (const cat of categories) {
    if ("subCategories" in cat && cat.subCategories) {
      for (const sub of cat.subCategories) {
        for (const item of sub.items) {
          rows.push([cat.code, cat.title, cat.containerType, cat.specialReq, sub.name, item]);
        }
      }
    } else if ("items" in cat && cat.items) {
      for (const item of cat.items) {
        rows.push([cat.code, cat.title, cat.containerType, cat.specialReq, "", item]);
      }
    }
  }

  // Exclusions
  rows.push([]);
  rows.push(["=== Excluded from Container Storage → Laydown Yard (LD) ==="]);
  const exclusions = [
    "Complete motors (>15 kg)", "Gearboxes", "Complete pumps / pump assemblies",
    "Large valves (DN150+)", "Large PE/Plasson fittings", "Drums and bulk chemicals",
    "Palletised items", "Structural steel", "Heavy equipment assemblies",
    "Switchboards", "Crusher liners, cone liners, mantles", "Screen panels (heavy)",
    "Anything requiring forklift",
  ];
  for (const ex of exclusions) {
    rows.push(["LD", ex]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [12, 42, 28, 45, 22, 50]);
  XLSX.utils.book_append_sheet(wb, ws, "Container Stocking Scope");
}

// ── Sheet 3 — Location Coding ───────────────────────────────────────────────
function addLocationCoding(wb: XLSX.WorkBook) {
  const rows: string[][] = [];

  // Code format
  rows.push(["=== Location Code Format: [Container]-[Discipline]-[Bay][Bin] ==="]);
  rows.push(["Segment", "Format", "Meaning", "Values"]);
  rows.push(["Container", "C0X", "Physical storage container (C01–C05)", "C01, C02, C03, C04, C05"]);
  rows.push(["Discipline", "XX", "Must match container discipline", "EL, IN, ME, MP, CS"]);
  rows.push(["Bay", "A–H, J–K", "Wall position (skip letter I)", "A, B, C, D, E, F, G, H, J, K"]);
  rows.push(["Bin", "1–99", "Bin number within bay", "1, 2, 15, 42, 99"]);
  rows.push([]);

  // Container → Discipline map
  rows.push(["=== Container → Discipline Map ==="]);
  rows.push(["Container", "Discipline", "Label"]);
  const labels: Record<string, string> = { EL: "Electrical – Positive Airflow", IN: "Instrumentation, Pneumatics & Process Fittings", ME: "Mechanical (40ft)", MP: "Mechanical Precision", CS: "Consumables & Supplies" };
  for (const [id, disc] of Object.entries(CONTAINER_DISCIPLINE_MAP)) {
    rows.push([id, disc, labels[disc] || disc]);
  }
  rows.push([]);

  // Bay layout
  rows.push(["=== Bay Layout ==="]);
  rows.push(["Wall", "Bays"]);
  rows.push(["Left Wall", BAY_LAYOUT.leftWall.join(", ")]);
  rows.push(["Right Wall", BAY_LAYOUT.rightWall.join(", ")]);
  rows.push(["Rear Wall", BAY_LAYOUT.rearWall.join(", ")]);
  rows.push(["All Valid Bays", VALID_BAYS.join(", ")]);
  rows.push([]);

  // Container examples
  rows.push(["=== Container Location Examples ==="]);
  rows.push(["Code", "Description"]);
  rows.push(["C01-EL-A3", "Container 1, Electrical, Left wall bay A, bin 3"]);
  rows.push(["C02-IN-E1", "Container 2, Instrumentation, Right wall bay E, bin 1"]);
  rows.push(["C03-ME-J2", "Container 3, Mechanical, Rear wall bay J, bin 2"]);
  rows.push(["C04-MP-B5", "Container 4, Mech Precision, Left wall bay B, bin 5"]);
  rows.push(["C05-CS-H12", "Container 5, Consumables & Supplies, Right wall bay H, bin 12"]);
  rows.push([]);

  // External (LD)
  rows.push(["=== External Storage — LD Prefix ==="]);
  rows.push(["Format", "LD-[Bay][Position]"]);
  rows.push(["Dome Internal Rows", EXTERNAL_BAY_LAYOUT.domeRows.join(", ")]);
  rows.push(["Yard Bays", EXTERNAL_BAY_LAYOUT.yardBays.join(", ")]);
  rows.push(["All Valid LD Bays", VALID_EXTERNAL_BAYS.join(", ")]);
  rows.push([]);
  rows.push(["Code", "Description"]);
  rows.push(["LD-A1", "Dome row A, position 1"]);
  rows.push(["LD-A2", "Dome row A, position 2"]);
  rows.push(["LD-B3", "Dome row B, position 3"]);
  rows.push(["LD-C1", "Yard bay C, position 1"]);
  rows.push(["LD-D2", "Yard bay D, position 2"]);
  rows.push(["LD-F4", "Yard bay F, position 4"]);
  rows.push([]);

  // Validation rules
  rows.push(["=== Validation Rules ==="]);
  const rules = [
    "Discipline code must match its container (e.g. C01 = EL only)",
    "No duplicate location codes allowed across the entire store",
    "Location code must follow exact format: C0X-XX-A1",
    "Bay letters skip I (go A–H, then J–K)",
    "Bin numbers range from 1 to 99",
    "All external codes must start with LD prefix",
    "External bays limited to letters A–F only",
    "Format must be exactly LD-[Letter][Number] (e.g. LD-A1)",
  ];
  for (const r of rules) {
    rows.push([r]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [45, 55, 50, 45]);
  XLSX.utils.book_append_sheet(wb, ws, "Location Coding");
}

// ── Sheet 4 — Design Inputs ────────────────────────────────────────────────
function addDesignInputs(wb: XLSX.WorkBook) {
  const rows: string[][] = [
    ["Zone", "Container Type", "Contents", "Environment", "Access Frequency", "Growth Allowance"],
    ["C01-EL", "20ft Modified Container", "Electrical components, PLCs, VSDs, sensors", "Dust-controlled, positive airflow, climate-stable", "Daily", "20%"],
    ["C02-IN", "20ft Modified Container", "Instrumentation, transmitters, gauges, pneumatics", "Clean, dust-free, climate preferred", "Weekly", "10%"],
    ["C03-ME", "40ft Standard Container", "Wear parts, liners, rollers, belts, valves, pipe fittings", "Dry, standard industrial, high-density", "Daily", "15%"],
    ["C04-MP", "20ft Standard Container", "Bearings, seals, O-rings, gaskets, precision parts", "Dry, organised precision bins", "Daily", "15%"],
    ["C05-CS", "20ft Standard Container", "Consumables, fasteners, PPE, grease, lube, tools, safety", "Standard, high-access Kanban bins", "Daily", "25%"],
  ];
  rows.push([]);
  rows.push(["=== Safety & Layout Constraints ==="]);
  const constraints = [
    "Electrical and lubrication zones must be physically separated",
    "Clear emergency egress from all containers",
    "Fire extinguisher placement per container type",
    "Adequate lighting in all storage areas",
    "Anti-slip flooring where oils may be handled",
    "No stacking above shoulder height without step access",
  ];
  for (const c of constraints) {
    rows.push([c]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [12, 28, 55, 50, 18, 18]);
  XLSX.utils.book_append_sheet(wb, ws, "Design Inputs");
}

// ── Sheet 5 — Capacity Analysis ─────────────────────────────────────────────
function addCapacityAnalysis(wb: XLSX.WorkBook) {
  const rows: string[][] = [
    ["Zone", "Container Type", "SKU Count", "Bin Positions", "Items/Bin Ratio", "Usage %", "Status", "Furniture Breakdown", "Notes / Concerns"],
  ];

  const zones = [
    { zone: "C01-EL", type: "20ft", skus: 444, bins: 274, furniture: "6× Shelving Bay (180), 2× ESD Bin Panel (80), 1× Reinforced VSD Shelf (8), 1× PLC Cabinet (6)", notes: "1.6 items/bin avg. ESD panels handle bulk small parts. ✅ No capacity concern." },
    { zone: "C02-IN", type: "20ft", skus: 349, bins: 273, furniture: "5× Foam-Lined Shelving (125), 1× Foam Totes (40), 2× Drawer Cabinet (60), 2× Boxed Instruments Bay (40), 1× Tubing Reel Rack (8)", notes: "1.3 items/bin avg. Drawer cabinets absorb small BSP/Swagelok SKUs. ✅ No capacity concern." },
    { zone: "C03-ME", type: "40ft", skus: 545, bins: 540, furniture: "17× Heavy-Duty Shelving Bay (510), 1× V-Belt Rack (20), 1× Long Material Rack (10)", notes: "1.0 items/bin avg. Near-perfect fit. ✅ No capacity concern." },
    { zone: "C04-MP", type: "20ft", skus: 227, bins: 302, furniture: "6× Steel Shelving Bay (180), 2× Seal Drawer Cabinet (80), 1× Flat Gasket Shelf (12), 1× Small Bin Tray Array (30)", notes: "0.75 items/bin avg. 25% growth buffer available. ✅ No capacity concern." },
    { zone: "C05-CS", type: "20ft", skus: 462, bins: 338, furniture: "6× Steel Shelving Bay (180), 2× High-Freq Bin Wall (120), 2× PPE Rack (20), 1× Bunded Shelf (8), 1× Tool Cabinet (10)", notes: "1.4 items/bin avg. 259 fastener SKUs consolidate at 3–5 SKUs/bin. ✅ No capacity concern." },
    { zone: "LD (Laydown)", type: "Open Yard", skus: 113, bins: 0, furniture: "6 bays (LD-A through LD-F)", notes: "~19 items/bay avg. Forklift-accessible. ✅ No capacity concern." },
    { zone: "Wurth Cabinet", type: "Cabinet", skus: 44, bins: 0, furniture: "Dedicated Wurth mobile cabinet (60–120 SKU capacity)", notes: "~25% growth headroom. ✅ No concern." },
    { zone: "Flammable Cabinet", type: "Cabinet", skus: 6, bins: 0, furniture: "AS1940-compliant cabinet (250L capacity)", notes: "✅ No concern." },
  ];

  for (const z of zones) {
    const ratio = z.bins > 0 ? (z.skus / z.bins).toFixed(2) : "N/A";
    const pct = z.bins > 0 ? Math.round((z.skus / z.bins) * 100) + "%" : "N/A";
    rows.push([z.zone, z.type, String(z.skus), z.bins > 0 ? String(z.bins) : "N/A", ratio, pct, "Fits ✅", z.furniture, z.notes]);
  }

  rows.push([]);
  rows.push(["Total SKUs", "", String(zones.reduce((s, z) => s + z.skus, 0))]);
  rows.push(["Last Scanned", "", "2026-02-18"]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [18, 14, 12, 14, 14, 10, 10, 65, 80]);
  XLSX.utils.book_append_sheet(wb, ws, "Capacity Analysis");
}

// ── Sheet 6 — Stock Control Procedure ───────────────────────────────────────
function addStockControl(wb: XLSX.WorkBook) {
  const rows: string[][] = [];

  // §1 Purpose
  rows.push(["=== § 1 — Purpose ==="]);
  rows.push(["Purpose"]);
  for (const p of [
    "Establish controlled, traceable, accountable stock management",
    "Maintain accurate inventory levels at all times",
    "Reduce emergency freight through proactive replenishment",
    "Ensure full part traceability from receipt to use",
    "Integrate cleanly with Minesite AI system",
  ]) rows.push([p]);
  rows.push([]);
  rows.push(["Applies To"]);
  for (const c of [
    "C01-EL — Electrical", "C02-IN — Instrumentation & Pneumatics",
    "C03-ME — Mechanical (40ft)", "C04-MP — Mechanical Precision",
    "C05-CS — Consumables & Fasteners", "LD — Laydown Yard (External)",
  ]) rows.push([c]);
  rows.push([]);

  // §2 Stock In
  rows.push(["=== § 2 — Stock In Process — Receiving ==="]);
  rows.push(["Step", "Action"]);
  const receiving = [
    "Verify PO against delivery docket", "Inspect for damage", "Confirm quantity",
    "Confirm correct part number", "Photograph part (if new to catalogue)", "Apply internal part label (if required)",
  ];
  receiving.forEach((s, i) => rows.push([String(i + 1), s]));
  rows.push([]);
  rows.push(["System Entry Fields"]);
  rows.push(["Field", "Requirement"]);
  rows.push(["Date", "Auto-stamped"]);
  rows.push(["PO Number", "Mandatory"]);
  rows.push(["Supplier", "Mandatory"]);
  rows.push(["Received By", "Mandatory — named person"]);
  rows.push(["Rule", "If not system-recorded → cannot be stored. No exceptions."]);
  rows.push([]);

  // §3 Stock Out
  rows.push(["=== § 3 — Stock Out Process — Issue ==="]);
  rows.push(["Field", "Requirement"]);
  rows.push(["Work Order Number", "Mandatory"]);
  rows.push(["Area / Asset", "If available"]);
  rows.push(["Issued To", "Mandatory — named person"]);
  rows.push(["Reason", "Breakdown / PM / Planned / Shutdown"]);
  rows.push([]);
  rows.push(["Emergency Withdrawal (Nightshift Rule)"]);
  rows.push(["1. Remove part from location"]);
  rows.push(["2. Complete manual withdrawal sheet immediately"]);
  rows.push(["3. Enter into system next day before 10:00 AM"]);
  rows.push([]);

  // §4 LD Rules
  rows.push(["=== § 4 — Laydown Yard Rules ==="]);
  rows.push(["Rule"]);
  for (const r of [
    "Must be assigned LD location code (LD-A1, LD-B2, etc.)",
    "Must be physically tagged with part number, description, and date received",
    "Must be shrink-wrapped if exposed to weather",
    "All forklift movements must be logged in system",
  ]) rows.push([r]);
  rows.push([]);
  rows.push(["LD Zone", "Description"]);
  for (const z of [
    ["LD-A", "Critical Parts Overflow — Under Dome (Row A)"],
    ["LD-B", "Critical Parts Overflow — Under Dome (Row B)"],
    ["LD-C", "Pumps"], ["LD-D", "Matec"], ["LD-E", "Electrical"], ["LD-F", "Mechanical"],
  ]) rows.push(z);
  rows.push([]);

  // §5 Min/Max
  rows.push(["=== § 5 — Min / Max Stock Control ==="]);
  rows.push(["Flag", "Action"]);
  rows.push(["Below Minimum", "Immediate reorder trigger"]);
  rows.push(["Above Maximum", "Review holding cost"]);
  rows.push(["Zero Stock", "Critical alert — escalate"]);
  rows.push(["Slow-Moving (Future)", "Planned enhancement"]);
  rows.push(["Rule", "No manual bypass of minimum thresholds permitted."]);
  rows.push([]);

  // §6 Weekly
  rows.push(["=== § 6 — Weekly Controls — Wednesday Revision Day ==="]);
  rows.push(["Format: Y26-WXX | Week Start: Wednesday 00:00 | Week End: Tuesday 23:59"]);
  rows.push(["Check"]);
  for (const c of [
    "Spot check high-critical spares", "Review below-minimum items",
    "Reconcile discrepancies", "Review emergency freight occurrences",
  ]) rows.push([c]);
  rows.push([]);

  // §7 Monthly
  rows.push(["=== § 7 — Monthly Audit ==="]);
  rows.push(["Action"]);
  for (const m of [
    "Cycle count rotating container sections", "Reconcile discrepancies",
    "Review duplicates", "Adjust Min/Max where required",
  ]) rows.push([m]);
  rows.push(["Cycle Count Rotation: C01-EL (Month 1), C02-IN (Month 2), C03-ME (Month 3), C04-MP (Month 4), C05-CS (Month 5)"]);
  rows.push(["LD Yard: audited quarterly by area (LD-A through LD-F)"]);
  rows.push([]);

  // §8 Accountability
  rows.push(["=== § 8 — Accountability Rules ==="]);
  for (const r of [
    "No part moves without system entry",
    "No container access without recording issue",
    "No bulk withdrawals without WO reference",
    'No "just grab it" culture permitted',
    "Stores discipline is mandatory across all shifts — not subject to individual interpretation.",
  ]) rows.push([r]);
  rows.push([]);

  // §9 Integration
  rows.push(["=== § 9 — System Integration Requirements ==="]);
  rows.push(["Module", "Description"]);
  rows.push(["Site Spares Inventory", "Live stock levels and bin locations"]);
  rows.push(["Work Order Module", "Stock Out linked to WO number"]);
  rows.push(["Weekly Revision Calendar", "Wednesday Y26-WXX cycle"]);
  rows.push(["QR / Barcode Scanning", "Future integration — scan to issue"]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [55, 60]);
  XLSX.utils.book_append_sheet(wb, ws, "Stock Control Procedure");
}

// ── Main Export ─────────────────────────────────────────────────────────────
export function exportStoresWorkbook() {
  const wb = XLSX.utils.book_new();
  addDesignPrinciples(wb);
  addStockingScope(wb);
  addLocationCoding(wb);
  addDesignInputs(wb);
  addCapacityAnalysis(wb);
  addStockControl(wb);
  writeXlsxFile(wb, "TCMG_Stores_Warehouse_Design.xlsx");
}
