import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import { toast } from "sonner";

interface Props {
  onCreated: () => void;
}

export function WOCCreateWorkRequest({ onCreated }: Props) {
  const { allocate, update } = useWorkRequests();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    asset_id: "",
    functional_location: "",
    problem_description: "",
    scope_of_works: "",
    priority: "Medium",
    work_type: "Repair",
    trade: "",
    requested_by: "",
    isolation_required: false,
    from_hazard_id: false,
    notes: "",
  });

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.problem_description.trim()) {
      toast.error("Please describe what was observed");
      return;
    }
    setSaving(true);
    try {
      const wr = await allocate.mutateAsync();
      await update.mutateAsync({
        id: wr.id,
        updates: {
          ...form,
          status: "Submitted",
        },
      });
      toast.success(`Work Request ${wr.wr_number} submitted`);
      setForm({
        asset_id: "", functional_location: "", problem_description: "",
        priority: "Medium", work_type: "Repair",
        trade: "", requested_by: "", isolation_required: false, from_hazard_id: false,
      });
      onCreated();
    } catch {
      // handled in hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-xs text-muted-foreground">
        Raise an observation, defect, or request for maintenance attention. Keep it simple - describe what you see.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Asset Number</Label>
          <Input value={form.asset_id} onChange={(e) => set("asset_id", e.target.value)} placeholder="e.g. TC-200-PP-001" className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Equipment Description</Label>
          <Input value={form.functional_location} onChange={(e) => set("functional_location", e.target.value)} placeholder="e.g. Primary Crusher Feed Chute" className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Request Type</Label>
          <Select value={form.work_type} onValueChange={(v) => set("work_type", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Inspect", "Repair", "Replace", "Monitor"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Priority</Label>
          <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Low", "Medium", "High", "Critical"].map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Trade (optional)</Label>
          <Select value={form.trade || "none"} onValueChange={(v) => set("trade", v === "none" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-</SelectItem>
              {["Mechanical", "Electrical", "Instrumentation", "Boilermaker", "General"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Requested By</Label>
          <Input value={form.requested_by} onChange={(e) => set("requested_by", e.target.value)} placeholder="Your name" className="h-9 text-sm" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">What did you observe?</Label>
        <Textarea value={form.problem_description} onChange={(e) => set("problem_description", e.target.value)} placeholder="Describe the issue, defect, or observation..." rows={3} className="text-sm" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={form.isolation_required} onCheckedChange={(v) => set("isolation_required", v)} />
          <Label className="text-xs">Isolation Required</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.from_hazard_id} onCheckedChange={(v) => set("from_hazard_id", v)} />
          <Label className="text-xs">Hazard Identification</Label>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={saving} className="text-sm">
        {saving ? "Submitting..." : "Submit Work Request"}
      </Button>
    </div>
  );
}
