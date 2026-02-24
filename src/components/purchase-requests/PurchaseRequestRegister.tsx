import React, { useState } from "react";
import { Plus, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { PRStatusBadge } from "./PRStatusBadge";
import { CreatePRDialog } from "./CreatePRDialog";
import { PRDetailDialog } from "./PRDetailDialog";
import { format } from "date-fns";

const STATUSES = ["All", "Draft", "Submitted to Admin", "Admin Review", "Sent for Approval", "Approved", "PO Generated"];

export const PurchaseRequestRegister: React.FC = () => {
  const { listQuery } = usePurchaseRequests();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const prs = listQuery.data ?? [];

  const filtered = prs.filter((pr) => {
    const matchSearch = search === "" ||
      pr.pr_number.toLowerCase().includes(search.toLowerCase()) ||
      pr.supervisor_name.toLowerCase().includes(search.toLowerCase()) ||
      pr.supplier_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || pr.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Purchase Request Register</h2>
          <p className="text-sm text-muted-foreground">Create, track, and approve purchase requests</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New PR
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search PR#, supervisor, supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {listQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">PR #</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Supervisor</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Required Date</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No purchase requests found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((pr) => (
                  <TableRow
                    key={pr.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setDetailId(pr.id)}
                  >
                    <TableCell className="font-mono font-medium text-sm">{pr.pr_number}</TableCell>
                    <TableCell><PRStatusBadge status={pr.status} /></TableCell>
                    <TableCell className="text-sm">{pr.supervisor_name}</TableCell>
                    <TableCell className="text-sm">{pr.supplier_name || "—"}</TableCell>
                    <TableCell className="text-sm">{pr.department || "—"}</TableCell>
                    <TableCell className="text-sm">
                      {pr.required_date ? format(new Date(pr.required_date), "dd MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(pr.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogs */}
      <CreatePRDialog open={createOpen} onOpenChange={setCreateOpen} />
      {detailId && (
        <PRDetailDialog open={!!detailId} onOpenChange={() => setDetailId(null)} prId={detailId} />
      )}
    </div>
  );
};
