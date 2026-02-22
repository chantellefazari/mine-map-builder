import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Eye,
  CheckCircle2,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface InspectionTask {
  task: string;
}

interface MCCSection {
  mccId: string;
  mccName: string;
  tasks: InspectionTask[];
}

// Standard MCC inspection tasks - same for all MCCs
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
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Field MCC Inspections</h1>
              <p className="text-base mt-1 text-primary/80">Electrical Weekly Inspection</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-primary" />
                Project / Site:
              </div>
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Area:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Field MCC Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Electrician (4 hrs)</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection (Electrician)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Weekly</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* Scope */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            SCOPE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed">
            <p className="font-medium mb-2">Weekly Field MCC Inspection – Processing Plant</p>
            <p className="text-muted-foreground">
              To safely carry out electrical inspection of all field Motor Control Centres (MCCs) for signs of damage, contamination, or conditions that may require maintenance attention.
            </p>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>Conduct MCC inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-300 rounded p-3 mt-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 font-medium text-xs">
                NOTE: MCCs may be energized during inspection. Ensure 'live testing' safeguards are in place.
              </p>
            </div>
          </div>
        </div>

        {/* Inspections Header */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          FIELD MCC INSPECTIONS
        </div>

        {/* Inspection Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-left font-semibold w-[45%]">Action</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Check</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[35%]">Record Action / Finding</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Initial</th>
            </tr>
          </thead>
          <tbody>
            {mccSections.map((section, sectionIndex) => (
              <>
                <tr key={`section-${sectionIndex}`} className="bg-muted/50">
                  <td colSpan={4} className="border border-border px-3 py-2 font-bold text-primary">
                    {section.mccId} – {section.mccName}
                  </td>
                </tr>
                {section.tasks.map((task, taskIndex) => (
                  <tr key={`task-${sectionIndex}-${taskIndex}`} className="hover:bg-muted/30">
                    <td className="border border-border px-3 py-2">{task.task}</td>
                    <td className="border border-border px-2 py-2 text-center">
                      <Checkbox className="h-4 w-4" />
                    </td>
                    <td className="border border-border px-2 py-2">
                      <Input className="h-7 text-xs border-0 bg-transparent" />
                    </td>
                    <td className="border border-border px-2 py-2 text-center">
                      <Input className="h-7 w-12 text-xs mx-auto" />
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>

        {/* Comments Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS</div>
          <div className="p-3">
            <Textarea className="min-h-[80px]" placeholder="Record any additional comments, defects found, or actions required..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            SIGN-OFF
          </div>
          <div className="grid grid-cols-3 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><div className="h-8 border border-border rounded bg-muted/30"></div></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
