import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POTrackerItem } from "@/hooks/usePOTracker";
import { PurchaseRequest } from "@/hooks/usePurchaseRequests";
import { CheckCircle, Clock, MinusCircle, FileInput, PackageSearch } from "lucide-react";
import { format } from "date-fns";

interface WOProcurementTabProps {
  linkedPOs: POTrackerItem[];
  linkedPRs: PurchaseRequest[];
  poLoading: boolean;
  prLoading: boolean;
}

const poStatusColor: Record<string, string> = {
  Ordered: "bg-blue-100 text-blue-800 border-blue-200",
  "In Transit": "bg-amber-100 text-amber-800 border-amber-200",
  "On Site": "bg-green-100 text-green-800 border-green-200",
  Closed: "bg-muted text-muted-foreground border-border",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

function getProcurementIndicator(pos: POTrackerItem[]) {
  if (pos.length === 0) {
    return { label: "No procurement raised", color: "text-muted-foreground", bg: "bg-muted/50 border-border", icon: MinusCircle };
  }
  const activePOs = pos.filter((p) => p.status !== "Cancelled");
  if (activePOs.length > 0 && activePOs.every((p) => p.confirmed_on_site || p.status === "On Site" || p.status === "Closed")) {
    return { label: "Parts Ready", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle };
  }
  if (activePOs.some((p) => p.status === "In Transit")) {
    return { label: "Waiting on Parts", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock };
  }
  return { label: "Orders Placed", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: PackageSearch };
}

export const WOProcurementTab = ({ linkedPOs, linkedPRs, poLoading, prLoading }: WOProcurementTabProps) => {
  const indicator = useMemo(() => getProcurementIndicator(linkedPOs), [linkedPOs]);

  const totalPRValue = useMemo(() => linkedPRs.reduce((s, pr) => {
    // PR value from lines isn't loaded here, use 0 as fallback — but we have total_value on POs from approved PRs
    return s;
  }, 0), [linkedPRs]);

  const totalApprovedPOValue = useMemo(
    () => linkedPOs.filter((p) => p.status !== "Cancelled").reduce((s, po) => s + Number(po.total_value), 0),
    [linkedPOs]
  );

  const totalReceivedValue = useMemo(
    () => linkedPOs
      .filter((p) => p.confirmed_on_site || p.status === "On Site" || p.status === "Closed")
      .reduce((s, po) => s + Number(po.total_value), 0),
    [linkedPOs]
  );

  const IconComponent = indicator.icon;

  return (
    <div className="space-y-4">
      {/* Procurement Status Indicator */}
      <div className={`flex items-center gap-3 p-3 border rounded-lg ${indicator.bg}`}>
        <IconComponent className={`h-5 w-5 ${indicator.color}`} />
        <span className={`text-sm font-semibold ${indicator.color}`}>{indicator.label}</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Linked PRs</p>
          <p className="text-lg font-semibold text-foreground">{linkedPRs.length}</p>
        </div>
        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Linked POs</p>
          <p className="text-lg font-semibold text-foreground">{linkedPOs.length}</p>
        </div>
        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Total Approved PO Value</p>
          <p className="text-lg font-semibold text-primary">
            ${totalApprovedPOValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Total Received Value</p>
          <p className="text-lg font-semibold text-foreground">
            ${totalReceivedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Linked PRs */}
      {linkedPRs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <FileInput className="h-3.5 w-3.5" /> Purchase Requests
          </h4>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">PR Number</TableHead>
                  <TableHead className="text-xs">Supplier</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedPRs.map((pr) => (
                  <TableRow key={pr.id}>
                    <TableCell className="font-mono text-xs font-medium">{pr.pr_number}</TableCell>
                    <TableCell className="text-xs">{pr.supplier_name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{pr.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {pr.submitted_at ? format(new Date(pr.submitted_at), "dd/MM/yyyy") : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Linked POs */}
      {linkedPOs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <PackageSearch className="h-3.5 w-3.5" /> Purchase Orders
          </h4>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">PO Number</TableHead>
                  <TableHead className="text-xs">Supplier</TableHead>
                  <TableHead className="text-xs text-right">Value</TableHead>
                  <TableHead className="text-xs">ETA</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-center">On Site</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedPOs.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono text-xs font-medium">{po.po_number}</TableCell>
                    <TableCell className="text-xs">{po.supplier || "—"}</TableCell>
                    <TableCell className="text-xs text-right font-medium">
                      {Number(po.total_value) > 0
                        ? `$${Number(po.total_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs">{po.eta ? format(new Date(po.eta), "dd/MM/yyyy") : "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${poStatusColor[po.status] ?? ""}`}>{po.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {po.confirmed_on_site ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {linkedPOs.length === 0 && linkedPRs.length === 0 && !poLoading && !prLoading && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No procurement activity linked to this work order.</p>
        </div>
      )}
    </div>
  );
};
