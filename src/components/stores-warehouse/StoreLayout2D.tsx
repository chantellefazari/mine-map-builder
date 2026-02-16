import { useState } from "react";
import { STORE_CONTAINERS, LAYOUT_ZONE_GROUPS, YARD_DIMENSIONS, DOME_DIMENSIONS, LAYDOWN_ZONES, LAYDOWN_ZONE_GROUP, FORKLIFT_LANE, DELIVERY_ZONE, SVG_DIMENSIONS, type StoreContainer, type LaydownZone } from "./storeLayoutData";
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

  const getLDPartsCount = (zone: LaydownZone) => {
    if (!liveMode || !sparesData.length) return null;
    return sparesData.filter((s) => {
      const area = (s.warehouse_area || "").toUpperCase();
      const bin = (s.bin_location || "").toUpperCase();
      return area === "LD" && bin.startsWith(zone.id);
    }).length;
  };

  const getTotalLDCount = () => {
    if (!liveMode || !sparesData.length) return null;
    return sparesData.filter((s) => (s.warehouse_area || "").toUpperCase() === "LD").length;
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
        {/* LD & Delivery legend items */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: LAYDOWN_ZONE_GROUP.bgColor, borderColor: LAYDOWN_ZONE_GROUP.color }} />
          <span className="text-muted-foreground">Laydown (LD)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: FORKLIFT_LANE.bgColor, borderColor: FORKLIFT_LANE.color }} />
          <span className="text-muted-foreground">Forklift</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: DELIVERY_ZONE.bgColor, borderColor: DELIVERY_ZONE.color }} />
          <span className="text-muted-foreground">Delivery</span>
        </div>
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
            Uncategorised items default to C04 (Mechanical Precision). Click a container to view interior.
          </p>
        </div>
      )}

      {/* SVG Floor Plan */}
      <FloorPlanSVG
        liveMode={liveMode}
        getPartsCount={getPartsCount}
        getLDPartsCount={getLDPartsCount}
        getTotalLDCount={getTotalLDCount}
        onContainerClick={setSelectedContainer}
      />
    </div>
  );
};

/* ============ Floor Plan SVG Component ============ */

interface FloorPlanSVGProps {
  liveMode: boolean;
  getPartsCount: (container: StoreContainer) => number | null;
  getLDPartsCount: (zone: LaydownZone) => number | null;
  getTotalLDCount: () => number | null;
  onContainerClick: (container: StoreContainer) => void;
}

const FloorPlanSVG = ({ liveMode, getPartsCount, getLDPartsCount, getTotalLDCount, onContainerClick }: FloorPlanSVGProps) => {
  const svgW = SVG_DIMENSIONS.width;
  const svgH = SVG_DIMENSIONS.height;

   // Dome area
  const domeGroup = LAYOUT_ZONE_GROUPS.find((g) => g.id === "dome");

  const LABEL_MARGIN = 55; // extra space above for callout labels

  // Callout label definitions: position labels outside zones with leader lines
  const zoneCallouts = LAYOUT_ZONE_GROUPS.filter(g => g.id !== "dome").map((group) => {
    const zoneCenter = {
      x: group.position.x + group.position.width / 2,
      y: group.position.y,
    };

    // Position labels above the layout in the margin area
    let labelX: number;
    let labelAnchor: "start" | "middle" | "end" = "middle";

    if (group.id === "left-leg") {
      labelX = group.position.x - 10;
      labelAnchor = "start";
    } else if (group.id === "right-leg") {
      labelX = group.position.x + group.position.width + 10;
      labelAnchor = "end";
    } else {
      // base
      labelX = zoneCenter.x;
      labelAnchor = "middle";
    }

    const labelY = group.id === "base"
      ? group.position.y + group.position.height + 20
      : -LABEL_MARGIN + 16;

    // Leader line endpoint: top-center of zone for top labels, bottom-center for base
    const lineEnd = group.id === "base"
      ? { x: zoneCenter.x, y: group.position.y + group.position.height + 2 }
      : { x: zoneCenter.x, y: group.position.y - 2 };

    return { group, labelX, labelY, labelAnchor, lineEnd };
  });

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <svg viewBox={`0 ${-LABEL_MARGIN} ${svgW} ${svgH + LABEL_MARGIN}`} className="w-full h-auto" style={{ maxHeight: "750px" }}>
        {/* Background */}
        <rect x="0" y={-LABEL_MARGIN} width={svgW} height={svgH + LABEL_MARGIN} fill="hsl(var(--card))" />

        {/* Zone Groups (background only — no inline text) */}
        {LAYOUT_ZONE_GROUPS.map((group) => (
          <g key={group.id}>
            <rect
              x={group.position.x} y={group.position.y} width={group.position.width} height={group.position.height}
              fill={group.bgColor} stroke={group.color} strokeWidth="1" strokeDasharray="4 2" rx="6"
            />
          </g>
        ))}

        {/* External callout labels with leader lines */}
        {zoneCallouts.map(({ group, labelX, labelY, labelAnchor, lineEnd }) => (
          <g key={`callout-${group.id}`}>
            {/* Leader line */}
            <line
              x1={labelX} y1={labelY + 6}
              x2={lineEnd.x} y2={lineEnd.y}
              stroke={group.color} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6"
              markerEnd={`url(#arrow-${group.id})`}
            />
            {/* Arrowhead marker */}
            <defs>
              <marker id={`arrow-${group.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={group.color} opacity="0.6" />
              </marker>
            </defs>
            {/* Label background */}
            <rect
              x={labelAnchor === "end" ? labelX - 160 : labelAnchor === "start" ? labelX - 4 : labelX - 80}
              y={labelY - 12}
              width="164" height="28" rx="4"
              fill="hsl(var(--card))" stroke={group.color} strokeWidth="0.8" opacity="0.95"
            />
            {/* Label title */}
            <text
              x={labelAnchor === "end" ? labelX - 78 : labelAnchor === "start" ? labelX + 78 : labelX}
              y={labelY}
              textAnchor="middle" fontSize="8" fill={group.color} fontWeight="700"
            >
              {group.label.toUpperCase()}
            </text>
            {/* Label description */}
            <text
              x={labelAnchor === "end" ? labelX - 78 : labelAnchor === "start" ? labelX + 78 : labelX}
              y={labelY + 11}
              textAnchor="middle" fontSize="6.5" fill={group.color} opacity="0.7"
            >
              {group.description}
            </text>
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
              {DOME_DIMENSIONS.widthM}m × {DOME_DIMENSIONS.depthM}m clear
            </text>
          </g>
        )}

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

        {/* ===== LAYDOWN AREA ===== */}

        {/* Laydown zone group background */}
        <rect
          x={LAYDOWN_ZONE_GROUP.position.x} y={LAYDOWN_ZONE_GROUP.position.y}
          width={LAYDOWN_ZONE_GROUP.position.width} height={LAYDOWN_ZONE_GROUP.position.height}
          fill={LAYDOWN_ZONE_GROUP.bgColor} stroke={LAYDOWN_ZONE_GROUP.color} strokeWidth="1" strokeDasharray="4 2" rx="6"
        />
        <text x={LAYDOWN_ZONE_GROUP.position.x + 8} y={LAYDOWN_ZONE_GROUP.position.y + 14} fontSize="9" fill={LAYDOWN_ZONE_GROUP.color} fontWeight="600">
          {LAYDOWN_ZONE_GROUP.label.toUpperCase()}
        </text>
        <text x={LAYDOWN_ZONE_GROUP.position.x + 8} y={LAYDOWN_ZONE_GROUP.position.y + 26} fontSize="8" fill={LAYDOWN_ZONE_GROUP.color} opacity="0.7">
          {LAYDOWN_ZONE_GROUP.description}
        </text>

        {/* 5m gap annotation */}
        <line x1={LAYDOWN_ZONE_GROUP.position.x + LAYDOWN_ZONE_GROUP.position.width / 2 - 20} y1={LAYDOWN_ZONE_GROUP.position.y - 15}
              x2={LAYDOWN_ZONE_GROUP.position.x + LAYDOWN_ZONE_GROUP.position.width / 2 + 20} y2={LAYDOWN_ZONE_GROUP.position.y - 15}
              stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x={LAYDOWN_ZONE_GROUP.position.x + LAYDOWN_ZONE_GROUP.position.width / 2} y={LAYDOWN_ZONE_GROUP.position.y - 20}
              textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" opacity="0.6">
          {YARD_DIMENSIONS.ldGapM}m gap
        </text>

        {/* Forklift access lane */}
        <rect
          x={FORKLIFT_LANE.position.x} y={FORKLIFT_LANE.position.y}
          width={FORKLIFT_LANE.width} height={FORKLIFT_LANE.height}
          fill={FORKLIFT_LANE.bgColor} stroke={FORKLIFT_LANE.borderColor} strokeWidth="1.5" strokeDasharray="6 3" rx="4"
        />
        <text x={FORKLIFT_LANE.position.x + FORKLIFT_LANE.width / 2} y={FORKLIFT_LANE.position.y + FORKLIFT_LANE.height / 2 - 4}
              textAnchor="middle" fontSize="8" fill={FORKLIFT_LANE.color} fontWeight="600">
          Forklift
        </text>
        <text x={FORKLIFT_LANE.position.x + FORKLIFT_LANE.width / 2} y={FORKLIFT_LANE.position.y + FORKLIFT_LANE.height / 2 + 8}
              textAnchor="middle" fontSize="7" fill={FORKLIFT_LANE.color} opacity="0.7">
          Access
        </text>

        {/* Laydown zones (LD-A through LD-F) */}
        {LAYDOWN_ZONES.map((zone) => {
          const ldCount = getLDPartsCount(zone);
          return (
            <g key={zone.id}>
              <rect
                x={zone.position.x} y={zone.position.y}
                width={zone.width} height={zone.height}
                fill={zone.bgColor} stroke={zone.borderColor} strokeWidth="1.5" rx="4"
              />
              {/* Zone ID badge */}
              <rect x={zone.position.x + 3} y={zone.position.y + 3} width="32" height="14" fill={zone.color} rx="3" />
              <text x={zone.position.x + 19} y={zone.position.y + 13} textAnchor="middle" fontSize="7" fill="white" fontWeight="700" fontFamily="monospace">
                {zone.id}
              </text>
              {/* Label */}
              <text x={zone.position.x + zone.width / 2} y={zone.position.y + zone.height / 2 + (zone.type === "yard-bay" ? -6 : 0)}
                    textAnchor="middle" fontSize={zone.type === "dome-row" ? "9" : "7"} fill="hsl(var(--foreground))" fontWeight="500">
                {zone.shortLabel}
              </text>
              {/* Dimensions */}
              <text x={zone.position.x + zone.width / 2} y={zone.position.y + zone.height / 2 + (zone.type === "yard-bay" ? 6 : 12)}
                    textAnchor="middle" fontSize="6" fill="hsl(var(--muted-foreground))" fontFamily="monospace">
                {zone.physicalWidthM}m × {zone.physicalDepthM}m
              </text>
              {/* Type label */}
              <text x={zone.position.x + zone.width / 2} y={zone.position.y + zone.height - 5}
                    textAnchor="middle" fontSize="5" fill="hsl(var(--muted-foreground))" opacity="0.6">
                {zone.type === "dome-row" ? "Dome Row" : "Yard Bay"}
              </text>
              {/* Live parts count */}
              {liveMode && ldCount !== null && (
                <>
                  <rect x={zone.position.x + zone.width - 36} y={zone.position.y + 3} width="32" height="14" fill={ldCount > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} rx="7" />
                  <text x={zone.position.x + zone.width - 20} y={zone.position.y + 13} textAnchor="middle" fontSize="6" fill={ldCount > 0 ? "white" : "hsl(var(--muted-foreground))"} fontWeight="600">
                    {ldCount}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Delivery zone */}
        <rect
          x={DELIVERY_ZONE.position.x} y={DELIVERY_ZONE.position.y}
          width={DELIVERY_ZONE.width} height={DELIVERY_ZONE.height}
          fill={DELIVERY_ZONE.bgColor} stroke={DELIVERY_ZONE.borderColor} strokeWidth="2" rx="4"
        />
        <text x={DELIVERY_ZONE.position.x + DELIVERY_ZONE.width / 2} y={DELIVERY_ZONE.position.y + DELIVERY_ZONE.height / 2 + 3}
              textAnchor="middle" fontSize="11" fill={DELIVERY_ZONE.color} fontWeight="700">
          Delivery
        </text>

        {/* Live total LD count */}
        {liveMode && getTotalLDCount() !== null && (
          <text x={LAYDOWN_ZONE_GROUP.position.x + LAYDOWN_ZONE_GROUP.position.width - 10} y={LAYDOWN_ZONE_GROUP.position.y + 14}
                textAnchor="end" fontSize="8" fill="hsl(var(--primary))" fontWeight="600">
            {getTotalLDCount()} LD parts total
          </text>
        )}

        {/* Yard dimensions label */}
        <text x={svgW / 2} y={svgH - 10} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontWeight="500">
          TCMG STORES YARD — {YARD_DIMENSIONS.totalWidthM}m × {YARD_DIMENSIONS.totalDepthM}m · Dome: {DOME_DIMENSIONS.widthM}m × {DOME_DIMENSIONS.depthM}m
        </text>

        {/* Clearance indicators */}
        <text x={20} y={200} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" opacity="0.5" transform={`rotate(-90, 20, 200)`}>
          {YARD_DIMENSIONS.outerClearanceM}m clearance
        </text>
      </svg>
    </div>
  );
};
