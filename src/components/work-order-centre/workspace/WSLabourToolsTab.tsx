import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Info } from "lucide-react";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface Operation {
  id: string;
  lineNo: number;
  description: string;
  trade: string;
  estimatedHours: number;
}

interface LabourOverride {
  trade: string;
  personnel: number;
  type: string;
  crew: string;
  notes: string;
}

interface ToolRow {
  id: string;
  name: string;
  quantity: number;
  forOperation: string;
  specialAccess: boolean;
  lifting: boolean;
  permitRelated: boolean;
  notes: string;
}

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
}

export function WSLabourToolsTab({ wo, onUpdate }: Props) {
  // Parse operations from scope_of_works to derive hours by trade
  const tradeGroups = useMemo(() => {
    let ops: Operation[] = [];
    try {
      const parsed = JSON.parse(wo.scope_of_works || "[]");
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.lineNo !== undefined) {
        ops = parsed;
      }
    } catch { /* ignore */ }

    const groups: Record<string, { trade: string; totalHours: number; opCount: number; ops: string[] }> = {};
    for (const op of ops) {
      const trade = op.trade || "Unassigned";
      if (!groups[trade]) {
        groups[trade] = { trade, totalHours: 0, opCount: 0, ops: [] };
      }
      groups[trade].totalHours += op.estimatedHours || 0;
      groups[trade].opCount += 1;
      if (op.description) groups[trade].ops.push(`#${op.lineNo}`);
    }
    return Object.values(groups);
  }, [wo.scope_of_works]);

  // Labour overrides (personnel, crew, type) stored in labour_hours
  const [overrides, setOverrides] = useState<LabourOverride[]>(() => {
    try {
      const parsed = JSON.parse(JSON.stringify(wo.labour_hours));
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.trade !== undefined) return parsed;
    } catch { /* */ }
    return [];
  });

  const getOverride = (trade: string): LabourOverride => {
    return overrides.find((o) => o.trade === trade) || { trade, personnel: 1, type: "Internal", crew: "", notes: "" };
  };

  const labourDebounce = useRef<ReturnType<typeof setTimeout>>();
  const persistOverrides = (rows: LabourOverride[]) => {
    setOverrides(rows);
    clearTimeout(labourDebounce.current);
    labourDebounce.current = setTimeout(() => {
      onUpdate({ labour_hours: rows } as any);
    }, 500);
  };

  const updateOverride = (trade: string, field: string, value: any) => {
    const existing = overrides.find((o) => o.trade === trade);
    if (existing) {
      persistOverrides(overrides.map((o) => o.trade === trade ? { ...o, [field]: value } : o));
    } else {
      persistOverrides([...overrides, { trade, personnel: 1, type: "Internal", crew: "", notes: "", [field]: value }]);
    }
  };

  // Tools
  const [toolRows, setToolRows] = useState<ToolRow[]>(() => {
    try {
      const parsed = JSON.parse((wo as any).required_tooling || "[]");
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.name !== undefined) return parsed;
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

  const addTool = () => persistTools([...toolRows, { id: crypto.randomUUID(), name: "", quantity: 1, forOperation: "", specialAccess: false, lifting: false, permitRelated: false, notes: "" }]);
  const removeTool = (id: string) => persistTools(toolRows.filter((t) => t.id !== id));
  const updateTool = (id: string, field: string, value: any) => persistTools(toolRows.map((t) => t.id === id ? { ...t, [field]: value } : t));

  const grandTotalHours = tradeGroups.reduce((s, g) => {
    const override = getOverride(g.trade);
    return s + g.totalHours * override.personnel;
  }, 0);

  return (
    <div className="space-y-8">
      {/* LABOUR PLAN — auto-derived from Operations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Labour Plan</h2>
            <p className="text-xs text-muted-foreground">
              Auto-summarised from Operations tab. Total: {grandTotalHours.toFixed(1)}h (personnel × op hours)
            </p>
          </div>
        </div>

        {tradeGroups.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-6 text-center space-y-1">
            <Info className="w-5 h-5 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No operations defined yet.</p>
            <p className="text-xs text-muted-foreground">Add operations in the Operations tab — hours will auto-populate here.</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold">Trade</th>
                  <th className="text-left px-3 py-2 font-semibold">Ops</th>
                  <th className="text-left px-3 py-2 font-semibold">Op Hours</th>
                  <th className="text-left px-3 py-2 font-semibold">Personnel</th>
                  <th className="text-left px-3 py-2 font-semibold">Total Hours</th>
                  <th className="text-left px-3 py-2 font-semibold">Type</th>
                  <th className="text-left px-3 py-2 font-semibold">Crew</th>
                  <th className="text-left px-3 py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {tradeGroups.map((g) => {
                  const ov = getOverride(g.trade);
                  const totalHrs = g.totalHours * ov.personnel;
                  return (
                    <tr key={g.trade} className="border-b border-border last:border-b-0">
                      <td className="px-3 py-2 font-medium">{g.trade}</td>
                      <td className="px-3 py-2 text-muted-foreground">{g.ops.join(", ")}</td>
                      <td className="px-3 py-2 text-muted-foreground">{g.totalHours.toFixed(1)}h</td>
                      <td className="px-2 py-1">
                        <Input
                          type="number"
                          min={1}
                          value={ov.personnel}
                          onChange={(e) => updateOverride(g.trade, "personnel", parseInt(e.target.value) || 1)}
                          className="h-7 text-xs w-16 border-0 shadow-none"
                        />
                      </td>
                      <td className="px-3 py-2 font-semibold">{totalHrs.toFixed(1)}h</td>
                      <td className="px-2 py-1">
                        <Select value={ov.type} onValueChange={(v) => updateOverride(g.trade, "type", v)}>
                          <SelectTrigger className="h-7 text-xs border-0 shadow-none"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Internal">Internal</SelectItem>
                            <SelectItem value="Contractor">Contractor</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          value={ov.crew}
                          onChange={(e) => updateOverride(g.trade, "crew", e.target.value)}
                          className="h-7 text-xs border-0 shadow-none"
                          placeholder="Crew name"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          value={ov.notes}
                          onChange={(e) => updateOverride(g.trade, "notes", e.target.value)}
                          className="h-7 text-xs border-0 shadow-none"
                          placeholder="Notes"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TOOLS / EQUIPMENT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Tools / Equipment</h2>
          <Button onClick={addTool} size="sm" variant="outline" className="text-xs gap-1"><Plus className="w-3 h-3" /> Add Tool</Button>
        </div>

        {toolRows.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">No tools / equipment listed</div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Tool / Equipment</th>
                <th className="text-left px-3 py-2 font-semibold">Qty</th>
                <th className="text-left px-3 py-2 font-semibold">For Op</th>
                <th className="text-left px-3 py-2 font-semibold">Access</th>
                <th className="text-left px-3 py-2 font-semibold">Lifting</th>
                <th className="text-left px-3 py-2 font-semibold">Permit</th>
                <th className="text-left px-3 py-2 font-semibold">Notes</th>
                <th className="w-8"></th>
              </tr></thead>
              <tbody>
                {toolRows.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-b-0">
                    <td className="px-2 py-1"><Input value={t.name} onChange={(e) => updateTool(t.id, "name", e.target.value)} className="h-7 text-xs border-0 shadow-none" placeholder="Tool name" /></td>
                    <td className="px-2 py-1"><Input type="number" value={t.quantity} onChange={(e) => updateTool(t.id, "quantity", parseInt(e.target.value) || 0)} className="h-7 text-xs w-14 border-0 shadow-none" /></td>
                    <td className="px-2 py-1"><Input value={t.forOperation} onChange={(e) => updateTool(t.id, "forOperation", e.target.value)} className="h-7 text-xs w-16 border-0 shadow-none" placeholder="Op #" /></td>
                    <td className="px-2 py-1"><Switch checked={t.specialAccess} onCheckedChange={(v) => updateTool(t.id, "specialAccess", v)} className="scale-75" /></td>
                    <td className="px-2 py-1"><Switch checked={t.lifting} onCheckedChange={(v) => updateTool(t.id, "lifting", v)} className="scale-75" /></td>
                    <td className="px-2 py-1"><Switch checked={t.permitRelated} onCheckedChange={(v) => updateTool(t.id, "permitRelated", v)} className="scale-75" /></td>
                    <td className="px-2 py-1"><Input value={t.notes} onChange={(e) => updateTool(t.id, "notes", e.target.value)} className="h-7 text-xs border-0 shadow-none" placeholder="Notes" /></td>
                    <td className="px-1 py-1"><Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeTool(t.id)}><Trash2 className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
