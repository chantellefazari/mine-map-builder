import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBinsForContainer, type StoreContainer } from "./storeLayoutData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

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
  const bins = generateBinsForContainer(container);
  const shelves = container.shelves;

  // Map parts to bin locations
  const getPartAtBin = (binId: string) => {
    if (!liveMode || !parts.length) return null;
    const locationCode = `${container.id}-${container.zoneCode}-${binId}`;
    return parts.find((p) => {
      const loc = (p.bin_location || "").toUpperCase();
      return loc === locationCode || loc.endsWith(binId);
    });
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: container.color }}
          >
            {container.id}
          </div>
          <div>
            <CardTitle className="text-lg">{container.label}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs font-mono">
                {container.zone}
              </Badge>
              <span className="text-xs text-muted-foreground">{container.containerType}</span>
              {liveMode && (
                <Badge variant="secondary" className="text-xs">
                  {parts.length} parts mapped
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          <span>{container.environment}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Shelf/Bin Grid */}
        <div className="space-y-2">
          {/* Header row */}
          <div className="flex gap-1">
            <div className="w-10 text-xs font-medium text-muted-foreground text-center">Shelf</div>
            {Array.from({ length: container.binsPerShelf }, (_, i) => (
              <div
                key={i}
                className="flex-1 text-center text-xs font-mono text-muted-foreground"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Shelf rows */}
          <TooltipProvider>
            {shelves.map((shelf) => (
              <div key={shelf} className="flex gap-1">
                <div className="w-10 flex items-center justify-center text-xs font-bold text-foreground bg-muted rounded">
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
                          className={`flex-1 h-12 rounded border text-center flex flex-col items-center justify-center cursor-default transition-colors ${
                            part
                              ? "border-primary/40 bg-primary/10"
                              : "border-border bg-muted/30 hover:bg-muted/50"
                          }`}
                        >
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {binId}
                          </span>
                          {part && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-0.5" />
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
                                <p className="text-xs text-muted-foreground">
                                  PN: {part.part_number}
                                </p>
                              )}
                              {part.category && (
                                <p className="text-xs text-muted-foreground">
                                  Category: {part.category}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Empty bin</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </TooltipProvider>
        </div>

        {/* Unmapped parts */}
        {liveMode && parts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              {parts.filter((p) => !p.bin_location).length} parts without bin location assignments
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
