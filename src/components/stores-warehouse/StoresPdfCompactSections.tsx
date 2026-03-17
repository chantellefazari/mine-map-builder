import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-1 pl-4 text-sm text-muted-foreground list-disc">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export const StoresImplementationSummarySection = () => {
  const milestones = [
    "Relocate obstructions and clear compound footprint",
    "Complete earthworks, drainage shaping, and slab prep",
    "Place container set C01–C05 and establish LD bays",
    "Install fitout, labels, and stock governance controls",
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Executive Implementation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Central stores delivery focuses on controlled storage, traceable stock movement, and faster maintenance response.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="font-medium text-foreground mb-1">Target Outcomes</p>
            <BulletList
              items={[
                "Single governed stores zone",
                "Accurate stock visibility",
                "Reduced emergency freight",
                "Improved breakdown response",
              ]}
            />
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Delivery Milestones</p>
            <BulletList items={milestones} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StoresDesignPrinciplesSummarySection = () => (
  <Card className="border-border">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Design Principles (Summary)</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          "Manual handling limit: ≤15 kg",
          "Electrical/mechanical separation",
          "Dust control for sensitive stock",
          "Clear location labelling",
          "Fast vs slow mover zoning",
          "Safe access and housekeeping",
        ].map((rule) => (
          <div key={rule} className="rounded-md border border-border bg-muted/40 p-2 text-sm text-foreground">
            {rule}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const ContainerStockingScopeSummarySection = () => (
  <Card className="border-border">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Container Stocking Scope (Summary)</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2 text-sm">
        {[
          ["C01-EL", "Electrical components + control gear"],
          ["C02-IN", "Instrumentation + pneumatics"],
          ["C03-ME", "Mechanical high-volume parts"],
          ["C04-MP", "Precision mechanical parts"],
          ["C05-CS", "Consumables, fasteners, PPE"],
          ["LD", "Heavy/oversize items requiring forklift"],
        ].map(([zone, scope]) => (
          <div key={zone} className="rounded-md border border-border p-2 bg-card">
            <p className="font-semibold text-foreground">{zone}</p>
            <p className="text-muted-foreground">{scope}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Governance rule: containers hold carryable items only; oversized assemblies and long material stay in LD external storage.
      </p>
    </CardContent>
  </Card>
);

export const StoreLocationCodingSummarySection = () => (
  <Card className="border-border">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Location Coding Summary</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm">
      <div className="rounded-md border border-border bg-muted/40 p-2">
        <p className="font-mono text-foreground">Container Format: C0X-XX-[Bay][Bin]</p>
        <p className="font-mono text-foreground">External Format: LD-[Bay][Position]</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 text-muted-foreground">
        <p>• Container discipline must match code (EL/IN/ME/MP/CS)</p>
        <p>• Bay letters A–H, J–K (skip I), bin 1–99</p>
        <p>• No duplicate location codes across store</p>
        <p>• External storage limited to LD-A through LD-F</p>
      </div>
    </CardContent>
  </Card>
);

export const DesignInputsSummarySection = () => (
  <Card className="border-border">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Design Inputs for Layout Handoff</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-muted-foreground">
      <p>Core handoff inputs captured for future spatial modelling:</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-muted/40 p-2">
          <p className="font-medium text-foreground">Environment</p>
          <p>Dust control for electrical/instrumentation zones.</p>
        </div>
        <div className="rounded-md border border-border bg-muted/40 p-2">
          <p className="font-medium text-foreground">Access</p>
          <p>High-frequency zones positioned for shortest retrieval path.</p>
        </div>
        <div className="rounded-md border border-border bg-muted/40 p-2">
          <p className="font-medium text-foreground">Growth</p>
          <p>10–25% growth allowance maintained across storage zones.</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const CapacityAnalysisSummarySection = () => {
  const metrics = [
    ["Total SKUs", "2,190"],
    ["Storage Zones", "8"],
    ["Zones Within Capacity", "8 / 8"],
    ["Scan Date", "2026-02-18"],
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Capacity Analysis (Executive Summary)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-muted/40 p-2 text-center">
              <p className="text-base font-semibold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Result: no container exceeds practical storage density after relocating oversize items to LD zones.
        </p>
      </CardContent>
    </Card>
  );
};

export const StockControlProcedureSummarySection = () => (
  <Card className="border-border">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Stock Control Procedure (Summary)</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-muted-foreground">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="font-medium text-foreground mb-1">Stock In (Receiving)</p>
          <BulletList
            items={[
              "Verify PO, condition, quantity, and part number",
              "Record receipt in system before storage",
              "Assign bin location and physically place item",
              "Capture trace fields (date, supplier, receiver)",
            ]}
          />
        </div>
        <div>
          <p className="font-medium text-foreground mb-1">Stock Out (Issue)</p>
          <BulletList
            items={[
              "Record withdrawal before part leaves shelf",
              "Require WO + issued-to + reason code",
              "Use emergency paper flow only during outage",
              "Back-enter outage transactions by next shift",
            ]}
          />
        </div>
      </div>
      <div className="rounded-md border border-border bg-muted/40 p-2">
        <p className="font-medium text-foreground">Audit Cadence</p>
        <p>Weekly spot checks + monthly cycle counts + discrepancy reconciliation.</p>
      </div>
    </CardContent>
  </Card>
);
