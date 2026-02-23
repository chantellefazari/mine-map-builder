import { Checkbox } from "@/components/ui/checkbox";

import { ClipboardCheck } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface InspectionTask { task: string; recommendedAmount: string; }

const inspectionData: InspectionTask[] = [
  { task: "Renolin CLP 320", recommendedAmount: "1000L" },
  { task: "Renolin CLP 220", recommendedAmount: "1000L" },
  { task: "Hydraulic 46", recommendedAmount: "1000L" },
  { task: "Hydraulic 68", recommendedAmount: "400L" },
  { task: "XTB2 General Purpose Grease Cartridges", recommendedAmount: "36" },
  { task: "Electrical Motor Grease Cartridges", recommendedAmount: "24" },
];

export const GreaseOilsPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Grease & Oils Weekly Inspection");
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Store Area - Grease and Oils" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="Store"
          pmGroup="Mechanical"
          pmType="Inspection (Fitter)"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            STOCK LEVEL CHECKS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-muted"><th className="border border-border px-2 py-2 text-left font-semibold w-[31%]">Item</th><th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">Recommended</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-2 py-2 text-left font-semibold w-[34%]">Qty Left</th></tr></thead>
            <tbody>
              {inspectionData.map((item, idx) => (
                <tr key={`item-${idx}`} className="hover:bg-muted/50">
                  <td className="border border-border px-2 py-2">{item.task}</td>
                  <td className="border border-border px-2 py-2 text-center font-medium">{item.recommendedAmount}</td>
                  <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></td>
                  <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></td>
                  <td className="border border-border px-2 py-2 text-muted-foreground">_______</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock />
      </div>
    </div>
  );
};
