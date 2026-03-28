import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, Clock } from "lucide-react";

interface Prereq { item: string; detail: string; }

const BEFORE_PILOT: Prereq[] = [
  { item: "Agreed asset hierarchy signed off", detail: "Rev B register finalised and approved by site leadership." },
  { item: "Minimum parts catalogue maturity", detail: "Top 200 critical spares fully populated with min/max, lead times, and costs." },
  { item: "Basic stores control in place", detail: "Physical stores established. Receiving process operational. Cycle counting started." },
  { item: "Role-based workflow agreed", detail: "WR → WO → Schedule → Close workflow documented and approved by supervisors." },
  { item: "Training material prepared", detail: "Role-based training packages for operators, trades, and supervisors." },
  { item: "Super users identified and trained", detail: "Minimum 2 super users per shift trained and ready to support." },
  { item: "Leadership endorsement signed", detail: "Written commitment from site manager and department heads." },
  { item: "Desktop walkthrough completed", detail: "End-to-end process tested with real users before live system access." },
];

const BEFORE_GOLIVE: Prereq[] = [
  { item: "Pilot feedback addressed", detail: "All critical issues from pilot resolved. Process adjustments made." },
  { item: "Scheduling capability operational", detail: "Weekly planning tool functional. Backlog visible and managed." },
  { item: "PM scheduling connected", detail: "PM templates linked to calendar. Auto-generation of PM work orders." },
  { item: "Reporting dashboard live", detail: "Top 10 KPIs visible: WO completion, backlog, PM compliance, spend." },
  { item: "Supplier data enriched", detail: "ABN, payment terms, and contact details complete for active suppliers." },
  { item: "Support model defined", detail: "Helpdesk, escalation path, and post-go-live support structure confirmed." },
  { item: "Change management plan active", detail: "Comms plan, stakeholder engagement, and resistance management in place." },
  { item: "Data governance established", detail: "Change control process and data steward roles assigned." },
];

const AFTER_PHASE1: Prereq[] = [
  { item: "Advanced analytics and trend reporting", detail: "Failure analysis, cost trending, and predictive maintenance metrics." },
  { item: "Mobile offline capability", detail: "Field data capture without network connectivity." },
  { item: "3-way match procurement", detail: "PO, goods receipt, and invoice matching for financial controls." },
  { item: "Barcode / RFID integration", detail: "Automated stock transactions and asset identification." },
  { item: "Integration with D365 or corporate ERP", detail: "Data synchronisation with enterprise systems." },
];

const Section = ({ icon: Icon, title, color, items }: { icon: typeof ShieldAlert; title: string; color: string; items: Prereq[] }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className={cn("flex gap-3 py-2 px-3 rounded-md text-xs", i % 2 === 0 ? "bg-muted/30" : "")}>
          <span className="font-semibold text-foreground min-w-0 flex-shrink-0 w-[240px]">{p.item}</span>
          <span className="text-muted-foreground">{p.detail}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

export const RolloutPrerequisitesTab = () => (
  <div className="space-y-5">
    <p className="text-sm text-muted-foreground">
      Prerequisites are grouped by implementation gate. <span className="font-semibold text-destructive">Non-negotiables</span> must be complete before proceeding. Staged improvements can follow.
    </p>
    <Section icon={ShieldAlert} title="A. Must Be Complete Before Pilot" color="text-destructive" items={BEFORE_PILOT} />
    <Section icon={ShieldCheck} title="B. Must Be Complete Before Full Go-Live" color="text-amber-600" items={BEFORE_GOLIVE} />
    <Section icon={Clock} title="C. Can Be Completed After Phase 1" color="text-blue-600" items={AFTER_PHASE1} />
  </div>
);
