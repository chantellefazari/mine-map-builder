import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Zap,
  Cog,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface Task {
  task: string;
}

interface InspectionSection {
  equipmentId: string;
  equipmentName: string;
  tasks: Task[];
}

const inspectionData: InspectionSection[] = [
  {
    equipmentId: "FP-SB-001",
    equipmentName: "Filter Press Switch Board",
    tasks: [
      { task: "Check DB door seals for integrity" },
      { task: "Check all breakers are labelled correctly" },
      { task: "Check for any loose connections" },
      { task: "Check for any signs of overheating on breakers" },
      { task: "Check for any damage to internal components" },
      { task: "Check for any vermin or water ingress" },
      { task: "Check all cable glands are tight" },
      { task: "Check all doors are closing and sealing correctly" },
      { task: "Check all lights are working correctly" },
      { task: "Check the area is clean and clear of obstructions" },
    ],
  },
  {
    equipmentId: "FP-LCS-001",
    equipmentName: "Filter Press Local Control Station",
    tasks: [
      { task: "Check enclosure door seals for integrity" },
      { task: "Check all pushbuttons are labelled correctly" },
      { task: "Check all lights are working correctly" },
      { task: "Check the HMI is working correctly" },
      { task: "Check the area is clean and clear of obstructions" },
      { task: "Check all cable glands are tight" },
      { task: "Check all doors are closing and sealing correctly" },
    ],
  },
  {
    equipmentId: "FP-ISOL-001",
    equipmentName: "Filter Press Isolator",
    tasks: [
      { task: "Check enclosure door seals for integrity" },
      { task: "Check the isolator is labelled correctly" },
      { task: "Check the area is clean and clear of obstructions" },
      { task: "Check all cable glands are tight" },
      { task: "Check all doors are closing and sealing correctly" },
    ],
  },
  {
    equipmentId: "FP-CABLE-001",
    equipmentName: "Filter Press Cables",
    tasks: [
      { task: "Check all cables are supported correctly" },
      { task: "Check all cables are labelled correctly" },
      { task: "Check all cables are in good condition" },
      { task: "Check all cable trays are in good condition" },
      { task: "Check all cable glands are tight" },
    ],
  },
  {
    equipmentId: "FP-MOTOR-001",
    equipmentName: "Filter Press Motor",
    tasks: [
      { task: "Check motor fan is in good condition" },
      { task: "Check motor is labelled correctly" },
      { task: "Check motor is in good condition" },
      { task: "Check motor is clean and free of debris" },
      { task: "Check motor cable glands are tight" },
      { task: "Check motor is mounted correctly" },
    ],
  },
  {
    equipmentId: "FP-INST-001",
    equipmentName: "Filter Press Instruments",
    tasks: [
      { task: "Check instrument is labelled correctly" },
      { task: "Check instrument is in good condition" },
      { task: "Check instrument is clean and free of debris" },
      { task: "Check instrument cable glands are tight" },
      { task: "Check instrument is mounted correctly" },
    ],
  },
  {
    equipmentId: "FP-GUARD-001",
    equipmentName: "Filter Press Safety Guards",
    tasks: [
      { task: "Check all safety guards are in good condition" },
      { task: "Check all safety guards are labelled correctly" },
      { task: "Check all safety guards are mounted correctly" },
      { task: "Check all safety lanyards are in good condition" },
      { task: "Check all safety lanyards are labelled correctly" },
      { task: "Check all safety lanyards are mounted correctly" },
    ],
  },
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

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

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
                    <th className="border border-border text-left px-2 py-2 font-semibold w-[46%]">Task</th>
                    <th className="border border-border text-center px-2 py-2 font-semibold w-[10%]">Serviceable</th>
                    <th className="border border-border text-center px-2 py-2 font-semibold w-[10%]">Defective</th>
                    <th className="border border-border text-left px-2 py-2 font-semibold w-[34%]">Comments</th>
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

        {/* Comments */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Inspected By:</div>
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
