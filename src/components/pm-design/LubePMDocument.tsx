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

  return (
    <div className="bg-background min-h-full" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
      <div className="border-2 border-border">
        <PMBannerHeader title={template.title} subtitle={template.subtitle} />

        <PMMetadataGrid
          projectSite="Tennant Creek"
          plantArea="Processing Plant"
          pmGroup="Lubrication"
          pmType="Lubrication Service"
          frequency={template.frequency}
        />

        <SafetyPrecautionsSection />

        {/* Lube Schedule Table */}
        <div data-pdf-section>
          <div className="bg-primary px-3 py-1.5 border-b border-border">
            <span className="text-sm font-bold text-primary-foreground">LUBRICATION SCHEDULE</span>
          </div>

          <table className="w-full text-xs border-collapse" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: `${30 - (maxPoints > 2 ? 5 : 0)}%` }} />
              {Array.from({ length: maxPoints }).flatMap((_, i) => {
                const groupPct = (60 + (maxPoints > 2 ? 5 : 0)) / maxPoints;
                return [
                  <col key={`loc-${i}`} style={{ width: `${groupPct * 0.35}%` }} />,
                  <col key={`type-${i}`} style={{ width: `${groupPct * 0.25}%` }} />,
                  <col key={`qty-${i}`} style={{ width: `${groupPct * 0.28}%` }} />,
                  <col key={`chk-${i}`} style={{ width: `${groupPct * 0.12}%` }} />,
                ];
              })}
            </colgroup>
            <thead>
              {/* Group header row */}
              <tr className="bg-muted border-b border-border">
                <th rowSpan={2} className="px-1 py-1 text-left font-semibold border-r border-border align-bottom">Plant ID</th>
                <th rowSpan={2} className="px-1 py-1 text-left font-semibold border-r border-border align-bottom">Plant Item</th>
                {Array.from({ length: maxPoints }).map((_, i) => (
                  <th key={`grp-${i}`} colSpan={4} className="px-1 py-0.5 text-center font-semibold border-r border-border border-b border-border">
                    {maxPoints > 1 ? `Lube Point ${i + 1}` : "Lube Point"}
                  </th>
                ))}
              </tr>
              {/* Sub-header row */}
              <tr className="bg-muted border-b border-border">
                {Array.from({ length: maxPoints }).flatMap((_, i) => [
                  <th key={`h-loc-${i}`} className="px-1 py-0.5 text-left font-semibold border-r border-border">Location</th>,
                  <th key={`h-type-${i}`} className="px-1 py-0.5 text-left font-semibold border-r border-border">Type</th>,
                  <th key={`h-qty-${i}`} className="px-1 py-0.5 text-center font-semibold border-r border-border">Qty</th>,
                  <th key={`h-chk-${i}`} className="px-1 py-0.5 text-center font-semibold border-r border-border">✓</th>,
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
                  <td className="px-1 py-1 border-r border-border align-top">
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
                      <td key={`loc-${lpIdx}`} className="px-1 py-1 border-r border-border align-top" style={{ wordBreak: "break-word" }}>{lp.location}</td>,
                      <td key={`type-${lpIdx}`} className="px-1 py-1 border-r border-border align-top font-medium" style={{ wordBreak: "break-word" }}>{lp.type}</td>,
                      <td key={`qty-${lpIdx}`} className="px-1 py-1 border-r border-border align-top text-center" style={{ wordBreak: "break-word" }}>
                        {lp.quantity}{lp.uom ? ` ${lp.uom}` : ""}
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
