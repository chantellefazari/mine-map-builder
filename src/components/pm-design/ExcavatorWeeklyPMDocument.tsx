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
      { id: "1", description: "Inspect machine structure, boom, stick, bucket, and attachments for damage or cracks" },
      { id: "2", description: "Inspect guards, panels, and covers for proper attachment" },
      { id: "3", description: "Check for loose or missing bolts, nuts, or pins" },
      { id: "4", description: "Inspect handrails, steps, and safety decals for condition" },
      { id: "5", description: "Ensure warning labels and signage are intact" },
    ]
  },
  {
    sectionName: "Fluids & Levels",
    items: [
      { id: "6", description: "Engine oil level" },
      { id: "7", description: "Coolant level" },
      { id: "8", description: "Fuel level" },
      { id: "9", description: "Battery electrolyte level (if applicable)" },
      { id: "10", description: "DEF / AdBlue level (if SCR equipped)" },
      { id: "11", description: "Transmission or swing drive oil levels" },
    ]
  },
  {
    sectionName: "Engine Compartment",
    items: [
      { id: "12", description: "Inspect for oil, coolant, or fuel leaks" },
      { id: "13", description: "Check belts for wear and tension" },
      { id: "14", description: "Check air filter restriction indicator" },
      { id: "15", description: "Change/Clean air filter elements as needed" },
      { id: "16", description: "Inspect air intake hoses and clamps" },
      { id: "17", description: "Check radiator/cooler areas for dust buildup" },
      { id: "18", description: "Check turbo and exhaust system for cracks, soot leaks, or loose fittings" },
    ]
  },
  {
    sectionName: "Electrical System",
    items: [
      { id: "19", description: "Battery terminals clean and secure" },
      { id: "20", description: "Battery isolator functional and in correct position" },
      { id: "21", description: "Lights and indicators operational" },
      { id: "22", description: "Control panel functioning correctly" },
      { id: "23", description: "Wiring secure, no exposed or damaged cables" },
      { id: "24", description: "Test warning lights and alarms" },
    ]
  },
  {
    sectionName: "Hydraulic System",
    items: [
      { id: "25", description: "Check hydraulic oil level" },
      { id: "26", description: "Inspect hydraulic hoses and fittings for leaks or damage" },
      { id: "27", description: "Check hydraulic cylinders for leaks or scoring" },
      { id: "28", description: "Test all hydraulic functions for smooth operation" },
      { id: "29", description: "Inspect hydraulic tank breather/cap" },
    ]
  },
  {
    sectionName: "Undercarriage & Tracks",
    items: [
      { id: "30", description: "Inspect track tension and adjustment" },
      { id: "31", description: "Check track pads for wear or damage" },
      { id: "32", description: "Inspect idlers, rollers, and sprockets for wear" },
      { id: "33", description: "Check for loose or missing track bolts" },
      { id: "34", description: "Inspect final drive for leaks" },
    ]
  },
  {
    sectionName: "Operator Cab / Safety",
    items: [
      { id: "35", description: "Seat, seatbelt, and controls functioning properly" },
      { id: "36", description: "Fire extinguisher present and charged" },
      { id: "37", description: "Horn, backup alarm, and mirrors operational" },
      { id: "38", description: "Windows and doors operate correctly" },
      { id: "39", description: "HVAC system functioning" },
      { id: "40", description: "Cab interior clean and free of debris" },
    ]
  },
  {
    sectionName: "Operational Checks",
    items: [
      { id: "41", description: "Engine starts smoothly with no unusual noise" },
      { id: "42", description: "Monitor gauges: oil pressure, coolant temperature, hydraulic pressure" },
      { id: "43", description: "Observe for unusual noises, vibrations, or smoke" },
      { id: "44", description: "Test swing function and brakes" },
      { id: "45", description: "Test travel functions - forward and reverse" },
      { id: "46", description: "Shutdown normal with no alarms" },
    ]
  },
  {
    sectionName: "Auto-Greaser (if equipped)",
    items: [
      { id: "47", description: "Verify grease levels and automatic greasing system functioning" },
      { id: "48", description: "Check all grease points for lubrication" },
      { id: "49", description: "Inspect grease lines for damage or blockage" },
    ]
  },
];

export const ExcavatorWeeklyPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Excavator Weekly Mechanical Inspection</h1>
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
          Tennant Creek Mining Operations - Mobile Equipment Weekly Inspection Form
        </div>
      </div>
    </div>
  );
};
