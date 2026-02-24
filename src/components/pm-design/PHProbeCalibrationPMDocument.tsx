import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck, Info } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

export const PHProbeCalibrationPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "pH Probe Calibration Weekly");

  const tasksData = pm?.tasks as any;
  const calibrationReadings = (tasksData?.calibrationReadings || []) as { id: string; label: string }[];
  const cleaningProcedure = (tasksData?.cleaningProcedure || []) as string[];
  const calibrationProcedure = (tasksData?.calibrationProcedure || []) as string[];

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="pH Probe Cleaning & Calibration" subtitle="Electrical Weekly Procedure" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea="CIP Tank 1"
          pmGroup="Electrical"
          pmType="Calibration"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {/* Cleaning Procedure */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE FOR CLEANING pH PROBES
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              The Rougher pH probe (AIC-0933) needs to be cleaned at least every week to prevent scale from fouling the electrodes.
            </p>
            <ol className="space-y-2 text-sm">
              {cleaningProcedure.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Calibration Readings */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            CALIBRATION READINGS - CIP TANK 1
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-muted"><th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th><th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th><th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th></tr></thead>
            <tbody>
              {calibrationReadings.map((reading) => (
                <tr key={reading.id} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2">{reading.label}</td>
                  <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
                  <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
                  <td className="border border-border px-2 py-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calibration Procedure */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            WEEKLY pH PROBE CALIBRATION PROCEDURE
          </div>
          <div className="p-4">
            <ol className="space-y-2 text-sm">
              {calibrationProcedure.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Electrical Calibration Form" />
      </div>
    </div>
  );
};
