import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Copy, GripVertical, Clock, Wrench } from "lucide-react";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface Operation {
  id: string;
  lineNo: number;
  description: string;
  workCentre: string;
  crewSize: number;
  estimatedHours: number;
  notes: string;
  trade?: string;
}

interface ToolRow {
  id: string;
  name: string;
  quantity: number;
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

export function WSExecutionTab({ wo, onUpdate }: Props) {
  /* ── Operations State ── */
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

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const persist = (updated: Operation[]) => {
    setOps(updated);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
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

  const totalHours = ops.reduce((sum, o) => sum + (o.estimatedHours || 0), 0);
  const totalManHours = ops.reduce((sum, o) => sum + (o.estimatedHours || 0) * (o.crewSize || 1), 0);

  /* ── Tools State ── */
  const [toolRows, setToolRows] = useState<ToolRow[]>(() => {
    try {
      const parsed = JSON.parse((wo as any).required_tooling || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((t: any) => ({
          id: t.id || crypto.randomUUID(),
          name: t.name || "",
          quantity: t.quantity ?? 1,
        }));
      }
    } catch { /* */ }
    return [];
  });

  const toolDebounce = useRef<ReturnType<typeof setTimeout>>();
  const persistTools = (rows: ToolRow[]) => {
    setToolRows(rows);
    clearTimeout(toolDebounce.current);
    toolDebounce.current = setTimeout(() => {
      onUpdate({ required_tooling: JSON.stringify(rows) } as any);
    }, 500);
  };

  const addTool = () => persistTools([...toolRows, { id: crypto.randomUUID(), name: "", quantity: 1 }]);
  const removeTool = (id: string) => persistTools(toolRows.filter((t) => t.id !== id));
  const updateTool = (id: string, field: string, value: any) => persistTools(toolRows.map((t) => t.id === id ? { ...t, [field]: value } : t));

  return (
    <div className="max-w-4xl space-y-6">
      {/* ── OPERATIONS ── */}
      <div className="space-y-3">
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
                <div className="grid grid-cols-4 gap-4 px-3 pb-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Work Centre</span>
                    <Select value={op.workCentre || "MECH"} onValueChange={(v) => updateOp(op.id, "workCentre", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["MECH", "ELEC", "MOBILE", "INST"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Crew Size</span>
                    <Input type="number" min={1} value={op.crewSize} onChange={(e) => updateOp(op.id, "crewSize", parseInt(e.target.value) || 1)} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Est. Hours</span>
                    <Input type="number" value={op.estimatedHours || ""} onChange={(e) => updateOp(op.id, "estimatedHours", parseFloat(e.target.value) || 0)} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Man-Hours</span>
                    <Input value={`${((op.estimatedHours || 0) * (op.crewSize || 1)).toFixed(1)}h`} readOnly className="h-8 text-xs bg-muted/30 font-mono" />
                  </div>
                </div>
                <div className="px-3 pb-2">
                  <Input value={op.notes} onChange={(e) => updateOp(op.id, "notes", e.target.value)} placeholder="Notes / special instructions..." className="h-8 text-xs" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── TOOLS / EQUIPMENT ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground">Tools / Equipment</h2>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Tool Name</th>
                <th className="text-right px-3 py-2 font-semibold w-20">Qty</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {toolRows.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-b-0">
                  <td className="px-2 py-1">
                    <Input value={t.name} onChange={(e) => updateTool(t.id, "name", e.target.value)} className="h-8 text-xs border-0 shadow-none" placeholder="Tool name" />
                  </td>
                  <td className="px-2 py-1">
                    <Input type="number" value={t.quantity} onChange={(e) => updateTool(t.id, "quantity", parseInt(e.target.value) || 0)} className="h-8 text-xs w-16 border-0 shadow-none text-right" />
                  </td>
                  <td className="px-1 py-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeTool(t.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border">
                <td className="px-2 py-1">
                  <Input
                    placeholder="Add tool..."
                    className="h-8 text-xs border-0 shadow-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                        const name = (e.target as HTMLInputElement).value;
                        persistTools([...toolRows, { id: crypto.randomUUID(), name, quantity: 1 }]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </td>
                <td className="px-2 py-1">
                  <Input value="1" readOnly className="h-8 text-xs w-16 border-0 shadow-none text-right" />
                </td>
                <td className="px-1 py-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addTool}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
