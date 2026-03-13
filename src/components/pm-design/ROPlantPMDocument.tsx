import { Input } from "@/components/ui/input";
import { Gauge } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

const dataLoggingColumns = [
  { tag: "CT4001", label: "Feed", unit: "µs/cm" },
  { tag: "CT4002", label: "Permeate", unit: "µs/cm" },
  { tag: "PI-01", label: "Bef. Media", unit: "bar" },
  { tag: "PI-02", label: "Aft. Media", unit: "bar" },
  { tag: "PT2001", label: "Aft. Cart.", unit: "bar" },
  { tag: "PT2003", label: "Bef. Memb.", unit: "bar" },
  { tag: "PT2002", label: "Aft. Memb.", unit: "bar" },
  { tag: "P-01", label: "Freq", unit: "HZ" },
  { tag: "P-02", label: "Freq", unit: "HZ" },
  { tag: "FT1001", label: "Brine", unit: "lpm" },
  { tag: "FT1002", label: "Recirc", unit: "lpm" },
  { tag: "FT1003", label: "Permeate", unit: "lpm" },
  { tag: "TT5001", label: "Brine", unit: "°C" },
];

export const ROPlantPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "RO Plant Daily Inspection");

  return (
    <div className="bg-background">
      <div
        className="border-2 border-border overflow-visible"
        data-pdf-component="ro-plant-pm-document"
        data-pdf-section
        data-pdf-flow-container
      >
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
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable
          tasksData={pm?.tasks}
          title="SYSTEM, ASSEMBLY AND COMPONENTS CHECK"
        />

        {/* Data Logging Table */}
        <div className="border-b border-border" data-pdf-section data-pdf-component="ro-data-logging-section">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            DATA LOGGING
          </div>
          <table className="w-full border-collapse text-[10px]" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="bg-muted">
                {dataLoggingColumns.map((col) => (
                  <th key={col.tag} className="border border-border px-0.5 py-1.5 text-center font-semibold leading-tight">
                    {col.tag}<br />
                    <span className="font-normal text-muted-foreground">{col.label}</span><br />
                    <span className="font-normal text-muted-foreground">{col.unit}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {dataLoggingColumns.map((col) => (
                  <td key={col.tag} className="border border-border px-0.5 py-4 text-center">
                    <Input className="h-6 text-[10px] text-center border-0 bg-transparent w-full p-0" placeholder="" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Processing Plant Inspection Form" />
    </div>
  );
};
