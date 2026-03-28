import { useState } from "react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Likelihood = "Low" | "Medium" | "High";
type Impact = "Low" | "Medium" | "High";
type OverallRisk = "Low" | "Moderate" | "High" | "Critical";

const overallColor: Record<OverallRisk, string> = {
  Low: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Moderate: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  High: "bg-orange-500/15 text-orange-700 border-orange-500/30",
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
};

interface Risk {
  id: string; category: string; description: string; likelihood: Likelihood; impact: Impact;
  overall: OverallRisk; consequence: string; mitigation: string; owner: string; status: string;
}

const RISKS: Risk[] = [
  { id: "R-001", category: "People / Culture", description: "Poor user adoption: trades and operators do not log into the system, continue requesting work verbally or via text message, and bypass the work request process entirely.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Work remains untracked. Maintenance history is incomplete. System investment is wasted. Site reverts to reactive firefighting with no visibility on backlog or cost.", mitigation: "Mandate all work requests through the system from Day 1 of pilot. Supervisors reject verbal requests. Super users on every shift to coach in real time. Weekly adoption scorecards visible to site leadership.", owner: "Site Manager", status: "Open" },
  { id: "R-002", category: "Process", description: "Parallel systems persist: spreadsheets, personal trackers, whiteboard schedules, and ad-hoc Excel PO logs continue alongside the new system, creating duplicate records and confusion.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Two sources of truth. Conflicting data. Users default to familiar tools. System becomes a secondary record rather than the operating platform.", mitigation: "Set a hard cutover date per area. Remove access to legacy spreadsheets after pilot validation. Leadership must visibly use system dashboards in meetings, not spreadsheets.", owner: "Project Lead", status: "Open" },
  { id: "R-003", category: "Stores / Inventory", description: "Physical stores setup is incomplete: no secure storage, no receiving process, no bin locations mapped, and no cycle counting regime in place before system go-live.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Parts cannot be issued or received through the system. Stock levels are unreliable. Emergency purchasing continues unchecked. Planned maintenance fails due to parts unavailability.", mitigation: "Establish physical stores infrastructure before pilot. Implement receiving workflow with goods receipt confirmation. Begin fortnightly cycle counts on critical spares. Assign dedicated stores person.", owner: "Stores Lead", status: "Open" },
  { id: "R-004", category: "Data", description: "Parts catalogue and BOM linkage is incomplete: many assets have no linked spare parts, min/max stock levels are unpopulated, lead times are unknown, and unit costs are missing.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Reorder logic does not function. PM work orders generate without parts lists. Planners cannot kit jobs. Stockouts on critical components cause unplanned downtime.", mitigation: "Prioritise BOM linkage for top 50 critical assets before pilot. Enrich min/max and lead time data for top 200 spares. Run weekly data quality reports and assign corrections to data steward.", owner: "Data Lead", status: "Open" },
  { id: "R-005", category: "Data", description: "Asset hierarchy is not fully stable: some parent-child relationships are incorrect, functional locations have gaps, and component-level detail is missing in secondary areas.", likelihood: "Medium", impact: "High", overall: "High", consequence: "Work orders are raised against wrong assets. PM coverage has gaps. Reporting by area or system is unreliable. Cost allocation is inaccurate.", mitigation: "Complete hierarchy validation walkdown for pilot area before go-live. Lock Rev B register as baseline. Implement change control for any hierarchy modifications. Schedule full site audit within 90 days of go-live.", owner: "Data Lead", status: "Open" },
  { id: "R-006", category: "Process", description: "Work request and work order process is not followed consistently: some supervisors approve verbally, priority is not assessed, and work orders are closed without completion notes or parts usage.", likelihood: "High", impact: "High", overall: "Critical", consequence: "No reliable maintenance history. Cannot measure backlog, response times, or cost per asset. Planning is impossible without consistent WO data.", mitigation: "Conduct desktop walkthroughs with every supervisor before pilot. Define mandatory fields that block WO closure (completion notes, actual hours, parts used). Audit WO quality weekly during first 3 months.", owner: "Maintenance Superintendent", status: "Open" },
  { id: "R-007", category: "Change Management", description: "Resistance to AI-supported workflows: site personnel distrust automated suggestions for PM scheduling, parts reordering, or work prioritisation, viewing them as replacing trade knowledge.", likelihood: "Medium", impact: "Medium", overall: "Moderate", consequence: "AI features are ignored or overridden. Value of intelligent automation is lost. Users feel the system is being imposed rather than supporting them.", mitigation: "Position AI as a decision-support tool, not a replacement. Show concrete examples where AI catches issues humans miss. Allow manual override with logged justification. Involve experienced trades in validating AI recommendations.", owner: "Project Lead", status: "Open" },
  { id: "R-008", category: "Change Management", description: "Training is not role-specific or not reinforced: generic training sessions are delivered once, with no follow-up coaching, no competency checks, and no refresher schedule.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Users forget processes within days. Workarounds develop. Super users become overwhelmed answering basic questions. Frustration drives rejection of the system.", mitigation: "Develop separate training packages for operators, trades, supervisors, planners, and stores. Include hands-on exercises using real site data. Schedule refresher sessions at 2 weeks and 6 weeks post-go-live. Super users deliver floor coaching daily.", owner: "Training Lead", status: "Open" },
  { id: "R-009", category: "People / Culture", description: "Site leadership does not consistently enforce system use: supervisors are not held accountable for team compliance, and management continues accepting information delivered outside the system.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Mixed signals to workforce. Adoption stalls. Early adopters lose motivation. System becomes optional rather than operational.", mitigation: "Include system compliance in supervisor KPIs. Site manager to reference only system data in weekly meetings. Department heads to conduct monthly compliance audits. Address non-compliance through normal performance management.", owner: "Site Manager", status: "Open" },
  { id: "R-010", category: "PM", description: "PM data quality becomes inconsistent over time: task descriptions are vague, inspection results are not recorded, and completion notes default to 'done' without meaningful detail.", likelihood: "Medium", impact: "High", overall: "High", consequence: "PM history is useless for failure analysis. Cannot justify PM frequency adjustments. Compliance reporting is unreliable. OEM warranty claims are unsupported.", mitigation: "Define minimum PM completion standards (specific readings, pass/fail criteria, photo evidence for key inspections). Implement PM quality audit: random sample 10% of completed PMs weekly. Flag and return substandard completions.", owner: "Maintenance Planner", status: "Open" },
  { id: "R-011", category: "Rollout", description: "Rollout proceeds before readiness gates are met: pressure to show progress leads to go-live without completing stores setup, training, or leadership alignment prerequisites.", likelihood: "Medium", impact: "High", overall: "High", consequence: "System launches into an environment not ready to support it. Early failures erode confidence. Recovery is significantly harder than getting it right first time.", mitigation: "Define explicit Go/No-Go gates with measurable criteria. Project sponsor must sign off each gate. No gate can be waived without formal risk acceptance documented and communicated.", owner: "Project Sponsor", status: "Open" },
  { id: "R-012", category: "Process", description: "Labour time recording and execution behaviour remain poorly controlled: trades do not log actual hours, travel time is unaccounted, and job duration estimates are not validated.", likelihood: "High", impact: "Medium", overall: "High", consequence: "Cannot measure labour productivity or cost per work order. Resource planning is guesswork. Cannot identify where time is being lost or where crew sizing is wrong.", mitigation: "Make actual hours a mandatory field on WO completion. Implement simple start/stop time capture on mobile. Compare estimated vs actual weekly and discuss variances in planning meetings. Do not use data punitively in first 6 months.", owner: "Maintenance Superintendent", status: "Open" },
  { id: "R-013", category: "Procurement", description: "Procurement linkage remains immature: PR to PO conversion is manual, supplier data is incomplete (ABN, payment terms), no 3-way matching exists, and freight tracking is inconsistent.", likelihood: "Medium", impact: "Medium", overall: "Moderate", consequence: "Procurement operates without financial controls. Duplicate orders occur. Spend visibility is limited. Supplier performance cannot be measured.", mitigation: "Complete supplier data enrichment for top 20 active suppliers before pilot. Implement mandatory PR approval before PO creation. Build goods receipt confirmation into stores receiving process. Track freight against PO as standard practice.", owner: "Procurement Lead", status: "Open" },
  { id: "R-014", category: "Rollout", description: "Too much rollout scope attempted too early: all modules (WO, PM, stores, procurement, scheduling, reporting) are activated simultaneously instead of a controlled, staged approach.", likelihood: "Medium", impact: "High", overall: "High", consequence: "Users are overwhelmed. Support capacity is exceeded. Multiple process failures occur simultaneously. Difficult to isolate and fix root causes.", mitigation: "Phase 1: Work requests and work orders only. Phase 2: Add PM execution and basic stores. Phase 3: Add procurement and scheduling. Phase 4: Reporting and optimisation. Each phase has minimum 4-week stabilisation before next.", owner: "Project Lead", status: "Open" },
];

const CATEGORIES = [...new Set(RISKS.map(r => r.category))];
const OVERALL_LEVELS: OverallRisk[] = ["Critical", "High", "Moderate", "Low"];

export const RiskRegisterTab = () => {
  const [catFilter, setCatFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const filtered = RISKS.filter(r =>
    (catFilter === "all" || r.category === catFilter) &&
    (riskFilter === "all" || r.overall === riskFilter)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="All Risk Levels" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            {OVERALL_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground ml-auto">{filtered.length} risk{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-[10px] font-semibold w-[60px]">ID</TableHead>
              <TableHead className="text-[10px] font-semibold w-[120px]">Category</TableHead>
              <TableHead className="text-[10px] font-semibold">Risk Description</TableHead>
              <TableHead className="text-[10px] font-semibold w-[70px] text-center">Likelihood</TableHead>
              <TableHead className="text-[10px] font-semibold w-[60px] text-center">Impact</TableHead>
              <TableHead className="text-[10px] font-semibold w-[80px] text-center">Overall</TableHead>
              <TableHead className="text-[10px] font-semibold">Consequence</TableHead>
              <TableHead className="text-[10px] font-semibold">Mitigation</TableHead>
              <TableHead className="text-[10px] font-semibold w-[110px]">Owner</TableHead>
              <TableHead className="text-[10px] font-semibold w-[60px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow key={r.id} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                <TableCell className="text-[11px] font-mono font-semibold text-foreground">{r.id}</TableCell>
                <TableCell className="text-[11px] text-foreground">{r.category}</TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{r.description}</TableCell>
                <TableCell className="text-[11px] text-center">{r.likelihood}</TableCell>
                <TableCell className="text-[11px] text-center">{r.impact}</TableCell>
                <TableCell className="text-center">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", overallColor[r.overall])}>{r.overall}</span>
                </TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{r.consequence}</TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{r.mitigation}</TableCell>
                <TableCell className="text-[11px] text-foreground">{r.owner}</TableCell>
                <TableCell className="text-[11px]">{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
