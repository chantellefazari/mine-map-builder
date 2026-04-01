import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Lock } from "lucide-react";
import { EDGES, PACKAGES, type ShutdownWorkPackage, type DepType } from "./shutdownData";
import { useMemo } from "react";

const STATUS_DOT: Record<string, string> = {
  "Not Started": "bg-muted-foreground/40",
  Ready:    "bg-blue-500",
  Active:   "bg-emerald-500",
  Blocked:  "bg-destructive",
  Delayed:  "bg-amber-500",
  Complete: "bg-muted-foreground/30",
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

interface SequenceFlowDetailPanelProps {
  selected: ShutdownWorkPackage;
  delayedImpact: Set<string>;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export function SequenceFlowDetailPanel({ selected, delayedImpact, onClose, onSelect }: SequenceFlowDetailPanelProps) {
  const predecessors = useMemo(
    () => EDGES.filter((e) => e.to === selected.id).map((e) => ({ ...e, node: PACKAGES.find((n) => n.id === e.from)! })).filter(e => e.node),
    [selected.id]
  );
  const successors = useMemo(
    () => EDGES.filter((e) => e.from === selected.id).map((e) => ({ ...e, node: PACKAGES.find((n) => n.id === e.to)! })).filter(e => e.node),
    [selected.id]
  );

  return (
    <div className="w-[340px] flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
      <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between",
        selected.status === "Active" ? "bg-emerald-500/5" :
        selected.status === "Blocked" ? "bg-destructive/5" :
        selected.status === "Delayed" ? "bg-amber-500/5" :
        "bg-muted/30"
      )}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-foreground">{selected.id}</span>
            {selected.criticalPath && <Badge variant="outline" className="text-[8px] h-3.5 border-destructive text-destructive">CP</Badge>}
            <Badge variant="outline" className="text-[9px] h-4">{selected.status}</Badge>
          </div>
          <h3 className="text-sm font-semibold text-foreground mt-1">{selected.title}</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 space-y-3 max-h-[560px] overflow-y-auto">
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { label: "Start", value: selected.plannedStart },
            { label: "Finish", value: selected.plannedFinish },
            { label: "Area", value: selected.area },
            { label: "Trade", value: selected.trade },
            { label: "Duration", value: `${selected.durationHrs}h` },
            { label: "Progress", value: `${selected.pctComplete}%` },
            { label: "Supervisor", value: selected.supervisor },
            { label: "Shift", value: selected.shift },
          ].map((item) => (
            <div key={item.label} className="rounded border border-border px-2 py-1.5">
              <div className="text-[9px] text-muted-foreground">{item.label}</div>
              <div className="font-medium text-foreground">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{selected.pctComplete}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", PROGRESS_COLOR[selected.status])} style={{ width: `${selected.pctComplete}%` }} />
          </div>
        </div>

        {/* Blocker */}
        {selected.blockerDescription && (
          <div className="rounded border border-destructive/30 bg-destructive/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-destructive mb-0.5">
              <AlertTriangle className="w-3 h-3" /> Blocker — {selected.blockerType}
            </div>
            <p className="text-xs text-destructive mb-1">{selected.blockerDescription}</p>
            {selected.blockerOwner && (
              <p className="text-[10px] text-destructive/70">Owner: {selected.blockerOwner} · {selected.blockerETA}</p>
            )}
          </div>
        )}

        {selected.delayReason && !selected.blockerDescription && (
          <div className="rounded border border-amber-500/30 bg-amber-500/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 mb-0.5">
              <Lock className="w-3 h-3" /> Delay
            </div>
            <p className="text-xs text-amber-600">{selected.delayReason}</p>
          </div>
        )}

        {/* Predecessors */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
            ← Predecessors ({predecessors.length})
          </p>
          {predecessors.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">None — start point</p>
          ) : (
            <div className="space-y-1">
              {predecessors.map((p) => (
                <button key={p.from} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-muted/30 transition-colors" onClick={() => onSelect(p.from)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[p.node.status])} />
                  <span className="text-[10px] font-mono font-semibold">{p.node.id}</span>
                  <span className="text-[10px] text-muted-foreground truncate flex-1">{p.node.title}</span>
                  <span className={cn(
                    "text-[8px] font-mono px-1 rounded border",
                    p.type === "hold-point" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-muted/60 border-border text-muted-foreground"
                  )}>{DEP_LABELS[p.type]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Successors */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">
            → Successors ({successors.length})
          </p>
          {successors.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">None — end point</p>
          ) : (
            <div className="space-y-1">
              {successors.map((s) => (
                <button key={s.to} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded border border-border hover:bg-muted/30 transition-colors" onClick={() => onSelect(s.to)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[s.node.status])} />
                  <span className="text-[10px] font-mono font-semibold">{s.node.id}</span>
                  <span className="text-[10px] text-muted-foreground truncate flex-1">{s.node.title}</span>
                  <span className={cn(
                    "text-[8px] font-mono px-1 rounded border",
                    s.type === "hold-point" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-muted/60 border-border text-muted-foreground"
                  )}>{DEP_LABELS[s.type]}</span>
                  {delayedImpact.has(s.to) && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Handover notes */}
        {selected.handoverNotes && (
          <div className="rounded border border-border bg-muted/20 p-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Handover Notes</p>
            <p className="text-xs text-foreground">{selected.handoverNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
