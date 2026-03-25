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
    priority: "Normal",
    work_type: "Breakdown",
    trade: "",
    requested_by: "",
    isolation_required: false,
    from_hazard_id: false,
  });

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.problem_description.trim()) {
      toast.error("Please enter a description");
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
        scope_of_works: "", priority: "Normal", work_type: "Breakdown",
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Asset Number</Label>
          <Input value={form.asset_id} onChange={(e) => set("asset_id", e.target.value)} placeholder="e.g. TC-200-PP-001" className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Functional Location</Label>
          <Input value={form.functional_location} onChange={(e) => set("functional_location", e.target.value)} placeholder="e.g. 200-GRN" className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Priority</Label>
          <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Low", "Normal", "High", "Critical", "Emergency"].map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Work Type</Label>
          <Select value={form.work_type} onValueChange={(v) => set("work_type", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Breakdown", "Planned", "Shutdown", "Inspection", "Modification"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Trade</Label>
          <Select value={form.trade || ""} onValueChange={(v) => set("trade", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select trade" /></SelectTrigger>
            <SelectContent>
              {["Mechanical", "Electrical", "Instrumentation", "Boilermaker", "General"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Requested By</Label>
          <Input value={form.requested_by} onChange={(e) => set("requested_by", e.target.value)} placeholder="Name" className="h-9 text-sm" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Problem Description</Label>
        <Textarea value={form.problem_description} onChange={(e) => set("problem_description", e.target.value)} placeholder="Describe the issue or work required..." rows={3} className="text-sm" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Scope of Works</Label>
        <Textarea value={form.scope_of_works} onChange={(e) => set("scope_of_works", e.target.value)} placeholder="Scope details (optional)..." rows={3} className="text-sm" />
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
