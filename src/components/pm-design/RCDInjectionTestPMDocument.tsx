import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

export const RCDInjectionTestPMDocument = () => {
  const circuitRows = Array.from({ length: 15 }, (_, i) => i + 1);
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "RCD Injection Test 6-Monthly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="RCD Push-button & Injection Test" subtitle="Electrical 6 Monthly Test" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Test"
          frequency="6 Monthly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {/* Test Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            RCD PUSH-BUTTON AND INJECTION TEST
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Cct #</th>
                  <th className="border border-border px-1 py-2 text-left font-semibold w-[15%]">Circuit Desc.</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[8%]">C/B Rating</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[10%]">RCD Type</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[8%]">Test Current</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[10%]">Max Trip Time<br/><span className="text-[9px]">(I: ≤40 / II: ≤300)</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[8%]">0° Trip (ms)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[8%]">180° Trip (ms)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[9%]">Push Button</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[9%]">Injection</th>
                  <th className="border border-border px-1 py-2 text-left font-semibold w-[10%]">Comments</th>
                </tr>
              </thead>
              <tbody>
                {circuitRows.map((num) => (
                  <tr key={num} className="hover:bg-muted/30">
                    <td className="border border-border px-1 py-1 text-center font-medium">{num}</td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-1 text-center text-xs">I / II</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">10 / 30mA</td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-1 text-center text-xs">P / F</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">P / F</td>
                    <td className="border border-border px-1 py-4"></td>
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
                <th className="border border-border px-3 py-2 text-left font-medium">Serial Number</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Calibration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">RCD Injection Tester</td>
                <td className="border border-border px-2 py-4"></td>
                <td className="border border-border px-2 py-4"></td>
                <td className="border border-border px-2 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – RCD Injection Test Form" />
      </div>
    </div>
  );
};
