import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { MobileEquipmentHeader } from "./MobileEquipmentHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

interface InspectionItem { id: string; description: string; }
interface InspectionSection { sectionName: string; items: InspectionItem[]; }

const inspectionData: InspectionSection[] = [
  { sectionName: "Walk Around Inspection", items: [
    { id: "1", description: "Check for visible damage to frame, mast, or trailer" },
    { id: "2", description: "Check for loose panels, covers, or safety guards" },
    { id: "3", description: "Ensure lights and reflectors are clean and undamaged" },
    { id: "4", description: "Ensure all safety decals are clean and readable" },
    { id: "5", description: "Ensure ground clearance is adequate and stabilizers are in position" },
  ]},
  { sectionName: "Fluids & Levels", items: [
    { id: "6", description: "Engine oil level" },
    { id: "7", description: "Coolant level" },
    { id: "8", description: "Hydraulic oil level" },
    { id: "9", description: "Fuel level" },
    { id: "10", description: "Battery electrolyte level (if applicable)" },
  ]},
  { sectionName: "Engine Compartment", items: [
    { id: "11", description: "Inspect for oil, coolant, or fuel leaks" },
    { id: "12", description: "Check belts for wear and tension" },
    { id: "13", description: "Check air filter restriction indicator" },
    { id: "14", description: "Inspect air intake hoses and clamps" },
    { id: "15", description: "Check radiator/cooler areas for dust buildup" },
    { id: "16", description: "Inspect radiator and cooler fins for blockage or damage" },
  ]},
  { sectionName: "Safety Equipment", items: [
    { id: "17", description: "Fire extinguisher present and charged" },
    { id: "18", description: "Wheel chocks in place (if applicable)" },
    { id: "19", description: "Emergency stop button functional" },
  ]},
  { sectionName: "Electrical / Lighting System", items: [
    { id: "20", description: "Battery terminals clean and secure" },
    { id: "21", description: "Warning lights and gauges normal" },
    { id: "22", description: "All tower lights operational" },
    { id: "23", description: "Wiring secured with no visible damage" },
  ]},
  { sectionName: "Operational Checks", items: [
    { id: "24", description: "Engine starts smoothly with no unusual noise" },
    { id: "25", description: "Lights operate at full brightness" },
    { id: "26", description: "Shutdown normal with no alarms" },
    { id: "27", description: "No unusual noises during mast operation" },
  ]},
];

export const LightingTowerDailyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Diesel Lighting Tower Daily Mechanical Inspection");

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Diesel Lighting Tower Daily Mechanical Inspection" />
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
