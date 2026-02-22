import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, HardHat, FileText, User, Calendar, Eye, Lock, Info } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

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
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center"><img src={tennantIcon} alt="Tennant Mines" className="h-14" /></div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek - Weekly Mill Inspection</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Weekly Inspection (Fitter)</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5"><FileText className="w-3 h-3 text-primary" />Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">CIP Circuit / Tailings</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5"><User className="w-3 h-3 text-primary" />Resource/s:</div><div className="px-2 py-1.5">1x Fitter (2 hrs)</div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Mechanical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection (Fitter)</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" />Frequency:</div><div className="px-2 py-1.5 font-medium">Weekly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2"><Info className="w-5 h-5 text-primary" />PREPARATION AND INFORMATION</div>
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2"><Eye className="w-4 h-4 text-primary" />SCOPE</div>
            <div className="px-4 py-3 text-sm leading-relaxed">
              <p className="font-medium mb-2">Weekly Running Inspection – Mill Area</p>
              <p className="text-muted-foreground">To safely carry out comprehensive mechanical inspection of the mill, conveyors, pumps, and associated equipment for signs of damage, wear, or potential failures.</p>
            </div>
          </div>
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />SAFETY</div>
            <div className="px-4 py-3">
              <div className="flex items-start gap-3 mb-4"><AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" /><p className="text-sm">Before commencing this work complete a <strong>TAKE 5</strong> every time to check that no abnormal conditions exist.</p></div>
              <div className="flex items-start gap-3 mb-4"><HardHat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-sm">Minimum PPE: Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as per task or as required.</p></div>
              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3"><Lock className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" /><p className="text-sm font-bold text-destructive">Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.</p></div>
            </div>
          </div>
        </div>
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2"><Eye className="w-4 h-4 text-primary" />PROCEDURE</div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-2">
            <p>1. Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            <p>2. When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            <p>3. If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
          </div>
        </div>
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2"><Eye className="w-4 h-4 text-primary" />INSPECTIONS</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted"><th className="border border-border px-2 py-2 text-left font-semibold w-[50%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th><th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th><th className="border border-border px-2 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
              <tbody>
                {inspectionData.map((section, sectionIdx) => (
                  <>
                    <tr key={`section-${sectionIdx}`} className="bg-primary/10"><td colSpan={4} className="border border-border px-2 py-2 font-semibold text-primary">{section.equipmentName}</td></tr>
                    {section.tasks.map((task, taskIdx) => (
                      <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/50">
                        <td className="border border-border px-2 py-2">{task.task}</td>
                        <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></td>
                        <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></td>
                        <td className="border border-border px-2 py-2 text-muted-foreground">{task.tempLabel || (task.hasTemp ? "_______ °C" : task.pressureLabel || (task.hasPressure ? "_______ BAR" : ""))}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Comment:</div><div className="p-4"><Textarea placeholder="Enter comments here..." className="min-h-[80px] text-sm" /></div></div>
        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Sign Off:</div><div className="p-4 grid grid-cols-2 gap-4 text-sm"><div className="space-y-3"><div className="flex items-center gap-4"><span className="text-muted-foreground">Follow up work required:</span><div className="flex gap-2"><Checkbox id="followup-yes-mw" /><label htmlFor="followup-yes-mw">Yes</label><Checkbox id="followup-no-mw" /><label htmlFor="followup-no-mw">No</label></div></div><div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Name:</span><div className="border-b border-border h-6"></div></div><div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Date:</span><div className="border-b border-border h-6"></div></div></div><div className="space-y-3"><div className="flex items-center gap-4"><span className="text-muted-foreground">Document update required:</span><div className="flex gap-2"><Checkbox id="update-yes-mw" /><label htmlFor="update-yes-mw">Yes</label><Checkbox id="update-no-mw" /><label htmlFor="update-no-mw">No</label></div></div><div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">Signature:</span><div className="border-b border-border h-6"></div></div><div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">PM Duration:</span><div className="border-b border-border h-6"></div></div></div></div></div>
        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Supervisor Approval:</div><div className="p-4"><table className="w-full text-sm"><tbody><tr><td className="py-2 pr-4 text-muted-foreground w-24">Name:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Sign:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Date:</td><td className="py-2 border-b border-border w-24"></td></tr></tbody></table></div></div>
        <div><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Revision History:</div><table className="w-full text-xs"><thead><tr className="bg-muted/50"><th className="border border-border px-2 py-2 text-left font-semibold">Revision No.</th><th className="border border-border px-2 py-2 text-left font-semibold">Description</th><th className="border border-border px-2 py-2 text-left font-semibold">Created</th><th className="border border-border px-2 py-2 text-left font-semibold">Reviewed</th><th className="border border-border px-2 py-2 text-left font-semibold">Date</th></tr></thead><tbody><tr><td className="border border-border px-2 py-2">0</td><td className="border border-border px-2 py-2">Initial Release</td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td></tr></tbody></table></div>
      </div>
    </div>
  );
};
