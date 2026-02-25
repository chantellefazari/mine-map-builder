import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const PullWireChecksPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Pull Wire Checks Quarterly");

  const tasksData = pm?.tasks || [];

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Pull Wire Checks" subtitle="Electrical 12 Weekly Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Filter Press"
          pmGroup="Electrical"
          pmType="Inspection"
          frequency="12 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={tasksData} title="INSPECTIONS" />

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Pull Wire Checks Inspection Form" />
      </div>
    </div>
  );
};
