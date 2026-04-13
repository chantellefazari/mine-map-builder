import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { ArrowLeft, Printer, Pause, XCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
  onClose: () => void;
  onPrint?: () => void;
  partsCount?: number;
}

const statusColor = (s: string) => {
  switch (s) {
    case "Planning": case "Draft": case "Open": return "bg-blue-100 text-blue-800 border-blue-300";
    case "Ready": case "Planned": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Active": case "In Progress": case "Scheduled": return "bg-amber-100 text-amber-800 border-amber-300";
    case "On Hold": return "bg-orange-100 text-orange-800 border-orange-300";
    case "Completed": case "Complete": case "Closed": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const priorityColor = (p: string) => {
  if (p.includes("P1")) return "bg-red-100 text-red-800 border-red-300";
  if (p.includes("P2")) return "bg-orange-100 text-orange-800 border-orange-300";
  if (p.includes("P3")) return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-muted text-muted-foreground border-border";
};

function CompletionDots({ wo, partsCount }: { wo: WorkOrder; partsCount: number }) {
  const checks = [
    !!wo.asset_id?.trim(),
    !!wo.problem_description?.trim(),
    !!wo.scope_of_works?.trim(),
    partsCount > 0,
    Array.isArray(wo.labour_hours) && wo.labour_hours.length > 0,
    !!(wo as any).work_title?.trim() || !!wo.problem_description?.trim(),
  ];
  const done = checks.filter(Boolean).length;
  const pct = Math.round((done / checks.length) * 100);

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold text-foreground">{pct}%</span>
      <div className="flex gap-0.5">
        {checks.map((c, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${c ? "bg-emerald-500" : "bg-orange-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function WOCWorkspaceHeader({ wo, onUpdate, onClose, onPrint, partsCount = 0 }: Props) {
  const handleSubmitForScheduling = () => {
    const checks = [
      { label: "Asset assigned", done: !!wo.asset_id?.trim() },
      { label: "Description written", done: !!wo.problem_description?.trim() },
      { label: "Scope of works", done: !!wo.scope_of_works?.trim() || !!wo.work_performed?.trim() },
      { label: "Parts identified", done: partsCount > 0 },
      { label: "Labour planned", done: Array.isArray(wo.labour_hours) && wo.labour_hours.length > 0 },
    ];

    const missing = checks.filter((c) => !c.done).map((c) => c.label);

    if (missing.length > 0) {
      toast.error("Planning must be 100% complete", {
        description: `Missing: ${missing.join(", ")}`,
      });
      return;
    }

    onUpdate({ status: "Ready" });
    toast.success(`${wo.wo_number} submitted for scheduling`);
  };

  return (
    <div className="border-b border-border bg-card px-4 py-3 flex-shrink-0 space-y-2">
      {/* Row 1: WO identity + asset info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-base font-bold font-mono text-foreground whitespace-nowrap">{wo.wo_number}</span>
          <Badge variant="outline" className={`text-[10px] ${statusColor(wo.status)}`}>{wo.status}</Badge>
          <Badge variant="outline" className={`text-[10px] ${priorityColor(wo.priority)}`}>{wo.priority}</Badge>
          <span className="text-xs text-muted-foreground">Type: {wo.work_type || "-"}</span>
          {wo.activity_type && (
            <Badge variant="outline" className="text-[10px] font-mono">{wo.activity_type}</Badge>
          )}
          {wo.duty_type && (
            <Badge variant="outline" className={`text-[10px] ${wo.duty_type === "Online" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
              {wo.duty_type}
            </Badge>
          )}
          <CompletionDots wo={wo} partsCount={partsCount} />
        </div>

        <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Asset:</span> {wo.functional_location || wo.asset_id || "-"}</div>
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Trade:</span> {wo.trade || "-"}</div>
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Type:</span> {(wo as any).duty_type || "routine"}</div>
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Created:</span> {wo.date_raised ? format(new Date(wo.date_raised), "dd MMM yyyy") : "-"}</div>
        </div>
      </div>

      {/* Row 2: Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5" onClick={() => { toast.success("Progress saved"); onClose(); }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Save & Exit
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5" onClick={onPrint}>
          <Printer className="w-3.5 h-3.5" /> Print
        </Button>
        {!["Ready", "Completed", "Complete", "Closed"].includes(wo.status) && (
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5" onClick={() => { onUpdate({ status: "On Hold" }); toast.success("Put on hold"); }}>
            <Pause className="w-3.5 h-3.5" /> Hold
          </Button>
        )}
        {!["Ready", "Completed", "Complete", "Closed"].includes(wo.status) && (
          <Button size="sm" className="text-xs h-8 gap-1.5 bg-foreground text-background hover:bg-foreground/90" onClick={handleSubmitForScheduling}>
            <Send className="w-3.5 h-3.5" /> Submit for Scheduling
          </Button>
        )}
        {!["Completed", "Complete", "Closed"].includes(wo.status) && (
          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 text-destructive hover:text-destructive" onClick={() => { onUpdate({ status: "Closed" }); toast.success("Work order cancelled"); onClose(); }}>
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
