import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Truck, Gauge, CheckCircle2, AlertTriangle,
  Trash2, FileText, Loader2, Wrench, Clock,
} from "lucide-react";
import { useEquipmentServices, EquipmentService } from "@/hooks/useEquipmentServices";
import { AddEquipmentDialog } from "./AddEquipmentDialog";
import { EquipmentCard } from "./EquipmentCard";
import { cn } from "@/lib/utils";

export function VendorSchedulingView() {
  const { equipment, isLoading, addEquipment, updateEquipment, deleteEquipment, updateHours, recordService } = useEquipmentServices();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => ({
    total: equipment.length,
    ok: equipment.filter((e) => e.status === "OK").length,
    dueSoon: equipment.filter((e) => e.status === "Due Soon").length,
    overdue: equipment.filter((e) => e.status === "Overdue").length,
  }), [equipment]);

  const filtered = useMemo(() => {
    if (!search) return equipment;
    const q = search.toLowerCase();
    return equipment.filter((e) =>
      e.equipment_name.toLowerCase().includes(q) ||
      e.asset_number.toLowerCase().includes(q)
    );
  }, [equipment, search]);

  const overdue = filtered.filter((e) => e.status === "Overdue");
  const dueSoon = filtered.filter((e) => e.status === "Due Soon");
  const ok = filtered.filter((e) => e.status === "OK");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Equipment Service Tracker
          </h1>
          <p className="text-xs text-muted-foreground">Track equipment hours & schedule Wilson Diesel services</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowAdd(true)}>
          <Plus className="w-3.5 h-3.5" /> Add Equipment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Equipment", value: stats.total, icon: Truck, color: "text-foreground" },
          { label: "OK", value: stats.ok, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Due Soon", value: stats.dueSoon, icon: Clock, color: "text-amber-600" },
          { label: "Overdue", value: stats.overdue, icon: AlertTriangle, color: "text-red-600" },
        ].map((c) => (
          <div key={c.label} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.label}</div>
              <div className={cn("text-xl font-bold", c.color)}>{c.value}</div>
            </div>
            <c.icon className="w-5 h-5 text-muted-foreground/40" />
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search equipment..." className="h-8 pl-8 text-sm" />
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Overdue for Service
          </h3>
          <div className="space-y-2">
            {overdue.map((e) => (
              <EquipmentCard key={e.id} item={e} onUpdate={updateEquipment.mutate} onDelete={deleteEquipment.mutate} onUpdateHours={updateHours.mutate} onRecordService={recordService.mutate} />
            ))}
          </div>
        </div>
      )}

      {/* Due Soon */}
      {dueSoon.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Due Soon
          </h3>
          <div className="space-y-2">
            {dueSoon.map((e) => (
              <EquipmentCard key={e.id} item={e} onUpdate={updateEquipment.mutate} onDelete={deleteEquipment.mutate} onUpdateHours={updateHours.mutate} onRecordService={recordService.mutate} />
            ))}
          </div>
        </div>
      )}

      {/* OK */}
      {ok.length > 0 && (
        <div>
          {(overdue.length > 0 || dueSoon.length > 0) && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-4">All Equipment</h3>
          )}
          <div className="space-y-2">
            {ok.map((e) => (
              <EquipmentCard key={e.id} item={e} onUpdate={updateEquipment.mutate} onDelete={deleteEquipment.mutate} onUpdateHours={updateHours.mutate} onRecordService={recordService.mutate} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card">
          <Truck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No equipment tracked</h3>
          <p className="text-xs text-muted-foreground mt-1">Add equipment to track service hours for Wilson Diesel</p>
        </div>
      )}

      <AddEquipmentDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={(e) => addEquipment.mutate(e)} />
    </div>
  );
}
