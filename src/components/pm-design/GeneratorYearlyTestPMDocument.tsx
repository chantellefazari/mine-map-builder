import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const GeneratorYearlyTestPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Generator Electrical Test Yearly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="1Y Generator Electrical" subtitle="Inspection and Testing" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Inspection & Testing"
          frequency="52 Week"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} />

        {/* RCD Injection Test Readings */}
        <div className="border-t-2 border-foreground">
          <div className="bg-foreground text-background text-center text-xs font-bold py-1 uppercase tracking-wide">
            RCD Injection Test Readings
          </div>
          <div className="p-4">
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
                    <td className="border border-border px-2 py-4"></td>
                    <td className="border border-border px-2 py-4"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Instruments */}
        <div className="border-t-2 border-foreground">
          <div className="bg-foreground text-background text-center text-xs font-bold py-1 uppercase tracking-wide">
            Test Instruments (Record Serial Numbers)
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-1 text-left font-semibold">Instrument</th>
                <th className="border border-border px-2 py-1 text-left font-semibold">Make</th>
                <th className="border border-border px-2 py-1 text-left font-semibold">Model</th>
                <th className="border border-border px-2 py-1 text-left font-semibold">Calibration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-2 py-1.5">Insulation Resistance Meter</td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1.5">Voltage Meter</td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1.5">RCD Tester</td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Generator Electrical Test Form" showElecCertNo />
      </div>
    </div>
  );
};
