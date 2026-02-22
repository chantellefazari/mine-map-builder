import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  FileText,
  ClipboardCheck,
  Zap,
  Lock,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface Hazard {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface GeneratorLocation {
  id: string;
  name: string;
  assetNumber: string;
  area: string;
  circuits: { description: string; rating: string }[];
}

const hazardsList: Hazard[] = [
  { id: "electrical", icon: <Zap className="w-4 h-4" />, label: "Electrical" },
  { id: "arc-flash", icon: <Zap className="w-4 h-4" />, label: "Arc Flash" },
  { id: "lockout", icon: <Lock className="w-4 h-4" />, label: "LOTO" },
];

const generatorLocations: GeneratorLocation[] = [
  {
    id: "admin",
    name: "Admin Generator",
    assetNumber: "GEN-009",
    area: "ADMIN",
    circuits: [
      { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" },
      { description: "3 PHASE OUTLET", rating: "32A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
  {
    id: "juno-bore",
    name: "Juno Bore Pump Generator",
    assetNumber: "GEN-010",
    area: "JUNO BORE PUMP",
    circuits: [
      { description: "15A OUTLET", rating: "16A" },
      { description: "15A OUTLET", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" },
      { description: "3 PHASE OUTLET", rating: "32A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
  {
    id: "andys-dam",
    name: "Andy's Dam Generator",
    assetNumber: "GEN-011",
    area: "ANDY'S DAM",
    circuits: [
      { description: "15A OUTLET", rating: "16A" },
      { description: "15A OUTLET", rating: "16A" },
      { description: "3 PHASE OUTLET", rating: "32A" },
      { description: "3 PHASE OUTLET", rating: "32A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
  {
    id: "lab",
    name: "Lab Generator",
    assetNumber: "GEN-012",
    area: "LAB",
    circuits: [
      { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "16A" },
      { description: "3 PHASE GPO", rating: "32A" },
      { description: "3 PHASE GPO", rating: "32A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
  {
    id: "crusher-fuel-farm",
    name: "Crusher Fuel Farm Generator",
    assetNumber: "GEN-013",
    area: "CRUSHER FUEL FARM",
    circuits: [
      { description: "3 PHASE GPO", rating: "32A" },
      { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "20A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
  {
    id: "crusher-workshop",
    name: "Crusher Workshop Generator",
    assetNumber: "GEN-014",
    area: "CRUSHER WORKSHOP",
    circuits: [
      { description: "RCD", rating: "32A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
];

interface RCDTestSheetProps {
  location: GeneratorLocation;
}

const RCDTestSheet = ({ location }: RCDTestSheetProps) => {
  const circuitRows = location.circuits;

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
              <h1 className="text-2xl font-bold tracking-wide text-primary">6 Monthly RCD Push-button & Injection Test</h1>
              <p className="text-base mt-1 text-primary/80">{location.name}</p>
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
              <div className="px-2 py-1.5 font-medium">{location.assetNumber}</div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Personnel:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Area:</div>
              <div className="px-2 py-1.5 font-medium">{location.area}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Description:</div>
              <div className="px-2 py-1.5 font-medium">{location.name.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Test Table */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          RCD PUSH-BUTTON & INJECTION TEST
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-center font-semibold w-[6%]">Circuit #</th>
                <th className="border border-border px-2 py-2 text-left font-semibold w-[14%]">Circuit Description</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">C/B Rating</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">RCD Type<br/><span className="text-[10px] font-normal">(I / II)</span></th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Test Current<br/><span className="text-[10px] font-normal">(I: ≤10mA / II: &gt;10mA ≤30mA)</span></th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Max Trip Time<br/><span className="text-[10px] font-normal">(I: ≤40ms / II: ≤300ms)</span></th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">0° Trip Time</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">180° Trip Time</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">Push Button</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">Injection</th>
                <th className="border border-border px-2 py-2 text-left font-semibold w-[10%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {circuitRows.map((circuit, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="border border-border px-2 py-1 text-center font-medium">{idx + 1}</td>
                  <td className="border border-border px-1 py-1">
                    {circuit.description ? (
                      <span className="text-xs px-1">{circuit.description}</span>
                    ) : (
                      <Input className="h-6 text-xs border-0 bg-transparent" />
                    )}
                  </td>
                  <td className="border border-border px-1 py-1 text-center">
                    {circuit.rating ? (
                      <span className="text-xs">{circuit.rating}</span>
                    ) : (
                      <Input className="h-6 text-xs border-0 bg-transparent" />
                    )}
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">
                    Type I / Type II
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">
                    10mA / 30mA
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">
                    Type I - ≤40 / Type II - ≤300
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">
                    Pass / Fail
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">
                    Pass / Fail
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">
                    Pass / Fail
                  </td>
                  <td className="border border-border px-1 py-1 text-center text-xs">
                    Pass / Fail
                  </td>
                  <td className="border border-border px-1 py-1">
                    <Input className="h-6 text-xs border-0 bg-transparent" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Test Instruments */}
        <div className="border-t border-border">
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
                <td className="border border-border px-3 py-2">RCD Meter</td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" /></td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs" type="date" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sign Off Section */}
        <div className="border-t border-border">
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
      </div>
    </div>
  );
};

interface RCDTestingSheetsDocumentProps {
  locationId?: string;
}

export const RCDTestingSheetsDocument = ({ locationId }: RCDTestingSheetsDocumentProps) => {
  const locationsToShow = locationId 
    ? generatorLocations.filter(loc => loc.id === locationId)
    : generatorLocations;

  return (
    <div className="space-y-8">
      {locationsToShow.map((location) => (
        <RCDTestSheet 
          key={location.id}
          location={location}
        />
      ))}
    </div>
  );
};
