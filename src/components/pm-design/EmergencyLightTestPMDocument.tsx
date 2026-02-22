import { Input } from "@/components/ui/input";
import { 
  ClipboardCheck,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";


const inspectionSteps = [
  { id: 1, item: "Clean fittings so free of dust.", action: "Y / N" },
  { id: 2, item: "Inspect all light fittings are working and are switched correctly. Note any not working on diagram", action: "Y / N" },
  { id: 3, item: "Turn off circuit breakers in LAP to test emergency fittings.", action: "Y / N" },
  { id: 4, item: "Note any emergency fittings which do not work when powered off.", action: "Y / N" },
  { id: 5, item: "After 90 minutes. Check that emergency fittings are still operating. Note any which have failed.", action: "Y / N" },
  { id: 6, item: "Fill out test sheet below.", action: "Y / N" },
  { id: 7, item: "Report any faults identified.", action: "Y / N" },
];

export const EmergencyLightTestPMDocument = () => {

  const testRows = Array.from({ length: 15 }, (_, i) => i + 1);

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Emergency Light Test</h1>
              <p className="text-base mt-1 text-primary/80">3 Monthly / 6 Monthly Test</p>
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

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Inspection Steps */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          INSPECTION
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-left font-semibold w-[75%]">Action Description</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Pass</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[15%]">Comments</th>
            </tr>
          </thead>
          <tbody>
            {inspectionSteps.map((step) => (
              <tr key={step.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2">{step.id}. {step.item}</td>
                <td className="border border-border px-2 py-2 text-center">{step.action}</td>
                <td className="border border-border px-2 py-2">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 6-Monthly Test Table */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-y border-border flex items-center gap-2">
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
                  <td className="border border-border px-1 py-1">
                    <Input className="h-6 text-xs border-0 bg-transparent" />
                  </td>
                  <td className="border border-border px-1 py-1">
                    <Input className="h-6 text-xs border-0 bg-transparent" />
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">Y / N</td>
                  <td className="border border-border px-1 py-1 text-center text-xs">Y / N</td>
                  <td className="border border-border px-1 py-1 text-center text-xs">PASS / FAIL</td>
                  <td className="border border-border px-1 py-1 text-center text-xs">PASS / FAIL</td>
                  <td className="border border-border px-1 py-1 text-center text-xs">PASS / FAIL</td>
                  <td className="border border-border px-1 py-1">
                    <Input className="h-6 text-xs border-0 bg-transparent" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sign Off Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Tested By:</div>
          <div className="grid grid-cols-3 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
