import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "Not Started" | "In Progress" | "Partially Ready" | "Ready";

const statusColor: Record<Status, string> = {
  "Not Started": "bg-destructive/15 text-destructive border-destructive/30",
  "In Progress": "bg-amber-500/15 text-amber-700 border-amber-500/30",
  "Partially Ready": "bg-blue-500/15 text-blue-700 border-blue-500/30",
  "Ready": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const MODULES: { label: string; status: Status; detail: string }[] = [
  { label: "Work Request / Work Order Logic", status: "Partially Ready", detail: "Core WR → WO conversion built. Approval workflows and scheduling linkage still required." },
  { label: "Scheduling Capability", status: "Not Started", detail: "No scheduling engine integrated. Weekly planning is manual and reactive." },
  { label: "PM Logic Development", status: "Ready", detail: "PM templates, master list, and asset linkage staging complete across all disciplines." },
  { label: "Asset Hierarchy Progress", status: "Ready", detail: "Rev B asset register finalised. Functional locations and parent-child rules established." },
  { label: "Parts Catalogue Progress", status: "Partially Ready", detail: "Site spares catalogue active. Min/max levels and lead times partially populated." },
  { label: "Stores / Inventory Readiness", status: "In Progress", detail: "Warehouse layout designed. Stock control procedures drafted. Physical setup pending." },
  { label: "Procurement Linkage Maturity", status: "Partially Ready", detail: "PR → PO → Receipt flow built. Supplier data enrichment (ABN, payment terms) incomplete." },
  { label: "Reporting / Analytics Build Status", status: "Not Started", detail: "No operational dashboards or KPI reporting built. Mission Control is placeholder only." },
];

const StatusBadge = ({ status }: { status: Status }) => (
  <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap", statusColor[status])}>
    {status}
  </span>
);

export const CurrentStateTab = () => {
  const readyCount = MODULES.filter(m => m.status === "Ready").length;
  const partialCount = MODULES.filter(m => m.status === "Partially Ready").length;

  return (
    <div className="space-y-6">
      {/* Phase banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4 px-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Project Phase</p>
              <p className="text-lg font-bold text-foreground mt-0.5">Foundation Build & Data Structuring</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Modules Ready</p>
              <p className="text-2xl font-bold text-primary">{readyCount}<span className="text-sm font-normal text-muted-foreground">/{MODULES.length}</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module status cards */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Module Readiness</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODULES.map((m) => (
            <Card key={m.label} className="border-border/60">
              <CardContent className="py-3 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{m.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.detail}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Narrative */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Current Readiness Position</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            The TCMG framework has made strong progress on foundational data structures. The asset hierarchy is finalised, PM templates are built across all disciplines, and procurement workflows are functional. {readyCount} of {MODULES.length} core modules are rated as Ready, with a further {partialCount} Partially Ready.
          </p>
          <p>
            However, full rollout risk remains high. Scheduling capability has not been started, reporting and analytics are absent, and stores and inventory controls are still maturing. Parts catalogue data gaps (min/max levels, lead times, unit costs) and supplier data enrichment remain outstanding.
          </p>
          <p className="font-medium text-foreground">
            Implementation should not proceed to go-live until remaining site foundations and behavioural readiness are addressed. A phased, controlled approach is strongly recommended.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
