import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Eye,
  AlertCircle,
  CheckCircle2,
  Cog,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

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
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
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

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Procedure */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>Ensure equipment is isolated, locked out and tagged before commencing offline inspection.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <p>If not practical to repair, report the defect including materials required, trade discipline &amp; estimated repair time for the supervisor to raise a work request.</p>
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
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span>Yes</span></label>
                    <label className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span>No</span></label>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                  <span className="font-medium">Name:</span>
                  <Input className="h-7 text-xs" />
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                  <span className="font-medium">Date:</span>
                  <Input className="h-7 text-xs" type="date" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium w-40">Document update required:</span>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span>Yes</span></label>
                    <label className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span>No</span></label>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                  <span className="font-medium">Signature:</span>
                  <div className="h-8 border border-border rounded bg-muted/30"></div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
                  <span className="font-medium">PM Duration:</span>
                  <Input className="h-7 text-xs" placeholder="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revision History */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Revision History:</div>
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
