import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { DynamicInspectionTable } from "./DynamicInspectionTable";
import { usePMasterList } from "@/hooks/usePMData";

export const PHProbeCalibrationPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "pH Probe Calibration Weekly");

  const tasksData = pm?.tasks || [];

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

        <DynamicInspectionTable tasksData={tasksData} title="INSPECTIONS" />

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Electrical Calibration Form" />
      </div>
    </div>
  );
};
