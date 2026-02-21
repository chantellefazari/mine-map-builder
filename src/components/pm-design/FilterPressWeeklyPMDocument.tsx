import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, HardHat, FileText, User, Calendar, Eye, Lock, Info } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface InspectionTask { task: string; hasTemp?: boolean; hasPressure?: boolean; }
interface EquipmentSection { equipmentId: string; equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
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
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center"><img src={tennantIcon} alt="Tennant Mines" className="h-14" /></div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek Filtration Area - Filter Press</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Weekly Inspection (Fitter)</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5"><FileText className="w-3 h-3 text-primary" />Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div><div className="px-2 py-1.5">Filter Press</div></div>
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
              <p className="font-medium mb-2">Weekly Running Inspection – Filter Press Filtration Area</p>
              <p className="text-muted-foreground">To safely carry out mechanical inspection of filter presses, conveyors, feed pumps, and air systems for signs of damage or potential failures.</p>
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
                    <tr key={`section-${sectionIdx}`} className="bg-primary/10"><td colSpan={4} className="border border-border px-2 py-2 font-semibold text-primary">{section.equipmentId} - {section.equipmentName}</td></tr>
                    {section.tasks.map((task, taskIdx) => (
                      <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/50">
                        <td className="border border-border px-2 py-2">{task.task}</td>
                        <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></td>
                        <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></td>
                        <td className="border border-border px-2 py-2 text-muted-foreground">{task.hasTemp ? "_______ °C" : task.hasPressure ? "_______ kPa" : ""}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Comment:</div><div className="p-4"><Textarea placeholder="Enter comments here..." className="min-h-[80px] text-sm" /></div></div>
        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Sign Off:</div><div className="p-4 grid grid-cols-2 gap-4 text-sm"><div className="space-y-3"><div className="flex items-center gap-4"><span className="text-muted-foreground">Follow up work required:</span><div className="flex gap-2"><Checkbox id="followup-yes-fp" /><label htmlFor="followup-yes-fp">Yes</label><Checkbox id="followup-no-fp" /><label htmlFor="followup-no-fp">No</label></div></div><div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Name:</span><div className="border-b border-border h-6"></div></div><div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Date:</span><div className="border-b border-border h-6"></div></div></div><div className="space-y-3"><div className="flex items-center gap-4"><span className="text-muted-foreground">Document update required:</span><div className="flex gap-2"><Checkbox id="update-yes-fp" /><label htmlFor="update-yes-fp">Yes</label><Checkbox id="update-no-fp" /><label htmlFor="update-no-fp">No</label></div></div><div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">Signature:</span><div className="border-b border-border h-6"></div></div><div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">PM Duration:</span><div className="border-b border-border h-6"></div></div></div></div></div>
        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Supervisor Approval:</div><div className="p-4"><table className="w-full text-sm"><tbody><tr><td className="py-2 pr-4 text-muted-foreground w-24">Name:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Sign:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Date:</td><td className="py-2 border-b border-border w-24"></td></tr></tbody></table></div></div>
        <div><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Revision History:</div><table className="w-full text-xs"><thead><tr className="bg-muted/50"><th className="border border-border px-2 py-2 text-left font-semibold">Revision No.</th><th className="border border-border px-2 py-2 text-left font-semibold">Description</th><th className="border border-border px-2 py-2 text-left font-semibold">Created</th><th className="border border-border px-2 py-2 text-left font-semibold">Reviewed</th><th className="border border-border px-2 py-2 text-left font-semibold">Date</th></tr></thead><tbody><tr><td className="border border-border px-2 py-2">0</td><td className="border border-border px-2 py-2">Initial Release</td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td></tr></tbody></table></div>
      </div>
    </div>
  );
};
