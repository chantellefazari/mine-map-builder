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
    equipmentName: "Motor and Drive Assembly",
    tasks: [
      { task: "Inspect motor exterior for dust buildup or overheating marks" },
      { task: "Manually rotate shaft (if accessible) – check for smooth rotation" },
      { task: "Inspect motor mounting bolts and base tightness" },
      { task: "Check coupling or belt alignment" },
      { task: "Inspect flexible coupling insert for cracks or wear" },
      { task: "Inspect motor cooling fan and shroud condition" },
    ],
  },
  {
    equipmentName: "Compressor Element",
    tasks: [
      { task: "Inspect air end housing for oil leaks" },
      { task: "Check mounting bolts for tightness" },
      { task: "Inspect inlet valve linkage and movement" },
      { task: "Inspect discharge piping connections" },
      { task: "Check vibration isolators / mounts condition" },
    ],
  },
  {
    equipmentName: "Bearings & Rotating Components",
    tasks: [
      { task: "Inspect exposed bearings for grease leakage" },
      { task: "Check bearing housings for discoloration" },
      { task: "Verify bearing locking collars or retaining hardware" },
      { task: "Check shaft seals condition" },
      { task: "Re-grease bearings if applicable" },
      { task: "Record bearing condition and trend observations" },
    ],
  },
  {
    equipmentName: "Drive Couplings and Belts",
    tasks: [
      { task: "Inspect belts for cracks, glazing, fraying" },
      { task: "Check belt tension" },
      { task: "Inspect pulley wear and alignment" },
      { task: "Inspect rigid or flexible coupling for wear" },
    ],
  },
  {
    equipmentName: "Integrated Refrigerant Dryer",
    tasks: [
      { task: "Inspect and clean dryer condenser and evaporator coils" },
      { task: "Inspect refrigerant lines for oil residue or leaks" },
      { task: "Check dryer fan blades and motor mounting" },
      { task: "Inspect automatic condensate drain assembly" },
      { task: "Verify drain solenoid condition" },
      { task: "Check insulation integrity" },
    ],
  },
  {
    equipmentName: "Cooling System",
    tasks: [
      { task: "Clean radiator / oil cooler fins" },
      { task: "Inspect cooling fan blades for cracks" },
      { task: "Check fan motor mounting bolts" },
      { task: "Inspect airflow path for obstructions" },
      { task: "Clean internal cabinet dust buildup" },
      { task: "Clean all Filters" },
    ],
  },
  {
    equipmentName: "Structure",
    tasks: [
      { task: "Inspect base frame for cracks or corrosion" },
      { task: "Check anchor bolts tightness" },
      { task: "Inspect vibration pads or anti-vibration mounts" },
      { task: "Inspect enclosure panels and hinges" },
    ],
  },
];

const mechanicalFindings = [
  "Excessive shaft play",
  "Bearing roughness during manual rotation",
  "Oil leakage from air end",
  "Cracked coupling insert",
  "Loose anchor bolts",
  "Damaged vibration mounts",
  "Refrigerant oil traces at fittings",
];

export const FilterPressCompressorOfflinePMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["mechanical", "lockout"]);

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
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">
                Weekly Mechanical Filter Press Air Compressor Offline Inspection
              </h1>
              <p className="text-base mt-1 text-primary/80">
                Mechanical Weekly Offline Inspection
              </p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
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
              <div className="px-2 py-1.5">Filter Press – Air Compressor</div>
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
              <div className="px-2 py-1.5">Offline Inspection</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Weekly</div>
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

          {/* Safety */}
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
                  <span>Ensure equipment is <span className="font-bold text-destructive">isolated and locked out</span> before commencing offline inspection.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Follow OEM instructions and site procedures as required.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Hazard Identification */}
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
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Standard Mechanical Tool Kit</span></li>
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Grease Gun</span></li>
                <li className="flex items-center gap-3"><Checkbox className="h-4 w-4" defaultChecked /><span>Belt Tension Gauge</span></li>
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
                    <th className="text-left px-4 py-2 font-medium w-[50%]">Task</th>
                    <th className="text-center px-2 py-2 font-medium w-[8%]">✓</th>
                    <th className="text-center px-2 py-2 font-medium w-[8%]">✗</th>
                    <th className="text-left px-4 py-2 font-medium w-[34%]">Comments</th>
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
            </div>
          ))}
        </div>

        {/* OFFLINE MECHANICAL FINDINGS */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">OFFLINE MECHANICAL FINDINGS – IMMEDIATE ACTION</span>
          </div>
          <div className="px-4 py-4 bg-destructive/5">
            <ul className="space-y-2 text-sm">
              {mechanicalFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span>{finding}</span>
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
