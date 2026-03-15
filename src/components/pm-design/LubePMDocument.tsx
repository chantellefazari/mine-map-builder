import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { Checkbox } from "@/components/ui/checkbox";
import { getLubePMTemplate } from "./lubePMData";

interface LubePMDocumentProps {
  templateId: string;
}

export const LubePMDocument = ({ templateId }: LubePMDocumentProps) => {
  const template = getLubePMTemplate(templateId);
  if (!template) return <div className="p-8 text-muted-foreground">Template not found.</div>;

  return (
    <div className="bg-background min-h-full lube-pm-template" style={{ maxWidth: "100%", boxSizing: "border-box" }}>
      <div className="border-2 border-border">
        <PMBannerHeader title={template.title} subtitle={template.subtitle} />

        <PMMetadataGrid
          projectSite="Tennant Creek"
          plantArea={template.plantArea}
          pmGroup="Lubrication"
          pmType="Lubrication Service"
          frequency={template.frequency}
          hideAssetNumber
        />

        <SafetyPrecautionsSection />

        {/* Lube Schedule Table – vertical stacked layout */}
        <div data-pdf-section>
          <div className="bg-primary px-3 py-1.5 border-b border-border">
            <span className="text-sm font-bold text-primary-foreground">LUBRICATION SCHEDULE</span>
          </div>

          <table
            className="w-full text-xs"
            style={{ tableLayout: "fixed", borderCollapse: "collapse" }}
          >
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "8%" }} />
            </colgroup>
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1.5 text-left font-semibold">Plant ID</th>
                <th className="px-2 py-1.5 text-left font-semibold">Plant Item</th>
                <th className="px-2 py-1.5 text-center font-semibold">Pt #</th>
                <th className="px-2 py-1.5 text-left font-semibold">Location</th>
                <th className="px-2 py-1.5 text-left font-semibold">Type</th>
                <th className="px-2 py-1.5 text-center font-semibold">Qty</th>
                <th className="px-2 py-1.5 text-center font-semibold">✓</th>
              </tr>
            </thead>
            <tbody>
              {template.items.map((item, idx) => {
                const pointCount = item.lubePoints.length;
                return item.lubePoints.map((lp, lpIdx) => (
                  <tr
                    key={`${item.plantId}-${idx}-${lpIdx}`}
                    className={idx % 2 === 0 ? "" : "bg-muted/30"}
                    data-pdf-break
                  >
                    {lpIdx === 0 && (
                      <>
                        <td
                          className="px-2 py-1.5 font-mono font-medium align-top"
                          rowSpan={pointCount}
                          style={{ overflowWrap: "break-word" }}
                        >
                          {item.plantId}
                        </td>
                        <td
                          className="px-2 py-1.5 align-top"
                          rowSpan={pointCount}
                          style={{ overflowWrap: "break-word" }}
                        >
                          {item.plantItem}
                        </td>
                      </>
                    )}
                    <td className="px-2 py-1.5 text-center font-medium">{lpIdx + 1}</td>
                    <td className="px-2 py-1.5" style={{ overflowWrap: "break-word" }}>{lp.location}</td>
                    <td className="px-2 py-1.5 font-medium" style={{ overflowWrap: "break-word" }}>{lp.type}</td>
                    <td className="px-2 py-1.5 text-center" style={{ overflowWrap: "break-word" }}>
                      {lp.quantity}{lp.uom ? ` ${lp.uom}` : ""}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <Checkbox className="h-4 w-4" />
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Lubrication PM" />
      </div>
    </div>
  );
};
