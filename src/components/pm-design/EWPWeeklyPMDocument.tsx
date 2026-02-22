import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, CheckCircle2 } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

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
      { id: "1", description: "Load chart / operating manual on machine" },
      { id: "2", description: "Fire extinguisher charged & accessible" },
      { id: "3", description: "First-aid kit checked" },
      { id: "4", description: "Compliance plates legible" },
      { id: "5", description: "Fall arrest anchor points condition" },
      { id: "6", description: "Battery isolator functioning & labelled" },
      { id: "7", description: "Starter isolator functioning & labelled" },
      { id: "8", description: "Flashing beacon / rotating amber light functioning" },
      { id: "9", description: "Horn functioning" },
      { id: "10", description: "Emergency stop switches operational" },
      { id: "11", description: "Reverse alarm functioning" },
    ]
  },
  {
    sectionName: "Hydraulic System",
    items: [
      { id: "12", description: "Hydraulic oil level" },
      { id: "13", description: "Hoses free from abrasion, leaks" },
      { id: "14", description: "Cylinders free from leaks/damage" },
      { id: "15", description: "Lift/boom/scissor functions smooth" },
      { id: "16", description: "Pump noise normal" },
      { id: "17", description: "Auxiliary hydraulics" },
    ]
  },
  {
    sectionName: "Engine Compartment",
    items: [
      { id: "18", description: "Engine oil level" },
      { id: "19", description: "Coolant level & condition" },
      { id: "20", description: "Radiator clean, free of blockages" },
      { id: "21", description: "Belts and Pulleys condition & tension" },
      { id: "22", description: "Fuel filter / water separator drained" },
      { id: "23", description: "Air filters (primary and secondary)" },
      { id: "24", description: "No oil, coolant, or fuel leaks" },
      { id: "25", description: "Fuel level" },
    ]
  },
  {
    sectionName: "Electrical System",
    items: [
      { id: "26", description: "Battery condition & mounting" },
      { id: "27", description: "Terminals clean, no corrosion" },
      { id: "28", description: "Display screens and indicators functional" },
      { id: "29", description: "Control panel buttons/switches operational" },
      { id: "30", description: "Wiring secured, no exposed wires" },
    ]
  },
  {
    sectionName: "Drive Train",
    items: [
      { id: "31", description: "Tyres/wheels condition" },
      { id: "32", description: "Tyre pressure (if pneumatic)" },
      { id: "33", description: "Wheel nuts tight" },
      { id: "34", description: "Axles and hubs leak-free" },
      { id: "35", description: "Brakes and parking brake work correctly" },
      { id: "36", description: "All lubrication points serviced" },
    ]
  },
  {
    sectionName: "Platform",
    items: [
      { id: "37", description: "Guardrails secure & undamaged" },
      { id: "38", description: "Entry gate self-closing & latches" },
      { id: "39", description: "Control box secure & functioning" },
      { id: "40", description: "Joystick operation smooth" },
      { id: "41", description: "Footswitch/interlock operational" },
      { id: "42", description: "Platform capacity label legible" },
      { id: "43", description: "Platform leveling system functional" },
    ]
  },
  {
    sectionName: "Boom",
    items: [
      { id: "44", description: "Boom sections free of cracks/damage" },
      { id: "45", description: "Wear pads and rollers condition" },
      { id: "46", description: "Slew bearing, rotation smooth" },
      { id: "47", description: "Safety limit switches active" },
      { id: "48", description: "All lubrication points serviced" },
    ]
  },
];

export const EWPWeeklyPMDocument = () => {
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      {/* Document Header */}
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          {/* Logo on left side of black section */}
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          {/* Title on the black section - centered */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">EWP Mechanical Weekly Inspection</h1>
            </div>
          </div>
        </div>

        {/* Header Information Grid - Mobile Equipment Style */}
        <div className="grid grid-cols-5 border-t border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">
              Asset Number
            </div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">
              Make/Model
            </div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">
              Serial No
            </div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div className="border-r border-border">
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">
              Hours
            </div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
          <div>
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">
              Next Service Due
            </div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Inspection Checklist */}
        <div className="border-b border-border">
          {inspectionData.map((section) => (
            <div key={section.sectionName}>
              {/* Section Header */}
              <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-primary" />
                {section.sectionName}
              </div>
              
              {/* Section Table */}
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
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            Comments
          </div>
          <div className="p-4">
            <Textarea 
              placeholder="Record any additional comments, defects found, or actions required..."
              className="min-h-[80px] text-sm"
            />
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
                  <td className="px-4 py-2">
                    <Input className="h-7 text-xs" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-8 border border-border rounded bg-muted/30"></div>
                  </td>
                  <td className="px-4 py-2">
                    <Input className="h-7 text-xs" type="date" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
          Tennant Creek Mining Operations - Mobile Equipment Inspection Form
        </div>
      </div>
    </div>
  );
};
