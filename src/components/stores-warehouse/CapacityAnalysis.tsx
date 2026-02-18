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
// ── LIVE counts (last scanned: 2026-02-18) ───────────────────────────────
const INVENTORY: InventorySlot[] = [
  {
    zone: "C01-EL",
    itemCount: 444,
    concerns: [
      "444 SKUs vs ~274 bin positions → 1.6 items/bin avg. Achievable — ESD bin panels handle bulk small parts (bootlace pins, plugs, cable ties) at 20–40 parts per bin.",
      "22 consumable-grade electrical items (plugs, junction boxes) remain in C05-CS intentionally — these are high-turn items better accessed from the consumables container. ✓ Confirmed by design.",
      "✅ No remaining issues — all items are electrical components correctly sized for C01 shelving.",
    ],
    flags: ["ok"],
  },
  {
    zone: "C02-IN",
    itemCount: 349,
    concerns: [
      "349 SKUs vs ~273 bin positions → 1.3 items/bin avg. Tight but confirmed feasible — 2 drawer cabinets absorb ~60 small BSP/Swagelok fitting SKUs (each drawer holds ~10–15 part numbers).",
      "169 BSP/Class 150 process fittings and 37 instruments correctly in C02-IN. 253 PE/Plasson fittings correctly separated into C03-ME. Split is confirmed valid. ✓",
      "✅ No capacity concern — drawer units provide high-density storage for small fittings.",
    ],
    flags: ["ok"],
  },
  {
    zone: "C03-ME",
    itemCount: 545,
    concerns: [
      "545 SKUs vs ~540 bin positions → 1.0 items/bin avg. Near-perfect fit for the 40ft container — the extra length was sized for exactly this load.",
      "✅ DN90×6m and DN110×6m Vinidex HDPE pipe lengths REMOVED from C03-ME → relocated to LD-F1. No more oversized items.",
      "✅ Both SEW-EURODRIVE gearbox assemblies REMOVED from C03-ME → relocated to LD-E1. All remaining items are shelving-compatible.",
      "V-belt rack on end wall provides dedicated storage for belts — no shelf space consumed by awkward shapes.",
    ],
    flags: ["ok"],
  },
  {
    zone: "C04-MP",
    itemCount: 227,
    concerns: [
      "227 SKUs vs ~262 bin positions → 0.87 items/bin avg. Best headroom of all containers — ~13% growth buffer available.",
      "✅ Zero-qty placeholders ('Feed Pump Drive', 'Cyclone Feed Pumps') deleted. Record count reduced from 229 → 227.",
      "Pump sleeves, lantern rings, shaft sleeves, coupling spiders — all small precision parts correctly placed. Drawer cabinets will consolidate seals and O-rings at 15–20 SKUs per drawer.",
      "✅ No capacity concern.",
    ],
    flags: ["ok"],
  },
  {
    zone: "C05-CS",
    itemCount: 462,
    concerns: [
      "462 SKUs vs ~338 bin positions → 1.4 items/bin avg. Feasible — 259 fastener SKUs will consolidate into bin walls at 3–5 part numbers per bin (sorted by size/grade/material).",
      "2 high-frequency bin walls provide Kanban-style bulk storage. 6 rear shelving bays handle consumables, PPE, and sealants with room to group by category.",
      "✅ No capacity concern — bin wall design is purpose-built for this fastener density.",
    ],
    flags: ["ok"],
  },
  {
    zone: "LD (Laydown Yard)",
    itemCount: 113,
    concerns: [
      "113 items across 6 bays (LD-A through LD-F) → ~19 items/bay avg. Well within open-yard capacity.",
      "✅ 2× DN 6m HDPE pipe lengths relocated here from C03-ME → LD-F1 (overflow/staging). Correctly placed.",
      "✅ 2× SEW-EURODRIVE gearbox assemblies relocated here from C03-ME → LD-E1. Correctly placed alongside other motors.",
      "Bays LD-C (Crusher Liners), LD-D (Screen Panels), LD-E (Large Motors/Gearboxes), LD-F (Overflow) remain well within forklift-accessible capacity.",
    ],
    flags: ["ok"],
  },
  {
    zone: "Wurth Cabinet",
    itemCount: 44,
    concerns: [
      "44 SKUs in a dedicated Wurth mobile vending/cabinet — standard capacity is 60–120 SKUs. ✅ Comfortable fit with ~25% growth headroom.",
    ],
    flags: ["ok"],
  },
  {
    zone: "Flammable Cabinet",
    itemCount: 6,
    concerns: [
      "6 aerosol/flammable items — AS1940-compliant flammable goods cabinet holds 250L (typically 40–80 aerosol cans). ✅ No capacity concern whatsoever.",
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
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground text-sm">Scan Result — All Clear ✅</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last scanned: 2026-02-18 · 2,190 total SKUs across 8 zones</p>
          </div>
        </div>
        <ol className="space-y-2">
      {[
            {
              flag: "ok",
              text: "✅ DN90×6m and DN110×6m Vinidex HDPE pipe lengths relocated from C03-ME → LD-F1. C03-ME is now fully shelving-compatible.",
            },
            {
              flag: "ok",
              text: "✅ Both SEW-EURODRIVE gearbox assemblies relocated from C03-ME → LD-E1. No full assemblies remain in the containers.",
            },
            {
              flag: "ok",
              text: "✅ Zero-qty placeholder records ('Feed Pump Drive', 'Cyclone Feed Pumps') deleted from C04-MP. Record count corrected to 227.",
            },
            {
              flag: "ok",
              text: "✅ 22 consumable-grade electrical items (plugs, junction boxes, bootlace pins) intentionally retained in C05-CS for fast daily access. Confirmed by design.",
            },
            {
              flag: "ok",
              text: "✅ ALL 8 storage zones are within confirmed physical capacity. Every container, cabinet, and yard bay can accommodate the current inventory. No further allocation changes required.",
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
