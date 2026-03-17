import { useState } from "react";
import { AreaSummary, MissionJob } from "@/hooks/useMissionControl";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { X, Clock, AlertTriangle, CheckCircle2, Circle } from "lucide-react";

const INDICATOR_COLORS = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  grey: "bg-muted-foreground/40",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  "Complete": <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  "In Progress": <Clock className="w-3.5 h-3.5 text-blue-500" />,
  "Blocked": <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
  "At Risk": <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  "Not Started": <Circle className="w-3.5 h-3.5 text-muted-foreground" />,
};

// Approximate plant layout positions (grid-based)
const AREA_POSITIONS: Record<string, { row: number; col: number }> = {
  Crushing:   { row: 0, col: 0 },
  Screening:  { row: 0, col: 1 },
  Grinding:   { row: 0, col: 2 },
  Flotation:  { row: 1, col: 0 },
  CIL:        { row: 1, col: 1 },
  Reagents:   { row: 1, col: 2 },
  Tailings:   { row: 2, col: 0 },
  Water:      { row: 2, col: 1 },
  Utilities:  { row: 2, col: 2 },
};

interface Props {
  areas: AreaSummary[];
  overallProgress: number;
}

export function MapOverview({ areas, overallProgress }: Props) {
  const [selectedArea, setSelectedArea] = useState<AreaSummary | null>(null);

  const totalJobs = areas.reduce((s, a) => s + a.totalJobs, 0);
  const totalComplete = areas.reduce((s, a) => s + a.completed, 0);
  const totalDelayed = areas.reduce((s, a) => s + a.delayed, 0);

  return (
    <div className="space-y-6">
      {/* Command Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Overall Progress</p>
            <p className="text-3xl font-black text-primary mt-1">{overallProgress}%</p>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Jobs</p>
            <p className="text-3xl font-black text-foreground mt-1">{totalJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
            <p className="text-3xl font-black text-emerald-500 mt-1">{totalComplete}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Delayed / Blocked</p>
            <p className="text-3xl font-black text-red-500 mt-1">{totalDelayed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-6">
        {/* Plant Map Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-3">
            {areas.map((area) => (
              <button
                key={area.area}
                onClick={() => setSelectedArea(area)}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg",
                  selectedArea?.area === area.area
                    ? "border-primary shadow-md bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                {/* Status dot */}
                <div className={cn("absolute top-3 right-3 w-3 h-3 rounded-full", INDICATOR_COLORS[area.indicator])} />

                <h3 className="font-bold text-sm text-foreground">{area.area}</h3>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-foreground text-right">{area.totalJobs}</span>
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-semibold text-blue-500 text-right">{area.inProgress}</span>
                  <span className="text-muted-foreground">Delayed</span>
                  <span className="font-semibold text-red-500 text-right">{area.delayed}</span>
                  <span className="text-muted-foreground">Done</span>
                  <span className="font-semibold text-emerald-500 text-right">{area.completed}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        {selectedArea && (
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-20">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full", INDICATOR_COLORS[selectedArea.indicator])} />
                  <CardTitle className="text-base">{selectedArea.area}</CardTitle>
                </div>
                <button onClick={() => setSelectedArea(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
                {selectedArea.jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No jobs in this area</p>
                ) : (
                  selectedArea.jobs.map((job) => (
                    <div key={job.id} className="rounded-lg border border-border p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground leading-tight">{job.name}</p>
                        {STATUS_ICON[job.status]}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.status === "Blocked" ? "destructive" : job.status === "Complete" ? "default" : "secondary"} className="text-[10px]">
                          {job.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{job.woNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Crew: {job.assignedCrew}</span>
                        <span>{job.percentComplete}%</span>
                      </div>
                      <Progress value={job.percentComplete} className="h-1" />
                      {job.blockers && (
                        <p className="text-[10px] text-red-500">⚠ {job.blockers}</p>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
