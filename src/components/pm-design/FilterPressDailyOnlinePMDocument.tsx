import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import {
  AlertTriangle,
  Shield,
  HardHat,
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Wrench,
  Zap,
  AlertCircle,
  Info,
  Lock,
  Cog,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface InspectionTask {
  task: string;
}

interface EquipmentSection {
  equipmentName: string;
  tasks: InspectionTask[];
  tempGuidelines?: string;
}

interface Hazard {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const hazardsList: Hazard[] = [
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "electrical", icon: <Zap className="w-4 h-4" />, label: "Electrical" },
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

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
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["mechanical"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards((prev) =>
      prev.includes(hazardId)
        ? prev.filter((id) => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner */}
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
        </div>

        {/* Header Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-primary" />
                Project / Site:
              </div>
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
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Work Order #:
              </div>
              <div className="px-2 py-1.5"></div>
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
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Daily</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* PREPARATION */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            PREPARATION
          </div>
          <div className="border-b border-border">
            <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              <span className="text-destructive font-bold">SAFETY PRECAUTIONS</span>
            </div>
            <div className="px-4 py-4 bg-destructive/5">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Conduct <span className="font-bold text-destructive">Take 5</span> and/or <span className="font-bold text-destructive">JSEA</span> as required.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Ensure isolations and/or 'live testing' safeguards are in place before commencing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Follow OEM instructions and site procedures as required.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-b border-border">
            <div className="bg-amber-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 font-bold">HAZARD IDENTIFICATION</span>
              <span className="text-xs text-muted-foreground ml-2">(Select all that apply)</span>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {hazardsList.map((hazard) => (
                  <Toggle
                    key={hazard.id}
                    pressed={selectedHazards.includes(hazard.id)}
                    onPressedChange={() => toggleHazard(hazard.id)}
                    className="data-[state=on]:bg-amber-500 data-[state=on]:text-white border border-border px-3 py-2 gap-2"
                    aria-label={`Toggle ${hazard.label} hazard`}
                  >
                    {hazard.icon}
                    <span className="text-sm font-medium">{hazard.label}</span>
                  </Toggle>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tools and PPE */}
        <div className="border-b border-border grid md:grid-cols-2">
          <div className="border-r border-border">
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              SPECIAL TOOLING REQUIRED
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Temperature Gun / IR Thermometer</span></li>
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Stethoscope / Listening Device</span></li>
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Info Tags</span></li>
              </ul>
            </div>
          </div>
          <div>
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <HardHat className="w-4 h-4 text-primary" />
              REQUIRED PPE
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Steel Cap Boots</span></li>
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Safety Glasses</span></li>
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Hearing Protection</span></li>
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Gloves</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* INSPECTION SECTIONS */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTION CHECKLIST
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
                    <th className="text-left px-4 py-2 font-medium w-[60%]">Task</th>
                    <th className="text-center px-2 py-2 font-medium w-[10%]">OK</th>
                    <th className="text-left px-4 py-2 font-medium w-[30%]">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-2.5 text-foreground">{task.task}</td>
                      <td className="text-center px-2 py-2.5"><Checkbox className="h-4 w-4" /></td>
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

        {/* IMMEDIATE SHUTDOWN TRIGGERS */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">IMMEDIATE SHUTDOWN TRIGGERS</span>
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
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Inspected By:</div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
            <div></div>
          </div>
        </div>

        {/* Revision History */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Revision History:</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Revision No.</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[35%]">Description</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Created</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Reviewed</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[20%]">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">0</td>
                <td className="border border-border px-3 py-2">Initial Release</td>
                <td className="border border-border px-3 py-2"></td>
                <td className="border border-border px-3 py-2"></td>
                <td className="border border-border px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
