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

export type AreaType = "SITE" | "UTL" | "COM" | "REC" | "TAIL" | "SUP" | "CRU";

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
            label: "SINF01 Gold Plant", 
            equipment: [
              { assetNumber: "SINF01", name: "Gold Plant" },
              { assetNumber: "SINF02", name: "Buildings" },
            ] 
          },
          { 
            label: "SINF03 Admin Building", 
            equipment: [
              { assetNumber: "SINF03", name: "Admin" },
              { assetNumber: "SINF03-DB01", name: "Admin Office L&P DB 1" },
              { assetNumber: "SINF03-DB02", name: "Admin Office L&P DB 2" },
              { assetNumber: "SINF03-DB03", name: "Admin Office L&P DB 3" },
              { assetNumber: "SINF03-DB04", name: "Admin Office L&P DB 4" },
              { assetNumber: "SINF05", name: "Conference" },
            ] 
          },
          { 
            label: "SINF07 Toilets / Amenities", 
            equipment: [
              { assetNumber: "SINF07", name: "Male Toilet" },
              { assetNumber: "SINF08", name: "Female Toilet" },
              { assetNumber: "SINF07-DB01", name: "Male Toilet L&P DB" },
            ] 
          },
          { 
            label: "SINF04 Crib Room", 
            equipment: [
              { assetNumber: "SINF04", name: "Crib" },
            ] 
          },
          { 
            label: "SINF06 First Aid Room", 
            equipment: [
              { assetNumber: "SINF06", name: "First Aid Room" },
            ] 
          },
          
          { 
            label: "SVC01 Services", 
            equipment: [
              { assetNumber: "SVC01", name: "Services" },
              { assetNumber: "SVC02-DB01", name: "Lath Container L&P" },
              { assetNumber: "SVC02-DB02", name: "Crib Room L&P DB" },
              { assetNumber: "SVC02-DB03", name: "Conference Building L&P" },
              { assetNumber: "SVC02-DB04", name: "First Aid Room L&P DB" },
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
            label: "COMP01 Air Compressor 1", 
            equipment: [
              { assetNumber: "COMP01-MTR01", name: "Air Compressor 1 – Motor" },
              { assetNumber: "COMP01-VLV01", name: "Air Compressor 1 – Inlet Valve", pidTags: ["XV-101A", "HV-101"] },
              { assetNumber: "COMP01-VLV02", name: "Air Compressor 1 – Outlet Valve", pidTags: ["XV-101B"] },
            ]
          },
          { 
            label: "RCVR01 Air Receiver 1", 
            equipment: [
              { assetNumber: "RCVR01-VLV01", name: "Air Receiver 1 – Drain Valve" },
              { assetNumber: "RCVR01-SWT01", name: "Air Receiver 1 – Pressure Switch" },
            ]
          },
          { 
            label: "DRYR01 Air Dryer 1", 
            equipment: [
              { assetNumber: "DRYR01-HTR01", name: "Air Dryer 1 – Heater" },
              { assetNumber: "DRYR01-VLV01", name: "Air Dryer 1 – Purge Valve" },
            ]
          },
          { 
            label: "HCMP01 HP Air Compressor", 
            equipment: [
              { assetNumber: "HCMP01", name: "HP Air Compressor 1", pidTags: ["C-201", "CMP-201A"] },
              { assetNumber: "HCMP01-PIPE01", name: "HP Air Compressor 1 – Piping" },
              { assetNumber: "HCMP01-MCC01", name: "HP Air Compressor 1 – MCC Cell" },
              { assetNumber: "HCMP01-RCVR01", name: "HP Air Compressor 1 – Receiver", pidTags: ["V-201"] },
              { assetNumber: "HCMP02", name: "HP Air Compressor 2", pidTags: ["C-202", "CMP-201B"] },
              { assetNumber: "HCMP02-PIPE01", name: "HP Air Compressor 2 – Piping" },
              { assetNumber: "HCMP02-MCC01", name: "HP Air Compressor 2 – MCC Cell" },
              { assetNumber: "HCMP02-RCVR01", name: "HP Air Compressor 2 – Receiver" },
              { 
                assetNumber: "HCMP03", 
                name: "HP Air Compressor 3 (Filter Area)",
                components: [
                  {
                    componentCode: "PKG-01",
                    componentType: "Compressor Package",
                    componentName: "Compressor Package",
                    manufacturer: "ATLAS COPCO",
                    model: "GA22-FF"
                  }
                ]
              },
              { assetNumber: "HCMP03-PIPE01", name: "HP Air Compressor 3 – Piping" },
              { assetNumber: "HCMP03-MCC01", name: "HP Air Compressor 3 – MCC Cell" },
              { assetNumber: "HCMP03-RCVR01", name: "HP Air Compressor 3 – Receiver" },
              { assetNumber: "HCMP04", name: "HP Air Compressor 4" },
              { assetNumber: "HCMP04-MCC01", name: "HP Air Compressor 4 – MCC Cell" },
              { assetNumber: "HCMP04-RCVR01", name: "HP Air Compressor 4 – Receiver" },
            ]
          },
        ],
      },
      {
        label: "Electrical / Controls",
        parentAssets: [
          { 
            label: "MDB01 Main Distribution Board", 
            equipment: [
              { assetNumber: "MDB01", name: "Main Distribution Board", pidTags: ["E-100-MDB"] },
              { assetNumber: "MDB01-DB01", name: "Ice Machine Room DB" },
              { assetNumber: "MDB01-DB02", name: "Main DB 1" },
              { assetNumber: "MDB01-DB03", name: "Main DB 2" },
              { assetNumber: "MDB01-LP01", name: "MCC-125 L&P" },
              { assetNumber: "MDB01-LP02", name: "MCC-110 L&P" },
              { assetNumber: "MDB01-LP03", name: "MCC-111 L&P" },
              { assetNumber: "MDB01-LP04", name: "MCC-113 L&P" },
              { assetNumber: "MDB01-LP05", name: "MCC-114 L&P" },
              { assetNumber: "MDB01-LP06", name: "MCC-115 L&P" },
              { assetNumber: "MDB01-LP07", name: "MCC-116 L&P" },
              { assetNumber: "MDB01-LP08", name: "MCC-117 L&P" },
              { assetNumber: "MDB01-LP09", name: "MCC-118 L&P" },
              { assetNumber: "MDB01-LP10", name: "MCC-120 L&P" },
              { assetNumber: "MDB01-LP11", name: "MCC-121 L&P" },
              { assetNumber: "MDB01-LP12", name: "MCC-122 L&P" },
              { assetNumber: "MDB01-LP13", name: "MCC-130 L&P" },
              { assetNumber: "MDB01-LP14", name: "Titration Hut L&P DB" },
            ]
          },
          { 
            label: "SDB01 Sub Distribution Board", 
            equipment: [
              { assetNumber: "SDB01", name: "Sub-100" },
              { assetNumber: "SDB01-LP01", name: "Sub-100 L&P" },
              { assetNumber: "SDB01-ESS01", name: "Sub-100 Essential Board" },
            ]
          },
          { 
            label: "CR01 Control Room", 
            equipment: [
              { assetNumber: "CR01", name: "Control Room" },
              { assetNumber: "CR01-PNL01", name: "Knelson Concentrator Control Panel" },
              { assetNumber: "CR01-PNL02", name: "Knelson Area Hoist Control Panel" },
              { assetNumber: "CR01-DB01", name: "Control Room L&P DB" },
            ]
          },
          
          { 
            label: "LTW01 Lighting Towers", 
            equipment: [
              { assetNumber: "LTW01", name: "Lighting Tower 1" },
              { assetNumber: "LTW02", name: "Lighting Tower 2" },
              { assetNumber: "LTW03", name: "Lighting Tower 3" },
              { assetNumber: "LTW04", name: "Lighting Tower 4" },
              { assetNumber: "LTW05", name: "Lighting Tower 5" },
            ] 
          },
          { 
            label: "MSUB01 Main Sub Station", 
            equipment: [
              { assetNumber: "MSUB01", name: "Main Sub Station" },
              { assetNumber: "MSUB01-DB01", name: "RO Plant Main Board" },
            ] 
          },
        ],
      },
      {
        label: "Power Generation",
        parentAssets: [
          { 
            label: "GEN01 Generators", 
            equipment: [
              { assetNumber: "GEN01", name: "Power Station Generator 1 (500kVA)" },
              { assetNumber: "GEN01-ENG01", name: "Power Station Generator 1 – Engine" },
              { assetNumber: "GEN01-ALT01", name: "Power Station Generator 1 – Alternator" },
              { assetNumber: "GEN01-PNL01", name: "Power Station Generator 1 – Control Panel" },
              { assetNumber: "GEN02", name: "Power Station Generator 2 (500kVA)" },
              { assetNumber: "GEN02-ENG01", name: "Power Station Generator 2 – Engine" },
              { assetNumber: "GEN02-ALT01", name: "Power Station Generator 2 – Alternator" },
              { assetNumber: "GEN02-PNL01", name: "Power Station Generator 2 – Control Panel" },
              { assetNumber: "GEN03", name: "Power Station Generator 3 (500kVA)" },
              { assetNumber: "GEN03-ENG01", name: "Power Station Generator 3 – Engine" },
              { assetNumber: "GEN03-ALT01", name: "Power Station Generator 3 – Alternator" },
              { assetNumber: "GEN03-PNL01", name: "Power Station Generator 3 – Control Panel" },
              { assetNumber: "GEN04", name: "Power Station Generator 4 (500kVA)" },
              { assetNumber: "GEN04-ENG01", name: "Power Station Generator 4 – Engine" },
              { assetNumber: "GEN04-ALT01", name: "Power Station Generator 4 – Alternator" },
              { assetNumber: "GEN04-PNL01", name: "Power Station Generator 4 – Control Panel" },
              { assetNumber: "GEN05", name: "Power Station Generator 5 (500kVA)" },
              { assetNumber: "GEN05-ENG01", name: "Power Station Generator 5 – Engine" },
              { assetNumber: "GEN05-ALT01", name: "Power Station Generator 5 – Alternator" },
              { assetNumber: "GEN05-PNL01", name: "Power Station Generator 5 – Control Panel" },
              { assetNumber: "GEN06", name: "Power Station Generator 6 (500kVA)" },
              { assetNumber: "GEN06-ENG01", name: "Power Station Generator 6 – Engine" },
              { assetNumber: "GEN06-ALT01", name: "Power Station Generator 6 – Alternator" },
              { assetNumber: "GEN06-PNL01", name: "Power Station Generator 6 – Control Panel" },
              { assetNumber: "GEN07", name: "Power Station Generator 7 (500kVA)" },
              { assetNumber: "GEN07-ENG01", name: "Power Station Generator 7 – Engine" },
              { assetNumber: "GEN07-ALT01", name: "Power Station Generator 7 – Alternator" },
              { assetNumber: "GEN07-PNL01", name: "Power Station Generator 7 – Control Panel" },
              { assetNumber: "GEN08", name: "Power Station Generator 8 (500kVA)" },
              { assetNumber: "GEN08-ENG01", name: "Power Station Generator 8 – Engine" },
              { assetNumber: "GEN08-ALT01", name: "Power Station Generator 8 – Alternator" },
              { assetNumber: "GEN08-PNL01", name: "Power Station Generator 8 – Control Panel" },
              { assetNumber: "GEN-ADM01", name: "Admin Generator (50kVA)" },
              { assetNumber: "GEN-LAB01", name: "Lab Generator (30kVA)" },
              { assetNumber: "GEN-JUNO01", name: "Juno Bore Generator (200kVA)" },
              { assetNumber: "GEN-WRK01", name: "Mining Workshop Generator (75kVA)" },
              { assetNumber: "GEN-SPR01", name: "Spare Generator" },
            ]
          },
          { 
            label: "FSTK01 Fuel Storage Tank", 
            equipment: [
              { assetNumber: "FSTK01", name: "Fuel Storage Tank – Main Tank" },
              { assetNumber: "FSTK01-PMP01", name: "Fuel Storage Tank – Transfer Pump" },
              { assetNumber: "FSTK01-VLV01", name: "Fuel Storage Tank – Isolation Valve" },
            ] 
          },
          { 
            label: "FDISP01 Fuel Dispensing Station", 
            equipment: [
              { assetNumber: "FDISP01", name: "Fuel Dispensing Station" },
              { assetNumber: "FDISP01-PMP01", name: "Fuel Dispensing Station – Pump" },
              { assetNumber: "FDISP01-DB01", name: "Fuel Dispensing Station – Control Board" },
            ] 
          },
        ],
      },
      {
        label: "Reagents",
        parentAssets: [
          { 
            label: "LSILO01 Lime Storage Silo", 
            equipment: [
              { assetNumber: "LSILO01", name: "Lime Storage Silo" },
              { assetNumber: "LSILO01-VLV01", name: "Lime Storage Silo – Discharge Valve" },
              { assetNumber: "LSILO01-VIB01", name: "Lime Storage Silo – Vibrator" },
            ] 
          },
          { 
            label: "LDOS01 Lime Dosing System", 
            equipment: [
              { assetNumber: "LDOS01", name: "Lime Dosing System" },
              { assetNumber: "LDOS01-PMP01", name: "Lime Dosing System – Dosing Pump" },
              { assetNumber: "LDOS01-AGT01", name: "Lime Dosing System – Mixing Agitator" },
            ] 
          },
          { 
            label: "REAG-SHW01 Reagent Safety Shower", 
            equipment: [
              { assetNumber: "REAG-SHW01", name: "Reagent Safety Shower 1" },
              { assetNumber: "REAG-SHW02", name: "Reagent Safety Shower 2" },
              { assetNumber: "REAG-SHW03", name: "Reagent Safety Shower 3" },
              { assetNumber: "REAG-SHW04", name: "Reagent Safety Shower 4" },
            ] 
          },
          { 
            label: "FLOC01 Floc System", 
            equipment: [
              { assetNumber: "FLOC01", name: "Floc System" },
              { 
                assetNumber: "FLOC01-PMP01", 
                name: "Floc System – Dosing Pump",
                components: [
                  {
                    componentCode: "PMP-01",
                    componentType: "Progressive Cavity Pump",
                    componentName: "Dosing Pump",
                    manufacturer: "SEEPEX",
                    model: "BN1-6L"
                  },
                  {
                    componentCode: "MTR-01",
                    componentType: "Motor",
                    componentName: "Motor",
                    manufacturer: "NORD",
                    voltage: "1.1 kW"
                  }
                ]
              },
              { assetNumber: "FLOC01-AGT01", name: "Floc System – Mixing Agitator" },
            ]
          },
          { 
            label: "CBB01 Cyanide Bag Breaker", 
            equipment: [
              { assetNumber: "CBB01", name: "Cyanide Bag Breaker" },
            ] 
          },
          { 
            label: "CABB01 Caustic Bag Breaker", 
            equipment: [
              { assetNumber: "CABB01", name: "Caustic Bag Breaker" },
            ] 
          },
          { 
            label: "CMIX01 Cyanide Mixing System", 
            equipment: [
              { assetNumber: "CMIX01", name: "Cyanide Mixing Tank" },
              { assetNumber: "CMIX01-TK01", name: "Cyanide Mixing Tank – Tank" },
              { 
                assetNumber: "CYN-MIX-AGT-01", 
                name: "Cyanide Mixing Tank Agitator",
                components: [
                  {
                    componentCode: "MTE8 W22M",
                    componentType: "Motor",
                    componentName: "Cyanide Mixing Tank Agitator Motor",
                    manufacturer: "WEG",
                    model: "MTE8 W22M"
                  },
                  {
                    componentCode: "MC4350",
                    componentType: "Gearbox",
                    componentName: "Cyanide Mixing Tank Agitator Gearbox",
                    manufacturer: "MIXTEC",
                    model: "MC4350"
                  }
                ]
              },
              { 
                assetNumber: "PMP09", 
                name: "Cyanide Solution Transfer Pump",
                components: [
                  {
                    componentCode: "CRN20-01",
                    componentType: "Pump",
                    componentName: "Cyanide Transfer Pump",
                    manufacturer: "GRUNDFOS",
                    model: "CRN20-01 A FGI-G-V-HQQV",
                    serialNumber: "A96500484P11730",
                    motorSpeed: "2789 rpm",
                    pumpFlow: "50 m³/h @ 9m TDH"
                  }
                ]
              },
              { 
                assetNumber: "TNK01", 
                name: "Cyanide Solution Storage Tank",
                components: [
                  {
                    componentCode: "HDPE-22.5",
                    componentType: "Storage Tank",
                    componentName: "Cyanide Solution Storage Tank",
                    manufacturer: "N/A",
                    model: "HDPE Tank",
                    oilVolume: "22.5 m³ capacity"
                  }
                ]
              },
              { assetNumber: "CMIX01-TX01", name: "Cyanide Mixing Tank – Level Transmitter" },
            ]
          },
          { 
            label: "CINS01 Cyanide Instruments", 
            equipment: [
              { assetNumber: "CINS01", name: "Cyanide Instruments" },
            ] 
          },
          { 
            label: "CDOS01 Cyanide Dosing System", 
            equipment: [
              { assetNumber: "CDOS01", name: "Cyanide Dosing Hut" },
              { assetNumber: "CDOS02", name: "Cyanide Dosing Hut 2" },
              { assetNumber: "CDOS01-PMP01", name: "Cyanide Dosing Pump Duty" },
              { assetNumber: "CDOS01-PMP02", name: "Cyanide Dosing Pump Stand-by" },
              { assetNumber: "CDOS01-MTR01", name: "Cyanide Dosing Pump Stand-by – Motor" },
              { assetNumber: "CDOS01-MCC01", name: "Cyanide Dosing Pump Stand-by – MCC Cell" },
              { assetNumber: "CDOS01-LCS01", name: "Cyanide Dosing Pump Stand-by – LCS" },
              { assetNumber: "REAG-MCC01", name: "Reagents Field MCC" },
            ] 
          },
          { 
            label: "CSMP01 Cyanide Area Sump", 
            equipment: [
              { assetNumber: "CSMP01-PMP01", name: "Cyanide Area Sump Pump" },
              { assetNumber: "CSMP01-MTR01", name: "Cyanide Area Sump Pump – Motor" },
              { assetNumber: "CSMP01-MCC01", name: "Cyanide Area Sump Pump – MCC Cell" },
              { assetNumber: "CSMP01-LCS01", name: "Cyanide Area Sump Pump – LCS" },
            ] 
          },
          { 
            label: "CAUS01 Caustic Dosing System", 
            equipment: [
              { assetNumber: "CAUS01-PMP01", name: "Caustic Dosing Pump" },
              { assetNumber: "CAUS01-MTR01", name: "Caustic Dosing Pump – Motor" },
              { assetNumber: "CAUS01-MCC01", name: "Caustic Dosing Pump – MCC Cell" },
              { assetNumber: "CAUS01-LCS01", name: "Caustic Dosing Pump – LCS" },
            ] 
          },
          { 
            label: "THUT01 Titration Hut", 
            equipment: [
              { assetNumber: "THUT01", name: "Titration Hut" },
            ] 
          },
        ],
      },
      {
        label: "Water",
        parentAssets: [
          { 
            label: "PWT01 Potable Water Tank", 
            equipment: [
              { assetNumber: "PWT01", name: "Potable Water Tank" },
              { assetNumber: "PWT01-PIPE01", name: "Potable Water Tank – Pipework" },
              { 
                assetNumber: "PWT01-PMP01", 
                name: "Potable Water Tank – Pump Standby",
                components: [
                  {
                    componentCode: "MTR-01",
                    componentType: "Motor",
                    componentName: "Electric Motor",
                    manufacturer: "LOWARA",
                    model: "10SV09F04T/D"
                  }
                ]
              },
              { assetNumber: "PWT01-MCC01", name: "Potable Water Tank – Pump Standby MCC Cell" },
              { assetNumber: "PWT01-LCS01", name: "Potable Water Tank – Pump Standby LCS" },
              { 
                assetNumber: "PWT01-PMP02", 
                name: "Potable Water Tank – Pump Duty",
                components: [
                  {
                    componentCode: "MTR-01",
                    componentType: "Motor",
                    componentName: "Electric Motor",
                    manufacturer: "LOWARA",
                    model: "10SV09F04T/D"
                  }
                ]
              },
              { assetNumber: "PWT01-MCC02", name: "Potable Water Tank – Pump Duty MCC Cell" },
              { assetNumber: "PWT01-LCS02", name: "Potable Water Tank – Pump Duty LCS" },
            ]
          },
          { 
            label: "RWT01 Raw Water Tank", 
            equipment: [
              { assetNumber: "RWT01", name: "Raw Water Tank" },
              { 
                assetNumber: "RWT01-PMP01", 
                name: "Raw Water Tank – Pump Duty",
                components: [
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump",
                    componentName: "Pump",
                    manufacturer: "GRUNDFOS",
                    model: "CR45-3-X-FI-E-HQQE"
                  }
                ]
              },
              { assetNumber: "RWT01-MTR01", name: "Raw Water Tank – Pump Duty Motor" },
              { assetNumber: "RWT01-MCC01", name: "Raw Water Tank – Pump Duty MCC Cell" },
              { assetNumber: "RWT01-LCS01", name: "Raw Water Tank – Pump Duty LCS" },
              { assetNumber: "RWT01-PMP02", name: "Raw Water Tank – Pump Standby" },
              { assetNumber: "RWT01-MTR02", name: "Raw Water Tank – Pump Standby Motor" },
              { assetNumber: "RWT01-MCC02", name: "Raw Water Tank – Pump Standby MCC Cell" },
              { assetNumber: "RWT01-LCS02", name: "Raw Water Tank – Pump Standby LCS" },
            ]
          },
          { 
            label: "PWP01 Process Water System", 
            equipment: [
              { assetNumber: "PWP01", name: "Process Water Pond" },
              { assetNumber: "PWP01-PIPE01", name: "Process Water Pond – Piping" },
              { 
                assetNumber: "UTL-PW-PMP-D", 
                name: "Process Water Pump (Duty)",
                components: [
                  {
                    componentCode: "KTE44 W22M",
                    componentType: "Motor",
                    componentName: "Process Water Pump Motor (Duty)",
                    manufacturer: "WEG",
                    model: "KTE44 W22M"
                  },
                  {
                    componentCode: "150x125-400",
                    componentType: "Pump",
                    componentName: "Process Water Pump (Duty)",
                    manufacturer: "SOUTHERN CROSS",
                    model: "150x125-400"
                  }
                ]
              },
              { assetNumber: "PWP01-MCC01", name: "Process Water Pump Duty – MCC Cell" },
              { assetNumber: "PWP01-LCS01", name: "Process Water Pump Duty – LCS" },
              { assetNumber: "PWP01-VSD01", name: "Process Water Pump Duty – VSD" },
              { 
                assetNumber: "UTL-PW-PMP-S", 
                name: "Process Water Pump (Standby)",
                components: [
                  {
                    componentCode: "KTE44 W22M-S",
                    componentType: "Motor",
                    componentName: "Process Water Pump Motor (Standby)",
                    manufacturer: "WEG",
                    model: "KTE44 W22M"
                  },
                  {
                    componentCode: "150x125-400-S",
                    componentType: "Pump",
                    componentName: "Process Water Pump (Standby)",
                    manufacturer: "SOUTHERN CROSS",
                    model: "150x125-400"
                  }
                ]
              },
              { assetNumber: "PWP01-MCC02", name: "Process Water Pump Standby – MCC Cell" },
              { assetNumber: "PWP01-LCS02", name: "Process Water Pump Standby – LCS" },
              { assetNumber: "PWP01-VSD02", name: "Process Water Pump Standby – VSD" },
            ] 
          },
          { 
            label: "GWTR01 Gland Water System", 
            equipment: [
              { assetNumber: "GWTR01", name: "Gland Water System" },
              { assetNumber: "GWTR01-TK01", name: "Gland Water Tank" },
              { 
                assetNumber: "GWTR01-PMP01", 
                name: "Gland Water Pump Duty",
                components: [
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump",
                    componentName: "Pump",
                    manufacturer: "LOWARA",
                    model: "10SV09F040T/D"
                  }
                ]
              },
              { assetNumber: "GWTR01-MTR01", name: "Gland Water Pump Duty – Motor" },
              { assetNumber: "GWTR01-MCC01", name: "Gland Water Pump Duty – MCC Cell" },
              { assetNumber: "GWTR01-LCS01", name: "Gland Water Pump Duty – LCS" },
              { 
                assetNumber: "GWTR01-PMP02", 
                name: "Gland Water Pump Standby",
                components: [
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump",
                    componentName: "Pump",
                    manufacturer: "LOWARA",
                    model: "10SV09F040T/D"
                  }
                ]
              },
              { assetNumber: "GWTR01-MTR02", name: "Gland Water Pump Standby – Motor" },
              { assetNumber: "GWTR01-MCC02", name: "Gland Water Pump Standby – MCC Cell" },
              { assetNumber: "GWTR01-LCS02", name: "Gland Water Pump Standby – LCS" },
            ]
          },
        ],
      },
      {
        label: "Fuel Systems",
        parentAssets: [
          { 
            label: "FDISP01 Fuel Dispensing", 
            equipment: [
              { assetNumber: "FDISP01-DB01", name: "Fuel Dispensing control Board" },
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
            label: "RHOP01 Reclaim Hopper", 
            equipment: [
              { assetNumber: "RHOP01", name: "Reclaim Hopper" },
            ] 
          },
          { 
            label: "APN01 Apron Feeder", 
            equipment: [
              { 
                assetNumber: "APN01", 
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
              { assetNumber: "APN01-LCS01", name: "Apron Feeder – LCS" },
              { assetNumber: "APN01-MCC01", name: "Apron Feeder – MCC Cell" },
              { 
                assetNumber: "APN01-GMR01", 
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
              { assetNumber: "APN01-PWS01", name: "Apron Feeder – Pullwire Switch" },
              { assetNumber: "APN01-TX01", name: "Apron Feeder – Speed Transmitter" },
              { assetNumber: "APN01-VLV01", name: "Apron Feeder – Rotary Valve" },
            ] 
          },
          { 
            label: "FHOP01 Feed Hopper", 
            equipment: [
              { assetNumber: "FHOP01", name: "Mill Feed Hopper" },
              { assetNumber: "FHOP01-HLS01", name: "Mill Feed Hopper – High Level Switch" },
              { assetNumber: "FHOP01-CHU01", name: "Mill Feed Hopper – Feed Chute" },
              { assetNumber: "FHOP01-CHU02", name: "Mill Feed Hopper – Ball Loading Chute" },
              { assetNumber: "FHOP01-BOX01", name: "Mill Feed Hopper – Boiler Box" },
            ]
          },
          { 
            label: "MFC01 Mill Feed Conveyor", 
            equipment: [
              { 
                assetNumber: "MFC01", 
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
              { assetNumber: "MFC01-LCS01", name: "Mill Feed Conveyor – Local Control Station" },
              { 
                assetNumber: "MFC01-MTR01", 
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
              { assetNumber: "MFC01-MCC01", name: "Mill Feed Conveyor – MCC Cell" },
              { assetNumber: "MFC01-GBX01", name: "Mill Feed Conveyor – Gearbox" },
              { assetNumber: "MFC01-USS01", name: "Mill Feed Conveyor – Underspeed Switch" },
              { assetNumber: "MFC01-WTM01", name: "Mill Feed Conveyor – Weightometer Loadcells" },
              { assetNumber: "MFC01-WTM02", name: "Mill Feed Conveyor – Weightometer Transmitter" },
              { assetNumber: "MFC01-PWS01", name: "Mill Feed Conveyor – Pull Wire Switch 1" },
              { assetNumber: "MFC01-PWS02", name: "Mill Feed Conveyor – Pull Wire Switch 2" },
              { assetNumber: "MFC01-PWS03", name: "Mill Feed Conveyor – Pull Wire Switch 3" },
              { assetNumber: "MFC01-PWS04", name: "Mill Feed Conveyor – Pull Wire Switch 4" },
              { assetNumber: "MFC01-BAS01", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 1" },
              { assetNumber: "MFC01-BAS02", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 2" },
              { assetNumber: "MFC01-BAS03", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 3" },
              { assetNumber: "MFC01-BAS04", name: "Mill Feed Conveyor – Belt Alignment Drift Switch 4" },
              { assetNumber: "MFC01-CHU01", name: "Mill Feed Conveyor – Discharge Chute" },
              { assetNumber: "MFC01-TX01", name: "Mill Feed Conveyor – Feed End Bearing Temp Transmitter" },
              { assetNumber: "MFC01-SEN01", name: "Mill Feed Conveyor – Feed End Bearing Temp Sensor 1" },
              { assetNumber: "MFC01-SEN02", name: "Mill Feed Conveyor – Feed End Bearing Temp Sensor 2" },
              { assetNumber: "MFC01-SEN03", name: "Mill Feed Conveyor – Feed End Bearing Temp Sensor 3" },
              { assetNumber: "MFC01-TX02", name: "Mill Feed Conveyor – Discharge End Bearing Temp Transmitter" },
              { assetNumber: "MFC01-SEN04", name: "Mill Feed Conveyor – Discharge End Bearing Temp Sensor 1" },
              { assetNumber: "MFC01-SEN05", name: "Mill Feed Conveyor – Discharge End Bearing Temp Sensor 2" },
              { assetNumber: "MFC01-SEN06", name: "Mill Feed Conveyor – Discharge End Bearing Temp Sensor 3" },
              { assetNumber: "MFC01-MCC02", name: "Mill Feed Conveyor – Field MCC" },
            ]
          },
          { 
            label: "CYFPA01 Primary Cyclone Feed Pump A", 
            equipment: [
              { 
                assetNumber: "CYFPA01", 
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
              { assetNumber: "CYFPA01-MTR01", name: "Primary Cyclone Feed Pump A – Motor" },
              { assetNumber: "CYFPA01-MCC01", name: "Primary Cyclone Feed Pump A – MCC Cell" },
              { assetNumber: "CYFPA01-LCS01", name: "Primary Cyclone Feed Pump A – LCS" },
            ]
          },
          { 
            label: "CYFPB01 Primary Cyclone Feed Pump B", 
            equipment: [
              { 
                assetNumber: "CYFPB01", 
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
              { assetNumber: "CYFPB01-MTR01", name: "Primary Cyclone Feed Pump B – Motor" },
              { assetNumber: "CYFPB01-MCC01", name: "Primary Cyclone Feed Pump B – MCC Cell" },
              { assetNumber: "CYFPB01-LCS01", name: "Primary Cyclone Feed Pump B – LCS" },
            ]
          },
          { 
            label: "PCFI01 Primary Cyclone Feed Instrumentation", 
            equipment: [
              { assetNumber: "PCFI01-VLV01", name: "Primary Cyclone Feed – TechTaylor Valve" },
              { assetNumber: "PCFI01-VLV02", name: "Primary Cyclone Feed – VFD Valve" },
              { assetNumber: "PCFI01-FM01", name: "Primary Cyclone Feed – Flow Meter" },
              { assetNumber: "PCFI01-DT01", name: "Primary Cyclone Feed – Density Transmitter" },
            ]
          },
        ],
      },
      {
        label: "Conveying",
        parentAssets: [
          { 
            label: "CV01 Transfer Conveyor", 
            equipment: [
              { assetNumber: "CV01", name: "Transfer Conveyor", pidTags: ["04-FE-101"] },
              { assetNumber: "CV01-MTR01", name: "Transfer Conveyor – Motor", pidTags: ["04-FE-101M"] },
              { assetNumber: "CV01-GBX01", name: "Transfer Conveyor – Gearbox", pidTags: ["04-FE-101GB"] },
              { assetNumber: "CV01-MCC01", name: "Transfer Conveyor – MCC Cell", pidTags: ["04-FE-101MC"] },
              { assetNumber: "CV01-LCS01", name: "Transfer Conveyor – Local Control Station", pidTags: ["04-FE-101LCS"] },
              { assetNumber: "CV01-PWS01", name: "Transfer Conveyor – Pull Wire Switch", pidTags: ["04-FE-101PWS"] },
              { assetNumber: "CV01-CHU01", name: "Transfer Conveyor – Discharge Chute", pidTags: ["04-CH-100"] },
            ]
          },
          { 
            label: "CV02 Ball Mill Scatts Conveyor", 
            equipment: [
              { assetNumber: "CV02", name: "Ball Mill Scatts Conveyor", pidTags: ["04-CV-011"] },
            ]
          },
        ],
      },
      {
        label: "Grinding",
        parentAssets: [
          { 
            label: "BM01 Primary Ball Mill", 
            equipment: [
              { assetNumber: "BM01", name: "Primary Ball Mill" },
              { assetNumber: "BM01-MTR01", name: "Primary Ball Mill – Main Motor" },
              { assetNumber: "BM01-GBX01", name: "Primary Ball Mill – Gear Reducer", 
                components: [
                  {
                    componentCode: "H1 SH 15B",
                    componentType: "Gear Reducer",
                    componentName: "Mill Main Gear Reducer",
                    manufacturer: "SEW-EURODRIVE",
                    model: "H1 SH 15B",
                    oilType: "VG320",
                    oilVolume: "190L",
                    inputSpeed: "1481 rpm",
                    outputSpeed: "259.61 rpm",
                    weight: "3317 kg"
                  }
                ]
              },
              { assetNumber: "BM01-PIN01", name: "Primary Ball Mill – Pinion" },
              { assetNumber: "BM01-GIR01", name: "Primary Ball Mill – Girth Gear" },
              { assetNumber: "BM01-TRN01", name: "Primary Ball Mill – Trunnion" },
              { assetNumber: "BM01-BRG01", name: "Primary Ball Mill – Feed End Bearing" },
              { assetNumber: "BM01-BRG02", name: "Primary Ball Mill – Discharge End Bearing" },
              { assetNumber: "BM01-SEN01", name: "Primary Ball Mill – Feed End Bearing Temp Sensor" },
              { assetNumber: "BM01-SEN02", name: "Primary Ball Mill – Discharge End Bearing Temp Sensor" },
              { assetNumber: "BM01-TX01", name: "Primary Ball Mill – Feed End Bearing Temp Transmitter" },
              { assetNumber: "BM01-TX02", name: "Primary Ball Mill – Discharge End Bearing Temp Transmitter" },
              { 
                assetNumber: "GRD-LP-LPUMP-D", 
                name: "Primary Ball Mill – Low Pressure Lube Pump (Duty)",
                components: [
                  {
                    componentCode: "WEG-LP-MTR-D",
                    componentType: "Motor",
                    componentName: "Low Pressure Lube Pump Motor (Duty)",
                    manufacturer: "WEG",
                    motorSpeed: "1450 rpm",
                    protection: "IP55",
                    voltage: "415V"
                  },
                  {
                    componentCode: "PARKER-LP-PMP-D",
                    componentType: "Pump",
                    componentName: "Low Pressure Lube Pump (Duty)",
                    manufacturer: "PARKER",
                    pumpFlow: "2.16 m³/hr @ 15 bar",
                    displacement: "28 cc/rev"
                  }
                ]
              },
              { 
                assetNumber: "GRD-LP-LPUMP-S", 
                name: "Primary Ball Mill – Low Pressure Lube Pump (Standby)",
                components: [
                  {
                    componentCode: "WEG-LP-MTR-S",
                    componentType: "Motor",
                    componentName: "Low Pressure Lube Pump Motor (Standby)",
                    manufacturer: "WEG",
                    motorSpeed: "1450 rpm",
                    protection: "IP55",
                    voltage: "415V"
                  },
                  {
                    componentCode: "PARKER-LP-PMP-S",
                    componentType: "Pump",
                    componentName: "Low Pressure Lube Pump (Standby)",
                    manufacturer: "PARKER",
                    pumpFlow: "2.16 m³/hr @ 15 bar",
                    displacement: "28 cc/rev"
                  }
                ]
              },
              { 
                assetNumber: "GRD-LP-HPUMP", 
                name: "Primary Ball Mill – High Pressure Lube Pump",
                components: [
                  {
                    componentCode: "WEG-HP-MTR",
                    componentType: "Motor",
                    componentName: "High Pressure Lube Pump Motor",
                    manufacturer: "WEG",
                    motorSpeed: "1450 rpm",
                    protection: "IP55",
                    voltage: "415V"
                  },
                  {
                    componentCode: "PARKER-HP-PMP",
                    componentType: "Pump",
                    componentName: "High Pressure Lube Pump",
                    manufacturer: "PARKER",
                    pumpFlow: "0.84 m³/hr @ 400 bar"
                  }
                ]
              },
              { 
                assetNumber: "GRD-BM-GBX", 
                name: "Primary Ball Mill – Gear Reducer",
                components: [
                  {
                    componentCode: "FLENDER-H1SH15B",
                    componentType: "Gearbox",
                    componentName: "Mill Main Gear Reducer",
                    manufacturer: "FLENDER",
                    model: "H1 SH 15B",
                    oilType: "VG320",
                    oilVolume: "190L"
                  }
                ]
              },
              { 
                assetNumber: "OCL01", 
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
                assetNumber: "OCL02", 
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
                assetNumber: "LBS01", 
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
              { assetNumber: "BM01-LUB03", name: "Primary Mill – Lube System Instruments" },
              { assetNumber: "BM01-TX03", name: "Mill Low Pressure – Lube Oil Pressure Transmitter" },
              { assetNumber: "BM01-TX04", name: "Mill Low Pressure – Lube Oil Flow Transmitter" },
              { assetNumber: "BM01-TX05", name: "Mill High Pressure – Lift Lube Oil Pressure Transmitter" },
              { assetNumber: "BM01-LUB04", name: "Mill High Pressure – Lift Lube Oil Flow" },
              { assetNumber: "BM01-TX06", name: "Mill High Pressure – Lift Lube Oil Flow Transmitter" },
              { assetNumber: "BM01-LUB05", name: "Mill Lube System – Oil Level" },
              { assetNumber: "BM01-LUB06", name: "Mill Lube System – Oil Temperature" },
              { assetNumber: "BM01-LUB08", name: "Primary Ball Mill – Girth Gear Lube Control Panel" },
              { assetNumber: "BM01-LUB09", name: "Primary Ball Mill – Lube System Filter A" },
              { assetNumber: "BM01-LUB10", name: "Primary Ball Mill – Lube System Filter B" },
              { assetNumber: "BM01-HOP01", name: "Primary Mill – Discharge Hopper" },
              { assetNumber: "MILL-MCC01", name: "Mill Area Field MCC" },
              { assetNumber: "HOIL01-HTR01", name: "Hydraulic Oil Heater" },
              { assetNumber: "HOIL01-FAN01", name: "Hydraulic Oil Cooling Fan" },
            ]
          },
          { 
            label: "GSPMP01 Grinding Sump", 
            equipment: [
              { 
                assetNumber: "GSPMP01-PMP01", 
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
              { assetNumber: "GSPMP01-MTR01", name: "Grinding Area Sump Pump – Motor" },
              { assetNumber: "GSPMP01-MCC01", name: "Grinding Area Sump Pump – MCC Cell" },
              { assetNumber: "GSPMP01-LCS01", name: "Grinding Area Sump Pump – LCS" },
            ] 
          },
        ],
      },
      {
        label: "Classification",
        parentAssets: [
          { 
            label: "CYC01 Cyclone Cluster", 
            equipment: [
              { assetNumber: "CYC01", name: "Primary Cyclone Cluster" },
              { 
                assetNumber: "CFP01-A", 
                name: "Cyclone Feed Pump – Duty",
                components: [
                  {
                    componentCode: "KTE50 W22M",
                    componentType: "Motor",
                    componentName: "Cyclone Feed Pump Motor – Duty",
                    manufacturer: "WEG",
                    model: "KTE50 W22M"
                  },
                  {
                    componentCode: "8/6 AH",
                    componentType: "Pump Wet End",
                    componentName: "Cyclone Feed Pump Wet End – Duty",
                    manufacturer: "AUSTRAL",
                    model: "8/6 AH Metal"
                  },
                  {
                    componentCode: "SPC 2360 x 4",
                    componentType: "Belt",
                    componentName: "Cyclone Feed Pump Belt – Duty",
                    manufacturer: "N/A",
                    model: "SPC 2360 x 4"
                  }
                ]
              },
              { 
                assetNumber: "CFP01-B", 
                name: "Cyclone Feed Pump – Standby",
                components: [
                  {
                    componentCode: "KTE50 W22M",
                    componentType: "Motor",
                    componentName: "Cyclone Feed Pump Motor – Standby",
                    manufacturer: "WEG",
                    model: "KTE50 W22M"
                  },
                  {
                    componentCode: "8/6 AH",
                    componentType: "Pump Wet End",
                    componentName: "Cyclone Feed Pump Wet End – Standby",
                    manufacturer: "AUSTRAL",
                    model: "8/6 AH Metal"
                  },
                  {
                    componentCode: "SPC 2360 x 4",
                    componentType: "Belt",
                    componentName: "Cyclone Feed Pump Belt – Standby",
                    manufacturer: "N/A",
                    model: "SPC 2360 x 4"
                  }
                ]
              },
              { 
                assetNumber: "CYC01-1", 
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
                assetNumber: "CYC01-2", 
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
                assetNumber: "CYC01-3", 
                name: "Primary Cyclone 3 (Standby)",
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
              { assetNumber: "CYC01-INS01", name: "Primary Cyclone Cluster – Instruments" },
              { assetNumber: "CYC01-TX01", name: "Primary Cyclone – Pressure Transmitter" },
              { assetNumber: "CYC01-PG01", name: "Primary Cyclone – Pressure Gauge" },
              { assetNumber: "CYC01-SPL01", name: "Primary Cyclone Underflow Splitter Box" },
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
            label: "SCN01 Gravity Concentrator", 
            equipment: [
              { 
                assetNumber: "SCN01", 
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
                assetNumber: "KNC01", 
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
                assetNumber: "FLT01", 
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
                assetNumber: "SHK01", 
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
                assetNumber: "PMP05", 
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
            label: "GEW01 Gravity Electrowinning", 
            equipment: [
              { assetNumber: "GEW01", name: "Gravity Electrowinning" },
              { assetNumber: "GEW01-FAN01", name: "Gravity Electrowinning – Fan" },
            ] 
          },
          { 
            label: "TRSCN01 Trash Screen", 
            equipment: [
              { 
                assetNumber: "TRSCN01", 
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
              { assetNumber: "TRSCN01-EXC01", name: "Trash Screen – Exciter" },
              { assetNumber: "TRSCN01-MCC01", name: "Trash Screen – MCC Cell" },
            ] 
          },
        ],
      },
      {
        label: "CIP",
        parentAssets: [
          { 
            label: "CIP-TK01 CIP Tanks", 
            equipment: [
              { assetNumber: "CIP-TK01", name: "CIP Leach Tank 1" },
              { assetNumber: "CIP-SHW01", name: "CIP Tails Area Safety Shower" },
              { 
                assetNumber: "AGT01", 
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
              { assetNumber: "CIP-TK01-MTR01", name: "CIP Leach Tank 1 – Agitator Motor" },
              { assetNumber: "CIP-TK01-MCC01", name: "CIP Leach Tank 1 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK01-GBX01", name: "CIP Leach Tank 1 – Agitator Gear Box" },
              { assetNumber: "CIP-TK01-LCS01", name: "CIP Leach Tank 1 – Agitator LCS" },
              { assetNumber: "CIP-NZL01", name: "Leach Tank 1 – Air Sparge Nozzles" },
              { assetNumber: "CIP-ALF01", name: "Carbon Transfer Air Lift 1" },
              { assetNumber: "CIP-TK02", name: "CIP Leach Tank 2" },
              { 
                assetNumber: "AGT02", 
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
              { assetNumber: "CIP-TK02-MTR01", name: "CIP Leach Tank 2 – Agitator Motor" },
              { assetNumber: "CIP-TK02-MCC01", name: "CIP Leach Tank 2 – Agitator MCC Cell" },
              { assetNumber: "CIP-TK02-GBX01", name: "CIP Leach Tank 2 – Agitator Gear Box" },
              { assetNumber: "CIP-TK02-LCS01", name: "CIP Leach Tank 2 – Agitator LCS" },
              { assetNumber: "CIP-NZL02", name: "Leach Tank 2 – Air Sparge Nozzles" },
              { assetNumber: "CIP-ALF02", name: "Carbon Transfer Air Lift 2" },
              { assetNumber: "CIP-TK03", name: "CIP Tank 3" },
              { assetNumber: "CIP-TK03-AGT01", name: "CIP Tank 3 – Agitator" },
              { assetNumber: "CIP-TK03-MTR01", name: "CIP Tank 3 – Agitator Motor" },
              { assetNumber: "CIP-TK03-GBX01", name: "CIP Tank 3 – Agitator Gear Box" },
              { assetNumber: "CIP-TK03-LCS01", name: "CIP Tank 3 – Agitator LCS" },
              { assetNumber: "CIP-TK03-MCC01", name: "CIP Tank 3 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF03", name: "Carbon Transfer Air Lift 3" },
              { assetNumber: "CIP-TK04", name: "CIP Tank 4" },
              { assetNumber: "CIP-TK04-AGT01", name: "CIP Tank 4 – Agitator" },
              { assetNumber: "CIP-TK04-MTR01", name: "CIP Tank 4 – Agitator Motor" },
              { assetNumber: "CIP-TK04-GBX01", name: "CIP Tank 4 – Agitator Gear Box" },
              { assetNumber: "CIP-TK04-LCS01", name: "CIP Tank 4 – Agitator LCS" },
              { assetNumber: "CIP-TK04-MCC01", name: "CIP Tank 4 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF04", name: "Carbon Transfer Air Lift 4" },
              { assetNumber: "CIP-TK05", name: "CIP Tank 5" },
              { assetNumber: "CIP-TK05-AGT01", name: "CIP Tank 5 – Agitator" },
              { assetNumber: "CIP-TK05-MTR01", name: "CIP Tank 5 – Agitator Motor" },
              { assetNumber: "CIP-TK05-GBX01", name: "CIP Tank 5 – Agitator Gear Box" },
              { assetNumber: "CIP-TK05-LCS01", name: "CIP Tank 5 – Agitator LCS" },
              { assetNumber: "CIP-TK05-MCC01", name: "CIP Tank 5 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF05", name: "Carbon Transfer Air Lift 5" },
              { assetNumber: "CIP-TK06", name: "CIP Tank 6" },
              { assetNumber: "CIP-TK06-AGT01", name: "CIP Tank 6 – Agitator" },
              { assetNumber: "CIP-TK06-MTR01", name: "CIP Tank 6 – Agitator Motor" },
              { assetNumber: "CIP-TK06-GBX01", name: "CIP Tank 6 – Agitator Gear Box" },
              { assetNumber: "CIP-TK06-LCS01", name: "CIP Tank 6 – Agitator LCS" },
              { assetNumber: "CIP-TK06-MCC01", name: "CIP Tank 6 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF06", name: "Carbon Transfer Air Lift 6" },
              { assetNumber: "CIP-TK07", name: "CIP Tank 7" },
              { assetNumber: "CIP-TK07-AGT01", name: "CIP Tank 7 – Agitator" },
              { assetNumber: "CIP-TK07-MTR01", name: "CIP Tank 7 – Agitator Motor" },
              { assetNumber: "CIP-TK07-GBX01", name: "CIP Tank 7 – Agitator Gear Box" },
              { assetNumber: "CIP-TK07-LCS01", name: "CIP Tank 7 – Agitator LCS" },
              { assetNumber: "CIP-TK07-MCC01", name: "CIP Tank 7 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF07", name: "Carbon Transfer Air Lift 7" },
              { assetNumber: "CIP-TK08", name: "CIP Tank 8" },
              { assetNumber: "CIP-TK08-AGT01", name: "CIP Tank 8 – Agitator" },
              { assetNumber: "CIP-TK08-MTR01", name: "CIP Tank 8 – Agitator Motor" },
              { assetNumber: "CIP-TK08-GBX01", name: "CIP Tank 8 – Agitator Gear Box" },
              { assetNumber: "CIP-TK08-LCS01", name: "CIP Tank 8 – Agitator LCS" },
              { assetNumber: "CIP-TK08-MCC01", name: "CIP Tank 8 – Agitator MCC Cell" },
              { assetNumber: "CIP-ALF08", name: "Carbon Transfer Air Lift 8" },
              { 
                assetNumber: "CIP-SUMP-PMP-D", 
                name: "CIP Area Sump Pump (Duty)",
                components: [
                  {
                    componentCode: "WEG-CIP-MTR-D",
                    componentType: "Motor",
                    componentName: "CIP Area Sump Pump Motor (Duty)",
                    manufacturer: "WEG"
                  },
                  {
                    componentCode: "65QV-SPR1200",
                    componentType: "Pump",
                    componentName: "CIP Area Sump Pump (Duty)",
                    manufacturer: "WARMAN",
                    model: "65QV-SPR1200 (Rubber)"
                  }
                ]
              },
              { 
                assetNumber: "CIP-SUMP-PMP-S", 
                name: "CIP Area Sump Pump (Standby)",
                components: [
                  {
                    componentCode: "WEG-CIP-MTR-S",
                    componentType: "Motor",
                    componentName: "CIP Area Sump Pump Motor (Standby)",
                    manufacturer: "WEG"
                  },
                  {
                    componentCode: "65QV-SPR1200-S",
                    componentType: "Pump",
                    componentName: "CIP Area Sump Pump (Standby)",
                    manufacturer: "WARMAN",
                    model: "65QV-SPR1200 (Rubber)"
                  }
                ]
              },
              { 
                assetNumber: "CIP-SCN-INT", 
                name: "Intertank Screen",
                components: [
                  {
                    componentCode: "ALLOYTECH-SCR",
                    componentType: "Screen",
                    componentName: "Intertank Screen",
                    manufacturer: "ALLOYTECH"
                  },
                  {
                    componentCode: "BONFIGLIOLI-EXC",
                    componentType: "Exciter",
                    componentName: "Intertank Screen Exciter",
                    manufacturer: "BONFIGLIOLI"
                  }
                ]
              },
              { 
                assetNumber: "SCN03", 
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
                assetNumber: "SCN04", 
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
            label: "CPTS01 CIP Feed Trash Screen", 
            equipment: [
              { assetNumber: "CPTS01", name: "CIP Feed Trash Screen" },
              { assetNumber: "CPTS01-FBX01", name: "CIP Feed Trash Screen – Feed Box" },
              { assetNumber: "CPTS01-EXC01", name: "CIP Feed Trash Screen – Exciter A" },
              { assetNumber: "CPTS01-LCS01", name: "CIP Feed Trash Screen – Exciter A LCS" },
              { assetNumber: "CPTS01-MCC01", name: "CIP Feed Trash Screen – Exciter A MCC Cell" },
              { assetNumber: "CPTS01-EXC02", name: "CIP Feed Trash Screen – Exciter B" },
              { assetNumber: "CPTS01-LCS02", name: "CIP Feed Trash Screen – Exciter B LCS" },
              { assetNumber: "CPTS01-MCC02", name: "CIP Feed Trash Screen – Exciter B MCC Cell" },
              { assetNumber: "CPTS01-SPR01", name: "CIP Feed Trash Screen – Spray Bars" },
              { assetNumber: "CPTS01-CHU01", name: "CIP Feed Trash Screen – Oversize Chute" },
            ] 
          },
        ],
      },
      {
        label: "Elution",
        parentAssets: [
          { 
            label: "COL01 Elution Column", 
            equipment: [
              { 
                assetNumber: "COL01", 
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
                assetNumber: "FLT02", 
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
                assetNumber: "PMP10", 
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
                assetNumber: "PMP11", 
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
                assetNumber: "COL02", 
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
                assetNumber: "FLT03", 
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
                assetNumber: "PMP12", 
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
              { 
                assetNumber: "PMP13", 
                name: "Antiscalant Dosing Pump – Elution Raw Water",
                components: [
                  {
                    componentCode: "DDA 7.5-16",
                    componentType: "Dosing Pump",
                    componentName: "Antiscalant Dosing Pump",
                    manufacturer: "GRUNDFOS",
                    model: "DDA 7.5-16"
                  }
                ]
              },
              { 
                assetNumber: "HTR01", 
                name: "Elution Heater",
                components: [
                  {
                    componentCode: "500KW-SS",
                    componentType: "Direct Heater",
                    componentName: "Elution Heater Unit",
                    manufacturer: "N/A",
                    model: "500kW SS Coil Direct Heater"
                  }
                ]
              },
              { 
                assetNumber: "BRN01", 
                name: "Elution Heater Burner",
                components: [
                  {
                    componentCode: "GX 5/2 TL",
                    componentType: "Burner",
                    componentName: "Elution Heater Burner",
                    manufacturer: "FBR",
                    model: "GX 5/2 TL"
                  }
                ]
              },
              { 
                assetNumber: "HEX01", 
                name: "Elution Recovery Heat Exchanger",
                components: [
                  {
                    componentCode: "P&F-HEX",
                    componentType: "Heat Exchanger",
                    componentName: "Elution Recovery Heat Exchanger",
                    manufacturer: "N/A",
                    model: "Plate & Frame Type"
                  }
                ]
              },
              { assetNumber: "FPT01", name: "Elution Flashpot" },
              { 
                assetNumber: "PMP14", 
                name: "Eluate Pump",
                components: [
                  {
                    componentCode: "CRI20-07",
                    componentType: "Pump",
                    componentName: "Eluate Pump",
                    manufacturer: "GRUNDFOS",
                    model: "CRI20-07"
                  }
                ]
              },
            ] 
          },
          { 
            label: "ELUT01 Eluate System", 
            equipment: [
              { assetNumber: "ELUT01-TK01", name: "Eluate Tank" },
              { assetNumber: "ELUT01-MTR01", name: "Eluate Pump – Motor" },
              { assetNumber: "ELUT01-MCC01", name: "Eluate Pump – MCC Cell" },
              { assetNumber: "ELUT01-LCS01", name: "Eluate Pump – LCS" },
              { assetNumber: "ELUT01-SWT01", name: "Eluate Pump Discharge High High Pressure Switch" },
              { assetNumber: "ELUT01-INS01", name: "Eluate Pump Discharge Pressure Gauge" },
              { assetNumber: "ELUT01-INS02", name: "Eluate Pump Discharge Temperature Gauge" },
              { assetNumber: "ELUT01-SEN01", name: "Eluate Tank Cyanide Feed Flow Sensor" },
              { assetNumber: "ELUT01-VLV01", name: "Eluate Tank Cyanide Feed Solenoid Valve" },
              { assetNumber: "ELUT01-SEN02", name: "Eluate Tank Level Sensor" },
            ] 
          },
          { 
            label: "DSL01 Diesel System", 
            equipment: [
              { assetNumber: "DSL01-PMP01", name: "Diesel Pump" },
              { assetNumber: "DSL01-TK01", name: "Diesel Day Tank" },
              { assetNumber: "DSL01-SVC01", name: "Diesel Service Truck" },
            ] 
          },
        ],
      },
      {
        label: "Carbon Regeneration",
        parentAssets: [
          { 
            label: "CDSCN01 Barren Carbon Dewatering Screen", 
            equipment: [
              { assetNumber: "CDSCN01", name: "Barren Carbon Dewatering Screen" },
              { assetNumber: "CDSCN01-EXC01", name: "Barren Carbon Dewatering Screen Exciter" },
              { assetNumber: "CDSCN01-MCC01", name: "Barren Carbon Dewatering Screen – MCC Cell" },
              { assetNumber: "CDSCN01-LCS01", name: "Barren Carbon Dewatering Screen – LCS" },
            ] 
          },
          { 
            label: "KLNHP01 Regen Kiln Feed Hopper", 
            equipment: [
              { assetNumber: "KLNHP01", name: "Regen Kiln Feed Hopper" },
              { assetNumber: "KLNHP01-FDR01", name: "Regen Kiln Feed Hopper – Feeder" },
              { assetNumber: "KLNHP01-MTR01", name: "Regen Kiln Feed Hopper – Motor" },
              { assetNumber: "KLNHP01-SEN01", name: "Regen Kiln Feed Screw Inlet Level Sensor" },
            ]
          },
          { 
            label: "KLN01 Regen Kiln", 
            equipment: [
              { assetNumber: "KLN01", name: "Regen Kiln – Kiln" },
              { 
                assetNumber: "SCRF01", 
                name: "Regen Kiln Screw Feeder",
                components: [
                  {
                    componentCode: "WEG-SCRF",
                    componentType: "Motor",
                    componentName: "Regen Kiln Screw Feeder Motor",
                    manufacturer: "WEG"
                  },
                  {
                    componentCode: "SCRF-100",
                    componentType: "Screw Feeder",
                    componentName: "Regen Kiln Screw Feeder",
                    manufacturer: "N/A",
                    pumpFlow: "100 kg/hr capacity"
                  }
                ]
              },
              { assetNumber: "KLN01-MTR01", name: "Regen Kiln – Drive Motor" },
              { assetNumber: "KLN01-VSD01", name: "Regen Kiln – VSD" },
              { assetNumber: "KLN01-GBX01", name: "Regen Kiln – Gearbox" },
              { assetNumber: "KLN01-FAN01", name: "Regen Kiln – Combustion Fan" },
              { assetNumber: "KLN01-BRN01", name: "Regen Kiln Burners Zone 1" },
              { assetNumber: "KLN01-BRN02", name: "Regen Kiln Burners Zone 2" },
              { assetNumber: "KLN01-BRN03", name: "Regen Kiln Burners Zone 3" },
              { assetNumber: "KLN01-INS01", name: "Regen Kiln Zone 1 Temperature Gauge 1" },
              { assetNumber: "KLN01-INS02", name: "Regen Kiln Zone 1 Temperature Gauge 2" },
              { assetNumber: "KLN01-INS03", name: "Regen Kiln Zone 2 Temperature Gauge 1" },
              { assetNumber: "KLN01-INS04", name: "Regen Kiln Zone 2 Temperature Gauge 2" },
              { assetNumber: "KLN01-INS05", name: "Regen Kiln Zone 3 Temperature Gauge 1" },
              { assetNumber: "KLN01-INS06", name: "Regen Kiln Zone 3 Temperature Gauge 2" },
              { assetNumber: "KLN01-INS07", name: "Regen Kiln Feed End Temperature Gauge" },
              { assetNumber: "KLN01-SEN01", name: "Regen Kiln Discharge Temperature Sensor" },
              { assetNumber: "KLN01-DRN01", name: "Regen Kiln Drain Water" },
              { assetNumber: "KLN01-FLU01", name: "Regen Kiln Discharge Flue" },
              { assetNumber: "KLN01-FLT01", name: "Regen Kiln Return Filters" },
            ]
          },
          { 
            label: "CREG01 Carbon Quench System", 
            equipment: [
              { assetNumber: "CREG01-HOP01", name: "Regenerated Carbon Quench Hopper" },
              { assetNumber: "CREG01-SWT01", name: "Regenerated Carbon Quench Hopper Low Low Level Switch" },
              { assetNumber: "CSZS01", name: "Carbon Sizing Screen" },
              { assetNumber: "CSZS01-EXC01", name: "Carbon Sizing Screen Exciter" },
            ] 
          },
          { 
            label: "RCTR01 Regenerated Carbon Transfer", 
            equipment: [
              { assetNumber: "RCTR01-ALF01", name: "Carbon Transfer Air Lift" },
              { assetNumber: "RCTR01-PMP01", name: "Carbon Transfer Pump" },
              { assetNumber: "RCTR01-MTR01", name: "Carbon Transfer Pump – Motor" },
              { assetNumber: "RCTR01-MCC01", name: "Carbon Transfer Pump – MCC Cell" },
              { assetNumber: "RCTR01-LCS01", name: "Carbon Transfer Pump – LCS" },
            ] 
          },
          { 
            label: "RSMP01 Regen Area Sump", 
            equipment: [
              { assetNumber: "RSMP01-PMP01", name: "Regen Area Sump Pump" },
              { assetNumber: "RSMP01-MTR01", name: "Regen Area Sump Pump – Motor" },
            ] 
          },
        ],
      },
      {
        label: "Gold Room",
        parentAssets: [
          { 
            label: "EWCL01 Electrowinning Cell", 
            equipment: [
              { assetNumber: "EWCL01", name: "Electrowinning Cell" },
              { 
                assetNumber: "REC01", 
                name: "Electrowinning Cell Rectifier",
                components: [
                  {
                    componentCode: "pe3000-6",
                    componentType: "Rectifier",
                    componentName: "Electrowinning Cell Rectifier",
                    manufacturer: "N/A",
                    model: "pe3000-6"
                  }
                ]
              },
              { 
                assetNumber: "FAN01", 
                name: "Electrowinning Fume Extraction Fan",
                components: [
                  {
                    componentCode: "CHEM160",
                    componentType: "Extraction Fan",
                    componentName: "Electrowinning Fume Extraction Fan",
                    manufacturer: "N/A",
                    model: "CHEM160"
                  }
                ]
              },
              { assetNumber: "EWCL01-MNR01", name: "Electrowinning Cell – Monorail" },
              { assetNumber: "EWCL01-TK01", name: "Electrowinning Cell – Solution Tank" },
              { assetNumber: "EWCL01-PMP01", name: "Electrowinning Cell – Feed Pump" },
              { assetNumber: "EWCL01-MTR01", name: "Electrowinning Cell – Feed Pump Motor" },
              { assetNumber: "EWCL01-MCC01", name: "Electrowinning Cell – Feed Pump MCC Cell" },
              { assetNumber: "EWCL01-LCS01", name: "Electrowinning Cell – Feed Pump LCS" },
              { assetNumber: "EWCL01-TG01", name: "Electrowinning Cell – Flashpot Inlet Temperature Gauge" },
              { assetNumber: "EWCL01-LSH01", name: "Electrowinning Cell – Flashpot High High Level Switch" },
            ]
          },
          { 
            label: "GR-SHW01 Gold Room Safety Shower", 
            equipment: [
              { assetNumber: "GR-SHW01", name: "Gold Room Safety Shower" },
            ] 
          },
          { 
            label: "WSH01 Cathode Washdown System", 
            equipment: [
              { assetNumber: "WSH01", name: "High Pressure Cathode Washer" },
              { assetNumber: "CWSH01-BOX01", name: "Cathode Wash Box" },
              { 
                assetNumber: "PMP15", 
                name: "Cathode Wash Sludge Pump",
                components: [
                  {
                    componentCode: "VA25",
                    componentType: "Pump",
                    componentName: "Cathode Wash Sludge Pump",
                    manufacturer: "VerderAir",
                    model: "VA25"
                  }
                ]
              },
              { assetNumber: "PMP16", name: "Electrowinning Cell Sludge Pump" },
              { assetNumber: "CWSH01-MTR01", name: "Cathode Wash Sludge Pump – Motor" },
              { assetNumber: "CWSH01-MCC01", name: "Cathode Wash Sludge Pump – MCC Cell" },
              { assetNumber: "CWSH01-LCS01", name: "Cathode Wash Sludge Pump – LCS" },
              { assetNumber: "CWSH01-WND01", name: "Cathode Winder" },
              { assetNumber: "CWSH01-FP01", name: "Cathode Sludge Filter Press" },
            ] 
          },
          { 
            label: "CALC01 Calcine System", 
            equipment: [
              { assetNumber: "CALC01", name: "Calcine Oven" },
              { assetNumber: "CALC01-HOOD01", name: "Calcine Oven Hood" },
              { assetNumber: "CALC01-FAN01", name: "Calcine Oven Extraction Fan" },
            ] 
          },
          { 
            label: "GR-SCL-01 Gold Room", 
            equipment: [
              { 
                assetNumber: "GR-SCL-01", 
                name: "Goldroom Scale"
              },
              { assetNumber: "BULL01-BEN01", name: "Gold Bullion Scale Bench" },
              { assetNumber: "GR-BEN01", name: "Gold Room Work Bench" },
              { 
                assetNumber: "GR-SAFE-01", 
                name: "Goldroom Bullion Safe"
              },
            ] 
          },
          { 
            label: "GR-FRN-01 Smelting Furnace", 
            equipment: [
              { 
                assetNumber: "MIX01", 
                name: "Flux Mixer",
                components: [
                  {
                    componentCode: "WM2.2MIB1",
                    componentType: "Mixer",
                    componentName: "Flux Mixer",
                    manufacturer: "N/A",
                    model: "WM2.2MIB1"
                  }
                ]
              },
              { 
                assetNumber: "GR-FRN-01", 
                name: "Goldroom Barring Furnace",
                components: [
                  {
                    componentCode: "A150",
                    componentType: "Furnace",
                    componentName: "Gold Barring Furnace",
                    manufacturer: "COMO",
                    model: "A150"
                  },
                  {
                    componentCode: "G2.22 TC",
                    componentType: "Burner",
                    componentName: "Gold Furnace Burner",
                    manufacturer: "FBR",
                    model: "G2.22 TC"
                  }
                ]
              },
              { 
                assetNumber: "FAN02", 
                name: "Gold Room Fume Extraction Fan",
                components: [
                  {
                    componentCode: "TGAss-779",
                    componentType: "Extraction Fan",
                    componentName: "Gold Room Fume Extraction Fan",
                    manufacturer: "N/A",
                    model: "TGAss-779"
                  }
                ]
              },
              { assetNumber: "SMLT01-HOOD01", name: "Barring Furnace Hood" },
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
            label: "THK01 Thickener", 
            equipment: [
              { assetNumber: "THK01", name: "Tails Thickener" },
              { assetNumber: "THK01-PIPE01", name: "Tails Thickener – Piping and Valves" },
              { assetNumber: "THK01-MNR01", name: "Thickener Monorail" },
              { assetNumber: "TAILHOP01", name: "CIP Tailings Hopper" },
              { assetNumber: "TAILHOP01-LT01", name: "CIP Tailings Hopper – Level Transmitter" },
              { assetNumber: "THK01-FM01", name: "Tails Thickener – Flow Meter" },
              { 
                assetNumber: "THK01-HYD01", 
                name: "Tails Thickener – Hydraulic Pack",
                components: [
                  {
                    componentCode: "HPU-01",
                    componentType: "Hydraulic Power Unit",
                    componentName: "Hydraulic Power Unit",
                    manufacturer: "PARKER",
                    model: "AEU8-4P-11KW FR160M",
                    pumpRef: "Rake Drive Pump: PVP23369R29A4, Rake Lift Pump: PGP505A0040CA1H2NE5E3B1B1"
                  }
                ]
              },
              { assetNumber: "THK01-PG01", name: "Tails Thickener – Hydraulic Pack Pressure Gauge 1" },
              { assetNumber: "THK01-PG02", name: "Tails Thickener – Hydraulic Pack Pressure Gauge 2" },
              { assetNumber: "THK01-PNL01", name: "Tails Thickener – Flocc Panel 1" },
              { assetNumber: "THK01-PNL02", name: "Tails Thickener – Flocc Panel 2" },
              { assetNumber: "THK01-PNL03", name: "Tails Thickener – Clarometer Panel" },
              { assetNumber: "THK01-MCC01", name: "Tails Thickener – Field MCC" },
            ]
          },
          { 
            label: "THKUFP-A Thickener Underflow Pump", 
            equipment: [
              { 
                assetNumber: "CIPSMP01", 
                name: "CIP Tails Area Sump Pump",
                components: [
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump",
                    componentName: "Pump",
                    manufacturer: "WARMAN",
                    model: "65QV-SPG (Metal)"
                  }
                ]
              },
              { assetNumber: "CIPSMP01-MTR01", name: "CIP Tails Area Sump Pump – Motor" },
              { assetNumber: "CIPSMP01-MCC01", name: "CIP Tails Area Sump Pump – MCC Cell" },
              { assetNumber: "CIPSMP01-LCS01", name: "CIP Tails Area Sump Pump – LCS" },
              { assetNumber: "CIPPMP-A", name: "CIP Tailings Pump A" },
              { assetNumber: "CIPPMP-A-MTR01", name: "CIP Tailings Pump A – Motor" },
              { assetNumber: "CIPPMP-A-MCC01", name: "CIP Tailings Pump A – MCC Cell" },
              { assetNumber: "CIPPMP-A-LCS01", name: "CIP Tailings Pump A – LCS" },
              { assetNumber: "CIPPMP-A-VSD01", name: "CIP Tailings Pump A – VSD" },
              { assetNumber: "CIPPMP-B", name: "CIP Tailings Pump B" },
              { assetNumber: "CIPPMP-B-MTR01", name: "CIP Tailings Pump B – Motor" },
              { assetNumber: "CIPPMP-B-MCC01", name: "CIP Tailings Pump B – MCC Cell" },
              { assetNumber: "CIPPMP-B-LCS01", name: "CIP Tailings Pump B – LCS" },
              { assetNumber: "CIPPMP-B-VSD01", name: "CIP Tailings Pump B – VSD" },
              { 
                assetNumber: "THKUFP-A", 
                name: "Thickener Underflow Pump A",
                components: [
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump",
                    componentName: "Pump",
                    manufacturer: "WARMAN",
                    model: "75kW / 4P / 1485RPM",
                    displacement: "Belt: SPC 2360 x 5"
                  }
                ]
              },
              { assetNumber: "THKUFP-A-MTR01", name: "Thickener Underflow Pump A – Motor" },
              { assetNumber: "THKUFP-A-MCC01", name: "Thickener Underflow Pump A – MCC Cell" },
              { assetNumber: "THKUFP-A-LCS01", name: "Thickener Underflow Pump A – LCS" },
              { assetNumber: "THKUFP-A-VSD01", name: "Thickener Underflow Pump A – VSD" },
              { 
                assetNumber: "THKUFP-B", 
                name: "Thickener Underflow Pump B",
                components: [
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump",
                    componentName: "Pump",
                    manufacturer: "WARMAN",
                    model: "75kW / 4P / 1485RPM",
                    displacement: "Belt: SPC 2360 x 5"
                  }
                ]
              },
              { assetNumber: "THKUFP-B-MTR01", name: "Thickener Underflow Pump B – Motor" },
              { assetNumber: "THKUFP-B-MCC01", name: "Thickener Underflow Pump B – MCC Cell" },
              { assetNumber: "THKUFP-B-LCS01", name: "Thickener Underflow Pump B – LCS" },
              { assetNumber: "THKUFP-B-VSD01", name: "Thickener Underflow Pump B – VSD" },
            ]
          },
        ],
      },
      {
        label: "Filtering",
        parentAssets: [
          { 
            label: "FP01 Filter Press", 
            equipment: [
              { assetNumber: "FP01", name: "Filter Press" },
              { assetNumber: "FP01-MTR01", name: "Filter Press – HPU Motor" },
              { assetNumber: "FP01-MCC01", name: "Filter Press – HPU MCC Cell" },
              { assetNumber: "FP01-LCS01", name: "Filter Press – HPU LCS" },
              { assetNumber: "FP01-HPU01", name: "Filter Press – Hydraulic Power Unit" },
              { assetNumber: "FP01-AGT01", name: "Filter Press – Slurry Mixer" },
              { assetNumber: "FP01-CYL01", name: "Filter Press – Main Cylinder" },
              { assetNumber: "FP01-TRAY01", name: "Filter Press – Drip Tray" },
              { assetNumber: "FP01-CLH01", name: "Filter Press – Cloth Hanger" },
              { assetNumber: "FP01-FRM01", name: "Filter Press – Frame 1" },
              { assetNumber: "FP01-FRM02", name: "Filter Press – Frame 2" },
              { assetNumber: "FP01-FRM03", name: "Filter Press – Frame 3" },
              { assetNumber: "FP01-CHN01", name: "Filter Press – Chain Assembly" },
            ]
          },
          { 
            label: "FILT01 Filtrate Pump", 
            equipment: [
              { assetNumber: "FILT01-PMP01", name: "Filtrate Pump Duty" },
              { assetNumber: "FILT01-MTR01", name: "Filtrate Pump Duty – Motor" },
              { assetNumber: "FILT01-MCC01", name: "Filtrate Pump Duty – MCC Cell" },
              { assetNumber: "FILT01-LCS01", name: "Filtrate Pump Duty – LCS" },
              { assetNumber: "FILT01-PMP02", name: "Filtrate Pump Standby" },
              { assetNumber: "FILT01-MTR02", name: "Filtrate Pump Standby – Motor" },
              { assetNumber: "FILT01-MCC02", name: "Filtrate Pump Standby – MCC Cell" },
              { assetNumber: "FILT01-LCS02", name: "Filtrate Pump Standby – LCS" },
            ]
          },
          { 
            label: "FFD01 Filter Feed Pump", 
            equipment: [
              { 
                assetNumber: "FFD01-PMP01", 
                name: "Filter Feed Pump Duty",
                components: [
                  {
                    componentCode: "MTR-01",
                    componentType: "Motor",
                    componentName: "Motor",
                    manufacturer: "ELVEM",
                    model: "280M4"
                  },
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump Assembly",
                    componentName: "Pump Assembly",
                    manufacturer: "ALFA POMPE",
                    model: "PSH2100 V/A/A400 (DLT1050-2H)",
                    displacement: "Bearings: 6218 C3 / 29418-E1-XL / NU2317-E-XL-TVP2 | Lube: Oil bath"
                  }
                ]
              },
              { assetNumber: "FFD01-MTR01", name: "Filter Feed Pump Duty – Motor" },
              { assetNumber: "FFD01-MCC01", name: "Filter Feed Pump Duty – MCC Cell" },
              { assetNumber: "FFD01-LCS01", name: "Filter Feed Pump Duty – LCS" },
              { assetNumber: "FFD01-VSD01", name: "Filter Feed Pump Duty – VSD" },
              { 
                assetNumber: "FFD01-PMP02", 
                name: "Filter Feed Pump Standby",
                components: [
                  {
                    componentCode: "MTR-01",
                    componentType: "Motor",
                    componentName: "Motor",
                    manufacturer: "ELVEM",
                    model: "280M4"
                  },
                  {
                    componentCode: "PMP-01",
                    componentType: "Pump Assembly",
                    componentName: "Pump Assembly",
                    manufacturer: "ALFA POMPE",
                    model: "PSH2100 V/A/A400 (DLT1050-2H)"
                  }
                ]
              },
              { assetNumber: "FFD01-MTR02", name: "Filter Feed Pump Standby – Motor" },
              { assetNumber: "FFD01-MCC02", name: "Filter Feed Pump Standby – MCC Cell" },
              { assetNumber: "FFD01-LCS02", name: "Filter Feed Pump Standby – LCS" },
              { assetNumber: "FFD01-VSD02", name: "Filter Feed Pump Standby – VSD" },
            ]
          },
          { 
            label: "TC01 Tailings Conveyor", 
            equipment: [
              { 
                assetNumber: "TC01", 
                name: "Tailings Conveyor",
                components: [
                  {
                    componentCode: "BLT-01",
                    componentType: "Conveyor Belt",
                    componentName: "Conveyor Belt",
                    manufacturer: "N/A",
                    model: "1400 x 16000"
                  },
                  {
                    componentCode: "MTR-01",
                    componentType: "Drive Motor",
                    componentName: "Drive Motor",
                    manufacturer: "N/A",
                    voltage: "15 kW"
                  },
                  {
                    componentCode: "SFT-01",
                    componentType: "Safety Devices",
                    componentName: "Safety Devices",
                    manufacturer: "N/A",
                    displacement: "Rope safety switches both sides, Scraper belt"
                  }
                ]
              },
              { assetNumber: "TC01-MTR01", name: "Tailings Conveyor – Motor" },
              { assetNumber: "TC01-GBX01", name: "Tailings Conveyor – Gearbox" },
              { assetNumber: "TC01-MCC01", name: "Tailings Conveyor – MCC Cell" },
              { assetNumber: "TC01-LCS01", name: "Tailings Conveyor – LCS" },
              { assetNumber: "TC01-PWS01", name: "Tailings Conveyor – Pull Wire Switch 1" },
              { assetNumber: "TC01-PWS02", name: "Tailings Conveyor – Pull Wire Switch 2" },
              { assetNumber: "TC01-BAS01", name: "Tailings Conveyor – Belt Alignment Drift Switch 1" },
              { assetNumber: "TC01-BAS02", name: "Tailings Conveyor – Belt Alignment Drift Switch 2" },
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
            label: "WSHP01 Workshop", 
            equipment: [
              { assetNumber: "WSHP01", name: "Workshop" },
              { assetNumber: "WSHP01-DB01", name: "Workshop L&P DB" },
              { assetNumber: "WSHP01-CMP01", name: "Workshop Air Compressor" },
              { assetNumber: "WSHP01-WLD01", name: "Workshop Welding Machine 1" },
              { assetNumber: "WSHP01-WLD02", name: "Workshop Welding Machine 2" },
              { assetNumber: "WSHP01-LAT01", name: "Workshop Lathe" },
              { assetNumber: "WSHP01-GRN01", name: "Workshop Grinder" },
              { assetNumber: "WSHP01-DRL01", name: "Workshop Drill Press" },
              { assetNumber: "WSHP01-HYD01", name: "Workshop Hydraulic Press" },
            ] 
          },
        ],
      },
      {
        label: "Lab",
        parentAssets: [
          { 
            label: "LAB01 Laboratory Systems", 
            equipment: [
              { assetNumber: "LAB01", name: "Laboratory" },
              { assetNumber: "LAB01-DB01", name: "Laboratory L&P DB" },
              { assetNumber: "LAB01-FURN01", name: "Laboratory Furnace" },
              { assetNumber: "LAB01-BAL01", name: "Laboratory Balance" },
              { assetNumber: "LAB01-CRS01", name: "Laboratory Crusher" },
              { assetNumber: "LAB01-PULV01", name: "Laboratory Pulverizer" },
            ] 
          },
        ],
      },
    ],
  },
];
