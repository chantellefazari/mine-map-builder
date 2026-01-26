import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlertTriangle, 
  Shield, 
  HardHat,
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Wrench,
  Eye,
  Zap,
  AlertCircle,
  CheckCircle2,
  Info,
  Cog,
  CircleDot,
  Droplets,
  Gauge
} from "lucide-react";
import tennantLogo from "@/assets/tennant-mines-logo.png";
import tennantBanner from "@/assets/tennant-banner-new.png";

interface Hazard {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const hazardsList: Hazard[] = [
  { id: "chemical", icon: <Droplets className="w-4 h-4" />, label: "Chemical" },
  { id: "pressure", icon: <CircleDot className="w-4 h-4" />, label: "Pressure" },
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "electrical", icon: <Zap className="w-4 h-4" />, label: "Electrical" },
  { id: "slippery", icon: <Droplets className="w-4 h-4" />, label: "Slippery" },
];

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
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["chemical", "pressure"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev =>
      prev.includes(hazardId)
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  return (
    <div className="bg-background min-h-full">
      {/* Document Header */}
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          {/* Logo overlay - smaller and positioned left */}
          <div className="absolute bottom-2 left-2">
            <img src={tennantLogo} alt="Tennant Mines" className="h-6" />
          </div>
          {/* Title on the black section - centered */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-wide text-primary">Tenant Creek - RO Plant Inspection</h1>
              <p className="text-lg mt-1 text-primary/80">Mechanical Running PMs - Daily RO Plant Inspection (Fitter)</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          {/* Left Column */}
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
              <div className="px-2 py-1.5">RO Plant</div>
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

          {/* Right Column */}
          <div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mechanical</div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Daily</div>
            </div>
            <div className="grid grid-cols-[80px_1fr]">
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
          
          {/* Scope */}
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

          {/* Safety Section */}
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
                  Follow safety procedures at all times. Isolate equipment where required & ensure use of correct PPE.
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

          {/* Hazard Identification */}
          <div className="border-b border-border">
            <div className="bg-amber-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 font-bold">HAZARD IDENTIFICATION</span>
              <span className="text-xs text-muted-foreground ml-2">(Select all that apply)</span>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {hazardsList.map((hazard) => (
                  <Toggle
                    key={hazard.id}
                    pressed={selectedHazards.includes(hazard.id)}
                    onPressedChange={() => toggleHazard(hazard.id)}
                    className="data-[state=on]:bg-amber-500 data-[state=on]:text-white border border-border px-3 py-2 gap-2"
                    aria-label={`Toggle ${hazard.label} hazard`}
                  >
                    {hazard.icon}
                    <span className="text-sm font-medium">{hazard.label}</span>
                  </Toggle>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Tools and PPE Section - Side by Side */}
        <div className="border-b border-border grid md:grid-cols-2">
          {/* Required Tools */}
          <div className="border-r border-border">
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              SPECIAL TOOLING REQUIRED
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Conductivity meter (if required)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Pressure gauge (backup)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Cleaning materials</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Required PPE */}
          <div>
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <HardHat className="w-4 h-4 text-primary" />
              REQUIRED PPE
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Steel Cap Boots</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Hard Hat</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Safety Glasses</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" />
                  <span>Gloves (when required)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-primary">RISK ASSESSMENT</span>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Complete one of the following before starting work:</p>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>Take 5</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>JHA</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>SWMS</span>
              </label>
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>Other</span>
              </label>
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
                <th className="border-b border-r border-border px-4 py-2 text-left font-semibold">Inspection Task</th>
                <th className="border-b border-r border-border px-2 py-2 text-center font-semibold w-12">✓</th>
                <th className="border-b border-r border-border px-2 py-2 text-center font-semibold w-12">✗</th>
                <th className="border-b border-border px-2 py-2 text-center font-semibold w-12">N/A</th>
              </tr>
            </thead>
            <tbody>
              {inspectionTasks.map((task, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                  <td className="border-b border-r border-border px-4 py-2">{task}</td>
                  <td className="border-b border-r border-border px-2 py-2 text-center">
                    <Checkbox className="h-4 w-4" />
                  </td>
                  <td className="border-b border-r border-border px-2 py-2 text-center">
                    <Checkbox className="h-4 w-4" />
                  </td>
                  <td className="border-b border-border px-2 py-2 text-center">
                    <Checkbox className="h-4 w-4" />
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
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">PT2003<br/><span className="font-normal text-muted-foreground">Before Membrane (bar)</span></th>
                  <th className="border-b border-border px-2 py-2 text-center font-semibold">PT2002<br/><span className="font-normal text-muted-foreground">After Membrane (bar)</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-border px-2 py-4 text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Second Data Table - Pumps and Flow */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted">
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">P-01 Freq<br/><span className="font-normal text-muted-foreground">Hz</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">P-02 Freq<br/><span className="font-normal text-muted-foreground">Hz</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">FT1001<br/><span className="font-normal text-muted-foreground">Brine (lpm)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">FT1002<br/><span className="font-normal text-muted-foreground">Recirc (lpm)</span></th>
                  <th className="border-b border-r border-border px-2 py-2 text-center font-semibold">FT1003<br/><span className="font-normal text-muted-foreground">Permeate (lpm)</span></th>
                  <th className="border-b border-border px-2 py-2 text-center font-semibold">TT5001<br/><span className="font-normal text-muted-foreground">Brine Temp (°C)</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-r border-border px-2 py-4 text-center"></td>
                  <td className="border-b border-border px-2 py-4 text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            COMMENTS
          </div>
          <div className="h-24 px-4 py-2"></div>
        </div>

        {/* Sign Off Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            SIGN OFF
          </div>
          <div className="grid grid-cols-2 text-sm">
            <div className="border-r border-b border-border px-4 py-3 flex items-center gap-2">
              <span className="font-semibold">Follow up work required:</span>
              <span className="text-muted-foreground">Yes / No (Circle)</span>
            </div>
            <div className="border-b border-border px-4 py-3 flex items-center gap-2">
              <span className="font-semibold">Document update required:</span>
              <span className="text-muted-foreground">Yes / No (Circle)</span>
            </div>
            <div className="border-r border-b border-border px-4 py-3">
              <span className="font-semibold">Name:</span>
            </div>
            <div className="border-b border-border px-4 py-3">
              <span className="font-semibold">Signature:</span>
            </div>
            <div className="border-r border-border px-4 py-3">
              <span className="font-semibold">Date:</span>
            </div>
            <div className="px-4 py-3">
              <span className="font-semibold">PM Duration:</span>
            </div>
          </div>
        </div>

        {/* Approval Section */}
        <div className="border-b border-border">
          <div className="bg-primary text-primary-foreground px-4 py-2 font-semibold text-sm border-b border-border">
            APPROVAL
          </div>
          <div className="text-sm">
            <div className="grid grid-cols-[100px_1fr_80px_1fr_60px_1fr] items-center">
              <div className="bg-muted px-3 py-3 font-semibold border-r border-border">Supervisor:</div>
              <div className="px-3 py-3 border-r border-border">Name:</div>
              <div className="bg-muted px-3 py-3 font-semibold border-r border-border">Sign:</div>
              <div className="px-3 py-3 border-r border-border"></div>
              <div className="bg-muted px-3 py-3 font-semibold border-r border-border">Date:</div>
              <div className="px-3 py-3"></div>
            </div>
          </div>
        </div>

        {/* Revision History */}
        <div>
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            REVISION HISTORY
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border-b border-r border-border px-4 py-2 text-left font-semibold w-20">Rev No.</th>
                <th className="border-b border-r border-border px-4 py-2 text-left font-semibold">Description</th>
                <th className="border-b border-r border-border px-4 py-2 text-left font-semibold w-24">Created</th>
                <th className="border-b border-r border-border px-4 py-2 text-left font-semibold w-24">Reviewed</th>
                <th className="border-b border-border px-4 py-2 text-left font-semibold w-24">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-border px-4 py-2">0</td>
                <td className="border-r border-border px-4 py-2">Initial Release</td>
                <td className="border-r border-border px-4 py-2"></td>
                <td className="border-r border-border px-4 py-2"></td>
                <td className="px-4 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
