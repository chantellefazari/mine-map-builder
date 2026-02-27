import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const ACInspectionMonthlyPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Air Conditioner Monthly Inspection and Filter Clean");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Monthly Air Conditioner Inspection and Filter Clean" subtitle="Electrical 4 Weekly Service" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Service"
          frequency="4 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} />

        {/* Comments Section */}
        <div className="border-t border-border px-3 py-2">
          <p className="text-xs font-bold text-foreground mb-1">COMMENTS -</p>
          <div className="border border-border min-h-[40px]" />
        </div>

        {/* Unit Details Section */}
        <div className="border-t-2 border-border">
          <div className="bg-destructive text-destructive-foreground text-center text-xs font-bold py-1 uppercase tracking-wide">
            Unit Details
          </div>
          <div className="grid grid-cols-2 border-b border-border">
            <div className="border-r border-border px-2 py-1 text-xs font-bold text-foreground">
              MAKE - <span className="font-normal">____________________</span>
            </div>
            <div className="px-2 py-1 text-xs font-bold text-foreground">
              MODEL - <span className="font-normal">____________________</span>
            </div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-b border-dashed border-border min-h-[20px]" />
          ))}
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Monthly Air Conditioner Inspection Form" />
      </div>
    </div>
  );
};
