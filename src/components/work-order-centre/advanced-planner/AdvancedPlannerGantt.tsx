import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { PlannerRow } from "./AdvancedPlannerView";

interface WeekCol {
  key: string;
  weekNum: number;
  year: number;
  startDay: string;
  endDay: string;
  monthYear: string;
  date: Date;
}

interface Props {
  rows: PlannerRow[];
  weekColumns: WeekCol[];
}

const TYPE_BAR_COLORS: Record<string, string> = {
  PM: "bg-blue-500",
  General: "bg-emerald-500",
  Breakdown: "bg-red-500",
  Shutdown: "bg-amber-500",
};

export function AdvancedPlannerGantt({ rows, weekColumns }: Props) {
  const colWidth = 40;
  const rowHeight = 28;
  const labelWidth = 280;

  return (
    <div className="h-full overflow-auto">
      <div className="flex">
        {/* Left labels */}
        <div className="shrink-0" style={{ width: labelWidth }}>
          {/* Header spacer */}
          <div className="h-10 border-b border-border bg-muted/20 flex items-end px-2 pb-1">
            <span className="text-[10px] font-semibold text-muted-foreground">Task</span>
          </div>
          {rows.map(row => (
            <div
              key={row.id}
              className="border-b border-border/30 px-2 flex items-center gap-1.5 hover:bg-muted/20"
              style={{ height: rowHeight }}
            >
              <span className="text-[10px] text-muted-foreground font-mono w-16 shrink-0 truncate">{row.woNumber || row.assetNumber}</span>
              <span className="text-[10px] text-foreground truncate">{row.taskName}</span>
            </div>
          ))}
        </div>

        {/* Gantt area */}
        <div className="flex-1 overflow-x-auto">
          {/* Week headers */}
          <div className="flex border-b border-border bg-muted/20" style={{ height: 40 }}>
            {weekColumns.map(wc => (
              <div
                key={wc.key}
                className="border-l border-border/50 flex flex-col items-center justify-end pb-1 shrink-0"
                style={{ width: colWidth }}
              >
                <span className="text-[9px] font-medium text-muted-foreground">W{wc.weekNum}</span>
                <span className="text-[8px] text-muted-foreground/60">{wc.startDay}</span>
              </div>
            ))}
          </div>
          {/* Bars */}
          {rows.map(row => (
            <div key={row.id} className="flex border-b border-border/30 hover:bg-muted/10" style={{ height: rowHeight }}>
              {weekColumns.map(wc => {
                const count = row.weekMarkers[wc.key] || 0;
                return (
                  <div
                    key={wc.key}
                    className="border-l border-border/20 flex items-center justify-center shrink-0"
                    style={{ width: colWidth }}
                  >
                    {count > 0 && (
                      <div className={cn("h-3.5 rounded-sm mx-0.5", TYPE_BAR_COLORS[row.woType] || "bg-primary")}
                        style={{ width: colWidth - 6 }}
                        title={`${row.taskName} — W${wc.weekNum}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
