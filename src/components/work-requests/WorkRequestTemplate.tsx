import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Search, Sparkles, Loader2, SendHorizontal } from "lucide-react";
import tennantIcon from "@/assets/tennant-icon.png";
import { WRSubTabs } from "./WRSubTabs";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { AssetLookupDialog } from "@/components/work-orders/AssetLookupDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WorkRequestTemplateProps {
  woNumber?: string;
}

export const WorkRequestTemplate = ({ woNumber }: WorkRequestTemplateProps) => {
  const { workOrders, update } = useWorkOrders();
  const wo = workOrders.find((w) => w.wo_number === woNumber);
  const [assetLookupOpen, setAssetLookupOpen] = useState(false);
  const [isEnhancingDesc, setIsEnhancingDesc] = useState(false);
  const [isEnhancingScope, setIsEnhancingScope] = useState(false);

  const [form, setForm] = useState({
    asset_id: "",
    functional_location: "",
    problem_description: "",
    scope_of_works: "",
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
  });

  useEffect(() => {
    if (wo) {
      setForm({
        asset_id: wo.asset_id || "",
        functional_location: wo.functional_location || "",
        problem_description: wo.problem_description || "",
        scope_of_works: (wo as any).scope_of_works || "",
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
      });
    }
  }, [wo?.id]);

  const saveField = useCallback(
    async (field: string, value: string) => {
      if (!wo) return;
      const { error } = await (supabase as any)
        .from("work_orders")
        .update({ [field]: value })
        .eq("id", wo.id);
      if (error) {
        toast.error(`Save failed: ${error.message}`);
        return;
      }
      update.mutate({ id: wo.id, updates: {} }, { onSettled: () => {} });
    },
    [wo, update]
  );

  const handleFieldBlur = (field: string, value: string) => {
    if (wo && value !== (wo as any)[field]) {
      saveField(field, value);
    }
  };

  const handlePrint = () => window.print();

  const handleEnhanceField = async (field: "problem_description" | "scope_of_works", mode: "description" | "scope") => {
    const value = form[field].trim();
    if (!value) { toast.error("Write some rough notes first"); return; }
    const setLoading = mode === "description" ? setIsEnhancingDesc : setIsEnhancingScope;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-wo-description", {
        body: { description: value, mode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setForm((prev) => ({ ...prev, [field]: data.enhanced }));
      if (wo) saveField(field, data.enhanced);
      toast.success(mode === "description" ? "Description enhanced" : "Scope of works generated");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = ["Critical", "High", "Normal", "Low"];
  const workTypeOptions = ["Breakdown", "Planned", "Shutdown"];

  return (
    <div className="space-y-4">
      {/* Header with Print Button */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-xl font-semibold text-foreground">
          Work Request {woNumber && <span className="text-primary font-mono">({woNumber})</span>}
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
                <span className="font-mono font-medium">{woNumber || "WR-______"}</span>
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
          </div>

          {/* Description */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
              <span className="font-semibold text-gray-700">DESCRIPTION</span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-7 print:hidden"
                onClick={() => handleEnhanceField("problem_description", "description")}
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

          {/* Scope of Works */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
              <span className="font-semibold text-gray-700">SCOPE OF WORKS</span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-7 print:hidden"
                onClick={() => handleEnhanceField("scope_of_works", "scope")}
                disabled={isEnhancingScope || !form.scope_of_works.trim()}
              >
                {isEnhancingScope ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isEnhancingScope ? "Generating…" : "Generate with AI"}
              </Button>
            </div>
            <div className="p-3">
              <Textarea
                className="min-h-[60px] text-xs border-dashed print:border-none print:p-0 print:min-h-0 resize-none overflow-hidden"
                style={{ height: 'auto' }}
                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                value={form.scope_of_works}
                onChange={(e) => { setForm({ ...form, scope_of_works: e.target.value }); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                onBlur={(e) => handleFieldBlur("scope_of_works", e.target.value)}
                placeholder="List the steps / method to carry out the work..."
              />
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
          if (wo) {
            saveField("asset_id", asset.assetNumber);
            saveField("functional_location", asset.name);
          }
        }}
      />

      {/* Sub-tabs for WR management */}
      <WRSubTabs woNumber={woNumber} />
    </div>
  );
};
