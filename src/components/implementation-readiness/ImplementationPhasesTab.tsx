import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Phase {
  phase: string; title: string; objective: string; scope: string;
  entry: string[]; activities: string[]; exit: string[]; risks: string[];
}

const PHASES: Phase[] = [
  {
    phase: "Phase 1", title: "Foundation Stabilisation",
    objective: "Ensure all prerequisite data, processes, and infrastructure are in place before any live system use.",
    scope: "Asset data validation, stores setup, process documentation, training preparation, leadership alignment.",
    entry: ["Project sponsor confirmed", "Asset register Rev B approved", "Budget allocated for stores setup"],
    activities: [
      "Complete parts catalogue data enrichment (top 200 critical spares)",
      "Establish physical stores and receiving process",
      "Document and approve WR → WO → Schedule → Close workflow",
      "Develop role-based training materials",
      "Identify and brief super users (min 2 per shift)",
      "Conduct leadership alignment workshop",
      "Complete desktop walkthrough with supervisors",
    ],
    exit: ["All pilot prerequisites met", "Leadership sign-off obtained", "Training materials reviewed and approved"],
    risks: ["Leadership disengagement", "Stores setup delayed by site logistics", "Data enrichment resource not available"],
  },
  {
    phase: "Phase 2", title: "Controlled Pilot",
    objective: "Test the system and processes in a controlled area with a small group of users before wider rollout.",
    scope: "Single area or crew. Limited to work requests, work orders, and basic PM execution.",
    entry: ["Phase 1 exit criteria met", "Pilot area and crew selected", "Super users trained"],
    activities: [
      "Deploy system to pilot group",
      "Run parallel processes (old and new) for 2 weeks minimum",
      "Collect daily feedback from users and super users",
      "Monitor work order creation, completion, and quality",
      "Identify process gaps and system issues",
      "Adjust workflows based on real-world feedback",
    ],
    exit: ["Pilot group operating without critical issues for 2+ weeks", "Feedback reviewed and actions completed", "Go/No-Go decision made by project sponsor"],
    risks: ["Pilot group reverts to old habits", "Issues discovered that require major rework", "Insufficient super user support"],
  },
  {
    phase: "Phase 3", title: "Operational Go-Live",
    objective: "Roll out the system to all site areas with full process enforcement.",
    scope: "All maintenance areas, all trades, full WR/WO/PM/Stores/Procurement workflow.",
    entry: ["Phase 2 exit criteria met", "Scheduling capability operational", "Reporting dashboard live", "Support model confirmed"],
    activities: [
      "Roll out system access to all users",
      "Activate PM scheduling and compliance tracking",
      "Enable procurement workflows site-wide",
      "Conduct role-based training for all user groups",
      "Deploy support model (helpdesk, escalation)",
      "Daily stand-ups for first 2 weeks to address issues",
    ],
    exit: ["All user groups active in system", "PM compliance tracking operational", "No critical open issues for 1+ week"],
    risks: ["User resistance at scale", "System performance issues under load", "Leadership fails to enforce compliance"],
  },
  {
    phase: "Phase 4", title: "Reinforcement & Optimisation",
    objective: "Embed system use into site culture and continuously improve processes.",
    scope: "Ongoing. Focus on adoption reinforcement, data quality, reporting maturity, and advanced features.",
    entry: ["Phase 3 exit criteria met", "System stable for 4+ weeks"],
    activities: [
      "Monitor adoption KPIs (login frequency, WO completion rates, PM compliance)",
      "Address low-adoption areas with targeted support",
      "Implement advanced analytics and trend reporting",
      "Review and optimise PM frequencies based on failure data",
      "Expand stores controls (barcode scanning, cycle counting maturity)",
      "Introduce 3-way match procurement",
      "Plan D365 / ERP integration if required",
    ],
    exit: ["Ongoing; quarterly review cycle established"],
    risks: ["Complacency; system use declines over time", "Data quality degrades without governance", "Leadership attention shifts to other priorities"],
  },
];

const phaseColors = ["border-blue-500/40 bg-blue-500/5", "border-amber-500/40 bg-amber-500/5", "border-emerald-500/40 bg-emerald-500/5", "border-purple-500/40 bg-purple-500/5"];

const ListSection = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <p className="text-[11px] font-semibold text-foreground mb-1">{title}</p>
    <ul className="space-y-0.5">
      {items.map((item, i) => (
        <li key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
          <span className="text-muted-foreground/50 mt-0.5">•</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const ImplementationPhasesTab = () => (
  <div className="space-y-5">
    <p className="text-sm text-muted-foreground">
      Rollout must be phased and controlled. A big-bang approach carries unacceptable risk for a site with maturing systems and reactive culture.
    </p>
    <div className="space-y-4">
      {PHASES.map((p, i) => (
        <Card key={p.phase} className={cn("border", phaseColors[i])}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              <span className="font-bold">{p.phase}</span> — {p.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-semibold text-foreground mb-0.5">Objective</p>
                <p className="text-[11px] text-muted-foreground">{p.objective}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground mb-0.5">Scope</p>
                <p className="text-[11px] text-muted-foreground">{p.scope}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <ListSection title="Entry Criteria" items={p.entry} />
              <ListSection title="Key Activities" items={p.activities} />
              <ListSection title="Exit Criteria" items={p.exit} />
              <ListSection title="Key Risks" items={p.risks} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
