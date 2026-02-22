import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  FileText,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

export const RCDInjectionTestPMDocument = () => {
  const circuitRows = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">RCD Push-button & Injection Test</h1>
              <p className="text-base mt-1 text-primary/80">6 Monthly Test</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Start Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Finish Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Personnel:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Area:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Description:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
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

        {/* PROCEDURE Section */}
        <div className="border-b border-border">
          <div className="bg-blue-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-bold">PROCEDURE</span>
          </div>
          <div className="px-4 py-3 bg-blue-500/5 text-sm space-y-2">
            <p>Inspection, testing and the recording of results shall be completed in accordance with site procedures.</p>
            <p>Any equipment failing its test or inspection shall be rectified at the time of test or inspection. If rectification cannot be achieved, the unserviceable circuit shall be <span className="font-bold text-destructive">tagged out of service</span> and the <span className="font-bold">Electrical Supervisor</span> and/or <span className="font-bold">PTCEW</span> notified immediately upon identification.</p>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Test Table */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          RCD PUSH-BUTTON AND INJECTION TEST
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse min-w-[900px]">
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
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[10px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[10px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1 text-center text-[10px]">I / II</td>
                  <td className="border border-border px-1 py-1 text-center text-[10px]">10 / 30mA</td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[10px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[10px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[10px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1 text-center text-[10px]">P / F</td>
                  <td className="border border-border px-1 py-1 text-center text-[10px]">P / F</td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[10px] border-0 bg-transparent" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Test Instruments */}
        <div className="border-t border-border">
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
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" type="date" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">INSPECTED BY</div>
          <div className="grid grid-cols-3 gap-0">
            <div className="grid grid-cols-[100px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Elect. Cert. No:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
          </div>
        </div>

        {/* Certification */}
        <div className="p-4 text-sm text-muted-foreground italic bg-muted/30">
          This certifies that the electrical equipment / installation as identified in this report, to the extent it is affected by the electrical work, has been tested to ensure it is electrically safe and is in accordance with the requirements of the wiring rules and other applicable standards.
        </div>
      </div>
    </div>
  );
};
