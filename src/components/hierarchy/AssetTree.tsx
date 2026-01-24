import React from "react";
import { CollapsibleTreeNode, AreaType } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";

// Asset hierarchy data structure
interface System {
  label: string;
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

const areasData: Area[] = [
  {
    code: "SITE",
    label: "Site",
    subAreas: [
      {
        label: "Site Infrastructure",
        systems: [
          { label: "Plant Buildings & Structures" },
          { label: "Access & Laydown Areas" },
          { label: "Roads & Hardstand" },
          { label: "Drainage & Bunding" },
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
          { label: "Plant Air Compressor System" },
          { label: "Instrument Air Distribution" },
          { label: "Air Receivers & Dryers" },
        ],
      },
      {
        label: "Electrical / Controls",
        systems: [
          { label: "HV Distribution" },
          { label: "LV Distribution" },
          { label: "MCCs" },
          { label: "PLC & SCADA Infrastructure" },
        ],
      },
      {
        label: "Power Generation",
        systems: [
          { label: "Generator Sets" },
          { label: "Fuel Supply System" },
          { label: "Power Synchronisation System" },
        ],
      },
      {
        label: "Reagents (Lime)",
        systems: [
          { label: "Lime Storage" },
          { label: "Lime Dosing System" },
          { label: "Lime Transfer & Conveying" },
        ],
      },
      {
        label: "Water",
        systems: [
          { label: "Raw Water Supply" },
          { label: "Process Water Distribution" },
          { label: "Potable Water" },
          { label: "Fire Water System" },
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
          { label: "ROM Feed System" },
          { label: "Ore Reclaimer System" },
          { label: "Feed Conveyors" },
        ],
      },
      {
        label: "Conveying",
        systems: [
          { label: "Transfer Conveyors" },
          { label: "Tramp Metal Detection" },
          { label: "Belt Weighers" },
        ],
      },
      {
        label: "Grinding",
        systems: [
          { label: "Mill Drive System" },
          { label: "Mill Lubrication System" },
          { label: "Mill Discharge System" },
        ],
      },
      {
        label: "Classification",
        systems: [
          { label: "Cyclone Feed System" },
          { label: "Cyclone Cluster" },
          { label: "Underflow / Overflow Handling" },
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
          { label: "Gravity Concentrator" },
          { label: "Concentrate Handling" },
        ],
      },
      {
        label: "CIP",
        systems: [
          { label: "Adsorption Tanks" },
          { label: "Carbon Transfer System" },
          { label: "Interstage Screens" },
        ],
      },
      {
        label: "Elution",
        systems: [
          { label: "Elution Column" },
          { label: "Electrowinning" },
          { label: "Regeneration Kiln" },
        ],
      },
      {
        label: "Gold Room",
        systems: [
          { label: "Smelting Furnace" },
          { label: "Bullion Handling" },
          { label: "Security Systems" },
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
          { label: "Tailings Thickener" },
          { label: "Flocculant Dosing" },
          { label: "Thickener Drive & Rake" },
        ],
      },
      {
        label: "Filtering",
        systems: [
          { label: "Filter Press" },
          { label: "Filtrate Return" },
          { label: "Cake Handling" },
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
          { label: "Sample Prep" },
          { label: "Assay Equipment" },
        ],
      },
      {
        label: "Mobile Equipment",
        systems: [
          { label: "Loaders" },
          { label: "Forklifts" },
          { label: "Support Equipment" },
        ],
      },
      {
        label: "Light Vehicles (LV)",
        systems: [
          { label: "Light Vehicle Fleet" },
          { label: "LV Maintenance" },
        ],
      },
      {
        label: "Heavy Vehicles (HV)",
        systems: [
          { label: "Heavy Vehicle Fleet" },
          { label: "HV Maintenance" },
        ],
      },
    ],
  },
];

export const AssetTree: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="min-w-max px-8">
        {/* Root: Site */}
        <CollapsibleTreeNode label="TCMG" level="site" hasChildren defaultExpanded>
          {/* Level 2: Processing Plant */}
          <TreeBranch>
            <CollapsibleTreeNode label="Processing Plant" level="plant" hasChildren defaultExpanded>
              {/* Level 3: Areas */}
              {areasData.map((area, areaIndex) => (
                <TreeBranch key={area.code} isLast={areaIndex === areasData.length - 1}>
                  <CollapsibleTreeNode
                    code={area.code}
                    label={area.label}
                    level="area"
                    areaType={area.code}
                    hasChildren={area.subAreas.length > 0}
                    defaultExpanded={false}
                  >
                    {/* Level 4: Sub Areas */}
                    {area.subAreas.map((subArea, subIndex) => (
                      <TreeBranch key={subIndex} isLast={subIndex === area.subAreas.length - 1}>
                        <CollapsibleTreeNode
                          label={subArea.label}
                          level="subarea"
                          hasChildren={subArea.systems.length > 0}
                          defaultExpanded={false}
                        >
                          {/* Level 5: Systems */}
                          {subArea.systems.map((system, sysIndex) => (
                            <TreeBranch key={sysIndex} isLast={sysIndex === subArea.systems.length - 1}>
                              <CollapsibleTreeNode
                                label={system.label}
                                level="system"
                                hasChildren={false}
                              />
                            </TreeBranch>
                          ))}
                        </CollapsibleTreeNode>
                      </TreeBranch>
                    ))}
                  </CollapsibleTreeNode>
                </TreeBranch>
              ))}
            </CollapsibleTreeNode>
          </TreeBranch>
        </CollapsibleTreeNode>
      </div>
    </div>
  );
};
