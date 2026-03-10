import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const fallbackTasks = {
  sections: [
    {
      equipmentName: "GENERAL AREA INSPECTIONS",
      tasks: [
        { task: "Conveyors" }, { task: "Ball Mill" },
        { task: "CIP / Tanks" }, { task: "Filter Press" },
        { task: "Fuel Farm" }, { task: "Air Compressors" },
        { task: "Lime" }, { task: "Reagents" },
        { task: "Tail Thickener" }, { task: "Raw Water" },
        { task: "Process Water" }, { task: "Admin" },
        { task: "Warehouse" }, { task: "Control Room" },
        { task: "Workshop" }, { task: "Laboratory" },
      ],
    },
    {
      equipmentName: "CHECK ALL LIGHTING IS OPERATING IN THE LISTED AREAS",
      tasks: [
        { task: "Conveyors" }, { task: "Ball Mill" },
        { task: "CIP TANKS" }, { task: "Filter Press" },
        { task: "Process Fuel Farm" }, { task: "Air Compressors" },
        { task: "Lime" }, { task: "Reagents" },
        { task: "Tail Thickener" }, { task: "Raw Water" },
        { task: "Process Water" }, { task: "Admin/Mining" },
        { task: "Warehouse" }, { task: "Control Room" },
        { task: "Workshop" }, { task: "Laboratory" },
      ],
    },
    {
      equipmentName: "CHECK PORTABLE GENERATORS FOR ANY ELECTRICAL FAULTS OR CABLE DAMAGE",
      tasks: [
        { task: "Juno Generator" }, { task: "Admin Generator" },
        { task: "Nobles Natural Sump Generator" }, { task: "Crusher Generator" },
        { task: "Lab Generator" }, { task: "Fuel Farm Generator" },
      ],
    },
    {
      equipmentName: "CLEANS",
      tasks: [
        { task: "Weekly Workshop Cleans" },
        { task: "Fortnightly Light Vehicle Cleans" },
        { task: "Clean filters in VSD's in MCC" },
      ],
    },
  ],
};

export const VisualZoneChecksPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Visual Zone Checks Weekly");

  const tasksData = pm?.tasks && typeof pm.tasks === "object" && !Array.isArray(pm.tasks) && (pm.tasks as any).sections
    ? pm.tasks
    : fallbackTasks;

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Electrical Weekly Visual Site Inspection" subtitle="Electrical Weekly Inspection" />

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

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Electrical Inspection Form" />
      </div>
    </div>
  );
};
