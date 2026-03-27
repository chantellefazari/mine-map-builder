import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Search, Sparkles, Loader2, SendHorizontal, ArrowRightCircle, Camera, X, ImagePlus, Plus, Trash2 } from "lucide-react";
import tennantIcon from "@/assets/tennant-icon.png";
import { useWorkRequests } from "@/hooks/useWorkRequests";
import { usePriorityConfig } from "@/hooks/usePriorityConfig";
import { AssetLookupDialog } from "@/components/work-orders/AssetLookupDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface WorkRequestTemplateProps {
  wrNumber?: string;
}

export const WorkRequestTemplate = ({ wrNumber }: WorkRequestTemplateProps) => {
  const { workRequests, update, convertToWO } = useWorkRequests();
  const wr = workRequests.find((w) => w.wr_number === wrNumber);
  const [assetLookupOpen, setAssetLookupOpen] = useState(false);
  const [isEnhancingDesc, setIsEnhancingDesc] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    asset_id: "",
    functional_location: "",
    problem_description: "",
    scope_of_works: "",
    priority: "P3 - Medium",
    work_type: "Inspect",
    requested_by: "",
    trade: "",
    status: "Open",
    isolation_required: false,
    from_hazard_id: false,
    photo_urls: [] as string[],
  });

  useEffect(() => {
    if (wr) {
      setForm({
        asset_id: wr.asset_id || "",
        functional_location: wr.functional_location || "",
        problem_description: wr.problem_description || "",
        scope_of_works: wr.scope_of_works || "",
        priority: wr.priority || "P3 - Medium",
        work_type: wr.work_type || "Inspect",
        requested_by: wr.requested_by || "",
        trade: wr.trade || "",
        status: wr.status || "Open",
        isolation_required: wr.isolation_required || false,
        from_hazard_id: (wr as any).from_hazard_id || false,
        photo_urls: wr.photo_urls || [],
      });
    }
  }, [wr?.id]);

  const saveField = useCallback(
    async (field: string, value: any) => {
      if (!wr) return;
      const { error } = await (supabase as any)
        .from("work_requests")
        .update({ [field]: value })
        .eq("id", wr.id);
      if (error) {
        toast.error(`Save failed: ${error.message}`);
        return;
      }
      update.mutate({ id: wr.id, updates: {} }, { onSettled: () => {} });
    },
    [wr, update]
  );

  const handleFieldBlur = (field: string, value: string) => {
    if (wr && value !== (wr as any)[field]) {
      saveField(field, value);
    }
  };

  const handlePrint = () => window.print();

  const handleEnhanceDescription = async () => {
    const value = form.problem_description.trim();
    if (!value) { toast.error("Write some rough notes first"); return; }
    setIsEnhancingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-wo-description", {
        body: { description: value, mode: "description" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setForm((prev) => ({ ...prev, problem_description: data.enhanced }));
      if (wr) saveField("problem_description", data.enhanced);
      toast.success("Description enhanced");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate");
    } finally {
      setIsEnhancingDesc(false);
    }
  };

  const handleConvertToWO = () => {
    if (!wr) return;
    convertToWO.mutate({ wrId: wr.id, woType: "Planned" });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !wr) return;
    setIsUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${wr.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("wr-photos").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("wr-photos").getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }
      const updated = [...form.photo_urls, ...newUrls];
      setForm((prev) => ({ ...prev, photo_urls: updated }));
      saveField("photo_urls", updated);
      toast.success(`${newUrls.length} photo(s) uploaded`);
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = form.photo_urls.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, photo_urls: updated }));
    if (wr) saveField("photo_urls", updated);
  };

  const { wrPriorities } = usePriorityConfig();
  const priorityOptions = wrPriorities.map(p => p.value);
  const workTypeOptions = ["Inspect", "Repair", "Replace"];
  const isConverted = form.status === "Converted to WO";

  return (
    <div className="space-y-4">
      {/* Header with Print Button */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            Work Request {wrNumber && <span className="text-primary font-mono">({wrNumber})</span>}
          </h2>
          {isConverted && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-300">Converted to WO</Badge>
          )}
        </div>
        <div className="flex gap-2">
          {!isConverted && form.status !== "Pending Approval" && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (wr) {
                  saveField("status", "Pending Approval");
                  setForm((prev) => ({ ...prev, status: "Pending Approval" }));
                  toast.success(`${wrNumber} sent for approval`);
                }
              }}
              disabled={!wr}
            >
              <SendHorizontal className="h-4 w-4" />
              Send for Approval
            </Button>
          )}
          {form.status === "Pending Approval" && !isConverted && (
            <Button
              variant="default"
              className="gap-2"
              onClick={handleConvertToWO}
              disabled={!wr || convertToWO.isPending}
            >
              {convertToWO.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightCircle className="h-4 w-4" />}
              Approve & Convert to WO
            </Button>
          )}
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Work Request Document - A4 optimized */}
      <div className="bg-white border border-border rounded-lg shadow-sm print:shadow-none print:border-none print:w-full print:max-w-none print:m-0 print:p-0">
        {/* Banner Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between print:bg-black">
          <div className="flex items-center gap-3">
            <img src={tennantIcon} alt="Tennant Mines" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-[#D4AF37]">TENNANT MINES</h1>
              <p className="text-xs text-gray-300">Tennant Creek Gold Mine</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-[#D4AF37]">WORK REQUEST</h2>
          </div>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Work Request Details Section */}
          <div className="space-y-2">
            {/* Row 1: WR No, Date Raised, Priority, Work Type */}
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block">Work Request No.</span>
                <span className="font-mono font-medium">{wrNumber || "WR-______"}</span>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block">Date Raised</span>
                <span className="font-medium print:block">
                  {wr?.date_raised ? format(new Date(wr.date_raised), "dd/MM/yyyy") : "____/____/________"}
                </span>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Priority</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {priorityOptions.map((p) => (
                    <label key={p} className="flex items-center gap-1 cursor-pointer" onClick={() => {
                      setForm({ ...form, priority: p });
                      if (wr) saveField("priority", p);
                    }}>
                      <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center text-[10px] ${form.priority === p ? "bg-primary text-primary-foreground" : ""}`}>
                        {form.priority === p && "✓"}
                      </div>
                      <span className="text-xs">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Work Type</span>
                <div className="flex flex-col gap-1">
                  {workTypeOptions.map((t) => (
                    <label key={t} className="flex items-center gap-1 cursor-pointer" onClick={() => {
                      setForm({ ...form, work_type: t });
                      if (wr) saveField("work_type", t);
                    }}>
                      <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center text-[10px] ${form.work_type === t ? "bg-primary text-primary-foreground" : ""}`}>
                        {form.work_type === t && "✓"}
                      </div>
                      <span className="text-xs">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Asset Number, Isolation Required, Equipment Description */}
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Asset Number</span>
                <div className="flex gap-1">
                  <Input
                    className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto flex-1"
                    value={form.asset_id}
                    onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
                    onBlur={(e) => handleFieldBlur("asset_id", e.target.value)}
                    placeholder="Enter or search"
                  />
                  <Button size="icon" variant="outline" className="h-7 w-7 shrink-0 print:hidden" onClick={() => setAssetLookupOpen(true)} title="Search Asset Hierarchy">
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Isolation Required</span>
                <div className="flex gap-4">
                  {(["Yes", "No"] as const).map((opt) => {
                    const isSelected = opt === "Yes" ? form.isolation_required : !form.isolation_required;
                    return (
                      <label key={opt} className="flex items-center gap-1 cursor-pointer" onClick={() => {
                        const val = opt === "Yes";
                        setForm({ ...form, isolation_required: val });
                        if (wr) saveField("isolation_required", val);
                      }}>
                        <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center text-[10px] ${isSelected ? "bg-primary text-primary-foreground" : ""}`}>
                          {isSelected && "✓"}
                        </div>
                        <span className="text-xs">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Hazard Identification</span>
                <div className="flex gap-4">
                  {(["Yes", "No"] as const).map((opt) => {
                    const isSelected = opt === "Yes" ? form.from_hazard_id : !form.from_hazard_id;
                    return (
                      <label key={opt} className="flex items-center gap-1 cursor-pointer" onClick={() => {
                        const val = opt === "Yes";
                        setForm({ ...form, from_hazard_id: val });
                        if (wr) saveField("from_hazard_id", val);
                      }}>
                        <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center text-[10px] ${isSelected ? "bg-primary text-primary-foreground" : ""}`}>
                          {isSelected && "✓"}
                        </div>
                        <span className="text-xs">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Trade</span>
                <Input
                  className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                  value={form.trade}
                  onChange={(e) => setForm({ ...form, trade: e.target.value })}
                  onBlur={(e) => handleFieldBlur("trade", e.target.value)}
                  placeholder="e.g. Fitter, Electrician"
                />
              </div>
            </div>

            {/* Row 3: Equipment Description, Trade */}
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-gray-300 p-2 col-span-2">
                <span className="text-xs text-gray-500 block mb-1">Equipment Description</span>
                <Input
                  className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                  value={form.functional_location}
                  onChange={(e) => setForm({ ...form, functional_location: e.target.value })}
                  onBlur={(e) => handleFieldBlur("functional_location", e.target.value)}
                  placeholder="Enter location"
                />
              </div>
              <div className="border border-gray-300 p-2 col-span-2">
                <span className="text-xs text-gray-500 block mb-1">Requested By</span>
                <Input
                  className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                  value={form.requested_by}
                  onChange={(e) => setForm({ ...form, requested_by: e.target.value })}
                  onBlur={(e) => handleFieldBlur("requested_by", e.target.value)}
                  placeholder="Enter name"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
              <span className="font-semibold text-gray-700">DESCRIPTION</span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-7 print:hidden"
                onClick={handleEnhanceDescription}
                disabled={isEnhancingDesc || !form.problem_description.trim()}
              >
                {isEnhancingDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isEnhancingDesc ? "Enhancing…" : "Generate with AI"}
              </Button>
            </div>
            <div className="p-3">
              <Textarea
                className="min-h-[60px] text-xs border-dashed print:border-none print:p-0 print:min-h-0 resize-none overflow-hidden"
                style={{ height: 'auto' }}
                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                value={form.problem_description}
                onChange={(e) => { setForm({ ...form, problem_description: e.target.value }); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                onBlur={(e) => handleFieldBlur("problem_description", e.target.value)}
                placeholder="Describe the fault, issue, or work required..."
              />
            </div>
          </div>

          {/* Operations - Editable simple builder */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
              <span className="font-semibold text-gray-700">OPERATIONS</span>
              {!isConverted && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs h-7 print:hidden"
                  onClick={() => {
                    let ops: any[] = [];
                    try {
                      const parsed = typeof form.scope_of_works === "string" ? JSON.parse(form.scope_of_works) : form.scope_of_works;
                      if (Array.isArray(parsed)) ops = parsed;
                    } catch {}
                    const newOp = {
                      id: crypto.randomUUID(),
                      lineNo: ops.length + 1,
                      description: "",
                      trade: "",
                      workCentre: "",
                      estimatedHours: 0,
                      requiresIsolation: false,
                      requiresShutdown: false,
                      parallelAllowed: false,
                      predecessor: "",
                      notes: "",
                    };
                    const updated = [...ops, newOp];
                    setForm((prev) => ({ ...prev, scope_of_works: JSON.stringify(updated) }));
                    if (wr) saveField("scope_of_works", JSON.stringify(updated));
                  }}
                >
                  <Plus className="h-3 w-3" /> Add Step
                </Button>
              )}
            </div>
            <div className="p-3">
              {(() => {
                let ops: any[] = [];
                try {
                  const parsed = typeof form.scope_of_works === "string" ? JSON.parse(form.scope_of_works) : form.scope_of_works;
                  if (Array.isArray(parsed)) ops = parsed;
                } catch {}

                if (ops.length === 0) {
                  return (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary/30 transition-colors print:cursor-default"
                      onClick={() => {
                        if (isConverted) return;
                        const newOp = {
                          id: crypto.randomUUID(),
                          lineNo: 1,
                          description: "",
                          trade: "",
                          workCentre: "",
                          estimatedHours: 0,
                          requiresIsolation: false,
                          requiresShutdown: false,
                          parallelAllowed: false,
                          predecessor: "",
                          notes: "",
                        };
                        setForm((prev) => ({ ...prev, scope_of_works: JSON.stringify([newOp]) }));
                        if (wr) saveField("scope_of_works", JSON.stringify([newOp]));
                      }}
                    >
                      <p className="text-xs text-muted-foreground">No operations added. Click to add the first step.</p>
                    </div>
                  );
                }

                if (isConverted) {
                  // Read-only view for converted WRs
                  return (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-300 bg-gray-50">
                          <th className="px-2 py-1.5 text-left font-medium text-gray-600 w-12">Op #</th>
                          <th className="px-2 py-1.5 text-left font-medium text-gray-600">Description</th>
                          <th className="px-2 py-1.5 text-left font-medium text-gray-600 w-24">Work Centre</th>
                          <th className="px-2 py-1.5 text-left font-medium text-gray-600 w-20">Work Centre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ops.map((op: any, i: number) => (
                          <tr key={op.id || i} className="border-b border-gray-200 last:border-b-0">
                            <td className="px-2 py-1.5 font-mono text-gray-500">{op.lineNo || i + 1}</td>
                            <td className="px-2 py-1.5">{op.description || "—"}</td>
                            <td className="px-2 py-1.5">{op.workCentre || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                }

                // Editable simple operations
                return (
                  <div className="space-y-2">
                    {ops.map((op: any, i: number) => (
                      <div key={op.id || i} className="flex items-end gap-2">
                        <span className="text-xs font-mono text-muted-foreground w-6 text-right shrink-0">
                          {op.lineNo || i + 1}
                        </span>
                        <Input
                          value={op.description || ""}
                          onChange={(e) => {
                            const updated = ops.map((o: any, idx: number) =>
                              idx === i ? { ...o, description: e.target.value } : o
                            );
                            setForm((prev) => ({ ...prev, scope_of_works: JSON.stringify(updated) }));
                          }}
                          onBlur={() => {
                            if (wr) saveField("scope_of_works", form.scope_of_works);
                          }}
                          placeholder="What needs to be done..."
                          className="h-8 text-xs flex-1 border-dashed print:border-none"
                        />
                        <div className="shrink-0 print:hidden">
                          {i === 0 && <span className="text-[10px] text-muted-foreground font-medium block mb-0.5">Work Centre</span>}
                          <Select
                            value={op.workCentre || "none"}
                            onValueChange={(v) => {
                              const updated = ops.map((o: any, idx: number) =>
                                idx === i ? { ...o, workCentre: v === "none" ? "" : v } : o
                              );
                              const json = JSON.stringify(updated);
                              setForm((prev) => ({ ...prev, scope_of_works: json }));
                              if (wr) saveField("scope_of_works", json);
                            }}
                          >
                            <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {["MECH", "ELEC", "PROJ"].map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-destructive print:hidden"
                          onClick={() => {
                            const updated = ops
                              .filter((_: any, idx: number) => idx !== i)
                              .map((o: any, idx: number) => ({ ...o, lineNo: idx + 1 }));
                            const json = JSON.stringify(updated);
                            setForm((prev) => ({ ...prev, scope_of_works: json }));
                            if (wr) saveField("scope_of_works", json);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground">These steps carry into the Work Order. Planners add hours & details later.</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <Camera className="h-4 w-4" />
                PHOTOS / EVIDENCE
              </span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-7 print:hidden"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !wr}
              >
                {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />}
                {isUploading ? "Uploading…" : "Add Photo"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="p-3">
              {form.photo_urls.length === 0 ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors print:hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Click to upload photos of the defect or issue</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {form.photo_urls.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`WR photo ${i + 1}`} className="w-full h-32 object-cover rounded border border-gray-200" />
                      <button
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                        onClick={() => handleRemovePhoto(i)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors print:hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
            <p>TCMG-WR-001 | Rev 1.0 | Tennant Creek Gold Mine</p>
          </div>
        </div>
      </div>

      {/* Asset Lookup Dialog */}
      <AssetLookupDialog
        open={assetLookupOpen}
        onOpenChange={setAssetLookupOpen}
        onSelect={(asset) => {
          const updatedForm = { ...form, asset_id: asset.assetNumber, functional_location: asset.name };
          setForm(updatedForm);
          if (wr) {
            saveField("asset_id", asset.assetNumber);
            saveField("functional_location", asset.name);
          }
        }}
      />
    </div>
  );
};
