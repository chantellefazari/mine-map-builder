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
  { id: "R-001", category: "People / Culture", description: "Site workforce resists structured work order processes and reverts to reactive habits.", likelihood: "High", impact: "High", overall: "Critical", consequence: "System is deployed but not used. Work remains untracked.", mitigation: "Leadership enforcement, super user support, visible consequences for non-compliance.", owner: "Site Manager", status: "Open" },
  { id: "R-002", category: "Change Management", description: "No formal change management plan exists. Rollout treated as an IT project.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Adoption fails. Investment is wasted.", mitigation: "Appoint change lead. Develop comms plan, training schedule, and resistance management.", owner: "Project Lead", status: "Open" },
  { id: "R-003", category: "Stores / Inventory", description: "Physical stores not established. No stock control, receiving, or cycle counting in place.", likelihood: "High", impact: "High", overall: "Critical", consequence: "Parts unavailable when needed. Emergency purchasing continues.", mitigation: "Establish physical stores before pilot. Implement basic receiving and stock check processes.", owner: "Stores Lead", status: "Open" },
  { id: "R-004", category: "Data", description: "Parts catalogue incomplete; min/max levels, lead times, and unit costs not populated.", likelihood: "Medium", impact: "High", overall: "High", consequence: "Reorder logic fails. Stockouts and overstocking.", mitigation: "Prioritise top 200 critical spares for full data enrichment before pilot.", owner: "Data Lead", status: "Open" },
  { id: "R-005", category: "Process", description: "Work management workflow (WR → WO → schedule → close) not tested with real users.", likelihood: "Medium", impact: "High", overall: "High", consequence: "Process breaks down under operational pressure.", mitigation: "Conduct desktop walkthroughs with supervisors and trades before pilot.", owner: "Project Lead", status: "Open" },
  { id: "R-006", category: "PM", description: "PM templates built but not connected to scheduling engine or compliance tracking.", likelihood: "Medium", impact: "Medium", overall: "Moderate", consequence: "PMs exist in system but are not triggered or tracked.", mitigation: "Connect PM scheduling to calendar. Build compliance dashboard before go-live.", owner: "Maintenance Planner", status: "Open" },
  { id: "R-007", category: "Procurement", description: "Supplier data incomplete. No 3-way matching (PO, receipt, invoice).", likelihood: "Medium", impact: "Medium", overall: "Moderate", consequence: "Procurement operates without financial controls.", mitigation: "Complete supplier enrichment. Implement goods receipt matching.", owner: "Procurement Lead", status: "Open" },
  { id: "R-008", category: "Governance", description: "No data governance or change control process for ongoing system management.", likelihood: "Medium", impact: "Medium", overall: "Moderate", consequence: "Data quality degrades over time. Duplicate records and inconsistencies.", mitigation: "Establish data governance committee. Implement change request process.", owner: "Data Lead", status: "Open" },
  { id: "R-009", category: "Technical", description: "System not tested at operational scale or on site mobile devices.", likelihood: "Low", impact: "High", overall: "Moderate", consequence: "Performance issues in the field. Users lose confidence.", mitigation: "Conduct load testing and mobile device validation before pilot.", owner: "Technical Lead", status: "Open" },
  { id: "R-010", category: "Rollout", description: "Big-bang rollout attempted instead of phased approach.", likelihood: "Medium", impact: "High", overall: "High", consequence: "Overwhelms site. Multiple failure points simultaneously.", mitigation: "Enforce phased rollout: Foundation → Pilot → Go-Live → Reinforcement.", owner: "Project Lead", status: "Open" },
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
