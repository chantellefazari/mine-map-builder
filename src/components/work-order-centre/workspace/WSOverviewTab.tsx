import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WRAssetSearch } from "../WRAssetSearch";
import { TradeMultiSelect } from "../TradeMultiSelect";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { usePriorityConfig } from "@/hooks/usePriorityConfig";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, X, Sparkles, Loader2 } from "lucide-react";

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
}

export function WSOverviewTab({ wo, onUpdate }: Props) {
  const { woPriorityValues } = usePriorityConfig();
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
  });

  const [photos, setPhotos] = useState<string[]>(wo.photo_urls || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [enhancingDesc, setEnhancingDesc] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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
    });
    setPhotos(wo.photo_urls || []);
    setNewFiles([]);
    setNewPreviews([]);
  }, [wo.id]);

  // Flush any pending debounced saves on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  // Immediate save for selects / dropdowns
  const save = (field: string, value: any) => {
    setLocal((l) => ({ ...l, [field]: value }));
    onUpdate({ [field]: value });
  };

  // Debounced save for text inputs (500ms after last keystroke)
  const debouncedSave = useCallback((field: string, value: any) => {
    setLocal((l) => ({ ...l, [field]: value }));
    clearTimeout(debounceTimers.current[field]);
    debounceTimers.current[field] = setTimeout(() => {
      onUpdate({ [field]: value });
    }, 500);
  }, [onUpdate]);

  const handleEnhance = async () => {
    const text = local.problem_description;
    if (!text.trim()) {
      toast.error(`Please enter some rough notes first`);
      return;
    }
    setEnhancingDesc(true);

    try {
      const { data, error } = await supabase.functions.invoke("enhance-wo-description", {
        body: { description: text, mode: "description" },
      });
      if (error) throw error;
      if (data?.enhanced) {
        save("problem_description", data.enhanced);
        toast.success("Description enhanced");
      }
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Asset Number</Label>
          <WRAssetSearch
            value={local.asset_id}
            onSelect={(assetId, assetName) => {
              save("asset_id", assetId);
              save("functional_location", assetName);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Area</Label>
          <Input value={local.functional_location} readOnly className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Priority</Label>
          <Select value={local.priority} onValueChange={(v) => save("priority", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {woPriorityValues.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Work Order Type</Label>
          <Select value={local.work_type} onValueChange={(v) => save("work_type", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Breakdown", "Planned", "Shutdown"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Requested By</Label>
          <Input value={local.requested_by} onChange={(e) => debouncedSave("requested_by", e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5 col-span-2 lg:col-span-1">
          <Label className="text-xs font-semibold">Planner / Supervisor</Label>
          <Input value={local.assigned_to} onBlur={(e) => save("assigned_to", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, assigned_to: e.target.value }))} className="h-9 text-sm" />
        </div>
      </div>

      {/* Description with AI */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Description / Problem Statement</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            disabled={enhancingDesc}
            onClick={() => handleEnhance()}
          >
            {enhancingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            Generate with AI
          </Button>
        </div>
        <Textarea value={local.problem_description} onBlur={(e) => save("problem_description", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, problem_description: e.target.value }))} rows={4} className="text-sm" />
      </div>


      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Notes</Label>
        <Textarea value={local.work_performed} onBlur={(e) => save("work_performed", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, work_performed: e.target.value }))} rows={3} className="text-sm" placeholder="Additional notes, observations, or comments..." />
      </div>

      {/* Photos */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Photos</Label>
        <div className="flex items-center gap-3 flex-wrap">
          {photos.map((url, i) => (
            <div key={`existing-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingPhoto(i)}
                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {newPreviews.map((url, i) => (
            <div key={`new-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-primary/40 group">
              <img src={url} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewPhoto(i)}
                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length + newFiles.length < 5 && (
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
        {newFiles.length > 0 && (
          <Button type="button" size="sm" className="h-7 text-xs" onClick={uploadAndSavePhotos}>
            Upload {newFiles.length} photo{newFiles.length > 1 ? "s" : ""}
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoSelect}
        />
      </div>
    </div>
  );
}
