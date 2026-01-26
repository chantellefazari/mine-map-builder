import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, CheckCircle2 } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface InspectionItem {
  id: string;
  description: string;
}

interface InspectionSection {
  sectionName: string;
  items: InspectionItem[];
}

const inspectionData: InspectionSection[] = [
  {
    sectionName: "Safety",
    items: [
      { id: "1", description: "Load charts in cab & legible" },
      { id: "2", description: "Fire extinguisher charged & accessible" },
      { id: "3", description: "First-aid kit checked" },
      { id: "4", description: "ROPS/FOPS integrity" },
      { id: "5", description: "Seatbelt functioning & in good condition" },
      { id: "6", description: "Battery isolator functioning & labelled" },
      { id: "7", description: "Starter isolator functioning & labelled" },
      { id: "8", description: "Flashing beacon / rotating amber light functioning" },
      { id: "9", description: "Horn functioning" },
      { id: "10", description: "Emergency stop switches operational" },
      { id: "11", description: "Reversing Beeper Operational" },
    ]
  },
  {
    sectionName: "Hydraulics",
    items: [
      { id: "12", description: "Hydraulic oil level" },
      { id: "13", description: "Hydraulic hoses (cracks, abrasion, leaks)" },
      { id: "14", description: "Pump performance & abnormal noise" },
      { id: "15", description: "Lift/tilt/boom functions smooth" },
      { id: "16", description: "Hydraulic cylinders – leaks, rod damage" },
      { id: "17", description: "Auxiliary hydraulics functioning correctly" },
      { id: "18", description: "Stabiliser hydraulics" },
    ]
  },
  {
    sectionName: "Engine Compartment",
    items: [
      { id: "19", description: "Engine oil level" },
      { id: "20", description: "Coolant level & condition" },
      { id: "21", description: "Radiator clean, free of blockages" },
      { id: "22", description: "Belts condition & tension" },
      { id: "23", description: "Fuel filter / water separator drained" },
      { id: "24", description: "Air filters (primary and secondary)" },
      { id: "25", description: "No oil, coolant, or fuel leaks" },
      { id: "26", description: "Exhaust system secure" },
    ]
  },
  {
    sectionName: "Electrical System",
    items: [
      { id: "27", description: "Battery condition & mounting" },
      { id: "28", description: "Terminals clean, no corrosion" },
      { id: "29", description: "Wiring harness secure, no exposed wires" },
      { id: "30", description: "Work lights, indicators, hazards operational" },
      { id: "31", description: "Dashboard gauges working" },
      { id: "32", description: "Reverse alarm functional" },
      { id: "33", description: "No active electrical fault codes" },
    ]
  },
  {
    sectionName: "Transmission",
    items: [
      { id: "34", description: "Transmission oil level" },
      { id: "35", description: "Gear changes smooth" },
      { id: "36", description: "No driveline or differential leaks" },
      { id: "37", description: "Parking brake functioning" },
      { id: "38", description: "Service brakes performing correctly" },
      { id: "39", description: "Axles free from damage or leaks" },
      { id: "40", description: "Grease all Grease points" },
    ]
  },
  {
    sectionName: "Steering",
    items: [
      { id: "41", description: "Steering response normal" },
      { id: "42", description: "Four-wheel steer & crab modes functional" },
      { id: "43", description: "Steering cylinders and hoses intact" },
      { id: "44", description: "No excessive free play" },
      { id: "45", description: "Suspension components intact" },
    ]
  },
  {
    sectionName: "Auto Greaser",
    items: [
      { id: "46", description: "Inspection Operation of Greaser" },
      { id: "47", description: "Inspect Level" },
      { id: "48", description: "Inspect Grease Lines and repair if Required" },
    ]
  },
  {
    sectionName: "Tyres",
    items: [
      { id: "49", description: "Tyre condition (cuts, cracks, wear)" },
      { id: "50", description: "Tyre pressures correct" },
      { id: "51", description: "Rims – cracks, distortion" },
      { id: "52", description: "Wheel nuts tight, no movement" },
      { id: "53", description: "Hub oil levels (if applicable)" },
    ]
  },
  {
    sectionName: "Boom & Attachments",
    items: [
      { id: "54", description: "Boom sections straight & undamaged" },
      { id: "55", description: "Boom pads/rollers condition" },
      { id: "56", description: "Boom wear pads intact" },
      { id: "57", description: "Boom hoses & internal chains/cables in good condition" },
      { id: "58", description: "Carriage locks working" },
      { id: "59", description: "Forks straight, not bent or worn" },
      { id: "60", description: "Correct attachment plate engagement" },
      { id: "61", description: "Attachment (bucket, jib, man basket, etc.) secure" },
      { id: "62", description: "Quick-hitch locking mechanism functional" },
    ]
  },
  {
    sectionName: "Stabilisers",
    items: [
      { id: "63", description: "Stabilisers extend/retract smoothly" },
      { id: "64", description: "Pads present and undamaged" },
      { id: "65", description: "Interlock switches working" },
    ]
  },
  {
    sectionName: "Cabin",
    items: [
      { id: "66", description: "Operator controls smooth/functional" },
      { id: "67", description: "Mirrors clean & intact" },
      { id: "68", description: "Windows/windscreen clean and undamaged" },
      { id: "69", description: "Wipers & washer operation" },
      { id: "70", description: "Air-conditioning functioning" },
      { id: "71", description: "Joysticks free of sticking" },
    ]
  },
];

export const TelehandlerWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Telehandler Mechanical Weekly Inspection</h1>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-5 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">Asset Number</div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">Make/Model</div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">Serial No</div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">Hours</div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div>
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">Next Service Due</div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
        </div>

        {/* Inspection Checklist */}
        <div className="border-b border-border">
          {inspectionData.map((section) => (
            <div key={section.sectionName}>
              <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-primary" />
                {section.sectionName}
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-3 py-1.5 text-left font-semibold w-12">#</th>
                    <th className="px-3 py-1.5 text-left font-semibold">Inspection Item</th>
                    <th className="px-3 py-1.5 text-left font-semibold w-48">Comments</th>
                    <th className="px-3 py-1.5 text-center font-semibold w-12">✓</th>
                    <th className="px-3 py-1.5 text-center font-semibold w-12">✗</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-1.5 text-center">{index + 1}</td>
                      <td className="px-3 py-1.5">{item.description}</td>
                      <td className="px-3 py-1.5">
                        <Input className="h-6 text-xs" placeholder="" />
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <Checkbox 
                          className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          checked={itemStatus[item.id] === "pass"}
                          onCheckedChange={() => setStatus(item.id, "pass")}
                        />
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <Checkbox 
                          className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          checked={itemStatus[item.id] === "fail"}
                          onCheckedChange={() => setStatus(item.id, "fail")}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Comments Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Comments</div>
          <div className="p-4">
            <Textarea placeholder="Record any additional comments, defects found, or actions required..." className="min-h-[80px] text-sm" />
          </div>
        </div>

        {/* Sign-off Section */}
        <div className="border-b border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">Sign-Off</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-2 text-left font-semibold">Checked By</th>
                  <th className="px-4 py-2 text-left font-semibold">Signature</th>
                  <th className="px-4 py-2 text-left font-semibold w-32">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2"><Input className="h-7 text-xs" /></td>
                  <td className="px-4 py-2"><div className="h-8 border border-border rounded bg-muted/30"></div></td>
                  <td className="px-4 py-2"><Input className="h-7 text-xs" type="date" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
          Tennant Creek Mining Operations - Mobile Equipment Weekly Inspection Form
        </div>
      </div>
    </div>
  );
};
