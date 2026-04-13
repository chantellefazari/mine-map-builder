import { useState, useMemo, useCallback } from "react";
import {
  ChevronDown, ChevronRight, Settings2,
  Wrench, Cpu, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";
import { useAssetCriticality, CRITICALITY_CONFIG, type CriticalityRating } from "@/hooks/useAssetCriticality";
import type { Area, SubArea, ParentAsset, Equipment, Component } from "@/components/hierarchy/assetData";
import type { PlannerItem } from "./AdvancedPlannerView";
import { AssetMaintenancePanel } from "./AssetMaintenancePanel";

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

/* ─── Tree connector lines ─── */
function TreeIndent({ depth, isLast, parentIsLast }: { depth: number; isLast: boolean; parentIsLast: boolean[] }) {
  return (
    <div className="flex items-stretch flex-shrink-0" style={{ width: depth * 20 }}>
      {parentIsLast.map((last, i) => (
        <div key={i} className="w-5 flex-shrink-0 relative">
          {!last && <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />}
        </div>
      ))}
    </div>
  );
}

function BranchConnector({ isLast }: { isLast: boolean }) {
  return (
    <div className="w-5 flex-shrink-0 relative self-stretch">
      <div className={cn("absolute left-2 top-0 w-px bg-border", isLast ? "h-[50%]" : "h-full")} />
      <div className="absolute left-2 top-[50%] w-2.5 h-px bg-border" />
    </div>
  );
}

interface SelectedEquipment {
  equipment: Equipment;
  plans: PlannerItem[];
}

export function PlannerTreeExplorer({ items }: Props) {
  const { data: areas, isLoading } = useRevBPlantAssets();
  const { getCriticality } = useAssetCriticality();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedEquipment, setSelectedEquipment] = useState<SelectedEquipment | null>(null);

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

  const getEquipmentPlans = useCallback((equip: Equipment): PlannerItem[] => {
    const plans = [...(itemsByAsset.get(equip.assetNumber) || [])];
    if (equip.components) {
      for (const comp of equip.components) {
        const compPlans = itemsByAsset.get(comp.componentCode) || [];
        plans.push(...compPlans);
      }
    }
    return plans;
  }, [itemsByAsset]);

  const getParentPlans = useCallback((pa: ParentAsset): number => {
    return pa.equipment.reduce((s, e) => s + getEquipmentPlans(e).length, 0);
  }, [getEquipmentPlans]);

  const getSubAreaPlans = useCallback((sa: SubArea): number => {
    return sa.parentAssets.reduce((s, pa) => s + getParentPlans(pa), 0);
  }, [getParentPlans]);

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

  const selectEquipment = useCallback((equip: Equipment) => {
    const plans = getEquipmentPlans(equip);
    setSelectedEquipment({ equipment: equip, plans });
  }, [getEquipmentPlans]);

  const expandAll = useCallback(() => {
    if (!areas) return;
    const keys = new Set<string>();
    for (const area of areas) {
      keys.add(`area-${area.code}`);
      for (const sa of area.subAreas) {
        keys.add(`sa-${area.code}-${sa.label}`);
        for (const pa of sa.parentAssets) {
          keys.add(`pa-${area.code}-${sa.label}-${pa.label}`);
          for (const eq of pa.equipment) keys.add(`eq-${eq.assetNumber}`);
        }
      }
    }
    setExpanded(keys);
  }, [areas]);

  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  if (isLoading) return <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">Loading asset tree…</div>;
  if (!areas || areas.length === 0) return <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">No asset data available</div>;

  return (
    <div className="flex h-full">
      <div className={cn("flex flex-col border-r border-border bg-card transition-all", selectedEquipment ? "w-[50%]" : "w-full")}>
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
          <div className="py-1 pl-2">
            {areas.map((area, areaIdx) => (
              <AreaNode
                key={area.code}
                area={area}
                isLast={areaIdx === areas.length - 1}
                expanded={expanded}
                toggle={toggle}
                getEquipmentPlans={getEquipmentPlans}
                getParentPlans={getParentPlans}
                getSubAreaPlans={getSubAreaPlans}
                getAreaPlans={getAreaPlans}
                selectedAssetNumber={selectedEquipment?.equipment.assetNumber || null}
                onSelectEquipment={selectEquipment}
                getCriticality={getCriticality}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedEquipment && (
        <div className="flex-1 min-w-0 overflow-hidden">
          <AssetMaintenancePanel
            equipment={selectedEquipment.equipment}
            plans={selectedEquipment.plans}
            allItems={items}
            onClose={() => setSelectedEquipment(null)}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Area Node ─── */
function AreaNode({ area, isLast, expanded, toggle, getEquipmentPlans, getParentPlans, getSubAreaPlans, getAreaPlans, selectedAssetNumber, onSelectEquipment }: {
  area: Area; isLast: boolean;
  expanded: Set<string>; toggle: (k: string) => void;
  getEquipmentPlans: (e: Equipment) => PlannerItem[];
  getParentPlans: (pa: ParentAsset) => number;
  getSubAreaPlans: (sa: SubArea) => number;
  getAreaPlans: (a: Area) => number;
  selectedAssetNumber: string | null;
  onSelectEquipment: (e: Equipment) => void;
}) {
  const key = `area-${area.code}`;
  const isOpen = expanded.has(key);
  const planCount = getAreaPlans(area);

  return (
    <div>
      <div onClick={() => toggle(key)} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-muted/40 transition-colors group">
        <BranchConnector isLast={isLast} />
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
        <Badge className={cn("text-[9px] px-1.5 py-0 h-4 text-white border-0", AREA_COLORS[area.code] || "bg-muted-foreground")}>{area.code}</Badge>
        <span className="text-xs font-bold text-foreground">{area.label}</span>
        {planCount > 0 && <span className="text-[9px] text-muted-foreground ml-auto mr-3 tabular-nums">{planCount} plans</span>}
      </div>
      {isOpen && area.subAreas.map((sa, saIdx) => (
        <SubAreaNode key={sa.label} subArea={sa} areaCode={area.code} isLast={saIdx === area.subAreas.length - 1} parentIsLast={[isLast]}
          expanded={expanded} toggle={toggle} getEquipmentPlans={getEquipmentPlans} getParentPlans={getParentPlans} getSubAreaPlans={getSubAreaPlans}
          selectedAssetNumber={selectedAssetNumber} onSelectEquipment={onSelectEquipment} />
      ))}
    </div>
  );
}

/* ─── Sub-Area Node ─── */
function SubAreaNode({ subArea, areaCode, isLast, parentIsLast, expanded, toggle, getEquipmentPlans, getParentPlans, getSubAreaPlans, selectedAssetNumber, onSelectEquipment }: {
  subArea: SubArea; areaCode: string; isLast: boolean; parentIsLast: boolean[];
  expanded: Set<string>; toggle: (k: string) => void;
  getEquipmentPlans: (e: Equipment) => PlannerItem[];
  getParentPlans: (pa: ParentAsset) => number;
  getSubAreaPlans: (sa: SubArea) => number;
  selectedAssetNumber: string | null; onSelectEquipment: (e: Equipment) => void;
}) {
  const key = `sa-${areaCode}-${subArea.label}`;
  const isOpen = expanded.has(key);
  const planCount = getSubAreaPlans(subArea);

  return (
    <div>
      <div onClick={() => toggle(key)} className="flex items-center py-1.5 cursor-pointer hover:bg-muted/20 transition-colors">
        <TreeIndent depth={parentIsLast.length} isLast={isLast} parentIsLast={parentIsLast} />
        <BranchConnector isLast={isLast} />
        {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
        <span className="text-[11px] font-semibold text-foreground ml-1.5">{subArea.label}</span>
        {planCount > 0 && <span className="text-[9px] text-primary font-medium ml-2">{planCount}</span>}
      </div>
      {isOpen && subArea.parentAssets.map((pa, paIdx) => (
        <ParentAssetNode key={pa.label} parent={pa} areaCode={areaCode} subAreaLabel={subArea.label}
          isLast={paIdx === subArea.parentAssets.length - 1} parentIsLast={[...parentIsLast, isLast]}
          expanded={expanded} toggle={toggle} getEquipmentPlans={getEquipmentPlans} getParentPlans={getParentPlans}
          selectedAssetNumber={selectedAssetNumber} onSelectEquipment={onSelectEquipment} />
      ))}
    </div>
  );
}

/* ─── Parent Asset Node ─── */
function ParentAssetNode({ parent, areaCode, subAreaLabel, isLast, parentIsLast, expanded, toggle, getEquipmentPlans, getParentPlans, selectedAssetNumber, onSelectEquipment }: {
  parent: ParentAsset; areaCode: string; subAreaLabel: string; isLast: boolean; parentIsLast: boolean[];
  expanded: Set<string>; toggle: (k: string) => void;
  getEquipmentPlans: (e: Equipment) => PlannerItem[];
  getParentPlans: (pa: ParentAsset) => number;
  selectedAssetNumber: string | null; onSelectEquipment: (e: Equipment) => void;
}) {
  const key = `pa-${areaCode}-${subAreaLabel}-${parent.label}`;
  const isOpen = expanded.has(key);
  const planCount = getParentPlans(parent);

  return (
    <div>
      <div onClick={() => toggle(key)} className="flex items-center py-1.5 cursor-pointer hover:bg-muted/20 transition-colors">
        <TreeIndent depth={parentIsLast.length} isLast={isLast} parentIsLast={parentIsLast} />
        <BranchConnector isLast={isLast} />
        {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
        <Settings2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 ml-1" />
        <span className="text-[11px] font-medium text-foreground ml-1.5">{parent.label}</span>
        {parent.functionalLocation && (
          <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 font-mono ml-1.5">{parent.functionalLocation}</Badge>
        )}
        {planCount > 0 && (
          <span className="text-[9px] text-muted-foreground ml-auto mr-3 tabular-nums">{parent.equipment.length} equip · {planCount} plans</span>
        )}
      </div>
      {isOpen && parent.equipment.map((eq, eqIdx) => (
        <EquipmentNode key={eq.assetNumber} equipment={eq} isLast={eqIdx === parent.equipment.length - 1}
          parentIsLast={[...parentIsLast, isLast]} expanded={expanded} toggle={toggle}
          plans={getEquipmentPlans(eq)} selectedAssetNumber={selectedAssetNumber} onSelectEquipment={onSelectEquipment} />
      ))}
    </div>
  );
}

/* ─── Equipment Node ─── */
function EquipmentNode({ equipment, isLast, parentIsLast, expanded, toggle, plans, selectedAssetNumber, onSelectEquipment }: {
  equipment: Equipment; isLast: boolean; parentIsLast: boolean[];
  expanded: Set<string>; toggle: (k: string) => void;
  plans: PlannerItem[];
  selectedAssetNumber: string | null; onSelectEquipment: (e: Equipment) => void;
}) {
  const key = `eq-${equipment.assetNumber}`;
  const isOpen = expanded.has(key);
  const hasComponents = equipment.components && equipment.components.length > 0;
  const isSelected = selectedAssetNumber === equipment.assetNumber;

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 transition-colors cursor-pointer",
          isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/20"
        )}
        onClick={() => onSelectEquipment(equipment)}
      >
        <TreeIndent depth={parentIsLast.length} isLast={isLast} parentIsLast={parentIsLast} />
        <BranchConnector isLast={isLast} />
        {hasComponents ? (
          <button onClick={(e) => { e.stopPropagation(); toggle(key); }} className="flex-shrink-0">
            {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
          </button>
        ) : <span className="w-3 flex-shrink-0" />}
        <Wrench className="w-3 h-3 text-blue-500 flex-shrink-0 ml-1" />
        <span className="text-[10px] font-mono font-semibold text-foreground ml-1.5">{equipment.assetNumber}</span>
        <span className="text-[10px] text-muted-foreground ml-1.5 truncate">{equipment.name}</span>
        {plans.length > 0 && (
          <div className="flex items-center gap-0.5 ml-auto mr-3 flex-shrink-0">
            {plans.slice(0, 6).map(p => (
              <span key={p.id} className={cn("w-1.5 h-1.5 rounded-full", WO_TYPE_DOTS[p.woType])} title={`${p.woType}: ${p.taskName}`} />
            ))}
            <span className="text-[9px] text-primary font-medium ml-1">{plans.length}</span>
          </div>
        )}
      </div>

      {isOpen && hasComponents && equipment.components!.map((comp, ci) => (
        <ComponentNode key={`${comp.componentCode}-${ci}`} component={comp}
          isLast={ci === equipment.components!.length - 1} parentIsLast={[...parentIsLast, isLast]} />
      ))}
    </div>
  );
}

/* ─── Component Node ─── */
function ComponentNode({ component, isLast, parentIsLast }: { component: Component; isLast: boolean; parentIsLast: boolean[] }) {
  return (
    <div className="flex items-center py-0.5">
      <TreeIndent depth={parentIsLast.length} isLast={isLast} parentIsLast={parentIsLast} />
      <BranchConnector isLast={isLast} />
      <Cpu className="w-2.5 h-2.5 text-muted-foreground/50 flex-shrink-0 ml-1" />
      <span className="text-[9px] font-mono text-muted-foreground ml-1.5">{component.componentCode}</span>
      <span className="text-[9px] text-muted-foreground/70 ml-1.5 truncate">{component.componentName}</span>
      {component.manufacturer && <span className="text-[8px] text-muted-foreground/50 ml-auto mr-3">{component.manufacturer}</span>}
    </div>
  );
}