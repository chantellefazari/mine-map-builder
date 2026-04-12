import { useState, useMemo, useCallback } from "react";
import {
  ChevronDown, ChevronRight, FolderOpen, Folder, Settings2,
  Wrench, Box, Cpu, MapPin, ClipboardList, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";
import type { Area, SubArea, ParentAsset, Equipment, Component } from "@/components/hierarchy/assetData";
import type { PlannerItem } from "./AdvancedPlannerView";
import { PlannerItemDetail } from "./PlannerItemDetail";

interface Props {
  items: PlannerItem[];
}

const AREA_COLORS: Record<string, string> = {
  MILL: "bg-red-500",
  REC: "bg-amber-500",
  TAIL: "bg-emerald-500",
  UTL: "bg-blue-500",
  SITE: "bg-purple-500",
  MOB: "bg-violet-500",
};

const WO_TYPE_DOTS: Record<string, string> = {
  PM: "bg-blue-500",
  General: "bg-emerald-500",
  Breakdown: "bg-red-500",
  Shutdown: "bg-amber-500",
};

export function PlannerTreeExplorer({ items }: Props) {
  const { data: areas, isLoading } = useRevBPlantAssets();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<PlannerItem | null>(null);

  // Index items by asset number for fast lookup
  const itemsByAsset = useMemo(() => {
    const map = new Map<string, PlannerItem[]>();
    for (const item of items) {
      const key = item.assetNumber;
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  // Count plans under an equipment (including component codes)
  const getEquipmentPlans = useCallback((equip: Equipment): PlannerItem[] => {
    const plans = itemsByAsset.get(equip.assetNumber) || [];
    // Also check component codes
    if (equip.components) {
      for (const comp of equip.components) {
        const compPlans = itemsByAsset.get(comp.componentCode) || [];
        plans.push(...compPlans);
      }
    }
    return plans;
  }, [itemsByAsset]);

  // Count plans for a parent asset
  const getParentPlans = useCallback((pa: ParentAsset): number => {
    return pa.equipment.reduce((s, e) => s + getEquipmentPlans(e).length, 0);
  }, [getEquipmentPlans]);

  // Count plans for a sub-area
  const getSubAreaPlans = useCallback((sa: SubArea): number => {
    return sa.parentAssets.reduce((s, pa) => s + getParentPlans(pa), 0);
  }, [getParentPlans]);

  // Count plans for an area
  const getAreaPlans = useCallback((area: Area): number => {
    return area.subAreas.reduce((s, sa) => s + getSubAreaPlans(sa), 0);
  }, [getSubAreaPlans]);

  const toggle = useCallback((key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!areas) return;
    const keys = new Set<string>();
    for (const area of areas) {
      keys.add(`area-${area.code}`);
      for (const sa of area.subAreas) {
        keys.add(`sa-${area.code}-${sa.label}`);
        for (const pa of sa.parentAssets) {
          keys.add(`pa-${area.code}-${sa.label}-${pa.label}`);
          for (const eq of pa.equipment) {
            keys.add(`eq-${eq.assetNumber}`);
          }
        }
      }
    }
    setExpanded(keys);
  }, [areas]);

  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">Loading asset tree…</div>;
  }

  if (!areas || areas.length === 0) {
    return <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">No asset data available</div>;
  }

  return (
    <div className="flex h-full">
      {/* Tree panel */}
      <div className={cn("flex flex-col border-r border-border bg-card transition-all", selectedItem ? "w-[55%]" : "w-full")}>
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">{areas.length} Areas</span>
            <span>·</span>
            <span>{items.length} Plans linked</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={expandAll} className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted">Expand All</button>
            <button onClick={collapseAll} className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted">Collapse All</button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-0.5">
            {areas.map(area => (
              <AreaRow
                key={area.code}
                area={area}
                expanded={expanded}
                toggle={toggle}
                getEquipmentPlans={getEquipmentPlans}
                getParentPlans={getParentPlans}
                getSubAreaPlans={getSubAreaPlans}
                getAreaPlans={getAreaPlans}
                selectedId={selectedItem?.id || null}
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedItem && (
        <div className="flex-1 min-w-0 overflow-hidden">
          <PlannerItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
      )}
    </div>
  );
}

/* ─── Area Row ─── */
function AreaRow({ area, expanded, toggle, getEquipmentPlans, getParentPlans, getSubAreaPlans, getAreaPlans, selectedId, onSelect }: {
  area: Area;
  expanded: Set<string>;
  toggle: (k: string) => void;
  getEquipmentPlans: (e: Equipment) => PlannerItem[];
  getParentPlans: (pa: ParentAsset) => number;
  getSubAreaPlans: (sa: SubArea) => number;
  getAreaPlans: (a: Area) => number;
  selectedId: string | null;
  onSelect: (item: PlannerItem) => void;
}) {
  const key = `area-${area.code}`;
  const isOpen = expanded.has(key);
  const planCount = getAreaPlans(area);
  const equipCount = area.subAreas.reduce((s, sa) => s + sa.parentAssets.reduce((s2, pa) => s2 + pa.equipment.length, 0), 0);

  return (
    <>
      <div onClick={() => toggle(key)} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/30">
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <Badge className={cn("text-[9px] px-1.5 py-0 h-4 text-white border-0", AREA_COLORS[area.code] || "bg-muted-foreground")}>
          {area.code}
        </Badge>
        <span className="text-xs font-bold text-foreground">{area.label}</span>
        <span className="text-[9px] text-muted-foreground ml-auto tabular-nums">{equipCount} assets · {planCount} plans</span>
      </div>
      {isOpen && area.subAreas.map(sa => (
        <SubAreaRow
          key={sa.label}
          subArea={sa}
          areaCode={area.code}
          expanded={expanded}
          toggle={toggle}
          getEquipmentPlans={getEquipmentPlans}
          getParentPlans={getParentPlans}
          getSubAreaPlans={getSubAreaPlans}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

/* ─── Sub-Area Row ─── */
function SubAreaRow({ subArea, areaCode, expanded, toggle, getEquipmentPlans, getParentPlans, getSubAreaPlans, selectedId, onSelect }: {
  subArea: SubArea; areaCode: string;
  expanded: Set<string>; toggle: (k: string) => void;
  getEquipmentPlans: (e: Equipment) => PlannerItem[];
  getParentPlans: (pa: ParentAsset) => number;
  getSubAreaPlans: (sa: SubArea) => number;
  selectedId: string | null; onSelect: (item: PlannerItem) => void;
}) {
  const key = `sa-${areaCode}-${subArea.label}`;
  const isOpen = expanded.has(key);
  const planCount = getSubAreaPlans(subArea);

  return (
    <>
      <div onClick={() => toggle(key)} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-muted/20 transition-colors border-b border-border/20" style={{ paddingLeft: 32 }}>
        {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        {isOpen ? <FolderOpen className="w-3.5 h-3.5 text-amber-500" /> : <Folder className="w-3.5 h-3.5 text-amber-500" />}
        <span className="text-[11px] font-semibold text-foreground">{subArea.label}</span>
        {planCount > 0 && <span className="text-[9px] text-primary font-medium ml-1">{planCount} plans</span>}
      </div>
      {isOpen && subArea.parentAssets.map(pa => (
        <ParentAssetRow
          key={pa.label}
          parent={pa}
          areaCode={areaCode}
          subAreaLabel={subArea.label}
          expanded={expanded}
          toggle={toggle}
          getEquipmentPlans={getEquipmentPlans}
          getParentPlans={getParentPlans}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

/* ─── Parent Asset Row ─── */
function ParentAssetRow({ parent, areaCode, subAreaLabel, expanded, toggle, getEquipmentPlans, getParentPlans, selectedId, onSelect }: {
  parent: ParentAsset; areaCode: string; subAreaLabel: string;
  expanded: Set<string>; toggle: (k: string) => void;
  getEquipmentPlans: (e: Equipment) => PlannerItem[];
  getParentPlans: (pa: ParentAsset) => number;
  selectedId: string | null; onSelect: (item: PlannerItem) => void;
}) {
  const key = `pa-${areaCode}-${subAreaLabel}-${parent.label}`;
  const isOpen = expanded.has(key);
  const planCount = getParentPlans(parent);

  return (
    <>
      <div onClick={() => toggle(key)} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-muted/20 transition-colors border-b border-border/20" style={{ paddingLeft: 52 }}>
        {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-foreground">{parent.label}</span>
        {parent.functionalLocation && (
          <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 font-mono">{parent.functionalLocation}</Badge>
        )}
        <span className="text-[9px] text-muted-foreground ml-auto tabular-nums mr-3">{parent.equipment.length} equip · {planCount} plans</span>
      </div>
      {isOpen && parent.equipment.map(eq => (
        <EquipmentRow
          key={eq.assetNumber}
          equipment={eq}
          expanded={expanded}
          toggle={toggle}
          plans={getEquipmentPlans(eq)}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

/* ─── Equipment Row ─── */
function EquipmentRow({ equipment, expanded, toggle, plans, selectedId, onSelect }: {
  equipment: Equipment;
  expanded: Set<string>; toggle: (k: string) => void;
  plans: PlannerItem[];
  selectedId: string | null; onSelect: (item: PlannerItem) => void;
}) {
  const key = `eq-${equipment.assetNumber}`;
  const isOpen = expanded.has(key);
  const hasChildren = (equipment.components && equipment.components.length > 0) || plans.length > 0;

  return (
    <>
      <div
        onClick={() => hasChildren && toggle(key)}
        className={cn("flex items-center gap-2 py-1 transition-colors border-b border-border/10", hasChildren ? "cursor-pointer hover:bg-muted/20" : "")}
        style={{ paddingLeft: 72 }}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : <span className="w-3" />}
        <Wrench className="w-3 h-3 text-blue-500 flex-shrink-0" />
        <span className="text-[10px] font-mono font-semibold text-foreground">{equipment.assetNumber}</span>
        <span className="text-[10px] text-muted-foreground truncate">{equipment.name}</span>
        {plans.length > 0 && (
          <div className="flex items-center gap-0.5 ml-auto mr-3 flex-shrink-0">
            {plans.map(p => (
              <span key={p.id} className={cn("w-1.5 h-1.5 rounded-full", WO_TYPE_DOTS[p.woType])} title={`${p.woType}: ${p.taskName}`} />
            ))}
            <span className="text-[9px] text-primary font-medium ml-1">{plans.length}</span>
          </div>
        )}
      </div>

      {isOpen && (
        <>
          {/* Plans under this equipment */}
          {plans.map(plan => (
            <PlanLeafRow key={plan.id} plan={plan} depth={92} isSelected={plan.id === selectedId} onSelect={onSelect} />
          ))}
          {/* Components */}
          {equipment.components?.map((comp, i) => (
            <ComponentRow key={`${comp.componentCode}-${i}`} component={comp} />
          ))}
        </>
      )}
    </>
  );
}

/* ─── Plan Leaf Row ─── */
function PlanLeafRow({ plan, depth, isSelected, onSelect }: {
  plan: PlannerItem; depth: number; isSelected: boolean; onSelect: (item: PlannerItem) => void;
}) {
  const WO_TYPE_STYLES: Record<string, string> = {
    PM: "bg-blue-500/10 text-blue-700 border-blue-300",
    General: "bg-emerald-500/10 text-emerald-700 border-emerald-300",
    Breakdown: "bg-red-500/10 text-red-700 border-red-300",
    Shutdown: "bg-amber-500/10 text-amber-700 border-amber-300",
  };

  return (
    <div
      onClick={() => onSelect(plan)}
      className={cn(
        "flex items-center gap-2 py-1 cursor-pointer transition-colors border-b border-border/10",
        isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-primary/5"
      )}
      style={{ paddingLeft: depth }}
    >
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", WO_TYPE_DOTS[plan.woType])} />
      <ClipboardList className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <span className="text-[10px] text-foreground truncate flex-1">{plan.taskName}</span>
      {plan.woNumber && <span className="text-[9px] font-mono text-muted-foreground flex-shrink-0">{plan.woNumber}</span>}
      <Badge variant="outline" className={cn("text-[8px] px-1 py-0 h-3.5 flex-shrink-0", WO_TYPE_STYLES[plan.woType])}>
        {plan.woType}
      </Badge>
      {plan.frequency && <span className="text-[9px] text-muted-foreground flex-shrink-0">{plan.frequency}</span>}
    </div>
  );
}

/* ─── Component Row ─── */
function ComponentRow({ component }: { component: Component }) {
  return (
    <div className="flex items-center gap-2 py-0.5 border-b border-border/5" style={{ paddingLeft: 92 }}>
      <Cpu className="w-2.5 h-2.5 text-muted-foreground/50 flex-shrink-0" />
      <span className="text-[9px] font-mono text-muted-foreground">{component.componentCode}</span>
      <span className="text-[9px] text-muted-foreground/70 truncate">{component.componentName}</span>
      {component.manufacturer && <span className="text-[8px] text-muted-foreground/50 ml-auto mr-3">{component.manufacturer}</span>}
    </div>
  );
}
