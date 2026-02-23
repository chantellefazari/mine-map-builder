import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkOrderPartAudit } from "@/hooks/useWorkOrderParts";
import { format } from "date-fns";

interface WOActivityLogTabProps {
  auditLog: WorkOrderPartAudit[];
}

export const WOActivityLogTab = ({ auditLog }: WOActivityLogTabProps) => {
  if (auditLog.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No activity recorded yet. Changes to parts will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-auto">
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
              <TableCell className="text-xs">{entry.changed_by || "—"}</TableCell>
              <TableCell className="text-xs font-medium capitalize">{entry.field_changed.replace(/_/g, " ")}</TableCell>
              <TableCell className="text-xs text-destructive">{entry.old_value || "—"}</TableCell>
              <TableCell className="text-xs text-green-700">{entry.new_value || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
