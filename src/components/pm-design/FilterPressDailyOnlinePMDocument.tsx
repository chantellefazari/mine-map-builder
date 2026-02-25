import { AlertTriangle, AlertCircle } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const shutdownTriggers = [
  "Bearing temperature >95°C",
  "Smoke or burning smell",
  "Sudden pressure drop in press",
  "Gearbox oil leak + high temperature",
  "Severe belt mistracking",
  "Abnormal vibration + temperature rise",
];

export const FilterPressDailyOnlinePMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Filter Press Daily Online Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Matec 1520HP Filter Press Daily Online Inspection" subtitle="Mechanical Daily Online Inspection" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="Filter Press"
          pmGroup="Mechanical"
          pmType="Online Inspection"
          frequency="Daily"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} showEquipmentId />

        {/* SHUTDOWN TRIGGERS */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">SHUTDOWN TRIGGERS – STOP & REPORT</span>
          </div>
          <div className="px-4 py-4 bg-destructive/5">
            <ul className="space-y-2 text-sm">
              {shutdownTriggers.map((trigger, i) => (
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
