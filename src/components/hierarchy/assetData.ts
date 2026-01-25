// Asset hierarchy data structure - Maintenance-logical model

/** 
 * Components are OEM-level parts that sit UNDER equipment.
 * They are not separate assets - they are the internal makeup of an asset.
 */
export interface Component {
  componentCode: string;
  componentType: string;
  componentName: string;
  manufacturer: string;
}

export interface Equipment {
  assetNumber: string;
  name: string;
  /** Legacy P&ID tag references - searchable but not displayed in hierarchy */
  pidTags?: string[];
  /** OEM components nested under this equipment */
  components?: Component[];
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
            label: "Gold Plant", 
            equipment: [
              { assetNumber: "SINF001", name: "Gold Plant" },
              { assetNumber: "SINF002", name: "Buildings" },
            ] 
          },
          { 
            label: "Admin Building", 
            equipment: [
              { assetNumber: "SINF003", name: "Admin" },
              { assetNumber: "SINF003-DB001", name: "Admin Office L&P DB 1" },
              { assetNumber: "SINF003-DB002", name: "Admin Office L&P DB 2" },
              { assetNumber: "SINF003-DB003", name: "Admin Office L&P DB 3" },
              { assetNumber: "SINF003-DB004", name: "Admin Office L&P DB 4" },
              { assetNumber: "SINF005", name: "Conference" },
            ] 
          },
          { 
            label: "Toilets / Amenities", 
            equipment: [
              { assetNumber: "SINF007", name: "Male Toilet" },
              { assetNumber: "SINF008", name: "Female Toilet" },
              { assetNumber: "SINF007-DB001", name: "Male Toilet L&P DB" },
            ] 
          },
          { 
            label: "Crib Room", 
            equipment: [
              { assetNumber: "SINF004", name: "Crib" },
            ] 
          },
          { 
            label: "First Aid Room", 
            equipment: [
              { assetNumber: "SINF006", name: "First Aid Room" },
            ] 
          },
          
          { 
            label: "Services", 
            equipment: [
              { assetNumber: "SVC001", name: "Services" },
              { assetNumber: "SVC002-DB001", name: "Lath Container L&P" },
              { assetNumber: "SVC002-DB002", name: "Crib Room L&P DB" },
              { assetNumber: "SVC002-DB003", name: "Conference Building L&P" },
              { assetNumber: "SVC002-DB004", name: "First Aid Room L&P DB" },
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
              { assetNumber: "COMP01-MTR001", name: "Air Compressor 1 – Motor" },
              { assetNumber: "COMP01-VLV001", name: "Air Compressor 1 – Inlet Valve", pidTags: ["XV-101A", "HV-101"] },
              { assetNumber: "COMP01-VLV002", name: "Air Compressor 1 – Outlet Valve", pidTags: ["XV-101B"] },
            ]
          },
          { 
            label: "Air Receiver 1", 
            equipment: [
              { assetNumber: "RCVR01-VLV001", name: "Air Receiver 1 – Drain Valve" },
              { assetNumber: "RCVR01-SWT001", name: "Air Receiver 1 – Pressure Switch" },
            ]
          },
          { 
            label: "Air Dryer 1", 
            equipment: [
              { assetNumber: "DRYR01-HTR001", name: "Air Dryer 1 – Heater" },
              { assetNumber: "DRYR01-VLV001", name: "Air Dryer 1 – Purge Valve" },
            ]
          },
          { 
            label: "HP Air Compressor", 
            equipment: [
              { assetNumber: "HPCP001", name: "HP Air Compressor 1", pidTags: ["C-201", "CMP-201A"] },
              { assetNumber: "HPCP001-PIPE001", name: "HP Air Compressor 1 – Piping" },
              { assetNumber: "HPCP001-MCC001", name: "HP Air Compressor 1 – MCC Cell" },
              { assetNumber: "HPCP001-RCVR001", name: "HP Air Compressor 1 – Receiver", pidTags: ["V-201"] },
              { assetNumber: "HPCP002", name: "HP Air Compressor 2", pidTags: ["C-202", "CMP-201B"] },
              { assetNumber: "HPCP002-PIPE001", name: "HP Air Compressor 2 – Piping" },
              { assetNumber: "HPCP002-MCC001", name: "HP Air Compressor 2 – MCC Cell" },
              { assetNumber: "HPCP002-RCVR001", name: "HP Air Compressor 2 – Receiver" },
              { assetNumber: "HPCP003", name: "HP Air Compressor 3 (Filter Area)" },
              { assetNumber: "HPCP003-PIPE001", name: "HP Air Compressor 3 – Piping" },
              { assetNumber: "HPCP003-MCC001", name: "HP Air Compressor 3 – MCC Cell" },
              { assetNumber: "HPCP003-RCVR001", name: "HP Air Compressor 3 – Receiver" },
              { assetNumber: "HPCP004", name: "HP Air Compressor 4" },
              { assetNumber: "HPCP004-MCC001", name: "HP Air Compressor 4 – MCC Cell" },
              { assetNumber: "HPCP004-RCVR001", name: "HP Air Compressor 4 – Receiver" },
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
              // Core MDB infrastructure only
              { assetNumber: "MDB001", name: "Main Distribution Board", pidTags: ["E-100-MDB"] },
              { assetNumber: "MDB001-DB001", name: "Ice Machine Room DB" },
              { assetNumber: "MDB001-DB002", name: "Main DB 1" },
              { assetNumber: "MDB001-DB003", name: "Main DB 2" },
              { assetNumber: "MDB001-LP001", name: "MCC-125 L&P" },
              { assetNumber: "MDB001-LP002", name: "MCC-110 L&P" },
              { assetNumber: "MDB001-LP003", name: "MCC-111 L&P" },
              { assetNumber: "MDB001-LP004", name: "MCC-113 L&P" },
              { assetNumber: "MDB001-LP005", name: "MCC-114 L&P" },
              { assetNumber: "MDB001-LP006", name: "MCC-115 L&P" },
              { assetNumber: "MDB001-LP007", name: "MCC-116 L&P" },
              { assetNumber: "MDB001-LP008", name: "MCC-117 L&P" },
              { assetNumber: "MDB001-LP009", name: "MCC-118 L&P" },
              { assetNumber: "MDB001-LP010", name: "MCC-120 L&P" },
              { assetNumber: "MDB001-LP011", name: "MCC-121 L&P" },
              { assetNumber: "MDB001-LP012", name: "MCC-122 L&P" },
              { assetNumber: "MDB001-LP013", name: "MCC-130 L&P" },
              { assetNumber: "MDB001-LP014", name: "Titration Hut L&P DB" },
            ]
          },
          { 
            label: "Sub Distribution Board", 
            equipment: [
              { assetNumber: "SDB001", name: "Sub-100" },
              { assetNumber: "SDB001-LP001", name: "Sub-100 L&P" },
              { assetNumber: "SDB001-ESS001", name: "Sub-100 Essential Board" },
            ]
          },
          { 
            label: "Control Room", 
            equipment: [
              { assetNumber: "CR001", name: "Control Room" },
              { assetNumber: "CR001-PNL001", name: "Knelson Concentrator Control Panel" },
              { assetNumber: "CR001-PNL002", name: "Knelson Area Hoist Control Panel" },
              { assetNumber: "CR001-DB001", name: "Control Room L&P DB" },
            ]
          },
          
          { 
            label: "Lighting Towers", 
            equipment: [
              { assetNumber: "LTW001", name: "Lighting Tower 1" },
              { assetNumber: "LTW002", name: "Lighting Tower 2" },
              { assetNumber: "LTW003", name: "Lighting Tower 3" },
              { assetNumber: "LTW004", name: "Lighting Tower 4" },
              { assetNumber: "LTW005", name: "Lighting Tower 5" },
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
            label: "Generators", 
            equipment: [
              { assetNumber: "GEN001", name: "Power Station Generator 1 (500kVA)" },
              { assetNumber: "GEN001-ENG001", name: "Power Station Generator 1 – Engine" },
              { assetNumber: "GEN001-ALT001", name: "Power Station Generator 1 – Alternator" },
              { assetNumber: "GEN001-PNL001", name: "Power Station Generator 1 – Control Panel" },
              { assetNumber: "GEN002", name: "Power Station Generator 2 (500kVA)" },
              { assetNumber: "GEN002-ENG001", name: "Power Station Generator 2 – Engine" },
              { assetNumber: "GEN002-ALT001", name: "Power Station Generator 2 – Alternator" },
              { assetNumber: "GEN002-PNL001", name: "Power Station Generator 2 – Control Panel" },
              { assetNumber: "GEN003", name: "Power Station Generator 3 (500kVA)" },
              { assetNumber: "GEN003-ENG001", name: "Power Station Generator 3 – Engine" },
              { assetNumber: "GEN003-ALT001", name: "Power Station Generator 3 – Alternator" },
              { assetNumber: "GEN003-PNL001", name: "Power Station Generator 3 – Control Panel" },
              { assetNumber: "GEN004", name: "Power Station Generator 4 (500kVA)" },
              { assetNumber: "GEN004-ENG001", name: "Power Station Generator 4 – Engine" },
              { assetNumber: "GEN004-ALT001", name: "Power Station Generator 4 – Alternator" },
              { assetNumber: "GEN004-PNL001", name: "Power Station Generator 4 – Control Panel" },
              { assetNumber: "GEN005", name: "Power Station Generator 5 (500kVA)" },
              { assetNumber: "GEN005-ENG001", name: "Power Station Generator 5 – Engine" },
              { assetNumber: "GEN005-ALT001", name: "Power Station Generator 5 – Alternator" },
              { assetNumber: "GEN005-PNL001", name: "Power Station Generator 5 – Control Panel" },
              { assetNumber: "GEN006", name: "Power Station Generator 6 (500kVA)" },
              { assetNumber: "GEN006-ENG001", name: "Power Station Generator 6 – Engine" },
              { assetNumber: "GEN006-ALT001", name: "Power Station Generator 6 – Alternator" },
              { assetNumber: "GEN006-PNL001", name: "Power Station Generator 6 – Control Panel" },
              { assetNumber: "GEN007", name: "Power Station Generator 7 (500kVA)" },
              { assetNumber: "GEN007-ENG001", name: "Power Station Generator 7 – Engine" },
              { assetNumber: "GEN007-ALT001", name: "Power Station Generator 7 – Alternator" },
              { assetNumber: "GEN007-PNL001", name: "Power Station Generator 7 – Control Panel" },
              { assetNumber: "GEN008", name: "Power Station Generator 8 (500kVA)" },
              { assetNumber: "GEN008-ENG001", name: "Power Station Generator 8 – Engine" },
              { assetNumber: "GEN008-ALT001", name: "Power Station Generator 8 – Alternator" },
              { assetNumber: "GEN008-PNL001", name: "Power Station Generator 8 – Control Panel" },
              { assetNumber: "GEN-ADM001", name: "Admin Generator (50kVA)" },
              { assetNumber: "GEN-LAB001", name: "Lab Generator (30kVA)" },
              { assetNumber: "GEN-JUNO001", name: "Juno Bore Generator (200kVA)" },
              { assetNumber: "GEN-WRK001", name: "Mining Workshop Generator (75kVA)" },
              { assetNumber: "GEN-SPR001", name: "Spare Generator" },
            ]
          },
          { 
            label: "Fuel Storage Tank", 
            equipment: [
              { assetNumber: "FSTK001", name: "Fuel Storage Tank – Main Tank" },
              { assetNumber: "FSTK001-PMP001", name: "Fuel Storage Tank – Transfer Pump" },
              { assetNumber: "FSTK001-VLV001", name: "Fuel Storage Tank – Isolation Valve" },
            ] 
          },
          { 
            label: "Fuel Dispensing Station", 
            equipment: [
              { assetNumber: "FDISP001", name: "Fuel Dispensing Station" },
              { assetNumber: "FDISP001-PMP001", name: "Fuel Dispensing Station – Pump" },
              { assetNumber: "FDISP001-DB001", name: "Fuel Dispensing Station – Control Board" },
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
              { assetNumber: "LSILO001", name: "Lime Storage Silo" },
              { assetNumber: "LSILO001-VLV001", name: "Lime Storage Silo – Discharge Valve" },
              { assetNumber: "LSILO001-VIB001", name: "Lime Storage Silo – Vibrator" },
            ] 
          },
          { 
            label: "Lime Dosing System", 
            equipment: [
              { assetNumber: "LDOS001", name: "Lime Dosing System" },
              { assetNumber: "LDOS001-PMP001", name: "Lime Dosing System – Dosing Pump" },
              { assetNumber: "LDOS001-AGT001", name: "Lime Dosing System – Mixing Agitator" },
            ] 
          },
          { 
            label: "Lime Agitation Tank", 
            equipment: [
              { assetNumber: "LAGTK001", name: "Lime Agitation Tank" },
              { assetNumber: "LAGTK001-AGT001", name: "Lime Agitation Tank – Agitator" },
              { assetNumber: "LAGTK001-MTR001", name: "Lime Agitation Tank – Agitator Motor" },
            ] 
          },
          { 
            label: "Reagent Safety Shower", 
            equipment: [
              { assetNumber: "REAG-SHW001", name: "Reagent Safety Shower 1" },
              { assetNumber: "REAG-SHW002", name: "Reagent Safety Shower 2" },
              { assetNumber: "REAG-SHW003", name: "Reagent Safety Shower 3" },
              { assetNumber: "REAG-SHW004", name: "Reagent Safety Shower 4" },
            ] 
          },
          { 
            label: "Floc System", 
            equipment: [
              { assetNumber: "FLOC001", name: "Floc System" },
              { assetNumber: "FLOC001-PMP001", name: "Floc System – Dosing Pump" },
              { assetNumber: "FLOC001-AGT001", name: "Floc System – Mixing Agitator" },
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
              { assetNumber: "PWT001-PIPE001", name: "Potable Water Tank – Pipework" },
              { assetNumber: "PWT001-PMP001", name: "Potable Water Tank – Pump Standby" },
              { assetNumber: "PWT001-MCC001", name: "Potable Water Tank – Pump Standby MCC Cell" },
              { assetNumber: "PWT001-LCS001", name: "Potable Water Tank – Pump Standby LCS" },
              { assetNumber: "PWT001-PMP002", name: "Potable Water Tank – Pump Duty" },
              { assetNumber: "PWT001-MCC002", name: "Potable Water Tank – Pump Duty MCC Cell" },
              { assetNumber: "PWT001-LCS002", name: "Potable Water Tank – Pump Duty LCS" },
            ] 
          },
          { 
            label: "Raw Water Tank", 
            equipment: [
              { assetNumber: "RWT001", name: "Raw Water Tank" },
              { assetNumber: "RWT001-PMP001", name: "Raw Water Tank – Pump Duty" },
              { assetNumber: "RWT001-MTR001", name: "Raw Water Tank – Pump Duty Motor" },
              { assetNumber: "RWT001-MCC001", name: "Raw Water Tank – Pump Duty MCC Cell" },
              { assetNumber: "RWT001-LCS001", name: "Raw Water Tank – Pump Duty LCS" },
              { assetNumber: "RWT001-PMP002", name: "Raw Water Tank – Pump Standby" },
              { assetNumber: "RWT001-MTR002", name: "Raw Water Tank – Pump Standby Motor" },
              { assetNumber: "RWT001-MCC002", name: "Raw Water Tank – Pump Standby MCC Cell" },
              { assetNumber: "RWT001-LCS002", name: "Raw Water Tank – Pump Standby LCS" },
            ] 
          },
          { 
            label: "Process Water Pond", 
            equipment: [
              { assetNumber: "PWP001", name: "Process Water Pond" },
              { assetNumber: "PWP001-PIPE001", name: "Process Water Pond – Piping" },
              { assetNumber: "PWP001-PMP001", name: "Process Water Pond – Pump Duty" },
              { assetNumber: "PWP001-MTR001", name: "Process Water Pond – Pump Duty Motor" },
              { assetNumber: "PWP001-MCC001", name: "Process Water Pond – Pump Duty MCC Cell" },
              { assetNumber: "PWP001-LCS001", name: "Process Water Pond – Pump Duty LCS" },
              { assetNumber: "PWP001-VSD001", name: "Process Water Pond – Pump Duty VSD" },
              { assetNumber: "PWP001-PMP002", name: "Process Water Pond – Pump Standby" },
              { assetNumber: "PWP001-MTR002", name: "Process Water Pond – Pump Standby Motor" },
              { assetNumber: "PWP001-MCC002", name: "Process Water Pond – Pump Standby MCC Cell" },
              { assetNumber: "PWP001-LCS002", name: "Process Water Pond – Pump Standby LCS" },
              { assetNumber: "PWP001-VSD002", name: "Process Water Pond – Pump Standby VSD" },
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
              { assetNumber: "HOIL001-HTR001", name: "Hydraulic Oil Heater" },
              { assetNumber: "HOIL001-FAN001", name: "Hydraulic Oil Cooling Fan" },
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
              { assetNumber: "FDISP001-DB001", name: "Fuel Dispensing control Board" },
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
              { assetNumber: "RHOP001", name: "Reclaim Hopper" },
            ] 
          },
          { 
            label: "Apron Feeder", 
            equipment: [
              { 
                assetNumber: "APRN001", 
                name: "Apron Feeder",
                components: [
                  {
                    componentCode: "K-ROL-STR-600B25",
                    componentType: "Conveyor Roller",
                    componentName: "Steel Trough Roller",
                    manufacturer: "N/A"
                  },
                  {
                    componentCode: "K-ROL-SRR-1200B25",
                    componentType: "Conveyor Roller",
                    componentName: "Steel Return Roller",
                    manufacturer: "N/A"
                  }
                ]
              },
              { assetNumber: "APRN001-LCS001", name: "Apron Feeder – LCS" },
              { assetNumber: "APRN001-MCC001", name: "Apron Feeder – MCC Cell" },
              { 
                assetNumber: "APRN001-GMR001", 
                name: "Apron Feeder – Gearmotor",
                components: [
                  {
                    componentCode: "KA107R77",
                    componentType: "Gearbox",
                    componentName: "Helical Bevel Gearbox",
                    manufacturer: "SEW-EURODRIVE"
                  },
                  {
                    componentCode: "DRN112M4/V",
                    componentType: "Electric Motor",
                    componentName: "4-Pole IE3 Motor (Vertical Mount)",
                    manufacturer: "SEW-EURODRIVE"
                  }
                ]
              },
              { assetNumber: "APRN001-PWS001", name: "Apron Feeder – Pullwire Switch" },
              { assetNumber: "APRN001-TX001", name: "Apron Feeder – Speed Transmitter" },
              { assetNumber: "APRN001-VLV001", name: "Apron Feeder – Rotary Valve" },
            ] 
          },
          { 
            label: "Feed Hopper", 
            equipment: [
              { assetNumber: "FHOP001", name: "Mill Feed Hopper" },
              { assetNumber: "FHOP001-HLS001", name: "Mill Feed Hopper – High Level Switch" },
              { assetNumber: "FHOP001-CHU001", name: "Mill Feed Hopper – Feed Chute" },
              { assetNumber: "FHOP001-CHU002", name: "Mill Feed Hopper – Ball Loading Chute" },
              { assetNumber: "FHOP001-BOX001", name: "Mill Feed Hopper – Boiler Box" },
            ]
          },
          { 
            label: "Mill Feed Conveyor", 
            equipment: [
              { assetNumber: "MFC001", name: "Mill Feed Conveyor" },
              { assetNumber: "MFC001-LCS001", name: "Mill Feed Conveyor – Local Control Station" },
              { assetNumber: "MFC001-MTR001", name: "Mill Feed Conveyor – Motor" },
              { assetNumber: "MFC001-MCC001", name: "Mill Feed Conveyor – MCC Cell" },
              { assetNumber: "MFC001-GBX001", name: "Mill Feed Conveyor – Gearbox" },
              { assetNumber: "MFC001-USS001", name: "Mill Feed Conveyor – Underspeed Switch" },
              { assetNumber: "MFC001-WTM001", name: "Mill Feed Conveyor – Weightometer Loadcells" },
              { assetNumber: "MFC001-WTM002", name: "Mill Feed Conveyor – Weightometer Transmitter" },
              { assetNumber: "MFC001-PWS001", name: "Mill Feed Conveyor – Pull Wire Switch 1" },
              { assetNumber: "MFC001-PWS002", name: "Mill Feed Conveyor – Pull Wire Switch 2" },
              { assetNumber: "MFC001-PWS003", name: "Mill Feed Conveyor – Pull Wire Switch 3" },
              { assetNumber: "MFC001-PWS004", name: "Mill Feed Conveyor – Pull Wire Switch 4" },
              { assetNumber: "MFC001-BAS001", name: "Mill Feed Conveyor – Belt Alignment Switch 1" },
              { assetNumber: "MFC001-BAS002", name: "Mill Feed Conveyor – Belt Alignment Switch 2" },
              { assetNumber: "MFC001-BAS003", name: "Mill Feed Conveyor – Belt Alignment Switch 3" },
              { assetNumber: "MFC001-BAS004", name: "Mill Feed Conveyor – Belt Alignment Switch 4" },
              { assetNumber: "MFC001-CHU001", name: "Mill Feed Conveyor – Discharge Chute" },
              { assetNumber: "MFC001-TX001", name: "Mill Feed Conveyor – Feed End Bearing Temp Transmitter" },
              { assetNumber: "MFC001-SEN001", name: "Mill Feed Conveyor – Feed End Bearing Temp Sensor 1" },
              { assetNumber: "MFC001-SEN002", name: "Mill Feed Conveyor – Feed End Bearing Temp Sensor 2" },
              { assetNumber: "MFC001-SEN003", name: "Mill Feed Conveyor – Feed End Bearing Temp Sensor 3" },
              { assetNumber: "MFC001-TX002", name: "Mill Feed Conveyor – Discharge End Bearing Temp Transmitter" },
              { assetNumber: "MFC001-SEN004", name: "Mill Feed Conveyor – Discharge End Bearing Temp Sensor 1" },
              { assetNumber: "MFC001-SEN005", name: "Mill Feed Conveyor – Discharge End Bearing Temp Sensor 2" },
              { assetNumber: "MFC001-SEN006", name: "Mill Feed Conveyor – Discharge End Bearing Temp Sensor 3" },
              { assetNumber: "MFC001-MCC002", name: "Mill Feed Conveyor – Field MCC" },
            ]
          },
          { 
            label: "Primary Cyclone Feed Pump A", 
            equipment: [
              { assetNumber: "PCFPA001", name: "Primary Cyclone Feed Pump A" },
              { assetNumber: "PCFPA001-MTR001", name: "Primary Cyclone Feed Pump A – Motor" },
              { assetNumber: "PCFPA001-MCC001", name: "Primary Cyclone Feed Pump A – MCC Cell" },
              { assetNumber: "PCFPA001-LCS001", name: "Primary Cyclone Feed Pump A – LCS" },
            ]
          },
          { 
            label: "Primary Cyclone Feed Pump B", 
            equipment: [
              { assetNumber: "PCFPB001", name: "Primary Cyclone Feed Pump B" },
              { assetNumber: "PCFPB001-MTR001", name: "Primary Cyclone Feed Pump B – Motor" },
              { assetNumber: "PCFPB001-MCC001", name: "Primary Cyclone Feed Pump B – MCC Cell" },
              { assetNumber: "PCFPB001-LCS001", name: "Primary Cyclone Feed Pump B – LCS" },
            ]
          },
          { 
            label: "Primary Cyclone Feed Instrumentation", 
            equipment: [
              { assetNumber: "PCFI001-VLV001", name: "Primary Cyclone Feed – TechTaylor Valve" },
              { assetNumber: "PCFI001-TX001", name: "Primary Cyclone Feed – Flow Transmitter" },
            ]
          },
        ],
      },
      {
        label: "Conveying",
        parentAssets: [
          { 
            label: "Transfer Conveyor", 
            equipment: [
              { assetNumber: "TRCV001", name: "Transfer Conveyor" },
              { assetNumber: "TRCV001-LCS001", name: "Transfer Conveyor – Local Control Station" },
              { assetNumber: "TRCV001-MTR001", name: "Transfer Conveyor – Motor" },
              { assetNumber: "TRCV001-MCC001", name: "Transfer Conveyor – MCC Cell" },
              { assetNumber: "TRCV001-GBX001", name: "Transfer Conveyor – Gearbox" },
              { assetNumber: "TRCV001-PWS001", name: "Transfer Conveyor – Pullwire Switch" },
              { assetNumber: "TRCV001-CHU001", name: "Transfer Conveyor – Discharge Chute" },
            ]
          },
          { 
            label: "Ball Mill Scatts Conveyor", 
            equipment: [
              { assetNumber: "BMSC001", name: "Ball Mill Scatts Conveyor" },
              { assetNumber: "BMSC001-MTR001", name: "Ball Mill Scatts Conveyor – Motor" },
              { assetNumber: "BMSC001-GBX001", name: "Ball Mill Scatts Conveyor – Gearbox" },
              { assetNumber: "BMSC001-MCC001", name: "Ball Mill Scatts Conveyor – MCC Cell" },
            ] 
          },
          { 
            label: "Filter 1 Extraction Conveyor", 
            equipment: [
              { assetNumber: "F1EC001", name: "Filter 1 Extraction Conveyor" },
              { assetNumber: "F1EC001-MTR001", name: "Filter 1 Extraction Conveyor – Motor" },
              { assetNumber: "F1EC001-GBX001", name: "Filter 1 Extraction Conveyor – Gearbox" },
              { assetNumber: "F1EC001-VFD001", name: "Filter 1 Extraction Conveyor – VFD" },
              { assetNumber: "F1EC001-MCC001", name: "Filter 1 Extraction Conveyor – MCC Cell" },
            ] 
          },
          { 
            label: "Filter 2 Extraction Conveyor", 
            equipment: [
              { assetNumber: "F2EC001", name: "Filter 2 Extraction Conveyor" },
              { assetNumber: "F2EC001-MTR001", name: "Filter 2 Extraction Conveyor – Motor" },
              { assetNumber: "F2EC001-GBX001", name: "Filter 2 Extraction Conveyor – Gearbox" },
              { assetNumber: "F2EC001-VFD001", name: "Filter 2 Extraction Conveyor – VFD" },
              { assetNumber: "F2EC001-MCC001", name: "Filter 2 Extraction Conveyor – MCC Cell" },
            ] 
          },
          { 
            label: "Tails Filter Press Collection Conveyor", 
            equipment: [
              { assetNumber: "TFPC001", name: "Tails Filter Press Collection Conveyor" },
              { assetNumber: "TFPC001-MTR001", name: "Tails Filter Press Collection Conveyor – Motor" },
              { assetNumber: "TFPC001-GBX001", name: "Tails Filter Press Collection Conveyor – Gearbox" },
              { assetNumber: "TFPC001-MCC001", name: "Tails Filter Press Collection Conveyor – MCC Cell" },
              { assetNumber: "TFPC001-VFD001", name: "Tails Filter Press Collection Conveyor – VFD" },
            ] 
          },
          { 
            label: "Tails Filter Press Radial Stacker Conveyor", 
            equipment: [
              { assetNumber: "TFRS001", name: "Tails Filter Press Radial Stacker Conveyor" },
              { assetNumber: "TFRS001-MTR001", name: "Tails Filter Press Radial Stacker – Drive Motor A" },
              { assetNumber: "TFRS001-MTR002", name: "Tails Filter Press Radial Stacker – Drive Motor B" },
              { assetNumber: "TFRS001-MTR003", name: "Tails Filter Press Radial Stacker – Wheel Drive Motor A" },
              { assetNumber: "TFRS001-MTR004", name: "Tails Filter Press Radial Stacker – Wheel Drive Motor B" },
              { assetNumber: "TFRS001-GBX001", name: "Tails Filter Press Radial Stacker – Drive Gearbox A" },
              { assetNumber: "TFRS001-GBX002", name: "Tails Filter Press Radial Stacker – Drive Gearbox B" },
              { assetNumber: "TFRS001-GBX003", name: "Tails Filter Press Radial Stacker – Wheel Drive Gearbox A" },
              { assetNumber: "TFRS001-GBX004", name: "Tails Filter Press Radial Stacker – Wheel Drive Gearbox B" },
              { assetNumber: "TFRS001-MCC001", name: "Tails Filter Press Radial Stacker – Drive A MCC Cell" },
              { assetNumber: "TFRS001-MCC002", name: "Tails Filter Press Radial Stacker – Drive B MCC Cell" },
              { assetNumber: "TFRS001-MCC003", name: "Tails Filter Press Radial Stacker – Wheel Drive A MCC Cell" },
              { assetNumber: "TFRS001-MCC004", name: "Tails Filter Press Radial Stacker – Wheel Drive B MCC Cell" },
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
              { assetNumber: "CYC001-INS001", name: "Primary Cyclone Cluster – Instruments" },
              { assetNumber: "CYC001-TX001", name: "Primary Cyclone – Pressure Transmitter" },
              { assetNumber: "CYC001-PG001", name: "Primary Cyclone – Pressure Gauge" },
              { assetNumber: "CYC001-SPL001", name: "Primary Cyclone Underflow Splitter Box" },
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
              { assetNumber: "GCON001-MTR001", name: "Gravity Concentrator 1 – Motor" },
              { assetNumber: "GCON001-PMP001", name: "Gravity Concentrator 1 – Water Pump" },
              { assetNumber: "GCON001-MCC001", name: "Gravity Concentrator 1 – MCC Cell" },
            ] 
          },
          { 
            label: "Concentrate Pump", 
            equipment: [
              { assetNumber: "CPMP001-PMP001", name: "Concentrate Pump – Pump" },
              { assetNumber: "CPMP001-MTR001", name: "Concentrate Pump – Motor" },
            ] 
          },
          { 
            label: "Gravity Electrowinning", 
            equipment: [
              { assetNumber: "GEW001", name: "Gravity Electrowinning" },
              { assetNumber: "GEW001-FAN001", name: "Gravity Electrowinning – Fan" },
            ] 
          },
          { 
            label: "Gravity Screen", 
            equipment: [
              { assetNumber: "GSCR001", name: "Gravity Screen" },
              { assetNumber: "GSCR001-CHU001", name: "Gravity Screen – Feed Chute" },
              { assetNumber: "GSCR001-CHU002", name: "Gravity Screen – Discharge Chute" },
              { assetNumber: "GSCR001-PAN001", name: "Gravity Screen – Under Pan" },
              { assetNumber: "GSCR001-MTR001", name: "Gravity Screen – Motor" },
              { assetNumber: "GSCR001-MCC001", name: "Gravity Screen – MCC Cell" },
            ] 
          },
          { 
            label: "Knelson Concentrator", 
            equipment: [
              { assetNumber: "KNLS001", name: "Knelson Concentrator" },
              { assetNumber: "KNLS001-CONE001", name: "Knelson Concentrator – Collection Cone" },
              { assetNumber: "KNLS001-MTR001", name: "Knelson Concentrator – Motor" },
              { assetNumber: "KNLS001-MCC001", name: "Knelson Concentrator – MCC Cell" },
              { assetNumber: "KNLS001-PMP001", name: "Knelson Concentrator – Water Pump" },
            ] 
          },
          { 
            label: "Concentrate Shaking Table", 
            equipment: [
              { assetNumber: "CST001", name: "Concentrate Shaking Table" },
              { assetNumber: "CST001-MTR001", name: "Concentrate Shaking Table – Motor" },
              { assetNumber: "CST001-LCS001", name: "Concentrate Shaking Table – LCS" },
              { assetNumber: "CST001-GBX001", name: "Concentrate Shaking Table – Gearbox" },
              { assetNumber: "CST001-MCC001", name: "Concentrate Shaking Table – MCC Cell" },
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
              { assetNumber: "CIP-TK01", name: "CIP Leach Tank 1" },
              { assetNumber: "CIP-SHW01", name: "CIP Tails Area Safety Shower" },
              { assetNumber: "CIP-TK01-AGT001", name: "CIP Leach Tank 1 – Agitator" },
              { assetNumber: "CIP-TK01-MTR001", name: "CIP Leach Tank 1 – Agitator Motor" },
              { assetNumber: "CIP-TK01-MCC001", name: "CIP Leach Tank 1 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK01-GBX001", name: "CIP Leach Tank 1 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS001", name: "CIP Leach Tank 1 – Agitator LCS" },
              { assetNumber: "CIP-NZL01", name: "Leach Tank 1 – Air Sparge Nozzles" },
              { assetNumber: "CIP-PMP001", name: "CIP Leach Area Sump Pump" },
              { assetNumber: "CIP-ALF01", name: "Carbon Transfer Air Lift 1" },
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
              { assetNumber: "CIP-ALF02", name: "Carbon Transfer Air Lift 2" },
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
              { assetNumber: "CIP-TK03-MCC001", name: "CIP Tank 3 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF03", name: "Carbon Transfer Air Lift 3" },
            ]
          },
          { 
            label: "CIP Tank 4", 
            equipment: [
              { assetNumber: "CIP-TK04", name: "CIP Tank 4" },
              { assetNumber: "CIP-TK04-AGT001", name: "CIP Tank 4 – Agitator" },
              { assetNumber: "CIP-TK04-MTR001", name: "CIP Tank 4 – Agitator Motor" },
              { assetNumber: "CIP-TK04-GBX001", name: "CIP Tank 4 – Agitator Gear Box" },
              { assetNumber: "CIP-TK04-LCS001", name: "CIP Tank 4 – Agitator LCS" },
              { assetNumber: "CIP-TK04-MCC001", name: "CIP Tank 4 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF04", name: "Carbon Transfer Air Lift 4" },
            ]
          },
          { 
            label: "CIP Tank 5", 
            equipment: [
              { assetNumber: "CIP-TK05", name: "CIP Tank 5" },
              { assetNumber: "CIP-TK05-AGT001", name: "CIP Tank 5 – Agitator" },
              { assetNumber: "CIP-TK05-MTR001", name: "CIP Tank 5 – Agitator Motor" },
              { assetNumber: "CIP-TK05-GBX001", name: "CIP Tank 5 – Agitator Gear Box" },
              { assetNumber: "CIP-TK05-LCS001", name: "CIP Tank 5 – Agitator LCS" },
              { assetNumber: "CIP-TK05-MCC001", name: "CIP Tank 5 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF05", name: "Carbon Transfer Air Lift 5" },
            ]
          },
          { 
            label: "CIP Tank 6", 
            equipment: [
              { assetNumber: "CIP-TK06", name: "CIP Tank 6" },
              { assetNumber: "CIP-TK06-AGT001", name: "CIP Tank 6 – Agitator" },
              { assetNumber: "CIP-TK06-MTR001", name: "CIP Tank 6 – Agitator Motor" },
              { assetNumber: "CIP-TK06-GBX001", name: "CIP Tank 6 – Agitator Gear Box" },
              { assetNumber: "CIP-TK06-LCS001", name: "CIP Tank 6 – Agitator LCS" },
              { assetNumber: "CIP-TK06-MCC001", name: "CIP Tank 6 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF06", name: "Carbon Transfer Air Lift 6" },
            ]
          },
          { 
            label: "CIP Tank 7", 
            equipment: [
              { assetNumber: "CIP-TK07", name: "CIP Tank 7" },
              { assetNumber: "CIP-TK07-AGT001", name: "CIP Tank 7 – Agitator" },
              { assetNumber: "CIP-TK07-MTR001", name: "CIP Tank 7 – Agitator Motor" },
              { assetNumber: "CIP-TK07-GBX001", name: "CIP Tank 7 – Agitator Gear Box" },
              { assetNumber: "CIP-TK07-LCS001", name: "CIP Tank 7 – Agitator LCS" },
              { assetNumber: "CIP-TK07-MCC001", name: "CIP Tank 7 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF07", name: "Carbon Transfer Air Lift 7" },
            ]
          },
          { 
            label: "CIP Tank 8", 
            equipment: [
              { assetNumber: "CIP-TK08", name: "CIP Tank 8" },
              { assetNumber: "CIP-TK08-AGT001", name: "CIP Tank 8 – Agitator" },
              { assetNumber: "CIP-TK08-MTR001", name: "CIP Tank 8 – Agitator Motor" },
              { assetNumber: "CIP-TK08-GBX001", name: "CIP Tank 8 – Agitator Gear Box" },
              { assetNumber: "CIP-TK08-LCS001", name: "CIP Tank 8 – Agitator LCS" },
              { assetNumber: "CIP-TK08-MCC001", name: "CIP Tank 8 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF08", name: "Carbon Transfer Air Lift 8" },
            ]
          },
          { 
            label: "CIP Feed Trash Screen", 
            equipment: [
              { assetNumber: "CPTS001", name: "CIP Feed Trash Screen" },
              { assetNumber: "CPTS001-FBX001", name: "CIP Feed Trash Screen – Feed Box" },
              { assetNumber: "CPTS001-EXC001", name: "CIP Feed Trash Screen – Exciter A" },
              { assetNumber: "CPTS001-LCS001", name: "CIP Feed Trash Screen – Exciter A LCS" },
              { assetNumber: "CPTS001-MCC001", name: "CIP Feed Trash Screen – Exciter A MCC Cell" },
              { assetNumber: "CPTS001-EXC002", name: "CIP Feed Trash Screen – Exciter B" },
              { assetNumber: "CPTS001-LCS002", name: "CIP Feed Trash Screen – Exciter B LCS" },
              { assetNumber: "CPTS001-MCC002", name: "CIP Feed Trash Screen – Exciter B MCC Cell" },
              { assetNumber: "CPTS001-SPR001", name: "CIP Feed Trash Screen – Spray Bars" },
              { assetNumber: "CPTS001-CHU001", name: "CIP Feed Trash Screen – Oversize Chute" },
            ] 
          },
          { 
            label: "Loaded Carbon Screen", 
            equipment: [
              { assetNumber: "LDCS001", name: "Loaded Carbon Screen" },
              { assetNumber: "LDCS001-FBX001", name: "Loaded Carbon Screen – Feed Box" },
              { assetNumber: "LDCS001-EXC001", name: "Loaded Carbon Screen – Exciter A" },
              { assetNumber: "LDCS001-LCS001", name: "Loaded Carbon Screen – Exciter A LCS" },
              { assetNumber: "LDCS001-MCC001", name: "Loaded Carbon Screen – Exciter A MCC Cell" },
              { assetNumber: "LDCS001-EXC002", name: "Loaded Carbon Screen – Exciter B" },
              { assetNumber: "LDCS001-LCS002", name: "Loaded Carbon Screen – Exciter B LCS" },
              { assetNumber: "LDCS001-MCC002", name: "Loaded Carbon Screen – Exciter B MCC Cell" },
              { assetNumber: "LDCS001-SPR001", name: "Loaded Carbon Screen – Spray Bars" },
              { assetNumber: "LDCS001-PAN001", name: "Loaded Carbon Screen – Underpan" },
              { assetNumber: "LDCS001-CHU001", name: "Loaded Carbon Screen – Oversize Chute" },
            ] 
          },
          { 
            label: "CIP Inter Tank Screens", 
            equipment: [
              { assetNumber: "CITS001", name: "CIP Inter Tank Screen 1" },
              { assetNumber: "CITS001-MTR001", name: "CIP Inter Tank Screen 1 – Motor" },
              { assetNumber: "CITS001-MCC001", name: "CIP Inter Tank Screen 1 – MCC Cell" },
              { assetNumber: "CITS001-GBX001", name: "CIP Inter Tank Screen 1 – Gearbox" },
              { assetNumber: "CITS001-LCS001", name: "CIP Inter Tank Screen 1 – LCS" },
              { assetNumber: "CITS002", name: "CIP Inter Tank Screen 2" },
              { assetNumber: "CITS002-MTR001", name: "CIP Inter Tank Screen 2 – Motor" },
              { assetNumber: "CITS002-MCC001", name: "CIP Inter Tank Screen 2 – MCC Cell" },
              { assetNumber: "CITS002-GBX001", name: "CIP Inter Tank Screen 2 – Gearbox" },
              { assetNumber: "CITS002-LCS001", name: "CIP Inter Tank Screen 2 – LCS" },
              { assetNumber: "CITS003", name: "CIP Inter Tank Screen 3" },
              { assetNumber: "CITS003-MTR001", name: "CIP Inter Tank Screen 3 – Motor" },
              { assetNumber: "CITS003-MCC001", name: "CIP Inter Tank Screen 3 – MCC Cell" },
              { assetNumber: "CITS003-GBX001", name: "CIP Inter Tank Screen 3 – Gearbox" },
              { assetNumber: "CITS003-LCS001", name: "CIP Inter Tank Screen 3 – LCS" },
              { assetNumber: "CITS004", name: "CIP Inter Tank Screen 4" },
              { assetNumber: "CITS004-MTR001", name: "CIP Inter Tank Screen 4 – Motor" },
              { assetNumber: "CITS004-MCC001", name: "CIP Inter Tank Screen 4 – MCC Cell" },
              { assetNumber: "CITS004-GBX001", name: "CIP Inter Tank Screen 4 – Gearbox" },
              { assetNumber: "CITS004-LCS001", name: "CIP Inter Tank Screen 4 – LCS" },
              { assetNumber: "CITS005", name: "CIP Inter Tank Screen 5" },
              { assetNumber: "CITS005-MTR001", name: "CIP Inter Tank Screen 5 – Motor" },
              { assetNumber: "CITS005-MCC001", name: "CIP Inter Tank Screen 5 – MCC Cell" },
              { assetNumber: "CITS005-GBX001", name: "CIP Inter Tank Screen 5 – Gearbox" },
              { assetNumber: "CITS005-LCS001", name: "CIP Inter Tank Screen 5 – LCS" },
              { assetNumber: "CITS006", name: "CIP Inter Tank Screen 6" },
            ] 
          },
          { 
            label: "Carbon Safety Screen", 
            equipment: [
              { assetNumber: "CSS001", name: "Carbon Safety Screen Feed Box" },
              { assetNumber: "CSS001-SCR001", name: "Carbon Safety Screen" },
              { assetNumber: "CSS001-CHU001", name: "Carbon Safety Screen – Underpan Chute" },
              { assetNumber: "CSS001-CHU002", name: "Carbon Safety Screen – Oversize Chute" },
              { assetNumber: "CSS001-PMP001", name: "Carbon Safety Screen Sump Pump" },
            ] 
          },
          { 
            label: "Carbon Safety Sump", 
            equipment: [
              { assetNumber: "CSSMP001", name: "Carbon Safety Sump" },
              { assetNumber: "CSSMP001-PMP001", name: "Carbon Safety Sump Pump" },
            ] 
          },
          { 
            label: "CIP Transfer Pump", 
            equipment: [
              { assetNumber: "CXFR002-PMP001", name: "CIP Transfer Pump – Pump" },
              { assetNumber: "CXFR002-MTR001", name: "CIP Transfer Pump – Motor" },
            ] 
          },
          { 
            label: "Cyanide Monorail", 
            equipment: [
              { assetNumber: "CMNR001", name: "Cyanide Monorail" },
            ] 
          },
          { 
            label: "Cyanide Bag Breaker", 
            equipment: [
              { assetNumber: "CBB001", name: "Cyanide Bag Breaker" },
            ] 
          },
          { 
            label: "Caustic Bag Breaker", 
            equipment: [
              { assetNumber: "CABB001", name: "Caustic Bag Breaker" },
            ] 
          },
          { 
            label: "Cyanide Mixing Tank", 
            equipment: [
              { assetNumber: "CMIX001", name: "Cyanide Mixing Tank" },
              { assetNumber: "CMIX001-TK001", name: "Cyanide Mixing Tank – Tank" },
              { assetNumber: "CMIX001-AGT001", name: "Cyanide Mixing Tank – Agitator" },
              { assetNumber: "CMIX001-MTR001", name: "Cyanide Mixing Tank – Agitator Motor" },
              { assetNumber: "CMIX001-AGT002", name: "Cyanide Mixing Tank – Agitator 2" },
              { assetNumber: "CMIX001-MTR002", name: "Cyanide Mixing Tank – Agitator Motor 2" },
              { assetNumber: "CMIX001-GBX001", name: "Cyanide Mixing Tank – Agitator Gearbox" },
              { assetNumber: "CMIX001-LCS001", name: "Cyanide Mixing Tank – Agitator LCS" },
              { assetNumber: "CMIX001-MCC001", name: "Cyanide Mixing Tank – Agitator MCC Cell" },
              { assetNumber: "CMIX001-TX001", name: "Cyanide Mixing Tank – Level Transmitter" },
            ]
          },
          { 
            label: "Cyanide Instruments", 
            equipment: [
              { assetNumber: "CINS001", name: "Cyanide Instruments" },
            ] 
          },
          { 
            label: "Cyanide Solution Storage Tank", 
            equipment: [
              { assetNumber: "CSTR001", name: "Cyanide Solution Storage Tank" },
              { assetNumber: "CSTR001-TX001", name: "Cyanide Solution Storage Tank – Level Transmitter" },
            ] 
          },
          { 
            label: "Cyanide Dosing System", 
            equipment: [
              { assetNumber: "CDOS001", name: "Cyanide Dosing Hut" },
              { assetNumber: "CDOS002", name: "Cyanide Dosing Hut 2" },
              { assetNumber: "CDOS001-PMP001", name: "Cyanide Dosing Pump Duty" },
              { assetNumber: "CDOS001-PMP002", name: "Cyanide Dosing Pump Stand-by" },
              { assetNumber: "CDOS001-MTR001", name: "Cyanide Dosing Pump Stand-by – Motor" },
              { assetNumber: "CDOS001-MCC001", name: "Cyanide Dosing Pump Stand-by – MCC Cell" },
              { assetNumber: "CDOS001-LCS001", name: "Cyanide Dosing Pump Stand-by – LCS" },
              { assetNumber: "REAG-MCC001", name: "Reagents Field MCC" },
            ] 
          },
          { 
            label: "Cyanide Transfer System", 
            equipment: [
              { assetNumber: "CXFR001-PMP001", name: "Cyanide Transfer Pump" },
              { assetNumber: "CXFR001-MTR001", name: "Cyanide Transfer Pump – Motor" },
              { assetNumber: "CXFR001-MCC001", name: "Cyanide Transfer Pump – MCC" },
              { assetNumber: "CXFR001-LCS001", name: "Cyanide Transfer Pump – LCS" },
              { assetNumber: "CXFR001-MTR002", name: "Cyanide Transfer Pump – Motor 2" },
              { assetNumber: "CXFR001-MCC002", name: "Cyanide Transfer Pump – MCC 2" },
              { assetNumber: "CXFR001-LCS002", name: "Cyanide Transfer Pump – LCS 2" },
            ] 
          },
          { 
            label: "Cyanide Area Sump", 
            equipment: [
              { assetNumber: "CSMP001-PMP001", name: "Cyanide Area Sump Pump" },
              { assetNumber: "CSMP001-MTR001", name: "Cyanide Area Sump Pump – Motor" },
              { assetNumber: "CSMP001-MCC001", name: "Cyanide Area Sump Pump – MCC Cell" },
              { assetNumber: "CSMP001-LCS001", name: "Cyanide Area Sump Pump – LCS" },
            ] 
          },
          { 
            label: "Caustic Dosing System", 
            equipment: [
              { assetNumber: "CAUS001-PMP001", name: "Caustic Dosing Pump" },
              { assetNumber: "CAUS001-MTR001", name: "Caustic Dosing Pump – Motor" },
              { assetNumber: "CAUS001-MCC001", name: "Caustic Dosing Pump – MCC Cell" },
              { assetNumber: "CAUS001-LCS001", name: "Caustic Dosing Pump – LCS" },
            ] 
          },
          { 
            label: "Titration Hut", 
            equipment: [
              { assetNumber: "THUT001", name: "Titration Hut" },
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
              { assetNumber: "ELU-COL001", name: "Elution Column" },
              { assetNumber: "ELU-COL001-FLT001", name: "Elution Column Filters" },
              { assetNumber: "ELU-COL001-INS001", name: "Elution Column Outlet Pressure Gauge" },
              { assetNumber: "ELU-COL001-INS002", name: "Elution Column Inlet Pressure Gauge" },
              { assetNumber: "ELU-COL001-INS003", name: "Elution Column Outlet Temperature Gauge" },
              { assetNumber: "ELU-COL001-INS004", name: "Elution Column Inlet Temperature Gauge" },
              { assetNumber: "ELU-MCC001", name: "Elution Area Field MCC" },
            ]
          },
          { 
            label: "Elution Safety Showers", 
            equipment: [
              { assetNumber: "ELU-SHW01", name: "Elution Area Safety Shower 1" },
              { assetNumber: "ELU-SHW02", name: "Elution Area Safety Shower 2" },
            ]
          },
          { 
            label: "Elution Area Sump", 
            equipment: [
              { assetNumber: "ELU-PMP001", name: "Elution Area Sump Pump" },
              { assetNumber: "ELU-PMP001-MTR001", name: "Elution Area Sump Pump – Motor" },
              { assetNumber: "ELU-PMP001-MCC001", name: "Elution Area Sump Pump – MCC Cell" },
              { assetNumber: "ELU-PMP001-LCS001", name: "Elution Area Sump Pump – LCS" },
            ]
          },
          { 
            label: "Flashpot", 
            equipment: [
              { assetNumber: "FLSH001", name: "Flashpot" },
              { assetNumber: "FLSH001-INS001", name: "Flashpot Pressure Regulator" },
            ]
          },
          { 
            label: "Heat Exchanger", 
            equipment: [
              { assetNumber: "HEXC001", name: "Elution Recovery Heat Exchanger" },
              { assetNumber: "HEXC001-DPS001", name: "Elution Heater – Differential Pressure High Switch" },
              { assetNumber: "HEXC001-PG001", name: "Elution Heater – Inlet Pressure Gauge" },
              { assetNumber: "HEXC001-PG002", name: "Elution Heater – Outlet Pressure Gauge" },
              { assetNumber: "HEXC001-PG003", name: "Elution Heat Exchanger – Inlet Pressure Gauge" },
              { assetNumber: "HEXC001-PG004", name: "Elution Heat Exchanger – Outlet Pressure Gauge" },
              { assetNumber: "HEXC001-TG001", name: "Elution Heat Exchanger – Inlet Temperature Gauge" },
              { assetNumber: "HEXC001-TG002", name: "Elution Heat Exchanger – Outlet Temperature Gauge" },
              { assetNumber: "HEXC001-TG003", name: "Elution Heater – Inlet Temperature Gauge" },
              { assetNumber: "HEXC001-TG004", name: "Elution Heater – Outlet Temperature Gauge" },
              { assetNumber: "HEXC001-CTRL001", name: "Elution Heater – Burner Controller" },
              { assetNumber: "HEXC001-TS001", name: "Elution Heater – Outlet Temperature Sensor" },
              { assetNumber: "HEXC001-TS002", name: "Elution Heater – Flue Temperature Sensor" },
              { assetNumber: "HEXC001-FS001", name: "Elution Heater – Inlet Flow Sensor" },
              { assetNumber: "HEXC001-HTR001", name: "Elution Heater" },
              { assetNumber: "HEXC001-BRN001", name: "Elution Heater – Burner" },
            ] 
          },
          { 
            label: "Acid Wash System", 
            equipment: [
              { assetNumber: "AWSH001-TK001", name: "Acid Wash System – Acid Tank" },
              { assetNumber: "AWSH001-PMP001", name: "Acid Wash System – Dosing Pump" },
              { assetNumber: "AWSH001-AGT001", name: "Acid Wash System – Agitator" },
              { assetNumber: "AWSH001-SMP001", name: "Acid Wash Sump" },
            ] 
          },
          { 
            label: "Acid Wash Column", 
            equipment: [
              { assetNumber: "ACOL001", name: "Acid Wash Column" },
              { assetNumber: "ACOL001-INS001", name: "Acid Wash Column Inlet Pressure Gauge" },
              { assetNumber: "ACOL001-INS002", name: "Acid Wash Column Discharge Pressure Gauge" },
              { assetNumber: "ACOL001-FLT001", name: "Acid Column Filters" },
              { assetNumber: "ACOL001-SEN001", name: "Acid Wash Column HCL Flow Sensor" },
              { assetNumber: "ACOL001-SWT001", name: "Acid Wash Column High High Level Switch" },
            ] 
          },
          { 
            label: "HCL Dosing System", 
            equipment: [
              { assetNumber: "HDOS001-PMP001", name: "HCL Acid Dosing Pump" },
              { assetNumber: "HDOS001-VLV001", name: "HCL Dosing Pump Solenoid Valve" },
              { assetNumber: "HSMP001-PMP001", name: "HCL Area Sump Pump" },
            ] 
          },
          { 
            label: "Eluate System", 
            equipment: [
              { assetNumber: "ELUT001-TK001", name: "Eluate Tank" },
              { assetNumber: "ELUT001-PMP001", name: "Eluate Pump" },
              { assetNumber: "ELUT001-MTR001", name: "Eluate Pump – Motor" },
              { assetNumber: "ELUT001-MCC001", name: "Eluate Pump – MCC Cell" },
              { assetNumber: "ELUT001-LCS001", name: "Eluate Pump – LCS" },
              { assetNumber: "ELUT001-SWT001", name: "Eluate Pump Discharge High High Pressure Switch" },
              { assetNumber: "ELUT001-INS001", name: "Eluate Pump Discharge Pressure Gauge" },
              { assetNumber: "ELUT001-INS002", name: "Eluate Pump Discharge Temperature Gauge" },
              { assetNumber: "ELUT001-SEN001", name: "Eluate Tank Cyanide Feed Flow Sensor" },
              { assetNumber: "ELUT001-VLV001", name: "Eluate Tank Cyanide Feed Solenoid Valve" },
              { assetNumber: "ELUT001-SEN002", name: "Eluate Tank Level Sensor" },
            ] 
          },
          { 
            label: "Diesel System", 
            equipment: [
              { assetNumber: "DSL001-PMP001", name: "Diesel Pump" },
              { assetNumber: "DSL001-TK001", name: "Diesel Day Tank" },
              { assetNumber: "DSL001-SVC001", name: "Diesel Service Truck" },
            ] 
          },
        ],
      },
      {
        label: "Carbon Regeneration",
        parentAssets: [
          { 
            label: "Barren Carbon Dewatering Screen", 
            equipment: [
              { assetNumber: "BCDS001", name: "Barren Carbon Dewatering Screen" },
              { assetNumber: "BCDS001-EXC001", name: "Barren Carbon Dewatering Screen Exciter" },
              { assetNumber: "BCDS001-MCC001", name: "Barren Carbon Dewatering Screen – MCC Cell" },
              { assetNumber: "BCDS001-LCS001", name: "Barren Carbon Dewatering Screen – LCS" },
            ] 
          },
          { 
            label: "Regen Kiln Feed Hopper", 
            equipment: [
              { assetNumber: "RKHP001", name: "Regen Kiln Feed Hopper" },
              { assetNumber: "RKHP001-FDR001", name: "Regen Kiln Feed Hopper – Feeder" },
              { assetNumber: "RKHP001-MTR001", name: "Regen Kiln Feed Hopper – Motor" },
              { assetNumber: "RKHP001-SEN001", name: "Regen Kiln Feed Screw Inlet Level Sensor" },
            ]
          },
          { 
            label: "Regen Kiln", 
            equipment: [
              { assetNumber: "KLN001", name: "Regen Kiln – Kiln" },
              { assetNumber: "KLN001-MTR001", name: "Regen Kiln – Drive Motor" },
              { assetNumber: "KLN001-VSD001", name: "Regen Kiln – VSD" },
              { assetNumber: "KLN001-GBX001", name: "Regen Kiln – Gearbox" },
              { assetNumber: "KLN001-FAN001", name: "Regen Kiln – Combustion Fan" },
              { assetNumber: "KLN001-BRN001", name: "Regen Kiln Burners Zone 1" },
              { assetNumber: "KLN001-BRN002", name: "Regen Kiln Burners Zone 2" },
              { assetNumber: "KLN001-BRN003", name: "Regen Kiln Burners Zone 3" },
              { assetNumber: "KLN001-INS001", name: "Regen Kiln Zone 1 Temperature Gauge 1" },
              { assetNumber: "KLN001-INS002", name: "Regen Kiln Zone 1 Temperature Gauge 2" },
              { assetNumber: "KLN001-INS003", name: "Regen Kiln Zone 2 Temperature Gauge 1" },
              { assetNumber: "KLN001-INS004", name: "Regen Kiln Zone 2 Temperature Gauge 2" },
              { assetNumber: "KLN001-INS005", name: "Regen Kiln Zone 3 Temperature Gauge 1" },
              { assetNumber: "KLN001-INS006", name: "Regen Kiln Zone 3 Temperature Gauge 2" },
              { assetNumber: "KLN001-INS007", name: "Regen Kiln Feed End Temperature Gauge" },
              { assetNumber: "KLN001-SEN001", name: "Regen Kiln Discharge Temperature Sensor" },
              { assetNumber: "KLN001-DRN001", name: "Regen Kiln Drain Water" },
              { assetNumber: "KLN001-FLU001", name: "Regen Kiln Discharge Flue" },
              { assetNumber: "KLN001-FLT001", name: "Regen Kiln Return Filters" },
            ]
          },
          { 
            label: "Carbon Quench System", 
            equipment: [
              { assetNumber: "CREG001-HOP001", name: "Regenerated Carbon Quench Hopper" },
              { assetNumber: "CREG001-SWT001", name: "Regenerated Carbon Quench Hopper Low Low Level Switch" },
            ] 
          },
          { 
            label: "Regenerated Carbon Transfer", 
            equipment: [
              { assetNumber: "RCTR001-ALF001", name: "Carbon Transfer Air Lift" },
              { assetNumber: "RCTR001-PMP001", name: "Carbon Transfer Pump" },
              { assetNumber: "RCTR001-MTR001", name: "Carbon Transfer Pump – Motor" },
              { assetNumber: "RCTR001-MCC001", name: "Carbon Transfer Pump – MCC Cell" },
              { assetNumber: "RCTR001-LCS001", name: "Carbon Transfer Pump – LCS" },
            ] 
          },
          { 
            label: "Carbon Sizing Screen", 
            equipment: [
              { assetNumber: "CSZS001", name: "Carbon Sizing Screen" },
              { assetNumber: "CSZS001-EXC001", name: "Carbon Sizing Screen Exciter" },
            ] 
          },
          { 
            label: "Regen Area Sump", 
            equipment: [
              { assetNumber: "RSMP001-PMP001", name: "Regen Area Sump Pump" },
              { assetNumber: "RSMP001-MTR001", name: "Regen Area Sump Pump – Motor" },
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
              { assetNumber: "EWCL001", name: "Electrowinning Cell" },
              { assetNumber: "EWCL001-MNR001", name: "Electrowinning Cell – Monorail" },
              { assetNumber: "EWCL001-FAN001", name: "Electrowinning Cell – Extraction Fan" },
              { assetNumber: "EWCL001-TK001", name: "Electrowinning Cell – Solution Tank" },
              { assetNumber: "EWCL001-PMP001", name: "Electrowinning Cell – Feed Pump" },
              { assetNumber: "EWCL001-MTR001", name: "Electrowinning Cell – Feed Pump Motor" },
              { assetNumber: "EWCL001-MCC001", name: "Electrowinning Cell – Feed Pump MCC Cell" },
              { assetNumber: "EWCL001-LCS001", name: "Electrowinning Cell – Feed Pump LCS" },
              { assetNumber: "EWCL001-TG001", name: "Electrowinning Cell – Flashpot Inlet Temperature Gauge" },
              { assetNumber: "EWCL001-LSH001", name: "Electrowinning Cell – Flashpot High High Level Switch" },
            ] 
          },
          { 
            label: "Gold Room Safety Shower", 
            equipment: [
              { assetNumber: "GR-SHW01", name: "Gold Room Safety Shower" },
            ] 
          },
          { 
            label: "Cathode System", 
            equipment: [
              { assetNumber: "CWSH001", name: "High Pressure Cathode Washer" },
              { assetNumber: "CWSH001-BOX001", name: "Cathode Wash Box" },
              { assetNumber: "CWSH001-PMP001", name: "Cathode Wash Sludge Pump" },
              { assetNumber: "CWSH001-MTR001", name: "Cathode Wash Sludge Pump – Motor" },
              { assetNumber: "CWSH001-MCC001", name: "Cathode Wash Sludge Pump – MCC Cell" },
              { assetNumber: "CWSH001-LCS001", name: "Cathode Wash Sludge Pump – LCS" },
              { assetNumber: "CWSH001-WND001", name: "Cathode Winder" },
              { assetNumber: "CWSH001-FP001", name: "Cathode Sludge Filter Press" },
            ] 
          },
          { 
            label: "Calcine System", 
            equipment: [
              { assetNumber: "CALC001", name: "Calcine Oven" },
              { assetNumber: "CALC001-HOOD001", name: "Calcine Oven Hood" },
              { assetNumber: "CALC001-FAN001", name: "Calcine Oven Extraction Fan" },
            ] 
          },
          { 
            label: "Gold Bullion", 
            equipment: [
              { assetNumber: "BULL001-SCL001", name: "Gold Bullion Scale" },
              { assetNumber: "BULL001-BEN001", name: "Gold Bullion Scale Bench" },
              { assetNumber: "GR-BEN001", name: "Gold Room Work Bench" },
              { assetNumber: "GR-SAFE001", name: "Gold Room Bullion Safe" },
            ] 
          },
          { 
            label: "Smelting Furnace", 
            equipment: [
              { assetNumber: "SMLT001", name: "Gold Room Barring Furnace" },
              { assetNumber: "SMLT001-FAN001", name: "Barring Furnace Extraction Fan" },
              { assetNumber: "SMLT001-HOOD001", name: "Barring Furnace Hood" },
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
              { assetNumber: "THK001", name: "Tails Thickener" },
              { assetNumber: "THK001-PIPE001", name: "Tails Thickener – Piping and Valves" },
              { assetNumber: "TAILHOP001", name: "CIP Tailings Hopper" },
              { assetNumber: "TAILHOP001-LT001", name: "CIP Tailings Hopper – Level Transmitter" },
              { assetNumber: "THK001-FM001", name: "Tails Thickener – Flow Meter" },
              { assetNumber: "THK001-HYD001", name: "Tails Thickener – Hydraulic Pack" },
              { assetNumber: "THK001-PG001", name: "Tails Thickener – Hydraulic Pack Pressure Gauge 1" },
              { assetNumber: "THK001-PG002", name: "Tails Thickener – Hydraulic Pack Pressure Gauge 2" },
              { assetNumber: "THK001-PNL001", name: "Tails Thickener – Flocc Panel 1" },
              { assetNumber: "THK001-PNL002", name: "Tails Thickener – Flocc Panel 2" },
              { assetNumber: "THK001-PNL003", name: "Tails Thickener – Clarometer Panel" },
              { assetNumber: "THK001-MCC001", name: "Tails Thickener – Field MCC" },
            ]
          },
          { 
            label: "Thickener Underflow Pump", 
            equipment: [
              { assetNumber: "CIPSMP001", name: "CIP Tails Area Sump Pump" },
              { assetNumber: "CIPSMP001-MTR001", name: "CIP Tails Area Sump Pump – Motor" },
              { assetNumber: "CIPSMP001-MCC001", name: "CIP Tails Area Sump Pump – MCC Cell" },
              { assetNumber: "CIPSMP001-LCS001", name: "CIP Tails Area Sump Pump – LCS" },
              { assetNumber: "CIPPMP-A", name: "CIP Tailings Pump A" },
              { assetNumber: "CIPPMP-A-MTR001", name: "CIP Tailings Pump A – Motor" },
              { assetNumber: "CIPPMP-A-MCC001", name: "CIP Tailings Pump A – MCC Cell" },
              { assetNumber: "CIPPMP-A-LCS001", name: "CIP Tailings Pump A – LCS" },
              { assetNumber: "CIPPMP-A-VSD001", name: "CIP Tailings Pump A – VSD" },
              { assetNumber: "CIPPMP-B", name: "CIP Tailings Pump B" },
              { assetNumber: "CIPPMP-B-MTR001", name: "CIP Tailings Pump B – Motor" },
              { assetNumber: "CIPPMP-B-MCC001", name: "CIP Tailings Pump B – MCC Cell" },
              { assetNumber: "CIPPMP-B-LCS001", name: "CIP Tailings Pump B – LCS" },
              { assetNumber: "CIPPMP-B-VSD001", name: "CIP Tailings Pump B – VSD" },
              { assetNumber: "GRVPMP001", name: "Gravity Tails Pump" },
              { assetNumber: "GRVPMP001-MTR001", name: "Gravity Tails Pump – Motor" },
              { assetNumber: "GRVPMP001-MCC001", name: "Gravity Tails Pump – MCC Cell" },
              { assetNumber: "GRVPMP001-LCS001", name: "Gravity Tails Pump – LCS" },
              { assetNumber: "THKUFP-A", name: "Thickener Underflow Pump A" },
              { assetNumber: "THKUFP-A-MTR001", name: "Thickener Underflow Pump A – Motor" },
              { assetNumber: "THKUFP-A-MCC001", name: "Thickener Underflow Pump A – MCC Cell" },
              { assetNumber: "THKUFP-A-LCS001", name: "Thickener Underflow Pump A – LCS" },
              { assetNumber: "THKUFP-A-VSD001", name: "Thickener Underflow Pump A – VSD" },
              { assetNumber: "THKUFP-B", name: "Thickener Underflow Pump B" },
              { assetNumber: "THKUFP-B-MTR001", name: "Thickener Underflow Pump B – Motor" },
              { assetNumber: "THKUFP-B-MCC001", name: "Thickener Underflow Pump B – MCC Cell" },
              { assetNumber: "THKUFP-B-LCS001", name: "Thickener Underflow Pump B – LCS" },
              { assetNumber: "THKUFP-B-VFD001", name: "Thickener Underflow Pump B – VFD" },
              { assetNumber: "TAILSMP001", name: "Tails Area Sump Pump" },
              { assetNumber: "TAILSMP001-MTR001", name: "Tails Area Sump Pump – Motor" },
              { assetNumber: "TAILSMP001-MCC001", name: "Tails Area Sump Pump – MCC Cell" },
              { assetNumber: "TAILSMP001-LCS001", name: "Tails Area Sump Pump – LCS" },
              { assetNumber: "THKHYD001", name: "Thickener Hydraulic Pump" },
              { assetNumber: "THKHYD001-MTR001", name: "Thickener Hydraulic Pump – Motor" },
              { assetNumber: "THKHYD001-LCS001", name: "Thickener Hydraulic Pump – LCS" },
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
              { assetNumber: "FP001-MTR001", name: "Filter 1 Stock Tank Agitator – Motor" },
              { assetNumber: "FP001-GBX001", name: "Filter 1 Stock Tank Agitator – Gearbox" },
              { assetNumber: "FP001-MCC001", name: "Filter 1 Stock Tank Agitator – MCC Cell" },
              { assetNumber: "FP001-PLC001", name: "Filter 1 PLC" },
              { assetNumber: "FP001-INST001", name: "Filter 1 Instruments" },
              { assetNumber: "FP001-VLV001", name: "Filter 1 Piping and Valves" },
              { assetNumber: "FP001-PNL001", name: "Filter Press 1 Panel" },
              { assetNumber: "FP001-HYD001", name: "Filter Press 1 Hydraulic Pack" },
              { assetNumber: "FP001-MTR002", name: "Filter Press 1 Hydraulic Plate Pack – Motor" },
              { assetNumber: "FP001-MCC002", name: "Filter Press 1 Hydraulic Plate Pack – MCC Cell" },
              { assetNumber: "FP001-MTR003", name: "Filter Press 1 Hydraulic TT Plate – Motor" },
              { assetNumber: "FP001-MCC003", name: "Filter Press 1 Hydraulic TT Plate – MCC Cell" },
              { assetNumber: "FP002", name: "Tails Filter Press 2" },
              { assetNumber: "FP002-TK001", name: "Filter 2 Stock Tank" },
              { assetNumber: "FP002-AGT001", name: "Filter 2 Stock Tank Agitator" },
              { assetNumber: "FP002-MTR001", name: "Filter 2 Stock Tank Agitator – Motor" },
              { assetNumber: "FP002-GBX001", name: "Filter 2 Stock Tank Agitator – Gearbox" },
              { assetNumber: "FP002-MCC001", name: "Filter 2 Stock Tank Agitator – MCC Cell" },
              { assetNumber: "FP002-PLC001", name: "Filter 2 PLC" },
              { assetNumber: "FP002-INST001", name: "Filter 2 Instruments" },
              { assetNumber: "FP002-VLV001", name: "Filter 2 Piping and Valves" },
              { assetNumber: "FP002-PNL001", name: "Filter Press 2 Panel" },
              { assetNumber: "FP002-HYD001", name: "Filter Press 2 Hydraulic Pack" },
              { assetNumber: "FP002-MTR002", name: "Filter Press 2 Hydraulic Plate Pack – Motor" },
              { assetNumber: "FP002-MCC002", name: "Filter Press 2 Hydraulic Plate Pack – MCC Cell" },
              { assetNumber: "FP002-MTR003", name: "Filter Press 2 Hydraulic TT Plate – Motor" },
              { assetNumber: "FP002-MCC003", name: "Filter Press 2 Hydraulic TT Plate – MCC Cell" },
            ]
          },
          { 
            label: "Filtrate Pump", 
            equipment: [
              { assetNumber: "FILT001-PMP001", name: "Filtrate Pump – Pump" },
              { assetNumber: "FILT001-MTR001", name: "Filtrate Pump – Motor" },
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
        label: "Workshop Infrastructure",
        parentAssets: [
          { 
            label: "Workshop", 
            equipment: [
              { assetNumber: "WKSHP001", name: "Workshop" },
              { assetNumber: "WKSHP001-DB001", name: "Workshop DB" },
            ]
          },
        ],
      },
      {
        label: "Lab",
        parentAssets: [
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
