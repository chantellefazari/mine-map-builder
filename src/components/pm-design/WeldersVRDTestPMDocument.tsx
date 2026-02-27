import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const WeldersVRDTestPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Welders VRD Test & Tag Inspection 3-Monthly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="3 Monthly Welders Preventative Maintenance Task Sheet" subtitle="Electrical 12 Weekly Service" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Service"
          frequency="12 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        {/* Preparation Section */}
        <div className="border-t-2 border-foreground">
          <div className="bg-foreground text-background text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Preparation
          </div>
          <ul className="text-xs px-4 py-2 space-y-1 list-disc list-inside">
            <li>Ensure all meters are within calibrated dates.</li>
            <li>Ensure all welding testing is performed in designated hot work area.</li>
            <li>Ensure all parts, materials and tooling are available and prepared prior to requesting machine for service.</li>
          </ul>
        </div>

        <SafetyPrecautionsSection />

        {/* Welder Details Section */}
        <div className="border-t-2 border-foreground">
          <div className="bg-foreground text-background text-center text-xs font-bold py-1 uppercase tracking-wide">
            Welder Details
          </div>
          <div className="grid grid-cols-3 text-xs border-b border-border">
            <div className="border-r border-border px-2 py-1.5 font-bold">
              Welder Make: <span className="font-normal">____________________</span>
            </div>
            <div className="border-r border-border px-2 py-1.5 font-bold">
              Model: <span className="font-normal">____________________</span>
            </div>
            <div className="px-2 py-1.5 font-bold">
              Serial Number: <span className="font-normal">____________________</span>
            </div>
          </div>
        </div>

        <DynamicInspectionTable tasksData={pm?.tasks} />

        {/* Test Instruments Table */}
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
                <td className="border border-border px-2 py-1.5">VRD Tester</td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – 3 Monthly Welders VRD Test & Tag Inspection" />
      </div>
    </div>
  );
};
