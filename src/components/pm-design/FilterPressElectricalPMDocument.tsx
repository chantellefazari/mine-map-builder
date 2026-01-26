import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
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
  Lock,
  Wind
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
  { id: "arc-flash", icon: <Zap className="w-4 h-4" />, label: "Arc Flash" },
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "pneumatic", icon: <Wind className="w-4 h-4" />, label: "Pneumatic" },
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

const areaChecks = [
  { id: 1, item: "Conveyors" },
  { id: 2, item: "Filter Feed Pumps" },
  { id: 3, item: "Agitators" },
  { id: 4, item: "Sump Pump" },
  { id: 5, item: "Conveyor DB" },
  { id: 6, item: "Filter Press DB 1&2" },
  { id: 7, item: "E-Stop Lanyards and Switches" },
  { id: 8, item: "General Condition of Area" },
  { id: 9, item: "Air compressor/Airlines" },
];

export const FilterPressElectricalPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical", "arc-flash", "pneumatic"]);

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
          {/* Logo on left side of black section */}
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          {/* Title on the black section - centered */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Filter Press Electrical</h1>
              <p className="text-base mt-1 text-primary/80">Weekly Visual Site Inspection</p>
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
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
              <div className="px-2 py-1.5">Filter Press</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Electrician (1.5 hrs)</div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Visual Inspection</div>
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

        {/* Task Description */}
        <div className="border-b border-border bg-primary/5 p-4">
          <p className="text-sm font-medium text-foreground">
            <span className="font-bold text-primary">TASK:</span> Perform a thorough visual inspection of the equipment listed in the areas below, paying particular attention to switchboards, LCS enclosures, isolators, cables, tray, indication lamps, motors, instruments, safety guards / lanyards.
          </p>
        </div>

        {/* PREPARATION AND INFORMATION Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            PREPARATION AND INFORMATION
          </div>
          
          {/* Safety Section */}
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
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Read and understand all warning plates on all equipment before on or near the plant.</span>
                </li>
                <li className="flex items-start gap-3">
                  <User className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Ensure Positive Communications and use Spotter where required.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Collect and dispose of rubbish in accordance with site rules.</span>
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
                  <span>Standard Electrical Tool Kit</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Torch / Flashlight</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Cabinet keys</span>
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
              <label className="flex items-center gap-3 text-sm p-2 rounded hover:bg-muted/50 cursor-pointer border border-border">
                <Checkbox className="h-4 w-4" />
                <span>SWMS</span>
              </label>
            </div>
          </div>
        </div>

        {/* Inspections Header */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          GENERAL AREA INSPECTIONS
        </div>

        {/* Inspection Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-center font-semibold w-[8%]">#</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[42%]">Area Checks</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Action</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[30%]">Comments</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Initial</th>
            </tr>
          </thead>
          <tbody>
            {areaChecks.map((check) => (
              <tr key={check.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-center font-medium">{check.id}</td>
                <td className="border border-border px-3 py-2">{check.item}</td>
                <td className="border border-border px-2 py-2 text-center">
                  <div className="flex justify-center">
                    <Checkbox className="h-5 w-5" />
                  </div>
                </td>
                <td className="border border-border px-2 py-2">
                  <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                </td>
                <td className="border border-border px-2 py-2 text-center">
                  <Input className="h-7 w-12 text-xs mx-auto" placeholder="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Comments Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        <Separator />

        {/* Sign Off Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Inspected By:</div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
            <div></div>
          </div>
        </div>

        {/* Certification Statement */}
        <div className="border-t border-border">
          <div className="p-4 text-sm text-muted-foreground italic bg-muted/30">
            This certifies that the electrical equipment / installation as identified in this report, to the extent it is affected by the electrical work, has been tested to ensure it is electrically safe and is in accordance with the requirements of the wiring rules and other applicable standards.
          </div>
        </div>

        {/* Revision History */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Revision History:</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Revision No.</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[35%]">Description</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Created</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[15%]">Reviewed</th>
                <th className="border border-border px-3 py-2 text-left font-medium w-[20%]">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">0</td>
                <td className="border border-border px-3 py-2">Initial Release</td>
                <td className="border border-border px-3 py-2"></td>
                <td className="border border-border px-3 py-2"></td>
                <td className="border border-border px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
