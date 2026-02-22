import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; hasTemp?: boolean; tempLabel?: string; hasPressure?: boolean; pressureLabel?: string; }
interface EquipmentSection { equipmentId: string; equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
  { equipmentId: "LUBE PUMPS", equipmentName: "Lube Pumps", tasks: [
    { task: "HIGH PRESSURE PUMP", hasPressure: true, pressureLabel: "_______ BAR" },
    { task: "LOW PRESSURE PUMP", hasPressure: true, pressureLabel: "_______ BAR" },
    { task: "CONDITIONING PUMP", hasPressure: true, pressureLabel: "_______ BAR" },
  ]},
  { equipmentId: "MILL CHECKS", equipmentName: "Mill Checks", tasks: [
    { task: "Inspect Feed Chute & Seals for Leaks/Wear. Note any Faults" },
    { task: "Inspect Trunion & Pinion Bearing Labyrinths. Note Excessive Grease" },
    { task: "Grease Pinion Bearings (4 PUMPS PER DAY)" },
    { task: "Inspect/Check Operation of Girth Gear Grease Injection System" },
    { task: "Inspect Mill Drivelines. Note any excessive noise or wear" },
    { task: "Inspect/Check operation of Girth Gear Grease Sprayer Operation. Note any Blocked Sprays" },
    { task: "Check Cycle Frequency on Girth Gear Lube and Note times (Approx 90 Seconds) (28KG-3.8KG)" },
    { task: "Record Pinion Bearing Temps (FEED END)", hasTemp: true },
    { task: "Record Pinion Bearing Temps (DISCHARGE END)", hasTemp: true },
    { task: "Inspect mill for loose or leaking liner bolts. Note any faults" },
    { task: "Inspect gearbox lube pump, radiator & hoses for operation, leaks or noise" },
    { task: "Inspect mill grease pump airline systems, Top up airline oilers & check water traps" },
    { task: "Record gearbox bearing temps - High speed Input", hasTemp: true },
    { task: "Record gearbox bearing temps - Low Speed Output", hasTemp: true },
    { task: "Check level of bulky bins & note any that are getting low" },
    { task: "Empty Grease bags" },
  ]},
  { equipmentId: "GENERAL", equipmentName: "General", tasks: [
    { task: "Inspect cyclone tower pipe work and hoppers for leaks or wear. Note any faults" },
    { task: "Inspect air compressors for operation" },
    { task: "Check main air receiver & drain water from bottom valve" },
    { task: "Check general pipe work for leaks" },
    { task: "Check condition of walkway mesh & handrails" },
    { task: "Check operation of sump pumps. Grease bearings 4 pumps each" },
  ]},
  { equipmentId: "FE-100", equipmentName: "FE-100 Hopper", tasks: [
    { task: "Inspect Feed & Discharge chutes for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks & Record Temp", hasTemp: true },
    { task: "Inspect scraper operation & condition. Note any faults" },
    { task: "Check head & tail drum bearings for noise or lumpiness, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Head: _______ °C / Tail: _______ °C" },
  ]},
  { equipmentId: "FE-101", equipmentName: "FE-101 Transfer Conveyor", tasks: [
    { task: "Inspect Feed & Discharge chutes for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks", hasTemp: true },
    { task: "Inspect scraper operation & condition. Note any faults" },
    { task: "Check head & tail drum bearings for noise or lumpiness. Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Head: _______ °C / Tail: _______ °C" },
  ]},
  { equipmentId: "BC-100", equipmentName: "BC-100 Mill Feed Conveyor", tasks: [
    { task: "Inspect Feed & Discharge chutes for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks", hasTemp: true },
    { task: "Inspect scraper operation & condition. Note any faults" },
    { task: "Check head & tail drum bearings for noise or lumpiness, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Head: _______ °C / Tail: _______ °C" },
    { task: "Check belt tracking & tracking frames for correct operation" },
    { task: "Check conveyor belt for noisy or hot bearings. Report any issues to supervisor" },
  ]},
  { equipmentId: "CV-011", equipmentName: "CV-011 Scats Conveyor", tasks: [
    { task: "Inspect Feed chute for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks" },
    { task: "Inspect scraper operation & condition. Note any faults" },
    { task: "Check head & tail drum bearings for noise or lumpiness & Temps, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Thickener Side: _______ °C / Plant Side: _______ °C" },
  ]},
  { equipmentId: "MILL SUMP PUMP", equipmentName: "Mill Sump Pump", tasks: [
    { task: "Inspect Discharge pipework for holes or leakage" },
    { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
    { task: "Inspect pump operation & condition. Inspect guarding" },
    { task: "Check pump bearings for noise or lumpiness & Temps, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Top: _______ °C / Lower: _______ °C" },
    { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: _______ °C / Lower: _______ °C" },
  ]},
  { equipmentId: "PU102A/PU102B", equipmentName: "Cyclone Feed Pumps PU102A/PU102B", tasks: [
    { task: "Inspect Discharge pipework for holes or leakage" },
    { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
    { task: "Inspect pump operation & condition. Inspect guarding" },
    { task: "Check pump bearings for noise or lumpiness & Temps, Grease bearings 4 pumps each", hasTemp: true, tempLabel: "Drive: _______ °C / Non Drive: _______ °C" },
    { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: _______ °C / Non Drive: _______ °C" },
  ]},
  { equipmentId: "CHILLER", equipmentName: "Mill Gearbox Cooling Chiller Unit", tasks: [
    { task: "Inspect pipework and connections for leakage" },
    { task: "Visually inspect unit for normal operation, water level etc" },
    { task: "Remove front cover and inspect/clean filters as needed" },
    { task: "Inspect Condition and Record Working Pressures", hasPressure: true, pressureLabel: "High: _______ / Low: _______" },
  ]},
];

export const MillWeeklyPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek - Weekly Mill Inspection" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">CIP Circuit / Tailings</div></div>
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
              <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[50%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th><th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
              <tbody>
                {inspectionData.map((section, sectionIdx) => (
                  <>
                    <tr key={`section-${sectionIdx}`} className="bg-muted/50"><td colSpan={4} className="border border-border px-3 py-2 font-bold text-primary">{section.equipmentName}</td></tr>
                    {section.tasks.map((task, taskIdx) => (
                      <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/30">
                        <td className="border border-border px-3 py-2">{task.task}</td>
                        <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
                        <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
                        <td className="border border-border px-2 py-2 text-muted-foreground">{task.tempLabel || (task.hasTemp ? "_______ °C" : task.pressureLabel || (task.hasPressure ? "_______ BAR" : ""))}</td>
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
