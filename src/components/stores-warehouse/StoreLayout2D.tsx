import { useState } from "react";
import { STORE_CONTAINERS, LAYOUT_ZONE_GROUPS, YARD_DIMENSIONS, type StoreContainer } from "./storeLayoutData";
import { ContainerDetail2D } from "./ContainerDetail2D";
import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoriesForContainer } from "@/utils/categoryContainerMapping";

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
            Uncategorised items default to C03 (Mechanical). Click a container to view interior.
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
  // Compute SVG dimensions from data
  const svgW = 560;
  const svgH = 480;

  // Dome area
  const domeGroup = LAYOUT_ZONE_GROUPS.find((g) => g.id === "dome");

  // Forklift gap starts after the 40ft container
  const c03 = STORE_CONTAINERS.find((c) => c.id === "C03")!;
  const forkliftX = c03.position.x + c03.width + 5;
  const rightLeg = STORE_CONTAINERS.find((c) => c.id === "C05")!;
  const forkliftW = rightLeg.position.x - forkliftX;

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: "700px" }}>
        {/* Background */}
        <rect x="0" y="0" width={svgW} height={svgH} fill="hsl(var(--card))" />

        {/* Zone Groups (background) */}
        {LAYOUT_ZONE_GROUPS.map((group) => (
          <g key={group.id}>
            <rect
              x={group.position.x} y={group.position.y} width={group.position.width} height={group.position.height}
              fill={group.bgColor} stroke={group.color} strokeWidth="1" strokeDasharray="4 2" rx="6"
            />
            <text x={group.position.x + 8} y={group.position.y + 14} fontSize="9" fill={group.color} fontWeight="600">
              {group.label.toUpperCase()}
            </text>
            {group.id !== "dome" && (
              <text x={group.position.x + 8} y={group.position.y + 26} fontSize="8" fill={group.color} opacity="0.7">
                {group.description}
              </text>
            )}
          </g>
        ))}

        {/* Dome label centered */}
        {domeGroup && (
          <g>
            <text
              x={domeGroup.position.x + domeGroup.position.width / 2}
              y={domeGroup.position.y + domeGroup.position.height / 2 - 10}
              textAnchor="middle" fontSize="14" fill="#22c55e" fontWeight="700" opacity="0.4"
            >
              DOME AREA
            </text>
            <text
              x={domeGroup.position.x + domeGroup.position.width / 2}
              y={domeGroup.position.y + domeGroup.position.height / 2 + 8}
              textAnchor="middle" fontSize="10" fill="#22c55e" opacity="0.35"
            >
              {YARD_DIMENSIONS.courtyardWidthM}m × {YARD_DIMENSIONS.courtyardDepthM}m clear
            </text>
          </g>
        )}

        {/* Forklift Access Path */}
        <rect
          x={forkliftX} y={c03.position.y}
          width={forkliftW} height={c03.height}
          fill="#22c55e" opacity="0.08" rx="4"
        />
        <line
          x1={forkliftX + forkliftW / 2} y1={c03.position.y - 10}
          x2={forkliftX + forkliftW / 2} y2={c03.position.y + c03.height + 15}
          stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.4"
        />
        <text
          x={forkliftX + forkliftW / 2} y={c03.position.y + c03.height + 25}
          textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="600"
        >
          FORKLIFT ACCESS ({YARD_DIMENSIONS.forkliftGapM}m gap)
        </text>

        {/* Containers */}
        {STORE_CONTAINERS.map((container) => {
          const partsCount = getPartsCount(container);
          const totalBins = container.shelves.length * container.binsPerShelf;
          const dim = container.physicalDimensions;
          const isVertical = container.orientation === "vertical";
          const displayW = isVertical ? dim.externalWidthM : dim.externalLengthM;
          const displayD = isVertical ? dim.externalLengthM : dim.externalWidthM;

          return (
            <g key={container.id} className="cursor-pointer" onClick={() => onContainerClick(container)}>
              {/* Container body */}
              <rect
                x={container.position.x} y={container.position.y} width={container.width} height={container.height}
                fill={container.bgColor} stroke={container.borderColor} strokeWidth="2" rx="4"
                className="transition-all duration-200 hover:opacity-80"
              />

              {/* Container ID badge */}
              <rect x={container.position.x + 3} y={container.position.y + 3} width="32" height="16" fill={container.color} rx="3" />
              <text x={container.position.x + 19} y={container.position.y + 14} textAnchor="middle" fontSize="8" fill="white" fontWeight="700" fontFamily="monospace">
                {container.id}
              </text>

              {/* Container label */}
              <text x={container.position.x + container.width / 2} y={container.position.y + container.height / 2 - 4} textAnchor="middle" fontSize={container.width > 100 ? "11" : "9"} fill="hsl(var(--foreground))" fontWeight="600">
                {container.shortLabel}
              </text>

              {/* Physical dimensions */}
              <text x={container.position.x + container.width / 2} y={container.position.y + container.height / 2 + 10} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" fontFamily="monospace">
                {displayW.toFixed(1)}m × {displayD.toFixed(1)}m × {dim.externalHeightM}m
              </text>

              {/* Bin/shelf info */}
              <text x={container.position.x + container.width / 2} y={container.position.y + container.height / 2 + 22} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))">
                {container.shelves.length}S × {container.binsPerShelf}B = {totalBins} bins
              </text>

              {/* Container type */}
              <text x={container.position.x + container.width / 2} y={container.position.y + container.height - 6} textAnchor="middle" fontSize="6" fill="hsl(var(--muted-foreground))" opacity="0.6">
                {container.containerType}
              </text>

              {/* Parts count (live mode) */}
              {liveMode && partsCount !== null && (
                <>
                  <rect x={container.position.x + container.width - 42} y={container.position.y + 3} width="38" height="16" fill={partsCount > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} rx="8" />
                  <text x={container.position.x + container.width - 23} y={container.position.y + 14} textAnchor="middle" fontSize="7" fill={partsCount > 0 ? "white" : "hsl(var(--muted-foreground))"} fontWeight="600">
                    {partsCount} parts
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Yard dimensions label */}
        <text x={svgW / 2} y={svgH - 10} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontWeight="500">
          TCMG STORES YARD — U-Shape · {YARD_DIMENSIONS.totalWidthM}m × {YARD_DIMENSIONS.totalDepthM}m · Courtyard: {YARD_DIMENSIONS.courtyardWidthM}m × {YARD_DIMENSIONS.courtyardDepthM}m
        </text>

        {/* Clearance indicators */}
        <text x={20} y={svgH / 2} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" opacity="0.5" transform={`rotate(-90, 20, ${svgH / 2})`}>
          {YARD_DIMENSIONS.outerClearanceM}m clearance
        </text>
        <text x={svgW - 15} y={svgH / 2} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" opacity="0.5" transform={`rotate(90, ${svgW - 15}, ${svgH / 2})`}>
          {YARD_DIMENSIONS.outerClearanceM}m clearance
        </text>
      </svg>
    </div>
  );
};
