import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

type Section = {
  id: string;
  title: string;
  whatGood: string[];
  checklist: string[];
};

const SECTIONS: Section[] = [
  {
    id: "asset-foundation",
    title: "1. Asset Foundation",
    whatGood: [
      "Full asset hierarchy (L1–L7) defined end-to-end",
      "Site-wide asset naming standard enforced",
      "Criticality classification applied to every asset",
      "Equipment classification (type/class/family) populated",
      "Functional location logic codified and consistent",
    ],
    checklist: [
      "Hierarchy L1–L7 complete for all areas",
      "Naming standard documented and applied",
      "Criticality rating present per asset",
      "Equipment class assigned per asset",
      "Functional location code per asset",
    ],
  },
  {
    id: "pm-system",
    title: "2. PM System",
    whatGood: [
      "Online inspections defined (daily / weekly)",
      "Offline PMs defined for every critical asset",
      "Shutdown PMs structured on 2wk / 4wk / 12wk cycles",
      "PM requirement defined per asset class",
    ],
    checklist: [
      "PM coverage exists per asset",
      "All required PM types assigned per asset",
      "PM quality validated (tasks, safety, duration)",
    ],
  },
  {
    id: "maintenance-strategy",
    title: "3. Maintenance Strategy",
    whatGood: [
      "Lifecycle plan defined per asset",
      "Replacement intervals set for wear/life-limited items",
      "Condition-based triggers defined where applicable",
      "Failure strategies (run-to-fail / preventive / predictive) selected",
    ],
    checklist: [
      "Strategy exists per asset",
      "Strategy aligned to asset criticality",
    ],
  },
  {
    id: "shutdown-strategy",
    title: "4. Shutdown Strategy",
    whatGood: [
      "Planned shutdown cycles defined and calendarised",
      "Work packs structured per shutdown event",
      "Asset-based shutdown task lists exist",
    ],
    checklist: [
      "Shutdown PMs exist for each cycle",
      "Shutdown planning process defined",
    ],
  },
  {
    id: "stores-spares",
    title: "5. Stores & Spares",
    whatGood: [
      "BOM defined per asset",
      "Critical spares list maintained",
      "Min/max stock levels set per part",
      "Supplier linkage defined for every stocked part",
      "Bin locations assigned in the warehouse",
    ],
    checklist: [
      "BOM linked to assets",
      "Min/max defined per part",
      "Bin locations structured and labelled",
    ],
  },
  {
    id: "job-plans",
    title: "6. Job Plans",
    whatGood: [
      "Standard job templates exist for repeatable work",
      "Task steps documented per job",
      "Estimated labour hours per job",
      "Tools and equipment required per job",
    ],
    checklist: [
      "Job plans exist for common tasks",
      "Standardisation complete across crafts",
    ],
  },
  {
    id: "documentation",
    title: "7. Documentation (SOPs)",
    whatGood: [
      "Inspection procedures documented",
      "Maintenance work instructions documented",
      "OEM manuals stored and accessible",
    ],
    checklist: [
      "SOP linked to each PM",
      "SOP linked to each asset",
    ],
  },
  {
    id: "planning-scheduling",
    title: "8. Planning & Scheduling",
    whatGood: [
      "Backlog management process defined",
      "Planning workflows documented (ready-to-schedule rules)",
      "Scheduling logic defined (priority, resource, window)",
    ],
    checklist: [
      "Backlog structured and visible",
      "Planning standards defined and adopted",
    ],
  },
  {
    id: "governance-roles",
    title: "9. Governance & Roles",
    whatGood: [
      "Planner responsibilities defined",
      "Supervisor responsibilities defined",
      "Stores responsibilities defined",
    ],
    checklist: [
      "Roles defined and signed off",
      "Accountability clear (RACI in place)",
    ],
  },
];

const StatusRow = () => (
  <div className="flex items-center gap-2 pt-2">
    <span className="text-xs font-semibold text-muted-foreground">Status:</span>
    {["Complete", "Partial", "Missing"].map((s) => (
      <label key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Checkbox /> {s}
      </label>
    ))}
  </div>
);

const SectionCard = ({ section }: { section: Section }) => (
  <Card id={section.id} className="scroll-mt-20">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{section.title}</CardTitle>
        <Badge variant="outline" className="text-xs">Template</Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">What Good Looks Like</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {section.whatGood.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Checklist</h4>
        <div className="space-y-1.5">
          {section.checklist.map((item) => (
            <label key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Checkbox className="mt-0.5" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <h4 className="text-sm font-semibold text-foreground mb-1">Status</h4>
        <p className="text-xs text-muted-foreground italic">No data — master template only.</p>
        <StatusRow />
      </div>
    </CardContent>
  </Card>
);

const MaintenanceSystemFoundation = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <Layers className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Maintenance System Foundation
              </h1>
              <p className="text-muted-foreground text-sm">
                Master template — what MUST exist for a complete mining maintenance system
                (aligned to SAP, Pronto, Maximo, D365). Structure only — no live data.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SECTIONS.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </main>
    </div>
  );
};

export default MaintenanceSystemFoundation;
