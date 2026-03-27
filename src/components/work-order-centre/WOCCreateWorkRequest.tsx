import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import { usePriorityConfig } from "@/hooks/usePriorityConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WRAssetSearch } from "./WRAssetSearch";
import { TradeMultiSelect } from "./TradeMultiSelect";
import { Camera, X, Sparkles, Loader2, Plus, Trash2 } from "lucide-react";

interface Props {
  onCreated: () => void;
}

interface SimpleOperation {
  id: string;
  lineNo: number;
  description: string;
  trade: string;
  workCentre: string;
}

const newSimpleOp = (lineNo: number): SimpleOperation => ({
  id: crypto.randomUUID(),
  lineNo,
  description: "",
  trade: "",
  workCentre: "",
});

export function WOCCreateWorkRequest({ onCreated }: Props) {
  const { allocate, update } = useWorkRequests();
  const { wrPriorityValues } = usePriorityConfig();
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [enhancingDesc, setEnhancingDesc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [operations, setOperations] = useState<SimpleOperation[]>([]);
  const [form, setForm] = useState({
    asset_id: "",
    functional_location: "",
    problem_description: "",
    priority: "P3 - Medium",
    work_type: "Repair",
    trade: "",
    requested_by: "",
    isolation_required: false,
    from_hazard_id: false,
    notes: "",
  });

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const addOp = () => setOperations((ops) => [...ops, newSimpleOp(ops.length + 1)]);

  const removeOp = (id: string) => {
    setOperations((ops) =>
      ops.filter((o) => o.id !== id).map((o, i) => ({ ...o, lineNo: i + 1 }))
    );
  };

  const updateOp = (id: string, field: keyof SimpleOperation, value: string) => {
    setOperations((ops) =>
      ops.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Please select image files only");
      return;
    }
    const newPhotos = [...photos, ...imageFiles].slice(0, 5);
    setPhotos(newPhotos);
    setPhotoPreviewUrls(newPhotos.map((f) => URL.createObjectURL(f)));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviewUrls[index]);
    setPhotos((p) => p.filter((_, i) => i !== index));
    setPhotoPreviewUrls((p) => p.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (wrNumber: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of photos) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${wrNumber}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("wr-photos").upload(path, file);
      if (error) {
        console.error("Photo upload error:", error);
        continue;
      }
      const { data: urlData } = supabase.storage.from("wr-photos").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleEnhance = async () => {
    const text = form.problem_description;
    if (!text.trim()) {
      toast.error("Please enter some rough notes in the description field first");
      return;
    }
    setEnhancingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-wo-description", {
        body: { description: text, mode: "description" },
      });
      if (error) throw error;
      if (data?.enhanced) {
        set("problem_description", data.enhanced);
        toast.success("Description enhanced");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to enhance text");
    } finally {
      setEnhancingDesc(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.problem_description.trim()) {
      toast.error("Please describe what was observed");
      return;
    }
    setSaving(true);
    try {
      const wr = await allocate.mutateAsync();
      let photo_urls: string[] = [];
      if (photos.length > 0) {
        photo_urls = await uploadPhotos(wr.wr_number);
      }

      // Convert simple operations to the full format for WO compatibility
      const scopeOps = operations
        .filter((o) => o.description.trim())
        .map((o) => ({
          id: o.id,
          lineNo: o.lineNo,
          description: o.description,
          trade: o.trade,
          workCentre: o.workCentre,
          estimatedHours: 0,
          requiresIsolation: false,
          requiresShutdown: false,
          parallelAllowed: false,
          predecessor: "",
          notes: "",
        }));

      await update.mutateAsync({
        id: wr.id,
        updates: {
          ...form,
          scope_of_works: JSON.stringify(scopeOps),
          photo_urls,
          status: "Submitted",
        },
      });
      toast.success(`Work Request ${wr.wr_number} submitted`);
      photoPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      setPhotos([]);
      setPhotoPreviewUrls([]);
      setOperations([]);
      setForm({
        asset_id: "", functional_location: "", problem_description: "",
        priority: "P3 - Medium", work_type: "Repair",
        trade: "", requested_by: "", isolation_required: false, from_hazard_id: false, notes: "",
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
          <WRAssetSearch
            value={form.asset_id}
            onSelect={(assetId, assetName) => {
              set("asset_id", assetId);
              set("functional_location", assetName);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Equipment Description</Label>
          <Input value={form.functional_location} onChange={(e) => set("functional_location", e.target.value)} placeholder="Auto-filled from asset search" className="h-9 text-sm" readOnly />
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
              {wrPriorityValues.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Trade (optional)</Label>
          <TradeMultiSelect value={form.trade} onChange={(v) => set("trade", v)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Requested By</Label>
          <Input value={form.requested_by} onChange={(e) => set("requested_by", e.target.value)} placeholder="Your name" className="h-9 text-sm" />
        </div>
      </div>

      {/* Description with AI button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Description</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            disabled={enhancingDesc}
            onClick={handleEnhance}
          >
            {enhancingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Generate with AI
          </Button>
        </div>
        <Textarea value={form.problem_description} onChange={(e) => set("problem_description", e.target.value)} placeholder="Describe the issue, defect, or observation..." rows={3} className="text-sm" />
      </div>

      {/* Operations (replaces Scope of Works) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Operations</Label>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addOp}>
            <Plus className="h-3 w-3" /> Add Step
          </Button>
        </div>
        {operations.length === 0 ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/30 transition-colors"
            onClick={addOp}
          >
            <p className="text-xs text-muted-foreground">No operations added. Click to add the first step.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {operations.map((op, i) => (
              <div key={op.id} className="flex items-end gap-2">
                <span className="text-xs font-mono text-muted-foreground w-6 text-right shrink-0 pb-2">
                  {op.lineNo}
                </span>
                <Input
                  value={op.description}
                  onChange={(e) => updateOp(op.id, "description", e.target.value)}
                  placeholder="What needs to be done..."
                  className="h-8 text-sm flex-1"
                />
                <div className="shrink-0">
                  {i === 0 && <span className="text-[10px] text-muted-foreground font-medium block mb-0.5">Work Centre</span>}
                  <Select value={op.workCentre || "none"} onValueChange={(v) => updateOp(op.id, "workCentre", v === "none" ? "" : v)}>
                    <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["MECH", "ELEC", "PROJ"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => removeOp(op.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground">These steps will carry into the Work Order when approved. Planners can add hours, isolation, and details later.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Notes (optional)</Label>
        <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any additional context, access requirements, or safety notes..." rows={2} className="text-sm" />
      </div>

      {/* Photo attachment */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Photos (optional)</Label>
        <div className="flex items-center gap-3 flex-wrap">
          {photoPreviewUrls.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[10px]">Add Photo</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoSelect}
        />
        <p className="text-[10px] text-muted-foreground">Up to 5 photos. Tap to add.</p>
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
