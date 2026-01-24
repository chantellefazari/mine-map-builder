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
          code: "UTL" as const,
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
                { label: "Lime Transfer & Conveyance" },
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
          code: "COM" as const,
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
              label: "Conveyance",
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
          code: "REC" as const,
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
          code: "TAIL" as const,
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
          code: "SUP" as const,
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
