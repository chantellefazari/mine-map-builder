import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Plus, Trash2, Loader2, Search } from "lucide-react";
import { PageNavDropdown } from "@/components/PageNavDropdown";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MechanicalWorkOrderTemplate } from "@/components/work-orders/MechanicalWorkOrderTemplate";
import { WorkOrderRegister } from "@/components/work-orders/WorkOrderRegister";
import { useWorkOrders } from "@/hooks/useWorkOrders";
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

const WorkOrderTemplates = () => {
  const { workOrders, isLoading, allocate, remove } = useWorkOrders();
  const [selectedWO, setSelectedWO] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; wo_number: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWOs = useMemo(() => {
    if (!searchQuery.trim()) return workOrders;
    const q = searchQuery.toLowerCase();
    return workOrders.filter((wo) =>
      wo.wo_number.toLowerCase().includes(q) ||
      wo.status.toLowerCase().includes(q) ||
      (wo.asset_id && wo.asset_id.toLowerCase().includes(q)) ||
      (wo.problem_description && wo.problem_description.toLowerCase().includes(q))
    );
  }, [workOrders, searchQuery]);

  const handleAllocateWO = async () => {
    const result = await allocate.mutateAsync();
    setSelectedWO(result.wo_number);
    // Seed one empty parts row
    await (supabase as any)
      .from("work_order_parts")
      .insert({ work_order_id: result.id, part_number: "", part_description: "", quantity_required: 1, location: "", status: "Not Ordered" });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    remove.mutate(deleteTarget.id, {
      onSuccess: () => {
        if (selectedWO === deleteTarget.wo_number) setSelectedWO(null);
        setDeleteTarget(null);
      },
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Open": return "text-green-600";
      case "Complete": return "text-blue-600";
      case "Cancelled": return "text-destructive";
      default: return "text-amber-600";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Work Orders</h1>
              <p className="text-xs text-muted-foreground">{workOrders.length} allocated</p>
            </div>
          </div>
        </div>

        {/* Allocate button */}
        <div className="p-3 border-b border-border">
          <Button onClick={handleAllocateWO} disabled={allocate.isPending} className="w-full gap-2" size="sm">
            {allocate.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Create New WO
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="h-8 text-xs pl-8"
              placeholder="Search WO number, asset, description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Work Order List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLoading ? (
              <p className="text-xs text-muted-foreground p-3 text-center">Loading…</p>
            ) : filteredWOs.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 text-center">
                {searchQuery ? "No matching work orders" : "No work orders yet"}
              </p>
            ) : (
              filteredWOs.map((wo) => (
                <div
                  key={wo.id}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all ${
                    selectedWO === wo.wo_number
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                  onClick={() => setSelectedWO(wo.wo_number)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-mono text-sm font-medium ${selectedWO === wo.wo_number ? "text-primary" : "text-foreground"}`}>
                      {wo.wo_number}
                    </span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColor(wo.status)}`}>
                      {wo.status}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id: wo.id, wo_number: wo.wo_number });
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
        {selectedWO ? (
          <div className="p-6">
            <MechanicalWorkOrderTemplate woNumber={selectedWO} />
          </div>
        ) : (
          <WorkOrderRegister onAllocateWO={(woNum) => setSelectedWO(woNum)} />
        )}
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.wo_number}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this work order and all associated parts and PO links. This action cannot be undone.
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

export default WorkOrderTemplates;
