import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Rating = "Low" | "Moderate" | "High";

const ratingStyle: Record<Rating, string> = {
  Low: "bg-destructive/15 text-destructive border-destructive/30",
  Moderate: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  High: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const CATEGORIES: {
  category: string;
  currentState: string;
  rating: Rating;
  gaps: string;
  impact: string;
  action: string;
}[] = [
  { category: "Asset Data Readiness", currentState: "Rev B asset register finalised. Hierarchy and FL codes set.", rating: "High", gaps: "Minor component-level gaps in some sub-areas.", impact: "Low; asset data is strong.", action: "Complete component audit for remaining sub-areas." },
  { category: "PM Readiness", currentState: "Templates built across all disciplines. Asset linkage staged.", rating: "High", gaps: "PM scheduling engine not connected. No compliance tracking.", impact: "Low; PM content is strong, execution framework needed.", action: "Connect PM scheduling to calendar. Build compliance dashboard." },
  { category: "Leadership Alignment", currentState: "Awareness of project, limited active sponsorship.", rating: "Moderate", gaps: "No formal endorsement of new processes.", impact: "Critical; without enforcement, adoption will fail.", action: "Secure signed leadership commitment and accountability framework." },
  { category: "Work Management Process", currentState: "WR/WO logic built. No live workflow testing.", rating: "Moderate", gaps: "Approval chains, priority rules, and escalation paths undefined.", impact: "Moderate; processes exist but are untested operationally.", action: "Define end-to-end workflow with site supervisors. Run desktop walkthrough." },
  { category: "Parts / Catalogue Readiness", currentState: "Catalogue active. Core items loaded.", rating: "Moderate", gaps: "Min/max, lead times, and unit costs partially populated.", impact: "Moderate; reorder logic will not function without thresholds.", action: "Prioritise top 200 critical spares for full data enrichment." },
  { category: "Procurement Readiness", currentState: "PR → PO → Receipt flow functional.", rating: "Moderate", gaps: "Supplier ABN and payment terms incomplete. No 3-way match.", impact: "Moderate; procurement can function but lacks controls.", action: "Complete supplier data enrichment. Implement goods receipt matching." },
  { category: "Technical / System Readiness", currentState: "Application built and functional in development.", rating: "Moderate", gaps: "No load testing, no mobile optimisation, no offline capability.", impact: "Moderate; system works but untested at operational scale.", action: "Conduct performance testing. Validate mobile access on site devices." },
  { category: "People & Culture", currentState: "Reactive maintenance culture. Limited system discipline.", rating: "Low", gaps: "No formal change readiness. Ad-hoc work practices.", impact: "High; users will resist structured workflows.", action: "Site culture assessment and leadership alignment workshops." },
  { category: "Scheduling Process", currentState: "No scheduling capability built.", rating: "Low", gaps: "No weekly planning tool, backlog management, or resource levelling.", impact: "High; work will remain reactive without scheduling.", action: "Design basic weekly scheduling framework and integrate with WO system." },
  { category: "Stores & Inventory Readiness", currentState: "Layout designed. Procedures drafted. Physical setup pending.", rating: "Low", gaps: "No stock control in practice. No receiving process. No cycle counting.", impact: "High; inventory accuracy will be unreliable.", action: "Establish physical stores, implement receiving workflow, begin cycle counts." },
  { category: "Reporting & Analytics Readiness", currentState: "No dashboards or KPIs built.", rating: "Low", gaps: "No visibility on WO completion, backlog, PM compliance, or spend.", impact: "High; leadership cannot measure performance.", action: "Define top 10 operational KPIs. Build initial dashboard." },
  { category: "Training Readiness", currentState: "No training materials or plan exists.", rating: "Low", gaps: "No role-based training. No super users identified.", impact: "High; users will not know how to use the system.", action: "Develop role-based training packages. Identify and train super users." },
  { category: "Change Management Readiness", currentState: "No formal change management approach.", rating: "Low", gaps: "No comms plan, no stakeholder engagement, no resistance management.", impact: "Critical; largest single risk to implementation success.", action: "Appoint change lead. Develop stakeholder engagement and comms plan." },
];

const RatingBadge = ({ rating }: { rating: Rating }) => (
  <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap", ratingStyle[rating])}>
    {rating}
  </span>
);

export const ReadinessAssessmentTab = () => {
  const lowCount = CATEGORIES.filter(c => c.rating === "Low").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-destructive">{lowCount}</span> of {CATEGORIES.length} categories rated Low readiness.
        </p>
        <div className="flex gap-2 ml-auto">
          {(["Low", "Moderate", "High"] as Rating[]).map(r => (
            <span key={r} className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", ratingStyle[r])}>{r}</span>
          ))}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold w-[180px]">Category</TableHead>
              <TableHead className="text-xs font-semibold">Current State</TableHead>
              <TableHead className="text-xs font-semibold w-[90px] text-center">Rating</TableHead>
              <TableHead className="text-xs font-semibold">Key Gaps</TableHead>
              <TableHead className="text-xs font-semibold w-[160px]">Impact on Rollout</TableHead>
              <TableHead className="text-xs font-semibold w-[200px]">Recommended Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORIES.map((c, i) => (
              <TableRow key={c.category} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                <TableCell className="text-xs font-semibold text-foreground">{c.category}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.currentState}</TableCell>
                <TableCell className="text-center"><RatingBadge rating={c.rating} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.gaps}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.impact}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
