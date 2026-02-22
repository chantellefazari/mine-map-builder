import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; }
interface MCCSection { mccId: string; mccName: string; tasks: InspectionTask[]; }

const standardMCCTasks: InspectionTask[] = [
  { task: "Check Gland Plate Sealing and Fastening of Glands" },
  { task: "Check all Circuits are Active and Available" },
  { task: "Inspect all Door Seals" },
  { task: "Check and Lubricate all Door Hinges and Latches" },
  { task: "Check lights are all functioning correctly" },
  { task: "Check all labels are available and correct" },
  { task: "Check that all cables are labelled" },
  { task: "Clean Cabinet and Filters" },
  { task: "Ensure Access is not impeded in or around Field MCC" },
];

const mccSections: MCCSection[] = [
  { mccId: "MCC-110", mccName: "Mill Feed Conveyor", tasks: standardMCCTasks },
  { mccId: "MCC-111", mccName: "Mill Auxiliary", tasks: standardMCCTasks },
  { mccId: "MCC-113", mccName: "Gravity Concentrator", tasks: standardMCCTasks },
  { mccId: "MCC-114", mccName: "Top of Tanks", tasks: standardMCCTasks },
  { mccId: "MCC-115", mccName: "Top of Tanks", tasks: standardMCCTasks },
  { mccId: "MCC-116", mccName: "Top of Tanks", tasks: standardMCCTasks },
  { mccId: "MCC-117", mccName: "Top of Tanks", tasks: standardMCCTasks },
  { mccId: "MCC-118", mccName: "Thickener", tasks: standardMCCTasks },
  { mccId: "MCC-120", mccName: "Cyanide", tasks: standardMCCTasks },
  { mccId: "MCC-121", mccName: "Water Services", tasks: standardMCCTasks },
  { mccId: "MCC-122", mccName: "Process Water Ponds", tasks: standardMCCTasks },
  { mccId: "MCC-125", mccName: "Filter Press", tasks: standardMCCTasks },
  { mccId: "MCC-130", mccName: "Elution", tasks: standardMCCTasks },
];

export const FieldMCCInspectionsPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Field MCC Inspections" subtitle="Electrical Weekly Inspection" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tennant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">Processing Plant</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div><div className="px-2 py-1.5"></div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Electrical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection (Electrician)</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">Weekly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            FIELD MCC INSPECTIONS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
            <tbody>
              {mccSections.map((section, sectionIndex) => (
                <>
                  <tr key={`section-${sectionIndex}`} className="bg-primary/10"><td colSpan={4} className="border border-border px-3 py-2 font-semibold text-primary">{section.mccId} – {section.mccName}</td></tr>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={`task-${sectionIndex}-${taskIndex}`} className="hover:bg-muted/30">
                      <td className="border border-border px-3 py-2">{task.task}</td>
                      <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
                      <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
                      <td className="border border-border px-2 py-4"></td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Field MCC Electrical Inspection Form" />
      </div>
    </div>
  );
};
