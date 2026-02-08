import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBinsForContainer, type StoreContainer } from "./storeLayoutData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, Wind, ShieldAlert, TrendingUp, Clock, Package, ChevronDown, ChevronRight } from "lucide-react";

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

  // Map parts to bin locations
  const getPartAtBin = (binId: string) => {
    if (!liveMode || !parts.length) return null;
    const locationCode = `${container.id}-${container.zoneCode}-${binId}`;
    return parts.find((p) => {
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
                <Badge variant="outline" className="text-xs font-mono">
                  {container.zone}
                </Badge>
                <span className="text-xs text-muted-foreground">{container.containerType}</span>
                <Badge variant="secondary" className="text-xs">
                  {container.accessFrequency} access
                </Badge>
                {liveMode && (
                  <Badge variant="default" className="text-xs">
                    {parts.length} parts mapped
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Info Grid: Environment, Specs, Rules */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <Package className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">Dimensions</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {container.shelves.length} shelves × {container.binsPerShelf} bins = {totalBins} locations
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Shelf height: {container.shelfHeightCm}cm · Bin width: {container.binWidthCm}cm
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">Growth & Capacity</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Growth allowance: {container.growthAllowance}
            </p>
            {liveMode && (
              <p className="text-xs text-muted-foreground mt-1">
                Occupancy: {occupancyPct}% ({occupiedBins}/{totalBins} bins)
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium">Requirements</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {container.specialRequirements.slice(0, 3).map((req, i) => (
                <li key={i}>• {req}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* SVG Container Cross-Section */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Container Cross-Section — {container.id}</CardTitle>
          <p className="text-xs text-muted-foreground">Front view showing shelves and bin positions. Max item weight: {container.maxItemWeightKg} kg</p>
        </CardHeader>
        <CardContent>
          <ContainerCrossSectionSVG
            container={container}
            getPartAtBin={getPartAtBin}
            liveMode={liveMode}
          />
        </CardContent>
      </Card>

      {/* Shelf/Bin Detail Grid */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Bin Location Grid</CardTitle>
          <p className="text-xs text-muted-foreground">
            Click any bin for details · Location format: {container.id}-{container.zoneCode}-[Shelf][Bin]
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Header row */}
            <div className="flex gap-1">
              <div className="w-12 text-xs font-medium text-muted-foreground text-center">Shelf</div>
              {Array.from({ length: container.binsPerShelf }, (_, i) => (
                <div key={i} className="flex-1 text-center text-xs font-mono text-muted-foreground">
                  {i + 1}
                </div>
              ))}
              {liveMode && (
                <div className="w-16 text-center text-xs font-medium text-muted-foreground">Parts</div>
              )}
            </div>

            {/* Shelf rows */}
            <TooltipProvider>
              {shelves.map((shelf) => {
                const shelfParts = getPartsOnShelf(shelf);
                return (
                  <div key={shelf} className="flex gap-1">
                    <div className="w-12 flex items-center justify-center text-xs font-bold text-foreground bg-muted rounded">
                      {shelf}
                    </div>
                    {Array.from({ length: container.binsPerShelf }, (_, binIdx) => {
                      const binId = `${shelf}${binIdx + 1}`;
                      const part = getPartAtBin(binId);
                      const locationCode = `${container.id}-${container.zoneCode}-${binId}`;

                      return (
                        <Tooltip key={binId}>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex-1 h-14 rounded border text-center flex flex-col items-center justify-center cursor-default transition-colors ${
                                part
                                  ? "border-primary/40 bg-primary/10"
                                  : "border-border bg-muted/30 hover:bg-muted/50"
                              }`}
                            >
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {binId}
                              </span>
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
                              {part ? (
                                <>
                                  <p className="text-xs">{part.description}</p>
                                  {part.part_number && (
                                    <p className="text-xs text-muted-foreground">PN: {part.part_number}</p>
                                  )}
                                  {part.category && (
                                    <p className="text-xs text-muted-foreground">Category: {part.category}</p>
                                  )}
                                </>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">Empty bin — available for stocking</p>
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
          </div>

          {/* Unmapped parts */}
          {liveMode && parts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {parts.filter((p) => !p.bin_location).length} parts without bin location assignments
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stocking Categories */}
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Approved Stocking Categories</CardTitle>
          <p className="text-xs text-muted-foreground">
            What should be stored in {container.id} — {container.label}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {container.stockingCategories.map((cat) => (
              <div key={cat.name} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                >
                  {expandedCategory === cat.name ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span className="text-xs font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{cat.items.length} items</span>
                </button>
                {expandedCategory === cat.name && (
                  <div className="px-3 pb-2 pl-8">
                    <div className="flex flex-wrap gap-1">
                      {cat.items.map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] border border-border bg-muted/50 text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ============ SVG Cross-Section ============ */

interface CrossSectionProps {
  container: StoreContainer;
  getPartAtBin: (binId: string) => any;
  liveMode: boolean;
}

const ContainerCrossSectionSVG = ({ container, getPartAtBin, liveMode }: CrossSectionProps) => {
  const shelves = container.shelves;
  const bins = container.binsPerShelf;

  // SVG dimensions
  const padding = 40;
  const shelfHeight = 50;
  const binWidth = Math.min(60, Math.max(35, 500 / bins));
  const containerWidth = binWidth * bins + padding * 2;
  const containerHeight = shelfHeight * shelves.length + padding * 2 + 30;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        className="w-full h-auto"
        style={{ maxHeight: "400px", minWidth: "400px" }}
      >
        {/* Container outline */}
        <rect
          x={10}
          y={10}
          width={containerWidth - 20}
          height={containerHeight - 20}
          fill="none"
          stroke={container.color}
          strokeWidth="3"
          rx="8"
          opacity={0.5}
        />

        {/* Container walls - corrugated effect */}
        {[0, 1].map((side) => (
          <rect
            key={side}
            x={side === 0 ? 10 : containerWidth - 18}
            y={10}
            width={8}
            height={containerHeight - 20}
            fill={container.color}
            opacity={0.15}
            rx="2"
          />
        ))}

        {/* Floor */}
        <rect
          x={10}
          y={containerHeight - 28}
          width={containerWidth - 20}
          height={8}
          fill="hsl(var(--muted))"
          rx="2"
        />

        {/* Shelves and bins */}
        {shelves.map((shelf, shelfIdx) => {
          const y = padding + shelfIdx * shelfHeight;

          return (
            <g key={shelf}>
              {/* Shelf bar */}
              <rect
                x={padding - 5}
                y={y + shelfHeight - 4}
                width={binWidth * bins + 10}
                height={4}
                fill={container.color}
                opacity={0.4}
                rx="1"
              />

              {/* Shelf supports */}
              <rect x={padding - 5} y={y + 5} width={3} height={shelfHeight - 5} fill={container.color} opacity={0.2} rx="1" />
              <rect x={padding + binWidth * bins + 2} y={y + 5} width={3} height={shelfHeight - 5} fill={container.color} opacity={0.2} rx="1" />

              {/* Shelf label */}
              <text
                x={padding - 20}
                y={y + shelfHeight / 2 + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="hsl(var(--foreground))"
              >
                {shelf}
              </text>

              {/* Bins */}
              {Array.from({ length: bins }, (_, binIdx) => {
                const binId = `${shelf}${binIdx + 1}`;
                const part = getPartAtBin(binId);
                const bx = padding + binIdx * binWidth;

                return (
                  <g key={binId}>
                    {/* Bin background */}
                    <rect
                      x={bx + 2}
                      y={y + 4}
                      width={binWidth - 4}
                      height={shelfHeight - 10}
                      fill={part ? container.bgColor : "hsl(var(--muted))"}
                      stroke={part ? container.color : "hsl(var(--border))"}
                      strokeWidth={part ? 1.5 : 0.5}
                      rx="3"
                      opacity={part ? 1 : 0.4}
                    />

                    {/* Bin label */}
                    <text
                      x={bx + binWidth / 2}
                      y={y + 18}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="monospace"
                      fill="hsl(var(--muted-foreground))"
                    >
                      {binId}
                    </text>

                    {/* Part indicator */}
                    {part && (
                      <>
                        <rect
                          x={bx + 6}
                          y={y + 24}
                          width={binWidth - 12}
                          height={14}
                          fill={container.color}
                          opacity={0.3}
                          rx="2"
                        />
                        <text
                          x={bx + binWidth / 2}
                          y={y + 34}
                          textAnchor="middle"
                          fontSize="6"
                          fill="hsl(var(--foreground))"
                          fontWeight="500"
                        >
                          {(part.part_number || part.description || "").slice(0, 8)}
                        </text>
                      </>
                    )}

                    {/* Empty indicator */}
                    {!part && liveMode && (
                      <text
                        x={bx + binWidth / 2}
                        y={y + 32}
                        textAnchor="middle"
                        fontSize="6"
                        fill="hsl(var(--muted-foreground))"
                        opacity={0.4}
                      >
                        empty
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Height guide on right */}
        <text
          x={containerWidth - 15}
          y={containerHeight / 2}
          textAnchor="middle"
          fontSize="7"
          fill="hsl(var(--muted-foreground))"
          transform={`rotate(-90, ${containerWidth - 15}, ${containerHeight / 2})`}
        >
          {shelves.length} shelves × {container.shelfHeightCm}cm
        </text>

        {/* Container ID badge */}
        <rect
          x={padding}
          y={containerHeight - 25}
          width={50}
          height={16}
          fill={container.color}
          rx="4"
        />
        <text
          x={padding + 25}
          y={containerHeight - 14}
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="700"
          fontFamily="monospace"
        >
          {container.id}
        </text>

        {/* Zone label */}
        <text
          x={padding + 60}
          y={containerHeight - 14}
          fontSize="8"
          fill="hsl(var(--muted-foreground))"
        >
          {container.zone} — {container.label}
        </text>
      </svg>
    </div>
  );
};
