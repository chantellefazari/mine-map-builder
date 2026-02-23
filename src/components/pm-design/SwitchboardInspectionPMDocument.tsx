import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

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
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Switchboard Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Switchboard Inspection" subtitle="Electrical 52 Week Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Inspection"
          frequency="52 Week"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

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
