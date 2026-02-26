import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

interface GeneratorLocation {
  id: string;
  name: string;
  assetNumber: string;
  area: string;
  circuits: { description: string; rating: string }[];
}

const RCDTestSheet = ({ location }: { location: GeneratorLocation }) => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "RCD Injection Test 6-Monthly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="6 Monthly RCD Push-button & Injection Test" subtitle={location.name} />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea={location.area}
          pmGroup="Electrical"
          pmType="Test"
          frequency="6 Monthly"
          assetNumber={location.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
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
                    <td className="border border-border px-1 py-1 text-center text-xs">10mA / 30mA</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Type I - ≤40 / Type II - ≤300</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Pass / Fail</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Pass / Fail</td>
                    <td className="border border-border px-1 py-1 text-center text-xs">Pass / Fail</td>
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

        <PMSignOffBlock footerText={`Tennant Creek Mining Operations – ${location.name} RCD Test Form`} showElecCertNo />
      </div>
    </div>
  );
};

interface RCDTestingSheetsDocumentProps {
  locationId?: string;
}

export const RCDTestingSheetsDocument = ({ locationId }: RCDTestingSheetsDocumentProps) => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "RCD Injection Test 6-Monthly");
  const tasksData = pm?.tasks as any;
  const generatorLocations = (tasksData?.generatorLocations || []) as GeneratorLocation[];

  const locationsToShow = locationId 
    ? generatorLocations.filter(loc => loc.id === locationId)
    : generatorLocations;

  return (
    <div className="space-y-8">
      {locationsToShow.map((location) => (
        <RCDTestSheet key={location.id} location={location} />
      ))}
    </div>
  );
};
