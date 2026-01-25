// Functional Location Structure for TCMG Processing Plant
// Format: TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]
// FLs stop at SYSTEM level - Assets do NOT get FL codes

import { areasData } from "./assetData";

export interface FunctionalLocation {
  code: string;
  area: string;
  areaCode: string;
  subArea: string;
  subAreaCode: string;
  systemName: string;
}

// Area code mapping (approved codes per CMMS standards)
const areaCodeMapping: Record<string, string> = {
  "SITE": "SITE",
  "UTL": "UTL",
  "COM": "COMM",  // COMM as per approved codes
  "REC": "GR",    // GR = Gold Recovery as per approved codes
  "TAIL": "TAIL",
  "SUP": "SUP",
};

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
  "Fuel Dispensing": "FDISP2",
  
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
  "Loaded Carbon Screen": "LDCS",
  "CIP Inter Tank Screens": "ITS",
  "Carbon Safety Screen": "CSS",
  "Carbon Safety Sump": "CSSUMP",
  "CIP Transfer Pump": "CIPXFR",
  "Cyanide Monorail": "CYMNR",
  "Cyanide Bag Breaker": "CYBB",
  "Caustic Bag Breaker": "CAUBB",
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
  
  // SUP > Light Vehicles
  "LV Fleet": "LVFLT",
  
  // SUP > Heavy Vehicles
  "HV Fleet": "HVFLT",
};

// Generate a unique system code from label if not predefined
function generateSystemCode(label: string): string {
  if (systemCodes[label]) {
    return systemCodes[label];
  }
  // Generate code from first letters of each word, max 8 chars
  const words = label.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);
  let code = words.map(w => w.substring(0, 2).toUpperCase()).join('');
  return code.substring(0, 8);
}

// Generate sub-area code
function getSubAreaCode(label: string): string {
  if (subAreaCodes[label]) {
    return subAreaCodes[label];
  }
  // Fallback: first 4 chars uppercase
  return label.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
}

// Generate Functional Location code
export function generateFLCode(
  areaCode: string,
  subAreaLabel: string,
  systemLabel: string
): string {
  const area = areaCodeMapping[areaCode] || areaCode;
  const subArea = getSubAreaCode(subAreaLabel);
  const system = generateSystemCode(systemLabel);
  
  return `TCMG-PP-${area}-${subArea}-${system}`;
}

// Dynamically generate ALL Functional Locations from asset data
function generateAllFunctionalLocations(): FunctionalLocation[] {
  const fls: FunctionalLocation[] = [];
  const usedCodes = new Set<string>();
  
  for (const area of areasData) {
    const mappedAreaCode = areaCodeMapping[area.code] || area.code;
    
    for (const subArea of area.subAreas) {
      const subAreaCode = getSubAreaCode(subArea.label);
      
      for (const parentAsset of subArea.parentAssets) {
        let systemCode = generateSystemCode(parentAsset.label);
        let flCode = `TCMG-PP-${mappedAreaCode}-${subAreaCode}-${systemCode}`;
        
        // Ensure uniqueness
        let counter = 1;
        while (usedCodes.has(flCode)) {
          counter++;
          flCode = `TCMG-PP-${mappedAreaCode}-${subAreaCode}-${systemCode}${counter}`;
        }
        usedCodes.add(flCode);
        
        fls.push({
          code: flCode,
          area: area.label,
          areaCode: mappedAreaCode,
          subArea: subArea.label,
          subAreaCode: subAreaCode,
          systemName: parentAsset.label,
        });
      }
    }
  }
  
  return fls;
}

// Complete Functional Location Table - dynamically generated
export const functionalLocations: FunctionalLocation[] = generateAllFunctionalLocations();

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
