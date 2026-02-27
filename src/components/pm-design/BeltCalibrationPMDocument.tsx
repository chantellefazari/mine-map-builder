import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const BeltCalibrationPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Weightometer Calibration Monthly BC-100");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Monthly Weightometer Calibration" subtitle="Statutory Inspection - BC-100" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Mill Feed Circuit"
          pmGroup="Mechanical"
          pmType="Calibration"
          frequency="4 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} />

        {/* Calibration Reference Data */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">CALIBRATION REFERENCE DATA</div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium w-[40%] bg-muted/30">Conveyor Number</td>
                <td className="px-4 py-2">BC-100</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium bg-muted/30">Calibration Weight</td>
                <td className="px-4 py-2">45.04 kg</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium bg-muted/30">Target Flow Rate</td>
                <td className="px-4 py-2">133.3 tph</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recorded Data */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border">RECORDED DATA</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left font-semibold w-[40%]">Parameter</th>
                <th className="border border-border px-4 py-2 text-left font-semibold w-[30%]">As Found</th>
                <th className="border border-border px-4 py-2 text-left font-semibold w-[30%]">As Left</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="border border-border px-4 py-2 font-medium">Target (133.3 tph)</td>
                <td className="border border-border px-4 py-6"></td>
                <td className="border border-border px-4 py-6"></td>
              </tr>
              <tr className="border-b border-border">
                <td className="border border-border px-4 py-2 font-medium">Actual Flow Rate</td>
                <td className="border border-border px-4 py-6"></td>
                <td className="border border-border px-4 py-6"></td>
              </tr>
              <tr className="border-b border-border">
                <td className="border border-border px-4 py-2 font-medium">Variance</td>
                <td className="border border-border px-4 py-6"></td>
                <td className="border border-border px-4 py-6"></td>
              </tr>
            </tbody>
          </table>
          <div className="px-4 py-2 text-xs text-muted-foreground italic">
            NOTE: A maximum/minimum variance to be confirmed by site
          </div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Monthly Weightometer Calibration Form" />
      </div>
    </div>
  );
};
