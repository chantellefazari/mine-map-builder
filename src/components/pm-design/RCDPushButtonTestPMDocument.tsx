import { Input } from "@/components/ui/input";
import { ClipboardCheck, FileText, CheckCircle2 } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

export const RCDPushButtonTestPMDocument = () => {
  const circuitRows = Array.from({ length: 21 }, (_, i) => i + 1);

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="RCD Push-button Test" subtitle="Electrical 12 Weekly Test" />

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
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">12 Weekly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        {/* Preparation */}
        <div className="border-b border-border">
          <div className="px-4 py-3 bg-muted/30">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ensure all meters are within calibrated dates.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ensure all parts, materials and tooling are available and prepared prior to requesting machine for service.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Procedure */}
        <div className="border-b border-border">
          <div className="bg-blue-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-bold">PROCEDURE</span>
          </div>
          <div className="px-4 py-3 bg-blue-500/5 text-sm">
            <p>Any equipment failing its test or inspection shall be rectified at the time of test or inspection. If rectification cannot be achieved, the unserviceable circuit shall be <span className="font-bold text-destructive">tagged out of service</span> and the <span className="font-bold">Electrical Supervisor</span> and/or <span className="font-bold">PTCEW</span> notified immediately upon identification.</p>
          </div>
        </div>

        <SafetyPrecautionsSection />

        {/* Test Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            RCD PUSH-BUTTON TEST
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[700px]">
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

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – RCD Push-button Test Form" />
      </div>
    </div>
  );
};
