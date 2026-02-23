import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { useCommittedAssetLinks } from "@/hooks/useCommittedAssetLinks";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; hasTemp?: boolean; hasPressure?: boolean; }
interface EquipmentSection { equipmentId: string; equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
  { equipmentId: "01-ES-001", equipmentName: "Emergency Stop System", tasks: [
    { task: "Check All Estops are Functioning" }, { task: "Check All Estops are Accessible" },
  ]},
  { equipmentId: "01-LT-001", equipmentName: "Lighting Tower", tasks: [
    { task: "Check Tower Lights are Functioning" }, { task: "Check Tower Structure" },
  ]},
  { equipmentId: "13-MN-001", equipmentName: "Main Air Compressor", tasks: [
    { task: "Check Oil Level" }, { task: "Check Auto Drains are operational" },
    { task: "Check for Leaks or Damage" }, { task: "Check all Pipework and Valves for leaks or damage" },
  ]},
  { equipmentId: "13-MN-002", equipmentName: "Main Air Receiver", tasks: [
    { task: "Check Auto Drains are operational" }, { task: "Check for Leaks or Damage" },
    { task: "Check all Pipework and Valves for leaks or damage" },
  ]},
  { equipmentId: "13-FP-101", equipmentName: "Filter Press 1", tasks: [
    { task: "Check all Plate connection bolts and chains" }, { task: "Check all Air actuated Rams, fittings and hoses for leaks and damage" },
    { task: "Check Trough for leaks and Clear of Cake" }, { task: "Check Plate slide for build up or damage" },
    { task: "Check Hydraulic Tank Level, top up if required" }, { task: "Check all Hydraulic lines for leaks or damage" },
    { task: "Check Handrails and Walkway mesh" }, { task: "Check all Guarding" },
  ]},
  { equipmentId: "13-FP-102", equipmentName: "Filter Press 2", tasks: [
    { task: "Check all Plate connection bolts and chains" }, { task: "Grease Plate wheel assembly located at end of filter top level" },
    { task: "Check all Air actuated Rams, fittings and hoses for leaks and damage" }, { task: "Check Trough for leaks and Clear of Cake" },
    { task: "Check Plate slide for build up or damage" }, { task: "Check Hydraulic Tank Level, top up if required" },
    { task: "Check all Hydraulic lines for leaks or damage" }, { task: "Check Handrails and Walkway mesh" }, { task: "Check all Guarding" },
  ]},
  { equipmentId: "13-CV-101", equipmentName: "Filter Press 1 Conveyor", tasks: [
    { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
    { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
    { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" }, { task: "Check Skirts Condition" },
  ]},
  { equipmentId: "13-CV-102", equipmentName: "Filter Press 2 Conveyor", tasks: [
    { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
    { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
    { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" }, { task: "Check Skirts Condition" },
  ]},
  { equipmentId: "13-CV-103", equipmentName: "Transfer Conveyor", tasks: [
    { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
    { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
    { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" }, { task: "Check Skirts Condition" },
  ]},
  { equipmentId: "13-CV-104", equipmentName: "Radial Conveyor", tasks: [
    { task: "Check Head End Tail Drum Bearings for Noise or heat", hasTemp: true }, { task: "Check Tail end Bearings for heat or Noise", hasTemp: true },
    { task: "Grease Head and Tail end Bearing Assembly" }, { task: "Check Guarding" }, { task: "Check all Rollers. Trough, Return and Guide" },
    { task: "Check all scrapers, V-plough position & condition" }, { task: "Check Drive belts" }, { task: "Check gearbox for unusual noise or Leaks" },
    { task: "Check Skirts Condition" }, { task: "Check Drive wheels" }, { task: "Check Conveyor Turn Table" },
  ]},
  { equipmentId: "13-PU-101", equipmentName: "Filter Press Feed Pump 1", tasks: [
    { task: "Check Guarding/Mounts" }, { task: "Check Pipework and Valves for leaks or Damage" }, { task: "Check Drive Belts for any wear marks" },
    { task: "Check Oil Level" }, { task: "Bearing assembly temperature, Serviceable range: < 80°C", hasTemp: true },
    { task: "Gland water pressure Serviceable range: ~400 kPa", hasPressure: true }, { task: "Check gland leakage and adjust if required" },
  ]},
  { equipmentId: "13-PU-102", equipmentName: "Filter Press Feed Pump 2", tasks: [
    { task: "Check Guarding/Mounts" }, { task: "Check Pipework and Valves for leaks or Damage" }, { task: "Check Drive Belts for any wear marks" },
    { task: "Check Oil Level" }, { task: "Bearing assembly temperature, Serviceable range: < 80°C", hasTemp: true },
    { task: "Gland water pressure Serviceable range: ~400 kPa", hasPressure: true }, { task: "Check gland leakage and adjust if required" },
    { task: "Check pump for heat, noise and vibration" },
  ]},
  { equipmentId: "13-CP-100, 13-AR-101, 13-AR-102, 13-AR-103, 13-AR-104", equipmentName: "Filter Press Air Compressor and Air Receivers", tasks: [
    { task: "Clean Air Filter" }, { task: "Clean top Filters" }, { task: "Check oil level" },
    { task: "Check Auto Drains are operational" }, { task: "Check Receivers for Leaks or Damage" }, { task: "Check all Pipework and Valves for leaks or damage" },
  ]},
];

export const FilterPressWeeklyPMDocument = () => {
  const { getAssetNumber } = useCommittedAssetLinks();
  const assetNumber = getAssetNumber("Filter Press");
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Filtration Area - Filter Press" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5 font-mono font-semibold">{assetNumber}</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">Filter Press</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div><div className="px-2 py-1.5">1x Fitter (2 hrs)</div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Mechanical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection (Fitter)</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">Weekly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        {/* Inspections */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
              <tbody>
                {inspectionData.map((section, sectionIdx) => (
                  <>
                    <tr key={`section-${sectionIdx}`} className="bg-muted/50"><td colSpan={4} className="border border-border px-3 py-2 font-bold text-primary">{section.equipmentId} - {section.equipmentName}</td></tr>
                    {section.tasks.map((task, taskIdx) => (
                      <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/30">
                        <td className="border border-border px-3 py-2">{task.task}</td>
                        <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
                        <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
                        <td className="border border-border px-2 py-2 text-muted-foreground">{task.hasTemp ? "_______ °C" : task.hasPressure ? "_______ kPa" : ""}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Processing Plant Inspection Form" />
      </div>
    </div>
  );
};
