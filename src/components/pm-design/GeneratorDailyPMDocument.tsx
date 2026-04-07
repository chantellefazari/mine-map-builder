import { PMBannerHeader } from "./PMBannerHeader";
import { MobileEquipmentHeader } from "./MobileEquipmentHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

interface GeneratorDailyPMDocumentProps {
  assetNumber: string; // e.g. "GN-001"
}

export const GeneratorDailyPMDocument = ({ assetNumber }: GeneratorDailyPMDocumentProps) => {
  const { pms } = usePMasterList();
  const pmName = `Generator Daily Inspection ${assetNumber}`;
  const pm = pms.find((p) => p.pmName === pmName);

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title={`Generator Daily Mechanical Inspection – ${assetNumber}`} />
        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Mobile Equipment"
          pmGroup="Mechanical"
          pmType="Inspection"
          frequency="Daily"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />
        <MobileEquipmentHeader columns={["Make/Model", "Serial No", "Hours", "Next Service Due"]} />
        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} />

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Generator Daily Inspection Form" />
      </div>
    </div>
  );
};
