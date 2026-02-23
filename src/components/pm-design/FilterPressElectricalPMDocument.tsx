import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

interface Task { task: string; }
interface InspectionSection { equipmentId: string; equipmentName: string; tasks: Task[]; }

const inspectionData: InspectionSection[] = [
  { equipmentId: "FP-SB-001", equipmentName: "Filter Press Switch Board", tasks: [
    { task: "Check DB door seals for integrity" }, { task: "Check all breakers are labelled correctly" },
    { task: "Check for any loose connections" }, { task: "Check for any signs of overheating on breakers" },
    { task: "Check for any damage to internal components" }, { task: "Check for any vermin or water ingress" },
    { task: "Check all cable glands are tight" }, { task: "Check all doors are closing and sealing correctly" },
    { task: "Check all lights are working correctly" }, { task: "Check the area is clean and clear of obstructions" },
  ]},
  { equipmentId: "FP-LCS-001", equipmentName: "Filter Press Local Control Station", tasks: [
    { task: "Check enclosure door seals for integrity" }, { task: "Check all pushbuttons are labelled correctly" },
    { task: "Check all lights are working correctly" }, { task: "Check the HMI is working correctly" },
    { task: "Check the area is clean and clear of obstructions" }, { task: "Check all cable glands are tight" },
    { task: "Check all doors are closing and sealing correctly" },
  ]},
  { equipmentId: "FP-ISOL-001", equipmentName: "Filter Press Isolator", tasks: [
    { task: "Check enclosure door seals for integrity" }, { task: "Check the isolator is labelled correctly" },
    { task: "Check the area is clean and clear of obstructions" }, { task: "Check all cable glands are tight" },
    { task: "Check all doors are closing and sealing correctly" },
  ]},
  { equipmentId: "FP-CABLE-001", equipmentName: "Filter Press Cables", tasks: [
    { task: "Check all cables are supported correctly" }, { task: "Check all cables are labelled correctly" },
    { task: "Check all cables are in good condition" }, { task: "Check all cable trays are in good condition" },
    { task: "Check all cable glands are tight" },
  ]},
  { equipmentId: "FP-MOTOR-001", equipmentName: "Filter Press Motor", tasks: [
    { task: "Check motor fan is in good condition" }, { task: "Check motor is labelled correctly" },
    { task: "Check motor is in good condition" }, { task: "Check motor is clean and free of debris" },
    { task: "Check motor cable glands are tight" }, { task: "Check motor is mounted correctly" },
  ]},
  { equipmentId: "FP-INST-001", equipmentName: "Filter Press Instruments", tasks: [
    { task: "Check instrument is labelled correctly" }, { task: "Check instrument is in good condition" },
    { task: "Check instrument is clean and free of debris" }, { task: "Check instrument cable glands are tight" },
    { task: "Check instrument is mounted correctly" },
  ]},
  { equipmentId: "FP-GUARD-001", equipmentName: "Filter Press Safety Guards", tasks: [
    { task: "Check all safety guards are in good condition" }, { task: "Check all safety guards are labelled correctly" },
    { task: "Check all safety guards are mounted correctly" }, { task: "Check all safety lanyards are in good condition" },
    { task: "Check all safety lanyards are labelled correctly" }, { task: "Check all safety lanyards are mounted correctly" },
  ]},
];

export const FilterPressElectricalPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Tennant Creek Filtration Area – Filter Press Weekly Electrical Online Inspection (Electrician)");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tennant Creek Filtration Area – Filter Press" subtitle="Weekly Electrical Online Inspection (Electrician)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Filter Press"
          pmGroup="Electrical"
          pmType="Online Visual Inspection"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            DETAILED EQUIPMENT INSPECTIONS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
            <tbody>
              {inspectionData.map((section, sectionIndex) => (
                <>
                  <tr key={`section-${sectionIndex}`} className="bg-primary/10"><td colSpan={4} className="border border-border px-3 py-2 font-semibold text-primary">{section.equipmentId} – {section.equipmentName}</td></tr>
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

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Filter Press Electrical Inspection Form" />
      </div>
    </div>
  );
};
