import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";
import { toast } from "sonner";

type Level = "High" | "Medium" | "Low";

const RISKS: { title: string; description: string; level: Level }[] = [
  // High
  { title: "Poor User Adoption and Site Culture", description: "Workforce continues verbal requests and reactive habits. System is deployed but not used as the primary operating tool. Work remains untracked and maintenance history is lost.", level: "High" },
  { title: "Parallel Systems Continue", description: "Excel trackers, whiteboard schedules, and manual PO logs persist alongside the new system, creating two sources of truth. Users default to familiar tools and the system becomes a secondary record.", level: "High" },
  { title: "Immature Stores and Inventory Control", description: "No controlled stores environment, no receiving process, no bin locations mapped, no cycle counting. Parts cannot be issued or received through the system. Emergency purchasing continues unchecked.", level: "High" },
  { title: "Incomplete Parts Catalogue and BOM Linkage", description: "Many assets have no linked spare parts. Min/max stock levels are unpopulated, lead times are unknown, and unit costs are missing. Reorder logic does not function. PM work orders generate without parts lists.", level: "High" },
  { title: "Work Management Process Not Consistently Followed", description: "WR to WO to close workflow is built but not embedded. Some supervisors approve verbally, priority is not assessed, and work orders are closed without completion notes or parts usage recorded.", level: "High" },
  { title: "Lack of Leadership Enforcement", description: "Management does not consistently enforce system use. Supervisors are not held accountable for team compliance. Mixed signals to workforce cause adoption to stall and early adopters lose motivation.", level: "High" },
  { title: "Training Not Role-Specific or Not Reinforced", description: "Generic training sessions delivered once with no follow-up coaching, no competency checks, and no refresher schedule. Users forget processes within days and workarounds develop.", level: "High" },
  // Medium
  { title: "Asset Hierarchy Not Fully Stable", description: "Some parent-child relationships are incorrect, functional locations have gaps, and component-level detail is missing in secondary areas. Work orders raised against wrong assets and cost allocation is inaccurate.", level: "Medium" },
  { title: "PM Data Quality Becomes Inconsistent", description: "Task descriptions are vague, inspection results are not recorded, and completion notes default to generic entries. PM history is useless for failure analysis and compliance reporting is unreliable.", level: "Medium" },
  { title: "Premature Rollout Before Readiness Gates Met", description: "Pressure to show progress leads to go-live without completing stores setup, training, or leadership alignment prerequisites. Early failures erode confidence and recovery is harder than getting it right first time.", level: "Medium" },
  { title: "Labour Time and Execution Behaviour Poorly Controlled", description: "Trades do not log actual hours, travel time is unaccounted, and job duration estimates are not validated. Cannot measure labour productivity or cost per work order.", level: "Medium" },
  { title: "Too Much Rollout Scope Attempted Too Early", description: "All modules activated simultaneously instead of a controlled staged approach. Users are overwhelmed, support capacity is exceeded, and multiple process failures occur at once.", level: "Medium" },
  // Low
  { title: "Resistance to AI-Supported Workflows", description: "Site personnel distrust automated suggestions for PM scheduling, parts reordering, or work prioritisation. AI features are ignored or overridden, losing the value of intelligent automation.", level: "Low" },
  { title: "Procurement Linkage Remains Immature", description: "PR to PO conversion is manual, supplier data is incomplete, no 3-way matching exists, and freight tracking is inconsistent. Procurement operates without financial controls and spend visibility is limited.", level: "Low" },
];

const levelStyle: Record<Level, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/30",
  Medium: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  Low: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
};

const ImplementationRiskAssessment = () => (
  <div className="p-6 md:p-10 max-w-[860px] mx-auto">
    {/* Header */}
    <div className="mb-10">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">Tennant Creek Gold Mine</p>
      <h1 className="text-2xl font-extrabold text-foreground mt-1 tracking-tight">Implementation Risk Assessment</h1>
      <p className="text-xs text-muted-foreground mt-1">Minesite.ai Work Management System — Prepared for site leadership and stakeholder review</p>
      <div className="h-[2px] bg-primary/30 mt-4 w-24" />
    </div>

    {/* 1. Purpose */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">1. Purpose</h2>
      <p className="text-[13px] text-muted-foreground leading-relaxed">
        This assessment outlines the implementation risks associated with rolling out the new work management system at Tennant Creek Gold Mine. The focus is on ensuring the system is introduced in a controlled and sustainable way, recognising that success depends on site readiness across people, process, data, and operational discipline.
      </p>
    </section>

    {/* 2. Current Position */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">2. Current Position</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Progress Made</p>
          <ul className="space-y-1.5">
            {[
              "Work Request and Work Order logic developed",
              "Scheduling capability established",
              "Asset hierarchy rebuild in progress",
              "Parts catalogue development underway",
              "PM logic being developed",
            ].map(item => (
              <li key={item} className="text-[13px] text-muted-foreground flex gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Current Gaps</p>
          <ul className="space-y-1.5">
            {[
              "No fully controlled stores environment",
              "Stock visibility not yet reliable",
              "Parts and BOM linkage incomplete",
              "Work management process not fully embedded",
              "Site culture remains reactive with low accountability",
            ].map(item => (
              <li key={item} className="text-[13px] text-muted-foreground flex gap-2">
                <span className="text-destructive mt-0.5">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-[13px] text-muted-foreground font-semibold border-l-2 border-primary/40 pl-3">
        The site is progressing toward readiness, but is not yet at a point for full uncontrolled system rollout.
      </p>
    </section>

    {/* 3. Key Implementation Risks */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">3. Key Implementation Risks</h2>
      <div className="space-y-2.5">
        {RISKS.map((r, i) => (
          <div key={i} className="flex items-start gap-3 border border-border/60 rounded-lg px-4 py-3">
            <span className="text-xs font-mono font-semibold text-muted-foreground mt-0.5 w-5 shrink-0 text-right">{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground">{r.title}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{r.description}</p>
            </div>
            <span className={cn("text-[10px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 mt-0.5", levelStyle[r.level])}>
              {r.level}
            </span>
          </div>
        ))}
      </div>
    </section>

    {/* 4. Recommended Approach */}
    <section className="mb-10">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">4. Recommended Approach</h2>
      <div className="space-y-4">
        <p className="text-[13px] text-muted-foreground font-semibold border-l-2 border-destructive/40 pl-3">
          Do not proceed with full site-wide rollout at this stage.
        </p>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Adopt Phased Implementation</p>
          <div className="flex gap-2 flex-wrap">
            {["Phase 1: Foundation Stabilisation", "Phase 2: Controlled Pilot", "Phase 3: Gradual Rollout"].map((p, i) => (
              <div key={p} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40 text-xs">→</span>}
                <span className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-md border",
                  i === 0 ? "bg-blue-500/10 border-blue-500/30 text-blue-700" :
                  i === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-700" :
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
                )}>{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Focus Areas</p>
          <ul className="space-y-1.5">
            {[
              "Leadership enforcement of system use and process compliance",
              "User adoption through role-specific training and on-shift support",
              "Training delivered by role, reinforced through coaching and refreshers",
              "Removal of parallel systems (spreadsheets, manual trackers, whiteboards)",
            ].map(item => (
              <li key={item} className="text-[13px] text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* 5. Final Position */}
    <section className="mb-6">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">5. Final Position</h2>
      <div className="bg-muted/30 border border-border rounded-lg px-5 py-4 space-y-3">
        <p className="text-[13px] text-foreground font-semibold leading-relaxed">
          The system being developed is strong and has the potential to significantly improve site performance.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          However, implementation success will depend on site readiness, not system capability alone. People, process, data, stores maturity, and leadership commitment are the deciding factors.
        </p>
        <p className="text-[13px] text-foreground font-semibold leading-relaxed">
          A controlled, phased rollout aligned with operational maturity is critical to ensure long-term adoption and avoid early failure.
        </p>
      </div>
    </section>

    {/* Footer */}
    <div className="border-t border-border pt-4 mt-10">
      <p className="text-[10px] text-muted-foreground">Tennant Creek Gold Mine — Implementation Risk Assessment — Prepared for leadership and stakeholder review</p>
    </div>
    </div>
  </div>
  );
};

export default ImplementationRiskAssessment;
