import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RULE_TYPES, IMPACT_LEVELS, PlantRuleInsert } from "@/hooks/usePlantIntelligence";
import { useAuth } from "@/context/AuthContext";
import { Save, RotateCcw } from "lucide-react";

const EMPTY: Partial<PlantRuleInsert> = {
  title: "", area: "", asset: "", related_asset: "", rule_type: "Operational Note",
  impact_level: "Medium", applies_to: "", if_condition: "", then_action: "",
  because_reason: "", description: "", requires_isolation: false, requires_permit: false,
  requires_shutdown: false, requires_scaffold: false, requires_crane: false, status: "Draft",
};

interface Props {
  onSave: (rule: Partial<PlantRuleInsert>) => void;
  isSaving: boolean;
  initialValues?: Partial<PlantRuleInsert>;
}

export function AddLogicForm({ onSave, isSaving, initialValues }: Props) {
  const [form, setForm] = useState<Partial<PlantRuleInsert>>({ ...EMPTY, ...initialValues });
  const { user } = useAuth();

  const set = (field: string, value: any) => setForm((p) => ({ ...p, [field]: value }));

  const handleSave = (status: string) => {
    if (!form.title?.trim()) return;
    const count = Date.now();
    onSave({
      ...form,
      status,
      added_by: user?.email ?? "",
      rule_id: `PI-${String(count).slice(-6)}`,
    });
    setForm({ ...EMPTY });
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Rule Title *</Label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. CIL Tank 1 isolation requires CIL Tank 2 bypass" />
        </div>
        <div>
          <Label>Area</Label>
          <Input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Leaching" />
        </div>
        <div>
          <Label>Asset / System</Label>
          <Input value={form.asset} onChange={(e) => set("asset", e.target.value)} placeholder="e.g. CIL Tank 1" />
        </div>
        <div>
          <Label>Related Asset / System</Label>
          <Input value={form.related_asset} onChange={(e) => set("related_asset", e.target.value)} placeholder="e.g. CIL Tank 2" />
        </div>
        <div>
          <Label>Rule Type</Label>
          <Select value={form.rule_type} onValueChange={(v) => set("rule_type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {RULE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Impact Level</Label>
          <Select value={form.impact_level} onValueChange={(v) => set("impact_level", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {IMPACT_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Applies To</Label>
          <Input value={form.applies_to} onChange={(e) => set("applies_to", e.target.value)} placeholder="e.g. All maintenance crews" />
        </div>
      </div>

      {/* Logic */}
      <div className="space-y-3 bg-muted/30 rounded-lg p-4 border">
        <p className="text-sm font-semibold text-foreground">Logic Statement</p>
        <div>
          <Label className="text-primary font-semibold">IF</Label>
          <Textarea rows={2} value={form.if_condition} onChange={(e) => set("if_condition", e.target.value)} placeholder="e.g. CIL Tank 1 is being drained for internal inspection…" />
        </div>
        <div>
          <Label className="text-primary font-semibold">THEN</Label>
          <Textarea rows={2} value={form.then_action} onChange={(e) => set("then_action", e.target.value)} placeholder="e.g. CIL Tank 2 bypass valve must be opened before draining begins…" />
        </div>
        <div>
          <Label className="text-primary font-semibold">BECAUSE</Label>
          <Textarea rows={2} value={form.because_reason} onChange={(e) => set("because_reason", e.target.value)} placeholder="e.g. Slurry flow must be maintained to prevent pipeline blockage…" />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Description / Additional Notes</Label>
        <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Any extra context, references, or history…" />
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 bg-muted/30 rounded-lg p-4 border">
        <p className="col-span-full text-sm font-semibold text-foreground">Requirements</p>
        {([
          ["requires_isolation", "Isolation"],
          ["requires_permit", "Permit"],
          ["requires_shutdown", "Shutdown"],
          ["requires_scaffold", "Scaffold"],
          ["requires_crane", "Crane"],
        ] as const).map(([field, label]) => (
          <div key={field} className="flex items-center gap-2">
            <Switch checked={!!form[field]} onCheckedChange={(v) => set(field, v)} />
            <Label className="text-sm">{label}</Label>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button onClick={() => handleSave("Draft")} disabled={isSaving || !form.title?.trim()} variant="outline" className="gap-2">
          <Save className="w-4 h-4" /> Save as Draft
        </Button>
        <Button onClick={() => handleSave("Pending Review")} disabled={isSaving || !form.title?.trim()} className="gap-2">
          <Save className="w-4 h-4" /> Submit for Review
        </Button>
        <Button variant="ghost" onClick={() => setForm({ ...EMPTY })} className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>
    </div>
  );
}
