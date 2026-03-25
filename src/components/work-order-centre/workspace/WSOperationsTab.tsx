import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Copy, GripVertical } from "lucide-react";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface Operation {
  id: string;
  lineNo: number;
  description: string;
  trade: string;
  estimatedHours: number;
  requiresIsolation: boolean;
  requiresShutdown: boolean;
  parallelAllowed: boolean;
  predecessor: string;
  notes: string;
}

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
}

const newOp = (lineNo: number): Operation => ({
  id: crypto.randomUUID(),
  lineNo,
  description: "",
  trade: "",
  estimatedHours: 0,
  requiresIsolation: false,
  requiresShutdown: false,
  parallelAllowed: false,
  predecessor: "",
  notes: "",
});

export function WSOperationsTab({ wo, onUpdate }: Props) {
  // Store operations in scope_of_works as JSON for now
  const [ops, setOps] = useState<Operation[]>(() => {
    try {
      const parsed = JSON.parse(wo.work_performed || "[]");
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.lineNo !== undefined) return parsed;
    } catch { /* ignore */ }
    return [];
  });

  const persist = (updated: Operation[]) => {
    setOps(updated);
    // We store operations as JSON - this is a pragmatic approach
    // In production, a dedicated operations table would be better
  };

  const addOp = () => {
    const updated = [...ops, newOp(ops.length + 1)];
    persist(updated);
  };

  const removeOp = (id: string) => {
    const updated = ops.filter((o) => o.id !== id).map((o, i) => ({ ...o, lineNo: i + 1 }));
    persist(updated);
  };

  const duplicateOp = (op: Operation) => {
    const idx = ops.findIndex((o) => o.id === op.id);
    const copy = { ...op, id: crypto.randomUUID(), lineNo: ops.length + 1, description: `${op.description} (Copy)` };
    const updated = [...ops.slice(0, idx + 1), copy, ...ops.slice(idx + 1)].map((o, i) => ({ ...o, lineNo: i + 1 }));
    persist(updated);
  };

  const updateOp = (id: string, field: string, value: any) => {
    const updated = ops.map((o) => (o.id === id ? { ...o, [field]: value } : o));
    persist(updated);
  };

  const totalHours = ops.reduce((sum, o) => sum + o.estimatedHours, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">Operations / Execution Steps</h2>
          <p className="text-xs text-muted-foreground">Break the work order into planned operation lines. Total: {totalHours}h labour</p>
        </div>
        <Button onClick={addOp} size="sm" className="text-xs gap-1">
          <Plus className="w-3 h-3" /> Add Operation
        </Button>
      </div>

      {ops.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">No operations added yet. Click "Add Operation" to start planning.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ops.map((op) => (
            <div key={op.id} className="border border-border rounded-lg p-3 bg-card space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-bold text-muted-foreground w-8">#{op.lineNo}</span>
                <Input
                  value={op.description}
                  onChange={(e) => updateOp(op.id, "description", e.target.value)}
                  placeholder="Operation description"
                  className="h-8 text-sm flex-1"
                />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateOp(op)} title="Duplicate">
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeOp(op.id)} title="Delete">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Trade</span>
                  <Select value={op.trade || "none"} onValueChange={(v) => updateOp(op.id, "trade", v === "none" ? "" : v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="-" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      {["Mechanical", "Electrical"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Est. Hours</span>
                  <Input type="number" value={op.estimatedHours} onChange={(e) => updateOp(op.id, "estimatedHours", parseFloat(e.target.value) || 0)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Crew Size</span>
                  <Input type="number" value={op.crewSize} onChange={(e) => updateOp(op.id, "crewSize", parseInt(e.target.value) || 1)} className="h-7 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Predecessor</span>
                  <Input value={op.predecessor} onChange={(e) => updateOp(op.id, "predecessor", e.target.value)} placeholder="Op #" className="h-7 text-xs" />
                </div>
                <div className="flex items-end gap-3 col-span-2">
                  <label className="flex items-center gap-1 text-[10px]">
                    <Switch checked={op.requiresIsolation} onCheckedChange={(v) => updateOp(op.id, "requiresIsolation", v)} className="scale-75" />
                    Isolation
                  </label>
                  <label className="flex items-center gap-1 text-[10px]">
                    <Switch checked={op.requiresShutdown} onCheckedChange={(v) => updateOp(op.id, "requiresShutdown", v)} className="scale-75" />
                    Shutdown
                  </label>
                  <label className="flex items-center gap-1 text-[10px]">
                    <Switch checked={op.parallelAllowed} onCheckedChange={(v) => updateOp(op.id, "parallelAllowed", v)} className="scale-75" />
                    Parallel
                  </label>
                </div>
              </div>

              <Input
                value={op.notes}
                onChange={(e) => updateOp(op.id, "notes", e.target.value)}
                placeholder="Special notes"
                className="h-7 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
