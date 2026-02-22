import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck, Lightbulb } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

const inspectionSteps = [
  { id: 1, task: "Clean fittings so free of dust." },
  { id: 2, task: "Inspect all light fittings are working and are switched correctly. Note any not working on diagram" },
  { id: 3, task: "Turn off circuit breakers in LAP to test emergency fittings." },
  { id: 4, task: "Note any emergency fittings which do not work when powered off." },
  { id: 5, task: "After 90 minutes. Check that emergency fittings are still operating. Note any which have failed." },
  { id: 6, task: "Fill out test sheet below." },
  { id: 7, task: "Report any faults identified." },
];

export const EmergencyLightTestPMDocument = () => {
  const testRows = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Emergency Light Test" subtitle="Electrical 12 Weekly Test" />

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

        <SafetyPrecautionsSection />

        {/* Inspection Steps */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            INSPECTION
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
              {inspectionSteps.map((item) => (
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
