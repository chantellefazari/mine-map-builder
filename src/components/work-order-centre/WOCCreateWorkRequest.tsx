import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WRAssetSearch } from "./WRAssetSearch";
import { Camera, X, Sparkles, Loader2, Plus, Trash2, ArrowLeft, Send, Printer } from "lucide-react";
import { format } from "date-fns";

interface Props {
  onCreated: () => void;
}

interface SimpleOperation {
  id: string;
  lineNo: number;
  description: string;
  workCentre: string;
}

const newSimpleOp = (lineNo: number): SimpleOperation => ({
  id: crypto.randomUUID(),
  lineNo,
  description: "",
  workCentre: "",
});

const PRIORITIES = [
  { value: "P1 - Critical", label: "P1 – Critical" },
  { value: "P2 - High", label: "P2 – High" },
  { value: "P3 - Medium", label: "P3 – Medium" },
  { value: "P4 - Low", label: "P4 – Low" },
];

const WORK_TYPES = ["Repair", "Replace", "Inspect", "New Install", "Monitor"];
const WORK_CENTRES = ["MECH", "ELEC", "PROJ"];

export function WOCCreateWorkRequest({ onCreated }: Props) {
  const { allocate, update } = useWorkRequests();
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
    work_title: "",
    priority: "P3 - Medium",
    work_type: "Repair",
    requested_by: "",
    isolation_required: false,
    from_hazard_id: false,
    work_centre: "",
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
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
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
      if (error) { console.error("Photo upload error:", error); continue; }
      const { data: urlData } = supabase.storage.from("wr-photos").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleEnhance = async () => {
    const text = form.problem_description;
    if (!text.trim()) { toast.error("Please enter some rough notes first"); return; }
    setEnhancingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-wo-description", {
        body: { description: text, mode: "description" },
      });
      if (error) throw error;
      if (data?.enhanced) { set("problem_description", data.enhanced); toast.success("Description enhanced"); }
    } catch (err: any) {
      toast.error(err.message || "Failed to enhance text");
    } finally { setEnhancingDesc(false); }
  };

  const handleSubmit = async () => {
    if (!form.problem_description.trim()) { toast.error("Please describe what was observed"); return; }
    setSaving(true);
    try {
      const wr = await allocate.mutateAsync();
      let photo_urls: string[] = [];
      if (photos.length > 0) photo_urls = await uploadPhotos(wr.wr_number);

      const scopeOps = operations
        .filter((o) => o.description.trim())
        .map((o) => ({
          id: o.id, lineNo: o.lineNo, description: o.description,
          trade: "", workCentre: o.workCentre, estimatedHours: 0,
          requiresIsolation: false, requiresShutdown: false,
          parallelAllowed: false, predecessor: "", notes: "",
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
      setPhotos([]); setPhotoPreviewUrls([]); setOperations([]);
      setForm({
        asset_id: "", functional_location: "", problem_description: "", work_title: "",
        priority: "P3 - Medium", work_type: "Repair",
        requested_by: "", isolation_required: false, from_hazard_id: false, work_centre: "", notes: "",
      });
      onCreated();
    } catch { /* handled in hook */ } finally { setSaving(false); }
  };

  const today = format(new Date(), "dd/MM/yyyy");

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onCreated} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h2 className="text-xl font-bold">Work Request</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSubmit} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
            <Send className="h-4 w-4" />
            {saving ? "Submitting..." : "Send for Approval"}
          </Button>
          <Button variant="outline" className="gap-1.5">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {/* Document container */}
      <div className="border border-border rounded-lg bg-background shadow-sm max-w-4xl">
        {/* Header banner */}
        <div className="bg-[#1a1a1a] text-white rounded-t-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg">T</div>
            <div>
              <div className="font-bold text-base tracking-wide">TENNANT MINES</div>
              <div className="text-xs text-white/70">Tennant Creek Gold Mine</div>
            </div>
          </div>
          <div className="text-amber-500 font-bold text-xl tracking-wider">WORK REQUEST</div>
        </div>

        {/* Form body */}
        <div className="p-5 space-y-4">
          {/* Row 1: WR No, Date, Priority, Work Type */}
          <div className="grid grid-cols-4 gap-3">
            <FieldBox label="Work Request No.">
              <p className="text-sm font-mono mt-1">WR-______</p>
            </FieldBox>
            <FieldBox label="Date Raised">
              <p className="text-sm font-semibold mt-1">{today}</p>
            </FieldBox>
            <FieldBox label="Priority" required>
              <div className="space-y-1 mt-1">
                {PRIORITIES.map((p) => (
                  <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.priority === p.value}
                      onChange={() => set("priority", p.value)}
                      className="h-3.5 w-3.5 rounded border-border accent-amber-500"
                    />
                    <span className="text-xs">{p.label}</span>
                  </label>
                ))}
              </div>
            </FieldBox>
            <FieldBox label="Work Type" required>
              <div className="space-y-1 mt-1">
                {WORK_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.work_type === t}
                      onChange={() => set("work_type", t)}
                      className="h-3.5 w-3.5 rounded border-border accent-amber-500"
                    />
                    <span className="text-xs">{t}</span>
                  </label>
                ))}
              </div>
            </FieldBox>
          </div>

          {/* Row 2: Asset, Isolation, Hazard ID, Work Centre */}
          <div className="grid grid-cols-4 gap-3">
            <FieldBox label="Asset Number" required>
              <div className="mt-1">
                <WRAssetSearch
                  value={form.asset_id}
                  onSelect={(assetId, assetName) => {
                    set("asset_id", assetId);
                    set("functional_location", assetName);
                  }}
                />
              </div>
            </FieldBox>
            <FieldBox label="Isolation Required" required>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.isolation_required === true} onChange={() => set("isolation_required", true)} className="h-3.5 w-3.5 rounded border-border accent-amber-500" />
                  <span className="text-xs">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.isolation_required === false} onChange={() => set("isolation_required", false)} className="h-3.5 w-3.5 rounded border-border accent-amber-500" />
                  <span className="text-xs">No</span>
                </label>
              </div>
            </FieldBox>
            <FieldBox label="Hazard Identification" required>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.from_hazard_id === true} onChange={() => set("from_hazard_id", true)} className="h-3.5 w-3.5 rounded border-border accent-amber-500" />
                  <span className="text-xs">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.from_hazard_id === false} onChange={() => set("from_hazard_id", false)} className="h-3.5 w-3.5 rounded border-border accent-amber-500" />
                  <span className="text-xs">No</span>
                </label>
              </div>
            </FieldBox>
            <FieldBox label="Work Centre">
              <div className="flex items-center gap-2 mt-2">
                {WORK_CENTRES.map((wc) => (
                  <button
                    key={wc}
                    type="button"
                    onClick={() => set("work_centre", form.work_centre === wc ? "" : wc)}
                    className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                      form.work_centre === wc
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-border hover:border-foreground/50"
                    }`}
                  >
                    {wc}
                  </button>
                ))}
              </div>
            </FieldBox>
          </div>

          {/* Row 3: Equipment Description, Requested By */}
          <div className="grid grid-cols-2 gap-3">
            <FieldBox label="Equipment Description" required>
              <Input
                value={form.functional_location}
                onChange={(e) => set("functional_location", e.target.value)}
                placeholder="Enter location"
                className="mt-1 h-8 text-sm border-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 px-0"
              />
            </FieldBox>
            <FieldBox label="Requested By" required>
              <Input
                value={form.requested_by}
                onChange={(e) => set("requested_by", e.target.value)}
                placeholder="Enter name"
                className="mt-1 h-8 text-sm border-0 border-b border-border rounded-none shadow-none focus-visible:ring-0 px-0"
              />
            </FieldBox>
          </div>

          {/* Work Title */}
          <SectionCard title="WORK TITLE" required>
            <Input
              value={form.work_title}
              onChange={(e) => set("work_title", e.target.value)}
              placeholder="Brief title summarising the work required..."
              className="h-9 text-sm border-border"
            />
          </SectionCard>

          {/* Description */}
          <SectionCard title="DESCRIPTION" required actions={
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1.5" disabled={enhancingDesc} onClick={handleEnhance}>
              {enhancingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              Generate with AI
            </Button>
          }>
            <Textarea
              value={form.problem_description}
              onChange={(e) => set("problem_description", e.target.value)}
              placeholder="Describe the fault, issue, or work required..."
              rows={4}
              className="text-sm border-border"
            />
          </SectionCard>

          {/* Scope of Works */}
          <SectionCard title="SCOPE OF WORKS" actions={
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addOp}>
              <Plus className="h-3 w-3" /> Add Step
            </Button>
          }>
            {operations.length === 0 ? (
              <div
                className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={addOp}
              >
                <p className="text-xs text-muted-foreground">No steps defined. Click "Add Step" to begin.</p>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground w-10">#</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Step</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground w-28">Work Centre</th>
                      <th className="px-3 py-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {operations.map((op) => (
                      <tr key={op.id} className="border-b border-border last:border-b-0">
                        <td className="px-3 py-1.5 font-mono text-muted-foreground">{op.lineNo}</td>
                        <td className="px-3 py-1.5">
                          <Input
                            value={op.description}
                            onChange={(e) => updateOp(op.id, "description", e.target.value)}
                            placeholder="What needs to be done..."
                            className="h-7 text-xs border-none shadow-none focus-visible:ring-0 bg-transparent px-0"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {WORK_CENTRES.map((wc) => (
                              <button
                                key={wc}
                                type="button"
                                onClick={() => updateOp(op.id, "workCentre", op.workCentre === wc ? "" : wc)}
                                className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                                  op.workCentre === wc
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-muted-foreground border-border hover:border-foreground/50"
                                }`}
                              >
                                {wc}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-1 py-1.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeOp(op.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {/* Photos / Evidence */}
          <SectionCard title="PHOTOS / EVIDENCE" required icon={<Camera className="h-4 w-4" />} actions={
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => fileInputRef.current?.click()}>
              <Camera className="h-3 w-3" /> Add Photo
            </Button>
          }>
            {photoPreviewUrls.length > 0 ? (
              <div className="flex items-center gap-3 flex-wrap">
                {photoPreviewUrls.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <Camera className="h-5 w-5" /><span className="text-[10px]">Add Photo</span>
                  </button>
                )}
              </div>
            ) : (
              <div
                className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">Click to upload photos of the defect or issue</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
          </SectionCard>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 text-center">
          <p className="text-xs text-muted-foreground">TCMG-WR-001 | Rev 1.0 | Tennant Creek Gold Mine</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable sub-components ─── */

function FieldBox({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-md p-3">
      <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SectionCard({ title, required, icon, actions, children }: {
  title: string; required?: boolean; icon?: React.ReactNode;
  actions?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold tracking-wide">{title}</span>
          {required && <span className="text-destructive font-bold">*</span>}
        </div>
        {actions}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
