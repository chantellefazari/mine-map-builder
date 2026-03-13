import { useState, useMemo } from "react";
import { FileText, Plus, Trash2, Loader2, Search } from "lucide-react";
import { PageNavDropdown } from "@/components/PageNavDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WorkRequestTemplate } from "@/components/work-requests/WorkRequestTemplate";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WorkRequestTemplates = () => {
  const { workRequests, isLoading, allocate, remove } = useWorkRequests();
  const [selectedWR, setSelectedWR] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; wr_number: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWRs = useMemo(() => {
    if (!searchQuery.trim()) return workRequests;
    const q = searchQuery.toLowerCase();
    return workRequests.filter((wr) =>
      wr.wr_number.toLowerCase().includes(q) ||
      wr.status.toLowerCase().includes(q) ||
      (wr.asset_id && wr.asset_id.toLowerCase().includes(q)) ||
      (wr.problem_description && wr.problem_description.toLowerCase().includes(q))
    );
  }, [workRequests, searchQuery]);

  const handleAllocateWR = async () => {
    const result = await allocate.mutateAsync();
    setSelectedWR(result.wr_number);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, {
      onSuccess: () => {
        if (selectedWR === deleteTarget.wr_number) setSelectedWR(null);
        setDeleteTarget(null);
      },
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Open": return "text-green-600";
      case "Pending Approval": return "text-amber-600";
      case "Converted to WO": return "text-blue-600";
      case "Cancelled": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="mb-4">
            <PageNavDropdown />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Work Requests</h1>
              <p className="text-xs text-muted-foreground">{workRequests.length} allocated</p>
            </div>
          </div>
        </div>

        {/* Allocate button */}
        <div className="p-3 border-b border-border">
          <Button onClick={handleAllocateWR} disabled={allocate.isPending} className="w-full gap-2" size="sm">
            {allocate.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Create New WR
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="h-8 text-xs pl-8"
              placeholder="Search WR number, asset, description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Work Request List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLoading ? (
              <p className="text-xs text-muted-foreground p-3 text-center">Loading…</p>
            ) : filteredWRs.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 text-center">
                {searchQuery ? "No matching work requests" : "No work requests yet"}
              </p>
            ) : (
              filteredWRs.map((wr) => (
                <div
                  key={wr.id}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all ${
                    selectedWR === wr.wr_number
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                  onClick={() => setSelectedWR(wr.wr_number)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-mono text-sm font-medium ${selectedWR === wr.wr_number ? "text-primary" : "text-foreground"}`}>
                      {wr.wr_number}
                    </span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColor(wr.status)}`}>
                      {wr.status}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id: wr.id, wr_number: wr.wr_number });
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {selectedWR ? (
          <div className="p-6">
            <WorkRequestTemplate wrNumber={selectedWR} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Work Requests</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create and manage work requests. Operators and trades submit requests here — supervisors approve and convert them into Work Orders.
              </p>
              <Button onClick={handleAllocateWR} disabled={allocate.isPending} className="gap-2">
                {allocate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create New Work Request
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.wr_number}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this work request. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkRequestTemplates;
