import React from "react";
import { cn } from "@/lib/utils";

interface LegendItemProps {
  level: string;
  description: string;
  colorClass: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({ level, description, colorClass }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-4 h-4 rounded", colorClass)} />
      <div className="text-sm">
        <span className="font-semibold text-foreground">{level}</span>
        <span className="text-muted-foreground"> — {description}</span>
      </div>
    </div>
  );
};
