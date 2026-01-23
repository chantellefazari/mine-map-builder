import React from "react";
import { cn } from "@/lib/utils";

export type NodeLevel = "site" | "plant" | "area" | "subarea";
export type AreaType = "SITE" | "UTL" | "COM" | "REC" | "TAIL" | "SUP";

interface HierarchyNodeProps {
  code?: string;
  label: string;
  level: NodeLevel;
  areaType?: AreaType;
  children?: React.ReactNode;
  className?: string;
}

const levelStyles: Record<NodeLevel, string> = {
  site: "bg-level-site text-white px-8 py-4 text-lg font-bold shadow-lg",
  plant: "bg-level-plant text-white px-6 py-3 text-base font-semibold shadow-md",
  area: "px-5 py-2.5 text-sm font-semibold text-white shadow-md",
  subarea: "bg-card border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:shadow-md transition-shadow",
};

const areaColors: Record<AreaType, string> = {
  SITE: "bg-level-area-site",
  UTL: "bg-level-area-util",
  COM: "bg-level-area-com",
  REC: "bg-level-area-rec",
  TAIL: "bg-level-area-tail",
  SUP: "bg-level-area-sup",
};

export const HierarchyNode: React.FC<HierarchyNodeProps> = ({
  code,
  label,
  level,
  areaType,
  children,
  className,
}) => {
  const baseStyle = levelStyles[level];
  const areaColor = level === "area" && areaType ? areaColors[areaType] : "";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "rounded-lg flex items-center gap-2 whitespace-nowrap",
          baseStyle,
          areaColor
        )}
      >
        {code && (
          <span className="font-mono text-xs opacity-80 bg-black/10 px-1.5 py-0.5 rounded">
            {code}
          </span>
        )}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
};
