// Functional Location Structure for TCMG Processing Plant
// Format: TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]
// FLs stop at SYSTEM level - Assets do NOT get FL codes

export interface FunctionalLocation {
  code: string;
  area: string;
  areaCode: string;
  subArea: string;
  subAreaCode: string;
  systemName: string;
}

// Sub-Area code mapping
const subAreaCodes: Record<string, string> = {
  // SITE
  "Site Infrastructure": "INFRA",
  // UTL
  "Compressed Air": "COMP",
  "Electrical / Controls": "ELEC",
  "Power Generation": "PWR",
  "Reagents (Lime)": "REAG",
  "Water": "WTR",
  "Hydraulic Systems": "HYD",
  "Fuel Systems": "FUEL",
  // COM
  "Feed / Reclaim": "FEED",
  "Conveying": "CONV",
  "Grinding": "GRIND",
  "Classification": "CLASS",
  // REC
  "Gravity Circuit": "GRAV",
  "CIP": "CIP",
  "Elution": "ELUT",
  "Carbon Regeneration": "REGEN",
  "Gold Room": "GOLD",
  // TAIL
  "Thickening": "THK",
  "Filtering": "FILT",
  // SUP
  "Workshop": "WKSHP",
  "Lab": "LAB",
  "Mobile Equipment": "MOBILE",
  "Light Vehicles": "LV",
  "Heavy Vehicles (HV)": "HV",
};

// System code mapping - converts Parent Asset names to short codes
const systemCodes: Record<string, string> = {
  // SITE > Site Infrastructure
  "Gold Plant": "GPLNT",
  "Admin Building": "ADMIN",
  "Toilets / Amenities": "AMEN",
  "Crib Room": "CRIB",
  "First Aid Room": "FAID",
  "Change Rooms": "CHNG",
  "Services": "SVCS",
  
  // UTL > Compressed Air
  "Air Compressor 1": "COMP01",
  "Air Receiver 1": "RCVR01",
  "Air Dryer 1": "DRYR01",
  "HP Air Compressor": "HPCOMP",
  
  // UTL > Electrical / Controls
  "Main Distribution Board": "MDB",
  "Sub Distribution Board": "SDB",
  "Control Room": "CTRL",
  "Control Subroom 1": "CTSUB01",
  "Lighting Towers": "LTWR",
  "Main Sub Station": "MSUB",
  
  // UTL > Power Generation
  "Generator Set": "GENSET",
  "Fuel Storage Tank": "FSTK",
  "Fuel Dispensing Station": "FDISP",
  
  // UTL > Reagents (Lime)
  "Lime Storage Silo": "LSILO",
  "Lime Silo Vibrator": "LVIB",
  "Lime Dosing System": "LDOS",
  "Lime Agitation Tank": "LAGTK",
  "Reagents": "REAG",
  "Reagent Safety Shower": "RSHWR",
  "Floc System": "FLOC",
  
  // UTL > Water
  "Potable Water Tank": "PWT",
  "Raw Water Tank": "RWT",
  "Process Water Tank": "PRWT",
  
  // UTL > Hydraulic Systems
  "Hydraulic Oil System": "HOIL",
  
  // UTL > Fuel Systems
  "Fuel Dispensing": "FDISP",
  
  // COM > Feed / Reclaim
  "Reclaim Hopper": "RCHOP",
  "Apron Feeder": "APRFDR",
  "Feed Hopper": "FDHOP",
  "Mill Feed Conveyor": "MFCV",
  "Primary Cyclone Feed Pumps": "PCFPMP",
  
  // COM > Conveying
  "Conveyor CV01": "CV01",
  "Conveyor CV02": "CV02",
  
  // COM > Grinding
  "Ball Mill": "BM",
  "Grinding Sump": "GSUMP",
  
  // COM > Classification
  "Cyclone Cluster": "CYCL",
  
  // REC > Gravity Circuit
  "Gravity Concentrator 1": "GCON01",
  "Concentrate Pump": "CPMP",
  "Gravity Electrowinning": "GEW",
  "Gravity Screen": "GSCR",
  "Knelson Concentrator": "KNLS",
  "Concentrate Shaking Table": "CST",
  
  // REC > CIP
  "CIP Tank 1": "CIPTK01",
  "CIP Tank 2": "CIPTK02",
  "CIP Tank 3": "CIPTK03",
  "CIP Tank 4": "CIPTK04",
  "CIP Tank 5": "CIPTK05",
  "CIP Tank 6": "CIPTK06",
  "CIP Tank 7": "CIPTK07",
  "CIP Tank 8": "CIPTK08",
  "CIP Feed Trash Screen": "CIPFTS",
  "Loaded Carbon Screen": "LCS",
  "Inter Tank Screens": "ITS",
  "Carbon Safety Screen": "CSS",
  "Carbon Safety Sump": "CSSUMP",
  "Carbon Transfer System": "CXFR",
  "Cyanide Monorail": "CYMNR",
  "Cyanide Bag Breaker": "CYBB",
  "Cyanide Mixing Tank": "CYMIX",
  "Cyanide Instruments": "CYINS",
  "Cyanide Solution Storage Tank": "CYSST",
  "Cyanide Dosing System": "CYDOS",
  "Cyanide Transfer System": "CYXFR",
  "Cyanide Area Sump": "CYSUMP",
  "Caustic Dosing System": "CAUSDOS",
  "Titration Hut": "TITHUT",
  
  // REC > Elution
  "Elution Column": "ELUCOL",
  "Elution Safety Showers": "ELUSHWR",
  "Elution Area Sump": "ELUSUMP",
  "Flashpot": "FLSH",
  "Heat Exchanger": "HEXC",
  "Acid Wash System": "AWSYS",
  "Acid Wash Column": "AWCOL",
  "HCL Dosing System": "HCLDOS",
  "Eluate System": "ELUAT",
  "Diesel System": "DSL",
  
  // REC > Carbon Regeneration
  "Barren Carbon Dewatering Screen": "BCDS",
  "Regen Kiln Feed Hopper": "RKHOP",
  "Regen Kiln": "RKILN",
  "Carbon Quench System": "CQNCH",
  "Regenerated Carbon Transfer": "RCXFR",
  "Carbon Sizing Screen": "CSZS",
  "Regen Area Sump": "RSUMP",
  
  // REC > Gold Room
  "Electrowinning Cell": "EW",
  "Gold Room Safety Shower": "GRSHWR",
  "Cathode System": "CATH",
  "Calcine System": "CALC",
  "Gold Bullion": "BULL",
  "Smelting Furnace": "SMLT",
  "Gold Pour Area": "POUR",
  
  // TAIL > Thickening
  "Thickener": "THK",
  "Thickener Underflow Pump": "THKUFP",
  
  // TAIL > Filtering
  "Filter Press": "FP",
  "Filtrate Pump": "FILTPMP",
  
  // SUP > Workshop
  "Fixed Plant Workshop": "FPWKSHP",
  
  // SUP > Lab
  "Assay Equipment": "ASSAY",
  "Sample Prep Equipment": "SAMPPREP",
  "Laboratory Systems": "LABSYS",
  
  // SUP > Mobile Equipment
  "Plant Mobile Equipment": "PLNTMOB",
  
  // SUP > Site Infrastructure (uses different code to distinguish from SITE)
  // "Services" already defined above for SITE - SUP uses same code
  
  // SUP > Light Vehicles
  "LV Fleet": "LVFLT",
  
  // SUP > Heavy Vehicles
  "HV Fleet": "HVFLT",
};

// Area code mapping (approved codes)
const areaCodeMapping: Record<string, string> = {
  "SITE": "SITE",
  "UTL": "UTL",
  "COM": "COMM",  // COMM as per approved codes
  "REC": "GR",    // GR = Gold Recovery as per approved codes
  "TAIL": "TAIL",
  "SUP": "SUP",
};

// Generate Functional Location code
export function generateFLCode(
  areaCode: string,
  subAreaLabel: string,
  systemLabel: string
): string {
  const area = areaCodeMapping[areaCode] || areaCode;
  const subArea = subAreaCodes[subAreaLabel] || subAreaLabel.substring(0, 4).toUpperCase();
  const system = systemCodes[systemLabel] || systemLabel.substring(0, 6).toUpperCase().replace(/\s/g, "");
  
  return `TCMG-PP-${area}-${subArea}-${system}`;
}

// Complete Functional Location Table
export const functionalLocations: FunctionalLocation[] = [
  // ========== SITE - Site Infrastructure ==========
  { code: "TCMG-PP-SITE-INFRA-GPLNT", area: "Site", areaCode: "SITE", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "Gold Plant" },
  { code: "TCMG-PP-SITE-INFRA-ADMIN", area: "Site", areaCode: "SITE", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "Admin Building" },
  { code: "TCMG-PP-SITE-INFRA-AMEN", area: "Site", areaCode: "SITE", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "Toilets / Amenities" },
  { code: "TCMG-PP-SITE-INFRA-CRIB", area: "Site", areaCode: "SITE", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "Crib Room" },
  { code: "TCMG-PP-SITE-INFRA-FAID", area: "Site", areaCode: "SITE", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "First Aid Room" },
  { code: "TCMG-PP-SITE-INFRA-CHNG", area: "Site", areaCode: "SITE", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "Change Rooms" },
  { code: "TCMG-PP-SITE-INFRA-SVCS", area: "Site", areaCode: "SITE", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "Services" },

  // ========== UTL - Utilities & Power ==========
  // Compressed Air
  { code: "TCMG-PP-UTL-COMP-COMP01", area: "Utilities & Power", areaCode: "UTL", subArea: "Compressed Air", subAreaCode: "COMP", systemName: "Air Compressor 1" },
  { code: "TCMG-PP-UTL-COMP-RCVR01", area: "Utilities & Power", areaCode: "UTL", subArea: "Compressed Air", subAreaCode: "COMP", systemName: "Air Receiver 1" },
  { code: "TCMG-PP-UTL-COMP-DRYR01", area: "Utilities & Power", areaCode: "UTL", subArea: "Compressed Air", subAreaCode: "COMP", systemName: "Air Dryer 1" },
  { code: "TCMG-PP-UTL-COMP-HPCOMP", area: "Utilities & Power", areaCode: "UTL", subArea: "Compressed Air", subAreaCode: "COMP", systemName: "HP Air Compressor" },
  
  // Electrical / Controls
  { code: "TCMG-PP-UTL-ELEC-MDB", area: "Utilities & Power", areaCode: "UTL", subArea: "Electrical / Controls", subAreaCode: "ELEC", systemName: "Main Distribution Board" },
  { code: "TCMG-PP-UTL-ELEC-SDB", area: "Utilities & Power", areaCode: "UTL", subArea: "Electrical / Controls", subAreaCode: "ELEC", systemName: "Sub Distribution Board" },
  { code: "TCMG-PP-UTL-ELEC-CTRL", area: "Utilities & Power", areaCode: "UTL", subArea: "Electrical / Controls", subAreaCode: "ELEC", systemName: "Control Room" },
  { code: "TCMG-PP-UTL-ELEC-CTSUB01", area: "Utilities & Power", areaCode: "UTL", subArea: "Electrical / Controls", subAreaCode: "ELEC", systemName: "Control Subroom 1" },
  { code: "TCMG-PP-UTL-ELEC-LTWR", area: "Utilities & Power", areaCode: "UTL", subArea: "Electrical / Controls", subAreaCode: "ELEC", systemName: "Lighting Towers" },
  { code: "TCMG-PP-UTL-ELEC-MSUB", area: "Utilities & Power", areaCode: "UTL", subArea: "Electrical / Controls", subAreaCode: "ELEC", systemName: "Main Sub Station" },
  
  // Power Generation
  { code: "TCMG-PP-UTL-PWR-GENSET", area: "Utilities & Power", areaCode: "UTL", subArea: "Power Generation", subAreaCode: "PWR", systemName: "Generator Set" },
  { code: "TCMG-PP-UTL-PWR-FSTK", area: "Utilities & Power", areaCode: "UTL", subArea: "Power Generation", subAreaCode: "PWR", systemName: "Fuel Storage Tank" },
  { code: "TCMG-PP-UTL-PWR-FDISP", area: "Utilities & Power", areaCode: "UTL", subArea: "Power Generation", subAreaCode: "PWR", systemName: "Fuel Dispensing Station" },
  
  // Reagents (Lime)
  { code: "TCMG-PP-UTL-REAG-LSILO", area: "Utilities & Power", areaCode: "UTL", subArea: "Reagents (Lime)", subAreaCode: "REAG", systemName: "Lime Storage Silo" },
  { code: "TCMG-PP-UTL-REAG-LVIB", area: "Utilities & Power", areaCode: "UTL", subArea: "Reagents (Lime)", subAreaCode: "REAG", systemName: "Lime Silo Vibrator" },
  { code: "TCMG-PP-UTL-REAG-LDOS", area: "Utilities & Power", areaCode: "UTL", subArea: "Reagents (Lime)", subAreaCode: "REAG", systemName: "Lime Dosing System" },
  { code: "TCMG-PP-UTL-REAG-LAGTK", area: "Utilities & Power", areaCode: "UTL", subArea: "Reagents (Lime)", subAreaCode: "REAG", systemName: "Lime Agitation Tank" },
  { code: "TCMG-PP-UTL-REAG-REAG", area: "Utilities & Power", areaCode: "UTL", subArea: "Reagents (Lime)", subAreaCode: "REAG", systemName: "Reagents" },
  { code: "TCMG-PP-UTL-REAG-RSHWR", area: "Utilities & Power", areaCode: "UTL", subArea: "Reagents (Lime)", subAreaCode: "REAG", systemName: "Reagent Safety Shower" },
  { code: "TCMG-PP-UTL-REAG-FLOC", area: "Utilities & Power", areaCode: "UTL", subArea: "Reagents (Lime)", subAreaCode: "REAG", systemName: "Floc System" },
  
  // Water
  { code: "TCMG-PP-UTL-WTR-PWT", area: "Utilities & Power", areaCode: "UTL", subArea: "Water", subAreaCode: "WTR", systemName: "Potable Water Tank" },
  { code: "TCMG-PP-UTL-WTR-RWT", area: "Utilities & Power", areaCode: "UTL", subArea: "Water", subAreaCode: "WTR", systemName: "Raw Water Tank" },
  { code: "TCMG-PP-UTL-WTR-PRWT", area: "Utilities & Power", areaCode: "UTL", subArea: "Water", subAreaCode: "WTR", systemName: "Process Water Tank" },
  
  // Hydraulic Systems
  { code: "TCMG-PP-UTL-HYD-HOIL", area: "Utilities & Power", areaCode: "UTL", subArea: "Hydraulic Systems", subAreaCode: "HYD", systemName: "Hydraulic Oil System" },
  
  // Fuel Systems
  { code: "TCMG-PP-UTL-FUEL-FDISP", area: "Utilities & Power", areaCode: "UTL", subArea: "Fuel Systems", subAreaCode: "FUEL", systemName: "Fuel Dispensing" },

  // ========== COM - Comminution / Process ==========
  // Feed / Reclaim
  { code: "TCMG-PP-COMM-FEED-RCHOP", area: "Comminution / Process", areaCode: "COMM", subArea: "Feed / Reclaim", subAreaCode: "FEED", systemName: "Reclaim Hopper" },
  { code: "TCMG-PP-COMM-FEED-APRFDR", area: "Comminution / Process", areaCode: "COMM", subArea: "Feed / Reclaim", subAreaCode: "FEED", systemName: "Apron Feeder" },
  { code: "TCMG-PP-COMM-FEED-FDHOP", area: "Comminution / Process", areaCode: "COMM", subArea: "Feed / Reclaim", subAreaCode: "FEED", systemName: "Feed Hopper" },
  { code: "TCMG-PP-COMM-FEED-MFCV", area: "Comminution / Process", areaCode: "COMM", subArea: "Feed / Reclaim", subAreaCode: "FEED", systemName: "Mill Feed Conveyor" },
  { code: "TCMG-PP-COMM-FEED-PCFPMP", area: "Comminution / Process", areaCode: "COMM", subArea: "Feed / Reclaim", subAreaCode: "FEED", systemName: "Primary Cyclone Feed Pumps" },
  
  // Conveying
  { code: "TCMG-PP-COMM-CONV-CV01", area: "Comminution / Process", areaCode: "COMM", subArea: "Conveying", subAreaCode: "CONV", systemName: "Conveyor CV01" },
  { code: "TCMG-PP-COMM-CONV-CV02", area: "Comminution / Process", areaCode: "COMM", subArea: "Conveying", subAreaCode: "CONV", systemName: "Conveyor CV02" },
  
  // Grinding
  { code: "TCMG-PP-COMM-GRIND-BM", area: "Comminution / Process", areaCode: "COMM", subArea: "Grinding", subAreaCode: "GRIND", systemName: "Ball Mill" },
  { code: "TCMG-PP-COMM-GRIND-GSUMP", area: "Comminution / Process", areaCode: "COMM", subArea: "Grinding", subAreaCode: "GRIND", systemName: "Grinding Sump" },
  
  // Classification
  { code: "TCMG-PP-COMM-CLASS-CYCL", area: "Comminution / Process", areaCode: "COMM", subArea: "Classification", subAreaCode: "CLASS", systemName: "Cyclone Cluster" },

  // ========== REC - Gold Recovery ==========
  // Gravity Circuit
  { code: "TCMG-PP-GR-GRAV-GCON01", area: "Gold Recovery", areaCode: "GR", subArea: "Gravity Circuit", subAreaCode: "GRAV", systemName: "Gravity Concentrator 1" },
  { code: "TCMG-PP-GR-GRAV-CPMP", area: "Gold Recovery", areaCode: "GR", subArea: "Gravity Circuit", subAreaCode: "GRAV", systemName: "Concentrate Pump" },
  { code: "TCMG-PP-GR-GRAV-GEW", area: "Gold Recovery", areaCode: "GR", subArea: "Gravity Circuit", subAreaCode: "GRAV", systemName: "Gravity Electrowinning" },
  { code: "TCMG-PP-GR-GRAV-GSCR", area: "Gold Recovery", areaCode: "GR", subArea: "Gravity Circuit", subAreaCode: "GRAV", systemName: "Gravity Screen" },
  { code: "TCMG-PP-GR-GRAV-KNLS", area: "Gold Recovery", areaCode: "GR", subArea: "Gravity Circuit", subAreaCode: "GRAV", systemName: "Knelson Concentrator" },
  { code: "TCMG-PP-GR-GRAV-CST", area: "Gold Recovery", areaCode: "GR", subArea: "Gravity Circuit", subAreaCode: "GRAV", systemName: "Concentrate Shaking Table" },
  
  // CIP
  { code: "TCMG-PP-GR-CIP-CIPTK01", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 1" },
  { code: "TCMG-PP-GR-CIP-CIPTK02", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 2" },
  { code: "TCMG-PP-GR-CIP-CIPTK03", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 3" },
  { code: "TCMG-PP-GR-CIP-CIPTK04", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 4" },
  { code: "TCMG-PP-GR-CIP-CIPTK05", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 5" },
  { code: "TCMG-PP-GR-CIP-CIPTK06", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 6" },
  { code: "TCMG-PP-GR-CIP-CIPTK07", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 7" },
  { code: "TCMG-PP-GR-CIP-CIPTK08", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Tank 8" },
  { code: "TCMG-PP-GR-CIP-CIPFTS", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "CIP Feed Trash Screen" },
  { code: "TCMG-PP-GR-CIP-LCS", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Loaded Carbon Screen" },
  { code: "TCMG-PP-GR-CIP-ITS", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Inter Tank Screens" },
  { code: "TCMG-PP-GR-CIP-CSS", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Carbon Safety Screen" },
  { code: "TCMG-PP-GR-CIP-CSSUMP", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Carbon Safety Sump" },
  { code: "TCMG-PP-GR-CIP-CXFR", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Carbon Transfer System" },
  { code: "TCMG-PP-GR-CIP-CYMNR", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Monorail" },
  { code: "TCMG-PP-GR-CIP-CYBB", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Bag Breaker" },
  { code: "TCMG-PP-GR-CIP-CYMIX", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Mixing Tank" },
  { code: "TCMG-PP-GR-CIP-CYINS", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Instruments" },
  { code: "TCMG-PP-GR-CIP-CYSST", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Solution Storage Tank" },
  { code: "TCMG-PP-GR-CIP-CYDOS", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Dosing System" },
  { code: "TCMG-PP-GR-CIP-CYXFR", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Transfer System" },
  { code: "TCMG-PP-GR-CIP-CYSUMP", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Cyanide Area Sump" },
  { code: "TCMG-PP-GR-CIP-CAUSDOS", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Caustic Dosing System" },
  { code: "TCMG-PP-GR-CIP-TITHUT", area: "Gold Recovery", areaCode: "GR", subArea: "CIP", subAreaCode: "CIP", systemName: "Titration Hut" },
  
  // Elution
  { code: "TCMG-PP-GR-ELUT-ELUCOL", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Elution Column" },
  { code: "TCMG-PP-GR-ELUT-ELUSHWR", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Elution Safety Showers" },
  { code: "TCMG-PP-GR-ELUT-ELUSUMP", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Elution Area Sump" },
  { code: "TCMG-PP-GR-ELUT-FLSH", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Flashpot" },
  { code: "TCMG-PP-GR-ELUT-HEXC", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Heat Exchanger" },
  { code: "TCMG-PP-GR-ELUT-AWSYS", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Acid Wash System" },
  { code: "TCMG-PP-GR-ELUT-AWCOL", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Acid Wash Column" },
  { code: "TCMG-PP-GR-ELUT-HCLDOS", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "HCL Dosing System" },
  { code: "TCMG-PP-GR-ELUT-ELUAT", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Eluate System" },
  { code: "TCMG-PP-GR-ELUT-DSL", area: "Gold Recovery", areaCode: "GR", subArea: "Elution", subAreaCode: "ELUT", systemName: "Diesel System" },
  
  // Carbon Regeneration
  { code: "TCMG-PP-GR-REGEN-BCDS", area: "Gold Recovery", areaCode: "GR", subArea: "Carbon Regeneration", subAreaCode: "REGEN", systemName: "Barren Carbon Dewatering Screen" },
  { code: "TCMG-PP-GR-REGEN-RKHOP", area: "Gold Recovery", areaCode: "GR", subArea: "Carbon Regeneration", subAreaCode: "REGEN", systemName: "Regen Kiln Feed Hopper" },
  { code: "TCMG-PP-GR-REGEN-RKILN", area: "Gold Recovery", areaCode: "GR", subArea: "Carbon Regeneration", subAreaCode: "REGEN", systemName: "Regen Kiln" },
  { code: "TCMG-PP-GR-REGEN-CQNCH", area: "Gold Recovery", areaCode: "GR", subArea: "Carbon Regeneration", subAreaCode: "REGEN", systemName: "Carbon Quench System" },
  { code: "TCMG-PP-GR-REGEN-RCXFR", area: "Gold Recovery", areaCode: "GR", subArea: "Carbon Regeneration", subAreaCode: "REGEN", systemName: "Regenerated Carbon Transfer" },
  { code: "TCMG-PP-GR-REGEN-CSZS", area: "Gold Recovery", areaCode: "GR", subArea: "Carbon Regeneration", subAreaCode: "REGEN", systemName: "Carbon Sizing Screen" },
  { code: "TCMG-PP-GR-REGEN-RSUMP", area: "Gold Recovery", areaCode: "GR", subArea: "Carbon Regeneration", subAreaCode: "REGEN", systemName: "Regen Area Sump" },
  
  // Gold Room
  { code: "TCMG-PP-GR-GOLD-EW", area: "Gold Recovery", areaCode: "GR", subArea: "Gold Room", subAreaCode: "GOLD", systemName: "Electrowinning Cell" },
  { code: "TCMG-PP-GR-GOLD-GRSHWR", area: "Gold Recovery", areaCode: "GR", subArea: "Gold Room", subAreaCode: "GOLD", systemName: "Gold Room Safety Shower" },
  { code: "TCMG-PP-GR-GOLD-CATH", area: "Gold Recovery", areaCode: "GR", subArea: "Gold Room", subAreaCode: "GOLD", systemName: "Cathode System" },
  { code: "TCMG-PP-GR-GOLD-CALC", area: "Gold Recovery", areaCode: "GR", subArea: "Gold Room", subAreaCode: "GOLD", systemName: "Calcine System" },
  { code: "TCMG-PP-GR-GOLD-BULL", area: "Gold Recovery", areaCode: "GR", subArea: "Gold Room", subAreaCode: "GOLD", systemName: "Gold Bullion" },
  { code: "TCMG-PP-GR-GOLD-SMLT", area: "Gold Recovery", areaCode: "GR", subArea: "Gold Room", subAreaCode: "GOLD", systemName: "Smelting Furnace" },
  { code: "TCMG-PP-GR-GOLD-POUR", area: "Gold Recovery", areaCode: "GR", subArea: "Gold Room", subAreaCode: "GOLD", systemName: "Gold Pour Area" },

  // ========== TAIL - Tailings ==========
  // Thickening
  { code: "TCMG-PP-TAIL-THK-THK", area: "Tailings", areaCode: "TAIL", subArea: "Thickening", subAreaCode: "THK", systemName: "Thickener" },
  { code: "TCMG-PP-TAIL-THK-THKUFP", area: "Tailings", areaCode: "TAIL", subArea: "Thickening", subAreaCode: "THK", systemName: "Thickener Underflow Pump" },
  
  // Filtering
  { code: "TCMG-PP-TAIL-FILT-FP", area: "Tailings", areaCode: "TAIL", subArea: "Filtering", subAreaCode: "FILT", systemName: "Filter Press" },
  { code: "TCMG-PP-TAIL-FILT-FILTPMP", area: "Tailings", areaCode: "TAIL", subArea: "Filtering", subAreaCode: "FILT", systemName: "Filtrate Pump" },

  // ========== SUP - Support Services ==========
  // Workshop
  { code: "TCMG-PP-SUP-WKSHP-FPWKSHP", area: "Support Services", areaCode: "SUP", subArea: "Workshop", subAreaCode: "WKSHP", systemName: "Fixed Plant Workshop" },
  
  // Lab
  { code: "TCMG-PP-SUP-LAB-ASSAY", area: "Support Services", areaCode: "SUP", subArea: "Lab", subAreaCode: "LAB", systemName: "Assay Equipment" },
  { code: "TCMG-PP-SUP-LAB-SAMPPREP", area: "Support Services", areaCode: "SUP", subArea: "Lab", subAreaCode: "LAB", systemName: "Sample Prep Equipment" },
  { code: "TCMG-PP-SUP-LAB-LABSYS", area: "Support Services", areaCode: "SUP", subArea: "Lab", subAreaCode: "LAB", systemName: "Laboratory Systems" },
  
  // Mobile Equipment
  { code: "TCMG-PP-SUP-MOBILE-PLNTMOB", area: "Support Services", areaCode: "SUP", subArea: "Mobile Equipment", subAreaCode: "MOBILE", systemName: "Plant Mobile Equipment" },
  
  // Site Infrastructure (SUP)
  { code: "TCMG-PP-SUP-INFRA-SVCS", area: "Support Services", areaCode: "SUP", subArea: "Site Infrastructure", subAreaCode: "INFRA", systemName: "Services" },
  
  // Light Vehicles
  { code: "TCMG-PP-SUP-LV-LVFLT", area: "Support Services", areaCode: "SUP", subArea: "Light Vehicles", subAreaCode: "LV", systemName: "LV Fleet" },
  
  // Heavy Vehicles
  { code: "TCMG-PP-SUP-HV-HVFLT", area: "Support Services", areaCode: "SUP", subArea: "Heavy Vehicles (HV)", subAreaCode: "HV", systemName: "HV Fleet" },
];

// Summary statistics
export const flSummary = {
  totalFunctionalLocations: functionalLocations.length,
  byArea: {
    SITE: functionalLocations.filter(fl => fl.areaCode === "SITE").length,
    UTL: functionalLocations.filter(fl => fl.areaCode === "UTL").length,
    COMM: functionalLocations.filter(fl => fl.areaCode === "COMM").length,
    GR: functionalLocations.filter(fl => fl.areaCode === "GR").length,
    TAIL: functionalLocations.filter(fl => fl.areaCode === "TAIL").length,
    SUP: functionalLocations.filter(fl => fl.areaCode === "SUP").length,
  }
};
