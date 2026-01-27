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
      { id: "1", description: "Fire extinguisher charged and accessible" },
      { id: "2", description: "First-aid kit stocked (if fitted)" },
      { id: "3", description: "ROPS/FOPS structure undamaged" },
      { id: "4", description: "Seatbelt condition & function" },
      { id: "5", description: "Pre-start book completed daily" },
    ]
  },
  {
    sectionName: "Hydraulic System",
    items: [
      { id: "6", description: "Hydraulic oil level" },
      { id: "7", description: "Hydraulic hoses (wear, abrasion, leaks)" },
      { id: "8", description: "Pump noise, temperature, smooth operation" },
      { id: "9", description: "Cylinders (leaks, rod damage)" },
      { id: "10", description: "Auxiliary hydraulic couplers – leaks & dust caps intact" },
    ]
  },
  {
    sectionName: "Engine Compartment",
    items: [
      { id: "11", description: "Engine oil level" },
      { id: "12", description: "Coolant level & condition" },
      { id: "13", description: "Radiator clean, no blockages" },
      { id: "14", description: "Belts condition & tension" },
      { id: "15", description: "Air filter (primary & secondary)" },
      { id: "16", description: "Fuel filter & water trap" },
      { id: "17", description: "Check for oil, coolant, or fuel leaks" },
      { id: "18", description: "Exhaust condition and mounting" },
    ]
  },
  {
    sectionName: "Electrical System",
    items: [
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
    ]
  },
  {
    sectionName: "Cabin",
    items: [
      { id: "29", description: "Seat, arm rests, controls secure" },
      { id: "30", description: "Joysticks/pedals smooth and responsive" },
      { id: "31", description: "Wipers & washers working" },
      { id: "32", description: "Mirrors clean & intact" },
      { id: "33", description: "Cab cleanliness" },
      { id: "34", description: "Aircon functioning" },
    ]
  },
  {
    sectionName: "Bucket and Attachments",
    items: [
      { id: "35", description: "Pins & bushings – lubrication & wear" },
      { id: "36", description: "Quick coupler operation & locking" },
      { id: "37", description: "Bucket/attachments – cutting edge wear, cracks" },
      { id: "38", description: "Auxiliary hydraulics working normally" },
    ]
  },
];

export const SkidSteerWeeklyPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Skid Steer Weekly Mechanical Inspection</h1>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-5 border-t border-b border-border text-xs">
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
