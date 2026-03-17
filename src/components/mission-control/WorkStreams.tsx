import { useState } from "react";
import { MissionJob, AreaSummary } from "@/hooks/useMissionControl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Circle, Clock, GripVertical } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "border-l-muted-foreground/40",
  "In Progress": "border-l-blue-500",
  "Blocked": "border-l-red-500",
  "At Risk": "border-l-amber-500",
  "Complete": "border-l-emerald-500",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  "Complete": <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  "In Progress": <Clock className="w-3.5 h-3.5 text-blue-500" />,
  "Blocked": <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
  "At Risk": <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  "Not Started": <Circle className="w-3.5 h-3.5 text-muted-foreground" />,
};

type GroupBy = "area" | "crew" | "trade";

interface Props {
  areas: AreaSummary[];
  jobs: MissionJob[];
}

export function WorkStreams({ areas, jobs }: Props) {
  const [groupBy, setGroupBy] = useState<GroupBy>("area");

  const grouped = (() => {
    const map: Record<string, MissionJob[]> = {};
    for (const job of jobs) {
      const key = groupBy === "area" ? job.area : groupBy === "crew" ? job.assignedCrew : (job.trade || "Unassigned");
      if (!map[key]) map[key] = [];
      map[key].push(job);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  })();

  return (
    <div className="space-y-4">
      {/* Group toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Group by:</span>
        {(["area", "crew", "trade"] as GroupBy[]).map((g) => (
          <button
            key={g}
            onClick={() => setGroupBy(g)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
              groupBy === g ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {grouped.map(([group, groupJobs]) => {
          const completed = groupJobs.filter(j => j.status === "Complete").length;
          const blocked = groupJobs.filter(j => j.status === "Blocked").length;
          return (
            <div key={group} className="min-w-[280px] max-w-[320px] flex-shrink-0">
              <div className="rounded-xl border border-border bg-card">
                {/* Column header */}
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">{group}</h3>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">{groupJobs.length}</Badge>
                    {blocked > 0 && <Badge variant="destructive" className="text-[10px]">{blocked} blocked</Badge>}
                  </div>
                </div>

                {/* Job cards */}
                <div className="p-2 space-y-2 max-h-[65vh] overflow-y-auto">
                  {groupJobs.map((job) => (
                    <div
                      key={job.id}
                      className={cn(
                        "rounded-lg border border-border bg-background p-3 border-l-4 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow",
                        STATUS_COLORS[job.status]
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-foreground leading-tight truncate">{job.name}</p>
                            {STATUS_ICON[job.status]}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge
                              variant={job.status === "Blocked" ? "destructive" : job.status === "Complete" ? "default" : "secondary"}
                              className="text-[10px]"
                            >
                              {job.status}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{job.percentComplete}%</span>
                            {job.remainingHours > 0 && (
                              <span className="text-[10px] text-muted-foreground">{job.remainingHours}h rem</span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{job.assignedCrew}</p>
                          {job.blockers && (
                            <p className="text-[10px] text-red-500 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" /> {job.blockers}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {groupJobs.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">No jobs</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {grouped.length === 0 && (
          <p className="text-sm text-muted-foreground py-10 text-center w-full">No work orders found</p>
        )}
      </div>
    </div>
  );
}
