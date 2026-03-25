import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkOrderPartAudit } from "@/hooks/useWorkOrderParts";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { format } from "date-fns";

interface Props {
  auditLog: WorkOrderPartAudit[];
  wo: WorkOrder;
}

export function WSActivityLogTab({ auditLog, wo }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-bold text-foreground">Activity Log</h2>
        <p className="text-xs text-muted-foreground">All tracked changes and actions for this work order</p>
      </div>

      {/* Key dates */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase">Created</p>
          <p className="text-xs font-mono">{wo.created_at ? format(new Date(wo.created_at), "dd/MM/yyyy HH:mm") : "-"}</p>
        </div>
        <div className="border border-border rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase">Last Updated</p>
          <p className="text-xs font-mono">{wo.updated_at ? format(new Date(wo.updated_at), "dd/MM/yyyy HH:mm") : "-"}</p>
        </div>
        <div className="border border-border rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase">Current Status</p>
          <p className="text-xs font-medium">{wo.status}</p>
        </div>
      </div>

      {/* Audit entries */}
      {auditLog.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No activity recorded yet. Changes to parts and fields will appear here automatically.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-[140px]">Timestamp</TableHead>
                <TableHead className="text-xs w-[100px]">User</TableHead>
                <TableHead className="text-xs w-[120px]">Field Changed</TableHead>
                <TableHead className="text-xs">Old Value</TableHead>
                <TableHead className="text-xs">New Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {format(new Date(entry.changed_at), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell className="text-xs">{entry.changed_by || "-"}</TableCell>
                  <TableCell className="text-xs font-medium capitalize">{entry.field_changed.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-xs text-destructive">{entry.old_value || "-"}</TableCell>
                  <TableCell className="text-xs text-emerald-700">{entry.new_value || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
