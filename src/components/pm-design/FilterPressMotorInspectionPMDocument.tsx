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
  Cog
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
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

const stationaryChecks = [
  { id: 1, item: "Check name plate is present and matches recorded data. If no data is recorded fill in motor details" },
  { id: 2, item: "Check terminal box cover bolts are complete and tight. Check if densyl tape is in adequate condition. Change if necessary." },
  { id: 3, item: "Check Motor while running. Note any loud, irregular squealing or rumbling noises or vibrations" },
  { id: 4, item: "Check for dust, dirt or rock build up on motor cooling fan or in between cooling fins. Remove excess build up if necessary" },
  { id: 5, item: "Check cable glands are tight and shrouds are fitted. Tighten glands if necessary." },
  { id: 6, item: "Check that push or switches are secure and not damaged" },
  { id: 7, item: "Ensure that access to LCS is not obstructed or impaired." },
  { id: 8, item: "Ensure fan cowling is secure and free from damage. Ensure there is no obstruction to the flow of air." },
  { id: 9, item: "Check cable identification is secure and legible" },
  { id: 10, item: "Ensure cables are correctly routed, undamaged and are attached to cable supports. Ensure mechanical protection is secure and in place. Ensure gland is in place" },
  { id: 11, item: "Ensure gland plate is in place and all spare cable entries are plugged." },
];

interface MotorSectionProps {
  title: string;
  motorNumber: number;
}

const MotorSection = ({ title, motorNumber }: MotorSectionProps) => (
  <div className="border-b border-border">
    <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
      <Cog className="w-5 h-5 text-primary" />
      MOTOR {motorNumber} - {title}
    </div>
    
    {/* Motor Details Grid */}
    <div className="grid grid-cols-2 text-xs border-b border-border">
      <div className="border-r border-border">
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Equipment Description:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Brand/Model:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated Frequency:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" placeholder="50 Hz" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated Voltage:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" placeholder="415 V" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Speeds RPM:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Equipment Number:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated FLC:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Rated Power:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Motor Frame Size:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
        <div className="grid grid-cols-[140px_1fr]">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Ambient Temp Rating:</div>
          <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
        </div>
      </div>
    </div>

    {/* Serial Number */}
    <div className="grid grid-cols-[140px_1fr] text-xs border-b border-border">
      <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Serial No:</div>
      <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
    </div>

    {/* Stationary Checks Table */}
    <div className="bg-muted px-3 py-1.5 font-semibold text-xs border-b border-border">STATIONARY CHECKS – PM INSPECTION</div>
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-muted/50">
          <th className="border border-border px-2 py-1.5 text-left font-semibold w-[15%]">Item</th>
          <th className="border border-border px-2 py-1.5 text-left font-semibold w-[60%]">Action/Steps</th>
          <th className="border border-border px-2 py-1.5 text-left font-semibold w-[25%]">Results and Comments</th>
        </tr>
      </thead>
      <tbody>
        {stationaryChecks.map((check, index) => (
          <tr key={check.id} className="hover:bg-muted/30">
            <td className="border border-border px-2 py-1.5">{index < 5 ? "Motor" : index < 7 ? "Isolator" : index < 10 ? "Motor" : "S/Room"}</td>
            <td className="border border-border px-2 py-1.5 text-xs">{check.item}</td>
            <td className="border border-border px-1 py-1">
              <Input className="h-6 text-xs border-0 bg-transparent" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Motor Sign Off */}
    <div className="grid grid-cols-3 text-xs">
      <div className="grid grid-cols-[100px_1fr] border-r border-border">
        <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Inspected By:</div>
        <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
      </div>
      <div className="grid grid-cols-[100px_1fr] border-r border-border">
        <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Elect. Cert No:</div>
        <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
      </div>
      <div className="grid grid-cols-[60px_1fr]">
        <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
        <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
      </div>
    </div>
  </div>
);

export const FilterPressMotorInspectionPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical", "mechanical"]);

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Filter Press - Statutory Motor Inspection</h1>
              <p className="text-base mt-1 text-primary/80">& Lubrication</p>
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
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Finish Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Personnel:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
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
                  <span>Grease Gun</span>
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

        {/* Motor Sections */}
        <MotorSection title="Stacker Drive Motor - North" motorNumber={1} />
        <MotorSection title="Stacker Drive Motor - South" motorNumber={2} />
      </div>
    </div>
  );
};
