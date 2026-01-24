import React from "react";
import { CollapsibleTreeNode, AreaType } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { useAssetSearch } from "@/hooks/useAssetSearch";

// Asset hierarchy data structure - Maintenance-logical model
interface Equipment {
  assetNumber: string;
  name: string;
}

interface ParentAsset {
  label: string;
  equipment: Equipment[];
}

interface SubArea {
  label: string;
  parentAssets: ParentAsset[];
}

interface Area {
  code: AreaType;
  label: string;
  subAreas: SubArea[];
}

interface AssetTreeProps {
  searchQuery?: string;
}

// Full asset hierarchy data following: Area → Sub-Area → Parent Asset → Equipment
const areasData: Area[] = [
  {
    code: "SITE",
    label: "Site",
    subAreas: [
      {
        label: "Site Infrastructure",
        parentAssets: [
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
        parentAssets: [
          { 
            label: "Air Compressor 1", 
            equipment: [
              { assetNumber: "MTR001", name: "Air Compressor 1 – Motor" },
              { assetNumber: "VLV001", name: "Air Compressor 1 – Inlet Valve" },
              { assetNumber: "VLV002", name: "Air Compressor 1 – Outlet Valve" },
            ] 
          },
          { 
            label: "Air Receiver 1", 
            equipment: [
              { assetNumber: "VLV001", name: "Air Receiver 1 – Drain Valve" },
              { assetNumber: "SWT001", name: "Air Receiver 1 – Pressure Switch" },
            ] 
          },
          { 
            label: "Air Dryer 1", 
            equipment: [
              { assetNumber: "HTR001", name: "Air Dryer 1 – Heater" },
              { assetNumber: "VLV001", name: "Air Dryer 1 – Purge Valve" },
            ] 
          },
        ],
      },
      {
        label: "Electrical / Controls",
        parentAssets: [
          { 
            label: "Main Distribution Board", 
            equipment: [
              { assetNumber: "DB001", name: "Main Distribution Board – Main Panel" },
            ] 
          },
          { 
            label: "Sub Distribution Board 1", 
            equipment: [
              { assetNumber: "DB001", name: "Sub Distribution Board 1 – Panel" },
            ] 
          },
          { label: "Control Room 1", equipment: [] },
          { label: "Control Subroom 1", equipment: [] },
          { 
            label: "Ice Machine Room DB", 
            equipment: [
              { assetNumber: "DB001", name: "Ice Machine Room DB – Panel" },
            ] 
          },
          { 
            label: "Crib Room L&P DB", 
            equipment: [
              { assetNumber: "DB001", name: "Crib Room L&P DB – Panel" },
            ] 
          },
          { label: "Lath Container L&P", equipment: [] },
        ],
      },
      {
        label: "Power Generation",
        parentAssets: [
          { 
            label: "Generator Set 1", 
            equipment: [
              { assetNumber: "MTR001", name: "Generator Set 1 – Engine" },
              { assetNumber: "ALT001", name: "Generator Set 1 – Alternator" },
              { assetNumber: "DB001", name: "Generator Set 1 – Control Panel" },
            ] 
          },
          { 
            label: "Fuel Storage Tank", 
            equipment: [
              { assetNumber: "TNK001", name: "Fuel Storage Tank – Main Tank" },
              { assetNumber: "PMP001", name: "Fuel Storage Tank – Transfer Pump" },
              { assetNumber: "VLV001", name: "Fuel Storage Tank – Isolation Valve" },
            ] 
          },
          { 
            label: "Fuel Dispensing Station", 
            equipment: [
              { assetNumber: "PMP001", name: "Fuel Dispensing Station – Pump" },
              { assetNumber: "DB001", name: "Fuel Dispensing Station – Control Board" },
            ] 
          },
        ],
      },
      {
        label: "Reagents (Lime)",
        parentAssets: [
          { 
            label: "Lime Storage Silo", 
            equipment: [
              { assetNumber: "TNK001", name: "Lime Storage Silo – Silo" },
              { assetNumber: "VLV001", name: "Lime Storage Silo – Discharge Valve" },
            ] 
          },
          { 
            label: "Lime Dosing System", 
            equipment: [
              { assetNumber: "PMP001", name: "Lime Dosing System – Dosing Pump" },
              { assetNumber: "AGT001", name: "Lime Dosing System – Mixing Agitator" },
            ] 
          },
          { 
            label: "Lime Agitation Tank", 
            equipment: [
              { assetNumber: "TNK001", name: "Lime Agitation Tank – Tank" },
              { assetNumber: "AGT001", name: "Lime Agitation Tank – Agitator" },
              { assetNumber: "MTR001", name: "Lime Agitation Tank – Agitator Motor" },
            ] 
          },
        ],
      },
      {
        label: "Water",
        parentAssets: [
          { 
            label: "Potable Water Tank", 
            equipment: [
              { assetNumber: "TNK001", name: "Potable Water Tank – Tank" },
              { assetNumber: "PMP001", name: "Potable Water Tank – Booster Pump" },
              { assetNumber: "SWT001", name: "Potable Water Tank – Level Switch" },
            ] 
          },
          { 
            label: "Raw Water Pump Station", 
            equipment: [
              { assetNumber: "PMP001", name: "Raw Water Pump Station – Pump 1" },
              { assetNumber: "PMP002", name: "Raw Water Pump Station – Pump 2" },
              { assetNumber: "MTR001", name: "Raw Water Pump Station – Pump 1 Motor" },
              { assetNumber: "MTR002", name: "Raw Water Pump Station – Pump 2 Motor" },
            ] 
          },
          { 
            label: "Process Water Tank", 
            equipment: [
              { assetNumber: "TNK001", name: "Process Water Tank – Tank" },
              { assetNumber: "PMP001", name: "Process Water Tank – Distribution Pump" },
            ] 
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
        parentAssets: [
          { 
            label: "Feed Hopper 1", 
            equipment: [
              { assetNumber: "SWT001", name: "Feed Hopper 1 – Level Switch" },
              { assetNumber: "VLV001", name: "Feed Hopper 1 – Discharge Gate" },
            ] 
          },
          { 
            label: "Reclaim Hopper 1", 
            equipment: [
              { assetNumber: "SWT001", name: "Reclaim Hopper 1 – Level Switch" },
            ] 
          },
          { 
            label: "Apron Feeder 1", 
            equipment: [
              { assetNumber: "MTR001", name: "Apron Feeder 1 – Drive Motor" },
              { assetNumber: "GBX001", name: "Apron Feeder 1 – Gearbox" },
              { assetNumber: "MCC001", name: "Apron Feeder 1 – MCC Cell" },
            ] 
          },
        ],
      },
      {
        label: "Conveying",
        parentAssets: [
          { 
            label: "Conveyor CV01", 
            equipment: [
              { assetNumber: "MTR001", name: "Conveyor CV01 – Drive Motor" },
              { assetNumber: "GBX001", name: "Conveyor CV01 – Gearbox" },
              { assetNumber: "CHU001", name: "Conveyor CV01 – Feed Chute" },
              { assetNumber: "CHU002", name: "Conveyor CV01 – Discharge Chute" },
              { assetNumber: "MCC001", name: "Conveyor CV01 – MCC Cell" },
            ] 
          },
          { 
            label: "Conveyor CV02", 
            equipment: [
              { assetNumber: "MTR001", name: "Conveyor CV02 – Drive Motor" },
              { assetNumber: "GBX001", name: "Conveyor CV02 – Gearbox" },
              { assetNumber: "CHU001", name: "Conveyor CV02 – Transfer Chute" },
              { assetNumber: "MCC001", name: "Conveyor CV02 – MCC Cell" },
            ] 
          },
          { 
            label: "Conveyor CV03", 
            equipment: [
              { assetNumber: "MTR001", name: "Conveyor CV03 – Drive Motor" },
              { assetNumber: "GBX001", name: "Conveyor CV03 – Gearbox" },
              { assetNumber: "MCC001", name: "Conveyor CV03 – MCC Cell" },
            ] 
          },
        ],
      },
      {
        label: "Grinding",
        parentAssets: [
          { 
            label: "Ball Mill", 
            equipment: [
              { assetNumber: "MTR001", name: "Ball Mill – Drive Motor" },
              { assetNumber: "GBX001", name: "Ball Mill – Gearbox" },
              { assetNumber: "LUB001", name: "Ball Mill – Lube System" },
              { assetNumber: "MCC001", name: "Ball Mill – MCC Cell" },
            ] 
          },
          { 
            label: "Mill Discharge Pump", 
            equipment: [
              { assetNumber: "PMP001", name: "Mill Discharge Pump – Pump" },
              { assetNumber: "MTR001", name: "Mill Discharge Pump – Motor" },
              { assetNumber: "MCC001", name: "Mill Discharge Pump – MCC Cell" },
            ] 
          },
          { 
            label: "Grinding Sump Pump", 
            equipment: [
              { assetNumber: "PMP001", name: "Grinding Sump Pump – Pump" },
              { assetNumber: "MTR001", name: "Grinding Sump Pump – Motor" },
              { assetNumber: "GBX001", name: "Grinding Sump Pump – Gearbox" },
              { assetNumber: "MCC001", name: "Grinding Sump Pump – MCC Cell" },
            ] 
          },
        ],
      },
      {
        label: "Classification",
        parentAssets: [
          { 
            label: "Cyclone Cluster", 
            equipment: [
              { assetNumber: "CYC001", name: "Cyclone Cluster – Cyclone 1" },
              { assetNumber: "CYC002", name: "Cyclone Cluster – Cyclone 2" },
              { assetNumber: "CYC003", name: "Cyclone Cluster – Cyclone 3" },
              { assetNumber: "VLV001", name: "Cyclone Cluster – Isolation Valve" },
            ] 
          },
          { 
            label: "Classification Sump", 
            equipment: [
              { assetNumber: "TNK001", name: "Classification Sump – Sump Tank" },
              { assetNumber: "SWT001", name: "Classification Sump – Level Switch" },
            ] 
          },
          { 
            label: "Cyclone Feed Pump", 
            equipment: [
              { assetNumber: "PMP001", name: "Cyclone Feed Pump – Pump" },
              { assetNumber: "MTR001", name: "Cyclone Feed Pump – Motor" },
              { assetNumber: "GBX001", name: "Cyclone Feed Pump – Gearbox" },
              { assetNumber: "MCC001", name: "Cyclone Feed Pump – MCC Cell" },
            ] 
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
        parentAssets: [
          { 
            label: "Gravity Concentrator 1", 
            equipment: [
              { assetNumber: "MTR001", name: "Gravity Concentrator 1 – Motor" },
              { assetNumber: "PMP001", name: "Gravity Concentrator 1 – Water Pump" },
              { assetNumber: "MCC001", name: "Gravity Concentrator 1 – MCC Cell" },
            ] 
          },
          { 
            label: "Concentrate Pump", 
            equipment: [
              { assetNumber: "PMP001", name: "Concentrate Pump – Pump" },
              { assetNumber: "MTR001", name: "Concentrate Pump – Motor" },
            ] 
          },
        ],
      },
      {
        label: "CIP",
        parentAssets: [
          { 
            label: "CIP Tank 1", 
            equipment: [
              { assetNumber: "TNK001", name: "CIP Tank 1 – Tank" },
              { assetNumber: "AGT001", name: "CIP Tank 1 – Agitator" },
              { assetNumber: "MTR001", name: "CIP Tank 1 – Agitator Motor" },
              { assetNumber: "SCR001", name: "CIP Tank 1 – Interstage Screen" },
            ] 
          },
          { 
            label: "CIP Tank 2", 
            equipment: [
              { assetNumber: "TNK001", name: "CIP Tank 2 – Tank" },
              { assetNumber: "AGT001", name: "CIP Tank 2 – Agitator" },
              { assetNumber: "MTR001", name: "CIP Tank 2 – Agitator Motor" },
              { assetNumber: "SCR001", name: "CIP Tank 2 – Interstage Screen" },
            ] 
          },
          { 
            label: "CIP Transfer Pump", 
            equipment: [
              { assetNumber: "PMP001", name: "CIP Transfer Pump – Pump" },
              { assetNumber: "MTR001", name: "CIP Transfer Pump – Motor" },
            ] 
          },
        ],
      },
      {
        label: "Elution",
        parentAssets: [
          { 
            label: "Elution Column", 
            equipment: [
              { assetNumber: "COL001", name: "Elution Column – Column Vessel" },
              { assetNumber: "HTR001", name: "Elution Column – Heater" },
              { assetNumber: "VLV001", name: "Elution Column – Inlet Valve" },
              { assetNumber: "VLV002", name: "Elution Column – Outlet Valve" },
            ] 
          },
          { 
            label: "Elution Heat Exchanger", 
            equipment: [
              { assetNumber: "HEX001", name: "Elution Heat Exchanger – Heat Exchanger" },
              { assetNumber: "PMP001", name: "Elution Heat Exchanger – Circulation Pump" },
            ] 
          },
          { 
            label: "Acid Wash System", 
            equipment: [
              { assetNumber: "TNK001", name: "Acid Wash System – Acid Tank" },
              { assetNumber: "PMP001", name: "Acid Wash System – Dosing Pump" },
              { assetNumber: "AGT001", name: "Acid Wash System – Agitator" },
            ] 
          },
        ],
      },
      {
        label: "Gold Room",
        parentAssets: [
          { 
            label: "Electrowinning Cell 1", 
            equipment: [
              { assetNumber: "CELL01", name: "Electrowinning Cell 1 – Cell" },
              { assetNumber: "REC001", name: "Electrowinning Cell 1 – Rectifier" },
            ] 
          },
          { 
            label: "Smelting Furnace", 
            equipment: [
              { assetNumber: "FUR001", name: "Smelting Furnace – Furnace" },
              { assetNumber: "HTR001", name: "Smelting Furnace – Heating Element" },
              { assetNumber: "FAN001", name: "Smelting Furnace – Extraction Fan" },
            ] 
          },
          { label: "Gold Pour Area", equipment: [] },
        ],
      },
      {
        label: "Cyanide & Regen",
        parentAssets: [
          { 
            label: "Cyanide Mixing Tank", 
            equipment: [
              { assetNumber: "TNK001", name: "Cyanide Mixing Tank – Tank" },
              { assetNumber: "AGT001", name: "Cyanide Mixing Tank – Agitator" },
              { assetNumber: "MTR001", name: "Cyanide Mixing Tank – Agitator Motor" },
            ] 
          },
          { label: "Titration Hut", equipment: [] },
          { 
            label: "Regen Kiln", 
            equipment: [
              { assetNumber: "KLN001", name: "Regen Kiln – Kiln" },
              { assetNumber: "MTR001", name: "Regen Kiln – Drive Motor" },
              { assetNumber: "GBX001", name: "Regen Kiln – Gearbox" },
              { assetNumber: "FAN001", name: "Regen Kiln – Combustion Fan" },
            ] 
          },
          { 
            label: "Regen Kiln Feed Hopper", 
            equipment: [
              { assetNumber: "FDR001", name: "Regen Kiln Feed Hopper – Feeder" },
              { assetNumber: "MTR001", name: "Regen Kiln Feed Hopper – Motor" },
            ] 
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
        parentAssets: [
          { 
            label: "Thickener 1", 
            equipment: [
              { assetNumber: "THK001", name: "Thickener 1 – Thickener Tank" },
              { assetNumber: "MTR001", name: "Thickener 1 – Rake Drive Motor" },
              { assetNumber: "GBX001", name: "Thickener 1 – Rake Gearbox" },
              { assetNumber: "MCC001", name: "Thickener 1 – MCC Cell" },
            ] 
          },
          { 
            label: "Underflow Pump 1", 
            equipment: [
              { assetNumber: "PMP001", name: "Underflow Pump 1 – Pump" },
              { assetNumber: "MTR001", name: "Underflow Pump 1 – Motor" },
              { assetNumber: "GBX001", name: "Underflow Pump 1 – Gearbox" },
              { assetNumber: "MCC001", name: "Underflow Pump 1 – MCC Cell" },
            ] 
          },
        ],
      },
      {
        label: "Filtering",
        parentAssets: [
          { 
            label: "Filter Press 1", 
            equipment: [
              { assetNumber: "FLT001", name: "Filter Press 1 – Filter" },
              { assetNumber: "HPU001", name: "Filter Press 1 – Hydraulic Power Unit" },
              { assetNumber: "PMP001", name: "Filter Press 1 – Feed Pump" },
            ] 
          },
          { 
            label: "Filtrate Pump", 
            equipment: [
              { assetNumber: "PMP001", name: "Filtrate Pump – Pump" },
              { assetNumber: "MTR001", name: "Filtrate Pump – Motor" },
            ] 
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
        label: "Workshop",
        parentAssets: [
          { label: "Fixed Plant Workshop", equipment: [] },
        ],
      },
      {
        label: "Lab",
        parentAssets: [
          { label: "Assay Equipment", equipment: [] },
          { label: "Sample Prep Equipment", equipment: [] },
        ],
      },
      {
        label: "Mobile Equipment",
        parentAssets: [
          { label: "Plant Mobile Equipment", equipment: [] },
        ],
      },
      {
        label: "Light Vehicles (LV)",
        parentAssets: [
          { label: "LV Fleet", equipment: [] },
        ],
      },
      {
        label: "Heavy Vehicles (HV)",
        parentAssets: [
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
                              hasChildren={subArea.parentAssets.length > 0}
                              defaultExpanded={subAreaExpanded}
                              forceExpanded={subAreaExpanded}
                              isHighlighted={matchesSearch(subArea.label)}
                            >
                              {/* Level 5: Parent Assets */}
                              {subArea.parentAssets.map((parentAsset, paIndex) => {
                                const parentAssetPath = [...subAreaPath, parentAsset.label];
                                const parentAssetExpanded = shouldExpandForSearch(parentAssetPath);
                                
                                return (
                                  <TreeBranch key={paIndex} isLast={paIndex === subArea.parentAssets.length - 1}>
                                    <CollapsibleTreeNode
                                      label={parentAsset.label}
                                      level="parentAsset"
                                      hasChildren={parentAsset.equipment.length > 0}
                                      defaultExpanded={parentAssetExpanded}
                                      forceExpanded={parentAssetExpanded}
                                      isHighlighted={matchesSearch(parentAsset.label)}
                                    >
                                      {/* Level 6: Equipment */}
                                      {parentAsset.equipment.map((equip, equipIndex) => {
                                        const equipLabel = `${equip.assetNumber} — ${equip.name}`;
                                        return (
                                          <TreeBranch key={equipIndex} isLast={equipIndex === parentAsset.equipment.length - 1}>
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
