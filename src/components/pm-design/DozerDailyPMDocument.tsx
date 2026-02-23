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
    { id: "1", description: "Check for visible damage to the dozer frame, blade, and ripper" },
    { id: "2", description: "Inspect guards, panels, and covers for proper attachment" },
    { id: "3", description: "Check for fluid leaks (oil, fuel, coolant, hydraulic)" },
    { id: "4", description: "Check for loose or missing bolts, nuts, or pins" },
    { id: "5", description: "Ensure steps, handrails, and safety decals are intact" },
  ]},
  { sectionName: "Fluids & Levels", items: [
    { id: "6", description: "Engine oil level" },
    { id: "7", description: "Coolant level" },
    { id: "8", description: "Fuel level" },
    { id: "9", description: "Hydraulic oil level" },
    { id: "10", description: "Transmission oil levels" },
    { id: "11", description: "Battery electrolyte level (if applicable)" },
  ]},
  { sectionName: "Engine Compartment", items: [
    { id: "12", description: "Inspect for oil, coolant, or fuel leaks" },
    { id: "13", description: "Check belts for wear and tension" },
    { id: "14", description: "Check air filter restriction indicator" },
    { id: "15", description: "Inspect air intake hoses and clamps" },
    { id: "16", description: "Check radiator/cooler areas for dust buildup" },
    { id: "17", description: "Check exhaust system for cracks, soot leaks, or loose fittings" },
  ]},
  { sectionName: "Electrical System", items: [
    { id: "18", description: "Battery terminals clean and secure" },
    { id: "19", description: "Battery isolator functional and in correct position" },
    { id: "20", description: "Control panel displays working" },
    { id: "21", description: "Battery terminals secure and clean" },
    { id: "22", description: "Wiring secure, no exposed or damaged cables" },
    { id: "23", description: "Lights and indicators operational" },
    { id: "24", description: "Warning indicators off" },
  ]},
  { sectionName: "Hydraulic System", items: [
    { id: "25", description: "Inspect hoses, fittings, and cylinders for leaks" },
    { id: "26", description: "Check blade, ripper, and lift cylinders for damage" },
    { id: "27", description: "Check hydraulic filter condition" },
  ]},
  { sectionName: "Blade & Attachments", items: [
    { id: "28", description: "Inspect blade for cracks, wear, or damage" },
    { id: "29", description: "Check mounting pins and bushings" },
    { id: "30", description: "Inspect ripper and teeth for wear or damage" },
    { id: "31", description: "Verify proper attachment function" },
  ]},
  { sectionName: "Operator Cab / Safety", items: [
    { id: "32", description: "Check seat, seatbelt, and controls for proper operation" },
    { id: "33", description: "Fire extinguisher present and charged" },
    { id: "34", description: "Horn, backup alarm, and mirrors functional" },
    { id: "35", description: "Windows and doors operate correctly" },
  ]},
  { sectionName: "Operational Checks", items: [
    { id: "36", description: "Engine starts smoothly with no unusual noise" },
    { id: "37", description: "Monitor gauges: oil pressure, coolant temp, hydraulic pressure" },
    { id: "38", description: "Test blade, ripper, and travel functions" },
    { id: "39", description: "Shutdown normal with no alarms" },
  ]},
];

export const DozerDailyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "CAT D8 Dozer Daily Mechanical Inspection");

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="CAT D8 Dozer Daily Mechanical Inspection" />
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
