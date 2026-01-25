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
              { assetNumber: "SVC001", name: "Services" },
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
              { assetNumber: "HPCOMP001", name: "HP Air Compressor" },
              { assetNumber: "HPCOMP001-PIPE001", name: "HP Air Compressor Piping" },
              { assetNumber: "HPCOMP001-MCC001", name: "HP Air Compressor – MCC Cell 1" },
              { assetNumber: "HPRCV001", name: "HP Air Receiver 1" },
              { assetNumber: "HPCOMP002", name: "HP Air Compressor 2" },
              { assetNumber: "HPCOMP002-PIPE001", name: "HP Air Compressor Piping 2" },
              { assetNumber: "HPCOMP002-MCC001", name: "HP Air Compressor – MCC Cell 2" },
              { assetNumber: "HPRCV002", name: "HP Air Receiver 2" },
              { assetNumber: "HPCOMP003", name: "Filter Area HP Air Compressor" },
              { assetNumber: "HPCOMP003-PIPE001", name: "HP Air Compressor Piping 3" },
              { assetNumber: "HPCOMP003-MCC001", name: "HP Air Compressor – MCC Cell 3" },
              { assetNumber: "HPRCV003", name: "HP Air Receiver 3" },
              { assetNumber: "HPCOMP004-MCC001", name: "HP Air Compressor – MCC Cell 4" },
              { assetNumber: "HPRCV004", name: "HP Air Receiver 4" },
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
              { assetNumber: "LTWR001", name: "Lighting Tower 1" },
              { assetNumber: "LTWR002", name: "Lighting Tower 2" },
              { assetNumber: "LTWR003", name: "Lighting Tower 3" },
              { assetNumber: "LTWR004", name: "Lighting Tower 4" },
              { assetNumber: "LTWR005", name: "Lighting Tower 5" },
            ] 
          },
          { 
            label: "Main Sub Station", 
            equipment: [
              { assetNumber: "MSUB001", name: "Main Sub Station" },
              { assetNumber: "MSUB001-DB001", name: "RO Plant Main Board" },
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
              { assetNumber: "PWRGEN001", name: "Power Generation" },
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
              { assetNumber: "LIMESILO001", name: "Lime Storage Silo" },
              { assetNumber: "LIMESILO001-VLV001", name: "Lime Storage Silo – Discharge Valve" },
            ] 
          },
          { 
            label: "Lime Silo Vibrator", 
            equipment: [
              { assetNumber: "LIMESILO001-VIB001", name: "Lime Silo Vibrator" },
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
              { assetNumber: "REAG001", name: "Reagents" },
            ] 
          },
          { 
            label: "Reagent Safety Shower", 
            equipment: [
              { assetNumber: "REAG-SHW01", name: "Reagent Safety Shower" },
              { assetNumber: "REAG-SHW02", name: "Reagent Area Safety Shower 1" },
              { assetNumber: "REAG-SHW03", name: "Reagent Area Safety Shower 2" },
              { assetNumber: "REAG-SHW04", name: "Reagent Area Safety Shower 3" },
            ] 
          },
          { 
            label: "Floc System", 
            equipment: [
              { assetNumber: "FLOCSYS001", name: "Floc System" },
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
              { assetNumber: "HYDOIL001-HTR001", name: "Hydraulic Oil Heater" },
              { assetNumber: "HYDOIL001-FAN001", name: "Hydraulic Oil Cooling Fan" },
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
              { assetNumber: "FUELDISP001-DB001", name: "Fuel Dispensing control Board" },
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
              // Ball Mill
              { assetNumber: "BM001", name: "Primary Ball Mill" },
              { assetNumber: "BM001-MTR001", name: "Primary Ball Mill – Motor" },
              { assetNumber: "BM001-GBX001", name: "Primary Ball Mill – Gearbox" },
              { assetNumber: "BM001-PIN001", name: "Primary Ball Mill – Pinion" },
              { assetNumber: "BM001-MCC001", name: "Primary Ball Mill – MCC Cell" },
              { assetNumber: "BM001-VSD001", name: "Primary Ball Mill – VSD" },
              { assetNumber: "BM001-RED001", name: "Primary Ball Mill – Gear Reducer" },
              { assetNumber: "BM001-RED001-INS001", name: "Mill Gear Reducer – Temperature" },
              { assetNumber: "BM001-VLV001", name: "Mill Discharge End – Water Addition Control Valve" },
              { assetNumber: "BM001-TX001", name: "Mill Discharge End – Water Addition Flow Transmitter" },
              { assetNumber: "BM001-TX002", name: "Mill Discharge Hopper – Level Transmitter" },
              { assetNumber: "BM001-MNR001", name: "Ball Mill – Loading Monorail" },
              // Mill Area Safety Showers
              { assetNumber: "MILL-SHW01", name: "Mill Area Safety Shower 1" },
              { assetNumber: "MILL-SHW02", name: "Mill Area Safety Shower 2" },
              // Lube System
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
              // Discharge Hopper
              { assetNumber: "BM001-HOP001", name: "Primary Mill – Discharge Hopper" },
              // Part 4 equipment
              { assetNumber: "MILL-MCC001", name: "Mill Area Field MCC" },
            ]
          },
          { 
            label: "Grinding Sump", 
            equipment: [
              { assetNumber: "GSPMP001-PMP001", name: "Grinding Area Sump Pump" },
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
              { assetNumber: "GRAVCON001-MTR001", name: "Gravity Concentrator 1 – Motor" },
              { assetNumber: "GRAVCON001-PMP001", name: "Gravity Concentrator 1 – Water Pump" },
              { assetNumber: "GRAVCON001-MCC001", name: "Gravity Concentrator 1 – MCC Cell" },
            ] 
          },
          { 
            label: "Concentrate Pump", 
            equipment: [
              { assetNumber: "CONCPMP001-PMP001", name: "Concentrate Pump – Pump" },
              { assetNumber: "CONCPMP001-MTR001", name: "Concentrate Pump – Motor" },
            ] 
          },
          { 
            label: "Gravity Electrowinning", 
            equipment: [
              { assetNumber: "GRAVEW001", name: "Gravity Electrowinning" },
              { assetNumber: "GRAVEW001-FAN001", name: "Gravity Electrowinning – Fan" },
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
              // CIP Area (system reference)
              { assetNumber: "CIP-AREA001", name: "CIP Area" },
              // CIP Leach Area Sump
              { assetNumber: "CIP-PMP001", name: "CIP Leach Area Sump Pump" },
              { assetNumber: "CIP-PMP001-MTR001", name: "CIP Leach Area Sump Pump – Motor" },
              { assetNumber: "CIP-PMP001-MCC001", name: "CIP Leach Area Sump Pump – MCC Cell" },
              { assetNumber: "CIP-PMP001-LCS001", name: "CIP Leach Area Sump Pump – LCS" },
              // CIP Leach Tank 1
              { assetNumber: "CIP-TK01", name: "CIP Leach Tank 1" },
              { assetNumber: "CIP-TK01-AGT001", name: "CIP Leach Tank 1 – Agitator" },
              { assetNumber: "CIP-TK01-MTR001", name: "CIP Leach Tank 1 – Agitator Motor" },
              { assetNumber: "CIP-TK01-MCC001", name: "CIP Leach Tank 1 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK01-GBX001", name: "CIP Leach Tank 1 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS001", name: "CIP Leach Tank 1 – Agitator LCS" },
              { assetNumber: "CIP-TK01-INS001", name: "CIP Leach Tank 1 – PH Probe" },
              { assetNumber: "CIP-NZL01", name: "Leach Tank 1 – Air Sparge Nozzles" },
              { assetNumber: "CIP-ALF02", name: "Carbon Transfer Air Lift 2" },
              // CIP Tails Safety Shower
              { assetNumber: "CIP-SHW01", name: "CIP Tails Area Safety Shower" },
              // CIP Tank 4
              { assetNumber: "CIP-TK04", name: "CIP Tank 4" },
              { assetNumber: "CIP-TK04-AGT001", name: "CIP Tank 4 – Agitator" },
              { assetNumber: "CIP-TK04-MTR001", name: "CIP Tank 4 – Agitator Motor" },
              { assetNumber: "CIP-TK04-GBX001", name: "CIP Tank 4 – Agitator Gear Box" },
              { assetNumber: "CIP-TK04-LCS001", name: "CIP Tank 4 – Agitator LCS" },
              { assetNumber: "CIP-ALF03", name: "Carbon Transfer Air Lift 3" },
              // CIP Tank 5
              { assetNumber: "CIP-TK05", name: "CIP Tank 5" },
              { assetNumber: "CIP-TK05-AGT001", name: "CIP Tank 5 – Agitator" },
              { assetNumber: "CIP-TK05-MTR001", name: "CIP Tank 5 – Agitator Motor" },
              { assetNumber: "CIP-TK05-GBX001", name: "CIP Tank 5 – Agitator Gear Box" },
              { assetNumber: "CIP-TK05-LCS001", name: "CIP Tank 5 – Agitator LCS" },
              { assetNumber: "CIP-ALF04", name: "Carbon Transfer Air Lift 4" },
              // CIP Tank 6
              { assetNumber: "CIP-TK06", name: "CIP Tank 6" },
              { assetNumber: "CIP-TK06-AGT001", name: "CIP Tank 6 – Agitator" },
              { assetNumber: "CIP-TK06-MTR001", name: "CIP Tank 6 – Agitator Motor" },
              { assetNumber: "CIP-TK06-GBX001", name: "CIP Tank 6 – Agitator Gear Box" },
              { assetNumber: "CIP-TK06-LCS001", name: "CIP Tank 6 – Agitator LCS" },
              { assetNumber: "CIP-ALF05", name: "Carbon Transfer Air Lift 5" },
              // CIP Tank 7
              { assetNumber: "CIP-TK07", name: "CIP Tank 7" },
              { assetNumber: "CIP-TK07-AGT001", name: "CIP Tank 7 – Agitator" },
              { assetNumber: "CIP-TK07-MTR001", name: "CIP Tank 7 – Agitator Motor" },
              { assetNumber: "CIP-TK07-GBX001", name: "CIP Tank 7 – Agitator Gear Box" },
              { assetNumber: "CIP-TK07-LCS001", name: "CIP Tank 7 – Agitator LCS" },
              { assetNumber: "CIP-ALF06", name: "Carbon Transfer Air Lift 6" },
              // CIP Tank 8
              { assetNumber: "CIP-TK08", name: "CIP Tank 8" },
              { assetNumber: "CIP-TK08-AGT001", name: "CIP Tank 8 – Agitator" },
              { assetNumber: "CIP-TK08-MTR001", name: "CIP Tank 8 – Agitator Motor" },
              { assetNumber: "CIP-TK08-GBX001", name: "CIP Tank 8 – Agitator Gear Box" },
              { assetNumber: "CIP-TK08-LCS001", name: "CIP Tank 8 – Agitator LCS" },
              // Cyanide Mixing (duplicates removed - use CYMIX001 parent)
              { assetNumber: "CYMIX001-AGT002", name: "Cyanide Mixing Tank – Agitator" },
              { assetNumber: "CYMIX001-MTR002", name: "Cyanide Mixing Tank – Agitator Motor" },
              { assetNumber: "CYMIX001-GBX001", name: "Cyanide Mixing Tank – Agitator Gearbox" },
              { assetNumber: "CYMIX001-LCS001", name: "Cyanide Mixing Tank – Agitator LCS" },
              { assetNumber: "CYMIX001-TX001", name: "Cyanide Mixing Tank – Level Transmitter" },
              // Cyanide Storage Tank
              { assetNumber: "CYSTOR001-TX001", name: "Cyanide Storage Tank – Level Transmitter" },
              // Cyanide Transfer Pumps
              { assetNumber: "CYXFR001-PMP001", name: "Cyanide Transfer Pump" },
              { assetNumber: "CYXFR001-MTR001", name: "Cyanide Transfer Pump – Motor" },
              { assetNumber: "CYXFR001-MCC001", name: "Cyanide Transfer Pump – MCC" },
              { assetNumber: "CYXFR001-LCS001", name: "Cyanide Transfer Pump – LCS" },
              { assetNumber: "CYDOS001-PMP001", name: "Cyanide Dosing Pump Duty" },
              { assetNumber: "CYXFR001-MTR002", name: "Cyanide Transfer Pump – Motor 2" },
              { assetNumber: "CYXFR001-MCC002", name: "Cyanide Transfer Pump – MCC 2" },
              { assetNumber: "CYXFR001-LCS002", name: "Cyanide Transfer Pump – LCS 2" },
              { assetNumber: "CYDOS001-PMP002", name: "Cyanide Dosing Pump Stand-by" },
              { assetNumber: "CYDOS001-MTR001", name: "Cyanide Dosing Pump Stand-by – Motor" },
              { assetNumber: "CYDOS001-MCC001", name: "Cyanide Dosing Pump Stand-by – MCC Cell" },
              { assetNumber: "CYDOS001-LCS001", name: "Cyanide Dosing Pump Stand-by – LCS" },
              // Cyanide Area Sump
              { assetNumber: "CYSMP001-PMP001", name: "Cyanide Area Sump Pump" },
              { assetNumber: "CYSMP001-MTR001", name: "Cyanide Area Sump Pump – Motor" },
              { assetNumber: "CYSMP001-MCC001", name: "Cyanide Area Sump Pump – MCC Cell" },
              { assetNumber: "CYSMP001-LCS001", name: "Cyanide Area Sump Pump – LCS" },
              // Caustic Dosing
              { assetNumber: "CAUSDOS001-PMP001", name: "Caustic Dosing Pump" },
              { assetNumber: "CAUSDOS001-MTR001", name: "Caustic Dosing Pump – Motor" },
              { assetNumber: "CAUSDOS001-MCC001", name: "Caustic Dosing Pump – MCC Cell" },
              { assetNumber: "CAUSDOS001-LCS001", name: "Caustic Dosing Pump – LCS" },
              // Diesel
              { assetNumber: "DIESEL001-PMP001", name: "Diesel Pump" },
              { assetNumber: "DIESEL001-TK001", name: "Diesel Day Tank" },
              // HCL System
              { assetNumber: "HCLDOS001-PMP001", name: "HCL Acid Dosing Pump" },
              { assetNumber: "HCLSMP001-PMP001", name: "HCL Area Sump Pump" },
              // Eluate System
              { assetNumber: "ELUATE001-SWT001", name: "Eluate Pump Discharge High High Pressure Switch" },
              { assetNumber: "ELUATE001-INS001", name: "Eluate Pump Discharge Pressure Gauge" },
              // Acid Wash Column
              { assetNumber: "ACIDCOL001", name: "Acid Wash Column" },
              { assetNumber: "ACIDCOL001-INS001", name: "Acid Wash Column Inlet Pressure Gauge" },
              { assetNumber: "ACIDCOL001-INS002", name: "Acid Wash Column Discharge Pressure Gauge" },
              { assetNumber: "ACIDCOL001-FLT001", name: "Acid Column Filters" },
              { assetNumber: "ACIDCOL001-SEN001", name: "Acid Wash Column HCL Flow Sensor" },
              { assetNumber: "ACIDCOL001-SWT001", name: "Acid Wash Column High High Level Switch" },
              // Eluate Tank
              { assetNumber: "ELUATE001-TK001", name: "Eluate Tank" },
              { assetNumber: "ELUATE001-INS002", name: "Eluate Pump Discharge Temperature Gauge" },
              { assetNumber: "ELUATE001-SEN001", name: "Eluate Tank Cyanide Feed Flow Sensor" },
              { assetNumber: "ELUATE001-VLV001", name: "Eluate Tank Cyanide Feed Solenoid Valve" },
              { assetNumber: "ELUATE001-SEN002", name: "Eluate Tank Level Sensor" },
              { assetNumber: "HCLDOS001-VLV001", name: "HCL Dosing Pump Solenoid Valve" },
              // Carbon Regen
              { assetNumber: "CREGEN001-KLN001", name: "Carbon Regen Kiln" },
              { assetNumber: "CREGEN001-HOP001", name: "Regenerated Carbon Quench Hopper" },
              // Part 3 equipment
              { assetNumber: "ELUATE001-PMP001", name: "Eluate Pump" },
              { assetNumber: "ELUATE001-MTR001", name: "Eluate Pump – Motor" },
              { assetNumber: "ELUATE001-MCC001", name: "Eluate Pump – MCC Cell" },
              { assetNumber: "ELUATE001-LCS001", name: "Eluate Pump – LCS" },
              { assetNumber: "CARBXFR001-PMP001", name: "Carbon Transfer Pump" },
              { assetNumber: "CARBXFR001-MTR001", name: "Carbon Transfer Pump – Motor" },
              { assetNumber: "CARBXFR001-MCC001", name: "Carbon Transfer Pump – MCC Cell" },
              { assetNumber: "CARBXFR001-LCS001", name: "Carbon Transfer Pump – LCS" },
              { assetNumber: "CREGEN001-SWT001", name: "Regenerated Carbon Quench Hopper Low Low Level Switch" },
              // Cathode System
              { assetNumber: "CATHW001", name: "High Pressure Cathode Washer" },
              { assetNumber: "CATHW001-BOX001", name: "Cathode Wash Box" },
              { assetNumber: "CATHW001-PMP001", name: "Cathode Wash Sludge Pump" },
              { assetNumber: "CATHW001-MTR001", name: "Cathode Wash Sludge Pump – Motor" },
              { assetNumber: "CATHW001-MCC001", name: "Cathode Wash Sludge Pump – MCC Cell" },
              { assetNumber: "CATHW001-LCS001", name: "Cathode Wash Sludge Pump – LCS" },
              { assetNumber: "CATHW001-WND001", name: "Cathode Winder" },
              { assetNumber: "CATHW001-FP001", name: "Cathode Sludge Filter Press" },
              // Calcine System
              { assetNumber: "CALC001", name: "Calcine Oven" },
              { assetNumber: "CALC001-HOOD001", name: "Calcine Oven Hood" },
              { assetNumber: "CALC001-FAN001", name: "Calcine Oven Extraction Fan" },
              // Gold Bullion
              { assetNumber: "BULLION001-SCL001", name: "Gold Bullion Scale" },
              { assetNumber: "BULLION001-BEN001", name: "Gold Bullion Scale Bench" },
              // Safety Shower Water Pumps
              { assetNumber: "SSHWPMP001-PMP001", name: "Safety Shower Water Pump Duty" },
              { assetNumber: "SSHWPMP001-MTR001", name: "Safety Shower Water Pump Duty – Motor" },
              { assetNumber: "SSHWPMP001-MCC001", name: "Safety Shower Water Pump Duty – MCC Cell" },
              { assetNumber: "SSHWPMP001-LCS001", name: "Safety Shower Water Pump Duty – LCS" },
              { assetNumber: "SSHWPMP002-PMP001", name: "Safety Shower Water Pump Standby" },
              { assetNumber: "SSHWPMP002-MTR001", name: "Safety Shower Water Pump Standby – Motor" },
              { assetNumber: "SSHWPMP002-MCC001", name: "Safety Shower Water Pump Standby – MCC Cell" },
              { assetNumber: "SSHWPMP002-LCS001", name: "Safety Shower Water Pump Standby – LCS" },
              // Gland Water Pumps
              { assetNumber: "GLDWTR001-PMP001", name: "Gland Water Pump Duty" },
              { assetNumber: "GLDWTR001-MTR001", name: "Gland Water Pump Duty – Motor" },
              { assetNumber: "GLDWTR001-MCC001", name: "Gland Water Pump Duty – MCC Cell" },
              { assetNumber: "GLDWTR001-LCS001", name: "Gland Water Pump Duty – LCS" },
              { assetNumber: "GLDWTR001-PMP002", name: "Gland Water Pump Stand-By" },
              { assetNumber: "GLDWTR001-PMP003", name: "Gland Water Pump Stand-By 2" },
              { assetNumber: "GLDWTR001-PMP004", name: "Gland Water Pump Stand-By 3" },
              { assetNumber: "GLDWTR001-PMP005", name: "Gland Water Pump Stand-By 4" },
              // Filter Feed Pumps
              { assetNumber: "FLTFEED001-PMP001", name: "Filter 1 Feed Pump" },
              { assetNumber: "FLTFEED001-MTR001", name: "Filter 1 Feed Pump – Motor" },
              { assetNumber: "FLTFEED001-VFD001", name: "Filter 1 Feed Pump – VFD" },
              { assetNumber: "FLTFEED001-MCC001", name: "Filter 1 Feed Pump – MCC Cell" },
              // Part 4 equipment
              { assetNumber: "FP001-HYD001-PMP001", name: "Filter Press 1 Hydraulic Plate Pack Pump" },
              { assetNumber: "FP001-HYD001-PMP002", name: "Filter Press 1 Hydraulic TT Plate Pump" },
              { assetNumber: "FLTFEED002-PMP001", name: "Filter 2 Feed Pump" },
              { assetNumber: "FLTFEED002-MTR001", name: "Filter 2 Feed Pump – Motor" },
              { assetNumber: "FLTFEED002-VFD001", name: "Filter 2 Feed Pump – VFD" },
              { assetNumber: "FLTFEED002-MCC001", name: "Filter 2 Feed Pump – MCC Cell" },
              { assetNumber: "FP002-HYD001-PMP001", name: "Filter Press 2 Hydraulic Plate Pack Pump" },
              { assetNumber: "FP002-HYD001-PMP002", name: "Filter Press 2 Hydraulic TT Plate Pump" },
              // Filter Area Sump
              { assetNumber: "FLTSMP001-PMP001", name: "Filter Area Sump Pump" },
              { assetNumber: "FLTSMP001-MTR001", name: "Filter Area Sump Pump – Motor" },
              { assetNumber: "FLTSMP001-LCS001", name: "Filter Area Sump Pump – LCS" },
              { assetNumber: "FLTSMP001-MCC001", name: "Filter Area Sump Pump – MCC Cell" },
              // Other
              { assetNumber: "TITHUT001", name: "Titration Hut" },
              { assetNumber: "GENSET002", name: "Nobles Natral Sump Generator 30kVA" },
            ]
          },
          { 
            label: "CIP Tank 2", 
            equipment: [
              { assetNumber: "CIP-SHW02", name: "CIP Area Safety Showers" },
              { assetNumber: "CIP-SHW03", name: "CIP Area Safety Shower 2" },
              { assetNumber: "CIP-TK02", name: "CIP Leach Tank 2" },
              { assetNumber: "CIP-TK02-AGT001", name: "CIP Leach Tank 2 – Agitator" },
              { assetNumber: "CIP-TK02-MTR001", name: "CIP Leach Tank 2 – Agitator Motor" },
              { assetNumber: "CIP-TK02-MCC001", name: "CIP Leach Tank 2 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK02-GBX001", name: "CIP Leach Tank 2 – Agitator Gear Box" },
              { assetNumber: "CIP-TK02-LCS001", name: "CIP Leach Tank 2 – Agitator LCS" },
              { assetNumber: "CIP-NZL02", name: "Leach Tank 2 – Air Sparge Nozzles" },
            ] 
          },
          { 
            label: "CIP Tank 3", 
            equipment: [
              { assetNumber: "CIP-SHW04", name: "CIP Area Safety Shower 1" },
              { assetNumber: "CIP-TK03", name: "CIP Tank 3" },
              { assetNumber: "CIP-TK03-AGT001", name: "CIP Tank 3 – Agitator" },
              { assetNumber: "CIP-TK03-MTR001", name: "CIP Tank 3 – Agitator Motor" },
              { assetNumber: "CIP-TK03-GBX001", name: "CIP Tank 3 – Agitator Gear Box" },
              { assetNumber: "CIP-TK03-LCS001", name: "CIP Tank 3 – Agitator LCS" },
            ] 
          },
          { 
            label: "CIP Transfer Pump", 
            equipment: [
              { assetNumber: "CIPXFR001-PMP001", name: "CIP Transfer Pump – Pump" },
              { assetNumber: "CIPXFR001-MTR001", name: "CIP Transfer Pump – Motor" },
            ] 
          },
          { 
            label: "Cyanide Monorail", 
            equipment: [
              { assetNumber: "CYMNR001", name: "Cyanide Monorail" },
            ] 
          },
          { 
            label: "Cyanide Bag Breaker", 
            equipment: [
              { assetNumber: "CYBB001", name: "Cyanide Bag Breaker" },
            ] 
          },
          { 
            label: "Caustic Bag Breaker", 
            equipment: [
              { assetNumber: "CAUSBB001", name: "Caustic Bag Breaker" },
            ] 
          },
          { 
            label: "Cyanide Mixing Tank", 
            equipment: [
              { assetNumber: "CYMIX001", name: "Cyanide Mixing Tank" },
              { assetNumber: "CYMIX001-TK001", name: "Cyanide Mixing Tank – Tank" },
              { assetNumber: "CYMIX001-AGT001", name: "Cyanide Mixing Tank – Agitator" },
              { assetNumber: "CYMIX001-MTR001", name: "Cyanide Mixing Tank – Agitator Motor" },
            ] 
          },
          { 
            label: "Cyanide Instruments", 
            equipment: [
              { assetNumber: "CYINS001", name: "Cyanide Instruments" },
            ] 
          },
          { 
            label: "Cyanide Solution Storage Tank", 
            equipment: [
              { assetNumber: "CYSTOR001-TK001", name: "Cyanide Solution Storage Tank" },
            ] 
          },
          { 
            label: "Cyanide Dosing Hut", 
            equipment: [
              { assetNumber: "CYDOS001", name: "Cyanide Dosing Hut" },
              { assetNumber: "CYDOS002", name: "Cyanide Dosing Hut 2" },
              { assetNumber: "REAG-MCC001", name: "Reagents Field MCC" },
            ] 
          },
          { label: "Titration Hut", equipment: [] },
        ],
      },
      {
        label: "Elution",
        parentAssets: [
          { 
            label: "Elution Column", 
            equipment: [
              // Elution Column
              { assetNumber: "ELU-COL001", name: "Elution Column" },
              { assetNumber: "ELU-COL001-FLT001", name: "Elution Column Filters" },
              { assetNumber: "ELU-COL001-INS001", name: "Elution Column Outlet Pressure Gauge" },
              { assetNumber: "ELU-COL001-INS002", name: "Elution Column Inlet Pressure Gauge" },
              { assetNumber: "ELU-COL001-INS003", name: "Elution Column Outlet Temperature Gauge" },
              { assetNumber: "ELU-COL001-INS004", name: "Elution Column Inlet Temperature Gauge" },
              // Elution Area Safety Showers
              { assetNumber: "ELU-SHW01", name: "Elution Area Safety Shower 1" },
              { assetNumber: "ELU-SHW02", name: "Elution Area Safety Shower 2" },
              // Elution Area Sump
              { assetNumber: "ELU-PMP001", name: "Elution Area Sump Pump" },
              { assetNumber: "ELU-PMP001-MTR001", name: "Elution Area Sump Pump – Motor" },
              { assetNumber: "ELU-PMP001-MCC001", name: "Elution Area Sump Pump – MCC Cell" },
              { assetNumber: "ELU-PMP001-LCS001", name: "Elution Area Sump Pump – LCS" },
              // Part 3 equipment - Regen Kiln related (moved to proper parents)
              { assetNumber: "RKHOP001", name: "Regen Kiln Feed Hopper" },
              { assetNumber: "KLN001-BRN001", name: "Regen Kiln Burners" },
              { assetNumber: "KLN001-SEN001", name: "Regen Kiln Feed Screw Inlet Level Sensor" },
              { assetNumber: "KLN001-INS001", name: "Regen Kiln Zone 2 Temperature Gauge 1" },
              { assetNumber: "KLN001-INS002", name: "Regen Kiln Zone 2 Temperature Gauge 2" },
              { assetNumber: "KLN001-INS003", name: "Regen Kiln Zone 3 Temperature Gauge 1" },
              { assetNumber: "KLN001-INS004", name: "Regen Kiln Zone 3 Temperature Gauge 2" },
              { assetNumber: "KLN001-SEN002", name: "Regen Kiln Discharge Temperature Sensor" },
              { assetNumber: "KLN001-INS005", name: "Regen Kiln Zone 1 Temperature Gauge 1" },
              { assetNumber: "KLN001-INS006", name: "Regen Kiln Zone 1 Temperature Gauge 2" },
              { assetNumber: "KLN001-INS007", name: "Regen Kiln Feed End Temperature Gauge" },
              // Part 4 equipment
              { assetNumber: "ELU-MCC001", name: "Elution Area Field MCC" },
            ]
          },
          { 
            label: "Heat Exchanger", 
            equipment: [
              { assetNumber: "HEAEXC001", name: "Elution Recovery Heat Exchange" },
              { assetNumber: "HEAEXC001-SWT001", name: "Elution Heater Differential Pressure High Switch" },
              { assetNumber: "HEAEXC001-INS001", name: "Elution Heater Inlet Pressure Gauge" },
              { assetNumber: "HEAEXC001-INS002", name: "Elution Heater Outlet Pressure Gauge" },
              { assetNumber: "HEAEXC001-INS003", name: "Elution Heater Inlet Pressure Gauge 2" },
              { assetNumber: "HEAEXC001-INS004", name: "Elution Heat Exchange Inlet Temperature Gauge" },
              { assetNumber: "HEAEXC001-INS005", name: "Elution Heat Exchange Outlet Pressure Gauge" },
              { assetNumber: "HEAEXC001-INS006", name: "Elution Heat Exchange Outlet Temperature Gauge" },
              { assetNumber: "HEAEXC001-INS007", name: "Elution Heater Inlet Temperature Gauge" },
              { assetNumber: "HEAEXC001-INS008", name: "Elution Heater Outlet Temperature Gauge" },
              { assetNumber: "HEAEXC001-CTRL001", name: "Elution Heater Burner Controller" },
              { assetNumber: "HEAEXC001-SEN001", name: "Elution Heater Outlet Temperature Sensor" },
              { assetNumber: "HEAEXC001-SEN002", name: "Elution Heater Flue Temperature Sensor" },
              { assetNumber: "HEAEXC001-SEN003", name: "Elution Heater Inlet Flow Sensor" },
              { assetNumber: "HEAEXC001-HTR001", name: "Elution Heater" },
              { assetNumber: "HEAEXC001-BRN001", name: "Elution Heater Burner" },
            ] 
          },
          { 
            label: "Acid Wash System", 
            equipment: [
              { assetNumber: "ACIDW001-TK001", name: "Acid Wash System – Acid Tank" },
              { assetNumber: "ACIDW001-PMP001", name: "Acid Wash System – Dosing Pump" },
              { assetNumber: "ACIDW001-AGT001", name: "Acid Wash System – Agitator" },
            ] 
          },
          { 
            label: "Regen Kiln", 
            equipment: [
              { assetNumber: "KLN001", name: "Regen Kiln – Kiln" },
              { assetNumber: "KLN001-MTR001", name: "Regen Kiln – Drive Motor" },
              { assetNumber: "KLN001-GBX001", name: "Regen Kiln – Gearbox" },
              { assetNumber: "KLN001-FAN001", name: "Regen Kiln – Combustion Fan" },
            ] 
          },
          { 
            label: "Regen Kiln Feed Hopper", 
            equipment: [
              { assetNumber: "RKHOP001-FDR001", name: "Regen Kiln Feed Hopper – Feeder" },
              { assetNumber: "RKHOP001-MTR001", name: "Regen Kiln Feed Hopper – Motor" },
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
              { assetNumber: "GR-SHW01", name: "Gold Room Safety Shower" },
              { assetNumber: "ELECEL001-MNR001", name: "Electrowinning Monorail" },
              { assetNumber: "ELECEL001-CELL001", name: "Electrowinning Cell" },
              { assetNumber: "ELECEL001-FAN001", name: "Electrowinning Fan" },
              { assetNumber: "ELECEL001-TK001", name: "Electrowinning Solution Tank" },
              // Part 3 equipment
              { assetNumber: "ELECEL001-PMP001", name: "Electrowinning Feed Pump" },
              { assetNumber: "ELECEL001-MTR001", name: "Electrowinning Feed Pump – Motor" },
              { assetNumber: "ELECEL001-MCC001", name: "Electrowinning Feed Pump – MCC Cell" },
              { assetNumber: "ELECEL001-LCS001", name: "Electrowinning Feed Pump – LCS" },
              { assetNumber: "ELECEL001-INS001", name: "Electrowinning Flashpot Inlet Temperature Gauge" },
              { assetNumber: "ELECEL001-SWT001", name: "Electrowinning Flashpot High High Level Switch" },
              { assetNumber: "GR-BEN001", name: "Gold Room Work Bench" },
              { assetNumber: "GR-SAFE001", name: "Gold Room Bullion Safe" },
            ] 
          },
          { 
            label: "Smelting Furnace", 
            equipment: [
              { assetNumber: "SMEFUR001", name: "Gold Room Barring Furnace" },
              { assetNumber: "SMEFUR001-FAN001", name: "Barring Furnace Extraction Fan" },
              { assetNumber: "SMEFUR001-HOOD001", name: "Barring Furnace Hood" },
            ] 
          },
          { label: "Gold Pour Area", equipment: [] },
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
              // Thickener
              { assetNumber: "THK001", name: "Tails Thickener" },
              { assetNumber: "THK001-VLV001", name: "Tails Thickener Piping and Valves" },
              // Tailings Hopper
              { assetNumber: "TAIL-HOP001", name: "CIP Tailings Hopper" },
              { assetNumber: "TAIL-HOP001-TX001", name: "CIP Tailings Hopper Level Transmitter" },
              // Instruments
              { assetNumber: "THK001-INS001", name: "Tails Flow Meter" },
              // Thickener Hydraulic Pack
              { assetNumber: "THK001-HYD001", name: "Thickener Hydraulic Pack" },
              { assetNumber: "THK001-HYD001-INS001", name: "Thickener Hydraulic Pack Instruments 1" },
              { assetNumber: "THK001-HYD001-INS002", name: "Thickener Hydraulic Pack Instruments 2" },
              // Part 4 equipment
              { assetNumber: "THK001-MCC001", name: "Thickener Field MCC" },
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
              { assetNumber: "FP001", name: "Tails Filter Press 1" },
              { assetNumber: "FP001-TK001", name: "Filter 1 Stock Tank" },
              { assetNumber: "FP001-AGT001", name: "Filter 1 Stock Tank Agitator" },
              // Part 4 equipment
              { assetNumber: "FP001-MTR001", name: "Filter 1 Stock Tank Agitator – Motor" },
              { assetNumber: "FP001-GBX001", name: "Filter 1 Stock Tank Agitator – Gearbox" },
              { assetNumber: "FP001-FP001-INST", name: "Filter 1 Instruments" },
              { assetNumber: "FP001-VLV001", name: "Filter 1 Piping and Valves" },
              { assetNumber: "FP001-FP001-HYD", name: "Filter Press 1 Hydraulic Pack" },
              { assetNumber: "FP001-MTR002", name: "Filter Press 1 Hydraulic Plate Pack – Motor" },
              { assetNumber: "FP001-MTR003", name: "Filter Press 1 Hydraulic TT Plate – Motor" },
              { assetNumber: "FP001-FP002", name: "Filter Press 2" },
              { assetNumber: "FP001-TK002", name: "Filter 2 Stock Tank" },
              { assetNumber: "FP001-AGT002", name: "Filter 2 Stock Tank Agitator" },
              { assetNumber: "FP001-MTR004", name: "Filter 2 Stock Tank Agitator – Motor" },
              { assetNumber: "FP001-GBX002", name: "Filter 2 Stock Tank Agitator – Gearbox" },
              { assetNumber: "FP001-FP002-INST", name: "Filter 2 Instruments" },
              { assetNumber: "FP001-VLV002", name: "Filter 2 Piping and Valves" },
              { assetNumber: "FP001-FP002-HYD", name: "Filter Press 2 Hydraulic Pack" },
              { assetNumber: "FP001-MTR005", name: "Filter Press 2 Hydraulic Plate Pack – Motor" },
              { assetNumber: "FP001-MTR006", name: "Filter Press 2 Hydraulic TT Plate – Motor" },
            ] 
          },
          { 
            label: "Filtrate Pump", 
            equipment: [
              { assetNumber: "FILTRT001-PMP001", name: "Filtrate Pump – Pump" },
              { assetNumber: "FILTRT001-MTR001", name: "Filtrate Pump – Motor" },
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
              { assetNumber: "LAB001", name: "Lab" },
              { assetNumber: "LAB001-DB001", name: "Main DB Lab" },
              { assetNumber: "LAB001-DB002", name: "Lab L&P DB" },
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
              { assetNumber: "CRN001", name: "CIP Area Gantry Crane" },
              { assetNumber: "HST001", name: "Knelson Area Hoist" },
              { assetNumber: "MOB001", name: "Mobile Equipment" },
              { assetNumber: "CRN002", name: "25t Franner Crane" },
              { assetNumber: "WKSHP001", name: "Workshop" },
              { assetNumber: "WKSHP001-DB001", name: "Workshop DB" },
              { assetNumber: "FLT001", name: "Forklift" },
              { assetNumber: "TLH001", name: "Telehandler" },
              { assetNumber: "BOBCAT001", name: "Bob Cat" },
              { assetNumber: "WTRTK001", name: "Water Truck" },
              { assetNumber: "SVCTK001", name: "Service Truck" },
              { assetNumber: "EWP001", name: "Sino EWP" },
              { assetNumber: "EWP002", name: "Hire EWP" },
              { assetNumber: "SCLFT001", name: "Sino Scissor Lift 1" },
              { assetNumber: "SCLFT002", name: "Sino Scissor Lift 2" },
              { assetNumber: "LDR001", name: "Cat 980 Loader 1" },
              { assetNumber: "LDR002", name: "Cat 980 Loader 2" },
              { assetNumber: "LDR003", name: "Cat 980 Loader 3" },
              { assetNumber: "LDR004", name: "Cat 980 Loader 4" },
              { assetNumber: "EXC001", name: "Cat 30t Excavator" },
              { assetNumber: "EXC002", name: "Case Excavator" },
              { assetNumber: "MOXY001", name: "Cat Moxy 1" },
              { assetNumber: "MOXY002", name: "Cat Moxy 2" },
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
              { assetNumber: "SVC002", name: "Services" },
              { assetNumber: "SVC002-DB001", name: "Lath Container L&P" },
              { assetNumber: "SVC002-DB002", name: "Crib Room L&P DB" },
              { assetNumber: "SVC002-DB003", name: "Conference Building L&P" },
              { assetNumber: "SVC002-DB004", name: "First Aid Room L&P DB" },
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
              { assetNumber: "LV001", name: "Light Vehicle" },
              { assetNumber: "LV-HILUX001", name: "Toyota Hilux 1" },
              { assetNumber: "LV-HILUX002", name: "Toyota Hilux 2" },
              { assetNumber: "LV-HILUX003", name: "Toyota Hilux 3" },
              { assetNumber: "LV-HILUX004", name: "Toyota Hilux 4" },
              { assetNumber: "LV-HILUX005", name: "Toyota Hilux 5" },
              { assetNumber: "LV-HILUX006", name: "Toyota Hilux 6" },
              { assetNumber: "LV-HILUX007", name: "Toyota Hilux 7" },
              { assetNumber: "LV-RANGER001", name: "Ford Ranger XL Dual Cab 1" },
              { assetNumber: "LV-RANGER002", name: "Ford Ranger XL Dual Cab 2" },
              { assetNumber: "LV-RANGER003", name: "Ford Ranger XL Dual Cab 3" },
              { assetNumber: "LV-RANGER004", name: "Ford Ranger XL Dual Cab 4" },
              { assetNumber: "LV-RANGER005", name: "Ford Ranger XL Dual Cab 5" },
              { assetNumber: "LV-RANGER006", name: "Ford Ranger XL Dual Cab 6" },
              { assetNumber: "LV-RANGER007", name: "Ford Ranger XL Dual Cab 7" },
              { assetNumber: "LV-RANGER008", name: "Ford Ranger XL Dual Cab 8" },
              { assetNumber: "LV-RANGER009", name: "Ford Ranger XL Dual Cab 9" },
              { assetNumber: "LV-RANGER010", name: "Ranger Single Cab" },
              { assetNumber: "LV-KIA001", name: "Kia" },
              { assetNumber: "LV-HIACE001", name: "Toyota Hiace 1" },
              { assetNumber: "LV-HIACE002", name: "Toyota Hiace 2" },
              { assetNumber: "LV-LDV001", name: "LDV Discovery 9 1" },
              { assetNumber: "LV-LDV002", name: "LDV Discovery 9 2" },
              { assetNumber: "LV-FUSO001", name: "Fuso TF Canter Flat Top Truck" },
              { assetNumber: "LV-LC001", name: "LC Military" },
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
