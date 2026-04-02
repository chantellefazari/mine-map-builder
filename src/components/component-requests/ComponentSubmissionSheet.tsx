import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface RowData {
  id: string;
  submittedBy: string;
  targetAsset: string;
  partName: string;
  manufacturer: string;
  partModel: string;
  quantity: string;
  notes: string;
}

const emptyRow = (): RowData => ({
  id: crypto.randomUUID(),
  submittedBy: "",
  targetAsset: "",
  partName: "",
  manufacturer: "",
  partModel: "",
  quantity: "1",
  notes: "",
});

export const ComponentSubmissionSheet = () => {
  const [rows, setRows] = useState<RowData[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [userName, setUserName] = useState("");

  useState(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setUserName(data?.full_name || user.email || "unknown");
        });
    }
  });

  const updateRow = (id: string, field: keyof RowData, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const validRows = rows.filter((r) => r.submittedBy.trim() && r.targetAsset.trim() && r.partName.trim());

  const handleSubmit = async () => {
    if (validRows.length === 0) {
      toast({ title: "No valid rows", description: "Each row needs at least an Asset/P&ID Tag and Part Name.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const inserts = validRows.map((r) => ({
        target_asset_number: r.targetAsset.trim(),
        target_pid_tag: r.targetAsset.trim(),
        part_name: r.partName.trim(),
        manufacturer: r.manufacturer.trim(),
        part_model: r.partModel.trim(),
        quantity: parseInt(r.quantity) || 1,
        notes: r.notes.trim(),
        submitted_by: userName || user?.email || "unknown",
        status: "pending",
      }));

      const { error } = await supabase.from("component_change_requests").insert(inserts);
      if (error) throw error;

      toast({ title: "Submitted ✅", description: `${validRows.length} component(s) sent for review.` });
      setRows([emptyRow(), emptyRow(), emptyRow()]);
    } catch (e: any) {
      toast({ title: "Submission failed", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 border border-border rounded-lg p-3 text-xs space-y-1">
        <p className="font-semibold text-foreground">How to use:</p>
        <p className="text-muted-foreground">Fill in the spreadsheet below with the components you need added to the asset tree. Enter the P&ID tag or asset number so we know where each component goes. Once submitted, your request will be reviewed before being applied.</p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left font-semibold text-xs w-8">#</th>
                <th className="p-2 text-left font-semibold text-xs min-w-[160px]">Asset / P&ID Tag *</th>
                <th className="p-2 text-left font-semibold text-xs min-w-[180px]">Part Name *</th>
                <th className="p-2 text-left font-semibold text-xs min-w-[140px]">Manufacturer</th>
                <th className="p-2 text-left font-semibold text-xs min-w-[160px]">Part # / Model</th>
                <th className="p-2 text-left font-semibold text-xs w-[80px]">Qty</th>
                <th className="p-2 text-left font-semibold text-xs min-w-[160px]">Notes</th>
                <th className="p-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="p-1.5 text-xs text-muted-foreground text-center">{idx + 1}</td>
                  <td className="p-1">
                    <Input
                      value={row.targetAsset}
                      onChange={(e) => updateRow(row.id, "targetAsset", e.target.value)}
                      placeholder="e.g. 4-FE-100"
                      className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={row.partName}
                      onChange={(e) => updateRow(row.id, "partName", e.target.value)}
                      placeholder="e.g. Mechanical Seal Kit"
                      className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={row.manufacturer}
                      onChange={(e) => updateRow(row.id, "manufacturer", e.target.value)}
                      placeholder="e.g. SKF, John Crane"
                      className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={row.partModel}
                      onChange={(e) => updateRow(row.id, "partModel", e.target.value)}
                      placeholder="e.g. SKF-6310-2RS"
                      className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={(e) => updateRow(row.id, "quantity", e.target.value)}
                      className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1 w-16"
                    />
                  </td>
                  <td className="p-1">
                    <Input
                      value={row.notes}
                      onChange={(e) => updateRow(row.id, "notes", e.target.value)}
                      placeholder="Optional notes"
                      className="h-8 text-xs border-0 bg-transparent focus-visible:ring-1"
                    />
                  </td>
                  <td className="p-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeRow(row.id)} disabled={rows.length <= 1}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={addRow} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Row
          </Button>
          <span className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">{validRows.length}</Badge> valid row{validRows.length !== 1 ? "s" : ""} ready
          </span>
        </div>
        <Button onClick={handleSubmit} disabled={validRows.length === 0 || isSubmitting} size="sm" className="gap-1.5">
          {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Submit {validRows.length} for Review
        </Button>
      </div>
    </div>
  );
};
