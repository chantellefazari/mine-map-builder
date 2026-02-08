import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StoreContainer, getContainerAreaM2, getRackingAreaM2 } from "./storeLayoutData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Wind, ShieldAlert, TrendingUp, Package, ChevronDown, ChevronRight, DoorOpen, Ruler, ArrowDown } from "lucide-react";
import { BinDetailDialog } from "./BinDetailDialog";

interface ContainerDetail2DProps {
  container: StoreContainer;
  parts: Array<{
    id: string;
    description: string;
    bin_location: string | null;
    warehouse_area: string | null;
    category: string | null;
    part_number: string | null;
  }>;
  liveMode: boolean;
}

export const ContainerDetail2D = ({ container, parts, liveMode }: ContainerDetail2DProps) => {
  const shelves = container.shelves;
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const dim = container.physicalDimensions;

  const getPartAtBin = (binId: string) => {
    if (!liveMode || !parts.length) return null;
    const locationCode = `${container.id}-${container.zoneCode}-${binId}`;
    return parts.find((p) => {
      const loc = (p.bin_location || "").toUpperCase();
      return loc === locationCode || loc.endsWith(binId);
    });
  };

  const getPartsAtBin = (binId: string) => {
    if (!liveMode || !parts.length) return [];
    const locationCode = `${container.id}-${container.zoneCode}-${binId}`;
    return parts.filter((p) => {
      const loc = (p.bin_location || "").toUpperCase();
      return loc === locationCode || loc.endsWith(binId);
    });
  };

  const getPartsOnShelf = (shelf: string) => {
    if (!liveMode) return [];
    return parts.filter((p) => {
      const loc = (p.bin_location || "").toUpperCase();
      return loc.includes(`-${shelf}`);
    });
  };

  const occupiedBins = shelves.reduce((count, shelf) => {
    for (let b = 1; b <= container.binsPerShelf; b++) {
      if (getPartAtBin(`${shelf}${b}`)) count++;
    }
    return count;
  }, 0);

  const totalBins = shelves.length * container.binsPerShelf;
  const occupancyPct = totalBins > 0 ? Math.round((occupiedBins / totalBins) * 100) : 0;

  const entryTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      "end-single": "Single End Door",
      "end-double": "Double Cargo Doors",
      "side-door": "Side Personnel Door",
      "cage-front": "Open Cage Front",
      "roll-up": "Roll-Up Door",
    };
    return map[type] || type;
  };

  return (
    <div className="space-y-4">
      {/* Container Header Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: container.color }}
            >
              {container.id}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{container.label}</CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs font-mono">{container.zone}</Badge>
                <span className="text-xs text-muted-foreground">{container.containerType}</span>
                <Badge variant="secondary" className="text-xs">{container.accessFrequency} access</Badge>
                {liveMode && (
                  <Badge variant="default" className="text-xs">{parts.length} parts mapped</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Info Grid: Physical Dimensions, Environment, Entry, Rules */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Physical Dimensions */}
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">Physical Size</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>External: {dim.externalLengthM}m × {dim.externalWidthM}m × {dim.externalHeightM}m</p>
              <p>Internal: {dim.internalLengthM}m × {dim.internalWidthM}m × {dim.internalHeightM}m</p>
              <p>Floor area: {getContainerAreaM2(container)} m²</p>
              <p>Racking area: {getRackingAreaM2(container)} m²</p>
            </div>
          </CardContent>
        </Card>

        {/* Shelf & Bin Specs */}
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium">Shelf & Bin Specs</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{shelves.length} shelves × {container.binsPerShelf} bins = {totalBins} locations</p>
              <p>Shelf height: {container.shelfHeightCm} cm</p>
              <p>Bin size: {container.binWidthCm} × {container.binDepthCm} cm (W×D)</p>
              <p>Max item weight: {container.maxItemWeightKg} kg</p>
              <p>Aisle width: {dim.aisleWidthCm} cm</p>
            </div>
          </CardContent>
        </Card>

        {/* Entry Points */}
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <DoorOpen className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">Entry Points</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1.5">
              {container.entryPoints.map((ep, i) => (
                <div key={i}>
                  <p className="font-medium text-foreground">{entryTypeLabel(ep.type)} ({ep.widthCm} cm)</p>
                  <p>{ep.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth & Capacity */}
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">Height Envelope</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Bottom shelf: {container.bottomShelfHeightCm} cm from floor</p>
              <p>Top shelf max: {container.topShelfMaxHeightCm} cm</p>
              <p>Growth allowance: {container.growthAllowance}</p>
              {liveMode && (
                <p className="text-foreground font-medium">
                  Occupancy: {occupancyPct}% ({occupiedBins}/{totalBins})
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SVG Cross-Section with to-scale rendering */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Container Cross-Section — {container.id} (Front View, To Scale)</CardTitle>
          <p className="text-xs text-muted-foreground">
            Internal: {dim.internalLengthM}m wide × {dim.internalHeightM}m tall · Racking depth: {dim.rackingDepthCm}cm · Aisle: {dim.aisleWidthCm}cm
          </p>
        </CardHeader>
        <CardContent>
          <ContainerCrossSectionSVG container={container} getPartAtBin={getPartAtBin} liveMode={liveMode} onBinClick={setSelectedBin} />
        </CardContent>
      </Card>

      {/* Top-Down Plan View */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Container Plan View — {container.id} (Top Down)</CardTitle>
          <p className="text-xs text-muted-foreground">
            Showing racking on both sides, aisle, and entry point
          </p>
        </CardHeader>
        <CardContent>
          <ContainerPlanViewSVG container={container} />
        </CardContent>
      </Card>

      {/* Bin Location Grid */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bin Location Grid</CardTitle>
          <p className="text-xs text-muted-foreground">
            Location format: {container.id}-{container.zoneCode}-[Shelf][Bin] · Bin size: {container.binWidthCm}cm W × {container.binDepthCm}cm D × {container.shelfHeightCm}cm H
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-1">
              <div className="w-12 text-xs font-medium text-muted-foreground text-center">Shelf</div>
              {Array.from({ length: container.binsPerShelf }, (_, i) => (
                <div key={i} className="flex-1 text-center text-xs font-mono text-muted-foreground">{i + 1}</div>
              ))}
              {liveMode && <div className="w-16 text-center text-xs font-medium text-muted-foreground">Parts</div>}
            </div>

            <TooltipProvider>
              {[...shelves].reverse().map((shelf) => {
                const shelfParts = getPartsOnShelf(shelf);
                const shelfIdx = shelves.indexOf(shelf);
                const heightFromFloor = container.bottomShelfHeightCm + shelfIdx * container.shelfHeightCm;

                return (
                  <div key={shelf} className="flex gap-1">
                    <div className="w-12 flex flex-col items-center justify-center text-xs bg-muted rounded">
                      <span className="font-bold text-foreground">{shelf}</span>
                      <span className="text-[9px] text-muted-foreground">{heightFromFloor}cm</span>
                    </div>
                    {Array.from({ length: container.binsPerShelf }, (_, binIdx) => {
                      const binId = `${shelf}${binIdx + 1}`;
                      const part = getPartAtBin(binId);
                      const locationCode = `${container.id}-${container.zoneCode}-${binId}`;

                      return (
                        <Tooltip key={binId}>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex-1 h-14 rounded border text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
                                part ? "border-primary/40 bg-primary/10 hover:bg-primary/20" : "border-border bg-muted/30 hover:bg-muted/60"
                              }`}
                              onClick={() => setSelectedBin(binId)}
                            >
                              <span className="text-[10px] font-mono text-muted-foreground">{binId}</span>
                              {part ? (
                                <div className="w-2 h-2 rounded-full bg-primary mt-0.5" />
                              ) : (
                                <div className="w-2 h-2 rounded-full border border-dashed border-muted-foreground/30 mt-0.5" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-mono font-bold text-xs">{locationCode}</p>
                              <p className="text-[10px] text-muted-foreground">
                                Size: {container.binWidthCm}cm × {container.binDepthCm}cm × {container.shelfHeightCm}cm
                              </p>
                              <p className="text-[10px] text-muted-foreground">Height from floor: {heightFromFloor}cm</p>
                              {part ? (
                                <>
                                  <p className="text-xs">{part.description}</p>
                                  {part.part_number && <p className="text-xs text-muted-foreground">PN: {part.part_number}</p>}
                                </>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">Empty bin — available</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                    {liveMode && (
                      <div className="w-16 flex items-center justify-center text-xs text-muted-foreground bg-muted/20 rounded">
                        {shelfParts.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </TooltipProvider>

            {/* Height legend */}
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <ArrowDown className="w-3 h-3" />
              <span>Floor level · Bottom shelf at {container.bottomShelfHeightCm}cm · Top shelf at {container.bottomShelfHeightCm + (shelves.length - 1) * container.shelfHeightCm}cm</span>
            </div>
          </div>

          {liveMode && parts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {parts.filter((p) => !p.bin_location).length} parts without bin location assignments
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Environment & Requirements */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-medium">Environment</span>
            </div>
            <p className="text-xs text-muted-foreground">{container.environment}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium">Special Requirements</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {container.specialRequirements.map((req, i) => (
                <li key={i}>• {req}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Stocking Categories */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Approved Stocking Categories</CardTitle>
          <p className="text-xs text-muted-foreground">What should be stored in {container.id} — {container.label}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {container.stockingCategories.map((cat) => (
              <div key={cat.name} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                >
                  {expandedCategory === cat.name ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  <span className="text-xs font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{cat.items.length} items</span>
                </button>
                {expandedCategory === cat.name && (
                  <div className="px-3 pb-2 pl-8">
                    <div className="flex flex-wrap gap-1">
                      {cat.items.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] border border-border bg-muted/50 text-muted-foreground">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bin Detail Dialog */}
      {selectedBin && (
        <BinDetailDialog
          isOpen={!!selectedBin}
          onClose={() => setSelectedBin(null)}
          container={container}
          binId={selectedBin}
          parts={getPartsAtBin(selectedBin)}
        />
      )}
    </div>
  );
};

/* ============ SVG Cross-Section (Front View, To Scale) ============ */

interface CrossSectionProps {
  container: StoreContainer;
  getPartAtBin: (binId: string) => any;
  liveMode: boolean;
  onBinClick?: (binId: string) => void;
}

const ContainerCrossSectionSVG = ({ container, getPartAtBin, liveMode, onBinClick }: CrossSectionProps) => {
  const shelves = container.shelves;
  const bins = container.binsPerShelf;
  const dim = container.physicalDimensions;

  // Scale: 1m = 100px for readable SVG
  const scale = 80;
  const internalW = dim.internalLengthM * scale;
  const internalH = dim.internalHeightM * scale;
  const wallThickness = 8;
  const padding = 50;

  const svgW = internalW + wallThickness * 2 + padding * 2;
  const svgH = internalH + wallThickness * 2 + padding * 2 + 30;

  const containerLeft = padding + wallThickness;
  const containerBottom = padding + wallThickness + internalH;
  const containerTop = padding + wallThickness;

  // Shelf positions from bottom
  const getShelfY = (shelfIdx: number) => {
    const heightCm = container.bottomShelfHeightCm + shelfIdx * container.shelfHeightCm;
    const heightPx = (heightCm / (dim.internalHeightM * 100)) * internalH;
    return containerBottom - heightPx;
  };

  const binWidthPx = (internalW - 10) / bins;
  const shelfHeightPx = (container.shelfHeightCm / (dim.internalHeightM * 100)) * internalH;

  // Entry point rendering
  const entry = container.entryPoints[0];
  const entryWidthPx = entry ? (entry.widthCm / (dim.internalLengthM * 100)) * internalW : 0;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: "450px", minWidth: "500px" }}>
        {/* Container shell */}
        <rect x={padding} y={padding} width={internalW + wallThickness * 2} height={internalH + wallThickness * 2} fill="none" stroke={container.color} strokeWidth="3" rx="4" opacity={0.6} />

        {/* Walls */}
        <rect x={padding} y={padding} width={wallThickness} height={internalH + wallThickness * 2} fill={container.color} opacity={0.2} rx="2" />
        <rect x={padding + wallThickness + internalW} y={padding} width={wallThickness} height={internalH + wallThickness * 2} fill={container.color} opacity={0.2} rx="2" />

        {/* Ceiling */}
        <rect x={padding} y={padding} width={internalW + wallThickness * 2} height={wallThickness} fill={container.color} opacity={0.15} />

        {/* Floor */}
        <rect x={padding} y={containerBottom} width={internalW + wallThickness * 2} height={wallThickness} fill="hsl(var(--muted))" />

        {/* Entry point indicator */}
        {entry && (
          <g>
            {entry.side === "front" ? (
              <>
                <rect x={containerLeft + (internalW - entryWidthPx) / 2} y={containerBottom - 2} width={entryWidthPx} height={wallThickness + 4} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 2" />
                <text x={containerLeft + internalW / 2} y={containerBottom + wallThickness + 14} textAnchor="middle" fontSize="8" fill="hsl(var(--primary))" fontWeight="600">
                  ▲ ENTRY ({entry.widthCm}cm) — {entryTypeLabel(entry.type)}
                </text>
              </>
            ) : (
              <>
                <rect x={padding + internalW + wallThickness - 2} y={containerTop + (internalH - entryWidthPx) / 2} width={wallThickness + 4} height={entryWidthPx} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 2" />
                <text x={padding + internalW + wallThickness * 2 + 5} y={containerTop + internalH / 2} fontSize="8" fill="hsl(var(--primary))" fontWeight="600" transform={`rotate(90, ${padding + internalW + wallThickness * 2 + 5}, ${containerTop + internalH / 2})`}>
                  ENTRY ({entry.widthCm}cm)
                </text>
              </>
            )}
          </g>
        )}

        {/* Height dimension line (left) */}
        <line x1={padding - 15} y1={containerTop} x2={padding - 15} y2={containerBottom} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <line x1={padding - 20} y1={containerTop} x2={padding - 10} y2={containerTop} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <line x1={padding - 20} y1={containerBottom} x2={padding - 10} y2={containerBottom} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <text x={padding - 18} y={containerTop + internalH / 2} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))" transform={`rotate(-90, ${padding - 18}, ${containerTop + internalH / 2})`}>
          {dim.internalHeightM}m ({Math.round(dim.internalHeightM * 100)}cm)
        </text>

        {/* Width dimension line (top) */}
        <line x1={containerLeft} y1={padding - 10} x2={containerLeft + internalW} y2={padding - 10} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <line x1={containerLeft} y1={padding - 15} x2={containerLeft} y2={padding - 5} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <line x1={containerLeft + internalW} y1={padding - 15} x2={containerLeft + internalW} y2={padding - 5} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <text x={containerLeft + internalW / 2} y={padding - 15} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))">
          {dim.internalLengthM}m ({Math.round(dim.internalLengthM * 100)}cm)
        </text>

        {/* Shelves and bins */}
        {shelves.map((shelf, shelfIdx) => {
          const y = getShelfY(shelfIdx);
          const heightFromFloor = container.bottomShelfHeightCm + shelfIdx * container.shelfHeightCm;

          return (
            <g key={shelf}>
              {/* Shelf bar */}
              <rect x={containerLeft + 2} y={y - 3} width={internalW - 4} height={3} fill={container.color} opacity={0.5} rx="1" />

              {/* Shelf supports (uprights) */}
              <rect x={containerLeft + 2} y={y - shelfHeightPx} width={3} height={shelfHeightPx} fill={container.color} opacity={0.15} rx="1" />
              <rect x={containerLeft + internalW - 5} y={y - shelfHeightPx} width={3} height={shelfHeightPx} fill={container.color} opacity={0.15} rx="1" />

              {/* Shelf label */}
              <text x={containerLeft - 8} y={y - shelfHeightPx / 2 + 4} textAnchor="end" fontSize="10" fontWeight="700" fill="hsl(var(--foreground))">
                {shelf}
              </text>

              {/* Height from floor annotation */}
              <text x={containerLeft + internalW + 12} y={y} textAnchor="start" fontSize="7" fill="hsl(var(--muted-foreground))">
                {heightFromFloor}cm
              </text>

              {/* Bins */}
              {Array.from({ length: bins }, (_, binIdx) => {
                const binId = `${shelf}${binIdx + 1}`;
                const part = getPartAtBin(binId);
                const bx = containerLeft + 5 + binIdx * binWidthPx;
                const binH = shelfHeightPx - 8;

                return (
                  <g key={binId} style={{ cursor: "pointer" }} onClick={() => onBinClick?.(binId)}>
                    <rect
                      x={bx + 1}
                      y={y - binH - 3}
                      width={binWidthPx - 3}
                      height={binH}
                      fill={part ? container.bgColor : "hsl(var(--muted))"}
                      stroke={part ? container.color : "hsl(var(--border))"}
                      strokeWidth={part ? 1.5 : 0.5}
                      rx="2"
                      opacity={part ? 1 : 0.4}
                    />
                    <text x={bx + binWidthPx / 2} y={y - binH + 10} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="hsl(var(--muted-foreground))">
                      {binId}
                    </text>

                    {/* Bin dimensions annotation (only first bin of first shelf) */}
                    {shelfIdx === 0 && binIdx === 0 && (
                      <>
                        <line x1={bx + 1} y1={y + 5} x2={bx + binWidthPx - 2} y2={y + 5} stroke="hsl(var(--primary))" strokeWidth="0.5" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
                        <text x={bx + binWidthPx / 2} y={y + 13} textAnchor="middle" fontSize="6" fill="hsl(var(--primary))">
                          {container.binWidthCm}cm
                        </text>
                      </>
                    )}

                    {part && (
                      <>
                        <rect x={bx + 4} y={y - binH + 16} width={binWidthPx - 10} height={binH * 0.4} fill={container.color} opacity={0.3} rx="2" />
                        <text x={bx + binWidthPx / 2} y={y - binH + 16 + binH * 0.25} textAnchor="middle" fontSize="5" fill="hsl(var(--foreground))" fontWeight="500">
                          {(part.part_number || part.description || "").slice(0, 10)}
                        </text>
                      </>
                    )}

                    {!part && liveMode && (
                      <text x={bx + binWidthPx / 2} y={y - binH / 2} textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))" opacity={0.4}>
                        empty
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Shelf height dimension (right side, between two shelves) */}
        {shelves.length >= 2 && (
          <g>
            <line x1={containerLeft + internalW + 25} y1={getShelfY(0)} x2={containerLeft + internalW + 25} y2={getShelfY(1)} stroke="hsl(var(--primary))" strokeWidth="0.5" />
            <line x1={containerLeft + internalW + 20} y1={getShelfY(0)} x2={containerLeft + internalW + 30} y2={getShelfY(0)} stroke="hsl(var(--primary))" strokeWidth="0.5" />
            <line x1={containerLeft + internalW + 20} y1={getShelfY(1)} x2={containerLeft + internalW + 30} y2={getShelfY(1)} stroke="hsl(var(--primary))" strokeWidth="0.5" />
            <text x={containerLeft + internalW + 33} y={(getShelfY(0) + getShelfY(1)) / 2 + 3} fontSize="7" fill="hsl(var(--primary))">
              {container.shelfHeightCm}cm
            </text>
          </g>
        )}

        {/* Arrowhead marker */}
        <defs>
          <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="hsl(var(--primary))" />
          </marker>
        </defs>

        {/* Container ID */}
        <rect x={containerLeft} y={containerBottom + wallThickness + 4} width={50} height={16} fill={container.color} rx="4" />
        <text x={containerLeft + 25} y={containerBottom + wallThickness + 15} textAnchor="middle" fontSize="9" fill="white" fontWeight="700" fontFamily="monospace">
          {container.id}
        </text>
        <text x={containerLeft + 60} y={containerBottom + wallThickness + 15} fontSize="8" fill="hsl(var(--muted-foreground))">
          {container.zone} — {container.label} · Max {container.maxItemWeightKg}kg/item
        </text>
      </svg>
    </div>
  );
};

const entryTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    "end-single": "Single End Door",
    "end-double": "Double Cargo Doors",
    "side-door": "Side Personnel Door",
    "cage-front": "Open Cage Front",
    "roll-up": "Roll-Up Door",
  };
  return map[type] || type;
};

/* ============ Top-Down Plan View SVG ============ */

const ContainerPlanViewSVG = ({ container }: { container: StoreContainer }) => {
  const dim = container.physicalDimensions;
  const scale = 80; // 1m = 80px
  const padding = 40;

  const intW = dim.internalLengthM * scale;
  const intD = dim.internalWidthM * scale;
  const wallT = 6;

  const svgW = intW + wallT * 2 + padding * 2;
  const svgH = intD + wallT * 2 + padding * 2 + 20;

  const cLeft = padding + wallT;
  const cTop = padding + wallT;

  const aisleWidthPx = (dim.aisleWidthCm / (dim.internalWidthM * 100)) * intD;
  const rackDepthPx = (dim.rackingDepthCm / (dim.internalWidthM * 100)) * intD;

  const entry = container.entryPoints[0];
  const entryWidthPx = entry ? (entry.widthCm / (dim.internalLengthM * 100)) * intW : 0;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: "250px", minWidth: "400px" }}>
        {/* Container walls */}
        <rect x={padding} y={padding} width={intW + wallT * 2} height={intD + wallT * 2} fill="none" stroke={container.color} strokeWidth="2" rx="3" opacity={0.6} />

        {/* Left rack */}
        <rect x={cLeft + 2} y={cTop + 2} width={intW - 4} height={rackDepthPx} fill={container.bgColor} stroke={container.color} strokeWidth="1" rx="2" opacity={0.6} />
        <text x={cLeft + intW / 2} y={cTop + rackDepthPx / 2 + 3} textAnchor="middle" fontSize="8" fill={container.color} fontWeight="600">
          RACKING — {container.shelves.length} shelves × {container.binsPerShelf} bins ({dim.rackingDepthCm}cm deep)
        </text>

        {/* Right rack (if wide enough for dual racking) */}
        {dim.internalWidthM > 2 && (
          <>
            <rect x={cLeft + 2} y={cTop + intD - rackDepthPx - 2} width={intW - 4} height={rackDepthPx} fill={container.bgColor} stroke={container.color} strokeWidth="1" rx="2" opacity={0.6} />
            <text x={cLeft + intW / 2} y={cTop + intD - rackDepthPx / 2 + 3} textAnchor="middle" fontSize="8" fill={container.color} fontWeight="600">
              RACKING (opposite side)
            </text>
          </>
        )}

        {/* Aisle */}
        <rect x={cLeft + 2} y={cTop + rackDepthPx + 4} width={intW - 4} height={aisleWidthPx - 8} fill="hsl(var(--muted))" rx="2" opacity={0.4} />
        <text x={cLeft + intW / 2} y={cTop + rackDepthPx + aisleWidthPx / 2 + 2} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))">
          AISLE ({dim.aisleWidthCm}cm)
        </text>

        {/* Entry point */}
        {entry && entry.side === "front" && (
          <>
            <rect x={cLeft + (intW - entryWidthPx) / 2} y={padding + intD + wallT - 2} width={entryWidthPx} height={wallT + 6} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 2" />
            <text x={cLeft + intW / 2} y={padding + intD + wallT * 2 + 10} textAnchor="middle" fontSize="8" fill="hsl(var(--primary))" fontWeight="600">
              ▼ ENTRY ({entry.widthCm}cm)
            </text>
          </>
        )}
        {entry && entry.side === "right" && (
          <>
            <rect x={padding + intW + wallT - 2} y={cTop + (intD - entryWidthPx) / 2} width={wallT + 6} height={entryWidthPx} fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4 2" />
            <text x={padding + intW + wallT * 2 + 10} y={cTop + intD / 2 + 3} fontSize="8" fill="hsl(var(--primary))" fontWeight="600">
              ENTRY →
            </text>
          </>
        )}

        {/* Width dimension */}
        <text x={cLeft + intW / 2} y={padding - 8} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))">
          {dim.internalLengthM}m
        </text>
        {/* Depth dimension */}
        <text x={padding - 8} y={cTop + intD / 2} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" transform={`rotate(-90, ${padding - 8}, ${cTop + intD / 2})`}>
          {dim.internalWidthM}m
        </text>
      </svg>
    </div>
  );
};
