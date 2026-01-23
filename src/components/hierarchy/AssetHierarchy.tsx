import React from "react";
import { HierarchyNode } from "./HierarchyNode";
import { AreaBranch } from "./AreaBranch";

// Asset hierarchy data structure
const hierarchyData = {
  site: {
    label: "TCMG",
    level1: {
      label: "Processing Plant",
      areas: [
        {
          code: "SITE" as const,
          label: "Site",
          subAreas: [{ label: "Site Infrastructure" }],
        },
        {
          code: "UTL" as const,
          label: "Utilities & Power",
          subAreas: [
            { label: "Compressed Air" },
            { label: "Electrical / Controls" },
            { label: "Power Generation" },
            { label: "Reagents (Lime)" },
            { label: "Water" },
          ],
        },
        {
          code: "COM" as const,
          label: "Comminution & Process",
          subAreas: [
            { label: "Feed / Reclaim" },
            { label: "Conveying" },
            { label: "Grinding" },
            { label: "Classification" },
          ],
        },
        {
          code: "REC" as const,
          label: "Gold Recovery",
          subAreas: [
            { label: "Gravity Circuit" },
            { label: "CIP" },
            { label: "Elution" },
            { label: "Gold Room" },
          ],
        },
        {
          code: "TAIL" as const,
          label: "Tailings",
          subAreas: [
            { label: "Thickening" },
            { label: "Filtering" },
          ],
        },
        {
          code: "SUP" as const,
          label: "Support Services",
          subAreas: [
            { label: "Laboratory" },
            { label: "Mobile Equipment" },
            { label: "Light Vehicles (LV)" },
            { label: "Heavy Vehicles (HV)" },
          ],
        },
      ],
    },
  },
};

export const AssetHierarchy: React.FC = () => {
  const { site } = hierarchyData;

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="min-w-[1400px] flex flex-col items-center px-8">
        {/* Level 1: Site (TCMG) */}
        <HierarchyNode label={site.label} level="site" />
        
        {/* Connector */}
        <div className="w-0.5 h-8 bg-connector" />
        
        {/* Level 2: Processing Plant */}
        <HierarchyNode label={site.level1.label} level="plant" />
        
        {/* Connector */}
        <div className="w-0.5 h-8 bg-connector" />
        
        {/* Level 3 & 4: Major Areas with Sub-Areas */}
        <div className="relative w-full">
          {/* Horizontal connector spanning all areas */}
          <div className="absolute top-0 left-[8%] right-[8%] h-0.5 bg-connector" />
          
          {/* Areas grid */}
          <div className="flex justify-center gap-4">
            {site.level1.areas.map((area) => (
              <div key={area.code} className="flex flex-col items-center flex-1 max-w-[200px]">
                {/* Vertical connector from horizontal line */}
                <div className="w-0.5 h-8 bg-connector" />
                <AreaBranch
                  code={area.code}
                  label={area.label}
                  subAreas={area.subAreas}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
