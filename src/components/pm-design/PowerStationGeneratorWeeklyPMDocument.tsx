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
    sectionName: "Walk Around Inspection",
    items: [
      { id: "1", description: "Check for any visible damage to generator housing" },
      { id: "2", description: "Check for oil, fuel, or coolant leaks under the generator" },
      { id: "3", description: "Ensure all warning labels and signage are intact" },
      { id: "4", description: "Check mounting frame or skid for rust or structural damage" },
      { id: "5", description: "Inspect vibration isolators for cracks or wear" },
    ]
  },
  {
    sectionName: "Fluids & Levels",
    items: [
      { id: "6", description: "Engine oil level" },
      { id: "7", description: "Coolant level" },
      { id: "8", description: "Fuel level" },
      { id: "9", description: "Battery electrolyte level (if applicable)" },
      { id: "10", description: "Radiator overflow bottle level" },
    ]
  },
  {
    sectionName: "Engine",
    items: [
      { id: "11", description: "Inspect for oil, coolant, or fuel leaks" },
      { id: "12", description: "Check belts for wear and tension" },
      { id: "13", description: "Inspect engine mounts" },
      { id: "14", description: "Inspect air intake hoses and clamps" },
      { id: "15", description: "Check radiator/cooler areas for dust buildup" },
      { id: "16", description: "Check exhaust system for cracks, soot leaks, or loose fittings" },
      { id: "17", description: "Check turbocharger (if equipped) for loose connections or oil leaks" },
      { id: "18", description: "Replace Air Filter" },
    ]
  },
  {
    sectionName: "Cooling System",
    items: [
      { id: "19", description: "Radiator clean and free of debris" },
      { id: "20", description: "Radiator fins intact, not bent or blocked" },
      { id: "21", description: "Hoses, clamps, and connections checked for wear or leaks" },
      { id: "22", description: "Fan operation smooth" },
      { id: "23", description: "Check for corrosion in cooling system" },
    ]
  },
  {
    sectionName: "Fuel System",
    items: [
      { id: "24", description: "Fuel tank, lines, and filters inspected for leaks or damage" },
      { id: "25", description: "Drain water separators (if fitted)" },
      { id: "26", description: "Inspect fuel injection pump and connections" },
      { id: "27", description: "Verify fuel cap seal integrity" },
    ]
  },
  {
    sectionName: "Lubrication System",
    items: [
      { id: "28", description: "Inspect oil filters" },
      { id: "29", description: "Inspect oil cooler and lines for leaks" },
      { id: "30", description: "Check for correct oil pressure during operation" },
    ]
  },
  {
    sectionName: "Electrical System",
    items: [
      { id: "31", description: "Battery terminals clean and secure" },
      { id: "32", description: "Check battery charge and condition" },
      { id: "33", description: "Inspect starter and alternator connections" },
      { id: "34", description: "Inspect terminal connections and insulation" },
    ]
  },
  {
    sectionName: "Exhaust System",
    items: [
      { id: "35", description: "Inspect exhaust piping and muffler for leaks" },
      { id: "36", description: "Check mounting brackets and supports" },
      { id: "37", description: "Inspect for excessive soot buildup" },
    ]
  },
  {
    sectionName: "Safety Equipment",
    items: [
      { id: "38", description: "Battery Isolator Installed and Lockable" },
      { id: "39", description: "Fire extinguisher present and charged" },
      { id: "40", description: "Spill kit available" },
      { id: "41", description: "Grounding connections secure" },
      { id: "42", description: "Check for loose panels, covers, and guards" },
    ]
  },
  {
    sectionName: "Operational Checks",
    items: [
      { id: "43", description: "Start generator and verify smooth operation" },
      { id: "44", description: "Observe for unusual noises or vibrations" },
      { id: "45", description: "Monitor gauges: oil pressure, coolant temperature, voltage, frequency" },
      { id: "46", description: "Shutdown and verify no alarms or leaks" },
    ]
  },
];

export const PowerStationGeneratorWeeklyPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Weekly Power Station Generator Inspection</h1>
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
          Tennant Creek Mining Operations - Power Station Generator Weekly Inspection Form
        </div>
      </div>
    </div>
  );
};
