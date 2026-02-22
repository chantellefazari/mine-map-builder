import { Checkbox } from "@/components/ui/checkbox";

import { ClipboardCheck } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; hasInput?: boolean; inputLabel?: string; }
interface EquipmentSection { equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
  { equipmentName: "Thickener Tank", tasks: [
    { task: "Inspect Thickener tank for leaks" },
    { task: "Check Thickener tank for signs of rust or damage" },
    { task: "Check walkways, ladders and stairs for signs of rust or damage" },
  ]},
  { equipmentName: "Hydraulic Power Pack", tasks: [
    { task: "Check fluid level in hydraulic tank (2/3rds on sight glass)" },
    { task: "Check the indicator on filters" },
    { task: "Check oil breather is free from dirt build-up" },
    { task: "Visually check reservoir covers, solenoids and hose connections for oil leaks" },
    { task: "Check drip tray and drain valve are free from dirt build-up" },
  ]},
  { equipmentName: "Thickener Drive", tasks: [
    { task: "Visually check gearbox for any oil leaks" },
    { task: "Check for any undue noise or vibration" },
    { task: "HS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "LS gearbox temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "Ensure all safety guards are fitted correctly" },
  ]},
  { equipmentName: "Rake Lift", tasks: [
    { task: "Ensure there are no foreign objects hindering the rake lift operation" },
    { task: "Check the rake lift cylinders for leaks on the seals and connections" },
    { task: "Grease Rake Lift - 8 x Grease points", hasInput: true, inputLabel: "GP Grease" },
  ]},
  { equipmentName: "Control Panel & Instruments (PN 205)", tasks: [
    { task: "Press Lamp Test on panel to check indicator lights" },
  ]},
  { equipmentName: "Floc Box", tasks: [
    { task: "Check for signs of leakage at the fittings between the Floc Box, valves and piping" },
    { task: "Visually inspect the box for signs of build-up of solids" },
  ]},
  { equipmentName: "Flocculant Powder Hopper", tasks: [
    { task: "Confirm heater is operational and area is warm and clean to prevent any blockage" },
    { task: "Check Anti-Static powder hose for wear" },
    { task: "Ensure that all services are properly connected and check for any water or air leaks" },
  ]},
  { equipmentName: "Flocculant Mixing Tank", tasks: [
    { task: "Inspect Dispersion Cylinder for any algae/scale build-up" },
    { task: "Inspect Dispersion Spigot and Nozzles for any gel build-up" },
  ]},
  { equipmentName: "Underflow Pump A", tasks: [
    { task: "Running or Standby (skip if pump on standby)", hasInput: true, inputLabel: "Running □ Standby □   Total Hours: _______" },
    { task: "Bearing assembly temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "Gland water pressure (Serviceable range: ~400 kPa)", hasInput: true, inputLabel: "Pressure: _______ kPa" },
    { task: "Check gland leakage and adjust if required" },
  ]},
  { equipmentName: "Underflow Pump B", tasks: [
    { task: "Running or Standby (skip if pump on standby)", hasInput: true, inputLabel: "Running □ Standby □   Total Hours: _______" },
    { task: "Bearing assembly temperature (Serviceable range: < 80°C)", hasInput: true, inputLabel: "Temp: _______ °C" },
    { task: "Gland water pressure (Serviceable range: ~400 kPa)", hasInput: true, inputLabel: "Pressure: _______ kPa" },
    { task: "Check gland leakage and adjust if required" },
  ]},
  { equipmentName: "Thickener Sump Pump", tasks: [
    { task: "Check pump for heat, noise and vibration" },
  ]},
];

export const ThickenerPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Leaching Area - Thickener" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">Thickener</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div><div className="px-2 py-1.5"></div></div>
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