import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface LabourRow {
  id: string;
  trade: string;
  personnel: number;
  hoursPerPerson: number;
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
  const [labourRows, setLabourRows] = useState<LabourRow[]>(() => {
    try {
      const parsed = JSON.parse(JSON.stringify(wo.labour_hours));
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.trade !== undefined) return parsed;
    } catch { /* */ }
    return [];
  });

  const [toolRows, setToolRows] = useState<ToolRow[]>(() => {
    try {
      const parsed = JSON.parse((wo as any).required_tooling || "[]");
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.name !== undefined) return parsed;
    } catch { /* */ }
    return [];
  });

  const persistLabour = (rows: LabourRow[]) => {
    setLabourRows(rows);
    onUpdate({ labour_hours: rows } as any);
  };

  const persistTools = (rows: ToolRow[]) => {
    setToolRows(rows);
    onUpdate({ required_tooling: JSON.stringify(rows) } as any);
  };

  const addLabour = () => persistLabour([...labourRows, { id: crypto.randomUUID(), trade: "", personnel: 1, hoursPerPerson: 0, type: "Internal", crew: "", notes: "" }]);
  const removeLabour = (id: string) => persistLabour(labourRows.filter((l) => l.id !== id));
  const updateLabour = (id: string, field: string, value: any) => persistLabour(labourRows.map((l) => l.id === id ? { ...l, [field]: value } : l));

  const addTool = () => persistTools([...toolRows, { id: crypto.randomUUID(), name: "", quantity: 1, forOperation: "", specialAccess: false, lifting: false, permitRelated: false, notes: "" }]);
  const removeTool = (id: string) => persistTools(toolRows.filter((t) => t.id !== id));
  const updateTool = (id: string, field: string, value: any) => persistTools(toolRows.map((t) => t.id === id ? { ...t, [field]: value } : t));

  const totalLabourHours = labourRows.reduce((s, r) => s + r.personnel * r.hoursPerPerson, 0);

  return (
    <div className="space-y-8">
      {/* LABOUR PLAN */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground">Labour Plan</h2>
            <p className="text-xs text-muted-foreground">Total labour: {totalLabourHours}h</p>
          </div>
          <Button onClick={addLabour} size="sm" variant="outline" className="text-xs gap-1"><Plus className="w-3 h-3" /> Add Labour</Button>
        </div>

        {labourRows.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">No labour planned yet</div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Trade</th>
                <th className="text-left px-3 py-2 font-semibold">Personnel</th>
                <th className="text-left px-3 py-2 font-semibold">Hrs/Person</th>
                <th className="text-left px-3 py-2 font-semibold">Total</th>
                <th className="text-left px-3 py-2 font-semibold">Type</th>
                <th className="text-left px-3 py-2 font-semibold">Crew</th>
                <th className="text-left px-3 py-2 font-semibold">Notes</th>
                <th className="w-8"></th>
              </tr></thead>
              <tbody>
                {labourRows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-b-0">
                    <td className="px-2 py-1">
                      <Select value={r.trade || "none"} onValueChange={(v) => updateLabour(r.id, "trade", v === "none" ? "" : v)}>
                        <SelectTrigger className="h-7 text-xs border-0 shadow-none"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>{["Mechanical", "Electrical"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-2 py-1"><Input type="number" value={r.personnel} onChange={(e) => updateLabour(r.id, "personnel", parseInt(e.target.value) || 0)} className="h-7 text-xs w-16 border-0 shadow-none" /></td>
                    <td className="px-2 py-1"><Input type="number" value={r.hoursPerPerson} onChange={(e) => updateLabour(r.id, "hoursPerPerson", parseFloat(e.target.value) || 0)} className="h-7 text-xs w-16 border-0 shadow-none" /></td>
                    <td className="px-3 py-1 font-medium">{(r.personnel * r.hoursPerPerson).toFixed(1)}h</td>
                    <td className="px-2 py-1">
                      <Select value={r.type} onValueChange={(v) => updateLabour(r.id, "type", v)}>
                        <SelectTrigger className="h-7 text-xs border-0 shadow-none"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Internal">Internal</SelectItem><SelectItem value="Contractor">Contractor</SelectItem></SelectContent>
                      </Select>
                    </td>
                    <td className="px-2 py-1"><Input value={r.crew} onChange={(e) => updateLabour(r.id, "crew", e.target.value)} className="h-7 text-xs border-0 shadow-none" placeholder="Crew" /></td>
                    <td className="px-2 py-1"><Input value={r.notes} onChange={(e) => updateLabour(r.id, "notes", e.target.value)} className="h-7 text-xs border-0 shadow-none" placeholder="Notes" /></td>
                    <td className="px-1 py-1"><Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeLabour(r.id)}><Trash2 className="w-3 h-3" /></Button></td>
                  </tr>
                ))}
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
