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
    { id: "1", description: "Fire extinguisher charged and accessible" },
    { id: "2", description: "First-aid kit stocked (if fitted)" },
    { id: "3", description: "ROPS/FOPS structure undamaged" },
    { id: "4", description: "Seatbelt condition & function" },
    { id: "5", description: "Pre-start book completed daily" },
  ]},
  { sectionName: "Hydraulic System", items: [
    { id: "6", description: "Hydraulic oil level" }, { id: "7", description: "Hydraulic hoses (wear, abrasion, leaks)" },
    { id: "8", description: "Pump noise, temperature, smooth operation" },
    { id: "9", description: "Cylinders (leaks, rod damage)" },
    { id: "10", description: "Auxiliary hydraulic couplers – leaks & dust caps intact" },
  ]},
  { sectionName: "Engine Compartment", items: [
    { id: "11", description: "Engine oil level" }, { id: "12", description: "Coolant level & condition" },
    { id: "13", description: "Radiator clean, no blockages" }, { id: "14", description: "Belts condition & tension" },
    { id: "15", description: "Air filter (primary & secondary)" }, { id: "16", description: "Fuel filter & water trap" },
    { id: "17", description: "Check for oil, coolant, or fuel leaks" }, { id: "18", description: "Exhaust condition and mounting" },
  ]},
  { sectionName: "Electrical System", items: [
    { id: "19", description: "Battery condition (secure, clean terminals)" },
    { id: "20", description: "Alternator charging correctly (no warnings)" },
    { id: "21", description: "Wiring harness secure; no exposed wires" },
    { id: "22", description: "All machine lights functioning" },
    { id: "23", description: "Reverse alarm, horn functioning" },
    { id: "24", description: "Operator display & gauges functioning" },
    { id: "25", description: "No active electrical fault codes" },
    { id: "26", description: "Battery isolator switch present & functioning" },
    { id: "27", description: "Starter isolator operational" },
    { id: "28", description: "Flashing beacon/rotating light operational" },
  ]},
  { sectionName: "Cabin", items: [
    { id: "29", description: "Seat, arm rests, controls secure" },
    { id: "30", description: "Joysticks/pedals smooth and responsive" },
    { id: "31", description: "Wipers & washers working" }, { id: "32", description: "Mirrors clean & intact" },
    { id: "33", description: "Cab cleanliness" }, { id: "34", description: "Aircon functioning" },
  ]},
  { sectionName: "Bucket and Attachments", items: [
    { id: "35", description: "Pins & bushings – lubrication & wear" },
    { id: "36", description: "Quick coupler operation & locking" },
    { id: "37", description: "Bucket/attachments – cutting edge wear, cracks" },
    { id: "38", description: "Auxiliary hydraulics working normally" },
  ]},
];

export const SkidSteerWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});
  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Skid Steer Weekly Mechanical Inspection" />
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
