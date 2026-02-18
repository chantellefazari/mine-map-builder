import { AlertTriangle, CheckCircle, XCircle, Info, Package, Warehouse } from "lucide-react";

// ── Capacity model ─────────────────────────────────────────────────────────
// Based on containerFitoutData.ts physical specs.
// Each 900mm shelving bay has 5 levels × ~6 standard bins = 30 bin positions.
// Drawer units hold ~40 small-parts drawers.
// Bin walls hold ~60–80 individual bins.

interface ContainerCapacity {
  id: string;
  label: string;
  type: "20ft" | "40ft" | "cabinet";
  physicalLengthMm: number;
  aisleWidthMm: number;
  furniture: { type: string; qty: number; binsEach: number }[];
  totalBinPositions: number;
  notes: string[];
}

interface InventorySlot {
  zone: string;
  itemCount: number;
  concerns: string[];
  flags: ("ok" | "warning" | "critical")[];
}

const CONTAINERS: ContainerCapacity[] = [
  {
    id: "C01-EL",
    label: "C01 – Electrical",
    type: "20ft",
    physicalLengthMm: 5900,
    aisleWidthMm: 1150,
    furniture: [
      { type: "Shelving Bay (900mm, 5 levels)", qty: 6, binsEach: 30 },
      { type: "ESD Bin Panel", qty: 2, binsEach: 40 },
      { type: "Reinforced VSD Shelf", qty: 1, binsEach: 8 },
      { type: "PLC Cabinet (lockable)", qty: 1, binsEach: 6 },
    ],
    totalBinPositions: 6 * 30 + 2 * 40 + 8 + 6, // = 274
    notes: [
      "Positive airflow / dust-controlled environment",
      "ESD panels protect sensitive components",
      "VSD shelf reinforced for heavier inverter drives",
      "PLC cabinet lockable — limited to master PLCs only",
    ],
  },
  {
    id: "C02-IN",
    label: "C02 – Instrumentation, Pneumatics & Fittings",
    type: "20ft",
    physicalLengthMm: 5900,
    aisleWidthMm: 1150,
    furniture: [
      { type: "Foam-Lined Shelving Bay (5 levels)", qty: 5, binsEach: 25 },
      { type: "Foam Storage Totes (40×)", qty: 1, binsEach: 40 },
      { type: "Drawer Cabinet (Swagelok/Fittings)", qty: 2, binsEach: 30 },
      { type: "Boxed Instruments Bay", qty: 2, binsEach: 20 },
      { type: "Tubing Reel Rack", qty: 1, binsEach: 8 },
    ],
    totalBinPositions: 5 * 25 + 40 + 2 * 30 + 2 * 20 + 8, // = 273
    notes: [
      "Foam-lined shelves for fragile instruments",
      "Drawer cabinets consolidate small BSP / Swagelok fittings efficiently",
      "Large PE/Plasson fittings (>110mm) suit the shelving bays well",
      "Tubing reels stored vertically on end-wall rack",
    ],
  },
  {
    id: "C03-ME",
    label: "C03 – Mechanical (40ft)",
    type: "40ft",
    physicalLengthMm: 12030,
    aisleWidthMm: 1150,
    furniture: [
      { type: "Heavy-Duty Shelving Bay (5 levels)", qty: 17, binsEach: 30 },
      { type: "V-Belt Rack", qty: 1, binsEach: 20 },
      { type: "Long Material Rack (conduit/bar)", qty: 1, binsEach: 10 },
    ],
    totalBinPositions: 17 * 30 + 20 + 10, // = 540
    notes: [
      "40ft container provides ~2× the bin capacity of 20ft units",
      "V-belt rack accommodates a large range of belt sizes vertically",
      "All items must be ≤15 kg — oversized pipe/structural to LD Yard",
    ],
  },
  {
    id: "C04-MP",
    label: "C04 – Mechanical Precision",
    type: "20ft",
    physicalLengthMm: 5900,
    aisleWidthMm: 1150,
    furniture: [
      { type: "Steel Shelving Bay (5 levels)", qty: 6, binsEach: 30 },
      { type: "Seal Drawer Cabinet", qty: 2, binsEach: 40 },
      { type: "Flat Gasket Shelf", qty: 1, binsEach: 12 },
      { type: "Small Bin Trays (30×)", qty: 1, binsEach: 30 },
    ],
    totalBinPositions: 6 * 30 + 2 * 40 + 12 + 30, // = 262
    notes: [
      "Drawer cabinets highly efficient for seals, O-rings, and small bearings",
      "Flat gasket shelf provides horizontal storage without creasing",
      "Small bin trays ideal for circlips, shims, retaining rings",
    ],
  },
  {
    id: "C05-CS",
    label: "C05 – Consumables & Supplies",
    type: "20ft",
    physicalLengthMm: 5900,
    aisleWidthMm: 1150,
    furniture: [
      { type: "Steel Shelving Bay (5 levels)", qty: 6, binsEach: 30 },
      { type: "High-Frequency Bin Wall", qty: 2, binsEach: 60 },
      { type: "PPE Rack", qty: 2, binsEach: 10 },
      { type: "Bunded Grease/Oil Shelf", qty: 1, binsEach: 8 },
      { type: "Lockable Tool Cabinet", qty: 1, binsEach: 10 },
    ],
    totalBinPositions: 6 * 30 + 2 * 60 + 2 * 10 + 8 + 10, // = 338
    notes: [
      "Bin walls are Kanban-style — ideal for high-turn fasteners",
      "Bunded shelf safely contains grease/oil spills",
      "PPE rack near door for fast daily access",
    ],
  },
];

// ── Live inventory against capacity ───────────────────────────────────────
const INVENTORY: InventorySlot[] = [
  {
    zone: "C01-EL",
    itemCount: 444,
    concerns: [
      "444 unique line items vs ~274 bin positions → ~1.6 items/bin average — manageable with multi-item bins for small components (bootlace pins, plugs, cable ties).",
      "22 Electrical items currently in C05-CS (plugs, junction boxes, bootlace pins) — these are consumable-grade electrical items. OK to leave in C05 for fast access, but flag for review.",
    ],
    flags: ["warning"],
  },
  {
    zone: "C02-IN",
    itemCount: 349,
    concerns: [
      "349 items vs ~273 positions → ~1.3 items/bin. Tight but achievable — drawer cabinets will absorb most small BSP fittings efficiently (each drawer = ~10 part numbers).",
      "253 Pipe Fittings in C03-ME are correctly PE/Plasson (large bore). The 169 Pipe Fittings in C02-IN are correctly BSP/Class 150 process fittings. Split is confirmed valid.",
    ],
    flags: ["ok"],
  },
  {
    zone: "C03-ME",
    itemCount: 549,
    concerns: [
      "549 items in a 40ft container (~540 positions) → ~1.0 items/bin. Excellent fit — the 40ft length was specifically sized for this load.",
      "DN90×6m HDPE pipe lengths (9 in stock) will NOT fit on standard shelving — these must be stored in the LD Laydown Yard (long material). Recommend re-allocating to LD.",
      "2 Gearbox items in C03-ME — verify these are small gearbox components (<15kg), not full assemblies. Full gearboxes belong in LD.",
    ],
    flags: ["warning"],
  },
  {
    zone: "C04-MP",
    itemCount: 229,
    concerns: [
      "229 items vs ~262 positions → 0.87 items/bin. Good headroom — ~12% growth buffer before capacity is reached.",
      "Pump sleeves, lantern rings, and coupling spiders are all small precision parts — correctly located in C04-MP.",
      "'Feed Pump Drive' and 'Cyclone Feed Pumps' entries have 0 qty — likely placeholder records. Flag for data review.",
    ],
    flags: ["ok"],
  },
  {
    zone: "C05-CS",
    itemCount: 462,
    concerns: [
      "462 items vs ~338 positions → ~1.4 items/bin. Feasible — bin walls handle high-frequency fasteners in bulk bins (many fasteners share a single bin by size/grade).",
      "259 Fasteners will consolidate well into bin walls — estimate 2–4 part numbers per bin for standard sizes.",
    ],
    flags: ["ok"],
  },
  {
    zone: "LD (Laydown Yard)",
    itemCount: 109,
    concerns: [
      "109 items across 6 bays (LD-A through LD-F) → ~18 items/bay average. Well within capacity for open laydown storage.",
      "Consider moving DN90×6m HDPE pipe (currently C03-ME) to LD — it is oversized for container shelving.",
    ],
    flags: ["warning"],
  },
  {
    zone: "Wurth Cabinet",
    itemCount: 44,
    concerns: [
      "44 items in a dedicated Wurth mobile cabinet — standard Wurth vending/cabinet holds 60–120 SKUs. No capacity concern.",
    ],
    flags: ["ok"],
  },
  {
    zone: "Flammable Cabinet",
    itemCount: 6,
    concerns: [
      "6 aerosol/flammable items — a standard AS1940 compliant flammable goods cabinet holds 250L, typically 20–80 aerosol cans. No capacity concern.",
    ],
    flags: ["ok"],
  },
];

const STATUS_CONFIG = {
  ok: { icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10 border-green-500/30", label: "Fits" },
  warning: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", label: "Review" },
  critical: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 border-red-500/30", label: "Over Capacity" },
};

const overallFlag = (flags: ("ok" | "warning" | "critical")[]) => {
  if (flags.includes("critical")) return "critical";
  if (flags.includes("warning")) return "warning";
  return "ok";
};

export const CapacityAnalysis = () => {
  const containerMap = Object.fromEntries(CONTAINERS.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-1">Storage Capacity Scan</h2>
            <p className="text-sm text-muted-foreground">
              Physical fitout capacity vs live inventory counts. Bin positions estimated from furniture specs in{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">containerFitoutData.ts</code>.
              Rule: items/bin &gt; 2.0 = crowded; &gt; 3.0 = critical.
            </p>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: INVENTORY.reduce((s, i) => s + i.itemCount, 0).toLocaleString() },
          { label: "Storage Zones", value: INVENTORY.length },
          { label: "Zones OK", value: INVENTORY.filter((i) => overallFlag(i.flags) === "ok").length },
          { label: "Need Review", value: INVENTORY.filter((i) => overallFlag(i.flags) !== "ok").length },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-zone cards */}
      <div className="space-y-4">
        {INVENTORY.map((inv) => {
          const container = containerMap[inv.zone];
          const flag = overallFlag(inv.flags);
          const cfg = STATUS_CONFIG[flag];
          const StatusIcon = cfg.icon;
          const binPositions = container?.totalBinPositions;
          const ratio = binPositions ? inv.itemCount / binPositions : null;
          const usagePct = binPositions ? Math.min(100, Math.round((inv.itemCount / binPositions) * 100)) : null;

          return (
            <div key={inv.zone} className={`border rounded-lg overflow-hidden ${cfg.bg}`}>
              {/* Zone header */}
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                  <span className="font-semibold text-foreground text-sm">{inv.zone}</span>
                  {container && (
                    <span className="text-xs text-muted-foreground">— {container.label.split("–")[1]?.trim()}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{inv.itemCount} SKUs</span>
                  {binPositions && (
                    <span className="text-xs text-muted-foreground">/ {binPositions} positions</span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>

              {/* Capacity bar */}
              {usagePct !== null && (
                <div className="px-5 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usagePct >= 100 ? "bg-red-500" : usagePct >= 80 ? "bg-amber-500" : "bg-green-500"
                        }`}
                        style={{ width: `${usagePct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-10 text-right">{usagePct}%</span>
                    {ratio !== null && (
                      <span className="text-xs text-muted-foreground">({ratio.toFixed(1)} items/bin avg)</span>
                    )}
                  </div>
                </div>
              )}

              {/* Furniture spec */}
              {container && (
                <div className="px-5 pb-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {container.furniture.map((f) => (
                      <span key={f.type} className="text-xs bg-background/60 border border-border rounded px-2 py-1">
                        {f.qty}× {f.type} <span className="text-muted-foreground">({f.qty * f.binsEach} pos)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              <div className="px-5 pb-4 space-y-1.5">
                {inv.concerns.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{c}</p>
                  </div>
                ))}
              </div>

              {/* Container fitout notes */}
              {container && (
                <div className="border-t border-border/50 px-5 py-3">
                  <p className="text-xs font-medium text-foreground mb-1.5">Fitout Notes</p>
                  <ul className="space-y-0.5">
                    {container.notes.map((n, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action summary */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-start gap-3 mb-4">
          <Warehouse className="w-4 h-4 text-primary mt-0.5" />
          <h3 className="font-semibold text-foreground text-sm">Recommended Actions</h3>
        </div>
        <ol className="space-y-2">
          {[
            {
              flag: "warning",
              text: "Move DN90×6m HDPE pipe lengths (C03-ME → LD-F Overflow/Staging): these are 6-metre lengths — physically impossible to shelve in a 20ft/40ft container.",
            },
            {
              flag: "warning",
              text: "Verify 2 Gearbox items in C03-ME are component-level (<15 kg). If full assemblies, relocate to LD-E.",
            },
            {
              flag: "warning",
              text: "Review 'Feed Pump Drive' and 'Cyclone Feed Pumps' records (qty = 0 in C04-MP) — likely placeholder entries needing data clean-up.",
            },
            {
              flag: "ok",
              text: "22 Electrical consumable items in C05-CS (plugs, junction boxes, bootlace pins) — acceptable. These are high-turn consumables; keeping them in C05 for fast access is a deliberate decision.",
            },
            {
              flag: "ok",
              text: "All 5 containers are within feasible capacity. Bin-sharing (multiple part numbers per bin) is normal practice and already factored into the fitout design.",
            },
          ].map((a, i) => {
            const Icon = a.flag === "ok" ? CheckCircle : AlertTriangle;
            const col = a.flag === "ok" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400";
            return (
              <li key={i} className="flex items-start gap-2">
                <Icon className={`w-3.5 h-3.5 ${col} mt-0.5 flex-shrink-0`} />
                <span className="text-sm text-muted-foreground">{a.text}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
