import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

const inspectionTasks = [
  { id: 1, task: "Check the Heater is Connected and Operational" },
  { id: 2, task: "Rotate Motor 4x Times" },
];

export const SpareMillMotorInspectionPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Spare Mill Motor Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Spare Mill Motor Inspection" subtitle="Electrical Weekly Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Inspection"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTION TASKS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
            <tbody>
              {inspectionTasks.map((item) => (
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

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Spare Mill Motor Inspection Form" />
      </div>
    </div>
  );
};
