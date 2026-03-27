import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWorkRequests, WorkRequest } from "@/hooks/useWorkRequests";
import { getPriorityColor } from "@/constants/priorities";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { Plus, Eye, XCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { WOCCreateWorkRequest } from "./WOCCreateWorkRequest";
import { WOTypeSelectDialog } from "./WOTypeSelectDialog";

interface Props {
  onOpenWorkspace: (woId: string, from?: "work-requests") => void;
}

const STATUS_MAP: Record<string, string[]> = {
  "pending": ["Submitted", "Pending Review", "Draft"],
  "approved": ["Approved", "Converted to WO"],
  "rejected": ["Rejected"],
  "history": [],
};

export function WOCWorkRequests({ onOpenWorkspace }: Props) {
  const { workRequests, update, convertToWO } = useWorkRequests();
  const [tab, setTab] = useState("create");
  const [viewingWr, setViewingWr] = useState<WorkRequest | null>(null);
  const [woTypeWr, setWoTypeWr] = useState<WorkRequest | null>(null);

  const filtered = (key: string) => {
    if (key === "history") return workRequests;
    return workRequests.filter((wr) => STATUS_MAP[key]?.includes(wr.status));
  };

  const handleApproveClick = (wr: WorkRequest) => {
    setWoTypeWr(wr);
  };

  const handleApproveConfirm = async (woType: string) => {
    if (!woTypeWr) return;
    try {
      const result = await convertToWO.mutateAsync({ wrId: woTypeWr.id, woType });
      toast.success(`Work Order ${result.wo.wo_number} created as ${woType}`);
      setWoTypeWr(null);
      onOpenWorkspace(result.wo.id, "work-requests");
    } catch {
      // error handled in hook
    }
  };

  const handleReject = async (wr: WorkRequest) => {
    await update.mutateAsync({ id: wr.id, updates: { status: "Rejected" } });
    toast.success("Work request rejected");
  };

  const renderList = (items: WorkRequest[], showActions = true) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="text-left px-3 py-2 font-semibold">WR #</th>
            <th className="text-left px-3 py-2 font-semibold">Date</th>
            <th className="text-left px-3 py-2 font-semibold">Asset</th>
            <th className="text-left px-3 py-2 font-semibold">Observation</th>
            <th className="text-left px-3 py-2 font-semibold">Priority</th>
            <th className="text-left px-3 py-2 font-semibold">Request Type</th>
            <th className="text-left px-3 py-2 font-semibold">Requested By</th>
            <th className="text-left px-3 py-2 font-semibold">Status</th>
            {showActions && <th className="text-left px-3 py-2 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((wr) => (
            <tr key={wr.id} className="border-b border-border last:border-b-0 hover:bg-muted/20">
              <td className="px-3 py-2 font-mono font-medium">{wr.wr_number}</td>
              <td className="px-3 py-2">{wr.date_raised ? format(new Date(wr.date_raised), "dd/MM/yy") : "-"}</td>
              <td className="px-3 py-2">{wr.asset_id || "-"}</td>
              <td className="px-3 py-2 truncate max-w-[180px]">{wr.problem_description || "-"}</td>
              <td className="px-3 py-2">
                <Badge variant="outline" className="text-[10px]">{wr.priority}</Badge>
              </td>
              <td className="px-3 py-2">{wr.work_type || "-"}</td>
              <td className="px-3 py-2">{wr.requested_by || "-"}</td>
              <td className="px-3 py-2">
                <Badge variant="secondary" className="text-[10px]">{wr.status}</Badge>
              </td>
              {showActions && (
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setViewingWr(wr)} title="View">
                      <Eye className="w-3 h-3" />
                    </Button>
                    {(wr.status === "Submitted" || wr.status === "Pending Review" || wr.status === "Draft") && (
                      <>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleReject(wr)} title="Reject">
                          <XCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-emerald-600"
                          onClick={() => handleApproveClick(wr)}
                          title="Approve & Create WO"
                          disabled={convertToWO.isPending}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={showActions ? 9 : 8} className="px-3 py-8 text-center text-muted-foreground">No work requests found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Work Requests</h1>
          <p className="text-xs text-muted-foreground">Raise observations, defects, and maintenance requests</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="create" className="text-xs gap-1"><Plus className="w-3 h-3" /> Create</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">Pending Review ({filtered("pending").length})</TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">Approved ({filtered("approved").length})</TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">Rejected ({filtered("rejected").length})</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <WOCCreateWorkRequest onCreated={() => setTab("pending")} />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">{renderList(filtered("pending"))}</TabsContent>
        <TabsContent value="approved" className="mt-4">{renderList(filtered("approved"), false)}</TabsContent>
        <TabsContent value="rejected" className="mt-4">{renderList(filtered("rejected"), false)}</TabsContent>
        <TabsContent value="history" className="mt-4">{renderList(filtered("history"), false)}</TabsContent>
      </Tabs>

      {/* Full Work Request Review Dialog */}
      <Dialog open={!!viewingWr} onOpenChange={(o) => !o && setViewingWr(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewingWr && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base flex items-center gap-2">
                  {viewingWr.wr_number}
                  <Badge variant="secondary" className="text-[10px]">{viewingWr.status}</Badge>
                  <Badge variant="outline" className="text-[10px]">{viewingWr.priority}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Asset Number" value={viewingWr.asset_id} />
                  <DetailField label="Equipment Description" value={viewingWr.functional_location} />
                  <DetailField label="Request Type" value={viewingWr.work_type} />
                  <DetailField label="Priority" value={viewingWr.priority} />
                  <DetailField label="Trade" value={viewingWr.trade} />
                  <DetailField label="Requested By" value={viewingWr.requested_by} />
                  <DetailField label="Date Raised" value={viewingWr.date_raised ? format(new Date(viewingWr.date_raised), "dd/MM/yyyy HH:mm") : "-"} />
                  <DetailField label="Isolation Required" value={viewingWr.isolation_required ? "Yes" : "No"} />
                  <DetailField label="Hazard Identification" value={viewingWr.from_hazard_id ? "Yes" : "No"} />
                </div>

                <DetailBlock label="Description" value={viewingWr.problem_description} />
                <DetailBlock label="Scope of Works" value={viewingWr.scope_of_works} />

                {viewingWr.linked_wo_id && (
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs font-semibold text-muted-foreground">Linked Work Order</p>
                    <p className="text-sm font-mono">{viewingWr.linked_wo_id}</p>
                  </div>
                )}
              </div>

              {(viewingWr.status === "Submitted" || viewingWr.status === "Pending Review" || viewingWr.status === "Draft") && (
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button variant="destructive" size="sm" className="text-xs" onClick={() => { handleReject(viewingWr); setViewingWr(null); }}>
                    Reject
                  </Button>
                  <Button size="sm" className="text-xs" onClick={() => { setViewingWr(null); handleApproveClick(viewingWr); }}>
                    Approve & Create Work Order
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <WOTypeSelectDialog
        open={!!woTypeWr}
        onClose={() => setWoTypeWr(null)}
        onConfirm={handleApproveConfirm}
        title="Approve & Create Work Order"
        description={woTypeWr ? `Converting ${woTypeWr.wr_number} into a Work Order. Select the Work Order Type:` : ""}
      />
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm text-foreground">{value || "-"}</p>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="p-3 bg-muted/30 rounded-lg border border-border min-h-[48px]">
        <p className="text-sm text-foreground whitespace-pre-wrap">{value || "-"}</p>
      </div>
    </div>
  );
}
