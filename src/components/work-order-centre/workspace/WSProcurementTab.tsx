import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { WorkOrderPart } from "@/hooks/useWorkOrderParts";

interface Props {
  parts: WorkOrderPart[];
  poItems: any[];
  linkedPRs: any[];
}

export function WSProcurementTab({ parts, poItems, linkedPRs }: Props) {
  const available = parts.filter((p) => p.status === "On Site" || p.status === "In Stock");
  const missing = parts.filter((p) => p.status !== "On Site" && p.status !== "In Stock");

  return (
    <div className="space-y-6">
      {/* Available / Can Be Reserved */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-foreground">Available / Can Be Reserved</h2>
          <Badge variant="outline" className="text-[10px]">{available.length}</Badge>
        </div>

        {available.length === 0 ? (
          <p className="text-xs text-muted-foreground pl-6">No parts currently available on site</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-emerald-50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Part #</th>
                <th className="text-left px-3 py-2 font-semibold">Description</th>
                <th className="text-left px-3 py-2 font-semibold">Qty Required</th>
                <th className="text-left px-3 py-2 font-semibold">Location</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {available.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 font-mono">{p.part_number || "-"}</td>
                    <td className="px-3 py-2">{p.part_description}</td>
                    <td className="px-3 py-2">{p.quantity_required}</td>
                    <td className="px-3 py-2">{p.location || "-"}</td>
                    <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-800">{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Missing / To Be Procured */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <h2 className="text-sm font-bold text-foreground">Missing / To Be Procured</h2>
          <Badge variant="outline" className="text-[10px]">{missing.length}</Badge>
        </div>

        {missing.length === 0 ? (
          <p className="text-xs text-muted-foreground pl-6">All parts available - no procurement required</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Part #</th>
                <th className="text-left px-3 py-2 font-semibold">Description</th>
                <th className="text-left px-3 py-2 font-semibold">Qty Required</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">PR Linked</th>
                <th className="text-left px-3 py-2 font-semibold">PO Linked</th>
              </tr></thead>
              <tbody>
                {missing.map((p) => {
                  const hasPR = linkedPRs.length > 0;
                  const hasPO = poItems.length > 0;
                  return (
                    <tr key={p.id} className="border-b border-border last:border-b-0">
                      <td className="px-3 py-2 font-mono">{p.part_number || "-"}</td>
                      <td className="px-3 py-2">{p.part_description}</td>
                      <td className="px-3 py-2">{p.quantity_required}</td>
                      <td className="px-3 py-2"><Badge variant="outline" className="text-[10px] text-orange-700 border-orange-300">{p.status}</Badge></td>
                      <td className="px-3 py-2">{hasPR ? "Yes" : "No"}</td>
                      <td className="px-3 py-2">{hasPO ? "Yes" : "No"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
