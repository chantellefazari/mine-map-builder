import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";

const insideSubstationChecks = [
  { id: 1, task: "Check Fire extinguishers are in position" },
  { id: 2, task: "Check Fire extinguishers in date" },
  { id: 3, task: "Check Vesda System is not in alarm" },
  { id: 4, task: "Check Fire alarm Panel for Faults" },
  { id: 5, task: "Check lights are all functioning correctly" },
  { id: 6, task: "Check air conditioner is on" },
  { id: 7, task: "Check floor is clear from items or materials" },
  { id: 8, task: "Vacuum floor inside Substation" },
  { id: 9, task: "Mop Floor" },
  { id: 10, task: "Ensure door locks function correctly and are locked" },
  { id: 11, task: "Check LV rescue kit is on hooks and in date" },
  { id: 12, task: "Check ARC Flash signs are in position and legible" },
  { id: 13, task: "Check isolation tag holder is full of Tags" },
];

const outsideSubstationChecks = [
  { id: 14, task: "Check Fire extinguishers are in position" },
  { id: 15, task: "Check Fire extinguishers in date" },
  { id: 16, task: "Check no rubbish or tools around the Substation" },
];

export const SubstationInspectionPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Substation Inspection Fortnightly");
  const renderTable = (checks: { id: number; task: string }[]) => (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-muted">
          <th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th>
          <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
          <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
          <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
        </tr>
      </thead>
      <tbody>
        {checks.map((item) => (
          <tr key={item.id} className="hover:bg-muted/30">
            <td className="border border-border px-3 py-2">{item.task}</td>
            <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
            <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
            <td className="border border-border px-2 py-4"></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Substation Inspection" subtitle="Electrical 2 Weekly Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Substation"
          pmGroup="Electrical"
          pmType="Visual Inspection"
          frequency="2 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSIDE SUBSTATION
          </div>
          {renderTable(insideSubstationChecks)}
        </div>

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            OUTSIDE SUBSTATION
          </div>
          {renderTable(outsideSubstationChecks)}
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Substation Inspection Form" />
      </div>
    </div>
  );
};
