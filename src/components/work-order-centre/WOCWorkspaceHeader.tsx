import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { Save, Printer, CheckCircle2, Pause, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
  onClose: () => void;
  partsCount?: number;
}

const statusColor = (s: string) => {
  switch (s) {
    case "Planning": case "Draft": case "Open": return "bg-blue-100 text-blue-800 border-blue-300";
    case "Ready": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Active": case "In Progress": return "bg-amber-100 text-amber-800 border-amber-300";
    case "On Hold": return "bg-orange-100 text-orange-800 border-orange-300";
    case "Completed": case "Complete": case "Closed": return "bg-muted text-muted-foreground border-border";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export function WOCWorkspaceHeader({ wo, onUpdate, onClose, partsCount = 0 }: Props) {
  const handleReadyForSchedule = () => {
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
    toast.success(`${wo.wo_number} marked Ready for Schedule`);
  };

  return (
    <div className="border-b border-border bg-card px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between gap-6">
        {/* Left: WO identity */}
        <div className="min-w-0 flex-shrink">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold font-mono text-foreground whitespace-nowrap">{wo.wo_number}</span>
            <Badge variant="outline" className={`text-[10px] ${statusColor(wo.status)}`}>{wo.status}</Badge>
            <Badge variant="outline" className="text-[10px]">{wo.priority}</Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
            {wo.problem_description || "No description"}
          </p>
        </div>

        {/* Center: Key fields */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Asset:</span> {wo.asset_id || "-"}</div>
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Area:</span> {wo.functional_location || "-"}</div>
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Trade:</span> {wo.trade || "-"}</div>
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">WO Type:</span> {wo.work_type || "-"}</div>
          <div className="whitespace-nowrap"><span className="font-semibold text-foreground">Created:</span> {wo.date_raised ? format(new Date(wo.date_raised), "dd/MM/yy") : "-"}</div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => { toast.success("Progress saved"); onClose(); }}>
            <ArrowLeft className="w-3 h-3" /> Save & Exit
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => {
            const printWindow = window.open("", "_blank");
            if (!printWindow) { toast.error("Popup blocked – please allow popups"); return; }
            printWindow.document.write(`<!DOCTYPE html><html><head><title>${wo.wo_number}</title><style>
              @page { size: A4 portrait; margin: 8mm; }
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 9px; line-height: 1.3; color: #1a1a1a; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              table { width: 100%; border-collapse: collapse; table-layout: fixed; }
              tr { page-break-inside: avoid; break-inside: avoid; }
              thead { display: table-header-group; }
              th, td { border: 1px solid #1a1a1a; padding: 3px 5px; text-align: left; font-size: 8px; word-wrap: break-word; }
              th { background-color: #f5f5f5; font-weight: 600; }
              .print-hide { display: none !important; }
            </style></head><body><p style="font-size:14px;font-weight:bold;margin-bottom:8px;">${wo.wo_number} — ${wo.problem_description || "Work Order"}</p>
            <table><tr><th>Asset</th><td>${wo.asset_id || "-"}</td><th>Area</th><td>${wo.functional_location || "-"}</td></tr>
            <tr><th>Trade</th><td>${wo.trade || "-"}</td><th>Priority</th><td>${wo.priority || "-"}</td></tr>
            <tr><th>Status</th><td>${wo.status}</td><th>WO Type</th><td>${wo.work_type || "-"}</td></tr>
            <tr><th>Date Raised</th><td>${wo.date_raised || "-"}</td><th>Requested By</th><td>${wo.requested_by || "-"}</td></tr></table>
            <h3 style="margin:10px 0 4px;font-size:10px;">Description</h3><p style="font-size:8px;">${wo.problem_description || "-"}</p>
            <h3 style="margin:10px 0 4px;font-size:10px;">Scope of Works</h3><p style="font-size:8px;">${wo.scope_of_works || wo.work_performed || "-"}</p>
            </body></html>`);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 400);
          }}>
            <Printer className="w-3 h-3" /> Print
          </Button>
          {!["Ready", "Completed", "Complete", "Closed"].includes(wo.status) && (
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => { onUpdate({ status: "On Hold" }); toast.success("Put on hold"); }}>
              <Pause className="w-3 h-3" /> Hold
            </Button>
          )}
          {!["Ready", "Completed", "Complete", "Closed"].includes(wo.status) && (
            <Button size="sm" className="text-xs h-7 gap-1" onClick={handleReadyForSchedule}>
              <CheckCircle2 className="w-3 h-3" /> Ready for Schedule
            </Button>
          )}
          {!["Completed", "Complete", "Closed"].includes(wo.status) && (
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1 text-destructive" onClick={() => { onUpdate({ status: "Closed" }); toast.success("Work order cancelled"); onClose(); }}>
              <XCircle className="w-3 h-3" /> Cancel WO
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
