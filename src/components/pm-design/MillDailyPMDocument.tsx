import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ClipboardCheck,
  CheckCircle2,
  Cog,
  Thermometer,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface InspectionTask {
  task: string;
  hasTemp?: boolean;
  tempLabel?: string;
}

interface EquipmentSection {
  equipmentId: string;
  equipmentName: string;
  tasks: InspectionTask[];
}

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "MILL",
    equipmentName: "Ball Mill - System, Assembly and Components",
    tasks: [
      { task: "Inspect Feed Chute & Seals for Leaks/Wear. Note any Faults" },
      { task: "Inspect Trunnion & Pinion Bearing Labyrinths. Note Excessive Grease" },
      { task: "Grease Pinion Bearings (4 PUMPS PER DAY)" },
      { task: "Inspect Mill Drivelines. Note any excessive noise or wear" },
      { task: "Inspect/Check operation of Girth Gear Grease Sprayer" },
      { task: "Check Cycle Frequency on Girth Gear Lube and Note times (Approx 120 Seconds)" },
      { task: "Inspect mill for loose or leaking liner bolts. Note any faults" },
      { task: "Inspect gearbox lube pump, radiator & hoses for operation, leaks or noise" },
      { task: "Inspect mill grease pump airline systems, Top up airline oiler & check water traps" },
      { task: "Check level of bulky bins & note any that are getting low" },
    ]
  },
  {
    equipmentId: "GENERAL",
    equipmentName: "General Area Inspection",
    tasks: [
      { task: "Inspect cyclone tower pipe work and hoppers for leaks or wear. Note any faults" },
      { task: "Inspect air compressors for operation" },
      { task: "Check main air receiver & drain water from bottom valve" },
      { task: "Check general pipe work for leaks" },
      { task: "Check condition of walkway mesh & handrails" },
      { task: "Check operation of sump pumps" },
    ]
  },
  {
    equipmentId: "FE-100",
    equipmentName: "FE-100 Hopper",
    tasks: [
      { task: "Inspect Feed & Discharge chutes for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks" },
      { task: "Inspect scraper operation & condition. Note any faults" },
      { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "DE: ___°C | NDE: ___°C" },
    ]
  },
  {
    equipmentId: "FE-101",
    equipmentName: "FE-101 Transfer Conveyor",
    tasks: [
      { task: "Inspect Feed & Discharge chutes for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
      { task: "Inspect scraper operation & condition. Note any faults" },
      { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "NDE: ___°C | DE: ___°C" },
    ]
  },
  {
    equipmentId: "BC-100",
    equipmentName: "BC-100 Mill Feed Conveyor",
    tasks: [
      { task: "Inspect Feed & Discharge chutes for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
      { task: "Inspect scraper operation & condition. Note any faults" },
      { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "TD: ___°C | HD: ___°C" },
      { task: "Check belt tracking & tracking frames for correct operation" },
      { task: "Check conveyor belt for noisy or hot bearings. Report any issues to supervisor" },
    ]
  },
  {
    equipmentId: "CV-011",
    equipmentName: "CV-011 Scats Conveyor",
    tasks: [
      { task: "Inspect Feed chute for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks" },
      { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Tail Plant Side: ___°C | Tail Thickener Side: ___°C" },
    ]
  },
  {
    equipmentId: "MILL-SUMP",
    equipmentName: "Mill Sump Pump",
    tasks: [
      { task: "Inspect Discharge pipework for holes or leakage" },
      { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
      { task: "Inspect pump operation & condition. Inspect guarding" },
      { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
      { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
    ]
  },
  {
    equipmentId: "PU102A/B",
    equipmentName: "Cyclone Feed Pumps PU102A/PU102B",
    tasks: [
      { task: "Inspect Discharge pipework for holes or leakage" },
      { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
      { task: "Inspect pump operation & condition. Inspect guarding" },
      { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
      { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
      { task: "Note any leakage, and note which pump is running" },
    ]
  },
];

export const MillDailyPMDocument = () => {

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner with Title Overlay and Work Order */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek - Daily Mill Inspection</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Daily Inspection (Fitter)</p>
            </div>
          </div>
          <div className="absolute bottom-1 right-2 h-[40%] flex items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary tracking-tight">WO#:</span>
              <Input className="h-6 w-24 text-xs bg-background/90 border-primary/40 focus-visible:ring-primary shadow-sm" placeholder="______" maxLength={6} />
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div>
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
              <div className="px-2 py-1.5">Grinding</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div>
              <div className="px-2 py-1.5">1x Fitter (1 hr)</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mechanical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div>
              <div className="px-2 py-1.5 font-medium">Daily</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* INSPECTION TABLES */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>

          {inspectionData.map((section, sectionIndex) => (
            <div key={section.equipmentId} className={sectionIndex < inspectionData.length - 1 ? "border-b border-border" : ""}>
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cog className="w-4 h-4 text-primary" />
                  <span className="text-primary font-bold">{section.equipmentId}</span>
                  <span className="text-muted-foreground">|</span>
                  <span>{section.equipmentName}</span>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium w-[50%]">Task</th>
                    <th className="text-center px-2 py-2 font-medium w-[8%]">✓</th>
                    <th className="text-center px-2 py-2 font-medium w-[8%]">✗</th>
                    <th className="text-left px-4 py-2 font-medium w-[34%]">Comments / Temp</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-2.5 text-foreground">{task.task}</td>
                      <td className="text-center px-2 py-2.5">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                      </td>
                      <td className="text-center px-2 py-2.5">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                      </td>
                      <td className="px-4 py-2.5">
                        {task.hasTemp ? (
                          <span className="text-xs text-muted-foreground">{task.tempLabel}</span>
                        ) : (
                          <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* BC-100 Additional Temperature Records */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            BC-100 ADDITIONAL BEARING TEMPERATURES
          </div>
          <div className="p-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Upper Bend Pulley:</span>
              <span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Lower Bend Pulley:</span>
              <span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Take-up Pulley:</span>
              <span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span>
            </div>
          </div>
        </div>

        {/* Mill Specific Data */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            MILL DATA & TEMPERATURES
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Ambient Temp:</span>
                <span className="text-muted-foreground">___°C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Throughput Tonnes:</span>
                <span className="text-muted-foreground">_________</span>
              </div>
            </div>
            
            <div>
              <span className="font-medium">PINION FACE TEMPS:</span>
              <div className="mt-2 flex gap-8">
                <span className="text-muted-foreground">LEFT: ___°C</span>
                <span className="text-muted-foreground">CENTRE: ___°C</span>
                <span className="text-muted-foreground">RIGHT: ___°C</span>
              </div>
            </div>

            <div>
              <span className="font-medium">BEARINGS (1-10):</span>
              <div className="mt-2 grid grid-cols-10 gap-2 text-xs text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="border border-border rounded p-2">
                    <span className="font-medium">{num}=</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">GEARBOX LUBE TEMP (from Control Room):</span>
              <span className="text-muted-foreground">___°C</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">SIGN OFF</div>
          <div className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 gap-x-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium w-52">Follow up work required:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">Yes</span></div>
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">No</span></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium w-52">Document update required:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">Yes</span></div>
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">No</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">Name:</span>
                <Input className="h-7" />
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">Signature:</span>
                <div className="h-7 border border-border rounded bg-muted/30"></div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">Date:</span>
                <Input className="h-7" type="date" />
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">PM Duration:</span>
                <Input className="h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Approval */}
        <div className="border-t border-border">
          <div className="bg-green-500/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">APPROVAL</span>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-4 py-2 text-left font-semibold w-[20%]">Role</th>
                <th className="px-4 py-2 text-left font-semibold w-[25%]">Name</th>
                <th className="px-4 py-2 text-left font-semibold w-[25%]">Sign</th>
                <th className="px-4 py-2 text-left font-semibold w-[30%]">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium">Supervisor</td>
                <td className="px-4 py-2"><Input className="h-7 text-xs" /></td>
                <td className="px-4 py-2"><div className="h-7 border border-border rounded bg-muted/30"></div></td>
                <td className="px-4 py-2"><Input className="h-7 text-xs" type="date" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
          Tennant Creek Mining Operations – Inspection Form
        </div>
      </div>
    </div>
  );
};
