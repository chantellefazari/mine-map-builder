import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionSection { equipmentName: string; tasks: { task: string; }[]; }

const inspectionData: InspectionSection[] = [
  { equipmentName: "Electrowinning Cells", tasks: [
    { task: "Visual inspection of cells for leaks or damage" },
    { task: "Check electrical connections for corrosion or loose connections" },
    { task: "Inspect anodes and cathodes for wear or buildup" },
    { task: "Verify proper electrolyte levels" },
  ]},
  { equipmentName: "Sludge Pumps", tasks: [
    { task: "Inspect pump housing and connections for leaks" },
    { task: "Check motor and electrical connections" },
    { task: "Listen for unusual noises or vibrations during operation" },
    { task: "Verify proper flow rates" },
  ]},
  { equipmentName: "Furnace Equipment", tasks: [
    { task: "Inspect furnace shell for cracks or hot spots" },
    { task: "Check burner operation and flame stability" },
    { task: "Verify proper temperature control settings" },
    { task: "Inspect exhaust system for leaks or blockages" },
  ]},
];

export const GoldRoomPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tennant Creek - Gold Room Area" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tennant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">Gold Room</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Work Order #:</div><div className="px-2 py-1.5"></div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Operations</div></div>
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

        <PMSignOffBlock />
      </div>
    </div>
  );
};