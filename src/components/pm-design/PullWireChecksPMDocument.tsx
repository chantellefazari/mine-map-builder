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
  Cog,
  Flame,
  Users
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
  { id: "mechanical", icon: <Cog className="w-4 h-4" />, label: "Mechanical" },
  { id: "hot-surfaces", icon: <Flame className="w-4 h-4" />, label: "Hot Surfaces" },
];

const filterPress1Checks = [
  { id: 1, item: "Verification – Pull Wire Function", action: "Check" },
  { id: 2, item: "Verification – Pull Wire Function", action: "Check" },
  { id: 3, item: "Verification – LCS E-STOP Function", action: "Check" },
];

const filterPress2Checks = [
  { id: 1, item: "Verification – Pull Wire Function", action: "Check" },
  { id: 2, item: "Verification – Pull Wire Function", action: "Check" },
  { id: 3, item: "Verification – LCS E-STOP Function", action: "Check" },
];

const extractionConveyorChecks = [
  { id: 1, item: "Verification – Pull Wire Function", action: "Check" },
  { id: 2, item: "Verification – Pull Wire Function", action: "Check" },
];

const transferConveyorChecks = [
  { id: 1, item: "Verification – Pull Wire Function", action: "Check" },
  { id: 2, item: "Verification – Pull Wire Function", action: "Check" },
];

const reclaimStackerChecks = [
  { id: 1, item: "Verification – Pull Wire Function", action: "Check" },
  { id: 2, item: "Verification – Pull Wire Function", action: "Check" },
];

export const PullWireChecksPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical", "mechanical", "hot-surfaces"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev => 
      prev.includes(hazardId) 
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  const renderAssetSection = (assetName: string, assetNumber: string, checks: typeof filterPress1Checks) => (
    <div className="border-b border-border">
      <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
        <ClipboardCheck className="w-5 h-5 text-primary" />
        {assetName}
      </div>
      <div className="grid grid-cols-2 border-b border-border text-xs">
        <div className="grid grid-cols-[120px_1fr] border-r border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
          <div className="px-2 py-1.5">{assetNumber}</div>
        </div>
        <div className="grid grid-cols-[120px_1fr]">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Description:</div>
          <div className="px-2 py-1.5"></div>
        </div>
      </div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border px-3 py-2 text-center font-semibold w-[8%]">#</th>
            <th className="border border-border px-3 py-2 text-left font-semibold w-[52%]">System, assembly or components</th>
            <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Action</th>
            <th className="border border-border px-3 py-2 text-left font-semibold w-[20%]">Record/Finding</th>
            <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Initial</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.id} className="hover:bg-muted/30">
              <td className="border border-border px-3 py-2 text-center font-medium">{check.id}</td>
              <td className="border border-border px-3 py-2">{check.item}</td>
              <td className="border border-border px-2 py-2 text-center">{check.action}</td>
              <td className="border border-border px-2 py-2">
                <Input className="h-7 text-xs border-0 bg-transparent" />
              </td>
              <td className="border border-border px-2 py-2 text-center">
                <Input className="h-7 w-12 text-xs mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3">
        <p className="text-xs font-medium mb-1">Comments:</p>
        <Textarea className="min-h-[50px] resize-none text-xs" />
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Pull Wire Checks</h1>
              <p className="text-base mt-1 text-primary/80">3 Monthly Inspection</p>
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
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">3 Monthly</div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
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
                <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Follow OEM instructions and site procedures as required.</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Ensure <span className="font-bold">Positive Communications</span> and use <span className="font-bold">Spotter</span> where required.</span>
              </li>
              <li className="flex items-start gap-3">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Avoid burns, beware of <span className="font-bold text-destructive">hot parts</span> on machines and <span className="font-bold text-destructive">hot fluids</span> in lines, tubes and compartments.</span>
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
                  <span>Two-way Radio</span>
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

        {/* Asset Sections */}
        {renderAssetSection("FILTER PRESS 1", "", filterPress1Checks)}
        {renderAssetSection("FILTER PRESS 2", "", filterPress2Checks)}
        {renderAssetSection("FILTER PRESS 1 EXTRACTION CONVEYOR", "", extractionConveyorChecks)}
        {renderAssetSection("FILTER PRESS TRANSFER", "", transferConveyorChecks)}
        {renderAssetSection("FILTER PRESS RECLAIM STACKER", "", reclaimStackerChecks)}

        {/* Sign Off Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Tested By:</div>
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
          <div className="grid grid-cols-[80px_1fr] w-1/2 border-r border-border">
            <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
            <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
          </div>
        </div>

        {/* Reviewed By Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Reviewed By TCMG Representative:</div>
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
          <div className="grid grid-cols-[80px_1fr] w-1/2 border-r border-border">
            <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
            <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};
