import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Minus } from "lucide-react";

export type NodeLevel = "site" | "plant" | "area" | "subarea" | "parentAsset" | "equipment";
export type AreaType = "SITE" | "UTL" | "COM" | "REC" | "TAIL" | "SUP";

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
}

const levelStyles: Record<NodeLevel, string> = {
  site: "bg-level-site text-white px-6 py-3 text-base font-bold shadow-lg",
  plant: "bg-level-plant text-white px-5 py-2.5 text-sm font-semibold shadow-md",
  area: "px-4 py-2 text-xs font-semibold text-white shadow-md",
  subarea: "bg-level-subarea border border-level-system text-level-subarea-foreground px-3 py-1.5 text-xs font-medium shadow-sm hover:shadow-md transition-shadow",
  parentAsset: "bg-level-parent-asset border border-level-subarea text-level-parent-asset-foreground px-2.5 py-1.5 text-[11px] font-semibold hover:brightness-95 transition-all",
  equipment: "bg-level-equipment border border-level-system text-level-equipment-foreground px-2 py-1 text-[10px] font-mono hover:brightness-95 transition-all",
};

const areaColors: Record<AreaType, string> = {
  SITE: "bg-level-area-site",
  UTL: "bg-level-area-util",
  COM: "bg-level-area-com",
  REC: "bg-level-area-rec",
  TAIL: "bg-level-area-tail",
  SUP: "bg-level-area-sup",
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
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || forceExpanded);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // React to forceExpanded changes from search
  useEffect(() => {
    if (forceExpanded) {
      setIsExpanded(true);
    }
  }, [forceExpanded]);

  // Pulse animation for highlighted nodes
  useEffect(() => {
    if (isHighlighted && nodeRef.current) {
      nodeRef.current.classList.add("animate-pulse");
      const timeout = setTimeout(() => {
        nodeRef.current?.classList.remove("animate-pulse");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isHighlighted]);
  
  const baseStyle = levelStyles[level];
  const areaColor = level === "area" && areaType ? areaColors[areaType] : "";
  const canExpand = hasChildren && children;

  const handleToggle = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={cn("flex flex-col", centered ? "items-center" : "items-start")}>
      {/* Node itself */}
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
      </div>

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
