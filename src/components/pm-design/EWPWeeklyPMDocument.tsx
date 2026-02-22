import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { MobileEquipmentHeader } from "./MobileEquipmentHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionItem { id: string; description: string; }
interface InspectionSection { sectionName: string; items: InspectionItem[]; }

const inspectionData: InspectionSection[] = [
  { sectionName: "Safety", items: [
    { id: "1", description: "Load chart / operating manual on machine" }, { id: "2", description: "Fire extinguisher charged & accessible" },
    { id: "3", description: "First-aid kit checked" }, { id: "4", description: "Compliance plates legible" },
    { id: "5", description: "Fall arrest anchor points condition" }, { id: "6", description: "Battery isolator functioning & labelled" },
    { id: "7", description: "Starter isolator functioning & labelled" }, { id: "8", description: "Flashing beacon / rotating amber light functioning" },
    { id: "9", description: "Horn functioning" }, { id: "10", description: "Emergency stop switches operational" },
    { id: "11", description: "Reverse alarm functioning" },
  ]},
  { sectionName: "Hydraulic System", items: [
    { id: "12", description: "Hydraulic oil level" }, { id: "13", description: "Hoses free from abrasion, leaks" },
    { id: "14", description: "Cylinders free from leaks/damage" }, { id: "15", description: "Lift/boom/scissor functions smooth" },
    { id: "16", description: "Pump noise normal" }, { id: "17", description: "Auxiliary hydraulics" },
  ]},
  { sectionName: "Engine Compartment", items: [
    { id: "18", description: "Engine oil level" }, { id: "19", description: "Coolant level & condition" },
    { id: "20", description: "Radiator clean, free of blockages" }, { id: "21", description: "Belts and Pulleys condition & tension" },
    { id: "22", description: "Fuel filter / water separator drained" }, { id: "23", description: "Air filters (primary and secondary)" },
    { id: "24", description: "No oil, coolant, or fuel leaks" }, { id: "25", description: "Fuel level" },
  ]},
  { sectionName: "Electrical System", items: [
    { id: "26", description: "Battery condition & mounting" }, { id: "27", description: "Terminals clean, no corrosion" },
    { id: "28", description: "Display screens and indicators functional" }, { id: "29", description: "Control panel buttons/switches operational" },
    { id: "30", description: "Wiring secured, no exposed wires" },
  ]},
  { sectionName: "Drive Train", items: [
    { id: "31", description: "Tyres/wheels condition" }, { id: "32", description: "Tyre pressure (if pneumatic)" },
    { id: "33", description: "Wheel nuts tight" }, { id: "34", description: "Axles and hubs leak-free" },
    { id: "35", description: "Brakes and parking brake work correctly" }, { id: "36", description: "All lubrication points serviced" },
  ]},
  { sectionName: "Platform", items: [
    { id: "37", description: "Guardrails secure & undamaged" }, { id: "38", description: "Entry gate self-closing & latches" },
    { id: "39", description: "Control box secure & functioning" }, { id: "40", description: "Joystick operation smooth" },
    { id: "41", description: "Footswitch/interlock operational" }, { id: "42", description: "Platform capacity label legible" },
    { id: "43", description: "Platform leveling system functional" },
  ]},
  { sectionName: "Boom", items: [
    { id: "44", description: "Boom sections free of cracks/damage" }, { id: "45", description: "Wear pads and rollers condition" },
    { id: "46", description: "Slew bearing, rotation smooth" }, { id: "47", description: "Safety limit switches active" },
    { id: "48", description: "All lubrication points serviced" },
  ]},
];

export const EWPWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="EWP Mechanical Weekly Inspection" />
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
                <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[50%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th><th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
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
