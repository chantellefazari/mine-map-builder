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

  const maxPoints = Math.max(...template.items.map((i) => i.lubePoints.length));
  const isDenseLayout = maxPoints >= 3;

  const plantIdPct = isDenseLayout ? 8 : 10;
  const plantItemPct = isDenseLayout ? 20 : 30;
  const lubeGroupPct = (100 - plantIdPct - plantItemPct) / maxPoints;

  const columnWeights = isDenseLayout
    ? { location: 0.3, type: 0.24, qty: 0.36, check: 0.1 }
    : { location: 0.28, type: 0.18, qty: 0.42, check: 0.12 };

  const formatQty = (quantity: string, uom: string) => {
    const normalized = isDenseLayout
      ? quantity.replace("To Tank Capacity", "To Cap.").replace("To Capacity", "To Cap.")
      : quantity;

    return `${normalized}${uom ? ` ${uom}` : ""}`;
  };

  return (
    <div className="bg-background min-h-full" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
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

        {/* Lube Schedule Table */}
        <div data-pdf-section>
          <div className="bg-primary px-3 py-1.5 border-b border-border">
            <span className="text-sm font-bold text-primary-foreground">LUBRICATION SCHEDULE</span>
          </div>

          <table
            className={`w-full border-collapse ${isDenseLayout ? "text-[10px]" : "text-xs"}`}
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: `${plantIdPct}%` }} />
              <col style={{ width: `${plantItemPct}%` }} />
              {Array.from({ length: maxPoints }).flatMap((_, i) => [
                <col key={`loc-${i}`} style={{ width: `${lubeGroupPct * columnWeights.location}%` }} />,
                <col key={`type-${i}`} style={{ width: `${lubeGroupPct * columnWeights.type}%` }} />,
                <col key={`qty-${i}`} style={{ width: `${lubeGroupPct * columnWeights.qty}%` }} />,
                <col key={`chk-${i}`} style={{ width: `${lubeGroupPct * columnWeights.check}%` }} />,
              ])}
            </colgroup>
            <thead>
              {/* Group header row */}
              <tr className="bg-muted border-b border-border">
                <th rowSpan={2} className="px-1 py-1 text-left font-semibold border-r border-border align-bottom whitespace-nowrap">Plant ID</th>
                <th rowSpan={2} className="px-1 py-1 text-left font-semibold border-r border-border align-bottom">Plant Item</th>
                {Array.from({ length: maxPoints }).map((_, i) => (
                  <th key={`grp-${i}`} colSpan={4} className="px-1 py-0.5 text-center font-semibold border-r border-border border-b border-border whitespace-nowrap">
                    {maxPoints > 1 ? `Lube Point ${i + 1}` : "Lube Point"}
                  </th>
                ))}
              </tr>
              {/* Sub-header row */}
              <tr className="bg-muted border-b border-border">
                {Array.from({ length: maxPoints }).flatMap((_, i) => [
                  <th key={`h-loc-${i}`} className="px-1 py-0.5 text-left font-semibold border-r border-border whitespace-nowrap">Location</th>,
                  <th key={`h-type-${i}`} className="px-1 py-0.5 text-left font-semibold border-r border-border whitespace-nowrap">Type</th>,
                  <th key={`h-qty-${i}`} className="px-1 py-0.5 text-center font-semibold border-r border-border whitespace-nowrap">Qty</th>,
                  <th key={`h-chk-${i}`} className="px-1 py-0.5 text-center font-semibold border-r border-border whitespace-nowrap">✓</th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {template.items.map((item, idx) => (
                <tr
                  key={`${item.plantId}-${idx}`}
                  className={`border-b border-border ${idx % 2 === 0 ? "" : "bg-muted/30"}`}
                  data-pdf-break
                >
                  <td className="px-1 py-1 font-mono font-medium border-r border-border align-top" style={{ wordBreak: "break-all" }}>
                    {item.plantId}
                  </td>
                  <td className="px-1 py-1 border-r border-border align-top" style={{ wordBreak: "normal", overflowWrap: "break-word" }}>
                    {item.plantItem}
                  </td>
                  {Array.from({ length: maxPoints }).flatMap((_, lpIdx) => {
                    const lp = item.lubePoints[lpIdx];
                    if (!lp) {
                      return [
                        <td key={`e-loc-${lpIdx}`} className="px-1 py-1 border-r border-border"></td>,
                        <td key={`e-type-${lpIdx}`} className="px-1 py-1 border-r border-border"></td>,
                        <td key={`e-qty-${lpIdx}`} className="px-1 py-1 border-r border-border"></td>,
                        <td key={`e-chk-${lpIdx}`} className="px-1 py-1 border-r border-border"></td>,
                      ];
                    }
                    return [
                      <td key={`loc-${lpIdx}`} className="px-1 py-1 border-r border-border align-top" style={{ wordBreak: "normal", overflowWrap: "break-word" }}>{lp.location}</td>,
                      <td key={`type-${lpIdx}`} className="px-1 py-1 border-r border-border align-top font-medium" style={{ wordBreak: "normal", overflowWrap: "break-word" }}>{lp.type}</td>,
                      <td key={`qty-${lpIdx}`} className="px-1 py-1 border-r border-border align-top text-center" style={{ whiteSpace: "nowrap" }}>
                        {formatQty(lp.quantity, lp.uom)}
                      </td>,
                      <td key={`chk-${lpIdx}`} className="px-1 py-1 border-r border-border align-top text-center">
                        <Checkbox className="h-3 w-3" />
                      </td>,
                    ];
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Lubrication PM" />
      </div>
    </div>
  );
};
