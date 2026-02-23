import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { MobileEquipmentHeader } from "./MobileEquipmentHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionItem { id: string; description: string; }
interface InspectionSection { sectionName: string; items: InspectionItem[]; }

const inspectionData: InspectionSection[] = [
  { sectionName: "Walk Around Inspection", items: [
    { id: "1", description: "Inspect machine structure, boom, stick, bucket, and attachments for damage or cracks" },
    { id: "2", description: "Inspect guards, panels, and covers for proper attachment" },
    { id: "3", description: "Check for loose or missing bolts, nuts, or pins" },
    { id: "4", description: "Inspect handrails, steps, and safety decals for condition" },
    { id: "5", description: "Ensure warning labels and signage are intact" },
  ]},
  { sectionName: "Fluids & Levels", items: [
    { id: "6", description: "Engine oil level" },
    { id: "7", description: "Coolant level" },
    { id: "8", description: "Fuel level" },
    { id: "9", description: "Battery electrolyte level (if applicable)" },
    { id: "10", description: "DEF / AdBlue level (if SCR equipped)" },
    { id: "11", description: "Transmission or swing drive oil levels" },
  ]},
  { sectionName: "Operator Cab / Safety", items: [
    { id: "12", description: "Seat, seatbelt, and controls functioning properly" },
    { id: "13", description: "Fire extinguisher present and charged" },
    { id: "14", description: "Horn, backup alarm, and mirrors operational" },
    { id: "15", description: "Windows and doors operate correctly" },
  ]},
  { sectionName: "Operational Checks", items: [
    { id: "16", description: "Engine starts smoothly with no unusual noise" },
    { id: "17", description: "Monitor gauges: oil pressure, coolant temperature, hydraulic pressure" },
    { id: "18", description: "Observe for unusual noises, vibrations, or smoke" },
    { id: "19", description: "Shutdown normal with no alarms" },
  ]},
];

export const ExcavatorDailyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Excavator Daily Mechanical Inspection");
  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Excavator Daily Mechanical Inspection" />
        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Mobile Equipment"
          pmGroup="Mechanical"
          pmType="Inspection"
          frequency="Daily"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />
        <MobileEquipmentHeader />
        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          {inspectionData.map((section) => (
            <div key={section.sectionName}>
              <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-primary" />
                {section.sectionName}
              </div>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
                <tbody>
                  {section.items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="border border-border px-3 py-2">{item.description}</td>
                      <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" checked={itemStatus[item.id] === "pass"} onCheckedChange={() => setStatus(item.id, "pass")} /></div></td>
                      <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" checked={itemStatus[item.id] === "fail"} onCheckedChange={() => setStatus(item.id, "fail")} /></div></td>
                      <td className="border border-border px-2 py-4"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Mobile Equipment Inspection Form" />
      </div>
    </div>
  );
};
