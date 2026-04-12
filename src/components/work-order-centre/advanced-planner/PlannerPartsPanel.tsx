/**
 * Inline parts panel for the Advanced Planner.
 * Opens as a slide-over when clicking a Parts readiness badge.
 * Shows all parts for a WO with editable status dropdowns + link to full WO.
 */
import { useCallback } from "react";
import { X, Package, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkOrderParts, PART_STATUSES } from "@/hooks/useWorkOrderParts";
import type { PlannerItem } from "./AdvancedPlannerView";
import type { MaterialStatus } from "@/hooks/useMaterialReadiness";

interface Props {
  item: PlannerItem;
  onClose: () => void;
  onOpenWorkOrder?: (item: PlannerItem) => void;
}

const STATUS_DOT: Record<string, string> = {
  "Not Ordered": "bg-red-500",
  Ordered: "bg-orange-500",
  "In Transit": "bg-amber-500",
  "On Site": "bg-emerald-500",
  "In Laydown Yard": "bg-emerald-400",
  Installed: "bg-blue-500",
};

export function PlannerPartsPanel({ item, onClose, onOpenWorkOrder }: Props) {
  const { parts, isLoading, updatePart } = useWorkOrderParts(item.sourceId);

  const handleStatusChange = useCallback(
    (partId: string, newStatus: string) => {
      updatePart.mutate({ id: partId, updates: { status: newStatus } });
    },
    [updatePart]
  );

  const allReady = parts.length > 0 && parts.every(p => 
    p.status === "On Site" || p.status === "In Laydown Yard" || p.status === "Installed"
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-[520px] bg-card border-l border-border shadow-2xl animate-in slide-in-from-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Parts & Materials</h3>
              <p className="text-[11px] text-muted-foreground font-mono">{item.woNumber || item.taskName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-muted/20 border-b border-border">
          <Badge variant="outline" className="text-[10px]">
            {parts.length} part{parts.length !== 1 ? "s" : ""}
          </Badge>
          {allReady ? (
            <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-300">
              <CheckCircle2 className="w-3 h-3 mr-1" /> All Parts Ready
            </Badge>
          ) : parts.length > 0 ? (
            <Badge className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-300">
              {parts.filter(p => p.status === "On Site" || p.status === "In Laydown Yard").length}/{parts.length} on site
            </Badge>
          ) : null}
          <div className="flex-1" />
          {onOpenWorkOrder && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] gap-1"
              onClick={() => onOpenWorkOrder(item)}
            >
              <ExternalLink className="w-3 h-3" /> Open Full WO
            </Button>
          )}
        </div>

        {/* Parts list */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">Loading parts...</div>
          ) : parts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-sm text-muted-foreground gap-2">
              <Package className="w-8 h-8 text-muted-foreground/40" />
              <p>No parts linked to this work order</p>
              <p className="text-[10px]">Add parts from the Work Order management view</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {parts.map((part) => (
                <div key={part.id} className="px-5 py-3 hover:bg-muted/10 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug">
                        {part.part_description || "Unnamed part"}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {part.part_number && (
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {part.part_number}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          Qty: <span className="font-semibold text-foreground">{part.quantity_required}</span>
                        </span>
                        {part.location && (
                          <span className="text-[10px] text-muted-foreground">
                            Loc: <span className="font-medium text-foreground">{part.location}</span>
                          </span>
                        )}
                      </div>
                      {part.comment && (
                        <p className="text-[10px] text-muted-foreground mt-1 italic truncate" title={part.comment}>
                          {part.comment}
                        </p>
                      )}
                    </div>

                    {/* Editable status dropdown */}
                    <div className="flex-shrink-0">
                      <Select
                        value={part.status}
                        onValueChange={(v) => handleStatusChange(part.id, v)}
                      >
                        <SelectTrigger className={cn(
                          "h-7 w-[140px] text-[10px] font-medium border",
                          part.status === "On Site" || part.status === "In Laydown Yard"
                            ? "border-emerald-300 bg-emerald-500/5 text-emerald-700"
                            : part.status === "Not Ordered"
                              ? "border-red-300 bg-red-500/5 text-red-700"
                              : part.status === "Ordered"
                                ? "border-orange-300 bg-orange-500/5 text-orange-700"
                                : "border-border"
                        )}>
                          <div className="flex items-center gap-1.5">
                            <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[part.status] || "bg-muted-foreground")} />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {PART_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", STATUS_DOT[s] || "bg-muted-foreground")} />
                                {s}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-muted/10 text-[10px] text-muted-foreground">
          Changes save automatically · Status updates sync to Work Order Management
        </div>
      </div>
    </div>
  );
}
