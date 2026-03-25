import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Props {
  poItems: any[];
  linkedPRs: any[];
  poLoading: boolean;
}

export function WSLinkedPOsTab({ poItems, linkedPRs, poLoading }: Props) {
  if (poLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Purchase Requests */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-foreground">Linked Purchase Requests</h2>
        {linkedPRs.length === 0 ? (
          <p className="text-xs text-muted-foreground">No purchase requests linked to this work order</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">PR #</th>
                <th className="text-left px-3 py-2 font-semibold">Title</th>
                <th className="text-left px-3 py-2 font-semibold">Supplier</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">Amount</th>
              </tr></thead>
              <tbody>
                {linkedPRs.map((pr: any) => (
                  <tr key={pr.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 font-mono">{pr.pr_number}</td>
                    <td className="px-3 py-2">{pr.request_title || "-"}</td>
                    <td className="px-3 py-2">{pr.supplier_name || "-"}</td>
                    <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px]">{pr.status}</Badge></td>
                    <td className="px-3 py-2">${pr.approval_amount?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Purchase Orders */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-foreground">Linked Purchase Orders</h2>
        {poItems.length === 0 ? (
          <p className="text-xs text-muted-foreground">No purchase orders linked to this work order</p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">PO #</th>
                <th className="text-left px-3 py-2 font-semibold">Supplier</th>
                <th className="text-left px-3 py-2 font-semibold">Date</th>
                <th className="text-left px-3 py-2 font-semibold">ETA</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">Value</th>
                <th className="text-left px-3 py-2 font-semibold">Comments</th>
              </tr></thead>
              <tbody>
                {poItems.map((po: any) => (
                  <tr key={po.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 font-mono">{po.po_number}</td>
                    <td className="px-3 py-2">{po.supplier || "-"}</td>
                    <td className="px-3 py-2">{po.order_date ? format(new Date(po.order_date), "dd/MM/yy") : "-"}</td>
                    <td className="px-3 py-2">{po.eta ? format(new Date(po.eta), "dd/MM/yy") : "-"}</td>
                    <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px]">{po.status}</Badge></td>
                    <td className="px-3 py-2">${po.total_value?.toFixed(2) || "0.00"}</td>
                    <td className="px-3 py-2 truncate max-w-[120px]">{po.comments || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
