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
  // Extended attributes (metadata)
  serialNumber?: string;
  model?: string;
  // Gearbox/rotating equipment specs
  oilType?: string;
  oilVolume?: string;
  inputSpeed?: string;
  outputSpeed?: string;
  weight?: string;
  // Pump/motor specs
  motorSpeed?: string;
  protection?: string;
  voltage?: string;
  pumpFlow?: string;
  operatingPressure?: string;
  displacement?: string;
  motorRef?: string;
  pumpRef?: string;
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
        label: "Reagents",
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
              { 
                assetNumber: "AGT003", 
                name: "Cyanide Mixing Tank Agitator",
                components: [
                  {
                    componentCode: "MC4350/02/GBX/1057",
                    componentType: "Coaxial Gearbox Agitator",
                    componentName: "Cyanide Mixing Tank Agitator Unit",
                    manufacturer: "MIXTEC",
                    model: "MC4350/02/GBX/1057",
                    outputSpeed: "102 RPM",
                    displacement: "Material: 316SS"
                  },
                  {
                    componentCode: "MTE8 W22M",
                    componentType: "Motor",
                    componentName: "Cyanide Mixing Tank Agitator Motor",
                    manufacturer: "WEG",
                    model: "MTE8 W22M"
                  }
                ]
              },
              { 
                assetNumber: "PMP009", 
                name: "Cyanide Solution Transfer Pump",
                components: [
                  {
                    componentCode: "CRN20-01",
                    componentType: "Pump",
                    componentName: "Cyanide Transfer Pump",
                    manufacturer: "GRUNDFOS",
                    model: "CRN20-01 A FGI-G-V-HQQV",
                    serialNumber: "A96500484P11730"
                  }
                ]
              },
              { assetNumber: "TNK001", name: "Cyanide Solution Storage Tank" },
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
          { 
            label: "Gland Water System", 
            equipment: [
              { assetNumber: "GWTR001", name: "Gland Water System" },
              { assetNumber: "GWTR001-TK001", name: "Gland Water Tank" },
              { assetNumber: "GWTR001-PMP001", name: "Gland Water Pump Duty" },
              { assetNumber: "GWTR001-MTR001", name: "Gland Water Pump Duty – Motor" },
              { assetNumber: "GWTR001-MCC001", name: "Gland Water Pump Duty – MCC Cell" },
              { assetNumber: "GWTR001-LCS001", name: "Gland Water Pump Duty – LCS" },
              { assetNumber: "GWTR001-PMP002", name: "Gland Water Pump Standby" },
              { assetNumber: "GWTR001-MTR002", name: "Gland Water Pump Standby – Motor" },
              { assetNumber: "GWTR001-MCC002", name: "Gland Water Pump Standby – MCC Cell" },
              { assetNumber: "GWTR001-LCS002", name: "Gland Water Pump Standby – LCS" },
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
              { 
                assetNumber: "MFC001", 
                name: "Mill Feed Conveyor",
                components: [
                  {
                    componentCode: "K-ROL-SG-60x125-B",
                    componentType: "Conveyor Roller",
                    componentName: "Side Guide Roller",
                    manufacturer: "N/A"
                  },
                  {
                    componentCode: "K-ROL-STR-600B25",
                    componentType: "Conveyor Roller",
                    componentName: "Steel Trough Roller",
                    manufacturer: "N/A"
                  },
                  {
                    componentCode: "K-ROL-STR-600B25",
                    componentType: "Conveyor Roller",
                    componentName: "Steel Return Roller",
                    manufacturer: "N/A"
                  }
                ]
              },
              { assetNumber: "MFC001-LCS001", name: "Mill Feed Conveyor – Local Control Station" },
              { 
                assetNumber: "MFC001-MTR001", 
                name: "Mill Feed Conveyor – Motor",
                components: [
                  {
                    componentCode: "1001919277",
                    componentType: "Electric Motor",
                    componentName: "Conveyor Drive Motor",
                    manufacturer: "KTE30 PHEM"
                  }
                ]
              },
              { assetNumber: "MFC001-MCC001", name: "Mill Feed Conveyor – MCC Cell" },
              { assetNumber: "MFC001-GBX001", name: "Mill Feed Conveyor – Gearbox" },
              { assetNumber: "MFC001-USS001", name: "Mill Feed Conveyor – Underspeed Switch" },
              { assetNumber: "MFC001-WTM001", name: "Mill Feed Conveyor – Weightometer Loadcells" },
              { assetNumber: "MFC001-WTM002", name: "Mill Feed Conveyor – Weightometer Transmitter" },
              { assetNumber: "MFC001-PWS001", name: "Mill Feed Conveyor – Pull Wire Switch 1" },
              { assetNumber: "MFC001-PWS002", name: "Mill Feed Conveyor – Pull Wire Switch 2" },
              { assetNumber: "MFC001-PWS003", name: "Mill Feed Conveyor – Pull Wire Switch 3" },
              { assetNumber: "MFC001-PWS004", name: "Mill Feed Conveyor – Pull Wire Switch 4" },
              { assetNumber: "MFC001-BAS001", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 1" },
              { assetNumber: "MFC001-BAS002", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 2" },
              { assetNumber: "MFC001-BAS003", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 3" },
              { assetNumber: "MFC001-BAS004", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 4" },
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
              { 
                assetNumber: "PCFPA001", 
                name: "Primary Cyclone Feed Pump A",
                components: [
                  {
                    componentCode: "KTE50 W22M",
                    componentType: "Motor",
                    componentName: "Cyclone Feed Pump Motor",
                    manufacturer: "WEG",
                    model: "KTE50 W22M",
                    serialNumber: "03JUL24 / 1100388297"
                  },
                  {
                    componentCode: "8/6 AH",
                    componentType: "Pump Wet End",
                    componentName: "Cyclone Feed Pump Wet End",
                    manufacturer: "Austral",
                    model: "8/6 AH Metal"
                  },
                  {
                    componentCode: "EA005M",
                    componentType: "Bearing Assembly",
                    componentName: "Cyclone Feed Pump Bearings",
                    manufacturer: "M&Q Equipment",
                    serialNumber: "EA005M / 1811005"
                  },
                  {
                    componentCode: "SPC 2360",
                    componentType: "Belt",
                    componentName: "Cyclone Feed Pump Belt",
                    manufacturer: "N/A",
                    model: "SPC 2360 x 4"
                  }
                ]
              },
              { assetNumber: "PCFPA001-MTR001", name: "Primary Cyclone Feed Pump A – Motor" },
              { assetNumber: "PCFPA001-MCC001", name: "Primary Cyclone Feed Pump A – MCC Cell" },
              { assetNumber: "PCFPA001-LCS001", name: "Primary Cyclone Feed Pump A – LCS" },
            ]
          },
          { 
            label: "Primary Cyclone Feed Pump B", 
            equipment: [
              { 
                assetNumber: "PCFPB001", 
                name: "Primary Cyclone Feed Pump B",
                components: [
                  {
                    componentCode: "KTE50 W22M",
                    componentType: "Motor",
                    componentName: "Cyclone Feed Pump Motor (Standby)",
                    manufacturer: "WEG",
                    model: "KTE50 W22M",
                    serialNumber: "03JUL24 / 1100388297"
                  },
                  {
                    componentCode: "8/6 AH",
                    componentType: "Pump Wet End",
                    componentName: "Cyclone Feed Pump Wet End (Standby)",
                    manufacturer: "Austral",
                    model: "8/6 AH Metal"
                  },
                  {
                    componentCode: "EA005M",
                    componentType: "Bearing Assembly",
                    componentName: "Cyclone Feed Pump Bearings (Standby)",
                    manufacturer: "M&Q Equipment",
                    serialNumber: "EA005M / 1811005"
                  },
                  {
                    componentCode: "SPC 2360",
                    componentType: "Belt",
                    componentName: "Cyclone Feed Pump Belt (Standby)",
                    manufacturer: "N/A",
                    model: "SPC 2360 x 4"
                  },
                  {
                    componentCode: "GLAND",
                    componentType: "Gland Packing",
                    componentName: "Cyclone Feed Pump Gland Packing (Standby)",
                    manufacturer: "N/A",
                    model: "Request supplier"
                  }
                ]
              },
              { assetNumber: "PCFPB001-MTR001", name: "Primary Cyclone Feed Pump B – Motor" },
              { assetNumber: "PCFPB001-MCC001", name: "Primary Cyclone Feed Pump B – MCC Cell" },
              { assetNumber: "PCFPB001-LCS001", name: "Primary Cyclone Feed Pump B – LCS" },
            ]
          },
          { 
            label: "Primary Cyclone Feed Instrumentation", 
            equipment: [
              { assetNumber: "PCFI001-VLV001", name: "Primary Cyclone Feed – TechTaylor Valve" },
              { assetNumber: "PCFI001-VLV002", name: "Primary Cyclone Feed – VFD Valve" },
              { assetNumber: "PCFI001-FM001", name: "Primary Cyclone Feed – Flow Meter" },
              { assetNumber: "PCFI001-DT001", name: "Primary Cyclone Feed – Density Transmitter" },
            ]
          },
        ],
      },
      {
        label: "Grinding",
        parentAssets: [
          { 
            label: "Primary Ball Mill", 
            equipment: [
              { assetNumber: "BM001", name: "Primary Ball Mill" },
              { assetNumber: "BM001-MTR001", name: "Primary Ball Mill – Main Motor" },
              { assetNumber: "BM001-GBX001", name: "Primary Ball Mill – Gear Reducer", 
                components: [
                  {
                    componentCode: "H1 SH 15B",
                    componentType: "Helical Gearbox",
                    componentName: "Mill Main Gear Reducer",
                    manufacturer: "SEW-EURODRIVE",
                    model: "H1 SH 15B",
                    oilType: "CLP 320",
                    oilVolume: "45 L"
                  }
                ]
              },
              { assetNumber: "BM001-PIN001", name: "Primary Ball Mill – Pinion" },
              { assetNumber: "BM001-GIR001", name: "Primary Ball Mill – Girth Gear" },
              { assetNumber: "BM001-TRN001", name: "Primary Ball Mill – Trunnion" },
              { assetNumber: "BM001-BRG001", name: "Primary Ball Mill – Feed End Bearing" },
              { assetNumber: "BM001-BRG002", name: "Primary Ball Mill – Discharge End Bearing" },
              { assetNumber: "BM001-SEN001", name: "Primary Ball Mill – Feed End Bearing Temp Sensor" },
              { assetNumber: "BM001-SEN002", name: "Primary Ball Mill – Discharge End Bearing Temp Sensor" },
              { assetNumber: "BM001-TX001", name: "Primary Ball Mill – Feed End Bearing Temp Transmitter" },
              { assetNumber: "BM001-TX002", name: "Primary Ball Mill – Discharge End Bearing Temp Transmitter" },
              // NEW ASSETS - Lube Pumps with simple sequential numbering
              { 
                assetNumber: "PMP001", 
                name: "Primary Ball Mill Low Pressure Lube Pump – Duty",
                components: [
                  {
                    componentCode: "3339111192",
                    componentType: "Pump",
                    componentName: "Low Pressure Lube Pump – Duty",
                    manufacturer: "PARKER",
                    model: "3339111192",
                    pumpFlow: "2.16 m³/hr (36 lpm)",
                    operatingPressure: "15 bar",
                    displacement: "28 cc/rev"
                  },
                  {
                    componentCode: "L194 W22 / 1SE110 / 1009158787",
                    componentType: "Motor",
                    componentName: "Low Pressure Lube Pump Motor – Duty",
                    manufacturer: "WEG",
                    model: "L194 W22 / 1SE110 / 1009158787",
                    motorSpeed: "1450 rpm",
                    protection: "IP55",
                    voltage: "415V"
                  }
                ]
              },
              { 
                assetNumber: "PMP002", 
                name: "Primary Ball Mill Low Pressure Lube Pump – Standby",
                components: [
                  {
                    componentCode: "3339111192",
                    componentType: "Pump",
                    componentName: "Low Pressure Lube Pump – Standby",
                    manufacturer: "PARKER",
                    model: "3339111192",
                    pumpFlow: "2.16 m³/hr (36 lpm)",
                    operatingPressure: "15 bar",
                    displacement: "28 cc/rev"
                  }
                ]
              },
              { 
                assetNumber: "PMP003", 
                name: "Primary Ball Mill High Pressure Lube Pump",
                components: [
                  {
                    componentCode: "3706030",
                    componentType: "Pump",
                    componentName: "High Pressure Lube Pump",
                    manufacturer: "PARKER",
                    model: "3706030",
                    pumpFlow: "0.84 m³/hr (14 lpm)",
                    operatingPressure: "400 bar",
                    displacement: "10 cc/rev"
                  }
                ]
              },
              { 
                assetNumber: "PMP004", 
                name: "Primary Ball Mill Lube Cooling Recirculating Pump",
                components: [
                  {
                    componentCode: "K16 STE2 / 05MA10",
                    componentType: "Pump (with Motor)",
                    componentName: "Lube Cooling Recirculating Pump",
                    manufacturer: "WEG / PARKER",
                    model: "K16 STE2",
                    motorRef: "05MA10 / 1007731720",
                    pumpRef: "3339111486",
                    motorSpeed: "1450 rpm",
                    protection: "IP55",
                    voltage: "415V",
                    pumpFlow: "3.36 m³/hr (56 lpm)",
                    operatingPressure: "12 bar",
                    displacement: "44 cc/rev"
                  }
                ]
              },
              { 
                assetNumber: "OCL001", 
                name: "Primary Ball Mill Lube Water Oil Cooler",
                components: [
                  {
                    componentCode: "50EK4/2",
                    componentType: "Water-Oil Cooler",
                    componentName: "Lube Water Oil Cooler Unit",
                    manufacturer: "DYNACOOL",
                    model: "50EK4/2",
                    serialNumber: "65/EK1018T",
                    oilType: "Water-oil cooler"
                  }
                ]
              },
              { 
                assetNumber: "OCL002", 
                name: "Primary Ball Mill Lube Air Blast Oil Cooler",
                components: [
                  {
                    componentCode: "AMPH 100L B4",
                    componentType: "Air-cooled Oil Cooler",
                    componentName: "Air Blast Oil Cooler Unit",
                    manufacturer: "HYDAC",
                    model: "AMPH 100L B4 – 3kW",
                    serialNumber: "1900455",
                    motorRef: "AC-LN75/1.0/F/A1/IBP3",
                    operatingPressure: "16 bar (max)"
                  }
                ]
              },
              { 
                assetNumber: "LBS001", 
                name: "Primary Ball Mill Girth Gear Lube System",
                components: [
                  {
                    componentCode: "Fire-Ball 300",
                    componentType: "Grease Pump",
                    componentName: "Grease Pump",
                    manufacturer: "GRACO",
                    model: "Fire-Ball 300",
                    serialNumber: "233888 / K434021 / A24E"
                  },
                  {
                    componentCode: "3706030",
                    componentType: "Pump",
                    componentName: "High Pressure Grease Pump",
                    manufacturer: "FUCHS",
                    model: "3706030"
                  },
                  {
                    componentCode: "ELEC",
                    componentType: "Electrical Components",
                    componentName: "Electrical Components",
                    manufacturer: "FUCHS",
                    displacement: "Notes: Electrical spares associated with grease system"
                  }
                ]
              },
              { assetNumber: "BM001-LUB003", name: "Primary Mill – Lube System Instruments" },
              { assetNumber: "BM001-TX003", name: "Mill Low Pressure – Lube Oil Pressure Transmitter" },
              { assetNumber: "BM001-TX004", name: "Mill Low Pressure – Lube Oil Flow Transmitter" },
              { assetNumber: "BM001-TX005", name: "Mill High Pressure – Lift Lube Oil Pressure Transmitter" },
              { assetNumber: "BM001-LUB004", name: "Mill High Pressure – Lift Lube Oil Flow" },
              { assetNumber: "BM001-TX006", name: "Mill High Pressure – Lift Lube Oil Flow Transmitter" },
              { assetNumber: "BM001-LUB005", name: "Mill Lube System – Oil Level" },
              { assetNumber: "BM001-LUB006", name: "Mill Lube System – Oil Temperature" },
              { assetNumber: "BM001-LUB008", name: "Primary Ball Mill – Girth Gear Lube Control Panel" },
              { assetNumber: "BM001-LUB009", name: "Primary Ball Mill – Lube System Filter A" },
              { assetNumber: "BM001-LUB010", name: "Primary Ball Mill – Lube System Filter B" },
              { assetNumber: "BM001-HOP001", name: "Primary Mill – Discharge Hopper" },
              { assetNumber: "MILL-MCC001", name: "Mill Area Field MCC" },
              { assetNumber: "HOIL001-HTR001", name: "Hydraulic Oil Heater" },
              { assetNumber: "HOIL001-FAN001", name: "Hydraulic Oil Cooling Fan" },
            ]
          },
          { 
            label: "Grinding Sump", 
            equipment: [
              { 
                assetNumber: "GSPMP001-PMP001", 
                name: "Grinding Area Sump Pump",
                components: [
                  {
                    componentCode: "HGA 132S-8-4",
                    componentType: "Motor",
                    componentName: "Grinding Area Sump Pump Motor",
                    manufacturer: "CMG",
                    model: "HGA 132S-8-4"
                  },
                  {
                    componentCode: "65 QV SPG",
                    componentType: "Pump Assembly",
                    componentName: "Grinding Area Sump Pump Assembly",
                    manufacturer: "Warman",
                    model: "65 QV SPG (Metal)"
                  },
                  {
                    componentCode: "SPB 1320",
                    componentType: "Belt",
                    componentName: "Grinding Area Sump Pump Belt",
                    manufacturer: "N/A",
                    model: "SPB 1320 x 3"
                  }
                ]
              },
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
              // NEW ASSETS - Individual Cyclones with simple numbering
              { 
                assetNumber: "CYC001", 
                name: "Primary Cyclone 1",
                components: [
                  {
                    componentCode: "CVX400-1",
                    componentType: "Cyclone",
                    componentName: "Cyclone Unit",
                    manufacturer: "CAVEX",
                    model: "CVX400",
                    pumpFlow: "240 tph @ 61% w/w solids",
                    operatingPressure: "140 kPa",
                    displacement: "Spigot: 100 mm, Vortex: 150 mm"
                  }
                ]
              },
              { 
                assetNumber: "CYC002", 
                name: "Primary Cyclone 2",
                components: [
                  {
                    componentCode: "CVX400-2",
                    componentType: "Cyclone",
                    componentName: "Cyclone Unit",
                    manufacturer: "CAVEX",
                    model: "CVX400",
                    pumpFlow: "240 tph @ 61% w/w solids",
                    operatingPressure: "140 kPa",
                    displacement: "Spigot: 100 mm, Vortex: 150 mm"
                  }
                ]
              },
              { 
                assetNumber: "CYC003", 
                name: "Primary Cyclone 3",
                components: [
                  {
                    componentCode: "CVX400-3",
                    componentType: "Cyclone",
                    componentName: "Cyclone Unit (Standby)",
                    manufacturer: "CAVEX",
                    model: "CVX400",
                    pumpFlow: "240 tph @ 61% w/w solids",
                    operatingPressure: "140 kPa",
                    displacement: "Spigot: 100 mm, Vortex: 150 mm"
                  }
                ]
              },
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
            label: "Gravity Concentrator", 
            equipment: [
              // NEW ASSETS - Gravity Circuit equipment with simple numbering
              { 
                assetNumber: "SCR001", 
                name: "Gravity Screen",
                components: [
                  {
                    componentCode: "OF-HS-09/24-24",
                    componentType: "Screen",
                    componentName: "Vibrating Screen Unit",
                    manufacturer: "OVERFLOW",
                    model: "OF-HS-09/24-24",
                    weight: "1280 kg",
                    displacement: "Size: 0.9 × 2.4 m, Apertures: 2.4 mm"
                  }
                ]
              },
              { 
                assetNumber: "KNC001", 
                name: "Knelson Concentrator",
                components: [
                  {
                    componentCode: "KC-XD20",
                    componentType: "Concentrator",
                    componentName: "Knelson Concentrator Unit",
                    manufacturer: "CONSEP",
                    model: "KC-XD20",
                    pumpFlow: "11–17 m³/h feed, up to 80 t/h solids",
                    displacement: "G6 Cone, Max size: 6 mm (recommended 2 mm)"
                  }
                ]
              },
              { 
                assetNumber: "FLT001", 
                name: "Knelson Prefilter",
                components: [
                  {
                    componentCode: "FW050",
                    componentType: "Filter",
                    componentName: "Prefilter Unit",
                    manufacturer: "HELIX HYDRO",
                    model: "FW050",
                    pumpFlow: "25 m³/hr",
                    operatingPressure: "10 bar (max)",
                    displacement: "DN 2\" (50 mm), Max temp: 65°C"
                  }
                ]
              },
              { 
                assetNumber: "SHK001", 
                name: "Shaking Table",
                components: [
                  {
                    componentCode: "Wilfley #12",
                    componentType: "Shaking Table",
                    componentName: "Shaking Table Deck",
                    manufacturer: "WILFLEY",
                    model: "#12",
                    displacement: "Deck: 1070 × 2130 mm",
                    pumpFlow: "265–1900 kg/hr feed rate"
                  },
                  {
                    componentCode: "KTE23 W22",
                    componentType: "Motor",
                    componentName: "Shaking Table Motor",
                    manufacturer: "WEG",
                    model: "KTE23 W22"
                  }
                ]
              },
              { 
                assetNumber: "PMP005", 
                name: "Gravity Tails Pump",
                components: [
                  {
                    componentCode: "VT40 05",
                    componentType: "Vertical Spindle Pump",
                    componentName: "Gravity Tails Pump Assembly",
                    manufacturer: "Metso",
                    model: "VT40 05 NR/NR"
                  },
                  {
                    componentCode: "TECO",
                    componentType: "Motor",
                    componentName: "Gravity Tails Pump Motor",
                    manufacturer: "TECO",
                    model: "VT40 05 NR/NR",
                    voltage: "2.2 kW",
                    displacement: "Frame: D100L"
                  }
                ]
              },
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
            label: "Trash Screen", 
            equipment: [
              { 
                assetNumber: "TRSCR001", 
                name: "Trash Screen",
                components: [
                  {
                    componentCode: "HS-1.8x3.6",
                    componentType: "Linear Motion Vibrating Screen",
                    componentName: "Trash Screen Unit",
                    manufacturer: "MINSPEC",
                    model: "HS-1.8 × 3.6"
                  },
                  {
                    componentCode: "KEE 75-4",
                    componentType: "Exciter",
                    componentName: "Trash Screen Exciter",
                    manufacturer: "URAS",
                    model: "KEE 75-4"
                  }
                ]
              },
              { assetNumber: "TRSCR001-EXC001", name: "Trash Screen – Exciter" },
              { assetNumber: "TRSCR001-MCC001", name: "Trash Screen – MCC Cell" },
            ] 
          },
        ],
      },
      {
        label: "CIP",
        parentAssets: [
          { 
            label: "CIP Tanks", 
            equipment: [
              // CIP Tank 1
              { assetNumber: "CIP-TK01", name: "CIP Leach Tank 1" },
              { assetNumber: "CIP-SHW01", name: "CIP Tails Area Safety Shower" },
              { 
                assetNumber: "AGT001", 
                name: "Leach Tank 1 Agitator",
                components: [
                  {
                    componentCode: "MC4350/01/1167",
                    componentType: "Coaxial Gearbox Agitator",
                    componentName: "Leach Tank 1 Agitator Unit",
                    manufacturer: "MIXTEC",
                    model: "MC4350/01/1167",
                    outputSpeed: "28 RPM",
                    displacement: "Dual Impellers, Rubber-lined"
                  }
                ]
              },
              { assetNumber: "CIP-TK01-MTR001", name: "CIP Leach Tank 1 – Agitator Motor" },
              { assetNumber: "CIP-TK01-MCC001", name: "CIP Leach Tank 1 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK01-GBX001", name: "CIP Leach Tank 1 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS001", name: "CIP Leach Tank 1 – Agitator LCS" },
              { assetNumber: "CIP-NZL01", name: "Leach Tank 1 – Air Sparge Nozzles" },
              { assetNumber: "CIP-ALF01", name: "Carbon Transfer Air Lift 1" },
              // CIP Tank 2
              { assetNumber: "CIP-TK02", name: "CIP Leach Tank 2" },
              { 
                assetNumber: "AGT002", 
                name: "Leach Tank 2 Agitator",
                components: [
                  {
                    componentCode: "MC4350/01/1167",
                    componentType: "Coaxial Gearbox Agitator",
                    componentName: "Leach Tank 2 Agitator Unit",
                    manufacturer: "MIXTEC",
                    model: "MC4350/01/1167",
                    outputSpeed: "28 RPM",
                    displacement: "Dual Impellers, Rubber-lined"
                  }
                ]
              },
              { assetNumber: "CIP-TK02-MTR001", name: "CIP Leach Tank 2 – Agitator Motor" },
              { assetNumber: "CIP-TK02-MCC001", name: "CIP Leach Tank 2 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK02-GBX001", name: "CIP Leach Tank 2 – Agitator Gear Box" },
              { assetNumber: "CIP-TK02-LCS001", name: "CIP Leach Tank 2 – Agitator LCS" },
              { assetNumber: "CIP-NZL02", name: "Leach Tank 2 – Air Sparge Nozzles" },
              { assetNumber: "CIP-ALF02", name: "Carbon Transfer Air Lift 2" },
              // CIP Tank 3-8 (existing)
              { assetNumber: "CIP-TK03", name: "CIP Tank 3" },
              { assetNumber: "CIP-TK03-AGT001", name: "CIP Tank 3 – Agitator" },
              { assetNumber: "CIP-TK03-MTR001", name: "CIP Tank 3 – Agitator Motor" },
              { assetNumber: "CIP-TK03-GBX001", name: "CIP Tank 3 – Agitator Gear Box" },
              { assetNumber: "CIP-TK03-LCS001", name: "CIP Tank 3 – Agitator LCS" },
              { assetNumber: "CIP-TK03-MCC001", name: "CIP Tank 3 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF03", name: "Carbon Transfer Air Lift 3" },
              { assetNumber: "CIP-TK04", name: "CIP Tank 4" },
              { assetNumber: "CIP-TK04-AGT001", name: "CIP Tank 4 – Agitator" },
              { assetNumber: "CIP-TK04-MTR001", name: "CIP Tank 4 – Agitator Motor" },
              { assetNumber: "CIP-TK04-GBX001", name: "CIP Tank 4 – Agitator Gear Box" },
              { assetNumber: "CIP-TK04-LCS001", name: "CIP Tank 4 – Agitator LCS" },
              { assetNumber: "CIP-TK04-MCC001", name: "CIP Tank 4 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF04", name: "Carbon Transfer Air Lift 4" },
              { assetNumber: "CIP-TK05", name: "CIP Tank 5" },
              { assetNumber: "CIP-TK05-AGT001", name: "CIP Tank 5 – Agitator" },
              { assetNumber: "CIP-TK05-MTR001", name: "CIP Tank 5 – Agitator Motor" },
              { assetNumber: "CIP-TK05-GBX001", name: "CIP Tank 5 – Agitator Gear Box" },
              { assetNumber: "CIP-TK05-LCS001", name: "CIP Tank 5 – Agitator LCS" },
              { assetNumber: "CIP-TK05-MCC001", name: "CIP Tank 5 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF05", name: "Carbon Transfer Air Lift 5" },
              { assetNumber: "CIP-TK06", name: "CIP Tank 6" },
              { assetNumber: "CIP-TK06-AGT001", name: "CIP Tank 6 – Agitator" },
              { assetNumber: "CIP-TK06-MTR001", name: "CIP Tank 6 – Agitator Motor" },
              { assetNumber: "CIP-TK06-GBX001", name: "CIP Tank 6 – Agitator Gear Box" },
              { assetNumber: "CIP-TK06-LCS001", name: "CIP Tank 6 – Agitator LCS" },
              { assetNumber: "CIP-TK06-MCC001", name: "CIP Tank 6 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF06", name: "Carbon Transfer Air Lift 6" },
              { assetNumber: "CIP-TK07", name: "CIP Tank 7" },
              { assetNumber: "CIP-TK07-AGT001", name: "CIP Tank 7 – Agitator" },
              { assetNumber: "CIP-TK07-MTR001", name: "CIP Tank 7 – Agitator Motor" },
              { assetNumber: "CIP-TK07-GBX001", name: "CIP Tank 7 – Agitator Gear Box" },
              { assetNumber: "CIP-TK07-LCS001", name: "CIP Tank 7 – Agitator LCS" },
              { assetNumber: "CIP-TK07-MCC001", name: "CIP Tank 7 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF07", name: "Carbon Transfer Air Lift 7" },
              { assetNumber: "CIP-TK08", name: "CIP Tank 8" },
              { assetNumber: "CIP-TK08-AGT001", name: "CIP Tank 8 – Agitator" },
              { assetNumber: "CIP-TK08-MTR001", name: "CIP Tank 8 – Agitator Motor" },
              { assetNumber: "CIP-TK08-GBX001", name: "CIP Tank 8 – Agitator Gear Box" },
              { assetNumber: "CIP-TK08-LCS001", name: "CIP Tank 8 – Agitator LCS" },
              { assetNumber: "CIP-TK08-MCC001", name: "CIP Tank 8 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF08", name: "Carbon Transfer Air Lift 8" },
              // NEW ASSETS - CIP Pumps and Screens with simple numbering
              { 
                assetNumber: "PMP006", 
                name: "CIP Area Sump Pump",
                components: [
                  {
                    componentCode: "65QV-SPR",
                    componentType: "Vertical Spindle Pump",
                    componentName: "CIP Sump Pump Assembly",
                    manufacturer: "Global Pump",
                    model: "65QV-SPR Vertical Spindle"
                  },
                  {
                    componentCode: "WEG",
                    componentType: "Motor",
                    componentName: "CIP Sump Pump Motor",
                    manufacturer: "WEG"
                  },
                  {
                    componentCode: "SPA 1250",
                    componentType: "Belt",
                    componentName: "CIP Sump Pump Belt",
                    manufacturer: "N/A",
                    model: "SPA 1250 x 2"
                  }
                ]
              },
              { 
                assetNumber: "PMP007", 
                name: "CIP Tailings Pump – Duty",
                components: [
                  {
                    componentCode: "65QV-SPR1200",
                    componentType: "Pump",
                    componentName: "CIP Tailings Pump Wet End",
                    manufacturer: "WARMAN",
                    model: "65QV-SPR1200 (Rubber)",
                    pumpFlow: "137 m³/hr @ 25m TDH"
                  }
                ]
              },
              { 
                assetNumber: "PMP008", 
                name: "CIP Tailings Pump – Standby",
                components: [
                  {
                    componentCode: "65QV-SPR1200",
                    componentType: "Pump",
                    componentName: "CIP Tailings Pump Wet End",
                    manufacturer: "WARMAN",
                    model: "65QV-SPR1200 (Rubber)",
                    pumpFlow: "137 m³/hr @ 25m TDH"
                  }
                ]
              },
              { 
                assetNumber: "SCR002", 
                name: "Intertank Screen",
                components: [
                  {
                    componentCode: "WISS-5M2",
                    componentType: "Wiped Interstage Screen",
                    componentName: "Intertank Screen Unit (Top Discharge)",
                    manufacturer: "ALLOYTEC",
                    model: "Wiped Interstage Screen",
                    displacement: "Screen Area: 5 m², Aperture: 0.80 mm"
                  },
                  {
                    componentCode: "BONFIGLIOLI-GBX",
                    componentType: "Gearbox",
                    componentName: "Intertank Screen Spare Gearbox",
                    manufacturer: "Bonfiglioli"
                  }
                ]
              },
              { 
                assetNumber: "SCR003", 
                name: "Carbon Safety Screen",
                components: [
                  {
                    componentCode: "OF-HS-18/36",
                    componentType: "Linear Vibrating Screen",
                    componentName: "Carbon Safety Screen Unit",
                    manufacturer: "MINSPEC",
                    model: "OF-HS-18/36"
                  },
                  {
                    componentCode: "KEE 75-4",
                    componentType: "Exciter",
                    componentName: "Carbon Safety Screen Exciter",
                    manufacturer: "URAS",
                    model: "KEE 75-4"
                  }
                ]
              },
              { 
                assetNumber: "SCR004", 
                name: "Loaded Carbon Screen",
                components: [
                  {
                    componentCode: "OF-HS-12/24",
                    componentType: "Linear Motion Vibrating Screen",
                    componentName: "Loaded Carbon Screen Unit",
                    manufacturer: "Overflow",
                    model: "OF-HS-12/24"
                  }
                ]
              },
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
        ],
      },
      {
        label: "Elution",
        parentAssets: [
          { 
            label: "Elution Column", 
            equipment: [
              // NEW ASSETS - Elution equipment with simple numbering
              { 
                assetNumber: "COL001", 
                name: "Acid Wash Column",
                components: [
                  {
                    componentCode: "YF/18/0858",
                    componentType: "Column",
                    componentName: "Acid Wash Column",
                    manufacturer: "COMO Engineering",
                    model: "YF/18/0858",
                    weight: "2.0 tonne capacity",
                    oilType: "Bromo Butyl Rubber lining",
                    operatingPressure: "650 kPa design",
                    displacement: "AS1210:2010 Class 3 | 150°C design temp"
                  }
                ]
              },
              { 
                assetNumber: "FLT002", 
                name: "Acid Wash Column Carbon Filters",
                components: [
                  {
                    componentCode: "ALLOYTECH-FLT",
                    componentType: "Filter",
                    componentName: "Acid Wash Column Carbon Filters",
                    manufacturer: "Alloytech",
                    model: "Proprietary ABS Column Filters",
                    displacement: "Qty: 4 | Mesh: 0.8 mm"
                  }
                ]
              },
              { 
                assetNumber: "PMP010", 
                name: "HCL Acid Dosing Pump",
                components: [
                  {
                    componentCode: "02-5001-20-400",
                    componentType: "Pump",
                    componentName: "HCL Acid Dosing Pump (Installed)",
                    manufacturer: "WILDEN",
                    model: "02-5001-20-400",
                    displacement: "1\" diaphragm | PP & Santoprene wetted"
                  },
                  {
                    componentCode: "VA25-SPARE",
                    componentType: "Pump",
                    componentName: "HCL Acid Dosing Pump (Design/Spare)",
                    manufacturer: "VerderAir",
                    model: "VA25",
                    displacement: "Per design specification"
                  }
                ]
              },
              { 
                assetNumber: "PMP011", 
                name: "HCL Acid Area Sump Pump",
                components: [
                  {
                    componentCode: "HUSKY-2022",
                    componentType: "Pump",
                    componentName: "HCL Area Sump Pump (Installed)",
                    manufacturer: "GRACO",
                    model: "HUSKY 2022",
                    displacement: "2\" diaphragm | PP & Santoprene wetted"
                  },
                  {
                    componentCode: "VA50-SPARE",
                    componentType: "Pump",
                    componentName: "HCL Area Sump Pump (Design/Spare)",
                    manufacturer: "VerderAir",
                    model: "VA50",
                    displacement: "Per design specification"
                  }
                ]
              },
              { 
                assetNumber: "COL002", 
                name: "Elution Column",
                components: [
                  {
                    componentCode: "YF/18/0857",
                    componentType: "Column",
                    componentName: "Elution Column",
                    manufacturer: "COMO Engineering",
                    model: "YF/18/0857",
                    weight: "2.0 tonne capacity",
                    operatingPressure: "650 kPa design",
                    displacement: "AS1210:2010 Class 3 | 150°C design temp"
                  }
                ]
              },
              { 
                assetNumber: "FLT003", 
                name: "Elution Column Carbon Filters",
                components: [
                  {
                    componentCode: "COMO-304SS",
                    componentType: "Filter",
                    componentName: "Elution Column Carbon Filters",
                    manufacturer: "Non Ferrous Machining",
                    model: "COMO Proprietary 304SS Column Filters",
                    displacement: "Qty: 4 | PW63 wedgewire | Aperture: 0.8 mm"
                  }
                ]
              },
              { 
                assetNumber: "PMP012", 
                name: "Elution Column Sump Pump",
                components: [
                  {
                    componentCode: "40 PV SPG",
                    componentType: "Pump",
                    componentName: "Elution Column Sump Pump",
                    manufacturer: "AUSTRAL",
                    model: "40 PV SPG Vertical Sump Pump",
                    serialNumber: "M&Q Equipment / 1806010"
                  },
                  {
                    componentCode: "AEMBUCADD 132S",
                    componentType: "Motor",
                    componentName: "Elution Column Sump Pump Motor",
                    manufacturer: "TECO",
                    model: "AEMBUCADD 132S / P3201031001",
                    voltage: "5.5 kW (7.5 HP)",
                    displacement: "4 pole induction motor"
                  },
                  {
                    componentCode: "SPB 1320 x 2",
                    componentType: "Belt Drive",
                    componentName: "Elution Column Sump Pump Belt",
                    manufacturer: "Gates / Equivalent",
                    model: "SPB 1320 x 2"
                  }
                ]
              },
              { assetNumber: "PMP013", name: "Antiscalant Dosing Pump – Elution Raw Water" },
              { assetNumber: "HTR001", name: "Elution Heater" },
              { assetNumber: "BRN001", name: "Elution Heater Burner" },
              { assetNumber: "HEX001", name: "Elution Recovery Heat Exchanger" },
              { assetNumber: "FPT001", name: "Elution Flashpot" },
              { assetNumber: "PMP014", name: "Eluate Pump" },
            ] 
          },
          { 
            label: "Eluate System", 
            equipment: [
              { assetNumber: "ELUT001-TK001", name: "Eluate Tank" },
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
              { assetNumber: "CSZS001", name: "Carbon Sizing Screen" },
              { assetNumber: "CSZS001-EXC001", name: "Carbon Sizing Screen Exciter" },
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
              // NEW ASSETS - Electrowinning equipment with simple numbering
              { assetNumber: "REC001", name: "Electrowinning Cell Rectifier" },
              { assetNumber: "FAN001", name: "Electrowinning Cell Fume Extraction Fan" },
              { assetNumber: "EWCL001-MNR001", name: "Electrowinning Cell – Monorail" },
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
            label: "Cathode Washdown System", 
            equipment: [
              { assetNumber: "WSH001", name: "High Pressure Cathode Washer" },
              { assetNumber: "CWSH001-BOX001", name: "Cathode Wash Box" },
              { assetNumber: "PMP015", name: "Cathode Wash Sludge Pump" },
              { assetNumber: "PMP016", name: "Electrowinning Cell Sludge Pump" },
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
              { assetNumber: "THKUFP-A", name: "Thickener Underflow Pump A" },
              { assetNumber: "THKUFP-A-MTR001", name: "Thickener Underflow Pump A – Motor" },
              { assetNumber: "THKUFP-A-MCC001", name: "Thickener Underflow Pump A – MCC Cell" },
              { assetNumber: "THKUFP-A-LCS001", name: "Thickener Underflow Pump A – LCS" },
              { assetNumber: "THKUFP-A-VSD001", name: "Thickener Underflow Pump A – VSD" },
              { assetNumber: "THKUFP-B", name: "Thickener Underflow Pump B" },
              { assetNumber: "THKUFP-B-MTR001", name: "Thickener Underflow Pump B – Motor" },
              { assetNumber: "THKUFP-B-MCC001", name: "Thickener Underflow Pump B – MCC Cell" },
              { assetNumber: "THKUFP-B-LCS001", name: "Thickener Underflow Pump B – LCS" },
              { assetNumber: "THKUFP-B-VSD001", name: "Thickener Underflow Pump B – VSD" },
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
              { assetNumber: "FP001", name: "Filter Press" },
              { assetNumber: "FP001-MTR001", name: "Filter Press – HPU Motor" },
              { assetNumber: "FP001-MCC001", name: "Filter Press – HPU MCC Cell" },
              { assetNumber: "FP001-LCS001", name: "Filter Press – HPU LCS" },
              { assetNumber: "FP001-HPU001", name: "Filter Press – Hydraulic Power Unit" },
              { assetNumber: "FP001-AGT001", name: "Filter Press – Slurry Mixer" },
              { assetNumber: "FP001-CYL001", name: "Filter Press – Main Cylinder" },
              { assetNumber: "FP001-TRAY001", name: "Filter Press – Drip Tray" },
              { assetNumber: "FP001-CLH001", name: "Filter Press – Cloth Hanger" },
              { assetNumber: "FP001-FRM001", name: "Filter Press – Frame 1" },
              { assetNumber: "FP001-FRM002", name: "Filter Press – Frame 2" },
              { assetNumber: "FP001-FRM003", name: "Filter Press – Frame 3" },
              { assetNumber: "FP001-CHN001", name: "Filter Press – Chain Assembly" },
            ]
          },
          { 
            label: "Filtrate Pump", 
            equipment: [
              { assetNumber: "FILT001-PMP001", name: "Filtrate Pump Duty" },
              { assetNumber: "FILT001-MTR001", name: "Filtrate Pump Duty – Motor" },
              { assetNumber: "FILT001-MCC001", name: "Filtrate Pump Duty – MCC Cell" },
              { assetNumber: "FILT001-LCS001", name: "Filtrate Pump Duty – LCS" },
              { assetNumber: "FILT001-PMP002", name: "Filtrate Pump Standby" },
              { assetNumber: "FILT001-MTR002", name: "Filtrate Pump Standby – Motor" },
              { assetNumber: "FILT001-MCC002", name: "Filtrate Pump Standby – MCC Cell" },
              { assetNumber: "FILT001-LCS002", name: "Filtrate Pump Standby – LCS" },
            ]
          },
          { 
            label: "Filter Feed Pump", 
            equipment: [
              { assetNumber: "FFD001-PMP001", name: "Filter Feed Pump Duty" },
              { assetNumber: "FFD001-MTR001", name: "Filter Feed Pump Duty – Motor" },
              { assetNumber: "FFD001-MCC001", name: "Filter Feed Pump Duty – MCC Cell" },
              { assetNumber: "FFD001-LCS001", name: "Filter Feed Pump Duty – LCS" },
              { assetNumber: "FFD001-VSD001", name: "Filter Feed Pump Duty – VSD" },
              { assetNumber: "FFD001-PMP002", name: "Filter Feed Pump Standby" },
              { assetNumber: "FFD001-MTR002", name: "Filter Feed Pump Standby – Motor" },
              { assetNumber: "FFD001-MCC002", name: "Filter Feed Pump Standby – MCC Cell" },
              { assetNumber: "FFD001-LCS002", name: "Filter Feed Pump Standby – LCS" },
              { assetNumber: "FFD001-VSD002", name: "Filter Feed Pump Standby – VSD" },
            ]
          },
          { 
            label: "Tailings Conveyor", 
            equipment: [
              { assetNumber: "TC001", name: "Tailings Conveyor" },
              { assetNumber: "TC001-MTR001", name: "Tailings Conveyor – Motor" },
              { assetNumber: "TC001-GBX001", name: "Tailings Conveyor – Gearbox" },
              { assetNumber: "TC001-MCC001", name: "Tailings Conveyor – MCC Cell" },
              { assetNumber: "TC001-LCS001", name: "Tailings Conveyor – LCS" },
              { assetNumber: "TC001-PWS001", name: "Tailings Conveyor – Pull Wire Switch 1" },
              { assetNumber: "TC001-PWS002", name: "Tailings Conveyor – Pull Wire Switch 2" },
              { assetNumber: "TC001-BAS001", name: "Tailings Conveyor – Belt Alignment Drift Switch 1" },
              { assetNumber: "TC001-BAS002", name: "Tailings Conveyor – Belt Alignment Drift Switch 2" },
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
              { assetNumber: "WKSHP001-DB001", name: "Workshop L&P DB" },
              { assetNumber: "WKSHP001-CMP001", name: "Workshop Air Compressor" },
              { assetNumber: "WKSHP001-WLD001", name: "Workshop Welding Machine 1" },
              { assetNumber: "WKSHP001-WLD002", name: "Workshop Welding Machine 2" },
              { assetNumber: "WKSHP001-LAT001", name: "Workshop Lathe" },
              { assetNumber: "WKSHP001-GRN001", name: "Workshop Grinder" },
              { assetNumber: "WKSHP001-DRL001", name: "Workshop Drill Press" },
              { assetNumber: "WKSHP001-HYD001", name: "Workshop Hydraulic Press" },
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
              { assetNumber: "LAB001", name: "Laboratory" },
              { assetNumber: "LAB001-DB001", name: "Laboratory L&P DB" },
              { assetNumber: "LAB001-FURN001", name: "Laboratory Furnace" },
              { assetNumber: "LAB001-BAL001", name: "Laboratory Balance" },
              { assetNumber: "LAB001-CRS001", name: "Laboratory Crusher" },
              { assetNumber: "LAB001-PULV001", name: "Laboratory Pulverizer" },
            ] 
          },
        ],
      },
    ],
  },
];
