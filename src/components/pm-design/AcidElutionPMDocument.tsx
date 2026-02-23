import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
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
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Acid Wash & Elution Weekly Inspection");
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Elution Area - Acid Wash & Elution" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="Elution"
          pmGroup="Mechanical"
          pmType="Inspection (Fitter)"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-left font-semibold w-[46%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
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
                        {task.hasInput && <span className="text-xs text-muted-foreground">{task.inputLabel}</span>}
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
