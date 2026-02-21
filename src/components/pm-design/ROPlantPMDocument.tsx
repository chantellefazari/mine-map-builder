import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Shield, 
  HardHat,
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Eye,
  Zap,
  CheckCircle2,
  Info,
  Gauge
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

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
        {/* Banner with Title Overlay */}
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
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-primary" />
                Project / Site:
              </div>
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div>
              <div className="px-2 py-1.5">RO Plant</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
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
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
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

        {/* PREPARATION AND INFORMATION Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            PREPARATION AND INFORMATION
          </div>
          
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              SCOPE
            </div>
            <div className="px-4 py-3 text-sm leading-relaxed">
              <p className="font-medium mb-2">Daily Running Inspection – RO Plant</p>
              <p className="text-muted-foreground">
                When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.
                If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.
              </p>
            </div>
          </div>

          <div className="border-b border-border">
            <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              <span className="text-destructive font-bold">SAFETY</span>
            </div>
            <div className="px-4 py-4 bg-destructive/5">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">
                  Before commencing this work complete a <span className="font-bold text-destructive">TAKE 5</span> every time to check that no abnormal conditions exist.
                </p>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <HardHat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Minimum PPE: Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as per task or as required.
                </p>
              </div>
              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                <Zap className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-destructive">
                  Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>If a defect cannot be repaired, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
            </div>
          </div>
        </div>

        {/* Inspection Tasks Table */}
        <div className="border-b border-border">
          <div className="bg-primary px-4 py-2 font-bold text-sm text-primary-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" />
            SYSTEM, ASSEMBLY AND COMPONENTS CHECK
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="border-b border-r border-border px-4 py-2 text-left font-semibold">Task</th>
                <th className="border-b border-r border-border px-2 py-2 text-center font-semibold w-12">✓</th>
                <th className="border-b border-r border-border px-2 py-2 text-center font-semibold w-12">✗</th>
                <th className="border-b border-border px-4 py-2 text-left font-semibold w-48">Comments</th>
              </tr>
            </thead>
            <tbody>
              {inspectionTasks.map((task, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                  <td className="border-b border-r border-border px-4 py-2">{task}</td>
                  <td className="border-b border-r border-border px-2 py-2 text-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                  </td>
                  <td className="border-b border-r border-border px-2 py-2 text-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                  </td>
                  <td className="border-b border-border px-2 py-2">
                    <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data Logging Table */}
        <div className="border-b border-border">
          <div className="bg-primary px-4 py-2 font-bold text-sm text-primary-foreground flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            DATA LOGGING
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">CT4001<br/><span className="font-normal text-muted-foreground">Feed (µs/cm)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">CT4002<br/><span className="font-normal text-muted-foreground">Permeate (µs/cm)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">PI-01<br/><span className="font-normal text-muted-foreground">Before Media (bar)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">PI-02<br/><span className="font-normal text-muted-foreground">After Media (bar)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">PT2001<br/><span className="font-normal text-muted-foreground">After Cartridge (bar)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">PT2002<br/><span className="font-normal text-muted-foreground">Stage 1 (bar)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">PT2003<br/><span className="font-normal text-muted-foreground">Stage 2 (bar)</span></th>
                  <th className="border-b border-border px-2 py-2 text-center font-semibold">PT2004<br/><span className="font-normal text-muted-foreground">Concentrate (bar)</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Array(8).fill(null).map((_, idx) => (
                    <td key={idx} className="border-b border-r border-border px-2 py-3 text-center">
                      <Input className="h-7 text-xs text-center border-0 bg-transparent w-full" placeholder="" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">Sign-Off</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-2 text-left font-semibold">Checked By</th>
                  <th className="px-4 py-2 text-left font-semibold">Signature</th>
                  <th className="px-4 py-2 text-left font-semibold w-32">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2"><Input className="h-7 text-xs" /></td>
                  <td className="px-4 py-2"><div className="h-8 border border-border rounded bg-muted/30"></div></td>
                  <td className="px-4 py-2"><Input className="h-7 text-xs" type="date" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
          Tennant Creek Mining Operations – Processing Plant Inspection Form
        </div>
      </div>
    </div>
  );
};
