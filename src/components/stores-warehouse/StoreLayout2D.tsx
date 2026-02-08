import { useState } from "react";
import { STORE_CONTAINERS, LAYOUT_ZONE_GROUPS, type StoreContainer } from "./storeLayoutData";
import { ContainerDetail2D } from "./ContainerDetail2D";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Count parts per container based on warehouse_area matching zone code
  const getPartsCount = (container: StoreContainer) => {
    if (!liveMode || !sparesData.length) return null;
    return sparesData.filter((s) => {
      const area = (s.warehouse_area || "").toUpperCase();
      return area.includes(container.zoneCode) || area.includes(container.zone);
    }).length;
  };

  const getPartsForContainer = (container: StoreContainer) => {
    if (!sparesData.length) return [];
    return sparesData.filter((s) => {
      const area = (s.warehouse_area || "").toUpperCase();
      return area.includes(container.zoneCode) || area.includes(container.zone);
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
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {LAYOUT_ZONE_GROUPS.map((group) => (
          <div key={group.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border"
              style={{ backgroundColor: group.bgColor, borderColor: group.color }}
            />
            <span className="text-muted-foreground">{group.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground italic">Click a container to view shelves & bins</span>
        </div>
      </div>

      {/* SVG Floor Plan */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <svg viewBox="0 0 600 590" className="w-full h-auto" style={{ maxHeight: "600px" }}>
          {/* Background */}
          <rect x="0" y="0" width="600" height="590" fill="hsl(var(--card))" />

          {/* Access Road */}
          <rect x="0" y="375" width="600" height="20" fill="hsl(var(--muted))" rx="2" />
          <text x="300" y="389" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))" fontWeight="500">
            ACCESS ROAD / WALKWAY
          </text>

          {/* Walkway between clean and mechanical */}
          <rect x="0" y="185" width="600" height="20" fill="hsl(var(--muted))" rx="2" />
          <text x="300" y="199" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
            WALKWAY
          </text>

          {/* Entry Arrow */}
          <polygon points="580,570 600,555 580,540" fill="hsl(var(--primary))" opacity="0.5" />
          <text x="560" y="560" textAnchor="end" fontSize="10" fill="hsl(var(--primary))" fontWeight="600">
            ENTRY →
          </text>

          {/* Zone Groups */}
          {LAYOUT_ZONE_GROUPS.map((group) => (
            <g key={group.id}>
              <rect
                x={group.position.x}
                y={group.position.y}
                width={group.position.width}
                height={group.position.height}
                fill={group.bgColor}
                stroke={group.color}
                strokeWidth="1"
                strokeDasharray="4 2"
                rx="6"
              />
              <text
                x={group.position.x + 8}
                y={group.position.y + 14}
                fontSize="9"
                fill={group.color}
                fontWeight="600"
              >
                {group.label.toUpperCase()}
              </text>
              <text
                x={group.position.x + 8}
                y={group.position.y + 26}
                fontSize="8"
                fill={group.color}
                opacity="0.7"
              >
                {group.description}
              </text>
            </g>
          ))}

          {/* Containers */}
          {STORE_CONTAINERS.map((container) => {
            const partsCount = getPartsCount(container);
            return (
              <g
                key={container.id}
                className="cursor-pointer"
                onClick={() => setSelectedContainer(container)}
              >
                {/* Container body */}
                <rect
                  x={container.position.x}
                  y={container.position.y}
                  width={container.width}
                  height={container.height}
                  fill={container.bgColor}
                  stroke={container.borderColor}
                  strokeWidth="2"
                  rx="6"
                  className="transition-all duration-200 hover:opacity-80"
                />

                {/* Container ID badge */}
                <rect
                  x={container.position.x + 4}
                  y={container.position.y + 4}
                  width="36"
                  height="18"
                  fill={container.color}
                  rx="4"
                />
                <text
                  x={container.position.x + 22}
                  y={container.position.y + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {container.id}
                </text>

                {/* Container label */}
                <text
                  x={container.position.x + container.width / 2}
                  y={container.position.y + 50}
                  textAnchor="middle"
                  fontSize="12"
                  fill="hsl(var(--foreground))"
                  fontWeight="600"
                >
                  {container.shortLabel}
                </text>

                {/* Zone code */}
                <text
                  x={container.position.x + container.width / 2}
                  y={container.position.y + 66}
                  textAnchor="middle"
                  fontSize="10"
                  fill="hsl(var(--muted-foreground))"
                  fontFamily="monospace"
                >
                  {container.zone}
                </text>

                {/* Container type */}
                <text
                  x={container.position.x + container.width / 2}
                  y={container.position.y + 82}
                  textAnchor="middle"
                  fontSize="8"
                  fill="hsl(var(--muted-foreground))"
                  opacity="0.7"
                >
                  {container.containerType}
                </text>

                {/* Shelves indicator */}
                <text
                  x={container.position.x + container.width / 2}
                  y={container.position.y + 100}
                  textAnchor="middle"
                  fontSize="8"
                  fill="hsl(var(--muted-foreground))"
                >
                  {container.shelves.length} shelves × {container.binsPerShelf} bins
                </text>

                {/* Parts count badge (live mode) */}
                {liveMode && partsCount !== null && (
                  <>
                    <rect
                      x={container.position.x + container.width - 50}
                      y={container.position.y + 4}
                      width="46"
                      height="18"
                      fill={partsCount > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                      rx="9"
                    />
                    <text
                      x={container.position.x + container.width - 27}
                      y={container.position.y + 16}
                      textAnchor="middle"
                      fontSize="8"
                      fill={partsCount > 0 ? "white" : "hsl(var(--muted-foreground))"}
                      fontWeight="600"
                    >
                      {partsCount} parts
                    </text>
                  </>
                )}

                {/* Click hint */}
                <text
                  x={container.position.x + container.width / 2}
                  y={container.position.y + 114}
                  textAnchor="middle"
                  fontSize="7"
                  fill="hsl(var(--primary))"
                  opacity="0.6"
                >
                  ▶ Click to expand
                </text>
              </g>
            );
          })}

          {/* Yard label */}
          <text x="300" y="580" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))" fontWeight="500">
            TCMG STORES YARD — OPTIMIZED LAYOUT
          </text>
        </svg>
      </div>
    </div>
  );
};
