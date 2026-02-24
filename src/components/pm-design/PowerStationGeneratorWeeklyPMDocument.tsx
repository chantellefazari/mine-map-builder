import { PMBannerHeader } from "./PMBannerHeader";
import { MobileEquipmentHeader } from "./MobileEquipmentHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const PowerStationGeneratorWeeklyPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Power Station Generator Weekly Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Weekly Power Station Generator Inspection" />
        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Power Station"
          pmGroup="Mechanical"
          pmType="Inspection"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />
        <MobileEquipmentHeader />
        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} />

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Power Station Generator Weekly Inspection Form" />
      </div>
    </div>
  );
};
