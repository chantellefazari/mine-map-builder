import { MissionJob } from "@/hooks/useMissionControl";
import { PlantRule } from "@/hooks/usePlantIntelligence";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowRight, Zap } from "lucide-react";

interface Props {
  criticalJobs: MissionJob[];
  constraints: PlantRule[];
}

export function CriticalPath({ criticalJobs, constraints }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Critical Jobs</p>
            <p className="text-3xl font-black text-red-500 mt-1">{criticalJobs.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Blocked</p>
            <p className="text-3xl font-black text-amber-500 mt-1">
              {criticalJobs.filter(j => j.status === "Blocked").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Constraints</p>
            <p className="text-3xl font-black text-primary mt-1">{constraints.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Jobs Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Critical Path Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {criticalJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No critical path jobs detected — all on track</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Job</TableHead>
                  <TableHead className="text-xs">Area</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Priority</TableHead>
                  <TableHead className="text-xs">Delay Impact</TableHead>
                  <TableHead className="text-xs">Recommended Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="text-xs font-medium">
                      <div>
                        <p>{job.name}</p>
                        <p className="text-muted-foreground">{job.woNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{job.area}</TableCell>
                    <TableCell>
                      <Badge
                        variant={job.status === "Blocked" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={job.priority === "Emergency" ? "destructive" : "outline"} className="text-[10px]">
                        {job.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {job.status === "Blocked" ? (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Est. {job.remainingHours}h delay
                        </span>
                      ) : (
                        <span className="text-amber-500">At risk</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {job.status === "Blocked" ? "Resolve blocker immediately" : "Monitor closely"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Active Constraints from Plant Intelligence */}
      {constraints.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Active Plant Constraints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {constraints.slice(0, 10).map((rule) => (
              <div key={rule.id} className="rounded-lg border border-border p-3 flex items-start gap-3">
                <Badge variant="outline" className="text-[10px] flex-shrink-0 mt-0.5">{rule.rule_type}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{rule.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    IF {rule.if_condition} <ArrowRight className="w-3 h-3 inline mx-1" /> THEN {rule.then_action}
                  </p>
                </div>
                <Badge
                  variant={rule.impact_level === "Critical" ? "destructive" : "secondary"}
                  className="text-[10px] flex-shrink-0"
                >
                  {rule.impact_level}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
