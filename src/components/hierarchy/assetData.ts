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
  /** Optional legacy P&ID references carried by nested sub-equipment */
  pidTags?: string[];
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
  /** DB-stored functional location code */
  functionalLocation?: string;
}

export interface ParentAsset {
  label: string;
  equipment: Equipment[];
  /** DB-stored functional location code (shared by all equipment under this parent) */
  functionalLocation?: string;
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

// Rev A data has been removed. Types are retained for shared use.
// All processing plant data is now served from Rev B (database-driven).
export const areasData: Area[] = [];
