import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

export const FullTestSheetPMDocument = () => {
  const testRows = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Electrical Installation Testing" subtitle="Record Sheet" />

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
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">52 Week</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        {/* Test Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            ELECTRICAL INSTALLATION TESTING RECORD
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[9px] border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[8%]">Test Point/<br/>Circuit No.</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">Conductor<br/>Sizes (mm²)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">MCB<br/>(Rating & Type)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Active Ω<br/>(Rph)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Earth or<br/>Ω (Re)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">Continuity<br/>Pass/Fail</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Insulation<br/>Resistance (MΩ)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Pass/<br/>Fail</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Correct Circuit<br/>Connections</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Polarity<br/>Pass/Fail</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Fault Loop<br/>Impedance R (Ω)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Max Permitted<br/>Loop Value R (Ω)</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Pass/<br/>Fail</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">RCD<br/>Pass/Fail</th>
                  <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">RCD Trip<br/>Time (mSec)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/30">
                  <td className="border border-border px-1 py-1 text-center font-medium">Main</td>
                  <td className="border border-border px-1 py-4"></td>
                  <td className="border border-border px-1 py-4"></td>
                  <td className="border border-border px-1 py-4"></td>
                  <td className="border border-border px-1 py-4"></td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-4"></td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-4"></td>
                  <td className="border border-border px-1 py-4"></td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-4"></td>
                </tr>
                {testRows.map((num) => (
                  <tr key={num} className="hover:bg-muted/30">
                    <td className="border border-border px-1 py-1 text-center font-medium">{num}</td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-1 text-center">P / F</td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-1 text-center">P / F</td>
                    <td className="border border-border px-1 py-1 text-center">P / F</td>
                    <td className="border border-border px-1 py-1 text-center">P / F</td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-4"></td>
                    <td className="border border-border px-1 py-1 text-center">P / F</td>
                    <td className="border border-border px-1 py-1 text-center">P / F</td>
                    <td className="border border-border px-1 py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Electrical Installation Testing Record" />
      </div>
    </div>
  );
};
