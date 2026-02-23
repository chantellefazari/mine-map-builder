import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";

const filterPress1Checks = [
  { id: 1, task: "Verification – Pull Wire Function (Head End)" },
  { id: 2, task: "Verification – Pull Wire Function (Tail End)" },
  { id: 3, task: "Verification – LCS E-STOP Function" },
];

const filterPress2Checks = [
  { id: 1, task: "Verification – Pull Wire Function (Head End)" },
  { id: 2, task: "Verification – Pull Wire Function (Tail End)" },
  { id: 3, task: "Verification – LCS E-STOP Function" },
];

const extractionConveyorChecks = [
  { id: 1, task: "Verification – Pull Wire Function (Head End)" },
  { id: 2, task: "Verification – Pull Wire Function (Tail End)" },
];

const transferConveyorChecks = [
  { id: 1, task: "Verification – Pull Wire Function (Head End)" },
  { id: 2, task: "Verification – Pull Wire Function (Tail End)" },
];

const reclaimStackerChecks = [
  { id: 1, task: "Verification – Pull Wire Function (Head End)" },
  { id: 2, task: "Verification – Pull Wire Function (Tail End)" },
];

const renderAssetSection = (assetName: string, checks: { id: number; task: string }[]) => (
  <div className="border-b border-border">
    <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
      <ClipboardCheck className="w-5 h-5 text-primary" />
      {assetName}
    </div>
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
  </div>
);

export const PullWireChecksPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Pull Wire Checks Quarterly");
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Pull Wire Checks" subtitle="Electrical 12 Weekly Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Filter Press"
          pmGroup="Electrical"
          pmType="Inspection"
          frequency="12 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {renderAssetSection("FILTER PRESS 1", filterPress1Checks)}
        {renderAssetSection("FILTER PRESS 2", filterPress2Checks)}
        {renderAssetSection("FILTER PRESS 1 EXTRACTION CONVEYOR", extractionConveyorChecks)}
        {renderAssetSection("FILTER PRESS TRANSFER", transferConveyorChecks)}
        {renderAssetSection("FILTER PRESS RECLAIM STACKER", reclaimStackerChecks)}

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Pull Wire Checks Inspection Form" />
      </div>
    </div>
  );
};
