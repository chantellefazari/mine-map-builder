import { useState } from "react";
import { STORE_CONTAINERS, LAYOUT_ZONE_GROUPS, YARD_DIMENSIONS, type StoreContainer } from "./storeLayoutData";
import { ContainerDetail2D } from "./ContainerDetail2D";
import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoriesForContainer, getContainerMappingSummary } from "@/utils/categoryContainerMapping";

interface StoreLayout2DProps {
  liveMode: boolean;
  sparesData?: Array<{
    id: string;
    description: string;
    bin_location: string | null;
    warehouse_area: string | null;
    category: string | null;
    part_number: string | null;
  }>;
}

export const StoreLayout2D = ({ liveMode, sparesData = [] }: StoreLayout2DProps) => {
  const [selectedContainer, setSelectedContainer] = useState<StoreContainer | null>(null);
  const [showCategoryLegend, setShowCategoryLegend] = useState(false);

  const getPartsCount = (container: StoreContainer) => {
    if (!liveMode || !sparesData.length) return null;
    return sparesData.filter((s) => {
      const bin = (s.bin_location || "").toUpperCase();
      return bin.startsWith(container.id);
    }).length;
  };

  const getPartsForContainer = (container: StoreContainer) => {
    if (!sparesData.length) return [];
    return sparesData.filter((s) => {
      const bin = (s.bin_location || "").toUpperCase();
      return bin.startsWith(container.id);
    });
  };

  if (selectedContainer) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedContainer(null)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Floor Plan
        </Button>
        <ContainerDetail2D
          container={selectedContainer}
          parts={liveMode ? getPartsForContainer(selectedContainer) : []}
          liveMode={liveMode}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Zone Legend + Category Toggle */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {LAYOUT_ZONE_GROUPS.map((group) => (
          <div key={group.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border"
              style={{ backgroundColor: group.bgColor, borderColor: group.color }}
            />
            <span className="text-muted-foreground">{group.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={showCategoryLegend ? "default" : "outline"}
            size="sm"
            className="h-7 px-2.5 text-xs gap-1.5"
            onClick={() => setShowCategoryLegend(!showCategoryLegend)}
          >
            <Layers className="w-3.5 h-3.5" />
            Categories
          </Button>
          <span className="text-muted-foreground italic hidden sm:inline">Click a container for detail</span>
        </div>
      </div>

      {/* Category Legend Panel */}
      {showCategoryLegend && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Container → Category Mapping
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STORE_CONTAINERS.map((container) => {
              const categories = getCategoriesForContainer(container.id);
              return (
                <div
                  key={container.id}
                  className="flex gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  style={{ borderColor: container.borderColor + "60" }}
                  onClick={() => setSelectedContainer(container)}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: container.color }}
                    >
                      {container.id}
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground mt-0.5">{container.zoneCode}</div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{container.label}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {categories.length > 0 ? categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-block px-1.5 py-0.5 text-[10px] rounded-sm font-medium"
                          style={{ backgroundColor: container.bgColor, color: container.color }}
                        >
                          {cat}
                        </span>
                      )) : (
                        <span className="text-[10px] text-muted-foreground italic">Default catch-all</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Uncategorised / "General" items default to C03 (Mechanical). Click a container to view interior.
          </p>
        </div>
      )}

      {/* SVG Floor Plan */}
      <FloorPlanSVG
        liveMode={liveMode}
        getPartsCount={getPartsCount}
        onContainerClick={setSelectedContainer}
      />
    </div>
  );
};

/* ============ Floor Plan SVG Component ============ */

interface FloorPlanSVGProps {
  liveMode: boolean;
  getPartsCount: (container: StoreContainer) => number | null;
  onContainerClick: (container: StoreContainer) => void;
}

const FloorPlanSVG = ({ liveMode, getPartsCount, onContainerClick }: FloorPlanSVGProps) => {
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <svg viewBox="0 0 620 740" className="w-full h-auto" style={{ maxHeight: "750px" }}>
        {/* Background */}
        <rect x="0" y="0" width="620" height="740" fill="hsl(var(--card))" />

        {/* Access Road */}
        <rect x="0" y="375" width="620" height="20" fill="hsl(var(--muted))" rx="2" />
        <text x="300" y="389" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))" fontWeight="500">
          ACCESS ROAD / WALKWAY ({YARD_DIMENSIONS.accessRoadWidthM}m wide)
        </text>

        {/* Walkway between clean and mechanical */}
        <rect x="0" y="185" width="620" height="20" fill="hsl(var(--muted))" rx="2" />
        <text x="300" y="199" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          WALKWAY ({YARD_DIMENSIONS.walkwayWidthM}m)
        </text>

        {/* Entry Arrow */}
        <polygon points="600,690 620,675 600,660" fill="hsl(var(--primary))" opacity="0.5" />
        <text x="580" y="680" textAnchor="end" fontSize="10" fill="hsl(var(--primary))" fontWeight="600">
          ENTRY →
        </text>

        {/* Zone Groups */}
        {LAYOUT_ZONE_GROUPS.map((group) => (
          <g key={group.id}>
            <rect
              x={group.position.x} y={group.position.y} width={group.position.width} height={group.position.height}
              fill={group.bgColor} stroke={group.color} strokeWidth="1" strokeDasharray="4 2" rx="6"
            />
            <text x={group.position.x + 8} y={group.position.y + 14} fontSize="9" fill={group.color} fontWeight="600">
              {group.label.toUpperCase()}
            </text>
            <text x={group.position.x + 8} y={group.position.y + 26} fontSize="8" fill={group.color} opacity="0.7">
              {group.description}
            </text>
          </g>
        ))}

        {/* Containers */}
        {STORE_CONTAINERS.map((container) => {
          const partsCount = getPartsCount(container);
          const totalBins = container.shelves.length * container.binsPerShelf;
          const dim = container.physicalDimensions;
          const entry = container.entryPoints[0];

          return (
            <g key={container.id} className="cursor-pointer" onClick={() => onContainerClick(container)}>
              {/* Container body */}
              <rect
                x={container.position.x} y={container.position.y} width={container.width} height={container.height}
                fill={container.bgColor} stroke={container.borderColor} strokeWidth="2" rx="6"
                className="transition-all duration-200 hover:opacity-80"
              />

              {/* Container ID badge */}
              <rect x={container.position.x + 4} y={container.position.y + 4} width="36" height="18" fill={container.color} rx="4" />
              <text x={container.position.x + 22} y={container.position.y + 16} textAnchor="middle" fontSize="9" fill="white" fontWeight="700" fontFamily="monospace">
                {container.id}
              </text>

              {/* Container label */}
              <text x={container.position.x + container.width / 2} y={container.position.y + 36} textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))" fontWeight="600">
                {container.shortLabel}
              </text>

              {/* Physical dimensions */}
              <text x={container.position.x + container.width / 2} y={container.position.y + 50} textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="monospace">
                {dim.externalLengthM}m × {dim.externalWidthM}m × {dim.externalHeightM}m
              </text>

              {/* Mini shelf preview */}
              {container.shelves.slice(0, 4).map((shelf, idx) => {
                const y = container.position.y + 56 + idx * 5;
                const x = container.position.x + container.width / 2 - 25;
                return (
                  <g key={shelf}>
                    <rect x={x} y={y} width={50} height={3} fill={container.color} opacity={0.2} rx="1" />
                    {Array.from({ length: Math.min(container.binsPerShelf, 6) }, (_, i) => (
                      <rect key={i} x={x + i * (50 / Math.min(container.binsPerShelf, 6))} y={y} width={1} height={3} fill={container.color} opacity={0.3} />
                    ))}
                  </g>
                );
              })}

              {/* Bin/shelf info */}
              <text x={container.position.x + container.width / 2} y={container.position.y + 86} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))">
                {container.shelves.length} shelves × {container.binsPerShelf} bins = {totalBins} · {container.shelfHeightCm}cm H
              </text>

              {/* Entry point indicator */}
              {entry && (
                <g>
                  {entry.side === "front" && (
                    <>
                      <rect
                        x={container.position.x + container.width / 2 - 18}
                        y={container.position.y + container.height - 3}
                        width={36} height={6}
                        fill="hsl(var(--primary))" opacity={0.3} rx="2"
                      />
                      <text x={container.position.x + container.width / 2} y={container.position.y + container.height + 10} textAnchor="middle" fontSize="6" fill="hsl(var(--primary))">
                        ▲ {entry.type.replace(/-/g, " ")} ({entry.widthCm}cm)
                      </text>
                    </>
                  )}
                  {entry.side === "right" && (
                    <>
                      <rect
                        x={container.position.x + container.width - 3}
                        y={container.position.y + container.height / 2 - 12}
                        width={6} height={24}
                        fill="hsl(var(--primary))" opacity={0.3} rx="2"
                      />
                      <text
                        x={container.position.x + container.width + 8}
                        y={container.position.y + container.height / 2 + 3}
                        fontSize="6" fill="hsl(var(--primary))"
                      >
                        → Entry
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* Access frequency */}
              <text x={container.position.x + container.width / 2} y={container.position.y + 96} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" opacity={0.7}>
                {container.accessFrequency} access · Aisle {dim.aisleWidthCm}cm
              </text>

              {/* Parts count (live mode) */}
              {liveMode && partsCount !== null && (
                <>
                  <rect x={container.position.x + container.width - 50} y={container.position.y + 4} width="46" height="18" fill={partsCount > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} rx="9" />
                  <text x={container.position.x + container.width - 27} y={container.position.y + 16} textAnchor="middle" fontSize="8" fill={partsCount > 0 ? "white" : "hsl(var(--muted-foreground))"} fontWeight="600">
                    {partsCount} parts
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Yard dimensions */}
        <text x="310" y="730" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))" fontWeight="500">
          TCMG STORES YARD — {YARD_DIMENSIONS.totalWidthM}m × {YARD_DIMENSIONS.totalDepthM}m · Container spacing: {YARD_DIMENSIONS.containerSpacingM}m
        </text>
      </svg>
    </div>
  );
};
