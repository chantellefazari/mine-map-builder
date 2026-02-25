import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const fallbackTasks = {
  sections: [
    {
      equipmentName: "FILTER PRESS 1",
      tasks: [
        { task: "Verification – Pull Wire Function (Head End)" },
        { task: "Verification – Pull Wire Function (Tail End)" },
        { task: "Verification – LCS E-STOP Function" },
      ],
    },
    {
      equipmentName: "FILTER PRESS 2",
      tasks: [
        { task: "Verification – Pull Wire Function (Head End)" },
        { task: "Verification – Pull Wire Function (Tail End)" },
        { task: "Verification – LCS E-STOP Function" },
      ],
    },
    {
      equipmentName: "FILTER PRESS 1 EXTRACTION CONVEYOR",
      tasks: [
        { task: "Verification – Pull Wire Function (Head End)" },
        { task: "Verification – Pull Wire Function (Tail End)" },
      ],
    },
    {
      equipmentName: "FILTER PRESS TRANSFER",
      tasks: [
        { task: "Verification – Pull Wire Function (Head End)" },
        { task: "Verification – Pull Wire Function (Tail End)" },
      ],
    },
    {
      equipmentName: "FILTER PRESS RECLAIM STACKER",
      tasks: [
        { task: "Verification – Pull Wire Function (Head End)" },
        { task: "Verification – Pull Wire Function (Tail End)" },
      ],
    },
  ],
};

export const PullWireChecksPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Pull Wire Checks Quarterly");

  const tasksData = pm?.tasks && typeof pm.tasks === "object" && !Array.isArray(pm.tasks) && (pm.tasks as any).sections
    ? pm.tasks
    : fallbackTasks;

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
