import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Minus, Tag, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFLBreadcrumb, FLPathSegment } from "./FLBreadcrumbContext";

export type NodeLevel = "site" | "plant" | "area" | "subarea" | "parentAsset" | "equipment" | "component";
export type AreaType = "SITE" | "UTL" | "COM" | "REC" | "TAIL" | "SUP" | "CRU";

interface ComponentSpecs {
  model?: string;
  serialNumber?: string;
  oilType?: string;
  oilVolume?: string;
  inputSpeed?: string;
  outputSpeed?: string;
  weight?: string;
  manufacturer?: string;
  // Pump/motor specs
  motorSpeed?: string;
  protection?: string;
  voltage?: string;
  pumpFlow?: string;
  operatingPressure?: string;
  displacement?: string;
  motorRef?: string;
  pumpRef?: string;
}

interface CollapsibleTreeNodeProps {
  id?: string;
  code?: string;
  label: string;
  level: NodeLevel;
  areaType?: AreaType;
  children?: React.ReactNode;
  hasChildren?: boolean;
  defaultExpanded?: boolean;
  forceExpanded?: boolean;
  isHighlighted?: boolean;
  centered?: boolean;
  /** Legacy P&ID tag references */
  pidTags?: string[];
  /** Component specifications for tooltip display */
  componentSpecs?: ComponentSpecs;
  /** Depth in the tree for FL breadcrumb tracking */
  depth?: number;
  /** Full ancestry path for FL breadcrumb (passed from parent) */
  ancestorPath?: FLPathSegment[];
  /** DB-stored functional location code */
  storedFL?: string;
}

const levelStyles: Record<NodeLevel, string> = {
  site: "bg-level-site text-white px-6 py-3 text-base font-bold shadow-lg",
  plant: "bg-level-plant text-white px-5 py-2.5 text-sm font-semibold shadow-md",
  area: "px-4 py-2 text-xs font-semibold text-white shadow-md",
  subarea: "bg-level-subarea border border-level-system text-level-subarea-foreground px-3 py-1.5 text-xs font-medium shadow-sm hover:shadow-md transition-shadow",
  parentAsset: "bg-level-parent-asset border border-level-subarea text-level-parent-asset-foreground px-2.5 py-1.5 text-[11px] font-semibold hover:brightness-95 transition-all",
  equipment: "bg-level-equipment border border-level-system text-level-equipment-foreground px-2 py-1 text-[10px] font-mono hover:brightness-95 transition-all",
  component: "bg-level-component border border-level-component-border text-level-component-foreground px-2 py-1 text-[9px] font-mono hover:brightness-95 transition-all",
};

const areaColors: Record<AreaType, string> = {
  SITE: "bg-level-area-site",
  UTL: "bg-level-area-util",
  COM: "bg-level-area-com",
  REC: "bg-level-area-rec",
  TAIL: "bg-level-area-tail",
  SUP: "bg-level-area-sup",
  CRU: "bg-amber-500",
};

// Per sub-area colours for CRU nodes (keyed on short code: ROM, PRI, SCN, etc.)
export const cruSubAreaColors: Record<string, string> = {
  "ROM": "bg-[hsl(var(--level-area-cru-rom))]",
  "PRI": "bg-[hsl(var(--level-area-cru-pri))]",
  "SCN": "bg-[hsl(var(--level-area-cru-scn))]",
  "SEC": "bg-[hsl(var(--level-area-cru-sec))]",
  "STK": "bg-[hsl(var(--level-area-cru-stk))]",
  "CTL": "bg-[hsl(var(--level-area-cru-ctl))]",
  "DUS": "bg-[hsl(var(--level-area-cru-dus))]",
};

export const CollapsibleTreeNode: React.FC<CollapsibleTreeNodeProps> = ({
  id,
  code,
  label,
  level,
  areaType,
  children,
  hasChildren = false,
  defaultExpanded = false,
  forceExpanded = false,
  isHighlighted = false,
  centered = false,
  pidTags = [],
  componentSpecs,
  depth,
  ancestorPath = [],
  storedFL,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || forceExpanded);
  const nodeRef = useRef<HTMLDivElement>(null);
  const hasPidTags = pidTags.length > 0;
  const hasSpecs = componentSpecs && Object.values(componentSpecs).some(v => v);
  const { setFullPath } = useFLBreadcrumb();

  // Build this node's own segment
  const selfSegment: FLPathSegment = { level, label, code: code || areaType, areaType };
  // Full path from root to this node
  const fullPath = [...ancestorPath, selfSegment];
  
  // React to forceExpanded changes from search
  useEffect(() => {
    if (forceExpanded) {
      setIsExpanded(true);
    } else if (!forceExpanded && !defaultExpanded) {
      // Collapse back when search is cleared (unless it was default expanded)
      setIsExpanded(false);
    } else if (defaultExpanded) {
      // Ensure default-expanded nodes stay open after data loads
      setIsExpanded(true);
    }
  }, [forceExpanded, defaultExpanded]);

  // Pulse animation + scroll into view for highlighted nodes
  useEffect(() => {
    if (isHighlighted && nodeRef.current) {
      nodeRef.current.classList.add("animate-pulse");
      // Scroll to first highlighted match after tree expansion settles
      const scrollTimeout = setTimeout(() => {
        nodeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
      const pulseTimeout = setTimeout(() => {
        nodeRef.current?.classList.remove("animate-pulse");
      }, 2000);
      return () => {
        clearTimeout(scrollTimeout);
        clearTimeout(pulseTimeout);
      };
    }
  }, [isHighlighted]);
  
  const baseStyle = levelStyles[level];
  const areaColor = level === "area" && areaType
    ? (areaType === "CRU" && code ? (cruSubAreaColors[code] ?? areaColors["CRU"]) : areaColors[areaType])
    : "";
  const canExpand = hasChildren && children;

  const { clearPath } = useFLBreadcrumb();
  
  const handleToggle = () => {
    if (canExpand) {
      const willExpand = !isExpanded;
      setIsExpanded(willExpand);
      if (willExpand && depth !== undefined) {
        // Report the full correct path from root to this node, with stored FL if available
        setFullPath(fullPath, storedFL || null);
      } else if (!willExpand) {
        // On collapse: show parent path (everything except this node's segment)
        if (fullPath.length > 1) {
          setFullPath(fullPath.slice(0, -1), null);
        } else {
          clearPath();
        }
      }
    }
  };

  const nodeContent = (
    <div
      id={id}
      ref={nodeRef}
      onClick={handleToggle}
      className={cn(
        "rounded-lg flex items-center gap-1.5 whitespace-nowrap select-none transition-all duration-300",
        baseStyle,
        areaColor,
        canExpand && "cursor-pointer hover:ring-2 hover:ring-primary/30",
        isHighlighted && "ring-2 ring-search-highlight ring-offset-2 ring-offset-background shadow-lg shadow-search-glow/40"
      )}
    >
      {/* Expand/collapse icon */}
      {canExpand ? (
        isExpanded ? (
          <ChevronDown className="w-3 h-3 opacity-70" />
        ) : (
          <ChevronRight className="w-3 h-3 opacity-70" />
        )
      ) : level !== "equipment" && level !== "site" && level !== "plant" ? (
        <Minus className="w-3 h-3 opacity-40" />
      ) : null}
      
      {code && (
        <span className="font-mono text-[10px] opacity-80 bg-black/10 px-1 py-0.5 rounded">
          {code}
        </span>
      )}
      <span>{label}</span>
      
      {/* P&ID tag indicator */}
      {hasPidTags && (
        <Tag className="w-3 h-3 opacity-60 ml-1" />
      )}
      
      {/* Component specs indicator */}
      {hasSpecs && (
        <Info className="w-3 h-3 opacity-60 ml-1 text-primary" />
      )}
    </div>
  );

  // Determine if we need a tooltip (P&ID tags or component specs)
  const needsTooltip = hasPidTags || hasSpecs;

  const tooltipContent = hasSpecs ? (
    <div className="space-y-2">
      <p className="text-xs font-semibold border-b pb-1">Component Specifications</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {componentSpecs?.model && (
          <>
            <span className="text-muted-foreground">Model:</span>
            <span className="font-mono">{componentSpecs.model}</span>
          </>
        )}
        {componentSpecs?.serialNumber && (
          <>
            <span className="text-muted-foreground">Serial:</span>
            <span className="font-mono">{componentSpecs.serialNumber}</span>
          </>
        )}
        {componentSpecs?.motorRef && (
          <>
            <span className="text-muted-foreground">Motor Ref:</span>
            <span className="font-mono">{componentSpecs.motorRef}</span>
          </>
        )}
        {componentSpecs?.pumpRef && (
          <>
            <span className="text-muted-foreground">Pump Ref:</span>
            <span className="font-mono">{componentSpecs.pumpRef}</span>
          </>
        )}
        {componentSpecs?.motorSpeed && (
          <>
            <span className="text-muted-foreground">Motor Speed:</span>
            <span className="font-mono">{componentSpecs.motorSpeed}</span>
          </>
        )}
        {componentSpecs?.protection && (
          <>
            <span className="text-muted-foreground">Protection:</span>
            <span className="font-mono">{componentSpecs.protection}</span>
          </>
        )}
        {componentSpecs?.voltage && (
          <>
            <span className="text-muted-foreground">Voltage:</span>
            <span className="font-mono">{componentSpecs.voltage}</span>
          </>
        )}
        {componentSpecs?.pumpFlow && (
          <>
            <span className="text-muted-foreground">Pump Flow:</span>
            <span className="font-mono">{componentSpecs.pumpFlow}</span>
          </>
        )}
        {componentSpecs?.operatingPressure && (
          <>
            <span className="text-muted-foreground">Operating Pressure:</span>
            <span className="font-mono">{componentSpecs.operatingPressure}</span>
          </>
        )}
        {componentSpecs?.displacement && (
          <>
            <span className="text-muted-foreground">Displacement:</span>
            <span className="font-mono">{componentSpecs.displacement}</span>
          </>
        )}
        {componentSpecs?.oilType && (
          <>
            <span className="text-muted-foreground">Oil Type:</span>
            <span className="font-mono">{componentSpecs.oilType}</span>
          </>
        )}
        {componentSpecs?.oilVolume && (
          <>
            <span className="text-muted-foreground">Oil Volume:</span>
            <span className="font-mono">{componentSpecs.oilVolume}</span>
          </>
        )}
        {componentSpecs?.inputSpeed && (
          <>
            <span className="text-muted-foreground">Input Speed:</span>
            <span className="font-mono">{componentSpecs.inputSpeed}</span>
          </>
        )}
        {componentSpecs?.outputSpeed && (
          <>
            <span className="text-muted-foreground">Output Speed:</span>
            <span className="font-mono">{componentSpecs.outputSpeed}</span>
          </>
        )}
        {componentSpecs?.weight && (
          <>
            <span className="text-muted-foreground">Weight:</span>
            <span className="font-mono">{componentSpecs.weight}</span>
          </>
        )}
      </div>
    </div>
  ) : hasPidTags ? (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">Legacy Reference – P&ID</p>
      <div className="flex flex-wrap gap-1">
        {pidTags.map((tag, idx) => (
          <span 
            key={idx} 
            className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className={cn("flex flex-col", centered ? "items-center" : "items-start")}>
      {/* Node with optional tooltip */}
      {needsTooltip ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              {nodeContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-sm">
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        nodeContent
      )}

      {/* Children branch downward */}
      {canExpand && isExpanded && (
        <div className={cn("flex mt-1", centered ? "flex-col items-center" : "ml-4")}>
          {/* Vertical connector line */}
          {centered ? (
            <div className="w-0.5 h-4 bg-connector" />
          ) : (
            <div className="w-0.5 bg-connector mr-2 self-stretch" />
          )}
          
          {/* Children container */}
          <div className={cn("flex gap-1", centered ? "flex-row items-start" : "flex-col")}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
