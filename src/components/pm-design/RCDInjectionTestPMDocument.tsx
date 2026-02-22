import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

export const RCDInjectionTestPMDocument = () => {
  const circuitRows = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="RCD Push-button & Injection Test" subtitle="Electrical 6 Monthly Test" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tennant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div><div className="px-2 py-1.5"></div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Electrical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Test</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">6 Monthly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

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
