import { AlertTriangle, AlertCircle } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const mechanicalFindings = [
  "Excessive shaft play",
  "Bearing roughness during manual rotation",
  "Oil leakage from air end",
  "Cracked coupling insert",
  "Loose anchor bolts",
  "Damaged vibration mounts",
  "Refrigerant oil traces at fittings",
];

export const FilterPressCompressorOfflinePMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Filter Press Compressor (Offline) Weekly Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Weekly Mechanical Filter Press Air Compressor Offline Inspection" subtitle="Mechanical Weekly Offline Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Filter Press – Air Compressor"
          pmGroup="Mechanical"
          pmType="Offline Inspection"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} title="INSPECTION CHECKLIST" showEquipmentId />

        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">OFFLINE MECHANICAL FINDINGS – IMMEDIATE ACTION</span>
          </div>
          <div className="px-4 py-4 bg-destructive/5">
            <ul className="space-y-2 text-sm">
              {mechanicalFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PMSignOffBlock />
      </div>
    </div>
  );
};