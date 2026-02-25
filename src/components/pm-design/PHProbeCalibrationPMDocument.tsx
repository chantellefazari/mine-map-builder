import { Checkbox } from "@/components/ui/checkbox";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

const calibrationReadings = [
  "pH Reading before clean",
  "pH Reading after clean",
  "pH 7 Before Calibration",
  "pH 7 Reading after Calibration",
  "pH 10 Reading before Calibration",
  "pH 10 Reading after Calibration",
  "pH Reading after Clean",
];

export const PHProbeCalibrationPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "pH Probe Calibration Weekly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="pH Probe Cleaning & Calibration" subtitle="Electrical Weekly Procedure" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="CIP Tank 1"
          pmGroup="Electrical"
          pmType="Calibration"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {/* System / Assembly header */}
        <div className="border-b border-border">
          <div className="bg-destructive px-4 py-2 font-bold text-sm text-destructive-foreground border-b border-border">
            System, assembly or components
          </div>
          <div className="bg-destructive/80 px-4 py-2 font-bold text-sm text-destructive-foreground border-b border-border">
            pH Probe Location – CIP TANK 1
          </div>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {calibrationReadings.map((reading, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2 w-[60%]">
                    <span className="font-semibold mr-2">{idx + 1}.</span>
                    {reading} -
                  </td>
                  <td className="border border-border px-2 py-4 w-[40%]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Electrical Calibration Form" />
      </div>
    </div>
  );
};
