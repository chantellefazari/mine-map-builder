import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlertTriangle, 
  Shield, 
  FileText,
  ClipboardCheck,
  Zap,
  AlertCircle,
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
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

const checklistItems = [
  { id: "earth-lock-ring", label: "Earth Lock Ring" },
  { id: "glands-correct", label: "Glands Correct/Tight/Secured" },
  { id: "cable-label", label: "Cable Label Fitted" },
  { id: "cables-terminated", label: "Cables Terminated and Secured" },
  { id: "line-shrouds", label: "Line Shrouds Fitted" },
  { id: "bridges-removed", label: "Bridges Removed" },
  { id: "tools-removed", label: "Tools Removed" },
  { id: "cable-support", label: "Cable Support System OK" },
  { id: "gland-wrapped", label: "Cable Gland Wrapped in Denso" },
];

export const CableTestSheetPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical"]);

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Cable Test Sheet</h1>
              <p className="text-base mt-1 text-primary/80">As Required</p>
            </div>
          </div>
        </div>

        {/* Cable Information Header */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Cable No:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">From:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">To:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Cable Size/Type:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Length:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
          </div>
        </div>

        {/* Meter Information */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Meter Information</div>
          <div className="grid grid-cols-3 text-xs">
            <div className="grid grid-cols-[100px_1fr] border-r border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Make/Model:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-r border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Serial No:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Certified Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
          </div>
        </div>

        {/* Safety Precautions */}
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

        {/* Insulation Resistance Test */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          INSULATION RESISTANCE (MEGA OHMS)
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-center font-semibold">R-W</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">R-B</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">W-B</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">R-E</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">W-E</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">B-E</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">R-N</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">W-N</th>
                <th className="border border-border px-2 py-2 text-center font-semibold">B-N</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Test Results */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border p-3">
            <div className="font-semibold mb-2">N-E Fault Loop Impedance (OHMS)</div>
            <Input className="h-7 text-xs" />
          </div>
          <div className="p-3">
            <div className="font-semibold mb-2">Continuity (OHMS)</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-muted-foreground">Earth:</span>
                <Input className="h-7 text-xs" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">SWA:</span>
                <Input className="h-7 text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          CHECK LIST
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-left font-semibold w-[50%]">Item</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">YES</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">NO</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">N/A</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[20%]">Comments</th>
            </tr>
          </thead>
          <tbody>
            {checklistItems.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2">{item.label}</td>
                <td className="border border-border px-2 py-2 text-center">
                  <Checkbox className="h-4 w-4" />
                </td>
                <td className="border border-border px-2 py-2 text-center">
                  <Checkbox className="h-4 w-4" />
                </td>
                <td className="border border-border px-2 py-2 text-center">
                  <Checkbox className="h-4 w-4" />
                </td>
                <td className="border border-border px-2 py-2">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Additional Checks */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Additional Checks Carried Out</div>
          <div className="p-3">
            <Input className="w-full h-16 text-xs" placeholder="Enter any additional checks performed..." />
          </div>
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
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Licence No:</div>
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
