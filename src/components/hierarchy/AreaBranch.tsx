import React from "react";
import { HierarchyNode, AreaType } from "./HierarchyNode";

interface SubArea {
  label: string;
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
      
      {/* Sub-areas container */}
      <div className="relative flex flex-col items-center">
        {/* Horizontal connector line */}
        {subAreas.length > 1 && (
          <div 
            className="absolute top-0 h-0.5 bg-connector"
            style={{ 
              width: `${Math.max((subAreas.length - 1) * 100, 50)}%`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        )}
        
        {/* Sub-areas in vertical stack for cleaner display */}
        <div className="flex flex-col items-center gap-1">
          {subAreas.map((subArea, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Vertical connector */}
              <div className="w-0.5 h-3 bg-connector" />
              <HierarchyNode label={subArea.label} level="subarea" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
