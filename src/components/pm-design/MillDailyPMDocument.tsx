import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Cog, Thermometer } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; hasTemp?: boolean; tempLabel?: string; }
interface EquipmentSection { equipmentId: string; equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
  { equipmentId: "MILL", equipmentName: "Ball Mill - System, Assembly and Components", tasks: [
    { task: "Inspect Feed Chute & Seals for Leaks/Wear. Note any Faults" },
    { task: "Inspect Trunnion & Pinion Bearing Labyrinths. Note Excessive Grease" },
    { task: "Grease Pinion Bearings (4 PUMPS PER DAY)" },
    { task: "Inspect Mill Drivelines. Note any excessive noise or wear" },
    { task: "Inspect/Check operation of Girth Gear Grease Sprayer" },
    { task: "Check Cycle Frequency on Girth Gear Lube and Note times (Approx 120 Seconds)" },
    { task: "Inspect mill for loose or leaking liner bolts. Note any faults" },
    { task: "Inspect gearbox lube pump, radiator & hoses for operation, leaks or noise" },
    { task: "Inspect mill grease pump airline systems, Top up airline oiler & check water traps" },
    { task: "Check level of bulky bins & note any that are getting low" },
  ]},
  { equipmentId: "GENERAL", equipmentName: "General Area Inspection", tasks: [
    { task: "Inspect cyclone tower pipe work and hoppers for leaks or wear. Note any faults" },
    { task: "Inspect air compressors for operation" },
    { task: "Check main air receiver & drain water from bottom valve" },
    { task: "Check general pipe work for leaks" },
    { task: "Check condition of walkway mesh & handrails" },
    { task: "Check operation of sump pumps" },
  ]},
  { equipmentId: "FE-100", equipmentName: "FE-100 Hopper", tasks: [
    { task: "Inspect Feed & Discharge chutes for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks" },
    { task: "Inspect scraper operation & condition. Note any faults" },
    { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "DE: ___°C | NDE: ___°C" },
  ]},
  { equipmentId: "FE-101", equipmentName: "FE-101 Transfer Conveyor", tasks: [
    { task: "Inspect Feed & Discharge chutes for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
    { task: "Inspect scraper operation & condition. Note any faults" },
    { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "NDE: ___°C | DE: ___°C" },
  ]},
  { equipmentId: "BC-100", equipmentName: "BC-100 Mill Feed Conveyor", tasks: [
    { task: "Inspect Feed & Discharge chutes for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
    { task: "Inspect scraper operation & condition. Note any faults" },
    { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "TD: ___°C | HD: ___°C" },
    { task: "Check belt tracking & tracking frames for correct operation" },
    { task: "Check conveyor belt for noisy or hot bearings. Report any issues to supervisor" },
  ]},
  { equipmentId: "CV-011", equipmentName: "CV-011 Scats Conveyor", tasks: [
    { task: "Inspect Feed chute for holes or leakage" },
    { task: "Inspect belt condition, tracking, tag any faulty rollers" },
    { task: "Inspect Feeder gearbox for noise or leaks" },
    { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Tail Plant Side: ___°C | Tail Thickener Side: ___°C" },
  ]},
  { equipmentId: "MILL-SUMP", equipmentName: "Mill Sump Pump", tasks: [
    { task: "Inspect Discharge pipework for holes or leakage" },
    { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
    { task: "Inspect pump operation & condition. Inspect guarding" },
    { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
    { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
  ]},
  { equipmentId: "PU102A/B", equipmentName: "Cyclone Feed Pumps PU102A/PU102B", tasks: [
    { task: "Inspect Discharge pipework for holes or leakage" },
    { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
    { task: "Inspect pump operation & condition. Inspect guarding" },
    { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
    { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
    { task: "Note any leakage, and note which pump is running" },
  ]},
];

export const MillDailyPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek - Daily Mill Inspection" subtitle="Mechanical Running PMs - Daily Inspection (Fitter)" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">Grinding</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div><div className="px-2 py-1.5"></div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Mechanical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection (Fitter)</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">Daily</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          {inspectionData.map((section, sectionIndex) => (
            <div key={section.equipmentId} className={sectionIndex < inspectionData.length - 1 ? "border-b border-border" : ""}>
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cog className="w-4 h-4 text-primary" />
                  <span className="text-primary font-bold">{section.equipmentId}</span>
                  <span className="text-muted-foreground">|</span>
                  <span>{section.equipmentName}</span>
                </div>
                {section.equipmentId === "PU102A/B" && (
                  <div className="flex flex-col gap-0.5 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Total Hours PU102A:</span>
                      <Input className="h-5 w-20 text-xs border-none shadow-none focus-visible:ring-0 bg-background/80" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Total Hours PU102B:</span>
                      <Input className="h-5 w-20 text-xs border-none shadow-none focus-visible:ring-0 bg-background/80" />
                    </div>
                  </div>
                )}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="border border-border text-left px-4 py-2 font-medium w-[46%]">Task</th>
                    <th className="border border-border text-center px-2 py-2 font-medium w-[10%]">Serviceable</th>
                    <th className="border border-border text-center px-2 py-2 font-medium w-[10%]">Defective</th>
                    <th className="border border-border text-left px-4 py-2 font-medium w-[34%]">Comments / Temp</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="border-b border-border hover:bg-muted/30">
                      <td className="border border-border px-4 py-2.5 text-foreground">{task.task}</td>
                      <td className="border border-border text-center px-2 py-2.5"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></td>
                      <td className="border border-border text-center px-2 py-2.5"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></td>
                      <td className="border border-border px-4 py-2.5">
                        {task.hasTemp ? (
                          <span className="text-xs text-muted-foreground">{task.tempLabel}</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* BC-100 Additional Temperature Records */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            BC-100 ADDITIONAL BEARING TEMPERATURES
          </div>
          <div className="p-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2"><span className="font-medium">Upper Bend Pulley:</span><span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span></div>
            <div className="flex items-center gap-2"><span className="font-medium">Lower Bend Pulley:</span><span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span></div>
            <div className="flex items-center gap-2"><span className="font-medium">Take-up Pulley:</span><span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span></div>
          </div>
        </div>

        {/* Mill Specific Data */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            MILL DATA & TEMPERATURES
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2"><span className="font-medium">Ambient Temp:</span><span className="text-muted-foreground">___°C</span></div>
              <div className="flex items-center gap-2"><span className="font-medium">Throughput Tonnes:</span><span className="text-muted-foreground">_________</span></div>
            </div>
            <div>
              <span className="font-medium">PINION FACE TEMPS:</span>
              <div className="mt-2 flex gap-8">
                <span className="text-muted-foreground">LEFT: ___°C</span>
                <span className="text-muted-foreground">CENTRE: ___°C</span>
                <span className="text-muted-foreground">RIGHT: ___°C</span>
              </div>
            </div>
            <div>
              <span className="font-medium">BEARINGS (1-10):</span>
              <div className="mt-2 grid grid-cols-10 gap-2 text-xs text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="border border-border rounded p-2"><span className="font-medium">{num}=</span></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2"><span className="font-medium">GEARBOX LUBE TEMP (from Control Room):</span><span className="text-muted-foreground">___°C</span></div>
          </div>
        </div>

        <PMSignOffBlock />
      </div>
    </div>
  );
};