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
  Lock
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

const calibrationReadings = [
  { id: "reading-before-clean", label: "pH Reading before clean" },
  { id: "reading-after-clean", label: "pH Reading after clean" },
  { id: "ph7-before-cal", label: "pH 7 Before Calibration" },
  { id: "ph7-after-cal", label: "pH 7 Reading after Calibration" },
  { id: "ph10-before-cal", label: "pH 10 Reading before Calibration" },
  { id: "ph10-after-cal", label: "pH 10 Reading after Calibration" },
  { id: "reading-final", label: "pH Reading after Clean" },
];

const cleaningProcedure = [
  "Inform operations that you are about to clean the pH probes.",
  "Place the pH control loop in manual by bringing up the faceplate for PHIT-4xxx, clicking on the MAN/AUT/CAS section of the faceplate, and selecting the manual button. Ask an operator to do this for you if you are unsure.",
  "Remove the probe from the rougher and hose it down to remove any build up of slurry.",
  "Remove the probe from the probe holder and after washing off any excess slurry place it in the beaker of hydrochloric acid to soak.",
  "Rinse the probe in the potable water to dilute the acid and wipe down the probe. The paintbrush or the side of a cloth rag may be necessary to clean between the electrodes.",
  "If necessary, scrape off any scale build up with the knife, being very careful not to fracture the glass electrode.",
  "Repeat steps 4-6 as necessary until all the scale has been removed.",
  "Ensure the probe is reading within the expected range before returning it to automatic control; refer to step 2.",
];

const calibrationProcedure = [
  'Select the "Gear Icon"',
  'Select "Calibration"',
  'Select "Automatic"',
  'Select "Zero/Slope"',
  'Place Probe in pH 7 and select "pH 7"',
  'Wait until pH settles out while in pH 7 Solution then select "Adjust now"',
  "Once instructed to go to next Buffer, Clean the pH Probe with water first.",
  'Place pH Probe in pH 10 Solution and select "pH 10"',
  'Wait until pH settles out, then select "Adjust now"',
  'When finished select "CAL COMPLETE"',
  'Select "ACCEPT DATA"',
  'Select "NO" to new sensor',
  "Return to home screen",
];

export const PHProbeCalibrationPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">pH Probe Cleaning & Calibration</h1>
              <p className="text-base mt-1 text-primary/80">Electrical Weekly Procedure</p>
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
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">pH Probe Location:</div>
              <div className="px-2 py-1.5">CIP Tank 1</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Electrician (1 hr)</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Calibration</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Weekly</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* PREPARATION Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            PREPARATION
          </div>
          
          <div className="border-b border-border">
            <div className="px-4 py-3 text-sm leading-relaxed space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ensure all meters are within calibrated dates.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ensure all parts, materials and tooling are available and prepared prior to requesting machine for service.</span>
              </div>
            </div>
          </div>

          <div className="border-b border-border">
            <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              <span className="text-destructive font-bold">SAFETY PRECAUTIONS</span>
            </div>
            <div className="px-4 py-4 bg-destructive/5">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Conduct <span className="font-bold text-destructive">Take 5</span> and/or <span className="font-bold text-destructive">JSEA</span> as required.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Ensure isolations and/or 'live testing' safeguards are in place before commencing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Follow OEM instructions and site procedures as required.</span>
                </li>
                <li className="flex items-start gap-3">
                  <HardHat className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Minimum PPE: Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as per task or as required.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cleaning Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE FOR CLEANING pH PROBES
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              The Rougher pH probe (AIC-0933) needs to be cleaned at least every week to prevent scale from fouling the electrodes and inhibiting the responsiveness of the probe.
            </p>
            <ol className="space-y-3 text-sm">
              {cleaningProcedure.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Calibration Readings Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            CALIBRATION READINGS - CIP TANK 1
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-semibold w-[50%]">Measurement</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">Action</th>
                <th className="border border-border px-3 py-2 text-left font-semibold w-[35%]">Reading / Comments</th>
              </tr>
            </thead>
            <tbody>
              {calibrationReadings.map((reading) => (
                <tr key={reading.id} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2">{reading.label}</td>
                  <td className="border border-border px-2 py-2 text-center text-xs text-muted-foreground">Record</td>
                  <td className="border border-border px-2 py-2">
                    <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calibration Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            WEEKLY pH PROBE CALIBRATION PROCEDURE
          </div>
          <div className="p-4">
            <ol className="space-y-2 text-sm">
              {calibrationProcedure.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
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
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">Sign-Off</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-2 text-left font-semibold">Tested By</th>
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
          Tennant Creek Mining Operations – Electrical Calibration Form
        </div>
      </div>
    </div>
  );
};
