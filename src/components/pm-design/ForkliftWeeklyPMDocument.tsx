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
  { sectionName: "Safety", items: [
    { id: "1", description: "Load rating plate legible" }, { id: "2", description: "Fire extinguisher charged and accessible" },
    { id: "3", description: "ROPS/FOPS structure undamaged" }, { id: "4", description: "Seatbelt functioning" },
    { id: "5", description: "Flashing beacon / rotating amber light working" }, { id: "6", description: "Emergency stop switch operational" },
  ]},
  { sectionName: "Hydraulics", items: [
    { id: "7", description: "Hydraulic oil level" }, { id: "8", description: "Lift/tilt/side-shift functions smooth" },
    { id: "9", description: "Hydraulic hoses not leaking or frayed" }, { id: "10", description: "Lift cylinders not leaking" },
    { id: "11", description: "Steering hydraulics functioning normally" },
  ]},
  { sectionName: "Engine Compartment", items: [
    { id: "12", description: "Engine oil level" }, { id: "13", description: "Coolant level & condition" },
    { id: "14", description: "Radiator clean, no debris" }, { id: "15", description: "Belts condition & tension" },
    { id: "16", description: "Fuel filter / water separator" }, { id: "17", description: "Air filter primary & secondary" },
    { id: "18", description: "No oil, fuel, or coolant leaks" },
  ]},
  { sectionName: "Electrical System", items: [
    { id: "19", description: "Lights (work lights, beacon) operating" }, { id: "20", description: "Battery charger/maintainer operating" },
    { id: "21", description: "Control panel displays working" }, { id: "22", description: "Battery terminals secure and clean" },
    { id: "23", description: "Wiring secure, no exposed or damaged cables" },
  ]},
  { sectionName: "Transmission and Driveline", items: [
    { id: "24", description: "Transmission oil level" }, { id: "25", description: "Gear shifting smooth" },
    { id: "26", description: "Reverse alarm operational" }, { id: "27", description: "Gauges & displays working" },
    { id: "28", description: "Battery isolator switch functional" }, { id: "29", description: "Starter isolator functional" },
    { id: "30", description: "All lubrication points serviced" },
  ]},
  { sectionName: "Mast, Carriage and Forks", items: [
    { id: "31", description: "Mast rails straight" }, { id: "32", description: "Mast rollers condition (not seized)" },
    { id: "33", description: "Chains lubricated, equal tension, no cracks" }, { id: "34", description: "Carriage slides smoothly" },
    { id: "35", description: "Forks straight, not bent" }, { id: "36", description: "Locking pins engaged" },
    { id: "37", description: "Fork wear within limits" }, { id: "38", description: "Tilt function smooth" },
  ]},
  { sectionName: "Cab", items: [
    { id: "39", description: "Cab cleanliness" }, { id: "40", description: "Mirrors clean and adjusted" },
    { id: "41", description: "Horn functioning" }, { id: "42", description: "Seat condition and adjustment" },
  ]},
];

export const ForkliftWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Weekly Forklift Mechanical Inspection");

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Weekly Forklift Mechanical Inspection" />
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

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Mobile Equipment Inspection Form" />
      </div>
    </div>
  );
};
