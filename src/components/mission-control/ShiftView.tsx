import { MissionJob, AreaSummary } from "@/hooks/useMissionControl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, Clock, ArrowRight, Printer } from "lucide-react";

interface Props {
  areas: AreaSummary[];
  jobs: MissionJob[];
  criticalJobs: MissionJob[];
}

export function ShiftView({ areas, jobs, criticalJobs }: Props) {
  const completedJobs = jobs.filter(j => j.status === "Complete");
  const blockedJobs = jobs.filter(j => j.status === "Blocked");
  const inProgressJobs = jobs.filter(j => j.status === "In Progress");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4" id="shift-view">
      {/* Print button */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Printer className="w-3.5 h-3.5" /> Print Shift Board
        </button>
      </div>

      {/* A. Area Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">A. Area Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {areas.map((area) => (
              <div
                key={area.area}
                className={cn(
                  "rounded-lg border p-3 text-center",
                  area.indicator === "green" && "border-emerald-500/40 bg-emerald-500/5",
                  area.indicator === "amber" && "border-amber-500/40 bg-amber-500/5",
                  area.indicator === "red" && "border-red-500/40 bg-red-500/5",
                  area.indicator === "grey" && "border-border bg-muted/30",
                )}
              >
                <p className="text-xs font-bold text-foreground">{area.area}</p>
                <Badge
                  variant={area.indicator === "red" ? "destructive" : area.indicator === "amber" ? "secondary" : "default"}
                  className="text-[10px] mt-1"
                >
                  {area.indicator === "green" ? "On Track" : area.indicator === "red" ? "Delayed" : area.indicator === "amber" ? "At Risk" : "Not Started"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* B. Critical Jobs This Shift */}
      <Card className="border-amber-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            B. Critical Jobs This Shift
          </CardTitle>
        </CardHeader>
        <CardContent>
          {criticalJobs.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No critical jobs</p>
          ) : (
            <div className="space-y-2">
              {criticalJobs.slice(0, 8).map((job) => (
                <div key={job.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                  <Badge variant={job.status === "Blocked" ? "destructive" : "secondary"} className="text-[10px] w-20 justify-center">
                    {job.status}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{job.name}</p>
                    <p className="text-[10px] text-muted-foreground">{job.area} • {job.assignedCrew}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold">{job.remainingHours}h</p>
                    <p className="text-[10px] text-muted-foreground">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* C. Work Completed */}
        <Card className="border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              C. Completed ({completedJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedJobs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No completed jobs yet</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {completedJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span className="truncate text-foreground">{job.name}</span>
                    <span className="text-muted-foreground flex-shrink-0">{job.area}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* D. Blockers / Issues */}
        <Card className="border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              D. Blockers / Issues ({blockedJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blockedJobs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No blockers 👍</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {blockedJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-2 text-xs">
                    <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
                    <span className="truncate text-foreground">{job.name}</span>
                    <span className="text-muted-foreground flex-shrink-0">{job.blockers}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* E. Next Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            E. Next Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {inProgressJobs.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No active jobs to action</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {inProgressJobs.slice(0, 10).map((job) => (
                <div key={job.id} className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  <span className="truncate text-foreground font-medium">{job.name}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground flex-shrink-0">{job.area} • {job.assignedCrew}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
