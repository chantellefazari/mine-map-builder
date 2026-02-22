import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardCheck,
  Cog,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface InspectionTask {
  task: string;
}

interface EquipmentSection {
  equipmentName: string;
  tasks: InspectionTask[];
  tempGuidelines?: string;
}

const inspectionSections: EquipmentSection[] = [
  {
    equipmentName: "Filter Press 1 – Hydraulics",
    tasks: [
      { task: "Verify closing pressure at setpoint" },
      { task: "Confirm pressure holding (no rapid decrease)" },
      { task: "Record hydraulic oil temperature (TEMP-)" },
      { task: "Listen for pump cavitation or whining" },
      { task: "Inspect for visible oil leaks" },
    ],
    tempGuidelines: "Normal: 35–55°C | Caution: 55–65°C | Critical: >65°C → Investigate cooling / contamination",
  },
  {
    equipmentName: "Filter Press 1 – Filtration",
    tasks: [
      { task: "Check cake dryness uniformity" },
      { task: "Compare cycle time to baseline. Ask Operator for Baseline" },
      { task: "Observe slurry leakage between plates" },
      { task: "Confirm smooth plate opening" },
      { task: "Listen for abnormal mechanical noise" },
      { task: "Inspect Core Blow Pipe work for Leaks" },
      { task: "Inspect Slurry Feed Pipework for leaks" },
      { task: "Inspect Core Blow and Feed line valves for smooth operation and leaks" },
      { task: "Inspect Filter Feed tank fill valve for smooth operation and leaks" },
      { task: "Inspect Airlines for Leaks" },
      { task: "Inspect Feed Tank Agitator for operation" },
      { task: "Check pneumatic Rail shakers for operation and air leaks" },
    ],
  },
  {
    equipmentName: "Filter Press 1 – Feed Pump",
    tasks: [
      { task: "Check feed pressure stability" },
      { task: "Listen for cavitation" },
      { task: "Inspect mechanical seal" },
      { task: "Check pump Bearing temperature (TEMP-)" },
    ],
    tempGuidelines: "Normal: 40–75°C | Caution: 75–85°C | Critical: >90°C",
  },
  {
    equipmentName: "Filter Press 2 – Hydraulics",
    tasks: [
      { task: "Verify closing pressure at setpoint" },
      { task: "Confirm pressure holding (no rapid decay)" },
      { task: "Record hydraulic oil temperature (TEMP-)" },
      { task: "Listen for pump cavitation or whining" },
      { task: "Inspect for visible oil leaks" },
    ],
    tempGuidelines: "Normal: 35–55°C | Caution: 55–65°C | Critical: >65°C",
  },
  {
    equipmentName: "Filter Press 2 – Filtration",
    tasks: [
      { task: "Check cake dryness uniformity" },
      { task: "Compare cycle time to baseline. Ask Operator for Baseline" },
      { task: "Observe slurry leakage between plates" },
      { task: "Confirm smooth plate opening" },
      { task: "Listen for abnormal mechanical noise" },
      { task: "Inspect Core Blow Pipe work for Leaks" },
      { task: "Inspect Slurry Feed Pipework for leaks" },
      { task: "Inspect Core Blow and Feed line valves for smooth operation and leaks" },
      { task: "Inspect Filter Feed tank fill valve for smooth operation and leaks" },
      { task: "Inspect Airlines for Leaks" },
      { task: "Inspect Feed Tank Agitator for operation" },
      { task: "Check pneumatic Rail shakers for operation and air leaks" },
    ],
  },
  {
    equipmentName: "Filter Press 2 – Feed Pump",
    tasks: [
      { task: "Check feed pressure stability" },
      { task: "Listen for cavitation" },
      { task: "Inspect mechanical seal" },
      { task: "Check pump Bearing temperature (TEMP-)" },
    ],
    tempGuidelines: "Normal: 40–75°C | Caution: 75–85°C | Critical: >90°C",
  },
  {
    equipmentName: "Filter 1 Extraction Conveyor",
    tasks: [
      { task: "Check Tail Drum Bearings x2 (TEMP-)" },
      { task: "Check Head Drum Bearings x2 (TEMP-)" },
      { task: "Check Tension roller bearings. Located at Head end of Conveyor (TEMP-)" },
      { task: "Check all grease points are not Damaged" },
      { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Frames are Secure and are not moving under load" },
      { task: "Check that Head end belt Scrapper is functioning" },
      { task: "Verify belt centered on pulleys" },
      { task: "Inspect for edge wear" },
      { task: "Observe material loading alignment" },
      { task: "Listen for belt slapping" },
    ],
    tempGuidelines: "Normal: 30–70°C | Monitor: 70–85°C | Warning: 85–95°C | Critical: >95°C → Immediate shutdown",
  },
  {
    equipmentName: "Filter 1 Extraction – Gearbox",
    tasks: [
      { task: "Check Gearbox Temperature (TEMP-)" },
      { task: "Listen for gearbox Noise" },
      { task: "Inspect coupling vibration" },
      { task: "Inspect Belt tension. Visual" },
    ],
    tempGuidelines: "Normal: 40–75°C | Critical: >85°C",
  },
  {
    equipmentName: "Filter 2 Extraction Conveyor",
    tasks: [
      { task: "Check Tail Drum Bearings x2 (TEMP-)" },
      { task: "Check Head Drum Bearings x2 (TEMP-)" },
      { task: "Check Tension roller bearings. Located at Head end of Conveyor (TEMP-)" },
      { task: "Check all grease points are not Damaged" },
      { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Frames are Secure and are not moving under load" },
      { task: "Check that Head end belt Scrapper is functioning" },
      { task: "Verify belt centered on pulleys" },
      { task: "Inspect for edge wear" },
      { task: "Observe material loading alignment" },
      { task: "Listen for belt slapping" },
    ],
  },
  {
    equipmentName: "Filter 2 Extraction – Gearbox",
    tasks: [
      { task: "Check Gearbox Temperature (TEMP-)" },
      { task: "Listen for gearbox Noise" },
      { task: "Inspect coupling vibration" },
      { task: "Inspect Belt tension. Visual" },
    ],
    tempGuidelines: "Normal: 40–75°C | Critical: >85°C",
  },
  {
    equipmentName: "Collection Conveyor",
    tasks: [
      { task: "Check Tail Drum Bearings x2 (TEMP-)" },
      { task: "Check Head Drum Bearings x2 (TEMP-)" },
      { task: "Check Tension roller bearings. Located at Head end of Conveyor (TEMP-)" },
      { task: "Check all grease points are not Damaged" },
      { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Frames are Secure and are not moving under load" },
      { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check that Head end belt Scrapper is functioning" },
      { task: "Verify belt centered on pulleys" },
      { task: "Inspect for edge wear" },
      { task: "Observe material loading alignment" },
      { task: "Listen for belt slapping" },
    ],
  },
  {
    equipmentName: "Collection Conveyor – Gearbox",
    tasks: [
      { task: "Check Gearbox Temperature (TEMP-)" },
      { task: "Listen for gearbox Noise" },
      { task: "Inspect coupling vibration" },
      { task: "Inspect Belt tension. Visual" },
    ],
    tempGuidelines: "Normal: 40–75°C | Critical: >85°C",
  },
  {
    equipmentName: "Radial Stacker Conveyor",
    tasks: [
      { task: "Check Tail Drum Bearings x2 (TEMP-)" },
      { task: "Check Head Drum Bearings x2 (TEMP-)" },
      { task: "Check Tension roller bearings (TEMP-)" },
      { task: "Check all Wing Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Center Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check all Frames are Secure and are not moving under load. Mark with info tag if roller requires replacing" },
      { task: "Check all Return Rollers are operating Correctly. Mark with info tag if roller requires replacing" },
      { task: "Check that Head end belt Scrapper is functioning" },
      { task: "Verify belt centered on pulleys" },
      { task: "Observe material loading alignment" },
      { task: "Listen for belt slapping" },
      { task: "Ensure Turn Table is clear of Build up" },
      { task: "Ensure wheels are operating smoothly and concrete clear of build up" },
    ],
  },
  {
    equipmentName: "Radial Stacker – Gearbox",
    tasks: [
      { task: "Check Gearbox Temperature (TEMP-)" },
      { task: "Listen for gearbox Noise" },
      { task: "Inspect coupling vibration" },
      { task: "Inspect Belt tension. Visual" },
    ],
    tempGuidelines: "Normal: 40–75°C | Critical: >85°C",
  },
];

const shutdownTriggers = [
  "Bearing temperature >95°C",
  "Smoke or burning smell",
  "Sudden pressure drop in press",
  "Gearbox oil leak + high temperature",
  "Severe belt mistracking",
  "Abnormal vibration + temperature rise",
];

export const FilterPressDailyOnlinePMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">
                Matec 1520HP Filter Press Daily Online Inspection
              </h1>
              <p className="text-base mt-1 text-primary/80">
                Mechanical Daily Online Inspection
              </p>
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
              <div className="px-2 py-1.5">Tennant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
              <div className="px-2 py-1.5">Filter Press</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div>
              <div className="px-2 py-1.5">1x Fitter</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mechanical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Online Inspection</div>
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

        {/* INSPECTION SECTIONS */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>

          {inspectionSections.map((section, sectionIndex) => (
            <div
              key={section.equipmentName}
              className={sectionIndex < inspectionSections.length - 1 ? "border-b border-border" : ""}
            >
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Cog className="w-4 h-4 text-primary" />
                <span>{section.equipmentName}</span>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium w-[50%]">Task</th>
                    <th className="text-center px-2 py-2 font-medium w-[10%]">Serviceable</th>
                    <th className="text-center px-2 py-2 font-medium w-[10%]">Defective</th>
                    <th className="text-left px-4 py-2 font-medium w-[30%]">Comments</th>
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
                      <td className="px-4 py-2.5"><Input className="h-7 text-xs border-0 bg-transparent" placeholder="" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {section.tempGuidelines && (
                <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-b border-border">
                  <span className="font-semibold">Temperature Guidelines: </span>{section.tempGuidelines}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SHUTDOWN TRIGGERS */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">SHUTDOWN TRIGGERS – STOP & REPORT</span>
          </div>
          <div className="px-4 py-4 bg-destructive/5">
            <ul className="space-y-2 text-sm">
              {shutdownTriggers.map((trigger, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
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
