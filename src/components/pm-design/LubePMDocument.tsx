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

  // Column widths: Plant ID ~9%, Plant Item ~21%, each lube point group gets remaining space equally
  const lubeGroupWidth = maxPoints > 0 ? Math.floor(70 / maxPoints) : 70;

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
              <col style={{ width: "9%" }} />
              <col style={{ width: `${91 - lubeGroupWidth * maxPoints}%` }} />
              {Array.from({ length: maxPoints }).map((_, i) => (
                <col key={`col-${i}`} style={{ width: `${lubeGroupWidth}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-1.5 py-1 text-left font-semibold border-r border-border">Plant ID</th>
                <th className="px-1.5 py-1 text-left font-semibold border-r border-border">Plant Item</th>
                {Array.from({ length: maxPoints }).map((_, i) => (
                  <th key={`lp-header-${i}`} className="border-r border-border p-0">
                    <div className="bg-muted text-center text-[9px]">
                      <div className="px-1 py-0.5 font-semibold border-b border-border">
                        Lube Point {maxPoints > 1 ? i + 1 : ""}
                      </div>
                      <div className="grid grid-cols-4 divide-x divide-border">
                        <div className="px-0.5 py-0.5 font-semibold">Loc</div>
                        <div className="px-0.5 py-0.5 font-semibold">Type</div>
                        <div className="px-0.5 py-0.5 font-semibold">Qty</div>
                        <div className="px-0.5 py-0.5 font-semibold">✓</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {template.items.map((item, idx) => (
                <tr
                  key={`${item.plantId}-${idx}`}
                  className={`border-b border-border ${idx % 2 === 0 ? "" : "bg-muted/30"}`}
                  data-pdf-break
                >
                  <td className="px-1.5 py-1 font-mono font-medium border-r border-border align-top text-[9px]">
                    {item.plantId}
                  </td>
                  <td className="px-1.5 py-1 border-r border-border align-top text-[9px]">
                    {item.plantItem}
                  </td>
                  {Array.from({ length: maxPoints }).map((_, lpIdx) => {
                    const lp = item.lubePoints[lpIdx];
                    if (!lp) {
                      return (
                        <td key={`empty-${lpIdx}`} className="border-r border-border p-0">
                          <div className="grid grid-cols-4 divide-x divide-border text-center text-[9px]">
                            <div className="px-0.5 py-1"></div>
                            <div className="px-0.5 py-1"></div>
                            <div className="px-0.5 py-1"></div>
                            <div className="px-0.5 py-1"></div>
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={`lp-${lpIdx}`} className="border-r border-border p-0">
                        <div className="grid grid-cols-4 divide-x divide-border text-center text-[9px]">
                          <div className="px-0.5 py-1 text-left truncate">{lp.location}</div>
                          <div className="px-0.5 py-1 font-medium truncate">{lp.type}</div>
                          <div className="px-0.5 py-1 truncate">
                            {lp.quantity}
                            {lp.uom ? ` ${lp.uom}` : ""}
                          </div>
                          <div className="px-0.5 py-1 flex items-center justify-center">
                            <Checkbox className="h-3 w-3" />
                          </div>
                        </div>
                      </td>
                    );
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
