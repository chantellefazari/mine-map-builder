import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const fallbackTasks = {
  sections: [
    {
      equipmentName: "INSPECTION ITEMS",
      tasks: [
        { task: "Safety Shower" },
        { task: "Eyewash" },
        { task: "Light" },
      ],
    },
    {
      equipmentName: "LOCATION CHECKS",
      tasks: [
        { task: "Thickener" }, { task: "Lime Silo" },
        { task: "Tanks North" }, { task: "Tanks South" },
        { task: "Elution" }, { task: "Gold Room" },
        { task: "Filter Press" }, { task: "Cyanide Upstairs" },
        { task: "Cyanide Downstairs" }, { task: "Cyanide Outside" },
        { task: "Compound Bottom Tanks North" }, { task: "Acid Column" },
      ],
    },
  ],
};

export const SafetyShowerInspectionPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Safety Shower Inspection Weekly");

  const tasksData = pm?.tasks && typeof pm.tasks === "object" && !Array.isArray(pm.tasks) && (pm.tasks as any).sections
    ? pm.tasks
    : fallbackTasks;

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Weekly Safety Shower Inspection" subtitle="Electrical Weekly Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Inspection"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={tasksData} title="INSPECTIONS" />

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Safety Shower Inspection Form" />
      </div>
    </div>
  );
};
