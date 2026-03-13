import { Input } from "@/components/ui/input";
import { Gauge } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";

export const ROPlantPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "RO Plant Daily Inspection");

  return (
    <div className="bg-background">
      <div className="border-2 border-border">
        <PMBannerHeader
          title="Tenant Creek - RO Plant Inspection"
          subtitle="Mechanical Running PMs - Daily RO Plant Inspection (Fitter)"
        />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="RO Plant"
          pmGroup="Mechanical"
          pmType="Inspection (Fitter)"
          frequency="Daily"
          assetNumber={pm?.assetNumber || ""}
          resources={pm?.resources || ""}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} title="SYSTEM, ASSEMBLY AND COMPONENTS CHECK" />

        {/* Data Logging Table */}
        <div className="border-b border-border" data-pdf-section>
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            DATA LOGGING
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-1 py-2 text-center font-semibold">CT4001<br/><span className="font-normal text-muted-foreground">Feed</span><br/><span className="font-normal text-muted-foreground">µs/cm</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">CT4002<br/><span className="font-normal text-muted-foreground">Permeate</span><br/><span className="font-normal text-muted-foreground">µs/cm</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">PI-01<br/><span className="font-normal text-muted-foreground">Before Media</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">PI-02<br/><span className="font-normal text-muted-foreground">After Media</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">PT2001<br/><span className="font-normal text-muted-foreground">After Cartridge</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">PT2003<br/><span className="font-normal text-muted-foreground">Before Membrane</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">PT2002<br/><span className="font-normal text-muted-foreground">After Membrane</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">P-01<br/><span className="font-normal text-muted-foreground">Freq</span><br/><span className="font-normal text-muted-foreground">HZ</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">P-02<br/><span className="font-normal text-muted-foreground">Freq</span><br/><span className="font-normal text-muted-foreground">HZ</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">FT1001<br/><span className="font-normal text-muted-foreground">Brine</span><br/><span className="font-normal text-muted-foreground">lpm</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">FT1002<br/><span className="font-normal text-muted-foreground">Recirc</span><br/><span className="font-normal text-muted-foreground">lpm</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">FT1003<br/><span className="font-normal text-muted-foreground">Permeate</span><br/><span className="font-normal text-muted-foreground">lpm</span></th>
                <th className="border border-border px-1 py-2 text-center font-semibold">TT5001<br/><span className="font-normal text-muted-foreground">Brine</span><br/><span className="font-normal text-muted-foreground">°C</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {Array(13).fill(null).map((_, idx) => (
                  <td key={idx} className="border border-border px-1 py-3 text-center">
                    <Input className="h-7 text-xs text-center border-0 bg-transparent w-full" placeholder="" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Processing Plant Inspection Form" />
      </div>
    </div>
  );
};
