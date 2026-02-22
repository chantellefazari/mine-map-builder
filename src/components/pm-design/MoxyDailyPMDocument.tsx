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
    sectionName: "Walk Around Inspection",
    items: [
      { id: "1", description: "Check for body damage, loose panels, cracked welds" },
      { id: "2", description: "Check handrails, steps, and platforms for safety" },
      { id: "3", description: "Check fuel, oil, or coolant leaks under machine" },
      { id: "4", description: "Ensure all safety decals are clean and readable" },
    ]
  },
  {
    sectionName: "Fluids & Levels",
    items: [
      { id: "5", description: "Engine oil level" },
      { id: "6", description: "Coolant level" },
      { id: "7", description: "Hydraulic oil level" },
      { id: "8", description: "Transmission oil level (sight gauge)" },
      { id: "9", description: "Fuel level" },
      { id: "10", description: "AdBlue / DEF level (if equipped)" },
    ]
  },
  {
    sectionName: "Engine Compartment",
    items: [
      { id: "11", description: "Inspect for oil, coolant, or fuel leaks" },
      { id: "12", description: "Check belts for wear and tension" },
      { id: "13", description: "Check air filter restriction indicator" },
      { id: "14", description: "Inspect air intake hoses and clamps" },
      { id: "15", description: "Check radiator/cooler areas for dust buildup" },
      { id: "16", description: "Inspect radiator and cooler fins for blockage or damage" },
      { id: "17", description: "Verify fan operation is normal" },
    ]
  },
  {
    sectionName: "Hydraulic System",
    items: [
      { id: "18", description: "Check hoses and fittings for leaks or damage" },
      { id: "19", description: "Inspect lift and tilt cylinders for leaks" },
      { id: "20", description: "Inspect hydraulic tank area for leaks" },
      { id: "21", description: "Confirm bucket, lift, and tilt functions operate smoothly" },
    ]
  },
  {
    sectionName: "Auto Greaser",
    items: [
      { id: "22", description: "Grease reservoir level" },
      { id: "23", description: "Greaser pump cycles normally" },
      { id: "24", description: "No damaged, leaking, or missing grease lines" },
    ]
  },
  {
    sectionName: "Tires",
    items: [
      { id: "25", description: "Tire pressure visually OK" },
      { id: "26", description: "No cuts, cracks, or sidewall damage" },
      { id: "27", description: "No missing or loose wheel nuts" },
      { id: "28", description: "Hubs show no signs of overheating or oil leak" },
    ]
  },
  {
    sectionName: "Steering",
    items: [
      { id: "29", description: "Check articulation area for debris buildup" },
      { id: "30", description: "No excessive free play in articulation joint" },
      { id: "31", description: "Steering cylinders not leaking" },
      { id: "32", description: "Oscillation joint functioning normally" },
      { id: "33", description: "Axles free of leaks" },
    ]
  },
  {
    sectionName: "Braking",
    items: [
      { id: "34", description: "Service brakes functioning normally" },
      { id: "35", description: "Parking brake holding correctly" },
      { id: "36", description: "No brake warning indicators on display" },
    ]
  },
  {
    sectionName: "Dump Body & Frame Structure",
    items: [
      { id: "37", description: "Inspect hinge pins, bushes, and grease points" },
      { id: "38", description: "Inspect body floor, sides, and tailgate for cracks or damage" },
      { id: "39", description: "Inspect chassis rails and welds" },
      { id: "40", description: "Check body cylinder mounts" },
      { id: "41", description: "Inspect tailgate operation (if fitted)" },
    ]
  },
  {
    sectionName: "Electrical",
    items: [
      { id: "42", description: "Lights (work lights, indicators, beacon, brake lights) operating" },
      { id: "43", description: "Horn functioning" },
      { id: "44", description: "Reverse alarm works" },
      { id: "45", description: "Battery terminals secure and clean" },
      { id: "46", description: "No exposed or damaged wiring" },
    ]
  },
  {
    sectionName: "Cab",
    items: [
      { id: "47", description: "Seatbelt in good condition" },
      { id: "48", description: "Mirrors and windows clean and intact" },
      { id: "49", description: "HVAC functioning" },
      { id: "50", description: "Check cab air filter" },
      { id: "51", description: "Fire extinguisher present and charged" },
      { id: "52", description: "First-aid kit" },
      { id: "53", description: "Monitor/display functioning with no active warnings" },
    ]
  },
  {
    sectionName: "Operational Checks",
    items: [
      { id: "54", description: "Engine starts smoothly with no unusual noise" },
      { id: "55", description: "Gauges and warning lights normal" },
      { id: "56", description: "Steering responsive" },
      { id: "57", description: "Hydraulics responsive and smooth" },
      { id: "58", description: "Run full dump cycle—smooth and stable" },
      { id: "59", description: "Smooth gear shifting" },
      { id: "60", description: "Test brake holding before travel" },
    ]
  },
];

export const MoxyDailyPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Moxy Daily Mechanical Inspection</h1>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-4 border-t border-b border-border text-xs">
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
          <div>
            <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">Hours</div>
            <div className="px-2 py-2 min-h-[32px]"></div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

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
          Tennant Creek Mining Operations - Mobile Equipment Inspection Form
        </div>
      </div>
    </div>
  );
};
