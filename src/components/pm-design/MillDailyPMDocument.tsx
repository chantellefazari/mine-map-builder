import { Thermometer } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { DynamicInspectionTable } from "./DynamicInspectionTable";
import { MillBearingDiagrams } from "./MillBearingDiagrams";

export const MillDailyPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Mill Daily Inspection");

  // Split tasks into before-BC100 (inclusive) and after-BC100
  const allSections = (pm?.tasks as any)?.sections || [];
  const bc100Index = allSections.findIndex((s: any) => s.equipmentId === "BC-100");
  const beforeAndBC100 = bc100Index >= 0 ? { sections: allSections.slice(0, bc100Index + 1) } : null;
  const afterBC100 = bc100Index >= 0 ? { sections: allSections.slice(bc100Index + 1) } : null;

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek - Daily Mill Inspection" subtitle="Mechanical Running PMs - Daily Inspection (Fitter)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="Grinding"
          pmGroup="Mechanical"
          pmType="Inspection (Fitter)"
          frequency="Daily"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {/* Sections up to and including BC-100 */}
        {beforeAndBC100 ? (
          <DynamicInspectionTable tasksData={beforeAndBC100} showEquipmentId />
        ) : (
          <DynamicInspectionTable tasksData={pm?.tasks} showEquipmentId />
        )}

        {/* BC-100 Additional Bearing Temperatures — immediately after BC-100 */}
        {bc100Index >= 0 && (
          <div className="border-b border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-primary" />
              BC-100 ADDITIONAL BEARING TEMPERATURES
            </div>
            <div className="p-4 grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2"><span className="font-medium">Upper Bend Pulley:</span><span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span></div>
              <div className="flex items-center gap-2"><span className="font-medium">Lower Bend Pulley:</span><span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span></div>
              <div className="flex items-center gap-2"><span className="font-medium">Take-up Pulley:</span><span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span></div>
            </div>
          </div>
        )}

        {/* Remaining sections after BC-100 */}
        {afterBC100 && afterBC100.sections.length > 0 && (
          <DynamicInspectionTable tasksData={afterBC100} showEquipmentId />
        )}

        {/* Mill Specific Data */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            MILL DATA & TEMPERATURES
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2"><span className="font-medium">Ambient Temp:</span><span className="text-muted-foreground">___°C</span></div>
              <div className="flex items-center gap-2"><span className="font-medium">Throughput Tonnes:</span><span className="text-muted-foreground">_________</span></div>
            </div>
            <div>
              <span className="font-medium">PINION FACE TEMPS:</span>
              <div className="mt-2 flex gap-8">
                <span className="text-muted-foreground">LEFT: ___°C</span>
                <span className="text-muted-foreground">CENTRE: ___°C</span>
                <span className="text-muted-foreground">RIGHT: ___°C</span>
              </div>
            </div>
            <div>
              <span className="font-medium">BEARINGS (1-10):</span>
              <div className="mt-2 grid grid-cols-10 gap-2 text-xs text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="border border-border rounded p-2"><span className="font-medium">{num}=</span></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2"><span className="font-medium">GEARBOX LUBE TEMP (from Control Room):</span><span className="text-muted-foreground">___°C</span></div>
          </div>
        </div>

        {/* Bearing Numbering System & Vibration Measurements Reference Diagrams */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            BEARING NUMBERING SYSTEM & VIBRATION MEASUREMENTS
          </div>
          <MillBearingDiagrams />
        </div>

        <PMSignOffBlock />
      </div>
    </div>
  );
};