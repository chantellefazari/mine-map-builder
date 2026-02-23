import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
    { id: "1", description: "Inspect machine structure, boom, stick, bucket, and attachments for damage or cracks" },
    { id: "2", description: "Inspect guards, panels, and covers for proper attachment" },
    { id: "3", description: "Check for loose or missing bolts, nuts, or pins" },
    { id: "4", description: "Inspect handrails, steps, and safety decals for condition" },
    { id: "5", description: "Ensure warning labels and signage are intact" },
  ]},
  { sectionName: "Fluids & Levels", items: [
    { id: "6", description: "Engine oil level" }, { id: "7", description: "Coolant level" },
    { id: "8", description: "Fuel level" }, { id: "9", description: "Battery electrolyte level (if applicable)" },
    { id: "10", description: "DEF / AdBlue level (if SCR equipped)" }, { id: "11", description: "Transmission or swing drive oil levels" },
  ]},
  { sectionName: "Engine Compartment", items: [
    { id: "12", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "13", description: "Check belts for wear and tension" },
    { id: "14", description: "Check air filter restriction indicator" }, { id: "15", description: "Change/Clean air filter elements as needed" },
    { id: "16", description: "Inspect air intake hoses and clamps" }, { id: "17", description: "Check radiator/cooler areas for dust buildup" },
    { id: "18", description: "Check turbo and exhaust system for cracks, soot leaks, or loose fittings" },
  ]},
  { sectionName: "Electrical System", items: [
    { id: "19", description: "Battery terminals clean and secure" }, { id: "20", description: "Battery isolator functional and in correct position" },
    { id: "21", description: "Lights and indicators operational" }, { id: "22", description: "Control panel functioning correctly" },
    { id: "23", description: "Wiring secure, no exposed or damaged cables" }, { id: "24", description: "Test warning lights and alarms" },
  ]},
  { sectionName: "Hydraulic System", items: [
    { id: "25", description: "Check hydraulic oil level" }, { id: "26", description: "Inspect hydraulic hoses and fittings for leaks or damage" },
    { id: "27", description: "Check hydraulic cylinders for leaks or scoring" }, { id: "28", description: "Test all hydraulic functions for smooth operation" },
    { id: "29", description: "Inspect hydraulic tank breather/cap" },
  ]},
  { sectionName: "Undercarriage & Tracks", items: [
    { id: "30", description: "Inspect track tension and adjustment" }, { id: "31", description: "Check track pads for wear or damage" },
    { id: "32", description: "Inspect idlers, rollers, and sprockets for wear" }, { id: "33", description: "Check for loose or missing track bolts" },
    { id: "34", description: "Inspect final drive for leaks" },
  ]},
  { sectionName: "Operator Cab / Safety", items: [
    { id: "35", description: "Seat, seatbelt, and controls functioning properly" }, { id: "36", description: "Fire extinguisher present and charged" },
    { id: "37", description: "Horn, backup alarm, and mirrors operational" }, { id: "38", description: "Windows and doors operate correctly" },
    { id: "39", description: "HVAC system functioning" }, { id: "40", description: "Cab interior clean and free of debris" },
  ]},
  { sectionName: "Operational Checks", items: [
    { id: "41", description: "Engine starts smoothly with no unusual noise" },
    { id: "42", description: "Monitor gauges: oil pressure, coolant temperature, hydraulic pressure" },
    { id: "43", description: "Observe for unusual noises, vibrations, or smoke" },
    { id: "44", description: "Test swing function and brakes" }, { id: "45", description: "Test travel functions - forward and reverse" },
    { id: "46", description: "Shutdown normal with no alarms" },
  ]},
  { sectionName: "Auto-Greaser (if equipped)", items: [
    { id: "47", description: "Verify grease levels and automatic greasing system functioning" },
    { id: "48", description: "Check all grease points for lubrication" },
    { id: "49", description: "Inspect grease lines for damage or blockage" },
  ]},
];

export const ExcavatorWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Excavator Weekly Mechanical Inspection");

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Excavator Weekly Mechanical Inspection" />
        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Mobile Equipment"
          pmGroup="Mechanical"
          pmType="Inspection"
          frequency="Weekly"
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
                      <td className="border border-border px-2 py-2"><Input className="h-7 text-xs border-0 bg-transparent" placeholder="" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Mobile Equipment Weekly Inspection Form" />
      </div>
    </div>
  );
};
