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
    { id: "1", description: "Flashing beacon/strobe operational" }, { id: "2", description: "Reverse alarm functional" },
    { id: "3", description: "Two-way radio working" }, { id: "4", description: "Fire extinguisher charged and secure" },
    { id: "5", description: "First aid kit stocked" }, { id: "6", description: "Wheel chocks present & serviceable" },
    { id: "7", description: "Emergency triangles present" },
  ]},
  { sectionName: "Tyres", items: [
    { id: "8", description: "Tyre pressure correct" }, { id: "9", description: "Tyre tread & sidewall condition" },
    { id: "10", description: "Rims and wheel nuts secure" }, { id: "11", description: "Tyre condition (cuts, cracks, wear)" },
    { id: "12", description: "Rims – cracks, distortion" }, { id: "13", description: "Wheel nuts tight, no movement" },
    { id: "14", description: "Centre pad & wheel studs condition" },
  ]},
  { sectionName: "Engine Compartment", items: [
    { id: "15", description: "Engine oil level" }, { id: "16", description: "Coolant level & condition" },
    { id: "17", description: "Radiator clean, free of blockages" }, { id: "18", description: "Belts condition & tension" },
    { id: "19", description: "Fuel filter / water separator drained" }, { id: "20", description: "Air filters (primary and secondary)" },
    { id: "21", description: "No oil, coolant, or fuel leaks" },
  ]},
  { sectionName: "Electrical System", items: [
    { id: "22", description: "Battery isolator functioning" }, { id: "23", description: "Battery isolator clearly labelled" },
    { id: "24", description: "Batteries secure & corrosion-free" }, { id: "25", description: "All headlights, tail lights, indicators working" },
    { id: "26", description: "Internal lights working" }, { id: "27", description: "Jump pack charged" },
  ]},
  { sectionName: "Transmission", items: [
    { id: "28", description: "Transmission oil level" }, { id: "29", description: "Differential/axle oils" },
    { id: "30", description: "Universal joints, drivelines condition" }, { id: "31", description: "Drive performance normal" },
    { id: "32", description: "Grease all grease points" },
  ]},
  { sectionName: "Steering", items: [
    { id: "33", description: "Power steering fluid level" }, { id: "34", description: "Steering joints, tie rods, cylinder leaks" },
    { id: "35", description: "Driveshaft/U-joints secure" }, { id: "36", description: "No abnormal noises" },
    { id: "37", description: "No excessive free play" },
  ]},
  { sectionName: "Auto Greaser", items: [
    { id: "38", description: "Inspection operation of greaser" }, { id: "39", description: "Inspect level" },
    { id: "40", description: "Inspect grease lines and repair if required" },
  ]},
  { sectionName: "Braking", items: [
    { id: "41", description: "Service brakes effective" }, { id: "42", description: "Park brake holding capacity" },
    { id: "43", description: "Brake lines/hoses intact" }, { id: "44", description: "Air leaks" },
    { id: "45", description: "Suspension components safe" },
  ]},
  { sectionName: "Body Work & Structure", items: [
    { id: "46", description: "Steps, handrails, grab points secure" },
  ]},
  { sectionName: "Water Tank and Spray System", items: [
    { id: "47", description: "Tank secure, no cracks or leaks" }, { id: "48", description: "Water pump operational" },
    { id: "49", description: "Spray bars functioning" }, { id: "50", description: "Rear spray nozzles not blocked" },
    { id: "51", description: "Side spray nozzles working" }, { id: "52", description: "Water cannon functioning" },
    { id: "53", description: "Hoses and fittings leak-free" },
  ]},
  { sectionName: "Cabin", items: [
    { id: "54", description: "Operator controls smooth/functional" }, { id: "55", description: "Mirrors clean & intact" },
    { id: "56", description: "Windows/windscreen clean and undamaged" }, { id: "57", description: "Wipers & washer" },
    { id: "58", description: "Air-conditioning functioning" },
  ]},
];

export const WaterTruckWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Water Truck Mechanical Weekly Inspection" />
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
