import type { ComponentItem } from "./ComponentsTable";
import { pidTagMappings } from "../hierarchy/pidTagMappings";

// Generic component templates for each asset type
// NO OEM data - functional names only
// Data will be enriched after P&ID walkdowns and engineering verification

let idCounter = 1;
const generateId = () => `COMP-${String(idCounter++).padStart(4, '0')}`;

// Build a lookup map from asset number to P&ID tags
const buildPidTagLookup = (): Map<string, string[]> => {
  const lookup = new Map<string, string[]>();
  pidTagMappings.forEach((mapping) => {
    const existing = lookup.get(mapping.assetNumber) || [];
    existing.push(mapping.pidTag);
    lookup.set(mapping.assetNumber, existing);
  });
  return lookup;
};

const pidTagsByAsset = buildPidTagLookup();

// Get P&ID tag(s) for an asset number
const getPidTag = (assetNumber: string): string => {
  const tags = pidTagsByAsset.get(assetNumber) || [];
  return tags.join(", ");
};

const inferAreaFromPidTag = (pidTag: string): string => {
  // Most tags follow NN-XXXX format; fall back gracefully for odd tags like "-BA-103".
  const prefix = pidTag.split("-")[0]?.trim();
  switch (prefix) {
    case "04":
      return "COM";
    case "05":
      return "REC";
    case "06":
      return "UTL";
    case "08":
      return "REC";
    case "11":
      return "UTL";
    case "12":
    case "13":
      return "TAIL";
    case "14":
    case "15":
    case "16":
    case "18":
      return "SITE";
    case "17":
      return "UTL";
    default:
      return "";
  }
};

const inferComponentTypeFromAssetNumber = (assetNumber: string): {
  type: string;
  abbrev: string;
} => {
  const upper = assetNumber.toUpperCase();

  if (/-MTR\d+$/.test(upper)) return { type: "Motor", abbrev: "MTR" };
  if (/-GBX\d+$/.test(upper)) return { type: "Gearbox", abbrev: "GBX" };
  if (/-VFD\d+$/.test(upper)) return { type: "VFD", abbrev: "VFD" };
  if (/-MCC\d+$/.test(upper)) return { type: "MCC", abbrev: "MCC" };
  if (/-LCS\d+$/.test(upper)) return { type: "LCS", abbrev: "LCS" };
  if (/(^|-)PMP\d+[A-Z]?$/.test(upper) || upper.includes("-PMP")) return { type: "Pump", abbrev: "PMP" };
  if (upper.includes("-TX") || upper.includes("-SEN") || upper.includes("-PG") || upper.includes("-TG"))
    return { type: "Instrument", abbrev: "INS" };

  return { type: "Equipment", abbrev: "EQP" };
};

// Helper to create component entries
const createComponent = (
  assetName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string,
  system: string,
  componentType: string,
  componentName: string,
  componentAbbreviation: string,
  componentFunction: "Drive" | "Support" | "Control" | "Safety" | ""
): ComponentItem => ({
  id: generateId(),
  assetName,
  assetNumber,
  parentAsset,
  area,
  subArea,
  system,
  componentType,
  componentName,
  componentAbbreviation,
  componentFunction,
  oemManufacturer: "",
  oemModel: "",
  oemSerialNumber: "",
  pidTag: getPidTag(assetNumber),
  notes: "",
  status: "Unknown",
});

// ==================== CONVEYOR COMPONENTS ====================
const conveyorComponents = (
  conveyorName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(conveyorName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Conveying", "Motor", `Motor – ${conveyorName}`, "MTR", "Drive"),
  createComponent(conveyorName, `${assetNumber}-GBX01`, parentAsset, area, subArea, "Conveying", "Gearbox", `Gearbox – ${conveyorName}`, "GBX", "Drive"),
  createComponent(conveyorName, `${assetNumber}-HPUL01`, parentAsset, area, subArea, "Conveying", "Head Pulley", `Head Pulley – ${conveyorName}`, "HPUL", "Support"),
  createComponent(conveyorName, `${assetNumber}-TPUL01`, parentAsset, area, subArea, "Conveying", "Tail Pulley", `Tail Pulley – ${conveyorName}`, "TPUL", "Support"),
  createComponent(conveyorName, `${assetNumber}-BRG01`, parentAsset, area, subArea, "Conveying", "Bearing", `Head Pulley Bearing – ${conveyorName}`, "BRG", "Support"),
  createComponent(conveyorName, `${assetNumber}-BRG02`, parentAsset, area, subArea, "Conveying", "Bearing", `Tail Pulley Bearing – ${conveyorName}`, "BRG", "Support"),
  createComponent(conveyorName, `${assetNumber}-BLT01`, parentAsset, area, subArea, "Conveying", "Belt", `Belt – ${conveyorName}`, "BLT", "Support"),
  createComponent(conveyorName, `${assetNumber}-CPL01`, parentAsset, area, subArea, "Conveying", "Coupling", `Coupling – ${conveyorName}`, "CPL", "Drive"),
];

// ==================== APRON FEEDER COMPONENTS ====================
const apronFeederComponents = (
  feederName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(feederName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Feed/Reclaim", "Motor", `Motor – ${feederName}`, "MTR", "Drive"),
  createComponent(feederName, `${assetNumber}-GBX01`, parentAsset, area, subArea, "Feed/Reclaim", "Gearbox", `Gearbox – ${feederName}`, "GBX", "Drive"),
  createComponent(feederName, `${assetNumber}-CHN01`, parentAsset, area, subArea, "Feed/Reclaim", "Chain", `Chain – ${feederName}`, "CHN", "Support"),
  createComponent(feederName, `${assetNumber}-SPK01`, parentAsset, area, subArea, "Feed/Reclaim", "Sprocket", `Drive Sprocket – ${feederName}`, "SPK", "Drive"),
  createComponent(feederName, `${assetNumber}-SPK02`, parentAsset, area, subArea, "Feed/Reclaim", "Sprocket", `Tail Sprocket – ${feederName}`, "SPK", "Support"),
  createComponent(feederName, `${assetNumber}-BRG01`, parentAsset, area, subArea, "Feed/Reclaim", "Bearing", `Drive Shaft Bearing – ${feederName}`, "BRG", "Support"),
  createComponent(feederName, `${assetNumber}-BRG02`, parentAsset, area, subArea, "Feed/Reclaim", "Bearing", `Tail Shaft Bearing – ${feederName}`, "BRG", "Support"),
];

// ==================== PUMP COMPONENTS ====================
const pumpComponents = (
  pumpName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string,
  system: string
): ComponentItem[] => [
  createComponent(pumpName, `${assetNumber}-MTR01`, parentAsset, area, subArea, system, "Motor", `Motor – ${pumpName}`, "MTR", "Drive"),
  createComponent(pumpName, `${assetNumber}-PMP01`, parentAsset, area, subArea, system, "Pump", `Pump – ${pumpName}`, "PMP", "Drive"),
  createComponent(pumpName, `${assetNumber}-IMP01`, parentAsset, area, subArea, system, "Impeller", `Impeller – ${pumpName}`, "IMP", "Support"),
  createComponent(pumpName, `${assetNumber}-SEL01`, parentAsset, area, subArea, system, "Seal", `Mechanical Seal – ${pumpName}`, "SEL", "Support"),
  createComponent(pumpName, `${assetNumber}-BRG01`, parentAsset, area, subArea, system, "Bearing", `Bearing Assembly – ${pumpName}`, "BRG", "Support"),
  createComponent(pumpName, `${assetNumber}-CPL01`, parentAsset, area, subArea, system, "Coupling", `Coupling – ${pumpName}`, "CPL", "Drive"),
];

// ==================== SLURRY PUMP COMPONENTS (Belt-Driven) ====================
const slurryPumpComponents = (
  pumpName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string,
  system: string
): ComponentItem[] => [
  createComponent(pumpName, `${assetNumber}-MTR01`, parentAsset, area, subArea, system, "Motor", `Motor – ${pumpName}`, "MTR", "Drive"),
  createComponent(pumpName, `${assetNumber}-PMP01`, parentAsset, area, subArea, system, "Pump", `Pump Wet End – ${pumpName}`, "PMP", "Drive"),
  createComponent(pumpName, `${assetNumber}-IMP01`, parentAsset, area, subArea, system, "Impeller", `Impeller – ${pumpName}`, "IMP", "Support"),
  createComponent(pumpName, `${assetNumber}-LNR01`, parentAsset, area, subArea, system, "Liner", `Pump Liner – ${pumpName}`, "LNR", "Support"),
  createComponent(pumpName, `${assetNumber}-BRG01`, parentAsset, area, subArea, system, "Bearing", `Bearing Assembly – ${pumpName}`, "BRG", "Support"),
  createComponent(pumpName, `${assetNumber}-BLT01`, parentAsset, area, subArea, system, "Belt", `Drive Belt – ${pumpName}`, "BLT", "Drive"),
  createComponent(pumpName, `${assetNumber}-SEL01`, parentAsset, area, subArea, system, "Seal", `Gland Packing – ${pumpName}`, "SEL", "Support"),
];

// ==================== AGITATOR COMPONENTS ====================
const agitatorComponents = (
  agitatorName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string,
  system: string
): ComponentItem[] => [
  createComponent(agitatorName, `${assetNumber}-MTR01`, parentAsset, area, subArea, system, "Motor", `Motor – ${agitatorName}`, "MTR", "Drive"),
  createComponent(agitatorName, `${assetNumber}-GBX01`, parentAsset, area, subArea, system, "Gearbox", `Gearbox – ${agitatorName}`, "GBX", "Drive"),
  createComponent(agitatorName, `${assetNumber}-IMP01`, parentAsset, area, subArea, system, "Impeller", `Impeller – ${agitatorName}`, "IMP", "Support"),
  createComponent(agitatorName, `${assetNumber}-SHF01`, parentAsset, area, subArea, system, "Shaft", `Shaft – ${agitatorName}`, "SHF", "Support"),
  createComponent(agitatorName, `${assetNumber}-BRG01`, parentAsset, area, subArea, system, "Bearing", `Bearing – ${agitatorName}`, "BRG", "Support"),
  createComponent(agitatorName, `${assetNumber}-SEL01`, parentAsset, area, subArea, system, "Seal", `Shaft Seal – ${agitatorName}`, "SEL", "Support"),
];

// ==================== BALL MILL COMPONENTS ====================
const ballMillComponents = (
  millName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(millName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Grinding", "Motor", `Main Motor – ${millName}`, "MTR", "Drive"),
  createComponent(millName, `${assetNumber}-GBX01`, parentAsset, area, subArea, "Grinding", "Gearbox", `Gear Reducer – ${millName}`, "GBX", "Drive"),
  createComponent(millName, `${assetNumber}-PIN01`, parentAsset, area, subArea, "Grinding", "Pinion", `Pinion – ${millName}`, "PIN", "Drive"),
  createComponent(millName, `${assetNumber}-GIR01`, parentAsset, area, subArea, "Grinding", "Girth Gear", `Girth Gear – ${millName}`, "GIR", "Drive"),
  createComponent(millName, `${assetNumber}-TRN01`, parentAsset, area, subArea, "Grinding", "Trunnion", `Trunnion – ${millName}`, "TRN", "Support"),
  createComponent(millName, `${assetNumber}-BRG01`, parentAsset, area, subArea, "Grinding", "Bearing", `Feed End Bearing – ${millName}`, "BRG", "Support"),
  createComponent(millName, `${assetNumber}-BRG02`, parentAsset, area, subArea, "Grinding", "Bearing", `Discharge End Bearing – ${millName}`, "BRG", "Support"),
  createComponent(millName, `${assetNumber}-LNR01`, parentAsset, area, subArea, "Grinding", "Liner", `Mill Liner – ${millName}`, "LNR", "Support"),
  createComponent(millName, `${assetNumber}-CPL01`, parentAsset, area, subArea, "Grinding", "Coupling", `Coupling – ${millName}`, "CPL", "Drive"),
];

// ==================== SCREEN COMPONENTS ====================
const screenComponents = (
  screenName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string,
  system: string
): ComponentItem[] => [
  createComponent(screenName, `${assetNumber}-MTR01`, parentAsset, area, subArea, system, "Motor", `Exciter Motor – ${screenName}`, "MTR", "Drive"),
  createComponent(screenName, `${assetNumber}-EXC01`, parentAsset, area, subArea, system, "Exciter", `Exciter – ${screenName}`, "EXC", "Drive"),
  createComponent(screenName, `${assetNumber}-SCN01`, parentAsset, area, subArea, system, "Screen", `Screen Deck – ${screenName}`, "SCN", "Support"),
  createComponent(screenName, `${assetNumber}-SPR01`, parentAsset, area, subArea, system, "Spring", `Springs – ${screenName}`, "SPR", "Support"),
  createComponent(screenName, `${assetNumber}-BRG01`, parentAsset, area, subArea, system, "Bearing", `Exciter Bearing – ${screenName}`, "BRG", "Support"),
];

// ==================== GENERATOR COMPONENTS ====================
const generatorComponents = (
  genName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(genName, `${assetNumber}-ENG01`, parentAsset, area, subArea, "Power Generation", "Engine", `Engine – ${genName}`, "ENG", "Drive"),
  createComponent(genName, `${assetNumber}-ALT01`, parentAsset, area, subArea, "Power Generation", "Alternator", `Alternator – ${genName}`, "ALT", "Drive"),
  createComponent(genName, `${assetNumber}-RAD01`, parentAsset, area, subArea, "Power Generation", "Radiator", `Radiator – ${genName}`, "RAD", "Support"),
  createComponent(genName, `${assetNumber}-FLT01`, parentAsset, area, subArea, "Power Generation", "Filter", `Air Filter – ${genName}`, "FLT", "Support"),
  createComponent(genName, `${assetNumber}-FLT02`, parentAsset, area, subArea, "Power Generation", "Filter", `Fuel Filter – ${genName}`, "FLT", "Support"),
  createComponent(genName, `${assetNumber}-FLT03`, parentAsset, area, subArea, "Power Generation", "Filter", `Oil Filter – ${genName}`, "FLT", "Support"),
  createComponent(genName, `${assetNumber}-BLT01`, parentAsset, area, subArea, "Power Generation", "Belt", `Drive Belt – ${genName}`, "BLT", "Drive"),
];

// ==================== COMPRESSOR COMPONENTS ====================
const compressorComponents = (
  compName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(compName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Compressed Air", "Motor", `Motor – ${compName}`, "MTR", "Drive"),
  createComponent(compName, `${assetNumber}-CMP01`, parentAsset, area, subArea, "Compressed Air", "Compressor", `Compressor Element – ${compName}`, "CMP", "Drive"),
  createComponent(compName, `${assetNumber}-FLT01`, parentAsset, area, subArea, "Compressed Air", "Filter", `Air Filter – ${compName}`, "FLT", "Support"),
  createComponent(compName, `${assetNumber}-FLT02`, parentAsset, area, subArea, "Compressed Air", "Filter", `Oil Filter – ${compName}`, "FLT", "Support"),
  createComponent(compName, `${assetNumber}-SEP01`, parentAsset, area, subArea, "Compressed Air", "Separator", `Oil Separator – ${compName}`, "SEP", "Support"),
  createComponent(compName, `${assetNumber}-CLR01`, parentAsset, area, subArea, "Compressed Air", "Cooler", `Cooler – ${compName}`, "CLR", "Support"),
];

// ==================== THICKENER COMPONENTS ====================
const thickenerComponents = (
  thkName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(thkName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Thickening", "Motor", `Rake Drive Motor – ${thkName}`, "MTR", "Drive"),
  createComponent(thkName, `${assetNumber}-GBX01`, parentAsset, area, subArea, "Thickening", "Gearbox", `Rake Drive Gearbox – ${thkName}`, "GBX", "Drive"),
  createComponent(thkName, `${assetNumber}-RKE01`, parentAsset, area, subArea, "Thickening", "Rake", `Rake Assembly – ${thkName}`, "RKE", "Support"),
  createComponent(thkName, `${assetNumber}-HPU01`, parentAsset, area, subArea, "Thickening", "Hydraulic Pack", `Hydraulic Power Unit – ${thkName}`, "HPU", "Drive"),
  createComponent(thkName, `${assetNumber}-FDW01`, parentAsset, area, subArea, "Thickening", "Feedwell", `Feedwell – ${thkName}`, "FDW", "Support"),
];

// ==================== FILTER PRESS COMPONENTS ====================
const filterPressComponents = (
  fpName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(fpName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Filtering", "Motor", `HPU Motor – ${fpName}`, "MTR", "Drive"),
  createComponent(fpName, `${assetNumber}-HPU01`, parentAsset, area, subArea, "Filtering", "Hydraulic Pack", `Hydraulic Power Unit – ${fpName}`, "HPU", "Drive"),
  createComponent(fpName, `${assetNumber}-CYL01`, parentAsset, area, subArea, "Filtering", "Cylinder", `Main Cylinder – ${fpName}`, "CYL", "Support"),
  createComponent(fpName, `${assetNumber}-CLT01`, parentAsset, area, subArea, "Filtering", "Filter Cloth", `Filter Cloths – ${fpName}`, "CLT", "Support"),
  createComponent(fpName, `${assetNumber}-PLT01`, parentAsset, area, subArea, "Filtering", "Filter Plate", `Filter Plates – ${fpName}`, "PLT", "Support"),
  createComponent(fpName, `${assetNumber}-CHN01`, parentAsset, area, subArea, "Filtering", "Chain", `Plate Shifter Chain – ${fpName}`, "CHN", "Support"),
];

// ==================== CYCLONE COMPONENTS ====================
const cycloneComponents = (
  cycName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(cycName, `${assetNumber}-CYC01`, parentAsset, area, subArea, "Classification", "Cyclone", `Cyclone Body – ${cycName}`, "CYC", "Support"),
  createComponent(cycName, `${assetNumber}-VTX01`, parentAsset, area, subArea, "Classification", "Vortex Finder", `Vortex Finder – ${cycName}`, "VTX", "Support"),
  createComponent(cycName, `${assetNumber}-SPG01`, parentAsset, area, subArea, "Classification", "Spigot", `Spigot – ${cycName}`, "SPG", "Support"),
  createComponent(cycName, `${assetNumber}-LNR01`, parentAsset, area, subArea, "Classification", "Liner", `Cyclone Liner – ${cycName}`, "LNR", "Support"),
];

// ==================== KNELSON CONCENTRATOR COMPONENTS ====================
const knelsonComponents = (
  kncName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(kncName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Gravity Circuit", "Motor", `Motor – ${kncName}`, "MTR", "Drive"),
  createComponent(kncName, `${assetNumber}-CON01`, parentAsset, area, subArea, "Gravity Circuit", "Concentrator", `Cone – ${kncName}`, "CON", "Support"),
  createComponent(kncName, `${assetNumber}-BRG01`, parentAsset, area, subArea, "Gravity Circuit", "Bearing", `Bearing – ${kncName}`, "BRG", "Support"),
  createComponent(kncName, `${assetNumber}-SEL01`, parentAsset, area, subArea, "Gravity Circuit", "Seal", `Seal – ${kncName}`, "SEL", "Support"),
];

// ==================== ELUTION COLUMN COMPONENTS ====================
const elutionColumnComponents = (
  colName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(colName, `${assetNumber}-COL01`, parentAsset, area, subArea, "Elution", "Column", `Column Vessel – ${colName}`, "COL", "Support"),
  createComponent(colName, `${assetNumber}-FLT01`, parentAsset, area, subArea, "Elution", "Filter", `Column Filters – ${colName}`, "FLT", "Support"),
  createComponent(colName, `${assetNumber}-VLV01`, parentAsset, area, subArea, "Elution", "Valve", `Inlet Valve – ${colName}`, "VLV", "Control"),
  createComponent(colName, `${assetNumber}-VLV02`, parentAsset, area, subArea, "Elution", "Valve", `Outlet Valve – ${colName}`, "VLV", "Control"),
];

// ==================== KILN COMPONENTS ====================
const kilnComponents = (
  kilnName: string,
  assetNumber: string,
  parentAsset: string,
  area: string,
  subArea: string
): ComponentItem[] => [
  createComponent(kilnName, `${assetNumber}-MTR01`, parentAsset, area, subArea, "Regeneration", "Motor", `Kiln Drive Motor – ${kilnName}`, "MTR", "Drive"),
  createComponent(kilnName, `${assetNumber}-GBX01`, parentAsset, area, subArea, "Regeneration", "Gearbox", `Kiln Gearbox – ${kilnName}`, "GBX", "Drive"),
  createComponent(kilnName, `${assetNumber}-BRN01`, parentAsset, area, subArea, "Regeneration", "Burner", `Burner – ${kilnName}`, "BRN", "Drive"),
  createComponent(kilnName, `${assetNumber}-SHL01`, parentAsset, area, subArea, "Regeneration", "Shell", `Kiln Shell – ${kilnName}`, "SHL", "Support"),
  createComponent(kilnName, `${assetNumber}-TYR01`, parentAsset, area, subArea, "Regeneration", "Tyre", `Kiln Tyre – ${kilnName}`, "TYR", "Support"),
  createComponent(kilnName, `${assetNumber}-ROL01`, parentAsset, area, subArea, "Regeneration", "Roller", `Support Roller – ${kilnName}`, "ROL", "Support"),
];

// ==================== GENERATE ALL COMPONENTS ====================
const baseComponentData: ComponentItem[] = [
  // === UTILITIES & POWER ===
  // Compressed Air
  ...compressorComponents("Air Compressor 1", "COMP01", "COMP01 Air Compressor 1", "UTL", "Compressed Air"),
  ...compressorComponents("HP Air Compressor 1", "HPCP01", "HPCP01 HP Air Compressor", "UTL", "Compressed Air"),
  ...compressorComponents("HP Air Compressor 2", "HPCP02", "HPCP01 HP Air Compressor", "UTL", "Compressed Air"),
  ...compressorComponents("HP Air Compressor 3", "HPCP03", "HPCP01 HP Air Compressor", "UTL", "Compressed Air"),
  ...compressorComponents("HP Air Compressor 4", "HPCP04", "HPCP01 HP Air Compressor", "UTL", "Compressed Air"),

  // Power Generation
  ...generatorComponents("Power Station Generator 1", "GEN01", "GEN01 Generators", "UTL", "Power Generation"),
  ...generatorComponents("Power Station Generator 2", "GEN02", "GEN01 Generators", "UTL", "Power Generation"),
  ...generatorComponents("Power Station Generator 3", "GEN03", "GEN01 Generators", "UTL", "Power Generation"),
  ...generatorComponents("Power Station Generator 4", "GEN04", "GEN01 Generators", "UTL", "Power Generation"),
  ...generatorComponents("Power Station Generator 5", "GEN05", "GEN01 Generators", "UTL", "Power Generation"),
  ...generatorComponents("Power Station Generator 6", "GEN06", "GEN01 Generators", "UTL", "Power Generation"),
  ...generatorComponents("Power Station Generator 7", "GEN07", "GEN01 Generators", "UTL", "Power Generation"),
  ...generatorComponents("Power Station Generator 8", "GEN08", "GEN01 Generators", "UTL", "Power Generation"),

  // Water Systems
  ...pumpComponents("Potable Water Pump Duty", "PWT01-PMP02", "PWT01 Potable Water Tank", "UTL", "Water", "Water"),
  ...pumpComponents("Potable Water Pump Standby", "PWT01-PMP01", "PWT01 Potable Water Tank", "UTL", "Water", "Water"),
  ...pumpComponents("Raw Water Pump Duty", "RWT01-PMP01", "RWT01 Raw Water Tank", "UTL", "Water", "Water"),
  ...pumpComponents("Raw Water Pump Standby", "RWT01-PMP02", "RWT01 Raw Water Tank", "UTL", "Water", "Water"),
  ...pumpComponents("Process Water Pump Duty", "UTL-PW-PMP-D", "PWP01 Process Water System", "UTL", "Water", "Water"),
  ...pumpComponents("Process Water Pump Standby", "UTL-PW-PMP-S", "PWP01 Process Water System", "UTL", "Water", "Water"),
  ...pumpComponents("Gland Water Pump Duty", "GWTR01-PMP01", "GWTR01 Gland Water System", "UTL", "Water", "Water"),
  ...pumpComponents("Gland Water Pump Standby", "GWTR01-PMP02", "GWTR01 Gland Water System", "UTL", "Water", "Water"),

  // Reagents
  ...pumpComponents("Lime Dosing Pump", "LDOS01-PMP01", "LDOS01 Lime Dosing System", "UTL", "Reagents", "Reagents"),
  ...agitatorComponents("Lime Mixing Agitator", "LDOS01-AGT01", "LDOS01 Lime Dosing System", "UTL", "Reagents", "Reagents"),
  ...pumpComponents("Cyanide Dosing Pump Duty", "CDOS01-PMP01", "CDOS01 Cyanide Dosing System", "UTL", "Reagents", "Reagents"),
  ...pumpComponents("Cyanide Dosing Pump Standby", "CDOS01-PMP02", "CDOS01 Cyanide Dosing System", "UTL", "Reagents", "Reagents"),
  ...pumpComponents("Cyanide Solution Transfer Pump", "PMP09", "CMIX01 Cyanide Mixing System", "UTL", "Reagents", "Reagents"),
  ...agitatorComponents("Cyanide Mixing Tank Agitator", "CYN-MIX-AGT-01", "CMIX01 Cyanide Mixing System", "UTL", "Reagents", "Reagents"),
  ...pumpComponents("Cyanide Area Sump Pump", "CSMP01-PMP01", "CSMP01 Cyanide Area Sump", "UTL", "Reagents", "Reagents"),
  ...pumpComponents("Caustic Dosing Pump", "CAUS01-PMP01", "CAUS01 Caustic Dosing System", "UTL", "Reagents", "Reagents"),
  ...pumpComponents("Floc Dosing Pump", "FLOC01-PMP01", "FLOC01 Floc System", "UTL", "Reagents", "Reagents"),
  ...agitatorComponents("Floc Mixing Agitator", "FLOC01-AGT01", "FLOC01 Floc System", "UTL", "Reagents", "Reagents"),

  // === COMMINUTION / PROCESS ===
  // Feed / Reclaim
  ...apronFeederComponents("Apron Feeder", "APRN01", "APRN01 Apron Feeder", "COM", "Feed / Reclaim"),
  ...conveyorComponents("Mill Feed Conveyor", "MFC01", "MFC01 Mill Feed Conveyor", "COM", "Feed / Reclaim"),

  // Conveying
  ...conveyorComponents("Transfer Conveyor CV01", "CV01", "CV01 Transfer Conveyor", "COM", "Conveying"),
  ...conveyorComponents("Ball Mill Scatts Conveyor CV02", "CV02", "CV02 Ball Mill Scatts Conveyor", "COM", "Conveying"),

  // Grinding
  ...ballMillComponents("Primary Ball Mill", "BM01", "BM01 Primary Ball Mill", "COM", "Grinding"),
  ...pumpComponents("Low Pressure Lube Pump Duty", "GRD-LP-LPUMP-D", "BM01 Primary Ball Mill", "COM", "Grinding", "Grinding"),
  ...pumpComponents("Low Pressure Lube Pump Standby", "GRD-LP-LPUMP-S", "BM01 Primary Ball Mill", "COM", "Grinding", "Grinding"),
  ...pumpComponents("High Pressure Lube Pump", "GRD-LP-HPUMP", "BM01 Primary Ball Mill", "COM", "Grinding", "Grinding"),
  ...slurryPumpComponents("Grinding Area Sump Pump", "GSPMP01-PMP01", "GSPMP01 Grinding Sump", "COM", "Grinding", "Grinding"),

  // Classification
  ...slurryPumpComponents("Primary Cyclone Feed Pump A", "PCFPA01", "PCFPA01 Primary Cyclone Feed Pump A", "COM", "Feed / Reclaim", "Classification"),
  ...slurryPumpComponents("Primary Cyclone Feed Pump B", "PCFPB01", "PCFPB01 Primary Cyclone Feed Pump B", "COM", "Feed / Reclaim", "Classification"),
  ...slurryPumpComponents("Cyclone Feed Pump Duty", "CFP01-A", "CYC01 Cyclone Cluster", "COM", "Classification", "Classification"),
  ...slurryPumpComponents("Cyclone Feed Pump Standby", "CFP01-B", "CYC01 Cyclone Cluster", "COM", "Classification", "Classification"),
  ...cycloneComponents("Primary Cyclone 1", "CYC01-1", "CYC01 Cyclone Cluster", "COM", "Classification"),
  ...cycloneComponents("Primary Cyclone 2", "CYC01-2", "CYC01 Cyclone Cluster", "COM", "Classification"),
  ...cycloneComponents("Primary Cyclone 3", "CYC01-3", "CYC01 Cyclone Cluster", "COM", "Classification"),

  // === GOLD RECOVERY ===
  // Gravity Circuit
  ...screenComponents("Gravity Screen", "SCR01", "SCR01 Gravity Concentrator", "REC", "Gravity Circuit", "Gravity Circuit"),
  ...knelsonComponents("Knelson Concentrator", "KNC01", "SCR01 Gravity Concentrator", "REC", "Gravity Circuit"),
  ...pumpComponents("Gravity Concentrate Pump", "GCP01", "GCP01 Gravity Concentrate Pump", "REC", "Gravity Circuit", "Gravity Circuit"),

  // CIP
  ...agitatorComponents("Leach Tank 1 Agitator", "AGT01", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...agitatorComponents("Leach Tank 2 Agitator", "AGT02", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...agitatorComponents("CIP Tank 3 Agitator", "CIP-TK03-AGT01", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...agitatorComponents("CIP Tank 4 Agitator", "CIP-TK04-AGT01", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...agitatorComponents("CIP Tank 5 Agitator", "CIP-TK05-AGT01", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...agitatorComponents("CIP Tank 6 Agitator", "CIP-TK06-AGT01", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...agitatorComponents("CIP Tank 7 Agitator", "CIP-TK07-AGT01", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...agitatorComponents("CIP Tank 8 Agitator", "CIP-TK08-AGT01", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...slurryPumpComponents("CIP Area Sump Pump Duty", "CIP-SUMP-PMP-D", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...slurryPumpComponents("CIP Area Sump Pump Standby", "CIP-SUMP-PMP-S", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...screenComponents("Intertank Screen", "CIP-SCR-INT", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...screenComponents("Carbon Safety Screen", "SCR03", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...screenComponents("Loaded Carbon Screen", "SCR04", "CIP-TK01 CIP Tanks", "REC", "CIP", "CIP"),
  ...screenComponents("CIP Feed Trash Screen", "CPTS01", "CPTS01 CIP Feed Trash Screen", "REC", "CIP", "CIP"),

  // Elution
  ...elutionColumnComponents("Acid Wash Column", "COL01", "COL01 Elution Column", "REC", "Elution"),
  ...elutionColumnComponents("Elution Column", "COL02", "COL01 Elution Column", "REC", "Elution"),
  ...pumpComponents("HCL Acid Dosing Pump", "PMP10", "COL01 Elution Column", "REC", "Elution", "Elution"),
  ...pumpComponents("Elution Column Sump Pump", "PMP12", "COL01 Elution Column", "REC", "Elution", "Elution"),

  // Regeneration
  ...kilnComponents("Carbon Regeneration Kiln", "CREG01-KIL01", "CREG01 Carbon Regeneration Kiln", "REC", "Regeneration"),
  ...screenComponents("Carbon Sizing Screen", "CSZS01", "CREG01 Carbon Quench", "REC", "Regeneration", "Regeneration"),
  ...pumpComponents("Carbon Transfer Pump", "RCTR01-PMP01", "RCTR01 Regenerated Carbon Transfer", "REC", "Regeneration", "Regeneration"),
  ...pumpComponents("Regen Area Sump Pump", "RSMP01-PMP01", "RSMP01 Regen Area Sump", "REC", "Regeneration", "Regeneration"),

  // Gold Room
  ...pumpComponents("Electrowinning Cell Feed Pump", "EWCL01-PMP01", "EWCL01 Electrowinning Cell", "REC", "Gold Room", "Gold Room"),
  ...pumpComponents("Cathode Wash Sludge Pump", "PMP15", "WSH01 Cathode Washdown System", "REC", "Gold Room", "Gold Room"),

  // === TAILINGS ===
  // Thickening
  ...thickenerComponents("Tails Thickener", "THK01", "THK01 Thickener", "TAIL", "Thickening"),
  ...slurryPumpComponents("CIP Tails Area Sump Pump", "CIPSMP01", "THKUFP-A Thickener Underflow Pump", "TAIL", "Thickening", "Thickening"),
  ...slurryPumpComponents("Thickener Underflow Pump A", "THKUFP-A", "THKUFP-A Thickener Underflow Pump", "TAIL", "Thickening", "Thickening"),
  ...slurryPumpComponents("Thickener Underflow Pump B", "THKUFP-B", "THKUFP-A Thickener Underflow Pump", "TAIL", "Thickening", "Thickening"),
  ...slurryPumpComponents("CIP Tailings Pump A", "CIPPMP-A", "THKUFP-A Thickener Underflow Pump", "TAIL", "Thickening", "Thickening"),
  ...slurryPumpComponents("CIP Tailings Pump B", "CIPPMP-B", "THKUFP-A Thickener Underflow Pump", "TAIL", "Thickening", "Thickening"),

  // Filtering
  ...filterPressComponents("Filter Press", "FP01", "FP01 Filter Press", "TAIL", "Filtering"),
  ...pumpComponents("Filtrate Pump Duty", "FILT01-PMP01", "FILT01 Filtrate Pump", "TAIL", "Filtering", "Filtering"),
  ...pumpComponents("Filtrate Pump Standby", "FILT01-PMP02", "FILT01 Filtrate Pump", "TAIL", "Filtering", "Filtering"),
  ...pumpComponents("Filter Feed Pump Duty", "FFD01-PMP01", "FFD01 Filter Feed Pump", "TAIL", "Filtering", "Filtering"),
  ...pumpComponents("Filter Feed Pump Standby", "FFD01-PMP02", "FFD01 Filter Feed Pump", "TAIL", "Filtering", "Filtering"),
  ...conveyorComponents("Tailings Conveyor", "TC01", "TC01 Tailings Conveyor", "TAIL", "Filtering"),
];

// Also include any P&ID-mapped assets that aren't represented by the generic component templates yet.
// This makes the P&ID column fully scrollable/searchable using the provided mapping list.
const existingAssetNumbers = new Set(baseComponentData.map((c) => c.assetNumber));

const pidMappedRows: ComponentItem[] = pidTagMappings
  .filter((m) => m.status === "mapped")
  .filter((m) => !existingAssetNumbers.has(m.assetNumber))
  .map((m) => {
    const inferred = inferComponentTypeFromAssetNumber(m.assetNumber);
    const inferredArea = inferAreaFromPidTag(m.pidTag);

    return {
      id: generateId(),
      assetName: m.description,
      assetNumber: m.assetNumber,
      parentAsset: "",
      area: inferredArea || "",
      subArea: "",
      system: "",
      componentType: inferred.type,
      componentName: m.description,
      componentAbbreviation: inferred.abbrev,
      componentFunction: "",
      oemManufacturer: "",
      oemModel: "",
      oemSerialNumber: "",
      pidTag: m.pidTag,
      notes: "",
      status: "Identified",
    };
  });

export const initialComponentData: ComponentItem[] = [...baseComponentData, ...pidMappedRows];
