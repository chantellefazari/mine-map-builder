import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlertTriangle, 
  Shield, 
  HardHat,
  FileText,
  ClipboardCheck,
  Calendar,
  Wrench,
  Zap,
  AlertCircle,
  CheckCircle2,
  Info,
  Lock,
  Lightbulb,
  ArrowUp
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface Hazard {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const hazardsList: Hazard[] = [
  { id: "electrical", icon: <Zap className="w-4 h-4" />, label: "Electrical" },
  { id: "heights", icon: <ArrowUp className="w-4 h-4" />, label: "Working at Heights" },
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

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
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical", "heights"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev => 
      prev.includes(hazardId) 
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

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

        {/* PREPARATION Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            PREPARATION
          </div>
          <div className="px-4 py-3 bg-muted/30">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ensure all meters are within calibrated dates.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Section - EXACT from source document */}
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
                <ArrowUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Working at heights or off ladders may apply – follow all site requirements.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Make sure all walkways are clear of obstacles.</span>
              </li>
            </ul>
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

        {/* Tools and PPE Section */}
        <div className="border-b border-border grid md:grid-cols-2">
          <div className="border-r border-border">
            <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              SPECIAL TOOLING REQUIRED
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Ladder (if required)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Cleaning Cloth</span>
                </li>
              </ul>
            </div>
          </div>

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
                  <span>Safety Glasses</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Gloves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="border-b border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">RISK ASSESSMENT</span>
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
                <span>JHA / JSEA</span>
              </label>
            </div>
          </div>
        </div>

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
