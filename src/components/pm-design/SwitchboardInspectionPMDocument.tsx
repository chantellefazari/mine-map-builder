import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

const inspectionChecks = [
  { id: 1, task: "General Condition" },
  { id: 2, task: "Hot Joints (Burning/Discolouration)" },
  { id: 3, task: "Busbar Loading" },
  { id: 4, task: "Thermoscan (If applicable)" },
  { id: 5, task: "Creepage and Clearance distances maintained (Minimum 31mm, AS 3007.2)" },
  { id: 6, task: "Cable Entries Watertight, Secure and Fixed in Position" },
  { id: 7, task: "Live Parts Adequately Enclosed / Insulated and Marked \"Isolate Elsewhere\"" },
  { id: 8, task: "Switch Board Mounting and Mechanical Protection" },
  { id: 9, task: "Check Switchboard number and name labelling" },
  { id: 10, task: "Legend and circuit identification" },
  { id: 11, task: "Switchboard isolation label" },
  { id: 12, task: "Circuit breaker lockouts available" },
  { id: 13, task: "Fuse/Circuit Breaker sizes are correct and correctly marked" },
  { id: 14, task: "Where is This DB Fed From" },
  { id: 15, task: "Overall Cleanliness" },
];

export const SwitchboardInspectionPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Switchboard Inspection" subtitle="Electrical 52 Week Inspection" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tennant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div><div className="px-2 py-1.5"></div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Electrical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">52 Week</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            SWITCHBOARD INSPECTION
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
                <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {inspectionChecks.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2">{item.task}</td>
                  <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
                  <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
                  <td className="border border-border px-2 py-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Switchboard Inspection Form" />
      </div>
    </div>
  );
};
