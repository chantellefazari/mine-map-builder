import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { Save, Printer, CheckCircle2, Pause, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
  onClose: () => void;
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

export function WOCWorkspaceHeader({ wo, onUpdate, onClose }: Props) {
  const handleReadyForSchedule = () => {
    const missing: string[] = [];
    if (!wo.problem_description?.trim()) missing.push("Description or scope");
    if (!wo.asset_id?.trim()) missing.push("Asset number");

    if (missing.length > 0) {
      toast.error("Missing planning requirements", {
        description: missing.join(", "),
      });
      return;
    }

    onUpdate({ status: "Ready" });
    toast.success(`${wo.wo_number} marked Ready for Schedule`);
  };

  return (
    <div className="border-b border-border bg-card px-4 py-3 flex-shrink-0">
      <div className="flex items-start justify-between gap-4">
        {/* Left: WO identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-mono text-foreground">{wo.wo_number}</span>
              <Badge variant="outline" className={`text-[10px] ${statusColor(wo.status)}`}>{wo.status}</Badge>
              <Badge variant="outline" className="text-[10px]">{wo.priority}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-md mt-0.5">
              {wo.problem_description || "No description"}
            </p>
          </div>
        </div>

        {/* Center: Key fields */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
          <div><span className="font-semibold text-foreground">Asset:</span> {wo.asset_id || "-"}</div>
          <div><span className="font-semibold text-foreground">Area:</span> {wo.functional_location || "-"}</div>
          <div><span className="font-semibold text-foreground">Trade:</span> {wo.trade || "-"}</div>
          <div><span className="font-semibold text-foreground">WO Type:</span> {wo.work_type || "-"}</div>
          <div><span className="font-semibold text-foreground">Created:</span> {wo.date_raised ? format(new Date(wo.date_raised), "dd/MM/yy") : "-"}</div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => window.print()}>
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
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1 text-destructive" onClick={() => { onUpdate({ status: "Closed" }); toast.success("Work order closed"); onClose(); }}>
              <XCircle className="w-3 h-3" /> Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
