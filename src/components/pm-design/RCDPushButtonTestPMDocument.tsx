import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

export const RCDPushButtonTestPMDocument = () => {
  const circuitRows = Array.from({ length: 21 }, (_, i) => i + 1);
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "RCD Push-button Test Quarterly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="RCD Push-button Test" subtitle="Electrical 12 Weekly Test" />

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

        {/* Test Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            RCD PUSH-BUTTON TEST
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">Circuit #</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[22%]">Circuit Description</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[12%]">C/B Current Rating</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">RCD Type<br/><span className="text-[10px] font-normal">(I: ≤10mA / II: &gt;10mA ≤30mA)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">Push Button Test Result</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[28%]">Comments</th>
                </tr>
              </thead>
              <tbody>
                {circuitRows.map((num) => (
                  <tr key={num} className="hover:bg-muted/30">
                    <td className="border border-border px-2 py-1 text-center font-medium">{num}</td>
                    <td className="border border-border px-2 py-4"></td>
                    <td className="border border-border px-2 py-4"></td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Type I / Type II</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Pass / Fail</td>
                    <td className="border border-border px-2 py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Instruments */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Test Instruments (record serial numbers)</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left font-medium">Make</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Model</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Calibration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">RCD Meter</td>
                <td className="border border-border px-2 py-4"></td>
                <td className="border border-border px-2 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – RCD Push-button Test Form" showElecCertNo />
      </div>
    </div>
  );
};
