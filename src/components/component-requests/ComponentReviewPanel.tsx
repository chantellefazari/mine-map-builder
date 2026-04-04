import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Loader2, Plus, Pencil, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const changeTypeIcon = (type: string) => {
  if (type === "edit") return <Pencil className="h-3 w-3" />;
  if (type === "remove") return <Trash className="h-3 w-3" />;
  return <Plus className="h-3 w-3" />;
};

const changeTypeBadge = (type: string) => {
  const label = (type || "add").charAt(0).toUpperCase() + (type || "add").slice(1);
  const variant = type === "remove" ? "destructive" : type === "edit" ? "outline" : "secondary";
  return <Badge variant={variant as any} className="gap-1 text-[10px]">{changeTypeIcon(type)}{label}</Badge>;
};

export const ComponentReviewPanel = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const { data: requests, isLoading } = useQuery({
    queryKey: ["component-change-requests", filter],
    queryFn: async () => {
      let q = supabase
        .from("component_change_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    setProcessing(id);
    try {
      const { error } = await supabase
        .from("component_change_requests")
        .update({
          status: action,
          reviewer_notes: reviewNotes[id] || "",
          reviewed_by: user?.email || "",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;

      if (action === "approved") {
        const req = requests?.find((r) => r.id === id);
        if (req) {
          const changeType = (req as any).change_type || "add";
          await applyToAssetTree(req, changeType);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["component-change-requests"] });
      queryClient.invalidateQueries({ queryKey: ["rev-b-assets"] });
      queryClient.invalidateQueries({ queryKey: ["rev-b-plant-assets-tree"] });
      toast({ title: action === "approved" ? "Approved ✅" : "Rejected ❌", description: `Request ${action}.` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const applyToAssetTree = async (req: any, changeType: string) => {
    const { data: assets, error } = await supabase
      .from("processing_plant_assets_rev_b")
      .select("id, components")
      .or(`asset_number.eq.${req.target_asset_number},pid_tags.cs.{${req.target_pid_tag}}`);

    if (error || !assets || assets.length === 0) {
      toast({ title: "Warning", description: "Component approved but target asset not found in tree. Manual placement needed.", variant: "destructive" });
      return;
    }

    const asset = assets[0];
    const existing = Array.isArray(asset.components) ? asset.components : [];

    if (changeType === "add") {
      const newComponent = {
        componentCode: "",
        componentType: req.part_name,
        componentName: req.part_name,
        manufacturer: req.manufacturer || null,
        model: req.part_model || null,
        category: (req as any).category || "",
        criticality: (req as any).criticality || "Medium",
      };
      const { error: updateError } = await supabase
        .from("processing_plant_assets_rev_b")
        .update({ components: [...existing, newComponent] as any })
        .eq("id", asset.id);
      if (updateError) toast({ title: "Warning", description: "Approved but failed to write to asset tree.", variant: "destructive" });
    } else if (changeType === "remove") {
      const updated = existing.filter((c: any) =>
        !(c.componentName === req.part_name || c.componentType === req.part_name)
      );
      const { error: updateError } = await supabase
        .from("processing_plant_assets_rev_b")
        .update({ components: updated as any })
        .eq("id", asset.id);
      if (updateError) toast({ title: "Warning", description: "Approved but failed to remove from asset tree.", variant: "destructive" });
    } else if (changeType === "edit") {
      const updated = existing.map((c: any) => {
        if (c.componentName === req.part_name || c.componentType === req.part_name) {
          return {
            ...c,
            manufacturer: req.manufacturer || c.manufacturer,
            model: req.part_model || c.model,
            category: (req as any).category || c.category,
            criticality: (req as any).criticality || c.criticality,
          };
        }
        return c;
      });
      const { error: updateError } = await supabase
        .from("processing_plant_assets_rev_b")
        .update({ components: updated as any })
        .eq("id", asset.id);
      if (updateError) toast({ title: "Warning", description: "Approved but failed to update asset tree.", variant: "destructive" });
    }
  };

  const statusBadge = (status: string) => {
    if (status === "pending") return <Badge variant="outline" className="gap-1 text-amber-600"><Clock className="h-3 w-3" />Pending</Badge>;
    if (status === "approved") return <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" />Approved</Badge>;
    return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize text-xs">
            {f}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : !requests?.length ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No {filter} requests.</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left text-xs font-semibold">Status</th>
                  <th className="p-2 text-left text-xs font-semibold">Action</th>
                  <th className="p-2 text-left text-xs font-semibold">Asset / Tag</th>
                  <th className="p-2 text-left text-xs font-semibold">Part Name</th>
                  <th className="p-2 text-left text-xs font-semibold">Category</th>
                  <th className="p-2 text-left text-xs font-semibold">Manufacturer</th>
                  <th className="p-2 text-left text-xs font-semibold">Part # / Model</th>
                  <th className="p-2 text-left text-xs font-semibold">Qty</th>
                  <th className="p-2 text-left text-xs font-semibold">Criticality</th>
                  <th className="p-2 text-left text-xs font-semibold">Submitted By</th>
                  <th className="p-2 text-left text-xs font-semibold">Date</th>
                  {filter === "pending" && <th className="p-2 text-left text-xs font-semibold min-w-[200px]">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-t border-border/50">
                    <td className="p-2">{statusBadge(req.status)}</td>
                    <td className="p-2">{changeTypeBadge((req as any).change_type || "add")}</td>
                    <td className="p-2 font-mono text-xs">{req.target_asset_number}</td>
                    <td className="p-2 font-medium">{req.part_name}</td>
                    <td className="p-2 text-xs text-muted-foreground">{(req as any).category || "—"}</td>
                    <td className="p-2 text-muted-foreground">{req.manufacturer || "—"}</td>
                    <td className="p-2 font-mono text-xs">{req.part_model || "—"}</td>
                    <td className="p-2">{req.quantity}</td>
                    <td className="p-2 text-xs">{(req as any).criticality || "—"}</td>
                    <td className="p-2 text-xs text-muted-foreground">{req.submitted_by}</td>
                    <td className="p-2 text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</td>
                    {filter === "pending" && (
                      <td className="p-2">
                        <div className="flex flex-col gap-1.5">
                          <Textarea
                            value={reviewNotes[req.id] || ""}
                            onChange={(e) => setReviewNotes((prev) => ({ ...prev, [req.id]: e.target.value }))}
                            placeholder="Review notes..."
                            className="text-xs h-14 min-h-0"
                          />
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              className="gap-1 bg-green-600 hover:bg-green-700 text-xs h-7"
                              disabled={processing === req.id}
                              onClick={() => handleAction(req.id, "approved")}
                            >
                              {processing === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1 text-xs h-7"
                              disabled={processing === req.id}
                              onClick={() => handleAction(req.id, "rejected")}
                            >
                              <XCircle className="h-3 w-3" /> Reject
                            </Button>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
