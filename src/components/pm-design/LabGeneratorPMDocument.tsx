import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; hasInput?: boolean; inputLabel?: string; }
interface EquipmentSection { equipmentId: string; equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "",
    equipmentName: "Visual Running Checks",
    tasks: [
      { task: "Check all gauges" },
      { task: "Check Engine Protection Relay, record fault history, Engine Hours etc.", hasInput: true, inputLabel: "Engine Hours:" },
      { task: "Walk around Unit - Visually Inspect/Listen for Damage/Defects" },
      { task: "Open all doors - Visually Inspect/Listen for Damage/Defects i.e Excessive vibration, loose/rattling components or panels, leaking exhaust/Turbo etc." },
      { task: "Check Engine Guards are in place and compliant" },
      { task: "Push Emergency Stop Button to Shut Unit Down" },
      { task: "Check Exhaust Flap closes" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Fire Extinguisher",
    tasks: [
      { task: "Check fire extinguisher charged and mounted securely" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Electrical Offline",
    tasks: [
      { task: "Check battery Isolator is Operational & Lockable" },
      { task: "Check battery & battery Cabling" },
      { task: "Check battery terminals are tight and corrosion free" },
      { task: "Check condition of all battery, starter and alternator cables" },
      { task: "Check wiring harnesses are securely mounted and undamaged" },
      { task: "Check battery electrolyte level and that batteries are mounted securely" },
      { task: "Check Engine and Generator Mounts" },
      { task: "Check Generator Cabling - look for signs of damage, chaffing, secured etc." },
      { task: "Check Generator covers and guards are all in place" },
      { task: "Check Main Switch/ Circuit Breaker is Operational and Lockable" },
      { task: "Check Main Switch/ Circuit Breaker is Labelled" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "General",
    tasks: [
      { task: "Check all engine hoses, pipes and clamps for damage" },
      { task: "Check engine alternator and fan v-belt adjustment" },
      { task: "Check Engine alternator mounted securely" },
      { task: "Check for engine oil leaks" },
      { task: "Check fuel hoses mounted securely, replace any chafed or worn hoses" },
      { task: "Check/drain Fuel Filters" },
      { task: "Check all radiator hoses, clamps and coolant lines for deterioration or damage" },
      { task: "Check radiator for damage, blockage and leaks" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Service Items",
    tasks: [
      { task: "Check outer air filter and clean if necessary" },
      { task: "Check/Top up Coolant level" },
      { task: "Check/Top up Engine Oil level" },
      { task: "Prestart Check, Close all doors & Restart" },
      { task: "Clean Pre-filter" },
    ]
  },
  {
    equipmentId: "",
    equipmentName: "Restart Unit - Electrical (Online)",
    tasks: [
      { task: "Check all gauges" },
      { task: "Check Engine Protection Relay" },
      { task: "Check operation of all emergency stop switches (if equipped)" },
    ]
  },
];

export const LabGeneratorPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek - Lab Generator" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div>
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
              <div className="px-2 py-1.5">Lab Generator</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div>
              <div className="px-2 py-1.5">1x Fitter (2 hrs)</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mechanical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div>
              <div className="px-2 py-1.5 font-medium">Weekly</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          
          {inspectionData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border-b border-border last:border-b-0">
              <div className="bg-muted/50 px-4 py-2 border-b border-border">
                <span className="font-semibold text-sm">{section.equipmentName}</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-3 py-2 font-semibold border-r border-border w-[50%]">Task</th>
                    <th className="px-2 py-2 font-semibold border-r border-border w-[8%] text-center">Serviceable</th>
                    <th className="px-2 py-2 font-semibold border-r border-border w-[8%] text-center">Defective</th>
                    <th className="px-2 py-2 font-semibold border-r border-border w-[8%] text-center">Urgent</th>
                    <th className="text-left px-3 py-2 font-semibold border-r border-border w-[18%]">Comments</th>
                    <th className="text-left px-3 py-2 font-semibold w-[8%]">W/O</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="border-t border-border hover:bg-muted/20">
                      <td className="px-3 py-2 border-r border-border">
                        <div className="flex flex-col gap-1">
                          <span>{task.task}</span>
                          {task.hasInput && <Input className="h-6 text-xs mt-1 w-40" placeholder={task.inputLabel} />}
                        </div>
                      </td>
                      <td className="px-2 py-2 border-r border-border text-center"><Checkbox className="h-4 w-4" /></td>
                      <td className="px-2 py-2 border-r border-border text-center"><Checkbox className="h-4 w-4" /></td>
                      <td className="px-2 py-2 border-r border-border text-center"><Checkbox className="h-4 w-4" /></td>
                      <td className="px-3 py-2 border-r border-border"><Input className="h-6 text-xs" /></td>
                      <td className="px-3 py-2"><Input className="h-6 text-xs" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Lab Generator Weekly Inspection Form" />
      </div>
    </div>
  );
};
