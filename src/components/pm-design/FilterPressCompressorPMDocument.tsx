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

const inspectionSections: EquipmentSection[] = [
  {
    equipmentName: "Motor",
    tasks: [
      { task: "Observe motor and drive assembly for smooth rotation" },
      { task: "Check Motor Temperature" },
      { task: "Motor Temp Guidelines (Online): Normal: 40–75 °C | Monitor: 75–85 °C | Warning: 85–95 °C | Critical: >95 °C – investigate urgently" },
    ],
  },
  {
    equipmentName: "Bearings",
    tasks: [
      { task: "Check Temperature of all bearings" },
      { task: "Listen for unusual bearing noise" },
    ],
  },
  {
    equipmentName: "Integrated Refrigerant Dryer",
    tasks: [
      { task: "Monitor dryer inlet & outlet temperatures (via HMI/PLC)" },
      { task: "Listen for unusual dryer fan noise" },
      { task: "Check for condensate drain cycling activity" },
    ],
  },
  {
    equipmentName: "Cooling System",
    tasks: [
      { task: "Observe cooling fan(s) running normally" },
      { task: "Check airflow around compressor fins / heat exchangers" },
      { task: "Scan radiator or condenser area for hot spots" },
    ],
  },
];

const mechanicalAlerts = [
  "Motor or bearing temp >95 °C",
  "Persistent or increasing vibration",
  "Unusual knocking / grinding noises",
  "Coupling misalignment",
  "Reduced airflow over cooling surfaces",
  "Condensate drain failure or dryer performance issues",
  "Safety interlocks showing warnings",
];

export const FilterPressCompressorPMDocument = () => {
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
                Weekly Mechanical Filter Press Compressor Online Inspection
              </h1>
              <p className="text-base mt-1 text-primary/80">
                Mechanical Weekly Online Inspection
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
              <div className="px-2 py-1.5">Online Inspection</div>
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

        {/* PREPARATION AND INFORMATION */}
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

        {/* ONLINE MECHANICAL ALERTS */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">ONLINE MECHANICAL ALERTS – ACTION REQUIRED</span>
          </div>
          <div className="px-4 py-4 bg-destructive/5">
            <ul className="space-y-2 text-sm">
              {mechanicalAlerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span>{alert}</span>
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
