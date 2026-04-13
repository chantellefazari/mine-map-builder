import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Copy, GripVertical, ChevronDown, ChevronRight, Users } from "lucide-react";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface Operation {
  id: string;
  lineNo: number;
  description: string;
  workCentre: string;
  crewSize: number;
  estimatedHours: number;
  notes: string;
  // legacy compat
  trade?: string;
  requiresIsolation?: boolean;
  requiresShutdown?: boolean;
  parallelAllowed?: boolean;
  predecessor?: string;
}

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
}

const newOp = (lineNo: number): Operation => ({
  id: crypto.randomUUID(),
  lineNo,
  description: "",
  workCentre: "MECH",
  crewSize: 1,
  estimatedHours: 0,
  notes: "",
});

export function WSOperationsTab({ wo, onUpdate }: Props) {
  const [ops, setOps] = useState<Operation[]>(() => {
    try {
      const parsed = JSON.parse(wo.scope_of_works || "[]");
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.lineNo !== undefined) {
        return parsed.map((o: any) => ({
          ...o,
          workCentre: o.workCentre || o.trade || "MECH",
          crewSize: o.crewSize ?? 1,
          estimatedHours: o.estimatedHours ?? 0,
        }));
      }
    } catch { /* ignore */ }
    return [];
  });

  const [expandedOps, setExpandedOps] = useState<Set<string>>(new Set());

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const persist = (updated: Operation[]) => {
    setOps(updated);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Also save trade field for backwards compat
      const withTrade = updated.map((o) => ({ ...o, trade: o.workCentre }));
      onUpdate({ scope_of_works: JSON.stringify(withTrade) });
    }, 500);
  };

  const addOp = () => persist([...ops, newOp(ops.length + 1)]);

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

  const toggleExpand = (id: string) => {
    setExpandedOps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalHours = ops.reduce((sum, o) => sum + (o.estimatedHours || 0), 0);
  const totalManHours = ops.reduce((sum, o) => sum + (o.estimatedHours || 0) * (o.crewSize || 1), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">Operations / Execution Steps</h2>
          <p className="text-xs text-muted-foreground">
            Total: {totalHours.toFixed(1)} hrs ({totalManHours.toFixed(1)} man-hrs) across {ops.length} operations
          </p>
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
            <div key={op.id} className="border border-border rounded-lg bg-card">
              {/* Op header row */}
              <div className="flex items-center gap-2 p-3">
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 cursor-grab" />
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

              {/* Work Centre, Crew Size, Est. Hours, Man-Hours */}
              <div className="grid grid-cols-4 gap-4 px-3 pb-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Work Centre</span>
                  <Select value={op.workCentre || "MECH"} onValueChange={(v) => updateOp(op.id, "workCentre", v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["MECH", "ELEC", "MOB", "INST"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Crew Size</span>
                  <Input
                    type="number"
                    min={1}
                    value={op.crewSize}
                    onChange={(e) => updateOp(op.id, "crewSize", parseInt(e.target.value) || 1)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Est. Hours</span>
                  <Input
                    type="number"
                    value={op.estimatedHours || ""}
                    onChange={(e) => updateOp(op.id, "estimatedHours", parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs"
                    placeholder=""
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Man-Hours</span>
                  <Input
                    value={`${((op.estimatedHours || 0) * (op.crewSize || 1)).toFixed(1)}h`}
                    readOnly
                    className="h-8 text-xs bg-muted/30 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="px-3 pb-2">
                <Input
                  value={op.notes}
                  onChange={(e) => updateOp(op.id, "notes", e.target.value)}
                  placeholder="Notes / special instructions..."
                  className="h-8 text-xs"
                />
              </div>

              {/* Collapsible Labour & Tooling */}
              <div className="border-t border-border">
                <button
                  onClick={() => toggleExpand(op.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  {expandedOps.has(op.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <Users className="w-3 h-3" />
                  Labour & Tooling
                </button>
                {expandedOps.has(op.id) && (
                  <div className="px-3 pb-3 text-xs text-muted-foreground">
                    <p>{op.workCentre} × {op.crewSize} crew = {((op.estimatedHours || 0) * (op.crewSize || 1)).toFixed(1)} man-hours</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
