import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Info, Clock } from "lucide-react";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface Operation {
  id: string;
  lineNo: number;
  description: string;
  workCentre?: string;
  trade?: string;
  crewSize?: number;
  estimatedHours: number;
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

export function WSLabourToolsTab({ wo, onUpdate }: Props) {
  // Parse operations from scope_of_works
  const { ops, tradeGroups } = useMemo(() => {
    let ops: Operation[] = [];
    try {
      const parsed = JSON.parse(wo.scope_of_works || "[]");
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.lineNo !== undefined) {
        ops = parsed;
      }
    } catch { /* ignore */ }

    const groups: Record<string, { discipline: string; totalHours: number; totalManHours: number; crewSize: number; ops: Operation[] }> = {};
    for (const op of ops) {
      const discipline = op.workCentre || op.trade || "Unassigned";
      if (!groups[discipline]) {
        groups[discipline] = { discipline, totalHours: 0, totalManHours: 0, crewSize: 1, ops: [] };
      }
      groups[discipline].totalHours += op.estimatedHours || 0;
      groups[discipline].totalManHours += (op.estimatedHours || 0) * (op.crewSize || 1);
      groups[discipline].crewSize = op.crewSize || 1;
      groups[discipline].ops.push(op);
    }
    return { ops, tradeGroups: Object.values(groups) };
  }, [wo.scope_of_works]);

  // Quick labour entry state
  const [quickWorkCentre, setQuickWorkCentre] = useState("Mechanical");
  const [quickCrewSize, setQuickCrewSize] = useState("1");
  const [quickEstHours, setQuickEstHours] = useState("0");

  const quickManHours = (parseFloat(quickEstHours) || 0) * (parseInt(quickCrewSize) || 1);

  const grandTotalHours = tradeGroups.reduce((s, g) => s + g.totalHours, 0);
  const grandTotalManHours = tradeGroups.reduce((s, g) => s + g.totalManHours, 0);

  // Derive summary for header
  const primaryDiscipline = tradeGroups.length > 0 ? tradeGroups[0].discipline : "MECH";

  // Tools — simplified to name + qty
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
    <div className="space-y-8">
      {/* LABOUR & RESOURCE PLAN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Labour & Resource Plan</h2>
          <span className="text-xs text-muted-foreground">
            {tradeGroups.length > 0 ? `${tradeGroups[0].crewSize}x ${primaryDiscipline} · ${grandTotalHours.toFixed(1)} hrs (${grandTotalManHours.toFixed(1)} man-hrs)` : "No operations defined"}
          </span>
        </div>

        {/* Quick Labour Entry */}
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Quick Labour Entry</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium">Work Centre</span>
              <Select value={quickWorkCentre} onValueChange={setQuickWorkCentre}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Mechanical", "Electrical", "Mobile", "Instrumentation"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium">Crew Size</span>
              <Input value={quickCrewSize} onChange={(e) => setQuickCrewSize(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium">Estimated Hours</span>
              <Input value={quickEstHours} onChange={(e) => setQuickEstHours(e.target.value)} className="h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium">Man-Hours</span>
              <div className="h-9 flex items-center text-sm font-mono">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                {quickManHours.toFixed(1)}h
              </div>
            </div>
          </div>
        </div>

        {/* Operations summary table */}
        {ops.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold">Op #</th>
                  <th className="text-left px-3 py-2 font-semibold">Description</th>
                  <th className="text-right px-3 py-2 font-semibold">Discipline</th>
                  <th className="text-right px-3 py-2 font-semibold">Qty</th>
                  <th className="text-right px-3 py-2 font-semibold">Hours</th>
                  <th className="text-right px-3 py-2 font-semibold">Man-Hrs</th>
                </tr>
              </thead>
              <tbody>
                {tradeGroups.map((g) => (
                  <>
                    <tr key={`group-${g.discipline}`} className="bg-muted/30 border-b border-border">
                      <td colSpan={3} className="px-3 py-1.5 font-semibold">{g.discipline} — {g.discipline} (Primary)</td>
                      <td className="text-right px-3 py-1.5 font-semibold">{g.crewSize}</td>
                      <td className="text-right px-3 py-1.5 font-semibold">{g.totalHours.toFixed(1)}h</td>
                      <td className="text-right px-3 py-1.5 font-semibold">{g.totalManHours.toFixed(1)}h</td>
                    </tr>
                    {g.ops.map((op) => (
                      <tr key={op.id} className="border-b border-border last:border-b-0">
                        <td className="px-3 py-1.5 text-muted-foreground">#{op.lineNo}</td>
                        <td className="px-3 py-1.5">{op.description || "—"}</td>
                        <td className="text-right px-3 py-1.5 text-muted-foreground">{op.workCentre || op.trade || "—"}</td>
                        <td className="text-right px-3 py-1.5">{op.crewSize || 1}</td>
                        <td className="text-right px-3 py-1.5">{(op.estimatedHours || 0).toFixed(1)}</td>
                        <td className="text-right px-3 py-1.5">{((op.estimatedHours || 0) * (op.crewSize || 1)).toFixed(1)}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {ops.length === 0 && (
          <div className="border border-dashed border-border rounded-lg p-6 text-center space-y-1">
            <Info className="w-5 h-5 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No operations defined yet.</p>
            <p className="text-xs text-muted-foreground">Add operations in the Operations tab — hours will auto-populate here.</p>
          </div>
        )}
      </div>

      {/* TOOLS / EQUIPMENT — simplified */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">Tools / Equipment</h2>

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
                    <Input
                      value={t.name}
                      onChange={(e) => updateTool(t.id, "name", e.target.value)}
                      className="h-8 text-xs border-0 shadow-none"
                      placeholder="Tool name"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      value={t.quantity}
                      onChange={(e) => updateTool(t.id, "quantity", parseInt(e.target.value) || 0)}
                      className="h-8 text-xs w-16 border-0 shadow-none text-right"
                    />
                  </td>
                  <td className="px-1 py-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeTool(t.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
              {/* Add row */}
              <tr className="border-t border-border">
                <td className="px-2 py-1">
                  <Input
                    placeholder="Tool name"
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
