import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import { FileText, Wrench, AlertTriangle, CheckCircle2, Clock, Package } from "lucide-react";
import { WOCView } from "@/pages/WorkOrderCentre";

interface Props {
  onNavigate: (view: WOCView) => void;
}

export function WOCDashboard({ onNavigate }: Props) {
  const { workOrders } = useWorkOrders();
  const { workRequests } = useWorkRequests();

  const woByStatus = (s: string) => workOrders.filter((w) => w.status?.toLowerCase() === s.toLowerCase()).length;
  const wrPending = workRequests.filter((r) => ["Submitted", "Pending Review"].includes(r.status)).length;

  const cards = [
    { label: "Pending Requests", value: wrPending, icon: FileText, color: "text-amber-600 bg-amber-100", onClick: () => onNavigate("work-requests") },
    { label: "Planning", value: woByStatus("Planning") + woByStatus("Draft") + woByStatus("Open"), icon: Clock, color: "text-blue-600 bg-blue-100", onClick: () => onNavigate("wo-management") },
    { label: "Active", value: woByStatus("Active") + woByStatus("In Progress"), icon: Wrench, color: "text-emerald-600 bg-emerald-100", onClick: () => onNavigate("wo-management") },
    { label: "On Hold", value: woByStatus("On Hold"), icon: AlertTriangle, color: "text-orange-600 bg-orange-100", onClick: () => onNavigate("wo-management") },
    { label: "Completed", value: woByStatus("Completed") + woByStatus("Complete") + woByStatus("Closed"), icon: CheckCircle2, color: "text-muted-foreground bg-muted", onClick: () => onNavigate("wo-management") },
    { label: "Total Work Orders", value: workOrders.length, icon: Package, color: "text-foreground bg-muted", onClick: () => onNavigate("wo-management") },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Work Order Centre</h1>
        <p className="text-sm text-muted-foreground">Overview of maintenance work management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={c.onClick}
            className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors text-left"
          >
            <div className={`p-2 rounded-md ${c.color}`}>
              <c.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Work Orders */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Work Orders</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">WO #</th>
                <th className="text-left px-3 py-2 font-semibold">Asset</th>
                <th className="text-left px-3 py-2 font-semibold">Description</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.slice(0, 8).map((wo) => (
                <tr key={wo.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono font-medium">{wo.wo_number}</td>
                  <td className="px-3 py-2">{wo.asset_id || "-"}</td>
                  <td className="px-3 py-2 truncate max-w-[200px]">{wo.problem_description || "-"}</td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted">{wo.status}</span>
                  </td>
                  <td className="px-3 py-2">{wo.priority}</td>
                </tr>
              ))}
              {workOrders.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">No work orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
