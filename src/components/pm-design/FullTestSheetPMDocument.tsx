import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { 
  AlertCircle,
  Zap,
  Lock,
  ClipboardCheck
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

export const FullTestSheetPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev => 
      prev.includes(hazardId) 
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  const testRows = Array.from({ length: 20 }, (_, i) => i + 1);

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Electrical Installation Testing</h1>
              <p className="text-base mt-1 text-primary/80">Record Sheet</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[100px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" placeholder="Tennant Creek" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Address:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Area:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[100px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date of Test:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Tester:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">License No:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
          </div>
        </div>

        {/* Supervisor */}
        <div className="grid grid-cols-[100px_1fr] border-b border-border text-xs">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Supervisor:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
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

        {/* Test Table */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          ELECTRICAL INSTALLATION TESTING RECORD
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[9px] border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-1 py-2 text-center font-semibold w-[8%]">Test Point/<br/>Circuit No.</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">Conductor<br/>Sizes (mm²)</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">MCB<br/>(Rating & Type)</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Active Ω<br/>(Rph)</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Earth or<br/>Ω (Re)</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">Continuity<br/>Pass/Fail</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Insulation<br/>Resistance (MΩ)</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Pass/<br/>Fail</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Correct Circuit<br/>Connections</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Polarity<br/>Pass/Fail</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Fault Loop<br/>Impedance R (Ω)</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[7%]">Max Permitted<br/>Loop Value R (Ω)</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">Pass/<br/>Fail</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[5%]">RCD<br/>Pass/Fail</th>
                <th className="border border-border px-1 py-2 text-center font-semibold w-[6%]">RCD Trip<br/>Time (mSec)</th>
              </tr>
            </thead>
            <tbody>
              {/* Main row */}
              <tr className="hover:bg-muted/30">
                <td className="border border-border px-1 py-1 text-center font-medium">Main</td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                <td className="border border-border px-1 py-1 text-center">P / F</td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                <td className="border border-border px-1 py-1 text-center">P / F</td>
                <td className="border border-border px-1 py-1 text-center">P / F</td>
                <td className="border border-border px-1 py-1 text-center">P / F</td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                <td className="border border-border px-1 py-1 text-center">P / F</td>
                <td className="border border-border px-1 py-1 text-center">P / F</td>
                <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
              </tr>
              {testRows.map((num) => (
                <tr key={num} className="hover:bg-muted/30">
                  <td className="border border-border px-1 py-1 text-center font-medium">{num}</td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1 text-center">P / F</td>
                  <td className="border border-border px-1 py-1"><Input className="h-5 text-[9px] border-0 bg-transparent" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Certification */}
        <div className="p-4 text-sm text-muted-foreground italic bg-muted/30 border-t border-border">
          This certifies that the electrical equipment / installation as identified in this report, to the extent it is affected by the electrical work, has been tested to ensure it is electrically safe and is in accordance with the requirements of the wiring rules and other applicable standards.
        </div>
      </div>
    </div>
  );
};
