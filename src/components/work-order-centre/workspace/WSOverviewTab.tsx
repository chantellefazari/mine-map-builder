import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { WRAssetSearch } from "../WRAssetSearch";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { usePriorityConfig } from "@/hooks/usePriorityConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, X, Sparkles, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
}

// Generate revision week options
function getRevisionWeeks() {
  const weeks: string[] = [];
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  for (let w = 1; w <= 52; w++) {
    const startDate = new Date(now.getFullYear(), 0, 1 + (w - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    weeks.push(`Y${year}-W${w} · ${format(startDate, "dd MMM")} - ${format(endDate, "dd MMM")}`);
  }
  return weeks;
}

export function WSOverviewTab({ wo, onUpdate }: Props) {
  const { woPriorityValues } = usePriorityConfig();
  const revisionWeeks = getRevisionWeeks();

  const [local, setLocal] = useState({
    problem_description: wo.problem_description || "",
    work_performed: wo.work_performed || "",
    asset_id: wo.asset_id || "",
    functional_location: wo.functional_location || "",
    priority: wo.priority || "P3 - Medium",
    work_type: wo.work_type || "Planned",
    trade: wo.trade || "",
    requested_by: wo.requested_by || "",
    assigned_to: wo.assigned_to || "",
    work_title: (wo as any).work_title || "",
    findings: (wo as any).findings || "",
    isolation_required: (wo as any).isolation_required || false,
    work_centre: (wo as any).work_centre || "MECH",
    revision_week: (wo as any).revision_week || "",
    scheduled_date: wo.scheduled_date || null,
  });

  const [equipmentDesc, setEquipmentDesc] = useState("");
  const [photos, setPhotos] = useState<string[]>(wo.photo_urls || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [enhancingDesc, setEnhancingDesc] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Look up equipment description from asset
  useEffect(() => {
    if (!local.asset_id) { setEquipmentDesc(""); return; }
    (async () => {
      const { data } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_name")
        .eq("asset_number", local.asset_id)
        .maybeSingle();
      setEquipmentDesc(data?.asset_name || "");
    })();
  }, [local.asset_id]);

  useEffect(() => {
    setLocal({
      problem_description: wo.problem_description || "",
      work_performed: wo.work_performed || "",
      asset_id: wo.asset_id || "",
      functional_location: wo.functional_location || "",
      priority: wo.priority || "P3 - Medium",
      work_type: wo.work_type || "Planned",
      trade: wo.trade || "",
      requested_by: wo.requested_by || "",
      assigned_to: wo.assigned_to || "",
      work_title: (wo as any).work_title || "",
      findings: (wo as any).findings || "",
      isolation_required: (wo as any).isolation_required || false,
      work_centre: (wo as any).work_centre || "MECH",
      revision_week: (wo as any).revision_week || "",
      scheduled_date: wo.scheduled_date || null,
    });
    setPhotos(wo.photo_urls || []);
    setNewFiles([]);
    setNewPreviews([]);
  }, [wo.id]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  const save = (field: string, value: any) => {
    setLocal((l) => ({ ...l, [field]: value }));
    onUpdate({ [field]: value });
  };

  const debouncedSave = useCallback((field: string, value: any) => {
    setLocal((l) => ({ ...l, [field]: value }));
    clearTimeout(debounceTimers.current[field]);
    debounceTimers.current[field] = setTimeout(() => {
      onUpdate({ [field]: value });
    }, 500);
  }, [onUpdate]);

  const handleEnhance = async () => {
    const text = local.problem_description;
    if (!text.trim()) { toast.error("Please enter some rough notes first"); return; }
    setEnhancingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-wo-description", {
        body: { description: text, mode: "description" },
      });
      if (error) throw error;
      if (data?.enhanced) { save("problem_description", data.enhanced); toast.success("Description enhanced"); }
    } catch (err: any) {
      toast.error(err.message || "Failed to enhance text");
    } finally {
      setEnhancingDesc(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    const totalAllowed = 5 - photos.length;
    const toAdd = imageFiles.slice(0, totalAllowed);
    setNewFiles((p) => [...p, ...toAdd]);
    setNewPreviews((p) => [...p, ...toAdd.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadAndSavePhotos = async () => {
    if (newFiles.length === 0) return;
    const urls: string[] = [...photos];
    for (const file of newFiles) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${wo.wo_number}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("wr-photos").upload(path, file);
      if (error) { console.error("Upload error:", error); continue; }
      const { data: urlData } = supabase.storage.from("wr-photos").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    onUpdate({ photo_urls: urls } as any);
    setPhotos(urls);
    newPreviews.forEach((u) => URL.revokeObjectURL(u));
    setNewFiles([]);
    setNewPreviews([]);
    toast.success("Photos uploaded");
  };

  const removeExistingPhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onUpdate({ photo_urls: updated } as any);
  };

  const removeNewPhoto = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((p) => p.filter((_, i) => i !== index));
    setNewPreviews((p) => p.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Row 1: Asset Number, Equipment Description, Functional Location */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Asset Number <span className="text-destructive">*</span></Label>
          <WRAssetSearch
            value={local.asset_id}
            onSelect={(assetId, assetName) => {
              save("asset_id", assetId);
              save("functional_location", assetName);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Equipment Description <span className="text-destructive">*</span></Label>
          <Input value={equipmentDesc} readOnly className="h-9 text-sm bg-muted/30" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Functional Location <span className="text-destructive">*</span></Label>
          <Input value={local.functional_location} readOnly className="h-9 text-sm bg-muted/30" />
        </div>
      </div>

      {/* Row 2: Priority, Work Order Type, Work Centre, Requested By */}
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Priority <span className="text-destructive">*</span></Label>
          <Select value={local.priority} onValueChange={(v) => save("priority", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {woPriorityValues.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Work Order Type <span className="text-destructive">*</span></Label>
          <Select value={local.work_type} onValueChange={(v) => save("work_type", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Breakdown", "Planned", "Shutdown", "Out of Scope"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Work Centre <span className="text-destructive">*</span></Label>
          <Select value={local.work_centre} onValueChange={(v) => save("work_centre" as any, v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["MECH", "ELEC", "MOB", "INST"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Requested By <span className="text-destructive">*</span></Label>
          <Input value={local.requested_by} onChange={(e) => debouncedSave("requested_by", e.target.value)} className="h-9 text-sm" />
        </div>
      </div>

      {/* Row 3: Revision, Scheduled Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Revision</Label>
          <Select value={local.revision_week} onValueChange={(v) => save("revision_week" as any, v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select week..." /></SelectTrigger>
            <SelectContent>
              {revisionWeeks.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Scheduled Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 w-full justify-start text-sm font-normal">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {local.scheduled_date ? format(new Date(local.scheduled_date), "dd MMM yyyy") : <span className="text-muted-foreground">— No date selected —</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={local.scheduled_date ? new Date(local.scheduled_date) : undefined}
                onSelect={(date) => save("scheduled_date", date ? format(date, "yyyy-MM-dd") : null)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Work Title */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Work Title <span className="text-destructive">*</span></Label>
        <Input
          value={local.work_title}
          onChange={(e) => debouncedSave("work_title" as any, e.target.value)}
          className="h-9 text-sm"
          placeholder="Brief title for this work order..."
        />
      </div>

      {/* Description with AI */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Description / Problem Statement <span className="text-destructive">*</span></Label>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1.5" disabled={enhancingDesc} onClick={handleEnhance}>
            {enhancingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Generate with AI
          </Button>
        </div>
        <Textarea value={local.problem_description} onChange={(e) => debouncedSave("problem_description", e.target.value)} rows={4} className="text-sm" />
      </div>

      {/* Additional Notes */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Additional Notes</Label>
        <p className="text-[11px] text-muted-foreground">Important instructions for the crew — safety considerations, access requirements, special instructions.</p>
        <Textarea
          value={local.work_performed}
          onChange={(e) => debouncedSave("work_performed", e.target.value)}
          rows={3}
          className="text-sm"
          placeholder="e.g. Will need to use EWP to remove. Work in with ops to set time to achieve."
        />
      </div>

      {/* Findings & Follow-up Actions */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Findings & Follow-up Actions</Label>
        <p className="text-[11px] text-muted-foreground">Observations, issues found, and follow-up actions from execution.</p>
        <Textarea
          value={local.findings}
          onChange={(e) => debouncedSave("findings" as any, e.target.value)}
          rows={3}
          className="text-sm"
          placeholder="Record findings and follow-up actions during or after execution..."
        />
      </div>

      {/* Photos */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Photos</Label>
        <div className="flex items-center gap-3 flex-wrap">
          {photos.map((url, i) => (
            <div key={`existing-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeExistingPhoto(i)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {newPreviews.map((url, i) => (
            <div key={`new-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-primary/40 group">
              <img src={url} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeNewPhoto(i)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length + newFiles.length < 5 && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <Camera className="h-5 w-5" />
              <span className="text-[10px]">Add Photo</span>
            </button>
          )}
        </div>
        {newFiles.length > 0 && (
          <Button type="button" size="sm" className="h-7 text-xs" onClick={uploadAndSavePhotos}>
            Upload {newFiles.length} photo{newFiles.length > 1 ? "s" : ""}
          </Button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
      </div>

      {/* Isolation Required */}
      <div className="border border-border rounded-lg p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch
            checked={local.isolation_required}
            onCheckedChange={(v) => save("isolation_required" as any, v)}
          />
          <span className="text-sm font-semibold">Isolation Required</span>
        </label>
      </div>
    </div>
  );
}
