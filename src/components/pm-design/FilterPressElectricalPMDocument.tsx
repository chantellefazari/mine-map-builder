import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Lock,
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

// --- INSPECTION DATA FROM DOCUMENT ---

const filter1PLCCabinet: EquipmentSection = {
  equipmentId: "FP1-PLC",
  equipmentName: "Filter 1 PLC Cabinet",
  tasks: [
    { task: "Inspect HMI screen for alarms or error messages" },
    { task: "Confirm no abnormal flashing, errors, or communication failures" },
    { task: "Clean inside of Cabinet and check sealing" },
    { task: "Clean Cabinet Filters" },
    { task: "Ensure no open holes in Gland Plate" },
    { task: "Check Drawings are present and Readable" },
    { task: "Check Cabinet A/C is operating Correctly and is clean" },
    { task: "Ensure all cable entries are secure and are wrapped in Denso Tape" },
    { task: "Clean Outside of Cabinet including the Top" },
    { task: "Check for any heat damage on cables inside of cabinet" },
  ],
};

const filter2PLCCabinet: EquipmentSection = {
  equipmentId: "FP2-PLC",
  equipmentName: "Filter 2 PLC Cabinet",
  tasks: [
    { task: "Inspect HMI screen for alarms or error messages" },
    { task: "Confirm no abnormal flashing, errors, or communication failures" },
    { task: "Clean inside of Cabinet and check sealing" },
    { task: "Clean Cabinet Filters" },
    { task: "Ensure no open holes in Gland Plate" },
    { task: "Check Drawings are present and Readable" },
    { task: "Check Cabinet A/C is operating Correctly and is clean" },
    { task: "Ensure all cable entries are secure and are wrapped in Denso Tape" },
    { task: "Clean Outside of Cabinet including the Top" },
    { task: "Check for any heat damage on cables inside of cabinet" },
  ],
};

const conveyorPLCCabinet: EquipmentSection = {
  equipmentId: "CV-PLC",
  equipmentName: "Conveyor PLC Cabinet",
  tasks: [
    { task: "Inspect HMI screen for alarms or error messages" },
    { task: "Confirm no abnormal flashing, errors, or communication failures" },
    { task: "Clean inside of Cabinet and check sealing" },
    { task: "Clean Cabinet Filters" },
    { task: "Ensure no open holes in Gland Plate" },
    { task: "Check Drawings are present and Readable" },
    { task: "Check Cabinet A/C is operating Correctly and is clean" },
    { task: "Ensure all cable entries are secure and are wrapped in Denso Tape" },
    { task: "Clean Outside of Cabinet including the Top" },
    { task: "Clean VFDs" },
    { task: "Check for any heat damage on cables inside of cabinet" },
  ],
};

const mcc125: EquipmentSection = {
  equipmentId: "MCC-125",
  equipmentName: "MCC 125",
  tasks: [
    { task: "Clean Inside of Cabinet and check sealing" },
    { task: "Clean Cabinet Filters" },
    { task: "Ensure no open holes in Gland Plate" },
    { task: "Check Drawings are present and Readable" },
    { task: "Ensure all cable entries are secure and are wrapped in Denso Tape" },
    { task: "Clean Outside of Cabinet including the Top" },
    { task: "Lubricate all push buttons" },
    { task: "Check Labelling is correct" },
    { task: "Check for any heat damage on cables inside of cabinet" },
  ],
};

const db103: EquipmentSection = {
  equipmentId: "DB-103",
  equipmentName: "DB-103",
  tasks: [
    { task: "Clean Inside of Cabinet and check sealing" },
    { task: "Clean Cabinet Filters" },
    { task: "Ensure no open holes in Gland Plate" },
    { task: "Check Drawings are present and Readable" },
    { task: "Ensure all cable entries are secure and are wrapped in Denso Tape" },
  ],
};

const db106: EquipmentSection = {
  equipmentId: "DB-106",
  equipmentName: "DB-106",
  tasks: [
    { task: "Clean Inside of Cabinet and check sealing" },
    { task: "Clean Cabinet Filters" },
    { task: "Ensure no open holes in Gland Plate" },
    { task: "Check Drawings are present and Readable" },
    { task: "Ensure all cable entries are secure and are wrapped in Denso Tape" },
    { task: "Clean Outside of Cabinet including the Top" },
    { task: "Lubricate all push buttons" },
    { task: "Check Labelling is correct" },
    { task: "Check for any heat damage on cables inside of cabinet" },
  ],
};

const sumpPump: EquipmentSection = {
  equipmentId: "FP-SP",
  equipmentName: "Sump Pump",
  tasks: [
    { task: "Check Motor is secured" },
    { task: "Check Motor Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
    { task: "Ensure Terminal Box is wrapped in Denso Tape" },
  ],
};

const filter1ExtractionConveyor: EquipmentSection = {
  equipmentId: "FP1-EXT",
  equipmentName: "Filter 1 Extraction Conveyor",
  tasks: [
    { task: "Check Motor is secured" },
    { task: "Check Motor Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
    { task: "Ensure Terminal Box is wrapped in Denso Tape" },
    { task: "Check Under speed sensor is secured and operational. Denso plug" },
    { task: "Check, clean and lubricate Pull wire Switches" },
    { task: "Check connection points and tension of Pull wires" },
  ],
};

const filter2ExtractionConveyor: EquipmentSection = {
  equipmentId: "FP2-EXT",
  equipmentName: "Filter 2 Extraction Conveyor",
  tasks: [
    { task: "Check Motor is secured" },
    { task: "Check Motor Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
    { task: "Ensure Terminal Box is wrapped in Denso Tape" },
    { task: "Check Under speed sensor is secured and operational. Denso plug" },
    { task: "Check, clean and lubricate Pull wire Switches" },
    { task: "Check connection points and tension of Pull wires" },
  ],
};

const collectionConveyor: EquipmentSection = {
  equipmentId: "FP-CC",
  equipmentName: "Collection Conveyor",
  tasks: [
    { task: "Check Motor is secured" },
    { task: "Check Motor Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
    { task: "Ensure Terminal Box is wrapped in Denso Tape" },
    { task: "Check Under speed sensor is secured and operational. Denso plug" },
    { task: "Check, clean and lubricate Pull wire Switches" },
    { task: "Check connection points and tension of Pull wires" },
  ],
};

const radialStacker: EquipmentSection = {
  equipmentId: "FP-RS",
  equipmentName: "Radial Stacker",
  tasks: [
    { task: "Check Drive Motors are secured" },
    { task: "Check Motor 1 Temperatures (DE & NDE)" },
    { task: "Check Motor 2 Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
    { task: "Ensure Terminal Box is wrapped in Denso Tape" },
    { task: "Check Under speed sensor is secured and operational. Denso plug" },
    { task: "Check, clean and lubricate Pull wire Switches" },
    { task: "Check connection points and tension of Pull wires" },
    { task: "Check Turn table limit switches" },
  ],
};

const filter1Operational: EquipmentSection = {
  equipmentId: "FP1-OPS",
  equipmentName: "Filter 1 – Operational Checks",
  tasks: [
    { task: "Clean and lubricate all limit switches for plate position" },
    { task: "Clean Water conductivity probe" },
    { task: "Check and clean Hydraulic Pressure transmitters" },
    { task: "Check and Clean Feed Pressure Transmitter" },
    { task: "Check operation of all actuated valves" },
  ],
};

const filter1FeedPump: EquipmentSection = {
  equipmentId: "FP1-FP",
  equipmentName: "Filter 1 Feed Pump",
  tasks: [
    { task: "Check Motor is secured" },
    { task: "Check Motor Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
  ],
};

const filter2Operational: EquipmentSection = {
  equipmentId: "FP2-OPS",
  equipmentName: "Filter 2 – Operational Checks",
  tasks: [
    { task: "Clean and lubricate all limit switches for plate position" },
    { task: "Clean Water conductivity probe" },
    { task: "Check and clean Hydraulic Pressure transmitters" },
    { task: "Check and Clean Feed Pressure Transmitter" },
    { task: "Check operation of all actuated valves" },
  ],
};

const filter2FeedPump: EquipmentSection = {
  equipmentId: "FP2-FP",
  equipmentName: "Filter 2 Feed Pump",
  tasks: [
    { task: "Check Motor is secured" },
    { task: "Check Motor Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
  ],
};

const filter1HydraulicMotors: EquipmentSection = {
  equipmentId: "FP1-HYD",
  equipmentName: "Filter 1 Hydraulic Motors",
  tasks: [
    { task: "Check Motors are secured" },
    { task: "Check Motor 1 Temperatures (DE & NDE)" },
    { task: "Check Motor 2 Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
  ],
};

const filter2HydraulicMotors: EquipmentSection = {
  equipmentId: "FP2-HYD",
  equipmentName: "Filter 2 Hydraulic Motors",
  tasks: [
    { task: "Check Motors are secured" },
    { task: "Check Motor 1 Temperatures (DE & NDE)" },
    { task: "Check Motor 2 Temperatures (DE & NDE)" },
    { task: "Check no unusual noise coming from motor concentrating on Bearing Locations" },
  ],
};

const inspectionData: EquipmentSection[] = [
  filter1PLCCabinet,
  filter2PLCCabinet,
  conveyorPLCCabinet,
  mcc125,
  db103,
  db106,
  sumpPump,
  filter1ExtractionConveyor,
  filter2ExtractionConveyor,
  collectionConveyor,
  radialStacker,
  filter1Operational,
  filter1FeedPump,
  filter2Operational,
  filter2FeedPump,
  filter1HydraulicMotors,
  filter2HydraulicMotors,
];


export const FilterPressElectricalPMDocument = () => {
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
                Tennant Creek Filtration Area – Filter Press
              </h1>
              <p className="text-base mt-1 text-primary/80">
                Weekly Electrical Online Inspection (Electrician)
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
              <div className="px-2 py-1.5">Filter Press</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Electrician (1.5 hrs)</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Online Visual Inspection</div>
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

        {/* Task Description */}
        <div className="border-b border-border bg-primary/5 p-4">
          <p className="text-sm font-medium text-foreground">
            <span className="font-bold text-primary">TASK:</span> Perform a thorough visual inspection of the equipment listed in the areas below, paying particular attention to switchboards, LCS enclosures, isolators, cables, tray, indication lamps, motors, instruments, safety guards / lanyards.
          </p>
        </div>

        {/* PREPARATION AND INFORMATION */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            PREPARATION AND INFORMATION
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
                  <span>Ensure isolations and/or 'live testing' safeguards are in place before commencing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Follow OEM instructions and site procedures as required.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 px-4 pb-4">
            <HardHat className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-semibold">Minimum PPE:</span> Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as per task or as required.
            </p>
          </div>
        </div>


        {/* DETAILED EQUIPMENT INSPECTIONS */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            DETAILED EQUIPMENT INSPECTIONS
          </div>

          {inspectionData.map((section, sectionIndex) => (
            <div
              key={section.equipmentId}
              className={sectionIndex < inspectionData.length - 1 ? "border-b border-border" : ""}
            >
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
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

        {/* Comments */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS</div>
          <div className="p-4">
            <Textarea placeholder="Enter any additional comments, defects noted, or repairs made..." className="min-h-[100px]" />
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
                    <label className="flex items-center gap-2"><Checkbox className="h-4 w-4" /><span>Yes</span></label>
                    <label className="flex items-center gap-2"><Checkbox className="h-4 w-4" /><span>No</span></label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-40">Document update required:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2"><Checkbox className="h-4 w-4" /><span>Yes</span></label>
                    <label className="flex items-center gap-2"><Checkbox className="h-4 w-4" /><span>No</span></label>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Name:</span>
                  <Input className="flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Signature:</span>
                  <div className="flex-1 h-10 border border-border rounded-md bg-muted/30"></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Date:</span>
                  <Input className="flex-1" type="date" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certification */}
        <div className="border-b border-border p-4 text-sm text-muted-foreground italic bg-muted/30">
          This certifies that the electrical equipment / installation as identified in this report, to the extent it is affected by the electrical work, has been tested to ensure it is electrically safe and is in accordance with the requirements of the wiring rules and other applicable standards.
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
