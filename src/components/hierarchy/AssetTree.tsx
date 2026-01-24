import React, { useMemo } from "react";
import { CollapsibleTreeNode, AreaType } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { useAssetSearch } from "@/hooks/useAssetSearch";

// Asset hierarchy data structure
interface Equipment {
  assetNumber: string;
  name: string;
}

interface System {
  label: string;
  equipment: Equipment[];
}

interface SubArea {
  label: string;
  systems: System[];
}

interface Area {
  code: AreaType;
  label: string;
  subAreas: SubArea[];
}

interface AssetTreeProps {
  searchQuery?: string;
}

const areasData: Area[] = [
  {
    code: "SITE",
    label: "Site",
    subAreas: [
      {
        label: "Site Infrastructure",
        systems: [
          { label: "Site (Top Level)", equipment: [] },
          { label: "Admin Building", equipment: [] },
          { label: "Toilets / Amenities", equipment: [] },
          { label: "Crib Room", equipment: [] },
          { label: "Change Rooms", equipment: [] },
        ],
      },
    ],
  },
  {
    code: "UTL",
    label: "Utilities & Power",
    subAreas: [
      {
        label: "Compressed Air",
        systems: [
          { label: "Air Compressors", equipment: [] },
          { label: "Air Receivers", equipment: [] },
          { label: "Air Dryers", equipment: [] },
        ],
      },
      {
        label: "Electrical / Controls",
        systems: [
          { label: "Main Distribution Boards", equipment: [] },
          { label: "Sub Distribution Boards", equipment: [] },
          { label: "Control Rooms", equipment: [] },
          { label: "Control Subrooms", equipment: [] },
          { label: "Ice Machine Room DB", equipment: [] },
          { label: "Crib Room L&P DB", equipment: [] },
          { label: "Lath Container L&P", equipment: [] },
        ],
      },
      {
        label: "Power Generation",
        systems: [
          { label: "Generator Sets", equipment: [] },
          { label: "Fuel Storage", equipment: [] },
          { label: "Fuel Dispensing Control Board", equipment: [] },
        ],
      },
      {
        label: "Reagents (Lime)",
        systems: [
          { label: "Lime Storage", equipment: [] },
          { label: "Lime Dosing", equipment: [] },
          { label: "Lime Agitation", equipment: [] },
        ],
      },
      {
        label: "Water",
        systems: [
          { label: "Potable Water Tanks", equipment: [] },
          { label: "Raw Water System", equipment: [] },
          { label: "Process Water System", equipment: [] },
        ],
      },
    ],
  },
  {
    code: "COM",
    label: "Comminution / Process",
    subAreas: [
      {
        label: "Feed / Reclaim",
        systems: [
          { label: "Feed Hoppers", equipment: [] },
          { label: "Reclaim Hoppers", equipment: [] },
          { label: "Apron Feeders", equipment: [] },
        ],
      },
      {
        label: "Conveying",
        systems: [
          { label: "Conveyors", equipment: [] },
          { label: "Transfer Chutes", equipment: [] },
          { label: "Drive Systems", equipment: [] },
        ],
      },
      {
        label: "Grinding",
        systems: [
          { label: "Ball Mill", equipment: [] },
          { label: "Pinion & Girth Gear", equipment: [] },
          { label: "Mill Lubrication System", equipment: [] },
          { label: "Mill Drive Motor", equipment: [] },
        ],
      },
      {
        label: "Classification",
        systems: [
          { label: "Cyclones", equipment: [] },
          { label: "Sumps", equipment: [] },
          { label: "Cyclone Feed Pumps", equipment: [] },
        ],
      },
    ],
  },
  {
    code: "REC",
    label: "Gold Recovery",
    subAreas: [
      {
        label: "Gravity Circuit",
        systems: [
          { label: "Gravity Concentrators", equipment: [] },
          { label: "Concentrate Pumps", equipment: [] },
        ],
      },
      {
        label: "CIP",
        systems: [
          { label: "CIP Tanks", equipment: [] },
          { label: "Agitators", equipment: [] },
          { label: "Interstage Screens", equipment: [] },
          { label: "CIP Pumps", equipment: [] },
        ],
      },
      {
        label: "Elution",
        systems: [
          { label: "Elution Column", equipment: [] },
          { label: "Heat Exchanger", equipment: [] },
          { label: "Acid Wash System", equipment: [] },
        ],
      },
      {
        label: "Gold Room",
        systems: [
          { label: "Electrowinning Cells", equipment: [] },
          { label: "Smelting Furnace", equipment: [] },
          { label: "Gold Pour Area", equipment: [] },
        ],
      },
      {
        label: "Additional Gold Recovery Systems",
        systems: [
          { label: "Cyanide Mixing Tank & Agitator", equipment: [] },
          { label: "Titration Hut", equipment: [] },
          { label: "Regen Kiln Feed Hopper", equipment: [] },
          { label: "Regen Kiln Zone Systems", equipment: [] },
          { label: "Gold Recovery Services Systems", equipment: [] },
        ],
      },
    ],
  },
  {
    code: "TAIL",
    label: "Tailings",
    subAreas: [
      {
        label: "Thickening",
        systems: [
          { label: "Thickeners", equipment: [] },
          { label: "Rakes", equipment: [] },
          { label: "Underflow Pumps", equipment: [] },
        ],
      },
      {
        label: "Filtering",
        systems: [
          { label: "Filters", equipment: [] },
          { label: "Filtrate Pumps", equipment: [] },
        ],
      },
    ],
  },
  {
    code: "SUP",
    label: "Support Services",
    subAreas: [
      {
        label: "Workshop",
        systems: [
          { label: "Fixed Plant Workshop Equipment", equipment: [] },
        ],
      },
      {
        label: "Lab",
        systems: [
          { label: "Assay Equipment", equipment: [] },
          { label: "Sample Prep Equipment", equipment: [] },
        ],
      },
      {
        label: "Mobile Equipment",
        systems: [
          { label: "Plant Mobile Equipment", equipment: [] },
        ],
      },
      {
        label: "Light Vehicles (LV)",
        systems: [
          { label: "LV Fleet", equipment: [] },
        ],
      },
      {
        label: "Heavy Vehicles (HV)",
        systems: [
          { label: "HV Fleet", equipment: [] },
        ],
      },
    ],
  },
];

export const AssetTree: React.FC<AssetTreeProps> = ({ searchQuery = "" }) => {
  const { matchingPaths } = useAssetSearch(areasData, searchQuery);
  const hasSearch = searchQuery.trim().length > 0;

  // Helper to check if a path should be expanded due to search
  const shouldExpandForSearch = (pathParts: string[]) => {
    if (!hasSearch) return false;
    return matchingPaths.has(pathParts.join("/"));
  };

  // Helper to check if an item matches search
  const matchesSearch = (text: string) => {
    if (!hasSearch) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="min-w-max flex justify-center">
        {/* Root: Site - Centered */}
        <CollapsibleTreeNode label="TCMG" level="site" hasChildren defaultExpanded centered>
          {/* Level 2: Facilities - Mining, Crushing Plant, Processing Plant */}
          
          {/* Mining (placeholder - no areas yet) */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Mining" level="plant" hasChildren={false} />
          </TreeBranch>
          
          {/* Crushing Plant */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Crushing Plant" level="plant" hasChildren defaultExpanded>
              <TreeBranch isLast={false}>
                <CollapsibleTreeNode label="ROM" level="subarea" hasChildren={false} />
              </TreeBranch>
              <TreeBranch isLast={false}>
                <CollapsibleTreeNode label="Crushing" level="subarea" hasChildren={false} />
              </TreeBranch>
              <TreeBranch isLast={true}>
                <CollapsibleTreeNode label="Screening" level="subarea" hasChildren={false} />
              </TreeBranch>
            </CollapsibleTreeNode>
          </TreeBranch>
          
          {/* Processing Plant */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Processing Plant" level="plant" hasChildren defaultExpanded>
              {/* Level 3: Areas */}
              {areasData.map((area, areaIndex) => {
                const areaPath = [area.code];
                const areaExpanded = shouldExpandForSearch(areaPath);
                
                return (
                  <TreeBranch key={area.code} isLast={areaIndex === areasData.length - 1}>
                    <CollapsibleTreeNode
                      code={area.code}
                      label={area.label}
                      level="area"
                      areaType={area.code}
                      hasChildren={area.subAreas.length > 0}
                      defaultExpanded={areaExpanded}
                      forceExpanded={areaExpanded}
                      isHighlighted={matchesSearch(area.label) || matchesSearch(area.code)}
                    >
                      {/* Level 4: Sub Areas */}
                      {area.subAreas.map((subArea, subIndex) => {
                        const subAreaPath = [...areaPath, subArea.label];
                        const subAreaExpanded = shouldExpandForSearch(subAreaPath);
                        
                        return (
                          <TreeBranch key={subIndex} isLast={subIndex === area.subAreas.length - 1}>
                            <CollapsibleTreeNode
                              label={subArea.label}
                              level="subarea"
                              hasChildren={subArea.systems.length > 0}
                              defaultExpanded={subAreaExpanded}
                              forceExpanded={subAreaExpanded}
                              isHighlighted={matchesSearch(subArea.label)}
                            >
                              {/* Level 5: Systems */}
                              {subArea.systems.map((system, sysIndex) => {
                                const systemPath = [...subAreaPath, system.label];
                                const systemExpanded = shouldExpandForSearch(systemPath);
                                
                                return (
                                  <TreeBranch key={sysIndex} isLast={sysIndex === subArea.systems.length - 1}>
                                    <CollapsibleTreeNode
                                      label={system.label}
                                      level="system"
                                      hasChildren={system.equipment.length > 0}
                                      defaultExpanded={systemExpanded}
                                      forceExpanded={systemExpanded}
                                      isHighlighted={matchesSearch(system.label)}
                                    >
                                      {/* Level 6: Equipment */}
                                      {system.equipment.map((equip, equipIndex) => {
                                        const equipLabel = `${equip.assetNumber} — ${equip.name}`;
                                        return (
                                          <TreeBranch key={equipIndex} isLast={equipIndex === system.equipment.length - 1}>
                                            <CollapsibleTreeNode
                                              label={equipLabel}
                                              level="equipment"
                                              hasChildren={false}
                                              isHighlighted={matchesSearch(equip.assetNumber) || matchesSearch(equip.name)}
                                            />
                                          </TreeBranch>
                                        );
                                      })}
                                    </CollapsibleTreeNode>
                                  </TreeBranch>
                                );
                              })}
                            </CollapsibleTreeNode>
                          </TreeBranch>
                        );
                      })}
                    </CollapsibleTreeNode>
                  </TreeBranch>
                );
              })}
            </CollapsibleTreeNode>
          </TreeBranch>
        </CollapsibleTreeNode>
      </div>
    </div>
  );
};
