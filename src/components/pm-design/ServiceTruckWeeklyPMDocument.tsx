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
      { id: "1", description: "Flashing beacon/strobe operational" },
      { id: "2", description: "Reverse alarm functional" },
      { id: "3", description: "Two-way radio working" },
      { id: "4", description: "Fire extinguisher charged and secure" },
      { id: "5", description: "First aid kit stocked" },
      { id: "6", description: "Wheel chocks present & serviceable" },
      { id: "7", description: "Emergency triangles present" },
    ]
  },
  {
    sectionName: "Tyres",
    items: [
      { id: "8", description: "Tyre pressure correct" },
      { id: "9", description: "Tyre tread & sidewall condition" },
      { id: "10", description: "Rims and wheel nuts secure" },
      { id: "11", description: "Tyre condition (cuts, cracks, wear)" },
      { id: "12", description: "Rims – cracks, distortion" },
      { id: "13", description: "Wheel nuts tight, no movement" },
      { id: "14", description: "Centre pad & wheel studs condition" },
    ]
  },
  {
    sectionName: "Engine Compartment",
    items: [
      { id: "15", description: "Engine oil level" },
      { id: "16", description: "Coolant level & condition" },
      { id: "17", description: "Radiator clean, free of blockages" },
      { id: "18", description: "Belts condition & tension" },
      { id: "19", description: "Fuel filter / water separator drained" },
      { id: "20", description: "Air filters (primary and secondary)" },
      { id: "21", description: "No oil, coolant, or fuel leaks" },
    ]
  },
  {
    sectionName: "Electrical System",
    items: [
      { id: "22", description: "Battery isolator functioning" },
      { id: "23", description: "Battery isolator clearly labelled" },
      { id: "24", description: "Batteries secure & corrosion-free" },
      { id: "25", description: "External lights working" },
      { id: "26", description: "Internal lights working" },
      { id: "27", description: "Jump Pack Charged" },
    ]
  },
  {
    sectionName: "Transmission",
    items: [
      { id: "28", description: "Transmission oil level" },
      { id: "29", description: "Differential/axle oils" },
      { id: "30", description: "Universal joints, drivelines condition" },
      { id: "31", description: "Drive performance normal" },
      { id: "32", description: "Grease all grease points" },
    ]
  },
  {
    sectionName: "Steering",
    items: [
      { id: "33", description: "Power steering fluid level" },
      { id: "34", description: "Steering joints, tie rods, cylinder leaks" },
      { id: "35", description: "Driveshaft/U-joints secure" },
      { id: "36", description: "No abnormal noises" },
      { id: "37", description: "No excessive free play" },
    ]
  },
  {
    sectionName: "Auto Greaser",
    items: [
      { id: "38", description: "Inspection operation of greaser" },
      { id: "39", description: "Inspect level" },
      { id: "40", description: "Inspect grease lines and repair if required" },
    ]
  },
  {
    sectionName: "Braking",
    items: [
      { id: "41", description: "Service brakes effective" },
      { id: "42", description: "Park brake holding capacity" },
      { id: "43", description: "Brake lines/hoses intact" },
      { id: "44", description: "Air leaks" },
      { id: "45", description: "Suspension components safe" },
    ]
  },
  {
    sectionName: "Body Work & Structure",
    items: [
      { id: "46", description: "Steps, handrails, grab points secure" },
    ]
  },
  {
    sectionName: "Onboard Tools and Equipment",
    items: [
      { id: "47", description: "Air compressor operational" },
      { id: "48", description: "Hoses leak-free" },
      { id: "49", description: "Toolboxes secure" },
      { id: "50", description: "Grease system functioning" },
      { id: "51", description: "Fuel system functional" },
      { id: "52", description: "Waste oil tank level - If full decant into approved disposal tank" },
      { id: "53", description: "Lubricant levels" },
    ]
  },
  {
    sectionName: "Cabin",
    items: [
      { id: "54", description: "Operator controls smooth/functional" },
      { id: "55", description: "Mirrors clean & intact" },
      { id: "56", description: "Windows/windscreen clean and undamaged" },
      { id: "57", description: "Wipers & washer operation" },
      { id: "58", description: "Air-conditioning functioning" },
    ]
  },
];

export const ServiceTruckWeeklyPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Service Truck Weekly Mechanical Inspection</h1>
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
