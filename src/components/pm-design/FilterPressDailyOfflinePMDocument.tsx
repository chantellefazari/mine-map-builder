import { AlertTriangle, AlertCircle } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const immediateAttentionTriggers = [
  "Plate cracks or damaged sealing edges",
  "Cylinder rod scoring or seal failure",
  "Chain elongation >3%",
  "Seized or hot bearings",
  "Misaligned frame or tie bars",
  "Visible hydraulic leaks",
];

export const FilterPressDailyOfflinePMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Filter Press Daily Offline Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Filtration Area - Filter Press" subtitle="Mechanical Daily Offline Inspection (Fitter)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Filter Press"
          pmGroup="Mechanical"
          pmType="Offline Inspection (Fitter)"
          frequency="Daily"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} showEquipmentId />

        {/* Immediate Attention Triggers */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-bold">IMMEDIATE ATTENTION TRIGGERS</span>
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm">
              {immediateAttentionTriggers.map((trigger, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Inspection Form" />
      </div>
    </div>
  );
};
