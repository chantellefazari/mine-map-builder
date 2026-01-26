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
  User,
  Calendar,
  Wrench,
  Zap,
  AlertCircle,
  CheckCircle2,
  Info,
  Cog,
  Lock,
  Flame
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
  { id: "hot-surfaces", icon: <Flame className="w-4 h-4" />, label: "Hot Surfaces" },
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

const deadTestItems = [
  { id: 1, item: "Multifunction Unit type", subItems: ["Separate windings", "Isolation Transformer fitted", "Multi-position/multi-contact switch installed"], action: "Test" },
  { id: 2, item: "Over current and Short circuit protection provided on generator windings", action: "Check" },
  { id: 3, item: "Neutral of 240V output bonded to earth (MEN)", action: "Check" },
  { id: 4, item: "30mA Residual Current Device (type II) fitted to all outlets", action: "Check" },
];

const insulationTests = [
  { id: "a", label: "U-V", voltage: "1000V" },
  { id: "b", label: "V-W", voltage: "1000V" },
  { id: "c", label: "W-U", voltage: "1000V" },
  { id: "d", label: "U-E", voltage: "500V" },
  { id: "e", label: "V-E", voltage: "500V" },
  { id: "f", label: "W-E", voltage: "500V" },
];

const continuityTests = [
  { id: "a", label: "U1-U2" },
  { id: "b", label: "V1-V2" },
  { id: "c", label: "W1-W2" },
];

const visualChecks = [
  { id: 7, item: "Frame of Generator bonded to main earth bar (<1Ω)", action: "Test" },
  { id: 8, item: "Earth Terminal on all outlets bonded to main earth bar (<1Ω)", action: "Test" },
  { id: 9, item: "All General-Purpose Outlets individually switched", action: "Check" },
  { id: 10, item: "Flexible equipotential bonding conductor provided", action: "Check" },
  { id: 11, item: "Equipotential conductor fitted with approved G-Clamp or spring-loaded tong", action: "Check" },
  { id: 12, item: "Equipotential bonding conductor connected to unit main earth bar or unit frame", action: "Check" },
  { id: 13, item: "Visual inspection as to condition of all electrical components including wiring", action: "Check" },
  { id: 14, item: "Internal connection and cable glands are tight", action: "Check" },
  { id: 15, item: "Confirm lock out facilities on isolators and breakers are available", action: "Check" },
  { id: 16, item: "Confirm all terminations and busbar in generator DB tight", action: "Check" },
  { id: 17, item: "Confirm all cable and glands in generator DB are secure", action: "Check" },
  { id: 18, item: "Confirm all unused cable entries have been sealed", action: "Check" },
  { id: 19, item: "Confirm that all labelling and identification is complete and correct", action: "Check" },
  { id: 20, item: "Confirm that the generator is clean and free from damage", action: "Check" },
  { id: 21, item: "Bottom of any electrical cubicles are clean of dust", action: "Check" },
];

const generatorElectricalChecks = [
  { id: 1, item: "Confirm that the fire extinguisher fitted and compliant", action: "Check" },
  { id: 2, item: "Confirm that the Battery isolator is present, and it breaks contact", action: "Check" },
  { id: 3, item: "Confirm that the Start isolator is present, and it breaks contact", action: "Check" },
  { id: 4, item: "Confirm that there is an E-Stop present", action: "Check" },
];

const runningTests = [
  { id: 1, item: "Correct polarity", action: "Test" },
  { id: 2, item: "Injection test of RCD at idling position", action: "Test", hasReadings: true },
  { id: 3, item: "Push Button test of RCD", action: "Test" },
  { id: 4, item: "Emergency Stop", action: "Check", subItems: ["Test E-Stop shunts engine", "Does E-Stop need to be manually reset", "Once E-Stop is reset does the Engine restart"] },
  { id: 5, item: "Test Tag been placed with 6 Monthly Due Date", action: "Check" },
];

export const GeneratorYearlyTestPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["electrical", "arc-flash", "hot-surfaces", "lockout"]);

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">1Y Generator Electrical</h1>
              <p className="text-base mt-1 text-primary/80">Inspection and Testing</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-primary" />
                Unit Number:
              </div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Location:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Personal:
              </div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection & Testing</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Date:
              </div>
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
                  <span>Insulation Resistance Meter</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Voltage Meter</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>RCD Tester</span>
                </li>
                <li className="flex items-center gap-3">
                  <Checkbox className="h-4 w-4" defaultChecked />
                  <span>Continuity Tester</span>
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

        {/* Dead Tests Section */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          1. GENERATOR – DEAD TESTS
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-left font-semibold w-[60%]">System, assembly or components</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">Action</th>
              <th className="border border-border px-3 py-2 text-center font-semibold w-[15%]">Record/Finding</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Initial</th>
            </tr>
          </thead>
          <tbody>
            {deadTestItems.map((item, idx) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2">
                  {item.id}. {item.item}
                  {item.subItems && (
                    <ul className="ml-4 mt-1 text-xs text-muted-foreground">
                      {item.subItems.map((sub, i) => (
                        <li key={i}>({i + 1}) {sub}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="border border-border px-2 py-2 text-center">{item.action}</td>
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

        {/* Insulation Resistance Tests */}
        <div className="bg-muted/50 px-4 py-2 font-semibold text-sm border-y border-border">
          5. Test Insulation Resistance of windings and circuits (&gt;1MΩ)
        </div>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {insulationTests.map((test) => (
              <tr key={test.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 w-[20%]">{test.id}. {test.label}</td>
                <td className="border border-border px-2 py-2 text-center w-[20%]">MΩ @ {test.voltage}</td>
                <td className="border border-border px-2 py-2 w-[45%]">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
                <td className="border border-border px-2 py-2 text-center w-[15%]">
                  <Input className="h-7 w-12 text-xs mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Continuity Tests */}
        <div className="bg-muted/50 px-4 py-2 font-semibold text-sm border-y border-border">
          6. Continuity test of between windings (&lt;1Ω)
        </div>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {continuityTests.map((test) => (
              <tr key={test.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 w-[20%]">{test.id}. {test.label}</td>
                <td className="border border-border px-2 py-2 text-center w-[20%]">Ω</td>
                <td className="border border-border px-2 py-2 w-[45%]">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
                <td className="border border-border px-2 py-2 text-center w-[15%]">
                  <Input className="h-7 w-12 text-xs mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Visual Checks */}
        <table className="w-full text-sm border-collapse">
          <tbody>
            {visualChecks.map((check) => (
              <tr key={check.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 w-[60%]">{check.id}. {check.item}</td>
                <td className="border border-border px-2 py-2 text-center w-[15%]">{check.action}</td>
                <td className="border border-border px-2 py-2 w-[15%]">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
                <td className="border border-border px-2 py-2 text-center w-[10%]">
                  <Input className="h-7 w-12 text-xs mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Generator Electrical Checks */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-y border-border flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          GENERATOR – ELECTRICAL
        </div>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {generatorElectricalChecks.map((check) => (
              <tr key={check.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 w-[60%]">{check.id}. {check.item}</td>
                <td className="border border-border px-2 py-2 text-center w-[15%]">{check.action}</td>
                <td className="border border-border px-2 py-2 w-[15%]">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
                <td className="border border-border px-2 py-2 text-center w-[10%]">
                  <Input className="h-7 w-12 text-xs mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Running Tests */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-y border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          2. RUNNING – OPERATIONAL TESTS
        </div>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {runningTests.map((test) => (
              <tr key={test.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 w-[60%]">
                  {test.id}. {test.item}
                  {test.subItems && (
                    <ul className="ml-4 mt-1 text-xs text-muted-foreground">
                      {test.subItems.map((sub, i) => (
                        <li key={i}>{String.fromCharCode(97 + i)}) {sub}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="border border-border px-2 py-2 text-center w-[15%]">{test.action}</td>
                <td className="border border-border px-2 py-2 w-[15%]">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
                <td className="border border-border px-2 py-2 text-center w-[10%]">
                  <Input className="h-7 w-12 text-xs mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* RCD Injection Test Readings */}
        <div className="border-b border-border p-4">
          <p className="text-sm font-medium mb-2">RCD Injection Test Readings:</p>
          <table className="w-48 text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-1">mA</th>
                <th className="border border-border px-2 py-1">mSec</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  <td className="border border-border px-2 py-1"><Input className="h-6 text-xs" /></td>
                  <td className="border border-border px-2 py-1"><Input className="h-6 text-xs" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Test Instruments */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Test Instruments (record serial numbers)</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left font-medium">Make</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Model</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Calibration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Insulation Resistance Meter</td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" type="date" /></td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Voltage Meter</td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" type="date" /></td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">RCD Tester</td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" type="date" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sign Off Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">INSPECTED BY</div>
          <div className="grid grid-cols-3 gap-0">
            <div className="grid grid-cols-[100px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Elect. Cert. No:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
          </div>
        </div>

        {/* Certification Statement */}
        <div className="p-4 text-sm text-muted-foreground italic bg-muted/30">
          This certifies that the electrical equipment / installation as identified in this report, to the extent it is affected by the electrical work, has been tested to ensure it is electrically safe and is in accordance with the requirements of the wiring rules and other applicable standards.
        </div>
      </div>
    </div>
  );
};
