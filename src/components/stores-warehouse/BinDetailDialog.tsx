import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Ruler, Weight, MapPin, AlertTriangle, Box } from "lucide-react";
import type { StoreContainer } from "./storeLayoutData";

interface BinPart {
  id: string;
  description: string;
  bin_location: string | null;
  warehouse_area: string | null;
  category: string | null;
  part_number: string | null;
}

interface BinDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  container: StoreContainer;
  binId: string; // e.g. "A3"
  parts: BinPart[];
}

export const BinDetailDialog = ({ isOpen, onClose, container, binId, parts }: BinDetailDialogProps) => {
  const shelf = binId.charAt(0);
  const binNum = parseInt(binId.slice(1), 10);
  const shelfIdx = container.shelves.indexOf(shelf);
  const heightFromFloor = container.bottomShelfHeightCm + shelfIdx * container.shelfHeightCm;
  const locationCode = `${container.id}-${container.zoneCode}-${binId}`;

  const W = container.binWidthCm;
  const D = container.binDepthCm;
  const H = container.shelfHeightCm;

  // Match stocking category for this shelf position
  const categoryIdx = Math.min(shelfIdx, container.stockingCategories.length - 1);
  const suggestedCategory = container.stockingCategories[categoryIdx];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: container.color }}
            >
              {binId}
            </div>
            <div>
              <span className="font-mono">{locationCode}</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                {container.label} · Shelf {shelf} · Bin {binNum}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bin Specs Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Ruler className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Dimensions (W×D×H)</p>
                <p className="text-sm font-medium font-mono">{W} × {D} × {H} cm</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Weight className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Max Weight</p>
                <p className="text-sm font-medium">{container.maxItemWeightKg} kg</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Height from Floor</p>
                <p className="text-sm font-medium">{heightFromFloor} cm</p>
              </div>
            </div>
          </div>

          {/* 3D-ish Bin Visualisation */}
          <div className="border border-border rounded-lg p-4">
            <p className="text-xs font-medium mb-3 flex items-center gap-2">
              <Box className="w-3.5 h-3.5" />
              Bin Interior View
            </p>
            <BinInteriorSVG
              width={W}
              depth={D}
              height={H}
              parts={parts}
              color={container.color}
              bgColor={container.bgColor}
            />
          </div>

          {/* Parts in this bin */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium flex items-center gap-2">
                <Package className="w-3.5 h-3.5" />
                Items Stored ({parts.length})
              </p>
              {parts.length === 0 && (
                <Badge variant="outline" className="text-[10px]">Empty</Badge>
              )}
            </div>

            {parts.length > 0 ? (
              <div className="space-y-2">
                {parts.map((p, i) => (
                  <div key={p.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: container.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.description}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {p.part_number && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border">
                            PN: {p.part_number}
                          </span>
                        )}
                        {p.category && (
                          <span className="text-[10px] text-muted-foreground">{p.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No items assigned to this bin</p>
                <p className="text-xs mt-1">Bin is available for stocking</p>
              </div>
            )}
          </div>

          {/* Suggested category */}
          {suggestedCategory && (
            <div className="flex items-start gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
              <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium">Suggested Stocking: {suggestedCategory.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {suggestedCategory.items.slice(0, 5).join(", ")}{suggestedCategory.items.length > 5 ? "…" : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ---- Isometric-style bin interior SVG ---- */

const BinInteriorSVG = ({
  width, depth, height, parts, color, bgColor,
}: {
  width: number; depth: number; height: number;
  parts: BinPart[]; color: string; bgColor: string;
}) => {
  // SVG constants
  const svgW = 400;
  const svgH = 260;
  const pad = 30;

  // Isometric projection helpers
  const isoX = (x: number, y: number) => pad + (svgW - pad * 2) * 0.5 + (x - y) * 0.7;
  const isoY = (x: number, y: number, z: number) => svgH - pad - (x + y) * 0.35 - z * 1.2;

  // Normalised coordinates (0-1)
  const bW = 1; // width axis
  const bD = 0.6; // depth axis
  const bH = height / Math.max(width, 1); // height proportional

  // Bin corners (bottom face)
  const bl = { x: isoX(0, 0), y: isoY(0, 0, 0) };
  const br = { x: isoX(bW, 0), y: isoY(bW, 0, 0) };
  const tr = { x: isoX(bW, bD), y: isoY(bW, bD, 0) };
  const tl = { x: isoX(0, bD), y: isoY(0, bD, 0) };

  // Top face
  const blT = { x: isoX(0, 0, ), y: isoY(0, 0, bH) };
  const brT = { x: isoX(bW, 0), y: isoY(bW, 0, bH) };
  const trT = { x: isoX(bW, bD), y: isoY(bW, bD, bH) };
  const tlT = { x: isoX(0, bD), y: isoY(0, bD, bH) };

  // Part boxes stacked inside
  const maxParts = Math.min(parts.length, 6);
  const partH = maxParts > 0 ? Math.min(bH * 0.8 / maxParts, bH * 0.35) : 0;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: 220 }}>
      {/* Back wall */}
      <polygon
        points={`${tl.x},${tl.y} ${tr.x},${tr.y} ${trT.x},${trT.y} ${tlT.x},${tlT.y}`}
        fill={bgColor} stroke={color} strokeWidth="1.5" opacity={0.5}
      />
      {/* Left wall */}
      <polygon
        points={`${tl.x},${tl.y} ${bl.x},${bl.y} ${blT.x},${blT.y} ${tlT.x},${tlT.y}`}
        fill={bgColor} stroke={color} strokeWidth="1.5" opacity={0.35}
      />
      {/* Floor */}
      <polygon
        points={`${bl.x},${bl.y} ${br.x},${br.y} ${tr.x},${tr.y} ${tl.x},${tl.y}`}
        fill={bgColor} stroke={color} strokeWidth="1" opacity={0.25}
      />
      {/* Right wall (edge line) */}
      <line x1={br.x} y1={br.y} x2={brT.x} y2={brT.y} stroke={color} strokeWidth="1.5" opacity={0.5} />
      {/* Top edge lines */}
      <line x1={blT.x} y1={blT.y} x2={brT.x} y2={brT.y} stroke={color} strokeWidth="1" opacity={0.3} strokeDasharray="4 3" />
      <line x1={brT.x} y1={brT.y} x2={trT.x} y2={trT.y} stroke={color} strokeWidth="1" opacity={0.3} strokeDasharray="4 3" />

      {/* Items stacked on floor */}
      {parts.length > 0 ? (
        Array.from({ length: maxParts }).map((_, i) => {
          const p = parts[i];
          const zBase = i * partH;
          const inset = 0.08;

          const pbl = { x: isoX(inset, inset), y: isoY(inset, inset, zBase) };
          const pbr = { x: isoX(bW - inset, inset), y: isoY(bW - inset, inset, zBase) };
          const ptr = { x: isoX(bW - inset, bD - inset), y: isoY(bW - inset, bD - inset, zBase) };
          const ptl = { x: isoX(inset, bD - inset), y: isoY(inset, bD - inset, zBase) };

          const pblT = { x: isoX(inset, inset), y: isoY(inset, inset, zBase + partH * 0.85) };
          const pbrT = { x: isoX(bW - inset, inset), y: isoY(bW - inset, inset, zBase + partH * 0.85) };
          const ptrT = { x: isoX(bW - inset, bD - inset), y: isoY(bW - inset, bD - inset, zBase + partH * 0.85) };
          const ptlT = { x: isoX(inset, bD - inset), y: isoY(inset, bD - inset, zBase + partH * 0.85) };

          const label = p ? (p.part_number || p.description || "Item").slice(0, 14) : `Item ${i + 1}`;

          return (
            <g key={i} opacity={0.9}>
              {/* Top face */}
              <polygon
                points={`${pblT.x},${pblT.y} ${pbrT.x},${pbrT.y} ${ptrT.x},${ptrT.y} ${ptlT.x},${ptlT.y}`}
                fill={color} opacity={0.35} stroke={color} strokeWidth="0.5"
              />
              {/* Front face */}
              <polygon
                points={`${pbl.x},${pbl.y} ${pbr.x},${pbr.y} ${pbrT.x},${pbrT.y} ${pblT.x},${pblT.y}`}
                fill={color} opacity={0.2} stroke={color} strokeWidth="0.5"
              />
              {/* Right face */}
              <polygon
                points={`${pbr.x},${pbr.y} ${ptr.x},${ptr.y} ${ptrT.x},${ptrT.y} ${pbrT.x},${pbrT.y}`}
                fill={color} opacity={0.12} stroke={color} strokeWidth="0.5"
              />
              {/* Label on top face */}
              <text
                x={(pblT.x + pbrT.x + ptrT.x + ptlT.x) / 4}
                y={(pblT.y + pbrT.y + ptrT.y + ptlT.y) / 4 + 3}
                textAnchor="middle" fontSize="8" fontWeight="600"
                fill="hsl(var(--foreground))"
              >
                {label}
              </text>
            </g>
          );
        })
      ) : (
        <text
          x={svgW / 2} y={svgH / 2 + 10}
          textAnchor="middle" fontSize="12"
          fill="hsl(var(--muted-foreground))" opacity={0.5}
        >
          Empty Bin
        </text>
      )}

      {parts.length > 6 && (
        <text x={svgW / 2} y={svgH - 10} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          +{parts.length - 6} more items
        </text>
      )}

      {/* Dimension labels */}
      <text x={((bl.x + br.x) / 2)} y={bl.y + 16} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
        {width}cm
      </text>
      <text x={br.x + 14} y={(br.y + tr.y) / 2} textAnchor="start" fontSize="9" fill="hsl(var(--muted-foreground))">
        {depth}cm
      </text>
      <text x={blT.x - 10} y={(bl.y + blT.y) / 2} textAnchor="end" fontSize="9" fill="hsl(var(--muted-foreground))" transform={`rotate(-90, ${blT.x - 10}, ${(bl.y + blT.y) / 2})`}>
        {height}cm
      </text>
    </svg>
  );
};
