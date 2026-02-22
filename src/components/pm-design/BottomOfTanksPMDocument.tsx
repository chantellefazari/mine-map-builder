import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, User, Calendar, Eye } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface InspectionTask { task: string; }
interface EquipmentSection { equipmentId: string; equipmentName: string; tasks: InspectionTask[]; }

const inspectionData: EquipmentSection[] = [
  { equipmentId: "Tails Screen", equipmentName: "Tails Screen", tasks: [
    { task: "Check Screen operation" }, { task: "Inspect Screen Springs" }, { task: "Check Screen Discharge is not Blocked" },
    { task: "Check all pipework and valves for leaks" }, { task: "Check Screen overflow is not blocked" },
    { task: "Check condition of sprays & piping" }, { task: "Check Screens are not Pegged" },
  ]},
  { equipmentId: "Tails Pump A", equipmentName: "Tails Pump A", tasks: [
    { task: "Check pump for heat, noise and vibration" }, { task: "Check Gland. Adjust if required" },
    { task: "Check Drive belts" }, { task: "Grease pump XTB 2" }, { task: "Check pipework" }, { task: "Check guarding / Mounts" },
  ]},
  { equipmentId: "Tails Pump B", equipmentName: "Tails Pump B", tasks: [
    { task: "Check pump for heat, noise and vibration" }, { task: "Check Gland. Adjust if required" },
    { task: "Check Drive belts" }, { task: "Grease pump XTB 2" }, { task: "Check pipework" }, { task: "Check guarding / Mounts" },
  ]},
  { equipmentId: "CIP Sump Pump", equipmentName: "CIP Sump Pump", tasks: [
    { task: "Check pump for heat, noise and vibration" }, { task: "Check Drive belts" },
    { task: "Grease pump XTB 2" }, { task: "Check pipework" }, { task: "Check guarding / Mounts" },
  ]},
  { equipmentId: "CIL Sump Pump", equipmentName: "CIL Sump Pump", tasks: [
    { task: "Check pump for heat, noise and vibration" }, { task: "Check Drive belts" },
    { task: "Grease pump XTB 2" }, { task: "Check pipework" }, { task: "Check guarding / Mounts" },
  ]},
  { equipmentId: "General", equipmentName: "General", tasks: [
    { task: "Check all Hatches on Tanks for Leaks" }, { task: "Check all Pipework and Valves for Leaks" },
    { task: "Look for hazards in the area" },
  ]},
];

export const BottomOfTanksPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center"><img src={tennantIcon} alt="Tennant Mines" className="h-14" /></div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek CIL Tanks - Bottom of Tanks</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Weekly Inspection (Fitter)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5"><FileText className="w-3 h-3 text-primary" />Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div><div className="px-2 py-1.5">Bottom of Tanks</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5"><User className="w-3 h-3 text-primary" />Resource/s:</div><div className="px-2 py-1.5">1x Fitter (1 hr)</div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Mechanical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection (Fitter)</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" />Frequency:</div><div className="px-2 py-1.5 font-medium">Weekly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2"><Eye className="w-4 h-4 text-primary" />SCOPE</div>
          <div className="px-4 py-3 text-sm leading-relaxed">
            <p className="font-medium mb-2">Weekly Running Inspection – CIL Tanks Bottom of Tanks Area</p>
            <p className="text-muted-foreground">To safely carry out mechanical inspection of tails screen, pumps, and tank areas for signs of damage or potential failures that may require maintenance attention.</p>
          </div>
        </div>

        <SafetyPrecautionsSection />

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
                        <td className="border border-border px-2 py-2"><Input className="h-7 text-xs border-0 bg-transparent" placeholder="" /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Comment:</div><div className="p-4"><Textarea placeholder="Enter comments here..." className="min-h-[80px] text-sm" /></div></div>

        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Sign Off:</div>
          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-4"><span className="text-muted-foreground">Follow up work required:</span><div className="flex gap-2"><Checkbox id="followup-yes-bot" /><label htmlFor="followup-yes-bot">Yes</label><Checkbox id="followup-no-bot" /><label htmlFor="followup-no-bot">No</label></div></div>
              <div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Name:</span><div className="border-b border-border h-6"></div></div>
              <div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Date:</span><div className="border-b border-border h-6"></div></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4"><span className="text-muted-foreground">Document update required:</span><div className="flex gap-2"><Checkbox id="update-yes-bot" /><label htmlFor="update-yes-bot">Yes</label><Checkbox id="update-no-bot" /><label htmlFor="update-no-bot">No</label></div></div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">Signature:</span><div className="border-b border-border h-6"></div></div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">PM Duration:</span><div className="border-b border-border h-6"></div></div>
            </div>
          </div>
        </div>

        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Supervisor Approval:</div><div className="p-4"><table className="w-full text-sm"><tbody><tr><td className="py-2 pr-4 text-muted-foreground w-24">Name:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Sign:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Date:</td><td className="py-2 border-b border-border w-24"></td></tr></tbody></table></div></div>

        <div><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Revision History:</div><table className="w-full text-xs"><thead><tr className="bg-muted/50"><th className="border border-border px-2 py-2 text-left font-semibold">Revision No.</th><th className="border border-border px-2 py-2 text-left font-semibold">Description</th><th className="border border-border px-2 py-2 text-left font-semibold">Created</th><th className="border border-border px-2 py-2 text-left font-semibold">Reviewed</th><th className="border border-border px-2 py-2 text-left font-semibold">Date</th></tr></thead><tbody><tr><td className="border border-border px-2 py-2">0</td><td className="border border-border px-2 py-2">Initial Release</td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td></tr></tbody></table></div>
      </div>
    </div>
  );
};
