import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type ContainerFitout,
  type FitoutItem,
  type FurnitureType,
  FURNITURE_COLORS,
  CONTAINER_FITOUTS,
  getUniqueFurnitureTypes,
  getLocationPrefix,
} from "./containerFitoutData";

interface ContainerFitoutPlanProps {
  containerId: string;
}

/** Human-readable furniture type labels */
const TYPE_LABELS: Record<FurnitureType, string> = {
  "shelving-bay": "Steel Shelving Bay",
  "bin-wall": "Bin Wall",
  "cabinet": "Lockable Cabinet",
  "drawer-unit": "Drawer Cabinet",
  "rack": "Specialist Rack",
  "conduit-bracket": "Conduit / Brackets",
  "foam-totes": "Foam Storage Totes",
  "ppe-rack": "PPE Rack",
  "bunded-shelf": "Bunded Shelf",
  "flat-shelf": "Flat File Shelf",
  "esd-panel": "ESD Bin Panel",
  "reinforced-shelf": "Reinforced Shelf",
};

export const ContainerFitoutPlan = ({ containerId }: ContainerFitoutPlanProps) => {
  const fitout = CONTAINER_FITOUTS[containerId];
  if (!fitout) return null;

  const types = getUniqueFurnitureTypes(fitout);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          Interior Fitout Plan — {containerId} (Top-Down, To Scale)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Internal: {fitout.internalLengthMm}mm × {fitout.internalWidthMm}mm ·
          All furniture placed to physical dimensions · Aisle shown in grey
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm border"
                style={{ backgroundColor: FURNITURE_COLORS[t].fill, borderColor: FURNITURE_COLORS[t].stroke }}
              />
              <span className="text-[10px] text-muted-foreground">{TYPE_LABELS[t]}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-primary/60 bg-primary/10" />
            <span className="text-[10px] text-muted-foreground">Door Opening</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted border border-border" />
            <span className="text-[10px] text-muted-foreground">Aisle</span>
          </div>
        </div>

        {/* SVG Plan */}
        <FitoutSVG fitout={fitout} />

        {/* Notes */}
        {fitout.notes.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Construction & Fitout Notes</p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {fitout.notes.map((note, i) => (
                <li key={i}>• {note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bill of Materials */}
        <FitoutBOM fitout={fitout} />
      </CardContent>
    </Card>
  );
};

/* ═══════ SVG Floor Plan Renderer ═══════ */

const FitoutSVG = ({ fitout }: { fitout: ContainerFitout }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const L = fitout.internalLengthMm;
  const W = fitout.internalWidthMm;

  // Scale to fit ~700px wide
  const maxWidth = 700;
  const scale = maxWidth / L;
  const padding = 60;
  const wallT = 4;

  const svgW = L * scale + padding * 2 + wallT * 2;
  const svgH = W * scale + padding * 2 + wallT * 2 + 30; // extra for bottom labels

  const intLeft = padding + wallT;
  const intTop = padding + wallT;
  const intW = L * scale;
  const intH = W * scale;

  const door = fitout.door;

  // Calculate aisle bounds (space between top-wall furniture and bottom-wall furniture)
  const topMaxDepth = Math.max(0, ...fitout.items.filter(i => i.y === 0).map(i => i.height));
  const bottomMinY = Math.min(W, ...fitout.items.filter(i => i.y + i.height >= W - 10).map(i => i.y));
  const aisleTopPx = intTop + topMaxDepth * scale;
  const aisleBottomPx = intTop + bottomMinY * scale;
  const aisleHeightPx = aisleBottomPx - aisleTopPx;
  const aisleMm = bottomMinY - topMaxDepth;

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto"
          style={{ maxHeight: "500px", minWidth: "500px" }}
        >
          {/* Background */}
          <rect x="0" y="0" width={svgW} height={svgH} fill="hsl(var(--card))" />

          {/* Container walls */}
          <rect
            x={padding}
            y={padding}
            width={intW + wallT * 2}
            height={intH + wallT * 2}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            rx="2"
          />

          {/* Internal floor */}
          <rect x={intLeft} y={intTop} width={intW} height={intH} fill="hsl(var(--muted))" opacity="0.15" />

          {/* Aisle zone */}
          {aisleHeightPx > 5 && (
            <>
              <rect
                x={intLeft + 2}
                y={aisleTopPx + 2}
                width={intW - 4}
                height={aisleHeightPx - 4}
                fill="hsl(var(--muted))"
                opacity="0.3"
                rx="2"
              />
              <text
                x={intLeft + intW / 2}
                y={aisleTopPx + aisleHeightPx / 2 + 3}
                textAnchor="middle"
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
                fontWeight="600"
                opacity="0.6"
              >
                AISLE ({aisleMm}mm)
              </text>
            </>
          )}

          {/* Door opening */}
          {door.wall === "bottom" && (
            <>
              {/* Erase wall segment */}
              <rect
                x={intLeft + door.offsetMm * scale - 1}
                y={intTop + intH - 1}
                width={door.widthMm * scale + 2}
                height={wallT + 4}
                fill="hsl(var(--card))"
              />
              {/* Door markers */}
              <rect
                x={intLeft + door.offsetMm * scale}
                y={intTop + intH - wallT}
                width={door.widthMm * scale}
                height={wallT * 2 + 4}
                fill="hsl(var(--primary))"
                opacity="0.12"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                rx="2"
              />
              {/* Door label */}
              <text
                x={intLeft + (door.offsetMm + door.widthMm / 2) * scale}
                y={intTop + intH + wallT + 16}
                textAnchor="middle"
                fontSize="8"
                fill="hsl(var(--primary))"
                fontWeight="600"
              >
                ▲ {door.label}
              </text>
              {/* Door width dimension */}
              <line
                x1={intLeft + door.offsetMm * scale}
                y1={intTop + intH + wallT + 22}
                x2={intLeft + (door.offsetMm + door.widthMm) * scale}
                y2={intTop + intH + wallT + 22}
                stroke="hsl(var(--primary))"
                strokeWidth="0.6"
              />
              <text
                x={intLeft + (door.offsetMm + door.widthMm / 2) * scale}
                y={intTop + intH + wallT + 30}
                textAnchor="middle"
                fontSize="6"
                fill="hsl(var(--primary))"
              >
                {door.widthMm}mm
              </text>
            </>
          )}

          {/* Furniture items */}
          {fitout.items.map((item) => {
            const ix = intLeft + item.x * scale;
            const iy = intTop + item.y * scale;
            const iw = item.width * scale;
            const ih = item.height * scale;
            const colors = FURNITURE_COLORS[item.type];
            const isHovered = hoveredItem === item.id;

            // Determine if label fits inside
            const labelFits = iw > 40 && ih > 16;
            const fontSize = Math.min(8, Math.max(5.5, iw / 8));

            return (
              <g key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <rect
                      x={ix}
                      y={iy}
                      width={iw}
                      height={ih}
                      fill={colors.fill}
                      stroke={isHovered ? "hsl(var(--foreground))" : colors.stroke}
                      strokeWidth={isHovered ? 2 : 1.2}
                      rx="2"
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="font-semibold text-xs">{item.label}</p>
                    <p className="text-[10px] text-primary font-mono font-bold">
                      {getLocationPrefix(fitout.containerId, item.bayLetter)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.width}mm × {item.height}mm · Type: {TYPE_LABELS[item.type]}
                    </p>
                  </TooltipContent>
                </Tooltip>

                {/* Label */}
                {labelFits ? (
                  <>
                    <text
                      x={ix + iw / 2}
                      y={iy + ih / 2 - 2}
                      textAnchor="middle"
                      fontSize={fontSize}
                      fill={colors.stroke}
                      fontWeight="600"
                      pointerEvents="none"
                      className="select-none"
                    >
                      {item.shortLabel}
                    </text>
                    <text
                      x={ix + iw / 2}
                      y={iy + ih / 2 + fontSize + 1}
                      textAnchor="middle"
                      fontSize={Math.max(5, fontSize - 1.5)}
                      fill="hsl(var(--primary))"
                      fontWeight="700"
                      fontFamily="monospace"
                      pointerEvents="none"
                      className="select-none"
                    >
                      {getLocationPrefix(fitout.containerId, item.bayLetter)}
                    </text>
                  </>
                ) : (
                  /* Small items: external label with leader line */
                  <>
                    <line
                      x1={ix + iw / 2}
                      y1={iy + ih / 2}
                      x2={ix + iw + 12}
                      y2={iy - 4}
                      stroke={colors.stroke}
                      strokeWidth="0.5"
                      strokeDasharray="2 1"
                      opacity="0.6"
                      pointerEvents="none"
                    />
                    <text
                      x={ix + iw + 14}
                      y={iy - 5}
                      fontSize="5.5"
                      fill="hsl(var(--primary))"
                      fontWeight="700"
                      fontFamily="monospace"
                      pointerEvents="none"
                    >
                      {getLocationPrefix(fitout.containerId, item.bayLetter)}
                    </text>
                    <text
                      x={ix + iw + 14}
                      y={iy + 3}
                      fontSize="5"
                      fill={colors.stroke}
                      fontWeight="500"
                      pointerEvents="none"
                    >
                      {item.shortLabel}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Wall labels */}
          <text x={intLeft + intW / 2} y={intTop - 8} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" fontWeight="600">
            REAR WALL (no door)
          </text>
          <text x={intLeft - 8} y={intTop + intH / 2} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" fontWeight="600" transform={`rotate(-90, ${intLeft - 8}, ${intTop + intH / 2})`}>
            END WALL 1
          </text>
          <text x={intLeft + intW + wallT + 10} y={intTop + intH / 2} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" fontWeight="600" transform={`rotate(90, ${intLeft + intW + wallT + 10}, ${intTop + intH / 2})`}>
            END WALL 2
          </text>

          {/* Dimension annotations */}
          {/* Length (top) */}
          <line x1={intLeft} y1={padding - 18} x2={intLeft + intW} y2={padding - 18} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <line x1={intLeft} y1={padding - 22} x2={intLeft} y2={padding - 14} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <line x1={intLeft + intW} y1={padding - 22} x2={intLeft + intW} y2={padding - 14} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <text x={intLeft + intW / 2} y={padding - 24} textAnchor="middle" fontSize="8" fill="hsl(var(--foreground))" fontWeight="600">
            {L}mm ({(L / 1000).toFixed(1)}m)
          </text>

          {/* Width (left) */}
          <line x1={padding - 18} y1={intTop} x2={padding - 18} y2={intTop + intH} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <line x1={padding - 22} y1={intTop} x2={padding - 14} y2={intTop} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <line x1={padding - 22} y1={intTop + intH} x2={padding - 14} y2={intTop + intH} stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          <text x={padding - 26} y={intTop + intH / 2} textAnchor="middle" fontSize="8" fill="hsl(var(--foreground))" fontWeight="600" transform={`rotate(-90, ${padding - 26}, ${intTop + intH / 2})`}>
            {W}mm ({(W / 1000).toFixed(1)}m)
          </text>

          {/* Racking depth annotation (right side, first item on top wall) */}
          {fitout.items.filter(i => i.y === 0).length > 0 && (() => {
            const topItem = fitout.items.find(i => i.y === 0)!;
            const rackDepthPx = topItem.height * scale;
            const annotX = intLeft + intW + wallT + 24;
            return (
              <>
                <line x1={annotX} y1={intTop} x2={annotX} y2={intTop + rackDepthPx} stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
                <line x1={annotX - 3} y1={intTop} x2={annotX + 3} y2={intTop} stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
                <line x1={annotX - 3} y1={intTop + rackDepthPx} x2={annotX + 3} y2={intTop + rackDepthPx} stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
                <text x={annotX + 4} y={intTop + rackDepthPx / 2 + 3} fontSize="6" fill="hsl(var(--muted-foreground))">
                  {topItem.height}mm rack
                </text>
              </>
            );
          })()}
        </svg>
      </div>
    </TooltipProvider>
  );
};

/* ═══════ Bill of Materials Table ═══════ */

const FitoutBOM = ({ fitout }: { fitout: ContainerFitout }) => {
  // Group items by type
  const grouped = fitout.items.reduce<Record<string, FitoutItem[]>>((acc, item) => {
    (acc[item.type] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-2 pt-2 border-t border-border">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        Fitout Bill of Materials — {fitout.containerId}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-1 px-2 text-muted-foreground font-medium">Item</th>
              <th className="text-left py-1 px-2 text-muted-foreground font-medium">Type</th>
              <th className="text-right py-1 px-2 text-muted-foreground font-medium">W×D (mm)</th>
              <th className="text-right py-1 px-2 text-muted-foreground font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([type, items]) => {
              // Group identical dimensions
              const sizeGroups = items.reduce<Record<string, FitoutItem[]>>((acc, item) => {
                const key = `${item.width}×${item.height}`;
                (acc[key] ??= []).push(item);
                return acc;
              }, {});

              return Object.entries(sizeGroups).map(([size, sizeItems], idx) => (
                <tr key={`${type}-${size}-${idx}`} className="border-b border-border/50">
                  <td className="py-1 px-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-sm border flex-shrink-0"
                        style={{
                          backgroundColor: FURNITURE_COLORS[type as FurnitureType].fill,
                          borderColor: FURNITURE_COLORS[type as FurnitureType].stroke,
                        }}
                      />
                      <span>{sizeItems[0].label}</span>
                    </div>
                  </td>
                  <td className="py-1 px-2 text-muted-foreground">{TYPE_LABELS[type as FurnitureType]}</td>
                  <td className="py-1 px-2 text-right font-mono">{size}</td>
                  <td className="py-1 px-2 text-right font-mono font-semibold">{sizeItems.length}</td>
                </tr>
              ));
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border">
              <td colSpan={3} className="py-1 px-2 font-medium">Total furniture items</td>
              <td className="py-1 px-2 text-right font-mono font-bold">{fitout.items.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
