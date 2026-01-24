import React from "react";
import { HierarchyNode, AreaType } from "./HierarchyNode";

interface System {
  label: string;
}

interface SubArea {
  label: string;
  systems: System[];
}

interface AreaBranchProps {
  code: AreaType;
  label: string;
  subAreas: SubArea[];
}

export const AreaBranch: React.FC<AreaBranchProps> = ({ code, label, subAreas }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Area Node */}
      <HierarchyNode code={code} label={label} level="area" areaType={code} />
      
      {/* Connector line down */}
      <div className="w-0.5 h-4 bg-connector" />
      
      {/* Sub-areas in vertical stack */}
      <div className="flex flex-col items-center gap-1">
        {subAreas.map((subArea, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Vertical connector to sub-area */}
            <div className="w-0.5 h-3 bg-connector" />
            <HierarchyNode label={subArea.label} level="subarea" />
            
            {/* Systems under this sub-area */}
            {subArea.systems.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-2 bg-connector/60" />
                <div className="flex flex-col items-center gap-0.5">
                  {subArea.systems.map((system, sysIndex) => (
                    <div key={sysIndex} className="flex flex-col items-center">
                      <div className="w-0.5 h-1.5 bg-connector/40" />
                      <HierarchyNode label={system.label} level="system" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
