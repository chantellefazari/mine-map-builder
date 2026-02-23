import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Cog,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

interface TaskItem {
  task: string;
}

interface EquipmentSection {
  equipmentId: string;
  equipmentName: string;
  tasks: TaskItem[];
}

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "FP-01",
    equipmentName: "Filter Press",
    tasks: [
      { task: "Check general condition of the filter press structure" },
      { task: "Inspect filter cloths for wear, damage, or blinding" },
      { task: "Check plate alignment and condition" },
      { task: "Inspect plate shifting mechanism for proper operation" },
      { task: "Check hydraulic cylinder and hoses for leaks or damage" },
      { task: "Inspect safety interlocks and emergency stop functions" },
      { task: "Check drip trays and containment areas for leaks or spills" },
      { task: "Inspect filtrate discharge points for blockages or leaks" },
      { task: "Check air blow system for proper operation (if equipped)" },
      { task: "Inspect cake discharge system for proper operation" },
    ],
  },
  {
    equipmentId: "FP-02",
    equipmentName: "Hydraulic Unit",
    tasks: [
      { task: "Check hydraulic oil level" },
      { task: "Inspect hydraulic pump for leaks or unusual noise" },
      { task: "Check hydraulic pressure gauges for correct readings" },
      { task: "Inspect hydraulic hoses and fittings for leaks or damage" },
      { task: "Check hydraulic oil cooler for proper operation" },
      { task: "Inspect hydraulic filters and replace if necessary" },
      { task: "Check hydraulic relief valve setting" },
      { task: "Inspect hydraulic accumulator for proper charge (if equipped)" },
    ],
  },
  {
    equipmentId: "FP-03",
    equipmentName: "Feed System",
    tasks: [
      { task: "Check feed pump for leaks or unusual noise" },
      { task: "Inspect feed pump suction and discharge lines for leaks" },
      { task: "Check feed pump motor for proper operation" },
      { task: "Inspect feed tank level and condition" },
      { task: "Check feed tank agitator for proper operation (if equipped)" },
      { task: "Inspect feed line pressure gauges for correct readings" },
      { task: "Check feed line flow meters for accuracy" },
      { task: "Inspect feed line valves for proper operation" },
    ],
  },
  {
    equipmentId: "FP-04",
    equipmentName: "Ancillary Equipment",
    tasks: [
      { task: "Check air compressor for proper operation (if equipped)" },
      { task: "Inspect air lines and fittings for leaks (if equipped)" },
      { task: "Check polymer make-up system for proper operation (if equipped)" },
      { task: "Inspect polymer dosing pumps for leaks or damage (if equipped)" },
      { task: "Check cake conveyor system for proper operation (if equipped)" },
      { task: "Inspect conveyor belt for wear or damage (if equipped)" },
      { task: "Check conveyor belt alignment (if equipped)" },
      { task: "Inspect conveyor belt scrapers for proper operation (if equipped)" },
    ],
  },
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
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Filter Press Daily Mechanical Offline Inspection (Fitter)");

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
                Tenant Creek Filtration Area - Filter Press
              </h1>
              <p className="text-base mt-1 text-primary/80">
                Mechanical Daily Offline Inspection (Fitter)
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
        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="Filter Press"
          pmGroup="Mechanical"
          pmType="Offline Inspection (Fitter)"
          frequency="Daily"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* INSPECTION TABLES */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
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
                    <th className="border border-border text-left px-4 py-2 font-medium w-[46%]">Task</th>
                    <th className="border border-border text-center px-2 py-2 font-medium w-[10%]">Serviceable</th>
                    <th className="border border-border text-center px-2 py-2 font-medium w-[10%]">Defective</th>
                    <th className="border border-border text-left px-4 py-2 font-medium w-[34%]">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="border-b border-border hover:bg-muted/30">
                      <td className="border border-border px-4 py-2.5 text-foreground">{task.task}</td>
                      <td className="border border-border text-center px-2 py-2.5">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                      </td>
                      <td className="border border-border text-center px-2 py-2.5">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                      </td>
                      <td className="border border-border px-4 py-4"></td>
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
