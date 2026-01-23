import React from "react";
import { LegendItem } from "./LegendItem";

export const Legend: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
        Hierarchy Levels
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LegendItem level="Level 1" description="Business Entity" colorClass="bg-level-site" />
        <LegendItem level="Level 2" description="Facility" colorClass="bg-level-plant" />
        <LegendItem level="Level 3" description="Major Area" colorClass="bg-primary" />
        <LegendItem level="Level 4" description="Sub-Area" colorClass="bg-card border border-border" />
      </div>
      
      <h3 className="text-sm font-semibold text-foreground mt-6 mb-4 uppercase tracking-wide">
        Major Areas
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <LegendItem level="SITE" description="Site" colorClass="bg-level-area-site" />
        <LegendItem level="UTL" description="Utilities & Power" colorClass="bg-level-area-util" />
        <LegendItem level="COM" description="Comminution" colorClass="bg-level-area-com" />
        <LegendItem level="REC" description="Gold Recovery" colorClass="bg-level-area-rec" />
        <LegendItem level="TAIL" description="Tailings" colorClass="bg-level-area-tail" />
        <LegendItem level="SUP" description="Support" colorClass="bg-level-area-sup" />
      </div>
    </div>
  );
};
