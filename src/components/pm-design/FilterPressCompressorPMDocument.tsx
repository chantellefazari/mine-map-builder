import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ClipboardCheck, AlertCircle, Cog } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

interface InspectionTask { task: string; }
interface EquipmentSection { equipmentName: string; tasks: InspectionTask[]; }

const inspectionSections: EquipmentSection[] = [
  { equipmentName: "Motor", tasks: [
    { task: "Observe motor and drive assembly for smooth rotation" },
    { task: "Check Motor Temperature" },
    { task: "Motor Temp Guidelines (Online): Normal: 40–75 °C | Monitor: 75–85 °C | Warning: 85–95 °C | Critical: >95 °C – investigate urgently" },
  ]},
  { equipmentName: "Bearings", tasks: [
    { task: "Check Temperature of all bearings" },
    { task: "Listen for unusual bearing noise" },
  ]},
  { equipmentName: "Integrated Refrigerant Dryer", tasks: [
    { task: "Monitor dryer inlet & outlet temperatures (via HMI/PLC)" },
    { task: "Listen for unusual dryer fan noise" },
    { task: "Check for condensate drain cycling activity" },
  ]},
  { equipmentName: "Cooling System", tasks: [
    { task: "Observe cooling fan(s) running normally" },
    { task: "Check airflow around compressor fins / heat exchangers" },
    { task: "Scan radiator or condenser area for hot spots" },
  ]},
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
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Weekly Mechanical Filter Press Compressor Online Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Weekly Mechanical Filter Press Compressor Online Inspection" subtitle="Mechanical Weekly Online Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Filter Press – Air Compressor"
          pmGroup="Mechanical"
          pmType="Online Inspection"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTION CHECKLIST
          </div>
          {inspectionSections.map((section, sectionIndex) => (
            <div key={section.equipmentName} className={sectionIndex < inspectionSections.length - 1 ? "border-b border-border" : ""}>
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Cog className="w-4 h-4 text-primary" />
                <span>{section.equipmentName}</span>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border text-left px-2 py-2 font-semibold w-[46%]">Task</th>
                    <th className="border border-border text-center px-2 py-2 font-semibold w-[10%]">Serviceable</th>
                    <th className="border border-border text-center px-2 py-2 font-semibold w-[10%]">Defective</th>
                    <th className="border border-border text-left px-2 py-2 font-semibold w-[34%]">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="hover:bg-muted/30">
                      <td className="border border-border px-2 py-2">{task.task}</td>
                      <td className="border border-border text-center px-2 py-2"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></td>
                      <td className="border border-border text-center px-2 py-2"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></td>
                      <td className="border border-border px-2 py-2"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

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

        <PMSignOffBlock />
      </div>
    </div>
  );
};