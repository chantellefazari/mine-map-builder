// Asset hierarchy data structure - Maintenance-logical model
export interface Equipment {
  assetNumber: string;
  name: string;
}

export interface ParentAsset {
  label: string;
  equipment: Equipment[];
}

export interface SubArea {
  label: string;
  parentAssets: ParentAsset[];
}

export type AreaType = "SITE" | "UTL" | "COM" | "REC" | "TAIL" | "SUP";

export interface Area {
  code: AreaType;
  label: string;
  subAreas: SubArea[];
}

// Full asset hierarchy data following: Area → Sub-Area → Parent Asset → Equipment
export const areasData: Area[] = [
  {
    code: "SITE",
    label: "Site",
    subAreas: [
      {
        label: "Site Infrastructure",
        parentAssets: [
          { 
            label: "Site Infrastructure", 
            equipment: [
              { assetNumber: "SITINF001", name: "Gold Plant" },
              // Part 4 equipment
              { assetNumber: "SITINF001", name: "Buildings" },
              { assetNumber: "SITINF001", name: "Admin" },
              { assetNumber: "SITINF001", name: "Crib" },
              { assetNumber: "SITINF001", name: "Conference" },
              { assetNumber: "SITINF001", name: "First Aid Room" },
              { assetNumber: "SITINF001", name: "Male Toilet" },
              { assetNumber: "SITINF001", name: "Female Toilet" },
              { assetNumber: "SITINF001", name: "Male Toilet L&P DB" },
              { assetNumber: "SITINF001", name: "Admin Office L&P DB 1" },
              { assetNumber: "SITINF001", name: "Admin Office L&P DB 2" },
              { assetNumber: "SITINF001", name: "Admin Office L&P DB 3" },
              { assetNumber: "SITINF001", name: "Admin Office L&P DB 4" },
            ] 
          },
          { label: "Admin Building", equipment: [] },
          { label: "Toilets / Amenities", equipment: [] },
          { label: "Crib Room", equipment: [] },
          { label: "Change Rooms", equipment: [] },
          { 
            label: "Services", 
            equipment: [
              { assetNumber: "UNKN", name: "Services" },
            ] 
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
          { 
            label: "HP Air Compressor", 
            equipment: [
              { assetNumber: "UNKN", name: "HP Air Compressor" },
              { assetNumber: "UNKN", name: "HP Air Compressor Piping" },
              { assetNumber: "UNKN-MCC001", name: "HP Air Compressor – MCC Cell 1" },
              { assetNumber: "UNKN", name: "HP Air Receiver 1" },
              { assetNumber: "UNKN", name: "HP Air Compressor 2" },
              { assetNumber: "UNKN", name: "HP Air Compressor Piping 2" },
              { assetNumber: "UNKN-MCC002", name: "HP Air Compressor – MCC Cell 2" },
              { assetNumber: "UNKN", name: "HP Air Receiver 2" },
              { assetNumber: "UNKN", name: "Filter Area HP Air Compressor" },
              { assetNumber: "UNKN", name: "HP Air Compressor Piping 3" },
              { assetNumber: "UNKN-MCC003", name: "HP Air Compressor – MCC Cell 3" },
              { assetNumber: "UNKN", name: "HP Air Receiver 3" },
              { assetNumber: "UNKN-MCC004", name: "HP Air Compressor – MCC Cell 4" },
              { assetNumber: "UNKN", name: "HP Air Receiver 4" },
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
              { assetNumber: "MDB001-MCC001", name: "CIP Tank 3 Agitator – MCC Cell" },
              { assetNumber: "MDB001-MCC002", name: "CIP Tank 4 Agitator – MCC Cell" },
              { assetNumber: "MDB001-MCC003", name: "CIP Tank 5 Agitator – MCC Cell" },
              { assetNumber: "MDB001-MCC004", name: "CIP Tank 6 Agitator – MCC Cell" },
              { assetNumber: "MDB001-MCC005", name: "CIP Tank 7 Agitator – MCC Cell" },
              { assetNumber: "MDB001-MCC006", name: "CIP Tank 8 Agitator – MCC Cell" },
              { assetNumber: "MDB001-MCC007", name: "Cyanide Mixing Tank Agitator – MCC Cell" },
              { assetNumber: "MDB001-MCC008", name: "Concentrate Shaking Table – MCC Cell" },
              { assetNumber: "MDB001", name: "Flocc Panel 1" },
              { assetNumber: "MDB001", name: "Flocc Panel 2" },
              { assetNumber: "MDB001", name: "Clarometer Panel" },
              // Part 4 equipment
              { assetNumber: "MDB001-MCC009", name: "Filter 1 Stock Tank Agitator – MCC Cell" },
              { assetNumber: "MDB001", name: "Filter 1 PLC" },
              { assetNumber: "MDB001", name: "Filter Press 1 Panel" },
              { assetNumber: "MDB001-MCC010", name: "Filter Press 1 Hydraulic Plate Pack – MCC Cell" },
              { assetNumber: "MDB001-MCC011", name: "Filter Press 1 Hydraulic TT Plate – MCC Cell" },
              { assetNumber: "MDB001-MCC012", name: "Filter 2 Stock Tank Agitator – MCC Cell" },
              { assetNumber: "MDB001", name: "Filter 2 PLC" },
              { assetNumber: "MDB001", name: "Filter Press 2 Panel" },
              { assetNumber: "MDB001-MCC013", name: "Filter Press 2 Hydraulic Plate Pack – MCC Cell" },
              { assetNumber: "MDB001-MCC014", name: "Filter Press 2 Hydraulic TT Plate – MCC Cell" },
              { assetNumber: "MDB001", name: "Field MCCs" },
              { assetNumber: "MDB001", name: "Gravity Field MCC" },
              { assetNumber: "MDB001", name: "Tanks Field MCC 1" },
              { assetNumber: "MDB001", name: "Tanks Field MCC 2" },
              { assetNumber: "MDB001", name: "Tanks Field MCC 3" },
              { assetNumber: "MDB001", name: "Tanks Field MCC 4" },
              { assetNumber: "MDB001", name: "Services Field MCC" },
              { assetNumber: "MDB001", name: "Process Water Field MCC" },
              { assetNumber: "MDB001", name: "Filter Press Field MCC" },
              { assetNumber: "MDB001", name: "Distribution Boards" },
              { assetNumber: "MDB001", name: "Ice Machine Room DB" },
              { assetNumber: "MDB001", name: "Main DB 1" },
              { assetNumber: "MDB001", name: "Main DB 2" },
              { assetNumber: "MDB001", name: "MCC-125. L&P" },
              { assetNumber: "MDB001", name: "MCC-110. L&P" },
              { assetNumber: "MDB001", name: "MCC-111. L&P" },
              { assetNumber: "MDB001", name: "MCC-113. L&P" },
              { assetNumber: "MDB001", name: "MCC-114. L&P" },
              { assetNumber: "MDB001", name: "MCC-115. L&P" },
              { assetNumber: "MDB001", name: "MCC-116. L&P" },
              { assetNumber: "MDB001", name: "MCC-117. L&P" },
              { assetNumber: "MDB001", name: "MCC-118. L&P" },
              { assetNumber: "MDB001", name: "MCC-120. L&P" },
              { assetNumber: "MDB001", name: "MCC-121. L&P" },
              { assetNumber: "MDB001", name: "MCC-122. L&P" },
              { assetNumber: "MDB001", name: "MCC-130. L&P" },
              { assetNumber: "MDB001", name: "Titration Hut L&P DB" },
            ] 
          },
          { 
            label: "Sub Distribution Board", 
            equipment: [
              { assetNumber: "SDB001", name: "Sub-100" },
              { assetNumber: "SDB001", name: "Sub-100 L&P" },
              { assetNumber: "SDB001", name: "Sub-100 Essential Board" },
            ] 
          },
          { 
            label: "Control Room", 
            equipment: [
              { assetNumber: "CR001", name: "Knelson Concentrator Control Panel" },
              { assetNumber: "CR001", name: "Knelson Area Hoist Control Panel" },
              { assetNumber: "CR001", name: "Control Room" },
              { assetNumber: "CR001", name: "Control Room L&P DB" },
            ] 
          },
          { label: "Control Subroom 1", equipment: [] },
          { 
            label: "Lighting Towers", 
            equipment: [
              { assetNumber: "UNKN", name: "Lighting Tower 1" },
              { assetNumber: "UNKN", name: "Lighting Tower 2" },
              { assetNumber: "UNKN", name: "Lighting Tower 3" },
              { assetNumber: "UNKN", name: "Lighting Tower 4" },
              { assetNumber: "UNKN", name: "Lighting Tower 5" },
            ] 
          },
          { 
            label: "Main Sub Station", 
            equipment: [
              { assetNumber: "UNKN-ASSY001", name: "Main Sub Station" },
              { assetNumber: "UNKN", name: "RO Plant Main Board" },
            ] 
          },
        ],
      },
      {
        label: "Power Generation",
        parentAssets: [
          { 
            label: "Generator Set", 
            equipment: [
              { assetNumber: "MTR001", name: "Generator Set 1 – Engine" },
              { assetNumber: "ALT001", name: "Generator Set 1 – Alternator" },
              { assetNumber: "DB001", name: "Generator Set 1 – Control Panel" },
              // Part 4 equipment
              { assetNumber: "GENSET001", name: "Generators" },
              { assetNumber: "GENSET001-ASSY001", name: "Power Station Generator 1 500kVA" },
              { assetNumber: "GENSET001-ASSY002", name: "Power Station Generator 1 500kVA 2" },
              { assetNumber: "GENSET001-ASSY003", name: "Power Station Generator 1 500kVA 3" },
              { assetNumber: "GENSET001-ASSY004", name: "Power Station Generator 1 500kVA 4" },
              { assetNumber: "GENSET001-ASSY005", name: "Power Station Generator 1 500kVA 5" },
              { assetNumber: "GENSET001-ASSY006", name: "Power Station Generator 1 500kVA 6" },
              { assetNumber: "GENSET001-ASSY007", name: "Power Station Generator 1 500kVA 7" },
              { assetNumber: "GENSET001-ASSY008", name: "Power Station Generator 1 500kVA 8" },
              { assetNumber: "GENSET001", name: "Admin Generator 50kVA" },
              { assetNumber: "GENSET001", name: "Spare" },
              { assetNumber: "GENSET001", name: "Lab Generator 30kVA" },
              { assetNumber: "GENSET001", name: "Juno Bore Generator 200kVA" },
              { assetNumber: "GENSET001", name: "Mining Workshop 75kVA" },
              { assetNumber: "UNKN", name: "Power Generation" },
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
          { 
            label: "Reagents", 
            equipment: [
              { assetNumber: "UNKN", name: "Reagents" },
            ] 
          },
          { 
            label: "Cyanide Monorail", 
            equipment: [
              { assetNumber: "UNKN", name: "Cyanide Monorail" },
            ] 
          },
          { 
            label: "Cyanide Bag Breaker", 
            equipment: [
              { assetNumber: "UNKN", name: "Cyanide Bag Breaker" },
            ] 
          },
          { 
            label: "Caustic Bag Breaker", 
            equipment: [
              { assetNumber: "UNKN", name: "Caustic Bag Breaker" },
            ] 
          },
          { 
            label: "Cyanide Mixing Tank", 
            equipment: [
              { assetNumber: "UNKN", name: "Cyanide Mixing Tank" },
            ] 
          },
          { 
            label: "Cyanide Instruments", 
            equipment: [
              { assetNumber: "UNKN", name: "Cyanide Instruments" },
            ] 
          },
          { 
            label: "Cyanide Solution Storage Tank", 
            equipment: [
              { assetNumber: "UNKN", name: "Cyanide Solution Storage Tank" },
            ] 
          },
          { 
            label: "Reagent Safety Shower", 
            equipment: [
              { assetNumber: "UNKN", name: "Reagent Safety Shower" },
              { assetNumber: "UNKN", name: "Reagent Area Safety Shower 1" },
              { assetNumber: "UNKN", name: "Reagent Area Safety Shower 2" },
              { assetNumber: "UNKN", name: "Reagent Area Safety Shower 3" },
            ] 
          },
          { 
            label: "Floc System", 
            equipment: [
              { assetNumber: "UNKN", name: "Floc System" },
            ] 
          },
          { 
            label: "Cyanide Dosing Hut", 
            equipment: [
              { assetNumber: "UNKN", name: "Cyanide Dosing Hut" },
              { assetNumber: "UNKN", name: "Cyanide Dosing Hut 2" },
              { assetNumber: "UNKN", name: "Reagents Field MCC" },
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
              { assetNumber: "PWT001", name: "Potable Water Tank" },
              { assetNumber: "PWT001", name: "Potable Water Pipework" },
              { assetNumber: "PWT001-PMP001", name: "Potable Water Pump Standby" },
              { assetNumber: "PWT001-MCC001", name: "Potable Water Pump Standby – MCC Cell" },
              { assetNumber: "PWT001-LCS001", name: "Potable Water Pump Standby – LCS" },
              { assetNumber: "PWT001-PMP002", name: "Potable Water Pump Duty" },
              { assetNumber: "PWT001-MCC002", name: "Potable Water Pump Duty – MCC Cell" },
              { assetNumber: "PWT001-LCS002", name: "Potable Water Pump Duty – LCS" },
            ] 
          },
          { 
            label: "Raw Water Tank", 
            equipment: [
              { assetNumber: "RWT001", name: "Raw Water Storage Tank" },
              { assetNumber: "RWT001-PMP001", name: "Raw Water Pump Duty" },
              { assetNumber: "RWT001-MTR001", name: "Raw Water Pump Duty – Motor" },
              { assetNumber: "RWT001-MCC001", name: "Raw Water Pump Duty – MCC Cell" },
              { assetNumber: "RWT001-LCS001", name: "Raw Water Pump Duty – LCS" },
              { assetNumber: "RWT001-PMP002", name: "Raw Water Pump Stand-By" },
              { assetNumber: "RWT001-MTR002", name: "Raw Water Pump Stand-By – Motor" },
              { assetNumber: "RWT001-MCC002", name: "Raw Water Pump Stand-By – MCC Cell" },
              { assetNumber: "RWT001-LCS002", name: "Raw Water Pump Stand-By – LCS" },
            ] 
          },
          { 
            label: "Process Water Tank", 
            equipment: [
              { assetNumber: "PRWT001", name: "Safety Shower Water Tank" },
              { assetNumber: "PRWT001", name: "Safety Shower Water Tank Pipe Work" },
              { assetNumber: "PRWT001", name: "Gland Water Tank" },
              { assetNumber: "PRWT001", name: "Gland Water Piping" },
              { assetNumber: "PRWT001", name: "Andys Dam" },
              { assetNumber: "PRWT001", name: "Process Water Pond" },
              { assetNumber: "PRWT001", name: "Process Water Piping" },
              { assetNumber: "PRWT001-PMP001", name: "Process Water Pump Duty" },
              { assetNumber: "PRWT001-MTR001", name: "Process Water Pump Duty – Motor" },
              { assetNumber: "PRWT001-MCC001", name: "Process Water Pump Duty – MCC Cell" },
              { assetNumber: "PRWT001-LCS001", name: "Process Water Pump Duty – LCS" },
              { assetNumber: "PRWT001-SPD001", name: "Process Water Pump Duty – VSD" },
              { assetNumber: "PRWT001-PMP002", name: "Process Water Pump Stand-By" },
              { assetNumber: "PRWT001-MTR002", name: "Process Water Pump Stand-By – Motor" },
              { assetNumber: "PRWT001-MCC002", name: "Process Water Pump Stand-By – MCC Cell" },
              { assetNumber: "PRWT001-LCS002", name: "Process Water Pump Stand-By – LCS" },
              { assetNumber: "PRWT001-SPD002", name: "Process Water Pump Stand-By – VSD" },
            ] 
          },
        ],
      },
      {
        label: "Hydraulic Systems",
        parentAssets: [
          { 
            label: "Hydraulic Oil System", 
            equipment: [
              { assetNumber: "UNKN-HTR001", name: "Hydraulic Oil Heater" },
              { assetNumber: "UNKN-FAN002", name: "Hydraulic Oil Cooling Fan" },
            ] 
          },
        ],
      },
      {
        label: "Fuel Systems",
        parentAssets: [
          { 
            label: "Fuel Dispensing", 
            equipment: [
              { assetNumber: "UNKN", name: "Fuel Dispensing control Board" },
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
            label: "Apron Feeder", 
            equipment: [
              { assetNumber: "RF-FDR001", name: "Reclaim Feeder" },
              { assetNumber: "RF-FDR001-LCS001", name: "Reclaim Feeder – LCS" },
              { assetNumber: "RF-FDR001-MTR001", name: "Reclaim Feeder – Motor" },
              { assetNumber: "RF-FDR001-MCC001", name: "Reclaim Feeder – MCC Cell" },
              { assetNumber: "RF-FDR001-GBX001", name: "Reclaim Feeder – Gearbox" },
              { assetNumber: "RF-FDR001-PWS001", name: "Reclaim Feeder – Pullwire Switch" },
              { assetNumber: "RF-FDR001-TX001", name: "Reclaim Feeder – Speed Transmitter" },
              { assetNumber: "RF-FDR001-VLV001", name: "Lime Feeder – Rotary Valve" },
              { assetNumber: "RF-FDR001", name: "Regen Kiln Screw Feeder" },
            ] 
          },
          { 
            label: "Feed Hopper", 
            equipment: [
              // Original equipment
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
              // Part 2 equipment
              { assetNumber: "RF-HOP001", name: "CIP Trash Screen Feed Box" },
              { assetNumber: "RF-HOP001", name: "CIP Feed Trash Screen" },
              { assetNumber: "RF-HOP001", name: "CIP Feed Trash Screen Exciter A" },
              { assetNumber: "RF-HOP001-LCS004", name: "CIP Feed Trash Screen Exciter A – LCS" },
              { assetNumber: "RF-HOP001-MCC004", name: "CIP Feed Trash Screen Exciter A – MCC Cell" },
              { assetNumber: "RF-HOP001", name: "CIP Feed Trash Screen Exciter B" },
              { assetNumber: "RF-HOP001-LCS005", name: "CIP Feed Trash Screen Exciter B – LCS" },
              { assetNumber: "RF-HOP001-MCC005", name: "CIP Feed Trash Screen Exciter B – MCC Cell" },
              { assetNumber: "RF-HOP001", name: "CIP Feed Trash Screen Exciter Spray Bars" },
              { assetNumber: "RF-HOP001-CHU005", name: "CIP Trash Screen – Oversize Chute" },
              { assetNumber: "RF-HOP001", name: "Loaded Carbon Screen Feedbox" },
              { assetNumber: "RF-HOP001", name: "Loaded Carbon Screen" },
              { assetNumber: "RF-HOP001", name: "Loaded Carbon Screen Exciter A" },
              { assetNumber: "RF-HOP001-LCS006", name: "Loaded Carbon Screen Exciter A – LCS" },
              { assetNumber: "RF-HOP001-MCC006", name: "Loaded Carbon Screen Exciter A – MCC Cell" },
              { assetNumber: "RF-HOP001", name: "Loaded Carbon Screen Exciter B" },
              { assetNumber: "RF-HOP001-LCS007", name: "Loaded Carbon Screen Exciter B – LCS" },
              { assetNumber: "RF-HOP001-MCC007", name: "Loaded Carbon Screen Exciter B – MCC Cell" },
              { assetNumber: "RF-HOP001", name: "Loaded Carbon Screen Exciter Spray Bars" },
              { assetNumber: "RF-HOP001", name: "Loaded Carbon Screen Underpan" },
              { assetNumber: "RF-HOP001-CHU006", name: "Loaded Carbon Screen – Oversize Chute" },
              { assetNumber: "RF-HOP001", name: "CIP Inter Tank Screen 1" },
              { assetNumber: "RF-HOP001-MTR004", name: "CIP Inter Tank Screen 1 – Motor" },
              { assetNumber: "RF-HOP001-MCC008", name: "CIP Inter Tank Screen 1 – MCC Cell" },
              { assetNumber: "RF-HOP001-GBX002", name: "CIP Inter Tank Screen 1 – Gearbox" },
              { assetNumber: "RF-HOP001-LCS008", name: "CIP Inter Tank Screen 1 – LCS" },
              { assetNumber: "RF-HOP001", name: "CIP Inter Tank Screen 2" },
              { assetNumber: "RF-HOP001-MTR005", name: "CIP Inter Tank Screen 2 – Motor" },
              { assetNumber: "RF-HOP001-MCC009", name: "CIP Inter Tank Screen 2 – MCC Cell" },
              { assetNumber: "RF-HOP001-GBX003", name: "CIP Inter Tank Screen 2 – Gearbox" },
              { assetNumber: "RF-HOP001-LCS009", name: "CIP Inter Tank Screen 2 – LCS" },
              { assetNumber: "RF-HOP001", name: "CIP Inter Tank Screen 3" },
              { assetNumber: "RF-HOP001-MTR006", name: "CIP Inter Tank Screen 3 – Motor" },
              { assetNumber: "RF-HOP001-MCC010", name: "CIP Inter Tank Screen 3 – MCC Cell" },
              { assetNumber: "RF-HOP001-GBX004", name: "CIP Inter Tank Screen 3 – Gearbox" },
              { assetNumber: "RF-HOP001-LCS010", name: "CIP Inter Tank Screen 3 – LCS" },
              { assetNumber: "RF-HOP001", name: "CIP Inter Tank Screen 4" },
              { assetNumber: "RF-HOP001-MTR007", name: "CIP Inter Tank Screen 4 – Motor" },
              { assetNumber: "RF-HOP001-MCC011", name: "CIP Inter Tank Screen 4 – MCC Cell" },
              { assetNumber: "RF-HOP001-GBX005", name: "CIP Inter Tank Screen 4 – Gearbox" },
              { assetNumber: "RF-HOP001-LCS011", name: "CIP Inter Tank Screen 4 – LCS" },
              { assetNumber: "RF-HOP001", name: "CIP Inter Tank Screen 5" },
              { assetNumber: "RF-HOP001-MTR008", name: "CIP Inter Tank Screen 5 – Motor" },
              { assetNumber: "RF-HOP001-MCC012", name: "CIP Inter Tank Screen 5 – MCC Cell" },
              { assetNumber: "RF-HOP001-GBX006", name: "CIP Inter Tank Screen 5 – Gearbox" },
              { assetNumber: "RF-HOP001-LCS012", name: "CIP Inter Tank Screen 5 – LCS" },
              { assetNumber: "RF-HOP001", name: "CIP Inter Tank Screen 6" },
              { assetNumber: "RF-HOP001", name: "Carbon Safety Screen Feed Box" },
              { assetNumber: "RF-HOP001", name: "Carbon Safety Screen" },
              { assetNumber: "RF-HOP001-CHU007", name: "Carbon Safety Screen – Underpan Chute" },
              { assetNumber: "RF-HOP001-CHU008", name: "Carbon Safety Screen – Oversize Chute" },
              // Part 3 equipment
              { assetNumber: "RF-HOP001", name: "Barron Carbon Dewatering Screen" },
              { assetNumber: "RF-HOP001", name: "Barron Carbon Dewatering Screen Excitor" },
              { assetNumber: "RF-HOP001-MCC013", name: "Barron Carbon Dewatering Screen – MCC Cell" },
              { assetNumber: "RF-HOP001-LCS013", name: "Barron Carbon Dewatering Screen – LCS" },
              { assetNumber: "RF-HOP001", name: "Gravity" },
              { assetNumber: "RF-HOP001", name: "Gravity Screen" },
              { assetNumber: "RF-HOP001-CHU009", name: "Gravity Screen – Feed Chute" },
              { assetNumber: "RF-HOP001", name: "Gravity Screen Under Pan" },
              { assetNumber: "RF-HOP001-CHU010", name: "Gravity Screen – Discharge Chute" },
              { assetNumber: "RF-HOP001", name: "Knelson Concentrator" },
              { assetNumber: "RF-HOP001", name: "Concentrate Collection Cone" },
              { assetNumber: "RF-HOP001", name: "Concentrate Shaking Table" },
              { assetNumber: "RF-HOP001-MTR009", name: "Concentrate Shaking Table – Motor" },
              { assetNumber: "RF-HOP001-LCS014", name: "Concentrate Shaking Table – LCS" },
              { assetNumber: "RF-HOP001-GBX007", name: "Concentrate Shaking Table – Gearbox" },
              // Part 4 equipment
              { assetNumber: "RF-HOP001", name: "Crusher Fuel Farm 15kVA" },
              { assetNumber: "RF-HOP001", name: "Mill Feed Conveyor Field MCC" },
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
              // Part 3 equipment
              { assetNumber: "CV001", name: "Filter 1 Extraction Conveyor" },
              { assetNumber: "CV001-MTR002", name: "Filter 1 Extraction – Motor" },
              { assetNumber: "CV001-GBX002", name: "Filter 1 Extraction – Gearbox" },
              { assetNumber: "CV001", name: "Filter 1 Extraction Conveyor – VFD" },
              { assetNumber: "CV001-MCC002", name: "Filter 1 Extraction Conveyor – MCC Cell" },
              // Part 4 equipment
              { assetNumber: "CV001", name: "Filter 2 Extraction Conveyor" },
              { assetNumber: "CV001-MTR003", name: "Filter 2 Extraction – Motor" },
              { assetNumber: "CV001-GBX003", name: "Filter 2 Extraction – Gearbox" },
              { assetNumber: "CV001", name: "Filter 2 Extraction Conveyor – VFD" },
              { assetNumber: "CV001-MCC003", name: "Filter 2 Extraction Conveyor – MCC Cell" },
              { assetNumber: "CV001", name: "Tails Filter Press Collection Conveyor" },
              { assetNumber: "CV001-MTR004", name: "Tails Filter Press Collection Conveyor – Motor" },
              { assetNumber: "CV001-GBX004", name: "Tails Filter Press Collection Conveyor – Gearbox" },
              { assetNumber: "CV001-MCC004", name: "Tails Filter Press Collection Conveyor – MCC Cell" },
              { assetNumber: "CV001", name: "Tails Filter Press Collection Conveyor – VFD" },
              { assetNumber: "CV001", name: "Tails Filter Press Radial Stacker Conveyor" },
              { assetNumber: "CV001-MTR005", name: "Tails Filter Press Radial Stacker Conveyor Drive Motor A" },
              { assetNumber: "CV001-MTR006", name: "Tails Filter Press Radial Stacker Conveyor Drive Motor B" },
              { assetNumber: "CV001-MTR007", name: "Tails Filter Press Radial Stacker Conveyor Wheel Drive Motor A" },
              { assetNumber: "CV001-MTR008", name: "Tails Filter Press Radial Stacker Conveyor Wheel Drive Motor B" },
              { assetNumber: "CV001", name: "Tails Filter Press Radial Stacker Conveyor Drive Gear Box A" },
              { assetNumber: "CV001", name: "Tails Filter Press Radial Stacker Conveyor Drive Gear Box B" },
              { assetNumber: "CV001-GBX005", name: "Tails Filter Press Radial Stacker Conveyor Wheel Drive Gearbox A" },
              { assetNumber: "CV001-GBX006", name: "Tails Filter Press Radial Stacker Conveyor Wheel Drive Gearbox B" },
              { assetNumber: "CV001-MCC005", name: "Tails Filter Press Radial Stacker Conveyor Drive A – MCC Cell" },
              { assetNumber: "CV001-MCC006", name: "Tails Filter Press Radial Stacker Conveyor Drive B – MCC Cell" },
              { assetNumber: "CV001-MCC007", name: "Tails Filter Press Radial Stacker Conveyor Wheel Drive A – MCC Cell" },
              { assetNumber: "CV001-MCC008", name: "Tails Filter Press Radial Stacker Conveyor Wheel Drive B – MCC Cell" },
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
              // Part 4 equipment
              { assetNumber: "BM001", name: "Mill Area Field MCC" },
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
              { assetNumber: "CYC001", name: "Primary Cyclone Underflow Splitter Box" },
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
          { 
            label: "Gravity Electrowinning", 
            equipment: [
              { assetNumber: "UNKN", name: "Gravity Electrowinning" },
              { assetNumber: "UNKN-FAN001", name: "Gravity Electrowinning – Fan" },
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
              { assetNumber: "CIP-TK01", name: "CIP Area" },
              { assetNumber: "CIP-TK01-PMP001", name: "CIP Leach Area Sump Pump" },
              { assetNumber: "CIP-TK01-MTR001", name: "CIP Leach Area Sump Pump – Motor" },
              { assetNumber: "CIP-TK01-MCC001", name: "CIP Leach Area Sump Pump – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS001", name: "CIP Leach Area Sump Pump – LCS" },
              { assetNumber: "CIP-TK01", name: "CIP Leach Tank 1" },
              { assetNumber: "CIP-TK01-AGT001", name: "CIP Leach Tank 1 – Agitator" },
              { assetNumber: "CIP-TK01-MTR002", name: "CIP Leach Tank 1 – Agitator Motor" },
              { assetNumber: "CIP-TK01-MCC002", name: "CIP Leach Tank 1 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK01-AGT002", name: "CIP Leach Tank 1 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS002", name: "CIP Leach Tank 1 – Agitator LCS" },
              { assetNumber: "CIP-TK01", name: "CIP Leach Tank 1 – PH Probe" },
              { assetNumber: "CIP-TK01", name: "Leach Tank 1 – Air Sparge Nozzles" },
              { assetNumber: "CIP-TK01", name: "Carbon Transfer Air Lift 2" },
              { assetNumber: "CIP-TK01", name: "CIP Tails Area Safety Shower" },
              { assetNumber: "CIP-TK01", name: "CIP Tank 4" },
              { assetNumber: "CIP-TK01-AGT003", name: "CIP Tank 4 – Agitator" },
              { assetNumber: "CIP-TK01-MTR003", name: "CIP Tank 4 – Agitator Motor" },
              { assetNumber: "CIP-TK01-AGT004", name: "CIP Tank 4 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS003", name: "CIP Tank 4 – Agitator LCS" },
              { assetNumber: "CIP-TK01", name: "Carbon Transfer Air Lift 3" },
              { assetNumber: "CIP-TK01", name: "CIP Tank 5" },
              { assetNumber: "CIP-TK01-AGT005", name: "CIP Tank 5 – Agitator" },
              { assetNumber: "CIP-TK01-MTR004", name: "CIP Tank 5 – Agitator Motor" },
              { assetNumber: "CIP-TK01-AGT006", name: "CIP Tank 5 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS004", name: "CIP Tank 5 – Agitator LCS" },
              { assetNumber: "CIP-TK01", name: "Carbon Transfer Air Lift 4" },
              { assetNumber: "CIP-TK01", name: "CIP Tank 6" },
              { assetNumber: "CIP-TK01-AGT007", name: "CIP Tank 6 – Agitator" },
              { assetNumber: "CIP-TK01-MTR005", name: "CIP Tank 6 – Agitator Motor" },
              { assetNumber: "CIP-TK01-AGT008", name: "CIP Tank 6 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS005", name: "CIP Tank 6 – Agitator LCS" },
              { assetNumber: "CIP-TK01", name: "Carbon Transfer Air Lift 5" },
              { assetNumber: "CIP-TK01", name: "CIP Tank 7" },
              { assetNumber: "CIP-TK01", name: "CIP Tank 7 – Agitator" },
              { assetNumber: "CIP-TK01-MTR006", name: "CIP Tank 7 – Agitator Motor" },
              { assetNumber: "CIP-TK01-AGT009", name: "CIP Tank 7 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS006", name: "CIP Tank 7 – Agitator LCS" },
              { assetNumber: "CIP-TK01", name: "Carbon Transfer Air Lift 6" },
              { assetNumber: "CIP-TK01", name: "CIP Tank 8" },
              { assetNumber: "CIP-TK01", name: "CIP Tank 8 – Agitator" },
              { assetNumber: "CIP-TK01-MTR007", name: "CIP Tank 8 – Agitator Motor" },
              { assetNumber: "CIP-TK01-AGT010", name: "CIP Tank 8 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS007", name: "CIP Tank 8 – Agitator LCS" },
              { assetNumber: "CIP-TK01-AGT011", name: "Cyanide Mixing Tank – Agitator" },
              { assetNumber: "CIP-TK01-MTR008", name: "Cyanide Mixing Tank – Agitator Motor" },
              { assetNumber: "CIP-TK01-GBX001", name: "Cyanide Mixing Tank – Agitator Gearbox" },
              { assetNumber: "CIP-TK01-LCS008", name: "Cyanide Mixing Tank – Agitator LCS" },
              { assetNumber: "CIP-TK01-TX001", name: "Cyanide Mixing Tank – Level Transmitter" },
              { assetNumber: "CIP-TK01-TX002", name: "Cyanide Storage Tank – Level Transmitter" },
              { assetNumber: "CIP-TK01-PMP002", name: "Cyanide Transfer Pump" },
              { assetNumber: "CIP-TK01-MTR009", name: "Cyanide Transfer Pump – Motor" },
              { assetNumber: "CIP-TK01-PMP003", name: "Cyanide Transfer Pump – MCC" },
              { assetNumber: "CIP-TK01-LCS009", name: "Cyanide Transfer Pump – LCS" },
              { assetNumber: "CIP-TK01-PMP004", name: "Cyanide Dosing Pump Duty" },
              { assetNumber: "CIP-TK01-MTR010", name: "Cyanide Transfer Pump – Motor 2" },
              { assetNumber: "CIP-TK01-PMP005", name: "Cyanide Transfer Pump – MCC 2" },
              { assetNumber: "CIP-TK01-LCS010", name: "Cyanide Transfer Pump – LCS 2" },
              { assetNumber: "CIP-TK01-PMP006", name: "Cyanide Dosing Pump Stand-by" },
              { assetNumber: "CIP-TK01-MTR011", name: "Cyanide Dosing Pump Stand-by – Motor" },
              { assetNumber: "CIP-TK01-MCC003", name: "Cyanide Dosing Pump Stand-by – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS011", name: "Cyanide Dosing Pump Stand-by – LCS" },
              { assetNumber: "CIP-TK01-PMP007", name: "Cyanide Area Sump Pump" },
              { assetNumber: "CIP-TK01-MTR012", name: "Cyanide Area Sump Pump – Motor" },
              { assetNumber: "CIP-TK01-MCC004", name: "Cyanide Area Sump Pump – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS012", name: "Cyanide Area Sump Pump – LCS" },
              { assetNumber: "CIP-TK01-PMP008", name: "Caustic Dosing Pump" },
              { assetNumber: "CIP-TK01-MTR013", name: "Caustic Dosing Pump – Motor" },
              { assetNumber: "CIP-TK01-MCC005", name: "Caustic Dosing Pump – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS013", name: "Caustic Dosing Pump – LCS" },
              { assetNumber: "CIP-TK01-PMP009", name: "Diesel Pump" },
              { assetNumber: "CIP-TK01", name: "Diesel Day Tank" },
              { assetNumber: "CIP-TK01-PMP010", name: "HCL Acid Dosing Pump" },
              { assetNumber: "CIP-TK01-PMP011", name: "HCL Area Sump Pump" },
              { assetNumber: "CIP-TK01-PMP012", name: "Eluate Pump Discharge High High Pressure Switch" },
              { assetNumber: "CIP-TK01-PMP013", name: "Eluate Pump Discharge Pressure Gauge" },
              { assetNumber: "CIP-TK01", name: "Acid Wash Column Inlet Pressure Gauge" },
              { assetNumber: "CIP-TK01", name: "Acid Wash Column Discharge Pressure Gauge" },
              { assetNumber: "CIP-TK01-PMP014", name: "Eluate Pump Discharge Temperature Gauge" },
              { assetNumber: "CIP-TK01-SEN001", name: "Acid Wash Column HCL Flow Sensor" },
              { assetNumber: "CIP-TK01-SEN002", name: "Eluate Tank Cyanide Feed Flow Sensor" },
              { assetNumber: "CIP-TK01-VLV001", name: "Eluate Tank Cyanide Feed Solenoid Valve" },
              { assetNumber: "CIP-TK01-SEN003", name: "Eluate Tank Level Sensor" },
              { assetNumber: "CIP-TK01-SWT001", name: "Acid Wash Column High High Level Switch" },
              { assetNumber: "CIP-TK01-PMP015", name: "HCL Dosing Pump Solenoid Valve" },
              { assetNumber: "CIP-TK01", name: "Acid Wash Column" },
              { assetNumber: "CIP-TK01", name: "Acid Column Filters" },
              { assetNumber: "CIP-TK01", name: "Eluate Tank" },
              { assetNumber: "CIP-TK01", name: "Carbon Regen Kiln" },
              { assetNumber: "CIP-TK01", name: "Regenerated Carbon Quench Hopper" },
              // Part 3 equipment
              { assetNumber: "CIP-TK01-PMP016", name: "Eluate Pump" },
              { assetNumber: "CIP-TK01-MTR014", name: "Eluate Pump – Motor" },
              { assetNumber: "CIP-TK01-MCC006", name: "Eluate Pump – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS014", name: "Eluate Pump – LCS" },
              { assetNumber: "CIP-TK01-PMP017", name: "Carbon Transfer Pump" },
              { assetNumber: "CIP-TK01-MTR015", name: "Carbon Transfer Pump – Motor" },
              { assetNumber: "CIP-TK01-MCC007", name: "Carbon Transfer Pump – MCC Cell" },
              { assetNumber: "CIP-TK01-PMP018", name: "Carbon Transfer Pump – LCS" },
              { assetNumber: "CIP-TK01-SWT002", name: "Regenerated Carbon Quench Hopper Low Low Level Switch" },
              { assetNumber: "CIP-TK01", name: "High Pressure Cathode Washer" },
              { assetNumber: "CIP-TK01", name: "Cathode Wash Box" },
              { assetNumber: "CIP-TK01-PMP019", name: "Cathode Wash Sludge Pump" },
              { assetNumber: "CIP-TK01-MTR016", name: "Cathode Wash Sludge Pump – Motor" },
              { assetNumber: "CIP-TK01-MCC008", name: "Cathode Wash Sludge Pump – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS015", name: "Cathode Wash Sludge Pump – LCS" },
              { assetNumber: "CIP-TK01", name: "Cathode Winder" },
              { assetNumber: "CIP-TK01", name: "Cathode Sludge Filter Press" },
              { assetNumber: "CIP-TK01", name: "Calcine Oven" },
              { assetNumber: "CIP-TK01", name: "Calcine Oven Hood" },
              { assetNumber: "CIP-TK01-FAN001", name: "Calcine Oven Extraction Fan" },
              { assetNumber: "CIP-TK01", name: "Gold Bullion Scale" },
              { assetNumber: "CIP-TK01", name: "Gold Bullion Scale Bench" },
              { assetNumber: "CIP-TK01-PMP020", name: "Safety Shower Water Pump Duty" },
              { assetNumber: "CIP-TK01-MTR017", name: "Safety Shower Water Pump Duty – Motor" },
              { assetNumber: "CIP-TK01-MCC009", name: "Safety Shower Water Pump Duty – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS016", name: "Safety Shower Water Pump Duty – LCS" },
              { assetNumber: "CIP-TK01-PMP021", name: "Safety Shower Water Pump Standby" },
              { assetNumber: "CIP-TK01-MTR018", name: "Safety Shower Water Pump Standby – Motor" },
              { assetNumber: "CIP-TK01-MCC010", name: "Safety Shower Water Pump Standby – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS017", name: "Safety Shower Water Pump Standby – LCS" },
              { assetNumber: "CIP-TK01-PMP022", name: "Gland Water Pump Duty" },
              { assetNumber: "CIP-TK01-MTR019", name: "Gland Water Pump Duty – Motor" },
              { assetNumber: "CIP-TK01-MCC011", name: "Gland Water Pump Duty – MCC Cell" },
              { assetNumber: "CIP-TK01-LCS018", name: "Gland Water Pump Duty – LCS" },
              { assetNumber: "CIP-TK01-PMP023", name: "Gland Water Pump Stand-By" },
              { assetNumber: "CIP-TK01-PMP024", name: "Gland Water Pump Stand-By 2" },
              { assetNumber: "CIP-TK01-PMP025", name: "Gland Water Pump Stand-By 3" },
              { assetNumber: "CIP-TK01-PMP026", name: "Gland Water Pump Stand-By 4" },
              { assetNumber: "CIP-TK01-PMP027", name: "Filter 1 Feed Pump" },
              { assetNumber: "CIP-TK01-MTR020", name: "Filter 1 Feed Pump – Motor" },
              { assetNumber: "CIP-TK01-PMP028", name: "Filter 1 Feed Pump – VFD" },
              { assetNumber: "CIP-TK01-MCC012", name: "Filter 1 Feed Pump – MCC Cell" },
              // Part 4 equipment
              { assetNumber: "CIP-TK01-PMP029", name: "Filter Press 1 Hydraulic Plate Pack Pump" },
              { assetNumber: "CIP-TK01-PMP030", name: "Filter Press 1 Hydraulic TT Plate Pump" },
              { assetNumber: "CIP-TK01-PMP031", name: "Filter 2 Feed Pump" },
              { assetNumber: "CIP-TK01-MTR021", name: "Filter 2 Feed Pump – Motor" },
              { assetNumber: "CIP-TK01-PMP032", name: "Filter 2 Feed Pump – VFD" },
              { assetNumber: "CIP-TK01-MCC013", name: "Filter 2 Feed Pump – MCC Cell" },
              { assetNumber: "CIP-TK01-PMP033", name: "Filter Press 2 Hydraulic Plate Pack Pump" },
              { assetNumber: "CIP-TK01-PMP034", name: "Filter Press 2 Hydraulic TT Plate Pump" },
              { assetNumber: "CIP-TK01-PMP035", name: "Filter Area Sump Pump" },
              { assetNumber: "CIP-TK01-MTR022", name: "Filter Area Sump Pump – Motor" },
              { assetNumber: "CIP-TK01-PMP036", name: "Filter Area Sump Pump – LCS" },
              { assetNumber: "CIP-TK01-MCC014", name: "Filter Area Sump Pump – MCC Cell" },
              { assetNumber: "CIP-TK01", name: "Titration Hut" },
              { assetNumber: "CIP-TK01", name: "Nobles Natral Sump Generator 30kVA" },
            ] 
          },
          { 
            label: "CIP Tank 2", 
            equipment: [
              { assetNumber: "CIP-TK02", name: "CIP Area Safety Showers" },
              { assetNumber: "CIP-TK02", name: "CIP Area Safety Shower 2" },
              { assetNumber: "CIP-TK02", name: "CIP Leach Tank 2" },
              { assetNumber: "CIP-TK02-AGT001", name: "CIP Leach Tank 2 – Agitator" },
              { assetNumber: "CIP-TK02-MTR001", name: "CIP Leach Tank 2 – Agitator Motor" },
              { assetNumber: "CIP-TK02-MCC001", name: "CIP Leach Tank 2 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK02-AGT002", name: "CIP Leach Tank 2 – Agitator Gear Box" },
              { assetNumber: "CIP-TK02-LCS001", name: "CIP Leach Tank 2 – Agitator LCS" },
              { assetNumber: "CIP-TK02", name: "Leach Tank 2 – Air Sparge Nozzles" },
            ] 
          },
          { 
            label: "CIP Tank 3", 
            equipment: [
              { assetNumber: "CIP-TK03", name: "CIP Area Safety Shower 1" },
              { assetNumber: "CIP-TK03", name: "CIP Tank 3" },
              { assetNumber: "CIP-TK03-AGT001", name: "CIP Tank 3 – Agitator" },
              { assetNumber: "CIP-TK03-MTR001", name: "CIP Tank 3 – Agitator Motor" },
              { assetNumber: "CIP-TK03-AGT002", name: "CIP Tank 3 – Agitator Gear Box" },
              { assetNumber: "CIP-TK03-LCS001", name: "CIP Tank 3 – Agitator LCS" },
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
              { assetNumber: "ELU-COL001", name: "Elution" },
              { assetNumber: "ELU-COL001", name: "Elution Column" },
              { assetNumber: "ELU-COL001", name: "Elution Column Filters" },
              { assetNumber: "ELU-COL001", name: "Elution Instruments" },
              { assetNumber: "ELU-COL001", name: "Elution Column Outlet Pressure Gauge" },
              { assetNumber: "ELU-COL001", name: "Elution Column Inlet Pressure Gauge" },
              { assetNumber: "ELU-COL001", name: "Elution Column Outlet Temperature Gauge" },
              { assetNumber: "ELU-COL001", name: "Elution Column Inlet Temperature Gauge" },
              { assetNumber: "ELU-COL001", name: "Elution Area Safety Shower 1" },
              { assetNumber: "ELU-COL001", name: "Elution Area Safety Shower 2" },
              { assetNumber: "ELU-COL001-PMP001", name: "Elution Area Sump Pump" },
              { assetNumber: "ELU-COL001-MTR001", name: "Elution Area Sump Pump – Motor" },
              { assetNumber: "ELU-COL001-MCC001", name: "Elution Area Sump Pump – MCC Cell" },
              { assetNumber: "ELU-COL001-LCS001", name: "Elution Area Sump Pump – LCS" },
              // Part 3 equipment
              { assetNumber: "ELU-COL001", name: "Regen Kiln Feed Hopper" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Burners" },
              { assetNumber: "ELU-COL001", name: "Regen Instruments" },
              { assetNumber: "ELU-COL001-SEN001", name: "Regen Kiln Feed Screw Inlet Level Sensor" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Zone 2 Temperature Gauge 1" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Zone 2 Temperature Gauge 2" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Zone 3 Temperature Gauge 1" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Zone 3 Temperature Gauge 2" },
              { assetNumber: "ELU-COL001-SEN002", name: "Regen Kiln Discharge Temperature Sensor" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Zone 1 Temperature Gauge 1" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Zone 1 Temperature Gauge 2" },
              { assetNumber: "ELU-COL001", name: "Regen Kiln Feed End Temperature Gauge" },
              // Part 4 equipment
              { assetNumber: "ELU-COL001", name: "Elution Area Field MCC" },
            ]
          },
          { 
            label: "Heat Exchanger", 
            equipment: [
              { assetNumber: "HEAEXC001", name: "Elution Recovery Heat Exchange" },
              { assetNumber: "HEAEXC001-HTR001", name: "Elution Heater Differential Pressure High Switch" },
              { assetNumber: "HEAEXC001-HTR002", name: "Elution Heater Inlet Pressure Gauge" },
              { assetNumber: "HEAEXC001-HTR003", name: "Elution Heater Outlet Pressure Gauge" },
              { assetNumber: "HEAEXC001-HTR004", name: "Elution Heater Inlet Pressure Gauge 2" },
              { assetNumber: "HEAEXC001", name: "Elution Heat Exchange Inlet Temperature Gauge" },
              { assetNumber: "HEAEXC001", name: "Elution Heat Exchange Outlet Pressure Gauge" },
              { assetNumber: "HEAEXC001", name: "Elution Heat Exchange Outlet Temperature Gauge" },
              { assetNumber: "HEAEXC001-HTR005", name: "Elution Heater Inlet Temperature Gauge" },
              { assetNumber: "HEAEXC001-HTR006", name: "Elution Heater Outlet Temperature Gauge" },
              { assetNumber: "HEAEXC001-HTR007", name: "Elution Heater Burner Controller" },
              { assetNumber: "HEAEXC001-HTR008", name: "Elution Heater Outlet Temperature Sensor" },
              { assetNumber: "HEAEXC001-HTR009", name: "Elution Heater Flue Temperature Sensor" },
              { assetNumber: "HEAEXC001-HTR010", name: "Elution Heater Inlet Flow Sensor" },
              { assetNumber: "HEAEXC001-HTR011", name: "Elution Heater" },
              { assetNumber: "HEAEXC001-HTR012", name: "Elution Heater Burner" },
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
            label: "Electrowinning Cell", 
            equipment: [
              { assetNumber: "ELECEL001", name: "Gold Room Safety Shower" },
              { assetNumber: "ELECEL001", name: "Electrowinning Monorail" },
              { assetNumber: "ELECEL001-CELL001", name: "Electrowinning Cell" },
              { assetNumber: "ELECEL001-FAN001", name: "Electrowinning Fan" },
              { assetNumber: "ELECEL001", name: "Electrowinning Solution Tank" },
              // Part 3 equipment
              { assetNumber: "ELECEL001-PMP001", name: "Electrowinning Feed Pump" },
              { assetNumber: "ELECEL001-MTR001", name: "Electrowinning Feed Pump – Motor" },
              { assetNumber: "ELECEL001-MCC001", name: "Electrowinning Feed Pump – MCC Cell" },
              { assetNumber: "ELECEL001-LCS001", name: "Electrowinning Feed Pump – LCS" },
              { assetNumber: "ELECEL001", name: "Gold Room Instruments" },
              { assetNumber: "ELECEL001", name: "Electrowinning Flashpot Inlet Temperature Gauge" },
              { assetNumber: "ELECEL001-SWT001", name: "Electrowinning Flashpot High High Level Switch" },
              { assetNumber: "ELECEL001", name: "Gold Room Work Bench" },
              { assetNumber: "ELECEL001", name: "Gold Room Bullion Safe" },
            ] 
          },
          { 
            label: "Smelting Furnace", 
            equipment: [
              { assetNumber: "SMEFUR001", name: "Gold Room Barring Furnace" },
              { assetNumber: "SMEFUR001-FAN001", name: "Barring Furnace Extraction Fan" },
              { assetNumber: "SMEFUR001", name: "Barring Furnace Hood" },
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
            label: "Thickener", 
            equipment: [
              { assetNumber: "THK001", name: "Tails" },
              { assetNumber: "THK001", name: "CIP Tailings Hopper" },
              { assetNumber: "THK001", name: "Tails Instruments" },
              { assetNumber: "THK001", name: "Tails Flow Meter" },
              { assetNumber: "THK001-TX001", name: "CIP Tailings Hopper Level Transmitter" },
              // Part 3 equipment
              { assetNumber: "THK001", name: "Tails Thickener" },
              { assetNumber: "THK001-VLV001", name: "Tails Thickener Piping and Valves" },
              { assetNumber: "THK001", name: "Thickener Hydraulic Pack" },
              { assetNumber: "THK001", name: "Thickener Hydraulic Pack Instruments 1" },
              { assetNumber: "THK001", name: "Thickener Hydraulic Pack Instruments 2" },
              // Part 4 equipment
              { assetNumber: "THK001", name: "Thickener Field MCC" },
            ] 
          },
          { 
            label: "Thickener Underflow Pump", 
            equipment: [
              { assetNumber: "THK001-PMP001", name: "CIP Tails Area Sump Pump" },
              { assetNumber: "THK001-MTR001", name: "CIP Tails Area Sump Pump – Motor" },
              { assetNumber: "THK001-MCC001", name: "CIP Tails Area Sump Pump – MCC Cell" },
              { assetNumber: "THK001-PMP002", name: "CIP Tails Area Sump Pump – LCS" },
              { assetNumber: "THK001-PMP003", name: "CIP Tailings Pump A" },
              { assetNumber: "THK001-MTR002", name: "CIP Tailings Pump A – Motor" },
              { assetNumber: "THK001-MCC002", name: "CIP Tailings Pump A – MCC Cell" },
              { assetNumber: "THK001-LCS001", name: "CIP Tailings Pump A – LCS" },
              { assetNumber: "THK001-SPD001", name: "CIP Tailings Pump A – VSD" },
              { assetNumber: "THK001-PMP004", name: "CIP Tailings Pump B" },
              { assetNumber: "THK001-MTR003", name: "CIP Tailings Pump B – Motor" },
              { assetNumber: "THK001-MCC003", name: "CIP Tailings Pump B – MCC Cell" },
              { assetNumber: "THK001-LCS002", name: "CIP Tailings Pump B – LCS" },
              { assetNumber: "THK001-SPD002", name: "CIP Tailings Pump B – VSD" },
              // Part 3 equipment
              { assetNumber: "THK001-PMP005", name: "Gravity Tails Pump" },
              { assetNumber: "THK001-MTR004", name: "Gravity Tails Pump – Motor" },
              { assetNumber: "THK001-MCC004", name: "Gravity Tails Pump – MCC Cell" },
              { assetNumber: "THK001-LCS003", name: "Gravity Tails Pump – LCS" },
              { assetNumber: "THK001-PMP006", name: "Thickener Underflow Pump A" },
              { assetNumber: "THK001-MTR005", name: "Thickener Underflow Pump Duty – Motor" },
              { assetNumber: "THK001-MCC005", name: "Thickener Underflow Pump Duty – MCC Cell" },
              { assetNumber: "THK001-LCS004", name: "Thickener Underflow Pump Duty – LCS" },
              { assetNumber: "THK001-SPD003", name: "Thickener Underflow Duty – VSD" },
              { assetNumber: "THK001-PMP007", name: "Thickener Underflow Pump B" },
              { assetNumber: "THK001-MTR006", name: "Thickener Underflow Standby Pump – Motor" },
              { assetNumber: "THK001-PMP008", name: "Thickener Underflow Standby Pump – MCC" },
              { assetNumber: "THK001-PMP009", name: "Thickener Underflow Standby Pump – LCS" },
              { assetNumber: "THK001-PMP010", name: "Thickener Underflow Standby Pump – VFD" },
              { assetNumber: "THK001-PMP011", name: "Tails Area Sump Pump" },
              { assetNumber: "THK001-MTR007", name: "Tails Area Sump Pump – Motor" },
              { assetNumber: "THK001-PMP012", name: "Tails Area Sump Pump – MCC" },
              { assetNumber: "THK001-LCS005", name: "Tails Area Sump Pump – LCS" },
              { assetNumber: "THK001-PMP013", name: "Thickener Hydraulic Pump" },
              { assetNumber: "THK001-MTR008", name: "Thickener Hydraulic Pump – Motor" },
              { assetNumber: "THK001-LCS006", name: "Thickener Hydraulic Pump – LCS" },
            ] 
          },
        ],
      },
      {
        label: "Filtering",
        parentAssets: [
          { 
            label: "Filter Press", 
            equipment: [
              { assetNumber: "FP001", name: "Tails Filter Press" },
              // Part 3 equipment
              { assetNumber: "FP001", name: "Filter Press 1" },
              { assetNumber: "FP001", name: "Filter 1 Stock Tank" },
              { assetNumber: "FP001-AGT001", name: "Filter 1 Stock Tank Agitator" },
              // Part 4 equipment
              { assetNumber: "FP001-MTR001", name: "Filter 1 Stock Tank Agitator – Motor" },
              { assetNumber: "FP001-GBX001", name: "Filter 1 Stock Tank Agitator – Gearbox" },
              { assetNumber: "FP001", name: "Filter 1 Instruments" },
              { assetNumber: "FP001-VLV001", name: "Filter 1 Piping and Valves" },
              { assetNumber: "FP001", name: "Filter Press 1 Hydraulic Pack" },
              { assetNumber: "FP001-MTR002", name: "Filter Press 1 Hydraulic Plate Pack – Motor" },
              { assetNumber: "FP001-MTR003", name: "Filter Press 1 Hydraulic TT Plate – Motor" },
              { assetNumber: "FP001", name: "Filter Press 2" },
              { assetNumber: "FP001", name: "Filter 2 Stock Tank" },
              { assetNumber: "FP001-AGT002", name: "Filter 2 Stock Tank Agitator" },
              { assetNumber: "FP001-MTR004", name: "Filter 2 Stock Tank Agitator – Motor" },
              { assetNumber: "FP001-GBX002", name: "Filter 2 Stock Tank Agitator – Gearbox" },
              { assetNumber: "FP001", name: "Filter 2 Instruments" },
              { assetNumber: "FP001-VLV002", name: "Filter 2 Piping and Valves" },
              { assetNumber: "FP001", name: "Filter Press 2 Hydraulic Pack" },
              { assetNumber: "FP001-MTR005", name: "Filter Press 2 Hydraulic Plate Pack – Motor" },
              { assetNumber: "FP001-MTR006", name: "Filter Press 2 Hydraulic TT Plate – Motor" },
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
          { 
            label: "Laboratory Systems", 
            equipment: [
              { assetNumber: "UNKN", name: "Lab" },
              { assetNumber: "UNKN", name: "Main DB Lab" },
              { assetNumber: "UNKN", name: "Lab L&P DB" },
            ] 
          },
        ],
      },
      {
        label: "Mobile Equipment",
        parentAssets: [
          { 
            label: "Plant Mobile Equipment", 
            equipment: [
              { assetNumber: "UNKN", name: "CIP Area Gantry Crane" },
              { assetNumber: "UNKN", name: "Knelson Area Hoist" },
              { assetNumber: "UNKN", name: "Mobile Equipment" },
              { assetNumber: "UNKN", name: "25t Franner Crane" },
              { assetNumber: "UNKN", name: "Workshop" },
              { assetNumber: "UNKN", name: "Workshop DB" },
              { assetNumber: "UNKN", name: "Forklift" },
              { assetNumber: "UNKN", name: "Telehandler" },
              { assetNumber: "UNKN", name: "Bob Cat" },
              { assetNumber: "UNKN", name: "Water Truck" },
              { assetNumber: "UNKN", name: "Service Truck" },
              { assetNumber: "UNKN", name: "Sino EWP" },
              { assetNumber: "UNKN", name: "Hire EWP" },
              { assetNumber: "UNKN", name: "Sino Scissor Lift 1" },
              { assetNumber: "UNKN", name: "Sino Scissor Lift 2" },
              { assetNumber: "UNKN", name: "Cat 980 Loader 1" },
              { assetNumber: "UNKN", name: "Cat 980 Loader 2" },
              { assetNumber: "UNKN", name: "Cat 980 Loader 3" },
              { assetNumber: "UNKN", name: "Cat 980 Loader 4" },
              { assetNumber: "UNKN", name: "Cat 30t Excavator" },
              { assetNumber: "UNKN", name: "Case Excavator" },
              { assetNumber: "UNKN", name: "Cat Moxy 1" },
              { assetNumber: "UNKN", name: "Cat Moxy 2" },
            ]
          },
        ],
      },
      {
        label: "Site Infrastructure",
        parentAssets: [
          { 
            label: "Services", 
            equipment: [
              { assetNumber: "UNKN", name: "Services" },
              { assetNumber: "UNKN", name: "Lath Container L&P" },
              { assetNumber: "UNKN", name: "Crib Room L&P DB" },
              { assetNumber: "UNKN", name: "Conference Building L&P" },
              { assetNumber: "UNKN", name: "First Aid Room L&P DB" },
            ] 
          },
        ],
      },
      {
        label: "Light Vehicles",
        parentAssets: [
          { 
            label: "LV Fleet", 
            equipment: [
              { assetNumber: "UNKN", name: "Light Vehicle" },
              { assetNumber: "UNKN", name: "Toyota Hilux 1" },
              { assetNumber: "UNKN", name: "Toyota Hilux 2" },
              { assetNumber: "UNKN", name: "Toyota Hilux 3" },
              { assetNumber: "UNKN", name: "Toyota Hilux 4" },
              { assetNumber: "UNKN", name: "Toyota Hilux 5" },
              { assetNumber: "UNKN", name: "Toyota Hilux 6" },
              { assetNumber: "UNKN", name: "Toyota Hilux 7" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 1" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 2" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 3" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 4" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 5" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 6" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 7" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 8" },
              { assetNumber: "UNKN", name: "Ford Ranger XL Dual Cab 9" },
              { assetNumber: "UNKN", name: "Ranger Single Cab" },
              { assetNumber: "UNKN", name: "Kia" },
              { assetNumber: "UNKN", name: "Toyota Hiace 1" },
              { assetNumber: "UNKN", name: "Toyota Hiace 2" },
              { assetNumber: "UNKN", name: "LDV Discovery 9 1" },
              { assetNumber: "UNKN", name: "LDV Discovery 9 2" },
              { assetNumber: "UNKN", name: "Fuso TF Canter Flat Top Truck" },
              { assetNumber: "UNKN", name: "LC Military" },
            ] 
          },
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
