import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface Task {
  task: string;
  hasInput?: boolean;
  inputLabel?: string;
}

interface InspectionSection {
  equipmentName: string;
  tasks: Task[];
}

const inspectionData: InspectionSection[] = [
  {
    equipmentName: "Elution Tank",
    tasks: [
      { task: "Check for leaks (seals, flanges, body)" },
      { task: "Inspect tank supports and structure" },
      { task: "Check level indicators for functionality" },
    ],
  },
  {
    equipmentName: "Elution Pump",
    tasks: [
      { task: "Inspect pump for leaks (seals, flanges, body)" },
      { task: "Check pump mounting and base" },
      { task: "Inspect coupling and guard" },
      { task: "Check motor fan and cowling" },
      { task: "Check motor terminal box for integrity" },
      { task: "Check pressure gauge", hasInput: true, inputLabel: "Pressure (kPa):" },
    ],
  },
  {
    equipmentName: "Acid Tank",
    tasks: [
      { task: "Check for leaks (seals, flanges, body)" },
      { task: "Inspect tank supports and structure" },
      { task: "Check level indicators for functionality" },
    ],
  },
  {
    equipmentName: "Acid Pump",
    tasks: [
      { task: "Inspect pump for leaks (seals, flanges, body)" },
      { task: "Check pump mounting and base" },
      { task: "Inspect coupling and guard" },
      { task: "Check motor fan and cowling" },
      { task: "Check motor terminal box for integrity" },
      { task: "Check pressure gauge", hasInput: true, inputLabel: "Pressure (kPa):" },
    ],
  },
  {
    equipmentName: "Elution Valves",
    tasks: [
      { task: "Inspect valve body for leaks" },
      { task: "Check valve actuator and linkages" },
      { task: "Inspect position indicators" },
    ],
  },
  {
    equipmentName: "Elution Piping",
    tasks: [
      { task: "Inspect pipe supports and hangers" },
      { task: "Check pipe for corrosion or damage" },
      { task: "Inspect flanges and fittings for leaks" },
    ],
  },
  {
    equipmentName: "Elution Instruments",
    tasks: [
      { task: "Check instrument mounting and protection" },
      { task: "Inspect wiring and connections" },
      { task: "Verify instrument readings", hasInput: true, inputLabel: "Reading:" },
    ],
  },
];

export const AcidElutionPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Elution Area - Acid Wash & Elution" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">Elution</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Work Order #:</div><div className="px-2 py-1.5"></div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Mechanical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection (Fitter)</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">Weekly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-left font-semibold w-[50%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th>
                <th className="border border-border px-2 py-2 text-left font-semibold w-[34%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {inspectionData.map((section, sectionIndex) => (
                <>
                  <tr key={`section-${sectionIndex}`} className="bg-primary/10">
                    <td colSpan={4} className="border border-border px-2 py-2 font-semibold text-primary">{section.equipmentName}</td>
                  </tr>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={`task-${sectionIndex}-${taskIndex}`} className="hover:bg-muted/30">
                      <td className="border border-border px-2 py-2">{task.task}</td>
                      <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></td>
                      <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></td>
                      <td className="border border-border px-2 py-2">
                        {task.hasInput ? (
                          <div className="flex items-center gap-1"><span className="text-xs text-muted-foreground">{task.inputLabel}</span></div>
                        ) : (
                          <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock />
      </div>
    </div>
  );
};