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
          {
            label: "Site (Top Level)",
            equipment: [
              { assetNumber: "SITE-GOLD-001", name: "Gold Plant" },
            ],
          },
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
          {
            label: "Compressed Air System",
            equipment: [
              { assetNumber: "CA-COMP-001", name: "HP Air Compressor" },
              { assetNumber: "CA-COMP-002", name: "HP Air Compressor Piping" },
              { assetNumber: "CA-COMP-003", name: "HP Air Compressor MCC Cell" },
              { assetNumber: "CA-COMP-004", name: "HP Air Compressor" },
              { assetNumber: "CA-COMP-005", name: "HP Air Compressor Piping" },
              { assetNumber: "CA-COMP-006", name: "HP Air Compressor MCC Cell" },
              { assetNumber: "CA-DRYR-001", name: "Air Dryer" },
              { assetNumber: "CA-DRYR-002", name: "Air Receiver" },
              { assetNumber: "CA-FLTR-001", name: "Air Filter" },
              { assetNumber: "CA-FLTR-002", name: "Air Filter" },
              { assetNumber: "CA-VALV-001", name: "Air Distribution Valve" },
              { assetNumber: "CA-VALV-002", name: "Air Distribution Valve" },
            ],
          },
        ],
      },
      {
        label: "Electrical / Controls",
        systems: [
          {
            label: "Plant Power Distribution",
            equipment: [
              { assetNumber: "EL-MCC-001", name: "Main MCC" },
              { assetNumber: "EL-MCC-002", name: "Secondary MCC" },
              { assetNumber: "EL-MCC-003", name: "MCC Distribution Board" },
            ],
          },
          {
            label: "Instrumentation & Control",
            equipment: [
              { assetNumber: "EL-PLC-001", name: "PLC Panel" },
              { assetNumber: "EL-SCADA-001", name: "SCADA Workstation" },
              { assetNumber: "EL-UPS-001", name: "UPS System" },
            ],
          },
        ],
      },
      {
        label: "Power Generation",
        systems: [
          {
            label: "Generator Sets",
            equipment: [
              { assetNumber: "PG-GEN-001", name: "Generator Set" },
              { assetNumber: "PG-GEN-002", name: "Generator Set" },
            ],
          },
          {
            label: "Fuel System",
            equipment: [
              { assetNumber: "PG-FUEL-001", name: "Fuel Tank" },
              { assetNumber: "PG-FUEL-002", name: "Fuel Pump" },
            ],
          },
        ],
      },
      {
        label: "Reagents (Lime)",
        systems: [
          {
            label: "Lime Handling & Dosing",
            equipment: [
              { assetNumber: "RL-SILO-001", name: "Lime Silo" },
              { assetNumber: "RL-FDR-001", name: "Lime Feeder" },
              { assetNumber: "RL-PUMP-001", name: "Lime Dosing Pump" },
            ],
          },
        ],
      },
      {
        label: "Water",
        systems: [
          {
            label: "Raw Water",
            equipment: [
              { assetNumber: "WT-PUMP-001", name: "Raw Water Pump" },
              { assetNumber: "WT-TANK-001", name: "Raw Water Tank" },
            ],
          },
          {
            label: "Process Water",
            equipment: [
              { assetNumber: "WT-PUMP-002", name: "Process Water Pump" },
              { assetNumber: "WT-TANK-002", name: "Process Water Tank" },
            ],
          },
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
          {
            label: "Reclaimer",
            equipment: [
              { assetNumber: "FR-RCLA-001", name: "Reclaimer" },
              { assetNumber: "FR-RCLA-002", name: "Reclaimer Drive" },
            ],
          },
          {
            label: "Feed Hopper & Chute",
            equipment: [
              { assetNumber: "FR-HOPP-001", name: "Feed Hopper" },
              { assetNumber: "FR-CHUT-001", name: "Feed Chute" },
            ],
          },
        ],
      },
      {
        label: "Conveying",
        systems: [
          {
            label: "Conveyor System",
            equipment: [
              { assetNumber: "CV-CNVY-001", name: "Conveyor" },
              { assetNumber: "CV-CNVY-002", name: "Conveyor" },
              { assetNumber: "CV-CNVY-003", name: "Conveyor" },
              { assetNumber: "CV-CNVY-004", name: "Conveyor" },
              { assetNumber: "CV-CNVY-005", name: "Conveyor" },
              { assetNumber: "CV-CNVY-006", name: "Conveyor" },
            ],
          },
        ],
      },
      {
        label: "Grinding",
        systems: [
          {
            label: "Ball Mill",
            equipment: [
              { assetNumber: "RF-BCHU-001", name: "Ball Loading Chute" },
              { assetNumber: "RF-MILL-001", name: "Ball Mill" },
            ],
          },
          {
            label: "Mill Bearings & Lubrication",
            equipment: [
              { assetNumber: "RF-TRBR-001", name: "Trunnion Bearing Sensor" },
              { assetNumber: "RF-TRBR-002", name: "Trunnion Bearing Sensor" },
              { assetNumber: "RF-LUBE-001", name: "Mill Lube System" },
            ],
          },
        ],
      },
      {
        label: "Classification",
        systems: [
          {
            label: "Cyclone Cluster",
            equipment: [
              { assetNumber: "CL-CYCL-001", name: "Cyclone Cluster" },
              { assetNumber: "CL-PUMP-001", name: "Cyclone Feed Pump" },
            ],
          },
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
          {
            label: "Knelson Concentrator",
            equipment: [
              { assetNumber: "GR-KNEL-001", name: "Knelson Concentrator" },
            ],
          },
          {
            label: "Concentrate Shaking Table",
            equipment: [
              { assetNumber: "GR-SHTB-001", name: "Shaking Table" },
            ],
          },
        ],
      },
      {
        label: "CIP",
        systems: [
          {
            label: "CIP Tanks",
            equipment: [
              { assetNumber: "CIP-TANK-001", name: "CIP Tank 1" },
              { assetNumber: "CIP-TANK-002", name: "CIP Tank 2" },
            ],
          },
          {
            label: "Pumps",
            equipment: [
              { assetNumber: "CIP-PUMP-001", name: "CIP Transfer Pump" },
            ],
          },
          {
            label: "Safety Showers & Eyewash",
            equipment: [
              { assetNumber: "CIP-SAFE-001", name: "CIP Area Safety Shower" },
            ],
          },
        ],
      },
      {
        label: "Elution",
        systems: [
          {
            label: "Elution Column",
            equipment: [
              { assetNumber: "ELU-COL-001", name: "Elution Column" },
            ],
          },
          {
            label: "Pumps",
            equipment: [
              { assetNumber: "ELU-PUMP-001", name: "Elution Pump" },
            ],
          },
        ],
      },
      {
        label: "Gold Room",
        systems: [
          {
            label: "Smelting & Pouring",
            equipment: [
              { assetNumber: "GR-FURN-001", name: "Furnace" },
              { assetNumber: "GR-POUR-001", name: "Pour Station" },
            ],
          },
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
          {
            label: "Thickener",
            equipment: [
              { assetNumber: "TH-THCK-001", name: "Thickener" },
            ],
          },
          {
            label: "Pumps",
            equipment: [
              { assetNumber: "TH-PUMP-001", name: "Thickener Underflow Pump" },
            ],
          },
        ],
      },
      {
        label: "Filtering",
        systems: [
          {
            label: "Filter System",
            equipment: [
              { assetNumber: "FL-FLTR-001", name: "Filter Unit" },
            ],
          },
          {
            label: "Pumps",
            equipment: [
              { assetNumber: "FL-PUMP-001", name: "Filtrate Pump" },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "SUP",
    label: "Support Services",
    subAreas: [
      {
        label: "Lab",
        systems: [
          {
            label: "Sample Prep",
            equipment: [
              { assetNumber: "LAB-PREP-001", name: "Sample Prep Bench" },
            ],
          },
          {
            label: "Lab Equipment",
            equipment: [
              { assetNumber: "LAB-EQPT-001", name: "Lab Equipment Set" },
            ],
          },
        ],
      },
      {
        label: "Mobile Equipment",
        systems: [
          {
            label: "Mobile Plant",
            equipment: [
              { assetNumber: "MOB-EQPT-001", name: "Mobile Equipment Set" },
            ],
          },
        ],
      },
      {
        label: "Light (LV)",
        systems: [
          {
            label: "Light Vehicles",
            equipment: [
              { assetNumber: "LV-FLIT-001", name: "LV Fleet" },
            ],
          },
        ],
      },
      {
        label: "Heavy (HV)",
        systems: [
          {
            label: "Heavy Vehicles",
            equipment: [
              { assetNumber: "HV-FLIT-001", name: "HV Fleet" },
            ],
          },
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
      <div className="min-w-max px-8">
        {/* Root: Site */}
        <CollapsibleTreeNode label="TCMG" level="site" hasChildren defaultExpanded>
          {/* Level 2: Facilities - Mining, Crushing Plant, Processing Plant */}
          
          {/* Mining (placeholder - no areas yet) */}
          <TreeBranch>
            <CollapsibleTreeNode label="Mining" level="plant" hasChildren={false} />
          </TreeBranch>
          
          {/* Crushing Plant (placeholder - no areas yet) */}
          <TreeBranch>
            <CollapsibleTreeNode label="Crushing Plant" level="plant" hasChildren={false} />
          </TreeBranch>
          
          {/* Processing Plant */}
          <TreeBranch isLast>
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
