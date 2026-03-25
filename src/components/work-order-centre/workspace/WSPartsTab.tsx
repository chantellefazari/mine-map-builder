import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search, AlertTriangle } from "lucide-react";
import type { WorkOrderPart } from "@/hooks/useWorkOrderParts";

interface Props {
  woId: string;
  parts: WorkOrderPart[];
  addPart: any;
  updatePart: any;
  deletePart: any;
}

export function WSPartsTab({ woId, parts, addPart, updatePart, deletePart }: Props) {
  const [adding, setAdding] = useState(false);
  const [newPart, setNewPart] = useState({ part_number: "", part_description: "", quantity_required: 1 });

  const handleAdd = async () => {
    if (!newPart.part_description.trim()) return;
    await addPart.mutateAsync({
      work_order_id: woId,
      part_number: newPart.part_number,
      part_description: newPart.part_description,
      quantity_required: newPart.quantity_required,
    });
    setNewPart({ part_number: "", part_description: "", quantity_required: 1 });
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">Parts & Materials</h2>
          <p className="text-xs text-muted-foreground">{parts.length} part(s) linked to this work order</p>
        </div>
        <Button onClick={() => setAdding(true)} size="sm" className="text-xs gap-1">
          <Plus className="w-3 h-3" /> Add Part
        </Button>
      </div>

      {adding && (
        <div className="border border-primary/30 rounded-lg p-3 bg-primary/5 space-y-2">
          <p className="text-xs font-semibold text-foreground">Add Part</p>
          <div className="grid grid-cols-4 gap-2">
            <Input value={newPart.part_number} onChange={(e) => setNewPart((p) => ({ ...p, part_number: e.target.value }))} placeholder="Part number" className="h-8 text-xs" />
            <Input value={newPart.part_description} onChange={(e) => setNewPart((p) => ({ ...p, part_description: e.target.value }))} placeholder="Description" className="h-8 text-xs col-span-2" />
            <Input type="number" value={newPart.quantity_required} onChange={(e) => setNewPart((p) => ({ ...p, quantity_required: parseInt(e.target.value) || 1 }))} className="h-8 text-xs" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="text-xs h-7" onClick={handleAdd} disabled={addPart.isPending}>Add</Button>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {parts.length === 0 && !adding ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
          No parts added. Click "Add Part" to select from catalogue or enter manually.
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold">Part #</th>
                <th className="text-left px-3 py-2 font-semibold">Description</th>
                <th className="text-left px-3 py-2 font-semibold">Qty</th>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">Location</th>
                <th className="text-left px-3 py-2 font-semibold">Comment</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-mono">{p.part_number || "-"}</td>
                  <td className="px-3 py-2">{p.part_description}</td>
                  <td className="px-3 py-2">{p.quantity_required}</td>
                  <td className="px-3 py-2">
                    <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{p.location || "-"}</td>
                  <td className="px-3 py-2 text-muted-foreground truncate max-w-[120px]">{p.comment || "-"}</td>
                  <td className="px-1 py-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deletePart.mutate(p.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
