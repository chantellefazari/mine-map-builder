import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const STAKEHOLDERS = [
  { group: "Operators", changes: "Must raise work requests through the system instead of verbal requests.", resistance: "Perceived extra effort. Distrust of technology. Literacy barriers.", training: "Basic WR creation, status tracking. Hands-on with mobile device.", support: "Super user on shift. Visual quick-reference guides." },
  { group: "Trades", changes: "Receive WOs digitally. Must record time, parts used, and completion notes.", resistance: "\"Paper was fine.\" Reluctance to document work. Time pressure.", training: "WO acceptance, task recording, parts booking, PM execution.", support: "Super user support. Simplified mobile interface." },
  { group: "Supervisors", changes: "Approve WRs, assign priority, manage weekly schedule, enforce compliance.", resistance: "Loss of informal control. Accountability becomes visible.", training: "WR approval, scheduling, backlog management, team performance.", support: "Planner support. Leadership reinforcement of expectations." },
  { group: "Planners / Schedulers", changes: "Own the weekly schedule, backlog, and resource allocation.", resistance: "New role with high visibility. Requires new skills.", training: "Full system training: scheduling, PM compliance, reporting, backlog.", support: "Dedicated training time. Ongoing coaching from project team." },
  { group: "Stores / Procurement", changes: "Manage stock through system. Process PRs/POs digitally. Track receipts.", resistance: "Unfamiliar processes. Current methods are informal.", training: "Stock management, receiving, PR/PO workflow, supplier management.", support: "Process documentation. Stores lead accountability." },
  { group: "Admin / Coordination", changes: "Support data entry, reporting, and system administration.", resistance: "Additional workload. Unclear role boundaries.", training: "Data management, reporting, user support procedures.", support: "Clear role definition. Protected time for system tasks." },
  { group: "Site Leadership", changes: "Use dashboards for decision-making. Enforce system compliance.", resistance: "Competing priorities. Delegation without follow-through.", training: "Dashboard interpretation, KPI review, escalation triggers.", support: "Monthly progress reviews. Executive sponsor check-ins." },
];

const SECTIONS = [
  { title: "Super User / Champion Model", content: "Minimum 2 super users per shift, trained ahead of rollout. Super users provide first-line support, coach users in real time, and escalate system issues. They are selected for influence and willingness, not just technical ability." },
  { title: "Site Communication Plan", content: "Pre-rollout: 4-week awareness campaign using toolbox talks, notice boards, and shift handovers. During rollout: daily updates on progress, wins, and known issues. Post-rollout: weekly adoption scorecard visible to all." },
  { title: "Leadership Accountability Actions", content: "Site manager signs commitment letter. Department heads attend training overview. Supervisors are accountable for team compliance. Non-compliance is addressed through normal performance management, not IT support." },
  { title: "Post-Go-Live Support", content: "Weeks 1-2: project team on site full-time. Weeks 3-4: reduced to half-day. Month 2+: remote support with scheduled site visits. Helpdesk available during business hours." },
  { title: "Adoption Monitoring", content: "Track: daily active users, WO creation rate, WO completion rate, PM compliance %, average time to close WO, system bypass incidents. Report weekly to site leadership. Address low-adoption areas with targeted intervention." },
];

export const ChangeTrainingTab = () => (
  <div className="space-y-6">
    <p className="text-sm text-muted-foreground font-medium">
      System success depends on user behaviour and site culture, not just software. Every stakeholder group must understand what changes, why it matters, and how they will be supported.
    </p>

    {/* Stakeholder matrix */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Stakeholder Impact & Training Matrix</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-[10px] font-semibold w-[130px]">Stakeholder Group</TableHead>
                <TableHead className="text-[10px] font-semibold">What Changes</TableHead>
                <TableHead className="text-[10px] font-semibold">Likely Resistance</TableHead>
                <TableHead className="text-[10px] font-semibold">Training Required</TableHead>
                <TableHead className="text-[10px] font-semibold">Support Required</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STAKEHOLDERS.map((s, i) => (
                <TableRow key={s.group} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <TableCell className="text-[11px] font-semibold text-foreground">{s.group}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">{s.changes}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">{s.resistance}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">{s.training}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">{s.support}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Support sections */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SECTIONS.map(s => (
        <Card key={s.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">{s.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{s.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
