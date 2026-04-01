import { cn } from "@/lib/utils";
import { AlertTriangle, Lock, Clock, ArrowRight } from "lucide-react";
import type { ShutdownWorkPackage, DepType } from "./shutdownData";

/* ── Status styling ── */
const STATUS_ACCENT: Record<string, string> = {
  "Not Started": "border-l-muted-foreground/40",
  Ready:         "border-l-blue-500",
  Active:        "border-l-emerald-500",
  Blocked:       "border-l-destructive",
  Delayed:       "border-l-amber-500",
  Complete:      "border-l-muted-foreground/30",
};

const STATUS_DOT: Record<string, string> = {
  "Not Started": "bg-muted-foreground/40",
  Ready:    "bg-blue-500",
  Active:   "bg-emerald-500",
  Blocked:  "bg-destructive",
  Delayed:  "bg-amber-500",
  Complete: "bg-muted-foreground/30",
};

const STATUS_BG: Record<string, string> = {
  "Not Started": "",
  Ready:    "",
  Active:   "",
  Blocked:  "bg-destructive/[0.04]",
  Delayed:  "bg-amber-500/[0.04]",
  Complete: "bg-muted/40",
};

const PROGRESS_COLOR: Record<string, string> = {
  "Not Started": "bg-muted-foreground/20",
  Ready:    "bg-blue-500/50",
  Active:   "bg-emerald-500",
  Blocked:  "bg-destructive/60",
  Delayed:  "bg-amber-500",
  Complete: "bg-muted-foreground/30",
};

const DEP_LABELS: Record<DepType, string> = {
  "finish-to-start": "FS",
  "start-to-start": "SS",
  parallel: "PAR",
  "hold-point": "HOLD",
};

interface SequenceFlowCardProps {
  pkg: ShutdownWorkPackage;
  isSelected: boolean;
  isVisible: boolean;
  isImpacted: boolean;
  showDelayedOnly: boolean;
  incomingEdges: { from: string; type: DepType }[];
  onSelect: () => void;
}

export function SequenceFlowCard({
  pkg, isSelected, isVisible, isImpacted, showDelayedOnly, incomingEdges, onSelect,
}: SequenceFlowCardProps) {
  return (
    <div
      onClick={() => isVisible && onSelect()}
      className={cn(
        "rounded-lg border border-border border-l-[3px] cursor-pointer transition-all group",
        STATUS_ACCENT[pkg.status],
        STATUS_BG[pkg.status],
        !isVisible && "opacity-15 pointer-events-none",
        isSelected && "ring-2 ring-primary/30 shadow-md",
        isImpacted && showDelayedOnly && "ring-1 ring-amber-500/40",
      )}
    >
      {/* ── Time banner ── */}
      <div className={cn(
        "px-3 py-1.5 border-b border-border/50 flex items-center justify-between",
        pkg.status === "Complete" ? "bg-muted/30" : "bg-muted/20",
      )}>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] font-bold text-foreground tracking-wide">
            {pkg.plannedStart}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <ArrowRight className="w-2.5 h-2.5" />
          <span>{pkg.plannedFinish}</span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="px-3 py-2">
        {/* Row 1: ID + badges + progress */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", STATUS_DOT[pkg.status])} />
          <span className="text-[11px] font-mono font-bold text-foreground">{pkg.id}</span>
          {pkg.criticalPath && (
            <span className="text-[8px] font-extrabold text-destructive bg-destructive/10 px-1 rounded">CP</span>
          )}
          <span className="ml-auto text-[10px] font-bold text-foreground tabular-nums">{pkg.pctComplete}%</span>
        </div>

        {/* Row 2: Title */}
        <p className="text-[11px] font-semibold text-foreground leading-snug mb-1.5 line-clamp-2">
          {pkg.title}
        </p>

        {/* Row 3: Meta — trade + duration + supervisor */}
        <div className="flex items-center gap-1 text-[9px] text-muted-foreground mb-2">
          <span className="font-medium">{pkg.trade}</span>
          <span>·</span>
          <span>{pkg.durationHrs}h</span>
          <span>·</span>
          <span>{pkg.supervisor}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className={cn("h-full rounded-full transition-all", PROGRESS_COLOR[pkg.status])}
            style={{ width: `${pkg.pctComplete}%` }}
          />
        </div>

        {/* Dependencies — compact */}
        {incomingEdges.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-1.5">
            <span className="text-[8px] text-muted-foreground font-medium">From:</span>
            {incomingEdges.map((e, i) => (
              <span
                key={i}
                className={cn(
                  "text-[8px] font-mono px-1 py-0.5 rounded border",
                  e.type === "hold-point"
                    ? "bg-destructive/10 border-destructive/20 text-destructive font-bold"
                    : "bg-muted/60 border-border text-muted-foreground"
                )}
              >
                {e.from}{e.type !== "finish-to-start" ? ` ${DEP_LABELS[e.type]}` : ""}
              </span>
            ))}
          </div>
        )}

        {/* Blocker / Delay alerts */}
        {pkg.delayReason && (
          <div className="flex items-start gap-1.5 text-[9px] text-amber-600 bg-amber-500/5 rounded-md px-2 py-1.5 border border-amber-500/10">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{pkg.delayReason}</span>
          </div>
        )}
        {pkg.blockerDescription && !pkg.delayReason && (
          <div className="flex items-start gap-1.5 text-[9px] text-destructive bg-destructive/5 rounded-md px-2 py-1.5 border border-destructive/10">
            <Lock className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{pkg.blockerDescription}</span>
          </div>
        )}
      </div>
    </div>
  );
}
