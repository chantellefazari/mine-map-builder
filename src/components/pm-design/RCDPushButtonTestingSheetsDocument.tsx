import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";

interface GeneratorLocation {
  id: string;
  name: string;
  assetNumber: string;
  area: string;
  circuits: { description: string; rating: string }[];
}

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
      { description: "GPO", rating: "16A" },
      { description: "GPO", rating: "16A" },
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
    id: "crusher-workshop",
    name: "Crusher Workshop Generator",
    assetNumber: "GEN-013",
    area: "CRUSHER",
    circuits: [
      { description: "RCD", rating: "32A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
  {
    id: "crusher-fuel-farm",
    name: "Crusher Fuel Farm Generator",
    assetNumber: "GEN-014",
    area: "CRUSHER FUEL FARM",
    circuits: [
      { description: "3 PHASE GPO", rating: "25A" },
      { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "16A" },
      { description: "15A GPO", rating: "20A" },
      { description: "", rating: "" },
      { description: "", rating: "" },
    ]
  },
];

const RCDPushButtonTestSheet = ({ location }: { location: GeneratorLocation }) => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "3 Monthly RCD Push-button Test");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="3 Monthly RCD Push-button Test" subtitle={location.name} />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea={location.area}
          pmGroup="Electrical"
          pmType="Test"
          frequency="12 Weekly"
          assetNumber={location.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            3 MONTHLY RCD PUSH-BUTTON TEST
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">Circuit #</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[20%]">Circuit Description</th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[12%]">C/B Current Rating<br/><span className="text-[10px] font-normal">(I: ≤10mA)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">RCD Type<br/><span className="text-[10px] font-normal">(II: &gt;10mA ≤30mA)</span></th>
                  <th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">Push Button Test Result</th>
                  <th className="border border-border px-2 py-2 text-left font-semibold w-[30%]">Comments</th>
                </tr>
              </thead>
              <tbody>
                {location.circuits.map((circuit, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="border border-border px-2 py-1 text-center font-medium">{idx + 1}</td>
                    <td className="border border-border px-1 py-1">
                      {circuit.description ? <span className="text-xs px-1">{circuit.description}</span> : <span className="px-2 py-4"></span>}
                    </td>
                    <td className="border border-border px-1 py-1 text-center">
                      {circuit.rating ? <span className="text-xs">{circuit.rating}</span> : <span className="px-2 py-4"></span>}
                    </td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Type I / Type II</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Pass / Fail</td>
                    <td className="border border-border px-2 py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <td className="border border-border px-3 py-2">RCD Meter</td>
                <td className="border border-border px-2 py-4"></td>
                <td className="border border-border px-2 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText={`Tennant Creek Mining Operations – ${location.name} RCD Push-button Test Form`} />
      </div>
    </div>
  );
};

interface RCDPushButtonTestingSheetsDocumentProps {
  locationId?: string;
}

export const RCDPushButtonTestingSheetsDocument = ({ locationId }: RCDPushButtonTestingSheetsDocumentProps) => {
  const locationsToShow = locationId 
    ? generatorLocations.filter(loc => loc.id === locationId)
    : generatorLocations;

  return (
    <div className="space-y-8">
      {locationsToShow.map((location) => (
        <RCDPushButtonTestSheet key={location.id} location={location} />
      ))}
    </div>
  );
};
