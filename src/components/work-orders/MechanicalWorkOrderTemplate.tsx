import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Save } from "lucide-react";
import tennantIcon from "@/assets/tennant-icon.png";
import { WOSubTabs } from "./WOSubTabs";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import { format } from "date-fns";
import { toast } from "sonner";

interface MechanicalWorkOrderTemplateProps {
  woNumber?: string;
}

export const MechanicalWorkOrderTemplate = ({ woNumber }: MechanicalWorkOrderTemplateProps) => {
  const { workOrders, update } = useWorkOrders();
  const wo = workOrders.find((w) => w.wo_number === woNumber);
  const { parts } = useWorkOrderParts(wo?.id);

  // Local form state seeded from DB
  const [form, setForm] = useState({
    asset_id: "",
    functional_location: "",
    problem_description: "",
    work_performed: "",
    priority: "Normal",
    work_type: "Reactive",
    requested_by: "",
    assigned_to: "",
    trade: "",
    status: "Open",
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
        work_type: wo.work_type || "Reactive",
        requested_by: wo.requested_by || "",
        assigned_to: wo.assigned_to || "",
        trade: wo.trade || "",
        status: wo.status || "Open",
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

  const priorityOptions = ["Critical", "High", "Normal", "Low"];
  const workTypeOptions = ["Reactive", "Planned", "Shutdown"];

  return (
    <div className="space-y-4">
      {/* Header with Print Button */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-xl font-semibold text-foreground">
          Work Order {woNumber && <span className="text-primary font-mono">({woNumber})</span>}
        </h2>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
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
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-1">Asset Number</span>
                  <Input
                    className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                    value={form.asset_id}
                    onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
                    onBlur={(e) => handleFieldBlur("asset_id", e.target.value)}
                    placeholder="Enter asset number"
                  />
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block">Revision</span>
                  <span className="font-mono font-medium">A</span>
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Equipment Description / Functional Location</span>
                <Input
                  className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                  value={form.functional_location}
                  onChange={(e) => setForm({ ...form, functional_location: e.target.value })}
                  onBlur={(e) => handleFieldBlur("functional_location", e.target.value)}
                  placeholder="Enter location"
                />
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Trade</span>
                <Input
                  className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                  value={form.trade}
                  onChange={(e) => setForm({ ...form, trade: e.target.value })}
                  onBlur={(e) => handleFieldBlur("trade", e.target.value)}
                  placeholder="e.g. MECH, ELEC"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-1">Priority</span>
                  {/* Interactive radio buttons - clickable on screen, visual checkboxes on print */}
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
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block mb-1">Assigned To</span>
                <Input
                  className="h-7 text-xs border-dashed print:border-none print:p-0 print:h-auto"
                  value={form.assigned_to}
                  onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                  onBlur={(e) => handleFieldBlur("assigned_to", e.target.value)}
                  placeholder="Enter name"
                />
              </div>
            </div>
          </div>

          {/* Work Order Description */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">WORK ORDER DESCRIPTION</span>
            </div>
            <div className="p-3">
              <Textarea
                className="min-h-[100px] text-xs border-dashed print:border-none print:p-0 print:min-h-0 resize-none"
                value={form.problem_description}
                onChange={(e) => setForm({ ...form, problem_description: e.target.value })}
                onBlur={(e) => handleFieldBlur("problem_description", e.target.value)}
                placeholder="Describe the work required, fault details, and actions taken..."
              />
            </div>
          </div>

          {/* Parts Used - auto-populated from Parts & Availability tab */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">PARTS / MATERIALS USED</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="text-left p-2 border-r border-gray-300">Part Number</th>
                  <th className="text-left p-2 border-r border-gray-300">Description</th>
                  <th className="text-center p-2 border-r border-gray-300 w-16">Qty</th>
                  <th className="text-left p-2 w-24">Store Location</th>
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
                        <td className="p-2">{part.location || ""}</td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - parts.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-gray-300">
                        <td className="p-2 border-r border-gray-300 h-8"></td>
                        <td className="p-2 border-r border-gray-300"></td>
                        <td className="p-2 border-r border-gray-300 text-center"></td>
                        <td className="p-2"></td>
                      </tr>
                    ))}
                  </>
                ) : (
                  [1, 2, 3, 4].map((row) => (
                    <tr key={row} className="border-b border-gray-300">
                      <td className="p-2 border-r border-gray-300 h-8"></td>
                      <td className="p-2 border-r border-gray-300"></td>
                      <td className="p-2 border-r border-gray-300 text-center"></td>
                      <td className="p-2"></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Labour Hours */}
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
                {[1, 2, 3].map((row) => (
                  <tr key={row} className="border-b border-gray-300">
                    <td className="p-2 border-r border-gray-300 h-8"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 text-center"></td>
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
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Yes</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-4">Technician Signature</span>
                  <div className="border-t border-gray-300 pt-1 mt-4">
                    <span className="text-xs text-gray-500">Date: ____/____/________</span>
                  </div>
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-4">Supervisor Signature</span>
                  <div className="border-t border-gray-300 pt-1 mt-4">
                    <span className="text-xs text-gray-500">Date: ____/____/________</span>
                  </div>
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-4">Operations Handover</span>
                  <div className="border-t border-gray-300 pt-1 mt-4">
                    <span className="text-xs text-gray-500">Date: ____/____/________</span>
                  </div>
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
