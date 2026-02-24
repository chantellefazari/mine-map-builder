import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck, Zap } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

const checklistItems = [
  { id: "earth-lock-ring", label: "Earth Lock Ring" },
  { id: "glands-correct", label: "Glands Correct/Tight/Secured" },
  { id: "cable-label", label: "Cable Label Fitted" },
  { id: "cables-terminated", label: "Cables Terminated and Secured" },
  { id: "line-shrouds", label: "Line Shrouds Fitted" },
  { id: "bridges-removed", label: "Bridges Removed" },
  { id: "tools-removed", label: "Tools Removed" },
  { id: "cable-support", label: "Cable Support System OK" },
  { id: "gland-wrapped", label: "Cable Gland Wrapped in Denso" },
];

export const CableTestSheetPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Cable Test Sheet Yearly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Cable Test Sheet" subtitle="Electrical As Required" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Test"
          frequency="As Required"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        {/* Meter Information */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Meter Information</div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left font-medium">Make/Model</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Serial No</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Certified Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-4"></td>
                <td className="border border-border px-3 py-4"></td>
                <td className="border border-border px-3 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <SafetyPrecautionsSection />

        {/* Insulation Resistance Test */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            INSULATION RESISTANCE (MEGA OHMS)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-2 text-center font-semibold">R-W</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">R-B</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">W-B</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">R-E</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">W-E</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">B-E</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">R-N</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">W-N</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">B-N</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <td key={i} className="border border-border px-2 py-4"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Test Results */}
        <div className="border-b border-border">
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold w-[30%]">N-E Fault Loop Impedance (OHMS)</td>
                <td className="border border-border px-3 py-4 w-[20%]"></td>
                <td className="border border-border px-3 py-2 font-semibold w-[15%]">Continuity Earth (Ω)</td>
                <td className="border border-border px-3 py-4 w-[15%]"></td>
                <td className="border border-border px-3 py-2 font-semibold w-[10%]">SWA (Ω)</td>
                <td className="border border-border px-3 py-4 w-[10%]"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Checklist */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            CHECK LIST
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Item</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
                <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {checklistItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2">{item.label}</td>
                  <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
                  <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
                  <td className="border border-border px-2 py-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Checks */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Additional Checks Carried Out</div>
          <div className="px-3 py-6"></div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Cable Test Sheet Form" />
      </div>
    </div>
  );
};
