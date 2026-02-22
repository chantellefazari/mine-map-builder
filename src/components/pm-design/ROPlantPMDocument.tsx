import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ClipboardCheck,
  CheckCircle2,
  Gauge
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

const inspectionTasks = [
  "Inspect Reject Water Colour",
  "Inspect Cartridge Filter",
  "Record Date of Cartridge Filter Install",
  "Inspect/Record Level of Anti-scalant",
  "Inspect HMI for any present Faults",
  "Inspect Pipework/Valving for Damage or Leaks",
  "Inspect Dosing Pump Function (Should be set to 25 Pulses per minute)",
  "Check Aircon Operation and Cleanliness",
  "Inspect and Clean Container",
  "Inspect Flush Tank Level",
];

export const ROPlantPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner with Title Overlay and Work Order */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek - RO Plant Inspection</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Daily RO Plant Inspection (Fitter)</p>
            </div>
          </div>
          <div className="absolute bottom-1 right-2 h-[40%] flex items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary tracking-tight">WO#:</span>
              <Input className="h-6 w-24 text-xs bg-background/90 border-primary/40 focus-visible:ring-primary shadow-sm" placeholder="______" maxLength={6} />
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">
                Project / Site:
              </div>
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
              <div className="px-2 py-1.5">RO Plant</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Fitter (2 hrs)</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mechanical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Daily</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Inspection Tasks Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            SYSTEM, ASSEMBLY AND COMPONENTS CHECK
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-semibold w-[50%]">Task</th>
                 <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
                 <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
                 <th className="border border-border px-3 py-2 text-left font-semibold w-[30%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {inspectionTasks.map((task, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2">{task}</td>
                  <td className="border border-border px-2 py-2 text-center">
                    <div className="flex justify-center">
                      <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                    </div>
                  </td>
                  <td className="border border-border px-2 py-2 text-center">
                    <div className="flex justify-center">
                      <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                    </div>
                  </td>
                  <td className="border border-border px-2 py-2">
                    <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data Logging Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            DATA LOGGING
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-2 text-center font-semibold">CT4001<br/><span className="font-normal text-muted-foreground">Feed (µs/cm)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">CT4002<br/><span className="font-normal text-muted-foreground">Permeate (µs/cm)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">PI-01<br/><span className="font-normal text-muted-foreground">Before Media (bar)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">PI-02<br/><span className="font-normal text-muted-foreground">After Media (bar)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">PT2001<br/><span className="font-normal text-muted-foreground">After Cartridge (bar)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">PT2002<br/><span className="font-normal text-muted-foreground">Stage 1 (bar)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">PT2003<br/><span className="font-normal text-muted-foreground">Stage 2 (bar)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold">PT2004<br/><span className="font-normal text-muted-foreground">Concentrate (bar)</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Array(8).fill(null).map((_, idx) => (
                    <td key={idx} className="border border-border px-2 py-3 text-center">
                      <Input className="h-7 text-xs text-center border-0 bg-transparent w-full" placeholder="" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">SIGN OFF</div>
          <div className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 gap-x-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium w-52">Follow up work required:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Checkbox className="h-4 w-4" />
                    <span className="text-sm">Yes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Checkbox className="h-4 w-4" />
                    <span className="text-sm">No</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium w-52">Document update required:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Checkbox className="h-4 w-4" />
                    <span className="text-sm">Yes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Checkbox className="h-4 w-4" />
                    <span className="text-sm">No</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">Name:</span>
                <Input className="h-7" />
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">Signature:</span>
                <div className="h-7 border border-border rounded bg-muted/30"></div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">Date:</span>
                <Input className="h-7" type="date" />
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-sm font-medium">PM Duration:</span>
                <Input className="h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Approval */}
        <div className="border-t border-border">
          <div className="bg-green-500/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">APPROVAL</span>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-4 py-2 text-left font-semibold w-[20%]">Role</th>
                <th className="px-4 py-2 text-left font-semibold w-[25%]">Name</th>
                <th className="px-4 py-2 text-left font-semibold w-[25%]">Sign</th>
                <th className="px-4 py-2 text-left font-semibold w-[30%]">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium">Supervisor</td>
                <td className="px-4 py-2"><Input className="h-7 text-xs" /></td>
                <td className="px-4 py-2"><div className="h-7 border border-border rounded bg-muted/30"></div></td>
                <td className="px-4 py-2"><Input className="h-7 text-xs" type="date" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
          Tennant Creek Mining Operations – Processing Plant Inspection Form
        </div>
      </div>
    </div>
  );
};
