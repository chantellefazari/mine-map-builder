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

// Infer Area, Sub-Area, System, and Parent Asset from P&ID tag prefix
const inferMetadataFromPidTag = (
  pidTag: string,
  description: string
): { area: string; subArea: string; system: string; parentAsset: string } => {
  const prefix = pidTag.split("-")[0]?.trim();
  const descLower = description.toLowerCase();

  // Determine area
  let area = "";
  let subArea = "";
  let system = "";
  let parentAsset = "";

  switch (prefix) {
    case "04":
      area = "COM";
      // Determine sub-area based on description keywords
      if (descLower.includes("conveyor") || descLower.includes("feeder")) {
        subArea = "Feed / Reclaim";
        system = "Conveying";
        if (descLower.includes("transfer")) parentAsset = "CV01 Transfer Conveyor";
        else if (descLower.includes("mill feed")) parentAsset = "MFC01 Mill Feed Conveyor";
        else if (descLower.includes("reclaim") || descLower.includes("apron")) parentAsset = "APRN01 Apron Feeder";
        else if (descLower.includes("scatts")) parentAsset = "CV02 Ball Mill Scatts Conveyor";
      } else if (descLower.includes("mill") || descLower.includes("lube") || descLower.includes("gear")) {
        subArea = "Grinding";
        system = "Grinding";
        parentAsset = "BM01 Primary Ball Mill";
      } else if (descLower.includes("cyclone")) {
        subArea = "Classification";
        system = "Classification";
        parentAsset = "CYC01 Cyclone Cluster";
      } else if (descLower.includes("gravity") || descLower.includes("knelson") || descLower.includes("shaking table") || descLower.includes("concentrate")) {
        subArea = "Gravity Circuit";
        system = "Gravity Circuit";
        parentAsset = "GRV-SCR01 Gravity Circuit";
      } else if (descLower.includes("lime")) {
        subArea = "Reagents";
        system = "Reagents";
        parentAsset = "LSILO01 Lime System";
      }
      break;

    case "05":
      area = "REC";
      if (descLower.includes("cip") || descLower.includes("leach") || descLower.includes("tank") || descLower.includes("agitator") || descLower.includes("carbon")) {
        subArea = "CIP";
        system = "CIP";
        // Determine parent based on tank number
        if (descLower.includes("tank 1") || descLower.includes("tk-001")) parentAsset = "CIP-TK01 CIP Leach Tank 1";
        else if (descLower.includes("tank 2") || descLower.includes("tk-002")) parentAsset = "CIP-TK02 CIP Leach Tank 2";
        else if (descLower.includes("tank 3") || descLower.includes("tk-003")) parentAsset = "CIP-TK03 CIP Tank 3";
        else if (descLower.includes("tank 4") || descLower.includes("tk-004")) parentAsset = "CIP-TK04 CIP Tank 4";
        else if (descLower.includes("tank 5") || descLower.includes("tk-005")) parentAsset = "CIP-TK05 CIP Tank 5";
        else if (descLower.includes("tank 6") || descLower.includes("tk-006")) parentAsset = "CIP-TK06 CIP Tank 6";
        else if (descLower.includes("tank 7") || descLower.includes("tk-007")) parentAsset = "CIP-TK07 CIP Tank 7";
        else if (descLower.includes("tank 8") || descLower.includes("tk-008")) parentAsset = "CIP-TK08 CIP Tank 8";
        else if (descLower.includes("trash screen")) parentAsset = "CPTS01 CIP Feed Trash Screen";
        else if (descLower.includes("loaded carbon")) parentAsset = "SCR04 Loaded Carbon Screen";
        else if (descLower.includes("safety screen")) parentAsset = "SCR03 Carbon Safety Screen";
        else if (descLower.includes("intertank") || descLower.includes("inter tank")) parentAsset = "CIP-SCR-INT Intertank Screen";
        else if (descLower.includes("tailings") || descLower.includes("tails")) parentAsset = "CIP-TAIL CIP Tailings";
        else parentAsset = "CIP-TK01 CIP Tanks";
      } else if (descLower.includes("compressor") || descLower.includes("air")) {
        subArea = "Compressed Air";
        system = "Compressed Air";
        parentAsset = "SVC-CMP01 HP Air Compressor";
      }
      break;

    case "06":
      area = "UTL";
      subArea = "Reagents";
      system = "Reagents";
      if (descLower.includes("cyanide")) {
        if (descLower.includes("mixing")) parentAsset = "CMIX01 Cyanide Mixing System";
        else if (descLower.includes("dosing")) parentAsset = "CDOS01 Cyanide Dosing System";
        else if (descLower.includes("storage")) parentAsset = "CSTR01 Cyanide Storage";
        else if (descLower.includes("sump")) parentAsset = "CSMP01 Cyanide Area Sump";
        else parentAsset = "RGT-CYN Cyanide System";
      } else if (descLower.includes("caustic")) {
        parentAsset = "CAUS01 Caustic Dosing System";
      } else {
        parentAsset = "RGT-01 Reagents Area";
      }
      break;

    case "08":
      area = "REC";
      subArea = "Elution";
      system = "Elution";
      if (descLower.includes("electrowinning")) parentAsset = "EWCL01 Electrowinning Cell";
      else if (descLower.includes("regen") || descLower.includes("kiln")) parentAsset = "CREG01 Carbon Regeneration Kiln";
      else if (descLower.includes("cathode") || descLower.includes("gold room") || descLower.includes("bullion") || descLower.includes("furnace") || descLower.includes("calcine")) {
        subArea = "Gold Room";
        system = "Gold Room";
        parentAsset = "GR01 Gold Room";
      } else if (descLower.includes("elution") || descLower.includes("eluate") || descLower.includes("acid wash") || descLower.includes("heater")) {
        parentAsset = "ELU01 Elution System";
      } else {
        parentAsset = "ELU01 Elution Area";
      }
      break;

    case "11":
      area = "UTL";
      subArea = "Water";
      system = "Water";
      if (descLower.includes("potable")) parentAsset = "PWT01 Potable Water Tank";
      else if (descLower.includes("raw water")) parentAsset = "RWT01 Raw Water Tank";
      else if (descLower.includes("gland")) parentAsset = "GWTR01 Gland Water System";
      else if (descLower.includes("process water")) parentAsset = "PWP01 Process Water System";
      else if (descLower.includes("safety shower")) parentAsset = "SSHW01 Safety Shower Water System";
      else parentAsset = "SVC01 Services";
      break;

    case "12":
      area = "TAIL";
      subArea = "Thickening";
      system = "Thickening";
      if (descLower.includes("thickener")) parentAsset = "THK01 Thickener";
      else if (descLower.includes("floc")) parentAsset = "FLOC01 Floc System";
      else parentAsset = "TAL01 Tails Area";
      break;

    case "13":
      area = "TAIL";
      subArea = "Filtering";
      system = "Filtering";
      if (descLower.includes("filter press 1") || descLower.includes("filter 1")) parentAsset = "FP01 Filter Press 1";
      else if (descLower.includes("filter press 2") || descLower.includes("filter 2")) parentAsset = "FP02 Filter Press 2";
      else if (descLower.includes("stacker") || descLower.includes("radial")) parentAsset = "CV04 Radial Stacker Conveyor";
      else if (descLower.includes("collection conveyor")) parentAsset = "CV03 Collection Conveyor";
      else if (descLower.includes("compressor")) parentAsset = "FLT-CMP01 Filter Area HP Air Compressor";
      else parentAsset = "FP01 Filter Press";
      break;

    case "14":
    case "15":
      area = "SITE";
      subArea = "Mobile Equipment";
      system = "Mobile Equipment";
      parentAsset = "MOB01 Mobile Equipment";
      break;

    case "16":
      area = "SITE";
      subArea = "Buildings";
      system = "Buildings";
      parentAsset = "BLD01 Buildings";
      break;

    case "17":
      area = "UTL";
      subArea = "Power Generation";
      system = "Power Generation";
      if (descLower.includes("generator")) {
        const genMatch = pidTag.match(/GN-0*(\d+)/);
        if (genMatch) parentAsset = `GEN0${genMatch[1]} Power Station Generator ${genMatch[1]}`;
        else parentAsset = "GEN01 Generators";
      } else if (descLower.includes("sub station")) {
        parentAsset = "SUB01 Main Sub Station";
      } else {
        parentAsset = "PWR01 Power Generation";
      }
      break;

    case "18":
      area = "SITE";
      subArea = "Field MCCs";
      system = "Electrical";
      parentAsset = "MCC01 Field MCCs";
      break;

    default:
      // Distribution boards and misc
      if (descLower.includes("db") || descLower.includes("distribution") || descLower.includes("l&p") || descLower.includes("mcc")) {
        area = "SITE";
        subArea = "Electrical";
        system = "Electrical";
        parentAsset = "DB01 Distribution Boards";
      }
      break;
  }

  return { area, subArea, system, parentAsset };
};

const inferComponentTypeFromAssetNumber = (assetNumber: string): {
  type: string;
  abbrev: string;
} => {
  const upper = assetNumber.toUpperCase();

  if (/-MTR\d*$/.test(upper)) return { type: "Motor", abbrev: "MTR" };
  if (/-GBX\d*$/.test(upper)) return { type: "Gearbox", abbrev: "GBX" };
  if (/-VFD\d*$/.test(upper)) return { type: "VFD", abbrev: "VFD" };
  if (/-MCC\d*$/.test(upper)) return { type: "MCC", abbrev: "MCC" };
  if (/-LCS\d*$/.test(upper)) return { type: "LCS", abbrev: "LCS" };
  if (/-AGT\d*$/.test(upper)) return { type: "Agitator", abbrev: "AGT" };
  if (/-EXC\d*$/.test(upper)) return { type: "Exciter", abbrev: "EXC" };
  if (/-PMP\d*[A-Z]?$/.test(upper) || upper.includes("-PMP")) return { type: "Pump", abbrev: "PMP" };
  if (/-HPU\d*$/.test(upper)) return { type: "Hydraulic Pack", abbrev: "HPU" };
  if (/-VLV\d*$/.test(upper)) return { type: "Valve", abbrev: "VLV" };
  if (/-FLT\d*$/.test(upper)) return { type: "Filter", abbrev: "FLT" };
  if (/-CHU\d*$/.test(upper)) return { type: "Chute", abbrev: "CHU" };
  if (/-PNL\d*$/.test(upper) || upper.includes("-PNL")) return { type: "Panel", abbrev: "PNL" };
  if (/-INS\d*$/.test(upper)) return { type: "Instrument", abbrev: "INS" };
  if (/-TX\d*$/.test(upper) || /-SEN\d*$/.test(upper)) return { type: "Sensor", abbrev: "SEN" };
  if (/-PG\d*$/.test(upper) || /-TG\d*$/.test(upper)) return { type: "Gauge", abbrev: "GAU" };
  if (/-SHW\d*$/.test(upper)) return { type: "Safety Shower", abbrev: "SHW" };
  if (/-NZL\d*$/.test(upper)) return { type: "Nozzle", abbrev: "NZL" };
  if (/-AL\d*$/.test(upper)) return { type: "Air Lift", abbrev: "AL" };
  if (/-SPR\d*$/.test(upper)) return { type: "Spray Bar", abbrev: "SPR" };
  if (upper.includes("TK") || upper.includes("TANK")) return { type: "Tank", abbrev: "TK" };
  if (upper.includes("SCR") || upper.includes("SCREEN")) return { type: "Screen", abbrev: "SCR" };
  if (upper.includes("COL")) return { type: "Column", abbrev: "COL" };
  if (upper.includes("HTR") || upper.includes("HE-")) return { type: "Heater", abbrev: "HTR" };
  if (upper.includes("HX")) return { type: "Heat Exchanger", abbrev: "HX" };
  if (upper.includes("CRN") || upper.includes("HT-")) return { type: "Crane", abbrev: "CRN" };
  if (upper.includes("MNR") || upper.includes("MR-")) return { type: "Monorail", abbrev: "MNR" };
  if (upper.includes("BBR")) return { type: "Bag Breaker", abbrev: "BBR" };
  if (upper.includes("CW")) return { type: "Cathode Winder", abbrev: "CW" };
  if (upper.includes("EW")) return { type: "Electrowinning Cell", abbrev: "EW" };
  if (upper.includes("OVN")) return { type: "Oven", abbrev: "OVN" };
  if (upper.includes("KIL")) return { type: "Kiln", abbrev: "KIL" };
  if (upper.includes("FAN") || upper.includes("FA-")) return { type: "Fan", abbrev: "FAN" };
  if (upper.includes("BU-") || upper.includes("BRN")) return { type: "Burner", abbrev: "BRN" };
  if (upper.includes("GEN") || upper.includes("GN-")) return { type: "Generator", abbrev: "GEN" };
  if (upper.includes("CMP") || upper.includes("CP-")) return { type: "Compressor", abbrev: "CMP" };
  if (upper.includes("AR-")) return { type: "Air Receiver", abbrev: "AR" };
  if (upper.includes("CV-") || upper.includes("CONV")) return { type: "Conveyor", abbrev: "CV" };
  if (upper.includes("PIP")) return { type: "Piping", abbrev: "PIP" };
  if (upper.includes("DAM") || upper.includes("PND") || upper.includes("PD-")) return { type: "Pond/Dam", abbrev: "PND" };

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

// Enrich template-generated rows with P&ID tags where a mapping exists.
// Also add any P&ID-mapped assets not covered by the templates.
const existingAssetNumbers = new Set(baseComponentData.map((c) => c.assetNumber));

// Enrich template rows – ensure pidTag field is populated from the lookup
const enrichedBaseData: ComponentItem[] = baseComponentData.map((c) => {
  // If pidTag is already set, keep it; otherwise try to look it up
  if (c.pidTag) return c;
  const lookedUp = getPidTag(c.assetNumber);
  return lookedUp ? { ...c, pidTag: lookedUp } : c;
});

// Fallback metadata inference from description when P&ID prefix doesn't match
const inferMetadataFromDescription = (
  description: string
): { area: string; subArea: string; system: string; parentAsset: string } => {
  const descLower = description.toLowerCase();

  // Grinding / Mill related
  if (descLower.includes("mill") || descLower.includes("grinding") || descLower.includes("ball mill")) {
    return { area: "COM", subArea: "Grinding", system: "Grinding", parentAsset: "BM01 Primary Ball Mill" };
  }
  // Conveying
  if (descLower.includes("conveyor") || descLower.includes("feeder") || descLower.includes("apron")) {
    return { area: "COM", subArea: "Conveying", system: "Conveying", parentAsset: "CV01 Conveyors" };
  }
  // Cyclone / Classification
  if (descLower.includes("cyclone") || descLower.includes("classification")) {
    return { area: "COM", subArea: "Classification", system: "Classification", parentAsset: "CYC01 Cyclone Cluster" };
  }
  // CIP
  if (descLower.includes("cip") || descLower.includes("leach") || descLower.includes("agitator") || descLower.includes("carbon")) {
    return { area: "REC", subArea: "CIP", system: "CIP", parentAsset: "CIP-TK01 CIP Tanks" };
  }
  // Elution
  if (descLower.includes("elution") || descLower.includes("eluate") || descLower.includes("acid wash") || descLower.includes("column")) {
    return { area: "REC", subArea: "Elution", system: "Elution", parentAsset: "ELU01 Elution System" };
  }
  // Gold Room / Electrowinning
  if (descLower.includes("electrowin") || descLower.includes("gold room") || descLower.includes("cathode") || descLower.includes("furnace") || descLower.includes("bullion")) {
    return { area: "REC", subArea: "Gold Room", system: "Gold Room", parentAsset: "GR01 Gold Room" };
  }
  // Gravity
  if (descLower.includes("gravity") || descLower.includes("knelson") || descLower.includes("shaking table") || descLower.includes("concentrate")) {
    return { area: "REC", subArea: "Gravity Circuit", system: "Gravity Circuit", parentAsset: "GRV-SCR01 Gravity Circuit" };
  }
  // Regeneration / Kiln
  if (descLower.includes("regen") || descLower.includes("kiln") || descLower.includes("quench")) {
    return { area: "REC", subArea: "Regeneration", system: "Regeneration", parentAsset: "CREG01 Carbon Regeneration Kiln" };
  }
  // Thickener
  if (descLower.includes("thickener") || descLower.includes("thk")) {
    return { area: "TAIL", subArea: "Thickening", system: "Thickening", parentAsset: "THK01 Thickener" };
  }
  // Filter Press / Filtering
  if (descLower.includes("filter") || descLower.includes("filtrate") || descLower.includes("press")) {
    return { area: "TAIL", subArea: "Filtering", system: "Filtering", parentAsset: "FP01 Filter Press" };
  }
  // Tailings
  if (descLower.includes("tail") || descLower.includes("stacker")) {
    return { area: "TAIL", subArea: "Tailings", system: "Tailings", parentAsset: "TAL01 Tailings" };
  }
  // Reagents / Cyanide / Caustic / Lime
  if (descLower.includes("cyanide") || descLower.includes("caustic") || descLower.includes("lime") || descLower.includes("reagent") || descLower.includes("floc")) {
    return { area: "UTL", subArea: "Reagents", system: "Reagents", parentAsset: "RGT01 Reagents" };
  }
  // Water
  if (descLower.includes("water") || descLower.includes("potable") || descLower.includes("gland") || descLower.includes("raw water")) {
    return { area: "UTL", subArea: "Water", system: "Water", parentAsset: "SVC01 Water Services" };
  }
  // Compressed Air
  if (descLower.includes("compressor") || descLower.includes("air receiver") || descLower.includes("compressed air")) {
    return { area: "UTL", subArea: "Compressed Air", system: "Compressed Air", parentAsset: "COMP01 Compressed Air" };
  }
  // Power / Generators
  if (descLower.includes("generator") || descLower.includes("power station") || descLower.includes("genset")) {
    return { area: "UTL", subArea: "Power Generation", system: "Power Generation", parentAsset: "GEN01 Generators" };
  }
  // Substation / Electrical
  if (descLower.includes("substation") || descLower.includes("sub station") || descLower.includes("switchboard") || descLower.includes("transformer")) {
    return { area: "UTL", subArea: "Electrical", system: "Electrical", parentAsset: "SUB01 Substation" };
  }
  // MCC / Distribution
  if (descLower.includes("mcc") || descLower.includes("distribution") || descLower.includes("db") || descLower.includes("l&p")) {
    return { area: "SITE", subArea: "Electrical", system: "Electrical", parentAsset: "MCC01 MCCs" };
  }
  // Buildings
  if (descLower.includes("building") || descLower.includes("crib") || descLower.includes("office") || descLower.includes("ablution") || descLower.includes("workshop")) {
    return { area: "SITE", subArea: "Buildings", system: "Buildings", parentAsset: "BLD01 Buildings" };
  }
  // Mobile
  if (descLower.includes("loader") || descLower.includes("forklift") || descLower.includes("truck") || descLower.includes("excavator") || descLower.includes("dozer")) {
    return { area: "SITE", subArea: "Mobile Equipment", system: "Mobile Equipment", parentAsset: "MOB01 Mobile Equipment" };
  }
  // Pump (generic fallback)
  if (descLower.includes("pump") || descLower.includes("sump")) {
    return { area: "COM", subArea: "Process", system: "Process", parentAsset: "PMP01 Pumps" };
  }
  // Tank (generic fallback)
  if (descLower.includes("tank") || descLower.includes("vessel")) {
    return { area: "COM", subArea: "Process", system: "Process", parentAsset: "TK01 Tanks" };
  }
  // Screen (generic fallback)
  if (descLower.includes("screen")) {
    return { area: "COM", subArea: "Process", system: "Process", parentAsset: "SCR01 Screens" };
  }
  // Valve (generic fallback)
  if (descLower.includes("valve") || descLower.includes("actuator")) {
    return { area: "COM", subArea: "Process", system: "Process", parentAsset: "VLV01 Valves" };
  }
  // Instrument / Sensor (generic fallback)
  if (descLower.includes("sensor") || descLower.includes("transmitter") || descLower.includes("gauge") || descLower.includes("instrument")) {
    return { area: "COM", subArea: "Instrumentation", system: "Instrumentation", parentAsset: "INS01 Instrumentation" };
  }

  // Ultimate fallback - use generic process classification
  return { area: "COM", subArea: "Process", system: "Process", parentAsset: "EQP01 Equipment" };
};

// Additional rows derived directly from P&ID mappings (assets not in templates)
const pidMappedRows: ComponentItem[] = pidTagMappings
  .filter((m) => m.status === "mapped")
  .filter((m) => !existingAssetNumbers.has(m.assetNumber))
  .map((m) => {
    const inferred = inferComponentTypeFromAssetNumber(m.assetNumber);
    let metadata = inferMetadataFromPidTag(m.pidTag, m.description);

    // If P&ID prefix inference failed, try description-based inference
    if (!metadata.area || !metadata.parentAsset) {
      metadata = inferMetadataFromDescription(m.description);
    }

    return {
      id: generateId(),
      assetName: m.description,
      assetNumber: m.assetNumber,
      parentAsset: metadata.parentAsset,
      area: metadata.area,
      subArea: metadata.subArea,
      system: metadata.system,
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

export const initialComponentData: ComponentItem[] = [...enrichedBaseData, ...pidMappedRows];
