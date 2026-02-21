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
  Eye,
  Zap,
  AlertCircle,
  CheckCircle2,
  Info,
  Cog,
  Volume2,
  CircleDot,
  MoveHorizontal,
  Thermometer,
  Gauge,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface InspectionTask {
  task: string;
}

interface EquipmentSection {
  equipmentId: string;
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
  { id: "noise", icon: <Volume2 className="w-4 h-4" />, label: "Noise" },
  { id: "pressure", icon: <CircleDot className="w-4 h-4" />, label: "Pressure" },
  { id: "pinch-points", icon: <MoveHorizontal className="w-4 h-4" />, label: "Pinch Points" },
  { id: "hot-surfaces", icon: <Thermometer className="w-4 h-4" />, label: "Hot Surfaces" },
  { id: "hydraulic", icon: <Gauge className="w-4 h-4" />, label: "Hydraulic" },
];

const filter1PlatesStructural: EquipmentSection = {
  equipmentId: "FP-1",
  equipmentName: "Filter 1 – Plates and Structural",
  tasks: [
    { task: "Check plates for cracks, warping, or chips" },
    { task: "Inspect plate sealing edges" },
    { task: "Check handles and lugs for damage" },
    { task: "Inspect tie bars for straightness and corrosion" },
    { task: "Examine main beam and frame for deflection or cracks" },
    { task: "Replace faulty pneumatic plate shakers" },
  ],
};

const filter1Hydraulic: EquipmentSection = {
  equipmentId: "FP-1-HYD",
  equipmentName: "Filter 1 – Hydraulic",
  tasks: [
    { task: "Inspect cylinder rods for scoring or damage" },
    { task: "Check rod wipers and seals" },
    { task: "Confirm hose clamps and supports are secure" },
  ],
};

const filter1PlateShifter: EquipmentSection = {
  equipmentId: "FP-1-PS",
  equipmentName: "Filter 1 – Plate Shifter",
  tasks: [
    { task: "Inspect carriage wheels for wear or binding" },
    { task: "Check shifter rails for corrosion or misalignment" },
    { task: "Inspect chain tension" },
    { task: "Verify shifter operates smoothly when manually moved" },
  ],
};

const filter1Extraction: EquipmentSection = {
  equipmentId: "FP-1-EXT",
  equipmentName: "Filter 1 Extraction Conveyor",
  tasks: [
    { task: "Inspect and adjust skirts" },
    { task: "Replace damaged rollers" },
    { task: "Replace damaged roller frames" },
  ],
};

const filter2PlatesStructural: EquipmentSection = {
  equipmentId: "FP-2",
  equipmentName: "Filter 2 – Plates and Structural",
  tasks: [
    { task: "Check plates for cracks, warping, or chips" },
    { task: "Inspect plate sealing edges" },
    { task: "Check handles and lugs for damage" },
    { task: "Inspect tie bars for straightness and corrosion" },
    { task: "Examine main beam and frame for deflection or cracks" },
    { task: "Replace faulty pneumatic plate shakers" },
  ],
};

const filter2Hydraulic: EquipmentSection = {
  equipmentId: "FP-2-HYD",
  equipmentName: "Filter 2 – Hydraulic",
  tasks: [
    { task: "Inspect cylinder rods for scoring or damage" },
    { task: "Check rod wipers and seals" },
    { task: "Confirm hose clamps and supports are secure" },
  ],
};

const filter2PlateShifter: EquipmentSection = {
  equipmentId: "FP-2-PS",
  equipmentName: "Filter 2 – Plate Shifter",
  tasks: [
    { task: "Inspect carriage wheels for wear or binding" },
    { task: "Check shifter rails for corrosion or misalignment" },
    { task: "Inspect chain tension and sprockets" },
    { task: "Verify shifter operates smoothly when manually moved" },
  ],
};

const filter2Extraction: EquipmentSection = {
  equipmentId: "FP-2-EXT",
  equipmentName: "Filter 2 Extraction Conveyor",
  tasks: [
    { task: "Inspect and adjust skirts" },
    { task: "Replace damaged rollers" },
    { task: "Replace damaged roller frames" },
  ],
};

const collectorConveyor: EquipmentSection = {
  equipmentId: "FP-CC",
  equipmentName: "Collector Conveyor (If Available)",
  tasks: [
    { task: "Inspect and adjust skirts" },
    { task: "Replace damaged rollers" },
    { task: "Replace damaged roller frames" },
  ],
};

const radialStackerConveyor: EquipmentSection = {
  equipmentId: "FP-RSC",
  equipmentName: "Radial Stacker Conveyor (If Available)",
  tasks: [
    { task: "Inspect and adjust skirts" },
    { task: "Replace damaged rollers" },
    { task: "Replace damaged roller frames" },
  ],
};

const inspectionData: EquipmentSection[] = [
  filter1PlatesStructural,
  filter1Hydraulic,
  filter1PlateShifter,
  filter1Extraction,
  filter2PlatesStructural,
  filter2Hydraulic,
  filter2PlateShifter,
  filter2Extraction,
  collectorConveyor,
  radialStackerConveyor,
];

const immediateAttentionTriggers = [
  "Plate cracks or damaged sealing edges",
  "Cylinder rod scoring or seal failure",
  "Chain elongation >3%",
  "Seized or hot bearings",
  "Misaligned frame or tie bars",
  "Visible hydraulic leaks",
];

export const FilterPressDailyOfflinePMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards((prev) =>
      prev.includes(hazardId)
        ? prev.filter((id) => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  return (
    <div className="bg-background min-h-full">
      {/* Document Header */}
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
                Tenant Creek Filtration Area - Filter Press
              </h1>
              <p className="text-base mt-1 text-primary/80">
                Mechanical Daily Offline Inspection (Fitter)
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
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div>
              <div className="px-2 py-1.5">Filter Press</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
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
              <div className="px-2 py-1.5">Offline Inspection (Fitter)</div>
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

        {/* PREPARATION AND INFORMATION */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            PREPARATION AND INFORMATION
          </div>

          {/* Scope */}
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              SCOPE
            </div>
            <div className="px-4 py-3 text-sm leading-relaxed">
              <p className="font-medium mb-2">Daily Offline Inspection – Filter Press Area</p>
              <p className="text-muted-foreground">
                To safely carry out mechanical inspection of filter press equipment for signs of damage or potential
                failures that may require maintenance attention. Equipment must be isolated and locked out before
                commencing offline inspection tasks. When a defect is identified and it is safe and practical to repair,
                do so and note in the comments section. Otherwise, report the defect including materials required, trade
                discipline &amp; estimated repair time for the supervisor to raise a work request.
              </p>
            </div>
          </div>

          {/* Safety */}
          <div className="border-b border-border">
            <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              <span className="text-destructive font-bold">SAFETY</span>
            </div>
            <div className="px-4 py-4 bg-destructive/5">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  Before commencing this work complete a{" "}
                  <span className="font-bold text-destructive">TAKE 5</span> every time to check that no abnormal
                  conditions exist.
                </p>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <HardHat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Follow safety procedures at all times. Isolate equipment where required &amp; ensure use of correct
                  PPE.
                </p>
              </div>
              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                <Zap className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-destructive">
                  Under no circumstances will personnel place themselves in an unsafe position while carrying out these
                  inspection tasks.
                </p>
              </div>
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
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Standard hand tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Temperature gun</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Torch</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Marker tags</span>
                </li>
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
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Steel Cap Boots</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Hard Hat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Safety Glasses</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Hearing Protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" />
                  <span>Gloves (when required)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="border-b border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">RISK ASSESSMENT</span>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Complete one of the following before starting work:</p>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>Take 5</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>JHA</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>SWMS</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>Other</span>
              </label>
            </div>
          </div>
        </div>

        {/* Procedure */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>
                Ensure equipment is isolated, locked out and tagged before commencing offline inspection.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>
                Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>
                When a defect is identified and it is safe and practical to repair the defect, please do so and make a
                note of it in the comments section.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <p>
                If not practical to repair, report the defect including materials required, trade discipline &amp;
                estimated repair time for the supervisor to raise a work request.
              </p>
            </div>
          </div>
        </div>

        {/* INSPECTION TABLES */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>

          {inspectionData.map((section, sectionIndex) => (
            <div
              key={section.equipmentId}
              className={sectionIndex < inspectionData.length - 1 ? "border-b border-border" : ""}
            >
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
                      <td className="px-4 py-2.5">
                        <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Immediate Attention Triggers */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-bold">IMMEDIATE ATTENTION TRIGGERS</span>
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm">
              {immediateAttentionTriggers.map((trigger, i) => (
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
          <div className="p-4">
            <Textarea
              placeholder="Enter any additional comments, defects noted, or repairs made..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border">SIGN OFF</div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium w-40">Follow up work required:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-40">Document update required:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Name:</span>
                  <Input className="flex-1" placeholder="" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Signature:</span>
                  <div className="flex-1 h-10 border border-border rounded-md bg-muted/30"></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Date:</span>
                  <Input className="flex-1" placeholder="" type="date" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">PM Duration:</span>
                  <Input className="flex-1" placeholder="" />
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md text-sm text-amber-700">
              REMOVE TAG AND RETURN TO OPERATION IF NO FAULT FOUND
            </div>
          </div>
        </div>

        {/* Approval */}
        <div className="border-b border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">APPROVAL</span>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2 font-medium w-1/4">Role</th>
                  <th className="text-left px-4 py-2 font-medium w-1/4">Name</th>
                  <th className="text-left px-4 py-2 font-medium w-1/4">Sign</th>
                  <th className="text-left px-4 py-2 font-medium w-1/4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium">Supervisor</td>
                  <td className="px-4 py-3"><Input className="h-8" /></td>
                  <td className="px-4 py-3"><div className="h-8 border border-border rounded bg-muted/30"></div></td>
                  <td className="px-4 py-3"><Input className="h-8" type="date" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Revision History */}
        <div>
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">REVISION HISTORY</div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2 font-medium w-20">Rev No.</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Created</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Reviewed</th>
                  <th className="text-left px-4 py-2 font-medium w-28">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">Initial Release</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
