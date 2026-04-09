// Functional Location Structure for TCMG Processing Plant
// Format: TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]
// FLs stop at SYSTEM level - Assets do NOT get FL codes

import { areasData } from "./assetData";
import { getSubAreaCode } from "@/utils/subAreaCodes";

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
  "COM": "COM",
  "REC": "REC",
  "TAIL": "TAIL",
  "SUP": "SUP",
};

// Extract the system code from the parent asset label
function generateSystemCode(label: string): string {
  const match = label.match(/^([A-Z0-9\-]+)\s/);
  if (match) {
    return match[1];
  }
  return label.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
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
    COM: functionalLocations.filter(fl => fl.areaCode === "COM").length,
    REC: functionalLocations.filter(fl => fl.areaCode === "REC").length,
    TAIL: functionalLocations.filter(fl => fl.areaCode === "TAIL").length,
    SUP: functionalLocations.filter(fl => fl.areaCode === "SUP").length,
  }
};
