import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Lock
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
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

const inspectionChecks = [
  { id: 1, item: "General Condition", action: "Record" },
  { id: 2, item: "Hot Joints (Burning/Discolouration)", action: "Record" },
  { id: 3, item: "Busbar Loading", action: "Record" },
  { id: 4, item: "Thermoscan (If applicable)", action: "Record" },
  { id: 5, item: "Creepage and Clearance distances maintained", action: "Record", note: "(Minimum 31mm, AS 3007.2)" },
  { id: 6, item: "Cable Entries Watertight, Secure and Fixed in Position", action: "Record" },
  { id: 7, item: "Live Parts Adequately Enclosed / Insulated and Marked \"Isolate Elsewhere\"", action: "Record" },
  { id: 8, item: "Switch Board Mounting and Mechanical Protection", action: "Record" },
  { id: 9, item: "Check Switchboard number and name labelling", action: "Record" },
  { id: 10, item: "Legend and circuit identification", action: "Record" },
  { id: 11, item: "Switchboard isolation label", action: "Record" },
  { id: 12, item: "Circuit breaker lockouts available", action: "Record" },
  { id: 13, item: "Fuse/Circuit Breaker sizes are correct and correctly marked", action: "Record" },
  { id: 14, item: "Where is This DB Fed From", action: "Record" },
  { id: 15, item: "Overall Cleanliness", action: "Record" },
];

export const SwitchboardInspectionPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical", "arc-flash"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev => 
      prev.includes(hazardId) 
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">12 Monthly Switchboard Inspection</h1>
              <p className="text-base mt-1 text-primary/80">52 Week Inspection</p>
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
              <div className="px-2 py-1.5">Tennant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">52 Week</div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Area:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
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
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Ensure all parts, materials and tooling are available and prepared prior to requesting machine for service.</span>
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
                  <span>Standard Electrical Tool Kit</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Thermal Imaging Camera (if applicable)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Multimeter</span>
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

        {/* Inspection Table */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          SWITCHBOARD INSPECTION
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-center font-semibold w-[8%]">#</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[52%]">System, assembly or components</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Action</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[30%]">Comments</th>
            </tr>
          </thead>
          <tbody>
            {inspectionChecks.map((check) => (
              <tr key={check.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-center font-medium">{check.id}</td>
                <td className="border border-border px-3 py-2">
                  {check.item}
                  {check.note && <span className="text-xs text-muted-foreground ml-1">{check.note}</span>}
                </td>
                <td className="border border-border px-2 py-2 text-center">{check.action}</td>
                <td className="border border-border px-2 py-2">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
