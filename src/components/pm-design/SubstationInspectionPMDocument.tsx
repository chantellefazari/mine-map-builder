import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const SubstationInspectionPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Substation Inspection Fortnightly");

  const tasksData = pm?.tasks || [];

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Substation Inspection" subtitle="Electrical 2 Weekly Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Substation"
          pmGroup="Electrical"
          pmType="Visual Inspection"
          frequency="2 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={tasksData} title="INSPECTIONS" />

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Substation Inspection Form" />
      </div>
    </div>
  );
};
