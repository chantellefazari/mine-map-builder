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
    { id: "1", description: "Check for any visible damage to generator housing" },
    { id: "2", description: "Check for oil, fuel, or coolant leaks under the generator" },
    { id: "3", description: "Ensure all warning labels and signage are intact" },
    { id: "4", description: "Check mounting frame or skid for rust or structural damage" },
    { id: "5", description: "Inspect vibration isolators for cracks or wear" },
  ]},
  { sectionName: "Fluids & Levels", items: [
    { id: "6", description: "Engine oil level" }, { id: "7", description: "Coolant level" },
    { id: "8", description: "Fuel level" }, { id: "9", description: "Battery electrolyte level (if applicable)" },
    { id: "10", description: "Radiator overflow bottle level" },
  ]},
  { sectionName: "Engine", items: [
    { id: "11", description: "Inspect for oil, coolant, or fuel leaks" }, { id: "12", description: "Check belts for wear and tension" },
    { id: "13", description: "Inspect engine mounts" }, { id: "14", description: "Inspect air intake hoses and clamps" },
    { id: "15", description: "Check radiator/cooler areas for dust buildup" },
    { id: "16", description: "Check exhaust system for cracks, soot leaks, or loose fittings" },
    { id: "17", description: "Check turbocharger (if equipped) for loose connections or oil leaks" },
    { id: "18", description: "Replace Air Filter" },
  ]},
  { sectionName: "Cooling System", items: [
    { id: "19", description: "Radiator clean and free of debris" }, { id: "20", description: "Radiator fins intact, not bent or blocked" },
    { id: "21", description: "Hoses, clamps, and connections checked for wear or leaks" },
    { id: "22", description: "Fan operation smooth" }, { id: "23", description: "Check for corrosion in cooling system" },
  ]},
  { sectionName: "Fuel System", items: [
    { id: "24", description: "Fuel tank, lines, and filters inspected for leaks or damage" },
    { id: "25", description: "Drain water separators (if fitted)" },
    { id: "26", description: "Inspect fuel injection pump and connections" },
    { id: "27", description: "Verify fuel cap seal integrity" },
  ]},
  { sectionName: "Lubrication System", items: [
    { id: "28", description: "Inspect oil filters" }, { id: "29", description: "Inspect oil cooler and lines for leaks" },
    { id: "30", description: "Check for correct oil pressure during operation" },
  ]},
  { sectionName: "Electrical System", items: [
    { id: "31", description: "Battery terminals clean and secure" }, { id: "32", description: "Check battery charge and condition" },
    { id: "33", description: "Inspect starter and alternator connections" },
    { id: "34", description: "Inspect terminal connections and insulation" },
  ]},
  { sectionName: "Exhaust System", items: [
    { id: "35", description: "Inspect exhaust piping and muffler for leaks" },
    { id: "36", description: "Check mounting brackets and supports" },
    { id: "37", description: "Inspect for excessive soot buildup" },
  ]},
  { sectionName: "Safety Equipment", items: [
    { id: "38", description: "Battery Isolator Installed and Lockable" },
    { id: "39", description: "Fire extinguisher present and charged" },
    { id: "40", description: "Spill kit available" }, { id: "41", description: "Grounding connections secure" },
    { id: "42", description: "Check for loose panels, covers, and guards" },
  ]},
  { sectionName: "Operational Checks", items: [
    { id: "43", description: "Start generator and verify smooth operation" },
    { id: "44", description: "Observe for unusual noises or vibrations" },
    { id: "45", description: "Monitor gauges: oil pressure, coolant temperature, voltage, frequency" },
    { id: "46", description: "Shutdown and verify no alarms or leaks" },
  ]},
];

export const PowerStationGeneratorWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Power Station Generator Weekly Inspection");

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Weekly Power Station Generator Inspection" />
        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Power Station"
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

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Power Station Generator Weekly Inspection Form" />
      </div>
    </div>
  );
};
