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
          { 
            label: "Gold Plant", 
            equipment: [
              { assetNumber: "SITINF001", name: "Gold Plant" },
            ] 
          },
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
          { label: "Main Distribution Board", equipment: [] },
          { label: "Sub Distribution Board 1", equipment: [] },
          { label: "Control Room 1", equipment: [] },
          { label: "Control Subroom 1", equipment: [] },
          { label: "Ice Machine Room DB", equipment: [] },
          { label: "Crib Room L&P DB", equipment: [] },
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
              { assetNumber: "UNKN", name: "Lime Storage Silo" },
              { assetNumber: "VLV001", name: "Lime Storage Silo – Discharge Valve" },
            ] 
          },
          { 
            label: "Lime Silo Vibrator", 
            equipment: [
              { assetNumber: "UNKN", name: "Lime Silo Vibrator" },
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
            label: "Reclaim Hopper", 
            equipment: [
              { assetNumber: "RF-HOP001", name: "Reclaim Hopper" },
            ] 
          },
          { 
            label: "Reclaim Feeder", 
            equipment: [
              { assetNumber: "RF-FDR001", name: "Reclaim Feeder" },
              { assetNumber: "RF-FDR001-LCS001", name: "Reclaim Feeder – LCS" },
              { assetNumber: "RF-FDR001-MTR001", name: "Reclaim Feeder – Motor" },
              { assetNumber: "RF-FDR001-MCC001", name: "Reclaim Feeder – MCC Cell" },
              { assetNumber: "RF-FDR001-GBX001", name: "Reclaim Feeder – Gearbox" },
              { assetNumber: "RF-FDR001-PWS001", name: "Reclaim Feeder – Pullwire Switch" },
              { assetNumber: "RF-FDR001-TX001", name: "Reclaim Feeder – Speed Transmitter" },
              { assetNumber: "RF-FDR001-VLV001", name: "Lime Feeder – Rotary Valve" },
            ] 
          },
          { 
            label: "Feed Hopper", 
            equipment: [
              { assetNumber: "RF-HOP001", name: "Mill Feed Conveyor" },
              { assetNumber: "RF-HOP001-LCS001", name: "Mill Feed Conveyor – Local Control Station" },
              { assetNumber: "RF-HOP001-MTR001", name: "Mill Feed Conveyor – Motor" },
              { assetNumber: "RF-HOP001-MCC001", name: "Mill Feed Conveyor – MCC Cell" },
              { assetNumber: "RF-HOP001-GBX001", name: "Mill Feed Conveyor – Gearbox" },
              { assetNumber: "RF-HOP001-USS001", name: "Feed Conveyor – Underspeed Switch" },
              { assetNumber: "RF-HOP001-WTM001", name: "Ball Mill Feed Conveyor – Weightometer Loadcells" },
              { assetNumber: "RF-HOP001-WTM002", name: "Ball Mill Feed Conveyor – Weightometer Transmitter" },
              { assetNumber: "RF-HOP001-PWS001", name: "Feed Conveyor – Pull Wire Switch 1" },
              { assetNumber: "RF-HOP001-PWS002", name: "Feed Conveyor – Pull Wire Switch 2" },
              { assetNumber: "RF-HOP001-PWS003", name: "Feed Conveyor – Pull Wire Switch 3" },
              { assetNumber: "RF-HOP001-PWS004", name: "Feed Conveyor – Pull Wire Switch 4" },
              { assetNumber: "RF-HOP001-BAS001", name: "Feed Conveyor – Belt Alignment Switch 1" },
              { assetNumber: "RF-HOP001-BAS002", name: "Feed Conveyor – Belt Alignment Switch 2" },
              { assetNumber: "RF-HOP001-BAS003", name: "Feed Conveyor – Belt Alignment Switch 3" },
              { assetNumber: "RF-HOP001-BAS004", name: "Feed Conveyor – Belt Alignment Switch 4" },
              { assetNumber: "RF-HOP001-CHU001", name: "Ball Mill Feed Chute – High Level Switch" },
              { assetNumber: "RF-HOP001-CHU002", name: "Mill Feed Conveyor – Discharge Chute" },
              { assetNumber: "RF-HOP001-CHU003", name: "Mill Feed Chute" },
              { assetNumber: "RF-HOP001-CHU004", name: "Ball Loading Chute" },
              { assetNumber: "RF-HOP001-TX001", name: "Feed End Trunnion – Bearing Temp Transmitter" },
              { assetNumber: "RF-HOP001-SEN001", name: "Feed End Trunnion – Bearing Temp Sensor 1" },
              { assetNumber: "RF-HOP001-SEN002", name: "Feed End Trunnion – Bearing Temp Sensor 2" },
              { assetNumber: "RF-HOP001-SEN003", name: "Feed End Trunnion – Bearing Temp Sensor 3" },
              { assetNumber: "RF-HOP001-TX002", name: "Dis End Trunnion – Bearing Temp Transmitter" },
              { assetNumber: "RF-HOP001-SEN004", name: "Dis End Trunnion – Bearing Temp Sensor 1" },
              { assetNumber: "RF-HOP001-SEN005", name: "Dis End Trunnion – Bearing Temp Sensor 2" },
              { assetNumber: "RF-HOP001-SEN006", name: "Dis End Trunnion – Bearing Temp Sensor 3" },
              { assetNumber: "RF-HOP001", name: "Primary Mill Feed Boiler Box" },
              { assetNumber: "RF-HOP001-PMP001", name: "Primary Cyclone Feed Pump A" },
              { assetNumber: "RF-HOP001-MTR002", name: "Primary Cyclone Feed Pump A – Motor" },
              { assetNumber: "RF-HOP001-MCC002", name: "Primary Cyclone Feed Pump A – MCC Cell" },
              { assetNumber: "RF-HOP001-LCS002", name: "Primary Cyclone Feed Pump A – LCS" },
              { assetNumber: "RF-HOP001-PMP002", name: "Primary Cyclone Feed Pump B" },
              { assetNumber: "RF-HOP001-MTR003", name: "Primary Cyclone Feed Pump B – Motor" },
              { assetNumber: "RF-HOP001-MCC003", name: "Primary Cyclone Feed Pump B – MCC Cell" },
              { assetNumber: "RF-HOP001-LCS003", name: "Primary Cyclone Feed Pump B – LCS" },
              { assetNumber: "RF-HOP001-VLV001", name: "Primary Cyclone Feed – TechTaylor Valve" },
              { assetNumber: "RF-HOP001-TX003", name: "Primary Cyclone Feed – Flow Transmitter" },
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
              { assetNumber: "CV001", name: "Transfer Conveyor" },
              { assetNumber: "CV001-LCS001", name: "Transfer Conveyor – Local Control Station" },
              { assetNumber: "CV001-MTR001", name: "Transfer Conveyor – Motor" },
              { assetNumber: "CV001-MCC001", name: "Transfer Conveyor – MCC Cell" },
              { assetNumber: "CV001-GBX001", name: "Transfer Conveyor – Gearbox" },
              { assetNumber: "CV001-PWS001", name: "Transfer Conveyor – Pullwire Switch" },
              { assetNumber: "CV001", name: "Ball Mill Scatts Conveyor" },
            ] 
          },
          { 
            label: "Conveyor CV02", 
            equipment: [
              { assetNumber: "CV002-CHU001", name: "Transfer Conveyor – Discharge Chute" },
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
              { assetNumber: "BM001", name: "Grinding Circuit" },
              { assetNumber: "BM001", name: "Primary Ball Mill" },
              { assetNumber: "BM001-MTR001", name: "Primary Ball Mill – Motor" },
              { assetNumber: "BM001-GBX001", name: "Primary Ball Mill – Gearbox" },
              { assetNumber: "BM001", name: "Primary Ball Mill – Pinion" },
              { assetNumber: "BM001-MCC001", name: "Primary Ball Mill – MCC Cell" },
              { assetNumber: "BM001", name: "Primary Ball Mill – VSD" },
              { assetNumber: "BM001", name: "Primary Ball Mill – Instruments" },
              { assetNumber: "BM001", name: "Mill Gear Reducer – Temperature" },
              { assetNumber: "BM001-VLV001", name: "Mill Discharge End – Water Addition Control Valve" },
              { assetNumber: "BM001-TX001", name: "Mill Discharge End – Water Addition Flow Transmitter" },
              { assetNumber: "BM001-TX002", name: "Mill Discharge Hopper – Level Transmitter" },
              { assetNumber: "BM001", name: "Primary Ball Mill – Gear Reducer" },
              { assetNumber: "BM001", name: "Ball Mill – Loading Monorail" },
              { assetNumber: "SS001", name: "Mill Area Safety Shower 1" },
              { assetNumber: "SS001", name: "Mill Area Safety Shower 2" },
              { assetNumber: "BM001-PMP001", name: "Primary Ball Mill – Lube Recirculating Pump" },
              { assetNumber: "BM001-MTR002", name: "Primary Ball Mill – Lube Recirculating Pump Motor" },
              { assetNumber: "BM001-MCC002", name: "Primary Ball Mill – Lube Recirculating Pump MCC Cell" },
              { assetNumber: "BM001-LCS001", name: "Primary Ball Mill – Lube Recirculating Pump LCS" },
              { assetNumber: "BM001-LUB001", name: "Primary Ball Mill – Lube System" },
              { assetNumber: "BM001-LUB002", name: "Primary Ball Mill – Lube Air Blast Oil Cooler" },
              { assetNumber: "BM001-MTR003", name: "Primary Ball Mill – Lube Air Blast Oil Cooler Motor" },
              { assetNumber: "BM001-MCC003", name: "Primary Ball Mill – Lube Air Blast Oil Cooler MCC Cell" },
              { assetNumber: "BM001-LCS002", name: "Primary Ball Mill – Lube Air Blast Oil Cooler LCS" },
              { assetNumber: "BM001-PMP002", name: "Primary Ball Mill – Low Pressure Lube Pump A" },
              { assetNumber: "BM001-MTR004", name: "Primary Ball Mill – Low Pressure Lube Pump A Motor" },
              { assetNumber: "BM001-MCC004", name: "Primary Ball Mill – Low Pressure Lube Pump A MCC Cell" },
              { assetNumber: "BM001-LCS003", name: "Primary Ball Mill – Low Pressure Lube Pump A LCS" },
              { assetNumber: "BM001-PMP003", name: "Primary Ball Mill – Low Pressure Lube Pump B" },
              { assetNumber: "BM001-MTR005", name: "Primary Ball Mill – Low Pressure Lube Pump B Motor" },
              { assetNumber: "BM001-MCC005", name: "Primary Ball Mill – Low Pressure Lube Pump B MCC Cell" },
              { assetNumber: "BM001-LCS004", name: "Primary Ball Mill – Low Pressure Lube Pump B LCS" },
              { assetNumber: "BM001-PMP004", name: "Primary Ball Mill – High Pressure Lube Pump" },
              { assetNumber: "BM001-MTR006", name: "Primary Ball Mill – High Pressure Lube Pump Motor" },
              { assetNumber: "BM001-MCC006", name: "Primary Ball Mill – High Pressure Lube Pump MCC Cell" },
              { assetNumber: "BM001-LCS005", name: "Primary Ball Mill – High Pressure Lube Pump LCS" },
              { assetNumber: "BM001-LUB003", name: "Primary Mill – Lube System Instruments" },
              { assetNumber: "BM001-TX003", name: "Mill Low Pressure – Lube Oil Pressure Transmitter" },
              { assetNumber: "BM001-TX004", name: "Mill Low Pressure – Lube Oil Flow Transmitter" },
              { assetNumber: "BM001-TX005", name: "Mill High Pressure – Lift Lube Oil Pressure Transmitter" },
              { assetNumber: "BM001-LUB004", name: "Mill High Pressure – Lift Lube Oil Flow" },
              { assetNumber: "BM001-TX006", name: "Mill High Pressure – Lift Lube Oil Flow Transmitter" },
              { assetNumber: "BM001-LUB005", name: "Mill Lube System – Oil Level" },
              { assetNumber: "BM001-LUB006", name: "Mill Lube System – Oil Temperature" },
              { assetNumber: "BM001-LUB007", name: "Primary Ball Mill – Girth Gear Lube System" },
              { assetNumber: "BM001-PMP005", name: "Primary Ball Mill – Girth Gear Lube System Pump" },
              { assetNumber: "BM001-LUB008", name: "Primary Ball Mill – Girth Gear Lube Control Panel" },
              { assetNumber: "BM001-LUB009", name: "Primary Ball Mill – Lube System Filter A" },
              { assetNumber: "BM001-LUB010", name: "Primary Ball Mill – Lube System Filter B" },
              { assetNumber: "BM001", name: "Primary Mill – Discharge Hopper" },
            ] 
          },
          { 
            label: "Grinding Sump", 
            equipment: [
              { assetNumber: "GRISUM001-PMP001", name: "Grinding Area Sump Pump" },
              { assetNumber: "GSPMP001-MTR001", name: "Grinding Area Sump Pump – Motor" },
              { assetNumber: "GSPMP001-MCC001", name: "Grinding Area Sump Pump – MCC Cell" },
              { assetNumber: "GSPMP001-LCS001", name: "Grinding Area Sump Pump – LCS" },
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
              { assetNumber: "CYC001", name: "Primary Cyclone Cluster" },
              { assetNumber: "CYC001", name: "Primary Cyclone Cluster – Instruments" },
              { assetNumber: "CYC001-TX001", name: "Primary Cyclone – Pressure Transmitter" },
              { assetNumber: "CYC001", name: "Primary Cyclone – Pressure Gauge" },
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
