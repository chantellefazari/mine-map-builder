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
  { equipmentName: "Cyanide Monorail", tasks: [
    { task: "Check operation of crane" },
    { task: "Inspect Crane hook for any damage" },
    { task: "Check lifting equipment is in test date" },
  ]},
  { equipmentName: "Cyanide Mixing Tank and Agitator", tasks: [
    { task: "Check Tank for any damage or rust" },
    { task: "Check that there is no obstruction on agitator motor fan" },
    { task: "HS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "LS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
  ]},
  { equipmentName: "Cyanide Solution Transfer Pump", tasks: [
    { task: "Check pump condition" },
    { task: "Check pump for heat, noise and vibration" },
    { task: "Check inlet and outlet connection, look for leaks" },
  ]},
  { equipmentName: "Cyanide Dosing Pump (Duty)", tasks: [
    { task: "Check pump condition" },
    { task: "Check pump for heat, noise and vibration" },
    { task: "Check inlet and outlet connection, look for leaks" },
  ]},
  { equipmentName: "Cyanide Dosing Pump (Standby)", tasks: [
    { task: "Check pump condition" },
    { task: "Check pump for heat, noise and vibration" },
    { task: "Check inlet and outlet connection, look for leaks" },
  ]},
  { equipmentName: "Back Pressure Valve", tasks: [
    { task: "Visual inspection of Back Pressure Valve (stainless steel). Look for any rust penetrations, leaks on junctions or damages" },
  ]},
  { equipmentName: "Cyanide Area Sump Pump", tasks: [
    { task: "Check pipework condition and look for leaks" },
    { task: "Check operation of sump pump" },
    { task: "Check pump for heat, noise and vibration" },
  ]},
];

export const ReagentsPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Reagents Weekly Inspection");
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Reagents Area" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="Reagents"
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
