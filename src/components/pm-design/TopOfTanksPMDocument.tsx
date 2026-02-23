import { Checkbox } from "@/components/ui/checkbox";

import { ClipboardCheck } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; hasInput?: boolean; inputLabel?: string; }
interface EquipmentSection { equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
  { equipmentName: "Leach Tank 1 - Gearbox, Agitator 5-AG-1", tasks: [
    { task: "Check for leaks, vibration, noise" },
    { task: "Check agitator operation" },
    { task: "Check condition of launders" },
    { task: "Grease Gearbox" },
    { task: "Check condition of walkway mesh & handrails" },
    { task: "Visually check hold down bolts are tight" },
    { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
  ]},
  { equipmentName: "Trash Screen", tasks: [
    { task: "Check Screen Operation" },
    { task: "Visually check Screen Springs condition" },
    { task: "Check Discharge Pipe for Build up / Blockage" },
    { task: "Check all pipework and valves for leaks" },
    { task: "Check screen overflow is not blocked" },
    { task: "Check working condition of Spray bar" },
    { task: "Visually check Screen Vibrators operation, noise and fasteners" },
    { task: "Check Screens are not Pegged/blocked" },
  ]},
  { equipmentName: "Leach Tank 2 - Gearbox, Agitator 5-AG-2", tasks: [
    { task: "Check for leaks, vibration, noise" },
    { task: "Visually check hold down bolts are tight" },
    { task: "Check agitator operation" },
    { task: "Check condition of launders" },
    { task: "Grease Gearbox" },
    { task: "Check condition of walkway mesh & handrails" },
    { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "LS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "Air Sparge Condition" },
  ]},
  { equipmentName: "Gearbox, Agitator; CIP Tank #3", tasks: [
    { task: "Check for leaks, vibration, noise" },
    { task: "Check agitator operation" },
    { task: "Check condition of launders" },
    { task: "Grease Gearbox" },
    { task: "Check operation of airleg and pipework for leaks" },
    { task: "Check condition of walkway mesh & handrails" },
    { task: "Visually check hold down bolts are tight" },
    { task: "HS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "LS gearbox bearing temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
  ]},
  { equipmentName: "Loaded Carbon Screen", tasks: [
    { task: "Check Screen Operation" },
    { task: "Visually check Screen Springs condition" },
    { task: "Check Discharge Pipe for Build up / Blockage" },
    { task: "Check all pipework and valves for leaks" },
    { task: "Check screen overflow is not blocked" },
    { task: "Check working condition of Spray bar" },
    { task: "Visually check Screen Vibrators operation, noise and fasteners" },
    { task: "Check Screens are not Pegged/blocked" },
  ]},
  { equipmentName: "CIP Tanks #4-8 Gearboxes & Agitators", tasks: [
    { task: "Check for leaks, vibration, noise (all tanks)" },
    { task: "Check agitator operation (all tanks)" },
    { task: "Check condition of launders (all tanks)" },
    { task: "Grease all Gearboxes" },
    { task: "Check condition of walkway mesh & handrails (all tanks)" },
    { task: "Visually check hold down bolts are tight (all tanks)" },
    { task: "HS/LS gearbox bearing temperatures (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Record temps" },
    { task: "Air Sparge Condition (Tank 5)" },
  ]},
  { equipmentName: "Carbon Sizing Screen", tasks: [
    { task: "Check Screen Operation" },
    { task: "Visually check Screen Springs condition" },
    { task: "Check Discharge Pipe for Build up / Blockage" },
    { task: "Check all pipework and valves for leaks" },
    { task: "Check screen overflow is not blocked" },
    { task: "Check working condition of Spray bar" },
    { task: "Visually check Screen Vibrators operation, noise and fasteners" },
    { task: "Check Screens are not Pegged/blocked" },
  ]},
  { equipmentName: "Gantry Crane 2.5t", tasks: [
    { task: "Check operation of crane" },
    { task: "Check Crane prestart book for any faults" },
    { task: "Inspect Crane hook for any damage" },
    { task: "Check lifting equipment is in test date" },
    { task: "Visually Check buzz bar / brackets" },
  ]},
  { equipmentName: "General Inspections", tasks: [
    { task: "Inspect all walkway mesh and hold down clips" },
    { task: "Check all handrails" },
    { task: "Check Airleg air manifold for leaks or damage" },
  ]},
];

export const TopOfTanksPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Top of Tanks Weekly Inspection");
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Leaching Area - CIL Circuit / Tailings" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="CIP Circuit / Tailings"
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
            <thead><tr className="bg-muted"><th className="border border-border px-2 py-2 text-left font-semibold w-[46%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-2 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
            <tbody>
              {inspectionData.map((section, sectionIdx) => (
                <>
                  <tr key={`section-${sectionIdx}`} className="bg-primary/10"><td colSpan={4} className="border border-border px-2 py-2 font-semibold text-primary">{section.equipmentName}</td></tr>
                  {section.tasks.map((task, taskIdx) => (
                    <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/30">
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
