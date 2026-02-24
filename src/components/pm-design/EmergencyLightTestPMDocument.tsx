import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const EmergencyLightTestPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Emergency Light Test Quarterly");
  const testRows = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Emergency Light Test" subtitle="Electrical 12 Weekly Test" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Test"
          frequency="12 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} title="INSPECTION" />

        {/* 6-Monthly Test Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            6-MONTHLY TEST
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">Fitting #</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[15%]">Location</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Type</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Start Time</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Finish Time</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[12%]">Test (With Power)</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[12%]">Test (Without Power)</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Overall Result</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[13%]">Comments</th>
                </tr>
              </thead>
              <tbody>
                {testRows.map((num) => (
                  <tr key={num} className="hover:bg-muted/30">
                    <td className="border border-border px-2 py-1 text-center font-medium">{num}</td>
                    <td className="border border-border px-2 py-4"></td>
                    <td className="border border-border px-2 py-4"></td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Y / N</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Y / N</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">PASS / FAIL</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">PASS / FAIL</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">PASS / FAIL</td>
                    <td className="border border-border px-2 py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Emergency Light Test Form" />
      </div>
    </div>
  );
};