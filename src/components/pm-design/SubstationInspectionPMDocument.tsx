import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const fallbackTasks = {
  sections: [
    {
      equipmentName: "INSIDE SUBSTATION",
      tasks: [
        { task: "Check Fire extinguishers are in position" },
        { task: "Check Fire extinguishers in date" },
        { task: "Check Vesda System is not in alarm" },
        { task: "Check Fire alarm Panel for Faults" },
        { task: "Check lights are all functioning correctly" },
        { task: "Check air conditioner is on" },
        { task: "Check floor is clear from items or materials" },
        { task: "Vacuum floor inside Substation" },
        { task: "Mop Floor" },
        { task: "Ensure door locks function correctly and are locked" },
        { task: "Check LV rescue kit is on hooks and in date" },
        { task: "Check ARC Flash signs are in position and legible" },
        { task: "Check isolation tag holder is full of Tags" },
      ],
    },
    {
      equipmentName: "OUTSIDE SUBSTATION",
      tasks: [
        { task: "Check Fire extinguishers are in position" },
        { task: "Check Fire extinguishers in date" },
        { task: "Check no rubbish or tools around the Substation" },
      ],
    },
  ],
};

export const SubstationInspectionPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Substation Inspection Fortnightly");

  const tasksData = pm?.tasks && typeof pm.tasks === "object" && !Array.isArray(pm.tasks) && (pm.tasks as any).sections
    ? pm.tasks
    : fallbackTasks;

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
