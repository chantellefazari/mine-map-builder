import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { Checkbox } from "@/components/ui/checkbox";
import { getLubePMTemplate } from "./lubePMData";

interface LubePMDocumentProps {
  templateId: string;
}

export const LubePMDocument = ({ templateId }: LubePMDocumentProps) => {
  const template = getLubePMTemplate(templateId);
  if (!template) return <div className="p-8 text-muted-foreground">Template not found.</div>;

  // Calculate max lube points per row for column headers
  const maxPoints = Math.max(...template.items.map((i) => i.lubePoints.length));

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title={template.title} subtitle={template.subtitle} />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs" data-pdf-section>
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div>
              <div className="px-2 py-1.5">Tennant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Lubrication</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div>
              <div className="px-2 py-1.5 font-medium">{template.frequency}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* Safety note */}
        <div className="border-b border-border px-3 py-1.5 text-xs bg-amber-50 dark:bg-amber-950/20" data-pdf-section>
          <span className="font-semibold text-amber-700 dark:text-amber-400">⚠ SAFETY:</span>{" "}
          <span className="text-muted-foreground">
            Ensure equipment is isolated and locked out before performing lubrication. Wear appropriate PPE including safety glasses, gloves, and hearing protection.
          </span>
        </div>

        {/* Lube Schedule Table */}
        <div data-pdf-section>
          <div className="bg-primary px-3 py-1.5 border-b border-border">
            <span className="text-sm font-bold text-primary-foreground">LUBRICATION SCHEDULE</span>
          </div>

          <table className="w-full text-xs border-collapse" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-2 py-1.5 text-left font-semibold border-r border-border w-[70px]">Plant ID</th>
                <th className="px-2 py-1.5 text-left font-semibold border-r border-border">Plant Item</th>
                {Array.from({ length: maxPoints }).map((_, i) => (
                  <th key={`lp-header-${i}`} colSpan={1} className="border-r border-border p-0">
                    <div className="bg-muted">
                      <div className="grid grid-cols-4 divide-x divide-border text-center">
                        <div className="px-1 py-1 font-semibold">Location</div>
                        <div className="px-1 py-1 font-semibold">Type</div>
                        <div className="px-1 py-1 font-semibold">Qty</div>
                        <div className="px-1 py-1 font-semibold">✓</div>
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
                  <td className="px-2 py-1.5 font-mono font-medium border-r border-border align-top">
                    {item.plantId}
                  </td>
                  <td className="px-2 py-1.5 border-r border-border align-top">
                    {item.plantItem}
                  </td>
                  {Array.from({ length: maxPoints }).map((_, lpIdx) => {
                    const lp = item.lubePoints[lpIdx];
                    if (!lp) {
                      return (
                        <td key={`empty-${lpIdx}`} className="border-r border-border p-0">
                          <div className="grid grid-cols-4 divide-x divide-border text-center">
                            <div className="px-1 py-1.5"></div>
                            <div className="px-1 py-1.5"></div>
                            <div className="px-1 py-1.5"></div>
                            <div className="px-1 py-1.5"></div>
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={`lp-${lpIdx}`} className="border-r border-border p-0">
                        <div className="grid grid-cols-4 divide-x divide-border text-center">
                          <div className="px-1 py-1.5 text-left">{lp.location}</div>
                          <div className="px-1 py-1.5 font-medium">{lp.type}</div>
                          <div className="px-1 py-1.5">
                            {lp.quantity}
                            {lp.uom ? ` ${lp.uom}` : ""}
                          </div>
                          <div className="px-1 py-1.5 flex items-center justify-center">
                            <Checkbox className="h-3.5 w-3.5" />
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
