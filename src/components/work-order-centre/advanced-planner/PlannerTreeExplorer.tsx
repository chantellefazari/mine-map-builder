import { useState, useMemo, useCallback } from "react";
import {
  ChevronDown, ChevronRight, FolderOpen, Folder, Wrench, Zap, ShieldAlert,
  Building2, Hash, Clock, Package, ListChecks, AlertTriangle, CheckCircle2,
  FileText, Settings2, Layers, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlannerItem } from "./AdvancedPlannerView";
import { PlannerItemDetail } from "./PlannerItemDetail";

interface Props {
  items: PlannerItem[];
}

const WO_TYPE_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  PM: { bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-300", dot: "bg-blue-500" },
  General: { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-500" },
  Breakdown: { bg: "bg-red-500/10", text: "text-red-700", border: "border-red-300", dot: "bg-red-500" },
  Shutdown: { bg: "bg-amber-500/10", text: "text-amber-700", border: "border-amber-300", dot: "bg-amber-500" },
};

const STATUS_COLORS: Record<string, string> = {
  Draft: "text-muted-foreground",
  Active: "text-emerald-600",
  Planning: "text-amber-600",
  Scheduled: "text-blue-600",
  "On Hold": "text-red-600",
  Completed: "text-emerald-700",
  Open: "text-emerald-600",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "text-red-600",
  High: "text-red-500",
  Urgent: "text-red-500",
  Medium: "text-amber-600",
  Standard: "text-foreground",
  Low: "text-blue-600",
};

interface TreeNode {
  key: string;
  label: string;
  type: "area" | "asset" | "plan";
  count: number;
  hours: number;
  children?: TreeNode[];
  item?: PlannerItem;
  woTypes: Record<string, number>;
}

function buildTree(items: PlannerItem[]): TreeNode[] {
  const areaMap = new Map<string, Map<string, PlannerItem[]>>();

  for (const item of items) {
    const area = item.area || "Unassigned";
    const asset = item.assetNumber || "No Asset";
    if (!areaMap.has(area)) areaMap.set(area, new Map());
    const assetMap = areaMap.get(area)!;
    if (!assetMap.has(asset)) assetMap.set(asset, []);
    assetMap.get(asset)!.push(item);
  }

  const tree: TreeNode[] = [];

  for (const [area, assetMap] of Array.from(areaMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    const areaItems = Array.from(assetMap.values()).flat();
    const woTypes: Record<string, number> = {};
    areaItems.forEach(i => { woTypes[i.woType] = (woTypes[i.woType] || 0) + 1; });

    const assetNodes: TreeNode[] = [];

    for (const [asset, plans] of Array.from(assetMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      const assetWoTypes: Record<string, number> = {};
      plans.forEach(i => { assetWoTypes[i.woType] = (assetWoTypes[i.woType] || 0) + 1; });

      const planNodes: TreeNode[] = plans
        .sort((a, b) => a.taskName.localeCompare(b.taskName))
        .map(p => ({
          key: p.id,
          label: p.taskName,
          type: "plan" as const,
          count: 1,
          hours: p.estimatedHours,
          item: p,
          woTypes: { [p.woType]: 1 },
        }));

      assetNodes.push({
        key: `asset-${asset}`,
        label: asset,
        type: "asset",
        count: plans.length,
        hours: plans.reduce((s, p) => s + p.estimatedHours, 0),
        children: planNodes,
        woTypes: assetWoTypes,
      });
    }

    tree.push({
      key: `area-${area}`,
      label: area,
      type: "area",
      count: areaItems.length,
      hours: areaItems.reduce((s, i) => s + i.estimatedHours, 0),
      children: assetNodes,
      woTypes,
    });
  }

  return tree;
}

export function PlannerTreeExplorer({ items }: Props) {
  const tree = useMemo(() => buildTree(items), [items]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<PlannerItem | null>(null);

  const toggle = useCallback((key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const keys = new Set<string>();
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        keys.add(n.key);
        if (n.children) walk(n.children);
      }
    };
    walk(tree);
    setExpanded(keys);
  }, [tree]);

  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  return (
    <div className="flex h-full">
      {/* Tree panel */}
      <div className={cn("flex flex-col border-r border-border bg-card transition-all", selectedItem ? "w-[55%]" : "w-full")}>
        {/* Tree header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">{tree.length} Areas</span>
            <span>·</span>
            <span>{items.length} Plans</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={expandAll} className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted">
              Expand All
            </button>
            <button onClick={collapseAll} className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted">
              Collapse All
            </button>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_70px_60px_60px_70px_55px] gap-0 px-3 py-1 border-b border-border bg-muted/10 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Plan / Asset / Area</span>
          <span className="text-center">WO Type</span>
          <span className="text-center">Freq</span>
          <span className="text-center">Hours</span>
          <span className="text-center">Status</span>
          <span className="text-center">Priority</span>
        </div>

        {/* Tree content */}
        <ScrollArea className="flex-1">
          <div className="py-0.5">
            {tree.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                No maintenance plans match your filters
              </div>
            ) : (
              tree.map(node => (
                <TreeRow
                  key={node.key}
                  node={node}
                  depth={0}
                  expanded={expanded}
                  toggle={toggle}
                  selectedId={selectedItem?.id || null}
                  onSelect={setSelectedItem}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Detail panel */}
      {selectedItem && (
        <div className="flex-1 min-w-0 overflow-hidden">
          <PlannerItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
      )}
    </div>
  );
}

function TreeRow({
  node, depth, expanded, toggle, selectedId, onSelect,
}: {
  node: TreeNode;
  depth: number;
  expanded: Set<string>;
  toggle: (key: string) => void;
  selectedId: string | null;
  onSelect: (item: PlannerItem) => void;
}) {
  const isExpanded = expanded.has(node.key);
  const hasChildren = node.children && node.children.length > 0;
  const isArea = node.type === "area";
  const isAsset = node.type === "asset";
  const isPlan = node.type === "plan";
  const isSelected = isPlan && node.item && node.item.id === selectedId;

  const paddingLeft = 12 + depth * 20;

  const handleClick = () => {
    if (isPlan && node.item) {
      onSelect(node.item);
    } else if (hasChildren) {
      toggle(node.key);
    }
  };

  const typeStyle = isPlan && node.item ? WO_TYPE_STYLES[node.item.woType] : null;

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "grid grid-cols-[1fr_70px_60px_60px_70px_55px] gap-0 items-center py-1 pr-3 cursor-pointer transition-colors group border-b border-border/20",
          isArea && "bg-muted/30 hover:bg-muted/50",
          isAsset && "hover:bg-muted/20",
          isPlan && "hover:bg-primary/5",
          isSelected && "bg-primary/10 border-l-2 border-l-primary",
        )}
        style={{ paddingLeft }}
      >
        {/* Label column */}
        <div className="flex items-center gap-1.5 min-w-0">
          {hasChildren ? (
            isExpanded
              ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          ) : (
            <span className="w-3 flex-shrink-0" />
          )}

          {isArea && (isExpanded ? <FolderOpen className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> : <Folder className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />)}
          {isAsset && <Settings2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
          {isPlan && node.item && (
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", WO_TYPE_STYLES[node.item.woType]?.dot)} />
          )}

          <span className={cn(
            "truncate",
            isArea && "text-xs font-bold text-foreground",
            isAsset && "text-[11px] font-semibold text-foreground font-mono",
            isPlan && "text-[11px] text-foreground",
          )}>
            {node.label}
          </span>

          {(isArea || isAsset) && (
            <span className="text-[9px] text-muted-foreground ml-1 flex-shrink-0">({node.count})</span>
          )}

          {/* WO type summary dots for area/asset */}
          {(isArea || isAsset) && (
            <div className="flex items-center gap-0.5 ml-1 flex-shrink-0">
              {Object.entries(node.woTypes).map(([type, count]) => (
                <span key={type} className={cn("w-1.5 h-1.5 rounded-full", WO_TYPE_STYLES[type]?.dot)} title={`${count} ${type}`} />
              ))}
            </div>
          )}

          {isPlan && node.item?.woNumber && (
            <span className="text-[9px] font-mono text-muted-foreground ml-1 flex-shrink-0">{node.item.woNumber}</span>
          )}
        </div>

        {/* WO Type */}
        <div className="text-center">
          {isPlan && node.item && (
            <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-4", typeStyle?.bg, typeStyle?.text, typeStyle?.border)}>
              {node.item.woType}
            </Badge>
          )}
        </div>

        {/* Frequency */}
        <div className="text-center text-[10px] text-muted-foreground">
          {isPlan && node.item ? (node.item.frequency || "—") : ""}
        </div>

        {/* Hours */}
        <div className={cn("text-center text-[10px] tabular-nums", isPlan ? "text-foreground font-medium" : "text-muted-foreground")}>
          {node.hours > 0 ? node.hours.toFixed(node.hours % 1 ? 1 : 0) : "—"}
        </div>

        {/* Status */}
        <div className="text-center">
          {isPlan && node.item && (
            <span className={cn("text-[9px] font-medium", STATUS_COLORS[node.item.status] || "text-muted-foreground")}>
              {node.item.status}
            </span>
          )}
        </div>

        {/* Priority */}
        <div className="text-center">
          {isPlan && node.item && (
            <span className={cn("text-[9px] font-medium", PRIORITY_COLORS[node.item.priority] || "text-muted-foreground")}>
              {node.item.priority}
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && node.children!.map(child => (
        <TreeRow
          key={child.key}
          node={child}
          depth={depth + 1}
          expanded={expanded}
          toggle={toggle}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
