import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Save, Search, Trash2, Sparkles, Loader2, Wand2, SendHorizontal } from "lucide-react";
import { areasData } from "@/components/hierarchy/assetData";
import tennantIcon from "@/assets/tennant-icon.png";
import { WOSubTabs } from "./WOSubTabs";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import { SparePartLookupDialog } from "@/components/po-tracker/SparePartLookupDialog";
import { AssetLookupDialog } from "./AssetLookupDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MechanicalWorkOrderTemplateProps {
  woNumber?: string;
}

export const MechanicalWorkOrderTemplate = ({ woNumber }: MechanicalWorkOrderTemplateProps) => {
  const { workOrders, update } = useWorkOrders();
  const wo = workOrders.find((w) => w.wo_number === woNumber);
  const { parts, addPart, deletePart } = useWorkOrderParts(wo?.id);
  const [spareLookupOpen, setSpareLookupOpen] = useState(false);
  const [assetLookupOpen, setAssetLookupOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingParts, setIsGeneratingParts] = useState(false);
  // Local form state seeded from DB
  const [form, setForm] = useState({
    asset_id: "",
    functional_location: "",
    problem_description: "",
    work_performed: "",
    priority: "Normal",
    work_type: "Breakdown",
    requested_by: "",
    assigned_to: "",
    trade: "",
    status: "Open",
    returned_to_service: "",
    technician_name: "",
    technician_sign_date: "",
    supervisor_name: "",
    supervisor_sign_date: "",
    operations_handover_name: "",
    operations_handover_date: "",
    resources_required: "",
  });

  // Sync form when WO data loads
  useEffect(() => {
    if (wo) {
      setForm({
        asset_id: wo.asset_id || "",
        functional_location: wo.functional_location || "",
        problem_description: wo.problem_description || "",
        work_performed: wo.work_performed || "",
        priority: wo.priority || "Normal",
        work_type: wo.work_type || "Breakdown",
        requested_by: wo.requested_by || "",
        assigned_to: wo.assigned_to || "",
        trade: wo.trade || "",
        status: wo.status || "Open",
        returned_to_service: wo.returned_to_service || "",
        technician_name: wo.technician_name || "",
        technician_sign_date: wo.technician_sign_date || "",
        supervisor_name: wo.supervisor_name || "",
        supervisor_sign_date: wo.supervisor_sign_date || "",
        operations_handover_name: wo.operations_handover_name || "",
        operations_handover_date: wo.operations_handover_date || "",
        resources_required: (wo as any).resources_required || "",
      });
    }
  }, [wo?.id]);

  const saveField = useCallback(
    (field: string, value: string) => {
      if (!wo) return;
      update.mutate({ id: wo.id, updates: { [field]: value } });
    },
    [wo, update]
  );

  const handleFieldBlur = (field: string, value: string) => {
    if (wo && value !== (wo as any)[field]) {
      saveField(field, value);
    }
  };

  const handlePrint = () => window.print();

  const handleEnhanceDescription = async () => {
    if (!form.problem_description.trim()) {
      toast.error("Write a rough description first");
      return;
    }
    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-wo-description", {
        body: { description: form.problem_description },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const enhanced = data.enhanced;
      setForm((prev) => ({ ...prev, problem_description: enhanced }));
      if (wo) saveField("problem_description", enhanced);
      toast.success("Description enhanced");
    } catch (err: any) {
      toast.error(err.message || "Failed to enhance description");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateParts = async () => {
    if (!wo || !form.problem_description.trim()) {
      toast.error("Enter a work description and asset number first");
      return;
    }
    setIsGeneratingParts(true);
    try {
      let assetComponents: any[] = [];
      if (form.asset_id) {
        for (const area of areasData) {
          for (const sub of area.subAreas) {
            for (const parent of sub.parentAssets) {
              for (const equip of parent.equipment) {
                if (equip.assetNumber === form.asset_id && equip.components) {
                  assetComponents = equip.components;
                }
              }
            }
          }
        }
      }
      const { data, error } = await supabase.functions.invoke("suggest-wo-parts", {
        body: { description: form.problem_description, asset_number: form.asset_id, asset_components: assetComponents },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const suggested = data.parts || [];
      if (suggested.length === 0) {
        toast.info("No parts suggested — try adding more detail to the description");
        return;
      }
      for (const part of suggested) {
        await addPart.mutateAsync({
          work_order_id: wo.id,
          part_number: part.part_number || "TBA",
          part_description: part.description || "",
          quantity_required: part.quantity || 1,
          status: "Not Ordered",
          location: part.bin_location || "",
          comment: part.reasoning || "AI suggested",
          last_updated_by: "AI",
        });
      }
      toast.success(`${suggested.length} parts suggested and added`);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate parts");
    } finally {
      setIsGeneratingParts(false);
    }
  };


  const priorityOptions = ["Critical", "High", "Normal", "Low"];
  const workTypeOptions = ["Breakdown", "Planned", "Shutdown"];

  return (
    <div className="space-y-4">
      {/* Header with Print Button */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-xl font-semibold text-foreground">
          Work Order {woNumber && <span className="text-primary font-mono">({woNumber})</span>}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              if (wo) {
                saveField("status", "Pending Approval");
                setForm((prev) => ({ ...prev, status: "Pending Approval" }));
                toast.success(`${woNumber} sent for approval`);
              }
            }}
            disabled={!wo || form.status === "Pending Approval"}
          >
            <SendHorizontal className="h-4 w-4" />
            {form.status === "Pending Approval" ? "Sent for Approval" : "Send for Approval"}
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Work Order Document - A4 optimized */}
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
            <h2 className="text-lg font-bold text-[#D4AF37]">WORK ORDER</h2>
          </div>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Work Order Details Section */}
          <div className="space-y-2">
            {/* Row 1: WO No, Date Raised, Priority, Work Type */}
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block">Work Order No.</span>
                <span className="font-mono font-medium">{woNumber || "WO-______"}</span>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block">Date Raised</span>
                <span className="font-medium print:block">
                  {wo?.date_raised ? format(new Date(wo.date_raised), "dd/MM/yyyy") : "____/____/________"}
                </span>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Priority</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {priorityOptions.map((p) => (
                    <label key={p} className="flex items-center gap-1 cursor-pointer" onClick={() => {
                      setForm({ ...form, priority: p });
                      if (wo) saveField("priority", p);
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
                      if (wo) saveField("work_type", t);
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
            {/* Row 2: Asset Number, Requested By, Equipment Description */}
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
                <span className="text-xs text-gray-500 block mb-1">Requested By</span>
                <Input
                  className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                  value={form.requested_by}
                  onChange={(e) => setForm({ ...form, requested_by: e.target.value })}
                  onBlur={(e) => handleFieldBlur("requested_by", e.target.value)}
                  placeholder="Enter name"
                />
              </div>
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
            </div>
            {/* Row 3: Resources Required */}
            <div className="border border-gray-300">
              <div className="bg-gray-100 px-2 py-1.5 border-b border-gray-300 flex items-center justify-between">
                <span className="font-semibold text-xs text-gray-700">RESOURCES REQUIRED</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 print:hidden"
                  onClick={() => {
                    const arr = (() => { try { return JSON.parse(form.resources_required || "[]"); } catch { return []; } })();
                    arr.push({ trade: "", qty: "" });
                    const json = JSON.stringify(arr);
                    setForm((prev) => ({ ...prev, resources_required: json }));
                    if (wo) saveField("resources_required", json);
                  }}
                  title="Add resource"
                >
                  <span className="text-lg leading-none">+</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-0">
                {(() => {
                  const parsed: { trade: string; qty: string }[] = (() => { try { return JSON.parse(form.resources_required || "[]"); } catch { return []; } })();
                  if (parsed.length === 0) return <div className="p-2 text-xs text-gray-400 italic">Click + to add resources</div>;
                  return parsed.map((row, idx) => {
                    const updateRow = (field: string, value: string) => {
                      const arr: { trade: string; qty: string }[] = (() => { try { return JSON.parse(form.resources_required || "[]"); } catch { return []; } })();
                      arr[idx] = { ...arr[idx], [field]: value };
                      const json = JSON.stringify(arr);
                      setForm((prev) => ({ ...prev, resources_required: json }));
                      if (wo) saveField("resources_required", json);
                    };
                    const removeRow = () => {
                      const arr: { trade: string; qty: string }[] = (() => { try { return JSON.parse(form.resources_required || "[]"); } catch { return []; } })();
                      arr.splice(idx, 1);
                      const json = JSON.stringify(arr);
                      setForm((prev) => ({ ...prev, resources_required: json }));
                      if (wo) saveField("resources_required", json);
                    };
                    return (
                      <div key={idx} className="flex items-center gap-1 p-1.5 border-r border-b border-gray-300">
                        <select
                          className="h-7 text-xs bg-white border border-dashed border-gray-300 rounded px-1 print:border-none print:appearance-none cursor-pointer"
                          value={row.trade}
                          onChange={(e) => updateRow("trade", e.target.value)}
                        >
                          <option value="">Trade…</option>
                          <option value="MECH">MECH</option>
                          <option value="ELEC">ELEC</option>
                          <option value="SHUT">SHUT</option>
                          <option value="PROJ">PROJ</option>
                          <option value="OPS">OPS</option>
                        </select>
                        <span className="text-xs text-gray-400">×</span>
                        <Input
                          className="h-7 w-10 text-xs text-center border-dashed print:border-none print:p-0 print:h-auto"
                          value={row.qty}
                          onChange={(e) => updateRow("qty", e.target.value)}
                          placeholder="#"
                          maxLength={2}
                        />
                        <button
                          className="h-5 w-5 text-gray-400 hover:text-red-500 text-xs print:hidden"
                          onClick={removeRow}
                          title="Remove"
                        >✕</button>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Work Order Description */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
              <span className="font-semibold text-gray-700">WORK ORDER DESCRIPTION</span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-7 print:hidden"
                onClick={handleEnhanceDescription}
                disabled={isEnhancing || !form.problem_description.trim()}
              >
                {isEnhancing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isEnhancing ? "Enhancing…" : "Generate Description & Steps"}
              </Button>
            </div>
            <div className="p-3">
              <Textarea
                className="min-h-[100px] text-xs border-dashed print:border-none print:p-0 print:min-h-0 resize-none overflow-hidden"
                style={{ height: 'auto' }}
                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                value={form.problem_description}
                onChange={(e) => { setForm({ ...form, problem_description: e.target.value }); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                onBlur={(e) => handleFieldBlur("problem_description", e.target.value)}
                placeholder="Describe the work required, fault details, and actions taken..."
              />
            </div>
          </div>

          {/* Parts Used - linked to work_order_parts */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
              <span className="font-semibold text-gray-700">PARTS / MATERIALS USED</span>
              <div className="flex gap-2 print:hidden">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs h-7"
                  onClick={handleGenerateParts}
                  disabled={!wo || isGeneratingParts || !form.problem_description.trim()}
                >
                  {isGeneratingParts ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                  {isGeneratingParts ? "Generating…" : "Generate with AI"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs h-7"
                  onClick={() => setSpareLookupOpen(true)}
                  disabled={!wo}
                >
                  <Search className="h-3 w-3" /> Search & Add Part
                </Button>
              </div>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="text-left p-2 border-r border-gray-300">Part Number</th>
                  <th className="text-left p-2 border-r border-gray-300">Description</th>
                  <th className="text-center p-2 border-r border-gray-300 w-16">Qty</th>
                  <th className="text-left p-2 border-r border-gray-300 w-24">Store Location</th>
                  <th className="text-center p-2 w-10 print:hidden"></th>
                </tr>
              </thead>
              <tbody>
                {parts.length > 0 ? (
                  <>
                    {parts.map((part) => (
                      <tr key={part.id} className="border-b border-gray-300">
                        <td className="p-2 border-r border-gray-300 h-8 font-mono">{part.part_number || ""}</td>
                        <td className="p-2 border-r border-gray-300">{part.part_description || ""}</td>
                        <td className="p-2 border-r border-gray-300 text-center">{part.quantity_required || ""}</td>
                        <td className="p-2 border-r border-gray-300">{part.location || ""}</td>
                        <td className="p-1 text-center print:hidden">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deletePart.mutate(part.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - parts.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-gray-300">
                        <td className="p-2 border-r border-gray-300 h-8"></td>
                        <td className="p-2 border-r border-gray-300"></td>
                        <td className="p-2 border-r border-gray-300 text-center"></td>
                        <td className="p-2 border-r border-gray-300"></td>
                        <td className="p-1 print:hidden"></td>
                      </tr>
                    ))}
                  </>
                ) : (
                  [1, 2, 3, 4].map((row) => (
                    <tr key={row} className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300 h-8"></td>
                      <td className="p-2 border-r border-gray-300"></td>
                      <td className="p-2 border-r border-gray-300 text-center"></td>
                      <td className="p-2 border-r border-gray-300"></td>
                      <td className="p-1 print:hidden"></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Spare Part Lookup Dialog */}
          <SparePartLookupDialog
            open={spareLookupOpen}
            onOpenChange={setSpareLookupOpen}
            onSelect={(spare) => {
              if (wo) {
                addPart.mutate({
                  work_order_id: wo.id,
                  part_number: spare.part_number || "",
                  part_description: spare.description || "",
                  quantity_required: 1,
                  status: "Not Ordered",
                  location: spare.bin_location || "",
                  comment: "",
                  last_updated_by: "System",
                });
              }
            }}
          />

          {/* Asset Lookup Dialog */}
          <AssetLookupDialog
            open={assetLookupOpen}
            onOpenChange={setAssetLookupOpen}
            onSelect={(asset) => {
              const updatedForm = {
                ...form,
                asset_id: asset.assetNumber,
                functional_location: asset.name,
              };
              setForm(updatedForm);
              if (wo) {
                saveField("asset_id", asset.assetNumber);
                saveField("functional_location", asset.name);
              }
            }}
          />

          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">LABOUR HOURS</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="text-left p-2 border-r border-gray-300">Technician Name</th>
                  <th className="text-center p-2 border-r border-gray-300 w-24">Work Centre</th>
                  <th className="text-center p-2 border-r border-gray-300 w-24">Date</th>
                  <th className="text-center p-2 border-r border-gray-300 w-20">Start Time</th>
                  <th className="text-center p-2 border-r border-gray-300 w-20">End Time</th>
                  <th className="text-center p-2 w-20">Total Hrs</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="border-b border-gray-300">
                    <td className="p-1 border-r border-gray-300">
                      <Input className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto" placeholder="" />
                    </td>
                    <td className="p-1 border-r border-gray-300 text-center">
                      <select className="w-full h-7 text-xs bg-transparent border border-dashed border-gray-300 rounded px-1 print:border-none print:appearance-none cursor-pointer">
                        <option value="">—</option>
                        <option value="MECH">MECH</option>
                        <option value="ELEC">ELEC</option>
                        <option value="SHUT">SHUT</option>
                        <option value="PROJ">PROJ</option>
                      </select>
                    </td>
                    <td className="p-1 border-r border-gray-300 text-center">
                      <Input type="date" className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto" />
                    </td>
                    <td className="p-1 border-r border-gray-300 text-center">
                      <Input type="time" className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto" />
                    </td>
                    <td className="p-1 border-r border-gray-300 text-center">
                      <Input type="time" className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto" />
                    </td>
                    <td className="p-1 text-center">
                      <Input className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto text-center" placeholder="" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Completion & Sign-off */}
          <div className="border border-gray-300">
            <div className="bg-green-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-green-800">✓ COMPLETION & SIGN-OFF</span>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Work Status:</p>
                  <div className="flex gap-4">
                    {["Complete", "Partial - Follow-up Required", "Awaiting Parts"].map((s) => (
                      <label key={s} className="flex items-center gap-1 cursor-pointer" onClick={() => {
                        setForm({ ...form, status: s });
                        if (wo) saveField("status", s);
                      }}>
                        <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center text-[10px] ${form.status === s ? "bg-primary text-primary-foreground" : ""}`}>
                          {form.status === s && "✓"}
                        </div>
                        <span className="text-xs">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Equipment Returned to Service:</p>
                  <div className="flex gap-4">
                    {["Yes", "No"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1 cursor-pointer" onClick={() => {
                        setForm((prev) => ({ ...prev, returned_to_service: opt }));
                        if (wo) saveField("returned_to_service", opt);
                      }}>
                        <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center text-[10px] ${form.returned_to_service === opt ? "bg-primary text-primary-foreground" : ""}`}>
                          {form.returned_to_service === opt && "✓"}
                        </div>
                        <span className="text-xs">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-1">Technician Name</span>
                  <Input className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto mb-2" placeholder="Enter name"
                    value={form.technician_name}
                    onChange={(e) => setForm({ ...form, technician_name: e.target.value })}
                    onBlur={(e) => handleFieldBlur("technician_name", e.target.value)}
                  />
                  <span className="text-xs text-gray-500 block mb-1">Signature</span>
                  <div className="h-8 border border-dashed border-gray-300 rounded mb-2"></div>
                  <span className="text-xs text-gray-500 block mb-1">Date</span>
                  <Input type="date" className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                    value={form.technician_sign_date}
                    onChange={(e) => setForm({ ...form, technician_sign_date: e.target.value })}
                    onBlur={(e) => handleFieldBlur("technician_sign_date", e.target.value)}
                  />
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-1">Supervisor Name</span>
                  <Input className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto mb-2" placeholder="Enter name"
                    value={form.supervisor_name}
                    onChange={(e) => setForm({ ...form, supervisor_name: e.target.value })}
                    onBlur={(e) => handleFieldBlur("supervisor_name", e.target.value)}
                  />
                  <span className="text-xs text-gray-500 block mb-1">Signature</span>
                  <div className="h-8 border border-dashed border-gray-300 rounded mb-2"></div>
                  <span className="text-xs text-gray-500 block mb-1">Date</span>
                  <Input type="date" className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                    value={form.supervisor_sign_date}
                    onChange={(e) => setForm({ ...form, supervisor_sign_date: e.target.value })}
                    onBlur={(e) => handleFieldBlur("supervisor_sign_date", e.target.value)}
                  />
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-1">Operations Handover To</span>
                  <Input className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto mb-2" placeholder="Enter name"
                    value={form.operations_handover_name}
                    onChange={(e) => setForm({ ...form, operations_handover_name: e.target.value })}
                    onBlur={(e) => handleFieldBlur("operations_handover_name", e.target.value)}
                  />
                  <span className="text-xs text-gray-500 block mb-1">Signature</span>
                  <div className="h-8 border border-dashed border-gray-300 rounded mb-2"></div>
                  <span className="text-xs text-gray-500 block mb-1">Date</span>
                  <Input type="date" className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                    value={form.operations_handover_date}
                    onChange={(e) => setForm({ ...form, operations_handover_date: e.target.value })}
                    onBlur={(e) => handleFieldBlur("operations_handover_date", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Performed */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">FOLLOW-UP ACTIONS / RECOMMENDATIONS</span>
            </div>
            <div className="p-3">
              <Textarea
                className="min-h-[60px] text-xs border-dashed print:border-none print:p-0 print:min-h-0 resize-none"
                value={form.work_performed}
                onChange={(e) => setForm({ ...form, work_performed: e.target.value })}
                onBlur={(e) => handleFieldBlur("work_performed", e.target.value)}
                placeholder="List any additional work required, observations, or recommendations..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
            <p>TCMG-WO-MECH-001 | Rev 1.0 | Tennant Creek Gold Mine</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs for parts management - hidden on print */}
      <WOSubTabs woNumber={woNumber} />
    </div>
  );
};
