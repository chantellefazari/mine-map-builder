// Site Spares Catalogue Data
// MASTER INVENTORY for the entire site - ALL spare parts (HIGH, MEDIUM, LOW priority)
// Critical Spares Catalogue filters from this master list (HIGH + MEDIUM only)
// Populated from site catalogue document - September 2022 version
// FULL IMPORT: ~998 items from Catalogue_Template_TCMG_220925-2.xlsx

export interface SiteSpareItem {
  id: string;
  // Hierarchy linkage - aligned with Critical Spares structure
  area: string;           // Area code e.g., "COM", "REC", "TAIL"
  areaLabel: string;      // Full area name e.g., "Comminution / Process"
  subArea: string;        // e.g., "Feed / Reclaim", "Grinding"
  system: string;         // e.g., "APN01 Apron Feeder"
  parentAsset: string;    // Legacy P&ID reference e.g., "4-FE-100"
  assetNumber: string;    // Modern asset number e.g., "APN01-GMR01"
  pidTag: string;         // P&ID tag e.g., "04-FE-100"
  // Component details
  componentName: string;
  componentType: string;
  sparePartDescription: string;
  oemPartNumber: string;
  manufacturer: string;
  vendor: string;
  assetManufacturer: string;
  assetModel: string;
  // Priority & Criticality
  priority: "HIGH" | "MEDIUM" | "LOW";
  priorityReason: string;
  reviewFlag: boolean;
  spareCriticality: "High" | "Medium" | "Low" | "";
  criticalitySource: "Confirmed" | "Assumed" | "";
  reasonCritical: string;
  // Quantities
  minQty: string;
  maxQty: string;
  qtyPerSystem: string;
  unitPrice: string;
  uom: string;
  // Other fields
  leadTime: string;
  storageRequirement: string;
  notes: string;
  confidence: "Low" | "Medium" | "High";
  status: "Provisional" | "Confirmed" | "TBC" | "Active" | "Pending" | "Obsolete";
}

// Priority colors for UI
export const priorityColors: Record<string, string> = {
  HIGH: "bg-destructive/20 text-destructive",
  MEDIUM: "bg-amber-500/20 text-amber-700",
  LOW: "bg-muted text-muted-foreground",
};

// Status colors
export const siteSpareStatusColors: Record<string, string> = {
  Active: "bg-green-500/20 text-green-700",
  Provisional: "bg-blue-500/20 text-blue-700",
  Confirmed: "bg-green-500/20 text-green-700",
  Pending: "bg-amber-500/20 text-amber-700",
  TBC: "bg-amber-500/20 text-amber-700",
  Obsolete: "bg-muted text-muted-foreground",
};

// Criticality source colors
export const criticalitySourceColors: Record<string, string> = {
  Confirmed: "bg-green-500/20 text-green-700",
  Assumed: "bg-amber-500/20 text-amber-700",
};

// Import critical spares data and transform to site spares format
import { sparesData } from "../critical-spares/sparesData";

// Transform critical spares to site spares format
const transformedCriticalSpares: SiteSpareItem[] = sparesData.map((item, index) => ({
  id: `SS-${String(index + 1).padStart(4, "0")}`,
  area: item.area,
  areaLabel: item.areaLabel,
  subArea: item.subArea,
  system: item.system,
  parentAsset: item.parentAsset,
  assetNumber: item.assetNumber,
  pidTag: item.pidTag,
  componentName: item.componentName,
  componentType: item.componentType,
  sparePartDescription: item.sparePartDescription,
  oemPartNumber: item.oemPartNumber,
  manufacturer: item.manufacturer,
  vendor: item.vendor,
  assetManufacturer: item.assetManufacturer,
  assetModel: item.assetModel,
  priority: item.spareCriticality === "High" ? "HIGH" as const : item.spareCriticality === "Medium" ? "MEDIUM" as const : "LOW" as const,
  priorityReason: item.reasonCritical,
  reviewFlag: false,
  spareCriticality: item.spareCriticality,
  criticalitySource: item.criticalitySource,
  reasonCritical: item.reasonCritical,
  minQty: item.minQty,
  maxQty: item.maxQty,
  qtyPerSystem: item.qtyPerSystem,
  unitPrice: item.unitPrice,
  uom: item.uom,
  leadTime: "",
  storageRequirement: "",
  notes: item.notes,
  confidence: item.confidence || "Medium",
  status: item.status,
}));

// ═══════════════════════════════════════════════════════════════════════════════════════
// SITE CATALOGUE DATA - FULL IMPORT from Catalogue_Template_TCMG_220925-2.xlsx
// Priority assigned per criticality hierarchy definitions:
// HIGH: Motors, Gearboxes, PLCs, Major Pumps, Mill components - plant stoppage risk
// MEDIUM: Bearings, Seals, Valves, Instrumentation, V-Belts - reliability impact
// LOW: Fittings, Consumables, Fasteners, Hoses - readily available
// ═══════════════════════════════════════════════════════════════════════════════════════

// Helper to determine priority based on component type and description
const determinePriority = (componentType: string, description: string): { priority: "HIGH" | "MEDIUM" | "LOW"; reason: string } => {
  const descLower = description.toLowerCase();
  const typeLower = componentType.toLowerCase();
  
  // HIGH PRIORITY - Production/Safety Critical
  if (typeLower.includes("motor") || descLower.includes("motor")) {
    return { priority: "HIGH", reason: "Motor - plant stoppage risk" };
  }
  if (typeLower.includes("gearbox") || descLower.includes("gearbox") || descLower.includes("gear box") || descLower.includes("reducer")) {
    return { priority: "HIGH", reason: "Gearbox - long lead time, plant impact" };
  }
  if (typeLower === "plc" || descLower.includes("plc") || descLower.includes("controller") || descLower.includes("remote i/o")) {
    return { priority: "HIGH", reason: "PLC/Control - plant stoppage risk" };
  }
  if (descLower.includes("weightometer") || descLower.includes("weigh processor")) {
    return { priority: "HIGH", reason: "Instrumentation - production monitoring" };
  }
  if (descLower.includes("encoder")) {
    return { priority: "HIGH", reason: "Encoder - motor control critical" };
  }
  if (descLower.includes("mill lube") || descLower.includes("trunnion") || descLower.includes("pinion")) {
    return { priority: "HIGH", reason: "Mill component - process critical" };
  }
  if (descLower.includes("vibrat") && descLower.includes("motor")) {
    return { priority: "HIGH", reason: "Vibrating motor - screen critical" };
  }
  
  // MEDIUM PRIORITY - Reliability/Throughput Impact
  if (typeLower.includes("sensor") || typeLower.includes("transmitter") || descLower.includes("transmitter") || descLower.includes("indicator")) {
    return { priority: "MEDIUM", reason: "Instrumentation - process monitoring" };
  }
  if (typeLower.includes("pump") || descLower.includes("pump") || descLower.includes("impeller")) {
    return { priority: "MEDIUM", reason: "Pump component - process impact" };
  }
  if (typeLower.includes("valve") || descLower.includes("valve")) {
    return { priority: "MEDIUM", reason: "Valve - process control" };
  }
  if (typeLower.includes("bearing") || descLower.includes("bearing")) {
    return { priority: "MEDIUM", reason: "Bearing - reliability component" };
  }
  if (typeLower.includes("seal") || descLower.includes("seal") || descLower.includes("mech seal")) {
    return { priority: "MEDIUM", reason: "Seal - reliability component" };
  }
  if (typeLower.includes("belt") || descLower.includes("belt")) {
    return { priority: "MEDIUM", reason: "V-Belt - drive reliability" };
  }
  if (typeLower.includes("relay") || descLower.includes("relay")) {
    return { priority: "MEDIUM", reason: "Relay - control system" };
  }
  if (typeLower.includes("contactor") || descLower.includes("contactor")) {
    return { priority: "MEDIUM", reason: "Contactor - motor control" };
  }
  if (typeLower.includes("circuit breaker") || descLower.includes("circuit breaker") || descLower.includes("rcbo") || descLower.includes("mcb")) {
    return { priority: "MEDIUM", reason: "Circuit breaker - electrical protection" };
  }
  if (typeLower.includes("motor starter") || descLower.includes("motor starter")) {
    return { priority: "MEDIUM", reason: "Motor starter - motor protection" };
  }
  if (typeLower.includes("overload") || descLower.includes("overload")) {
    return { priority: "MEDIUM", reason: "Overload relay - motor protection" };
  }
  if (typeLower.includes("isolator") || descLower.includes("isolator")) {
    return { priority: "MEDIUM", reason: "Isolator - electrical safety" };
  }
  if (typeLower.includes("power supply") || descLower.includes("power supply")) {
    return { priority: "MEDIUM", reason: "Power supply - control system" };
  }
  if (typeLower.includes("filter") && !descLower.includes("fitting")) {
    return { priority: "MEDIUM", reason: "Filter - system protection" };
  }
  if (typeLower.includes("lube") || descLower.includes("lubricant") || descLower.includes("grease") || descLower.includes("oil")) {
    return { priority: "MEDIUM", reason: "Lubricant - equipment protection" };
  }
  if (typeLower.includes("solenoid") || descLower.includes("solenoid")) {
    return { priority: "MEDIUM", reason: "Solenoid - control component" };
  }
  if (typeLower.includes("fuse") || descLower.includes("fuse")) {
    return { priority: "MEDIUM", reason: "Fuse - electrical protection" };
  }
  if (descLower.includes("potable water") || descLower.includes("ro plant")) {
    return { priority: "MEDIUM", reason: "Water treatment - camp services" };
  }
  if (descLower.includes("rebuild kit") || descLower.includes("repair kit")) {
    return { priority: "MEDIUM", reason: "Rebuild kit - planned maintenance" };
  }
  if (typeLower.includes("regulator") || descLower.includes("regulator")) {
    return { priority: "MEDIUM", reason: "Regulator - pneumatic system" };
  }
  if (typeLower.includes("coupling") || descLower.includes("coupling")) {
    return { priority: "MEDIUM", reason: "Coupling - drive component" };
  }
  
  // LOW PRIORITY - Operational/Consumable
  if (typeLower.includes("fitting") || descLower.includes("fitting")) {
    return { priority: "LOW", reason: "Fitting - readily available" };
  }
  if (typeLower.includes("poly") || descLower.includes("poly")) {
    return { priority: "LOW", reason: "Poly fitting - readily available" };
  }
  if (typeLower.includes("consumable") || typeLower.includes("tape") || typeLower.includes("cable tie")) {
    return { priority: "LOW", reason: "Consumable - readily available" };
  }
  if (typeLower.includes("gland") || descLower.includes("gland")) {
    return { priority: "LOW", reason: "Cable gland - readily available" };
  }
  if (typeLower.includes("terminal") || descLower.includes("terminal")) {
    return { priority: "LOW", reason: "Terminal - readily available" };
  }
  if (typeLower.includes("crimp") || descLower.includes("crimp") || descLower.includes("boot lace")) {
    return { priority: "LOW", reason: "Crimp/connector - readily available" };
  }
  if (typeLower.includes("heat shrink") || descLower.includes("heat shrink") || descLower.includes("heatshrink")) {
    return { priority: "LOW", reason: "Heat shrink - readily available" };
  }
  if (typeLower.includes("conduit") || descLower.includes("conduit")) {
    return { priority: "LOW", reason: "Conduit - readily available" };
  }
  if (typeLower.includes("nipple") || descLower.includes("nipple")) {
    return { priority: "LOW", reason: "Fitting - readily available" };
  }
  if (typeLower.includes("socket") || descLower.includes("socket") && !descLower.includes("switch socket")) {
    return { priority: "LOW", reason: "Socket fitting - readily available" };
  }
  if (typeLower.includes("bush") || descLower.includes("bush") && !descLower.includes("throat bush")) {
    return { priority: "LOW", reason: "Bush fitting - readily available" };
  }
  if (typeLower.includes("reducer") && !descLower.includes("gear")) {
    return { priority: "LOW", reason: "Reducer fitting - readily available" };
  }
  if (typeLower.includes("adaptor") || descLower.includes("adaptor") || descLower.includes("adapter")) {
    return { priority: "LOW", reason: "Adaptor - readily available" };
  }
  if (typeLower.includes("saddle") || descLower.includes("saddle")) {
    return { priority: "LOW", reason: "Saddle fitting - readily available" };
  }
  if (typeLower.includes("flange") && !descLower.includes("motor")) {
    return { priority: "LOW", reason: "Flange - readily available" };
  }
  if (typeLower.includes("minsup") || descLower.includes("minsup")) {
    return { priority: "LOW", reason: "Minsup fitting - readily available" };
  }
  if (typeLower.includes("hose") || descLower.includes("hose")) {
    return { priority: "LOW", reason: "Hose - readily available" };
  }
  if (typeLower.includes("weld") || descLower.includes("weld") || descLower.includes("electrode")) {
    return { priority: "LOW", reason: "Welding consumable - readily available" };
  }
  if (typeLower.includes("tag") || descLower.includes("test tag")) {
    return { priority: "LOW", reason: "Test tag - readily available" };
  }
  if (typeLower.includes("strut") || descLower.includes("strut")) {
    return { priority: "LOW", reason: "Strut - readily available" };
  }
  if (typeLower.includes("plug") || descLower.includes("plug") && !descLower.includes("spark plug")) {
    return { priority: "LOW", reason: "Plug/socket - readily available" };
  }
  if (typeLower.includes("light") || descLower.includes("light") || descLower.includes("lamp") || descLower.includes("led")) {
    return { priority: "LOW", reason: "Lighting - readily available" };
  }
  if (typeLower.includes("switch") && !descLower.includes("safety") && !descLower.includes("pressure") && !descLower.includes("level")) {
    return { priority: "LOW", reason: "Switch - readily available" };
  }
  if (typeLower.includes("gpo") || descLower.includes("gpo")) {
    return { priority: "LOW", reason: "GPO - readily available" };
  }
  if (typeLower.includes("cable joiner") || descLower.includes("cable joiner") || descLower.includes("resin joint")) {
    return { priority: "LOW", reason: "Cable joiner - readily available" };
  }
  if (typeLower.includes("earth") && !descLower.includes("earth leakage")) {
    return { priority: "LOW", reason: "Earth bar - readily available" };
  }
  if (typeLower.includes("push button") || descLower.includes("push button") || descLower.includes("pushbutton")) {
    return { priority: "LOW", reason: "Push button - readily available" };
  }
  if (typeLower.includes("contact") && !descLower.includes("contactor")) {
    return { priority: "LOW", reason: "Contact block - readily available" };
  }
  if (typeLower.includes("siren") || descLower.includes("siren") || descLower.includes("sounder")) {
    return { priority: "LOW", reason: "Siren/sounder - readily available" };
  }
  if (typeLower.includes("prefilter") || descLower.includes("prefilter")) {
    return { priority: "LOW", reason: "Prefilter component - readily available" };
  }
  if (descLower.includes("filter press") && (descLower.includes("plate") || descLower.includes("membrane") || descLower.includes("cloth"))) {
    return { priority: "MEDIUM", reason: "Filter press consumable - operational" };
  }
  
  // Default to MEDIUM for unknown items
  return { priority: "MEDIUM", reason: "Review required" };
};

// Helper to determine area from equipment tag or description
const determineArea = (equipmentTag: string, description: string): { area: string; areaLabel: string; subArea: string; system: string } => {
  const tagLower = equipmentTag.toLowerCase();
  const descLower = description.toLowerCase();
  
  // Check P&ID tag prefixes (30- = Comminution, 50- = Gravity, 60- = CIP, 70- = Elution/Regen, 80- = Utilities)
  if (tagLower.startsWith("30-") || descLower.includes("ball mill") || descLower.includes("cyclone") || descLower.includes("mill feed")) {
    return { area: "COM", areaLabel: "Comminution / Process", subArea: "Grinding", system: "BM01 Primary Ball Mill" };
  }
  if (tagLower.startsWith("50-") || descLower.includes("knelson") || descLower.includes("gravity")) {
    return { area: "REC", areaLabel: "Gold Recovery", subArea: "Gravity Circuit", system: "SCR01 Gravity Concentrator" };
  }
  if (tagLower.startsWith("60-") || descLower.includes("cip") || descLower.includes("leach tank") || descLower.includes("cyanide")) {
    return { area: "REC", areaLabel: "Gold Recovery", subArea: "CIP", system: "CIP-TK01 CIP Tanks" };
  }
  if (tagLower.startsWith("70-") || descLower.includes("elution") || descLower.includes("regen") || descLower.includes("kiln") || descLower.includes("electrowin")) {
    if (descLower.includes("regen") || descLower.includes("kiln")) {
      return { area: "REC", areaLabel: "Gold Recovery", subArea: "Regeneration", system: "REG01 Regen Kiln" };
    }
    if (descLower.includes("electrowin") || descLower.includes("ew ")) {
      return { area: "REC", areaLabel: "Gold Recovery", subArea: "Gold Room", system: "GR01 Gold Room" };
    }
    return { area: "REC", areaLabel: "Gold Recovery", subArea: "Elution", system: "ELU01 Elution Circuit" };
  }
  if (tagLower.startsWith("80-") || descLower.includes("instrument air") || descLower.includes("compressed air")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Compressed Air", system: "AIR01 Compressed Air" };
  }
  
  // Check equipment tag keywords
  if (tagLower.includes("mill lube") || descLower.includes("mill lube") || descLower.includes("trunnion")) {
    return { area: "COM", areaLabel: "Comminution / Process", subArea: "Grinding", system: "LUB01 Mill Lube System" };
  }
  if (tagLower.includes("cyclone") || descLower.includes("cyclone feed pump") || descLower.includes("cyclone pump")) {
    return { area: "COM", areaLabel: "Comminution / Process", subArea: "Classification", system: "CYC01 Cyclone Cluster" };
  }
  if (tagLower.includes("tails") || descLower.includes("tails pump") || descLower.includes("tailings")) {
    return { area: "TAIL", areaLabel: "Tailings", subArea: "Pumping", system: "TLP01 Tails Pump" };
  }
  if (tagLower.includes("thickener") || descLower.includes("thickener")) {
    return { area: "TAIL", areaLabel: "Tailings", subArea: "Thickener", system: "THK01 Tailings Thickener" };
  }
  if (tagLower.includes("filter") || descLower.includes("filter press")) {
    return { area: "TAIL", areaLabel: "Tailings", subArea: "Filtration", system: "FLT01 Filter Press" };
  }
  if (tagLower.includes("gold room") || descLower.includes("gold room")) {
    return { area: "REC", areaLabel: "Gold Recovery", subArea: "Gold Room", system: "GR01 Gold Room" };
  }
  if (tagLower.includes("water services") || descLower.includes("water services") || descLower.includes("process water")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Water Services", system: "WSV01 Process Water" };
  }
  if (tagLower.includes("potable water") || descLower.includes("potable water")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Water Services", system: "POT01 Potable Water" };
  }
  if (tagLower.includes("ro plant") || descLower.includes("ro plant")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Water Services", system: "RO01 RO Plant" };
  }
  if (tagLower.includes("lubricant") || descLower.includes("lubricant") || descLower.includes("renolin") || descLower.includes("renolit")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Stores", system: "LUB02 Lubricants" };
  }
  if (tagLower.includes("poly fitting") || descLower.includes("poly fitting")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Piping", system: "PIP01 Poly Fittings" };
  }
  if (tagLower.includes("hose fitting") || descLower.includes("hose fitting")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Piping", system: "PIP02 Hose Fittings" };
  }
  if (tagLower.includes("electrical") || descLower.includes("electrical consumab") || tagLower.includes("mcc")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Electrical", system: "ELE01 MCC Components" };
  }
  if (tagLower.includes("generator") || descLower.includes("generator")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Power", system: "GEN01 Generators" };
  }
  if (tagLower.includes("welding") || descLower.includes("welding")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Workshop", system: "WKS01 Workshop" };
  }
  if (tagLower.includes("carbon transfer") || descLower.includes("carbon transfer")) {
    return { area: "REC", areaLabel: "Gold Recovery", subArea: "Carbon Transfer", system: "CTS01 Carbon Transfer" };
  }
  if (tagLower.includes("agitator") || descLower.includes("agitator")) {
    return { area: "REC", areaLabel: "Gold Recovery", subArea: "CIP", system: "CIP-TK01 CIP Tanks" };
  }
  if (tagLower.includes("ice machine") || descLower.includes("ice machine")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Camp Services", system: "CAM01 Camp Equipment" };
  }
  if (tagLower.includes("sump pump") && (descLower.includes("cip") || descLower.includes("grinding"))) {
    return { area: "COM", areaLabel: "Comminution / Process", subArea: "Grinding", system: "SMP01 Sump Pumps" };
  }
  if (tagLower.includes("portable pump") || descLower.includes("portable pump")) {
    return { area: "UTIL", areaLabel: "Utilities", subArea: "Mobile Equipment", system: "MOB01 Portable Equipment" };
  }
  
  // Default
  return { area: "UTIL", areaLabel: "Utilities", subArea: "General", system: "GEN02 General Spares" };
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// FULL CATALOGUE IMPORT - All 998 items from Excel
// Items are DEDUPLICATED - if description matches existing critical spare, skip it
// ═══════════════════════════════════════════════════════════════════════════════════════

// Get set of existing descriptions for deduplication
const existingDescriptions = new Set(
  sparesData.map(item => item.sparePartDescription.toLowerCase().trim())
);

// Raw catalogue data from Excel - structured for import
const rawCatalogueItems: Array<{
  componentType: string;
  description: string;
  maxQty: string;
  minQty: string;
  equipmentTag: string;
  uom: string;
  vendor: string;
  oemPartNumber: string;
}> = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SENSORS & INSTRUMENTATION (Lines 7-82)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Sensor", description: "BC100 discharge chute blocked", maxQty: "2", minQty: "1", equipmentTag: "30-LSH-0510", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill Discharge Pump Box Water Addition Flow Control Valve Positioner", maxQty: "2", minQty: "1", equipmentTag: "30-FCV-0545", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill LP Lube Oil Flow", maxQty: "2", minQty: "1", equipmentTag: "30-FIT-0521", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill cyclone pressure transmitter", maxQty: "2", minQty: "1", equipmentTag: "30-PIT-0552", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Cyclone inlet flow", maxQty: "1", minQty: "1", equipmentTag: "30-FIT-0551", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Leach tank 1 pH probe", maxQty: "2", minQty: "1", equipmentTag: "60-AE-0933", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Cyanide mixing tank level transmitter", maxQty: "2", minQty: "1", equipmentTag: "60-LIT-0938", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution heater flow high switch", maxQty: "2", minQty: "1", equipmentTag: "70-FSH-7528", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution heater outlet temp tx", maxQty: "2", minQty: "1", equipmentTag: "70-TT-7522", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution heater outlet temp high switch", maxQty: "2", minQty: "1", equipmentTag: "70-TSHH-7523", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Acid wash column pressure indicator", maxQty: "6", minQty: "4", equipmentTag: "70-PI-7510", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution heater temperature controller", maxQty: "1", minQty: "1", equipmentTag: "70-TIC-7521", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Eluate pump press high switch", maxQty: "2", minQty: "1", equipmentTag: "70-PSHH-7501", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Regen kiln drum rotation switch", maxQty: "2", minQty: "1", equipmentTag: "70-ZA-7565", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Regen carbon quench hopper LLS", maxQty: "2", minQty: "1", equipmentTag: "70-LSLL-7576", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Water tank level TX", maxQty: "2", minQty: "1", equipmentTag: "xx-LIT-0716", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Tailings Thickener Bed Mass", maxQty: "1", minQty: "1", equipmentTag: "", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill DE Trunnion Oil Reservoir Temperature", maxQty: "2", minQty: "1", equipmentTag: "30-TIT-0537", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "DP Switch Pump 100", maxQty: "2", minQty: "1", equipmentTag: "30-DPSH-0523", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "DP Switch Pump 152", maxQty: "2", minQty: "1", equipmentTag: "30-DPSH-0519", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "RTD", maxQty: "2", minQty: "1", equipmentTag: "30-TE-0537Z", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill Feed End Water Flow Valve", maxQty: "1", minQty: "1", equipmentTag: "30-FCV-0515", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill HP Lube Oil Flow Tx", maxQty: "1", minQty: "1", equipmentTag: "30-FIT-0526", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill LP Lube Oil Pressure Tx", maxQty: "1", minQty: "1", equipmentTag: "30-PIT-0520", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill Trunnion Lube System Oil Temp", maxQty: "1", minQty: "1", equipmentTag: "30-TIT-0529", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Lime silo level TX", maxQty: "1", minQty: "1", equipmentTag: "xx-LIT-0904", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball mill discharge pump box water addition flow Tx", maxQty: "1", minQty: "1", equipmentTag: "30-FIT-0545", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Mill feed conveyor weightometer. Entire System.", maxQty: "", minQty: "", equipmentTag: "30-WT-0506", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball mill gear reducer oil temperature", maxQty: "1", minQty: "1", equipmentTag: "30-TE-0538", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball mill feed end water flow Tx", maxQty: "1", minQty: "1", equipmentTag: "30-FIT-0515", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Belt Drift Switch", maxQty: "2", minQty: "1", equipmentTag: "30-ZS-0508B", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Leach tank 1 pH meter", maxQty: "1", minQty: "1", equipmentTag: "60-AIT-0933", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Level Transmitter", maxQty: "2", minQty: "1", equipmentTag: "60-LIT-0925", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Tank level sensor", maxQty: "2", minQty: "1", equipmentTag: "60-LIT-0940", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Acid wash column inlet flow indicator", maxQty: "1", minQty: "1", equipmentTag: "70-FI-7531", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution heater differential pressure high switch", maxQty: "1", minQty: "1", equipmentTag: "70-DPSH-7502", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution Flow Transmitter", maxQty: "2", minQty: "1", equipmentTag: "70-FIT-7530", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Acid wash column level switch high", maxQty: "1", minQty: "1", equipmentTag: "70-LSHH-7542", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution Column Pressure Indicator", maxQty: "1", minQty: "1", equipmentTag: "70-PI-7506", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Temp indicator", maxQty: "4", minQty: "2", equipmentTag: "70-TI-7516", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution recovery heat exchanger inlet temp indicator", maxQty: "1", minQty: "1", equipmentTag: "70-TI-7512", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution column outlet temperature indicator", maxQty: "1", minQty: "1", equipmentTag: "70-TI-7519", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Pressure indicator", maxQty: "2", minQty: "1", equipmentTag: "70-PI-7511", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution Tank Level Indicator", maxQty: "1", minQty: "1", equipmentTag: "70-LI-7538", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Elution Tank Level Low Switch", maxQty: "1", minQty: "1", equipmentTag: "70-LSLL-7541", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Hot eluate flashpot level switch high", maxQty: "1", minQty: "1", equipmentTag: "70-LSHH-7539", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Cyanide batch controller flow Tx", maxQty: "1", minQty: "1", equipmentTag: "xx-FIC-7532", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Eluate pump pressure indicator", maxQty: "1", minQty: "1", equipmentTag: "70-PI-7503", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Hot eluate flashpot pressure indicator", maxQty: "1", minQty: "1", equipmentTag: "70-PI-7508", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Cyanide Dosing for Elution", maxQty: "1", minQty: "1", equipmentTag: "sv7533", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Regen Kiln feed hopper level low", maxQty: "1", minQty: "1", equipmentTag: "70-LE-7550", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Flame detection", maxQty: "2", minQty: "1", equipmentTag: "70-BZ-1025", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Regen Kiln Feed Hopper Level High", maxQty: "1", minQty: "1", equipmentTag: "70-LSHH-7551", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Regen Kiln Discharge Temp", maxQty: "1", minQty: "1", equipmentTag: "70-TE-7563", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Filter pressure indicator", maxQty: "1", minQty: "1", equipmentTag: "70-PI-7526", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Knelson Concentrator Inlet Flow Control Valve", maxQty: "1", minQty: "1", equipmentTag: "50-FCV-0004", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Knelson concentrator inlet pressure Tx", maxQty: "1", minQty: "1", equipmentTag: "50-PIT-0005", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Knelson flow pressure indicator", maxQty: "1", minQty: "1", equipmentTag: "50-PI-1039", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Knelson concentrator inlet flow Tx", maxQty: "1", minQty: "1", equipmentTag: "50-FIT-0003", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Instrument air pressure transmitter", maxQty: "1", minQty: "1", equipmentTag: "80-PIT-0654", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Pressure Transmitter", maxQty: "1", minQty: "1", equipmentTag: "80-PIT-0645", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Knelson Concentrator speed switch", maxQty: "1", minQty: "1", equipmentTag: "50-SS-1035", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Conveyors Startup Siren", maxQty: "2", minQty: "1", equipmentTag: "xx-AU-0905C", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Burner flame detectors", maxQty: "4", minQty: "2", equipmentTag: "70-BZ-0001", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Conveyors lanyard switch", maxQty: "2", minQty: "1", equipmentTag: "", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "LP Pump Working Pressure/Trunion Delivery Pressure", maxQty: "2", minQty: "1", equipmentTag: "30-PI-001", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "HP Pump Working Pressure", maxQty: "1", minQty: "1", equipmentTag: "30-PI-003", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Trunnion HP Jacking Pressure", maxQty: "1", minQty: "1", equipmentTag: "30-PI-004", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill HP Lube Oil Heater Relay on Signal", maxQty: "1", minQty: "1", equipmentTag: "30-XY-0527", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball Mill LP Lube Oil Cooler Drain Valve", maxQty: "1", minQty: "1", equipmentTag: "30-XV-0524", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Mill Lube System Oil Particle and Moisture Monitor", maxQty: "1", minQty: "1", equipmentTag: "30-AIT-0517", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Eluate flow indicator", maxQty: "1", minQty: "1", equipmentTag: "70-FI-7529", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Knelson inlet flow pressure indicator 3", maxQty: "1", minQty: "1", equipmentTag: "50-PI-1040", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  { componentType: "Sensor", description: "Ball mill trunnion lube system level", maxQty: "1", minQty: "1", equipmentTag: "30-LIT-0528", uom: "EA", vendor: "MCE", oemPartNumber: "" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GEARBOX (Line 83)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Gearbox", description: "Gearbox Incl Coupling Half & Motor Adapter. Part No- MC4350/01/1167. Model- 1167 Design Speed- 28 rpm. Motor Adaptor- AM180. Coupling OD- 318mm", maxQty: "1", minQty: "1", equipmentTag: "CIL/CIP Tank Agitator gearbox", uom: "EA", vendor: "Mixtec", oemPartNumber: "MC4350/01/1167" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PLC & CONTROL MODULES (Lines 84-96)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "PLC", description: "WEI1550550000. # UR20-FBC-EIP-V2 With DLR Support", maxQty: "1", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI1550550000" },
  { componentType: "PLC", description: "WEI2682170000. Unmanaged Ethernet Switch IE-SW-EL08-6TX-2SC, 6TX+2SC", maxQty: "1", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI2682170000" },
  { componentType: "PLC", description: "WEI1315200000. UR20-16DI-P Remote I/O 16DI", maxQty: "2", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI1315200000" },
  { componentType: "PLC", description: "WEI1315250000. Weidmuller UR20-16DO-P 16 point digital Output", maxQty: "2", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI1315250000" },
  { componentType: "PLC", description: "WEI1315620000. # UR20-4AI-UI-16 4 point analog input", maxQty: "2", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI1315620000" },
  { componentType: "PLC", description: "WEI1315680000.UR20-4AO-UI-16 4 point analog output", maxQty: "2", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI1315680000" },
  { componentType: "PLC", description: "WEI1315700000. UR20-4AI-RTD-DIAG", maxQty: "2", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI1315700000" },
  { componentType: "PLC", description: "WEI2466880000. Power Supply PRO TOP1 Switch-Mode 24V 10A 240W 1PH", maxQty: "1", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI2466880000" },
  { componentType: "PLC", description: "WEI1334740000. Remote I/O module IP20 Power supply unit 24 VDC-Output", maxQty: "2", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "WEI1334740000" },
  { componentType: "PLC", description: "SHNRXG22P7PV. Interface relay 5A 2CO lock LED 230VAC 2P", maxQty: "10", minQty: "4", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "SHNRXG22P7PV" },
  { componentType: "PLC", description: "SHNRXM4AB2BDPVM. Comp Mini relay 6A 4CO mix 24VDC LED 4P", maxQty: "10", minQty: "4", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "SHNRXM4AB2BDPVM" },
  { componentType: "PLC", description: "RSO623-7292.Finder 58 Series Interface Relay, DIN Rail Mount, 24V dc", maxQty: "10", minQty: "4", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "RSO623-7292" },
  { componentType: "PLC", description: "LEG412631. Legrand Time Clock", maxQty: "2", minQty: "1", equipmentTag: "PLC", uom: "EA", vendor: "MME", oemPartNumber: "LEG412631" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RELAYS (Lines 97-101, 171, 181, 184)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Relay", description: "PHO2900299. PLC-RPT- 24DC/21, Relay Module", maxQty: "6", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PHO2900299" },
  { componentType: "Relay", description: "#NHP55340074110VDC. MINIATURE GP RELAY 7A 4CO 110VDC COIL W/PB+LED+MI", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHP55340074110VDC" },
  { componentType: "Relay", description: "#NHP9404. Finder 90 Series Base for 5534 Relay 9902 LED", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHP9404" },
  { componentType: "Relay", description: "NHP55320074110VDC. Finder 55 Series Miniature GP Relay 10A 2CO 110V DC Coil", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHP55320074110VDC" },
  { componentType: "Relay", description: "NHP9402. BASE FOR 5532 RELAY/9902 LED", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHP9402" },
  { componentType: "Relay", description: "#PRTSMCU201. Delta Mobrey MCU Control Unit 230/115Vac (50/60 Hz)", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PRTSMCU201" },
  { componentType: "Relay", description: "RSO774-0301. Crouzet DIN Rail Mount Timer Relay, 12 240V ac/dc, 1-C", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "RSO774-0301" },
  { componentType: "Relay", description: "IMEDSRM72C110. IME EARTH LEAKAGE RELAY 2081 MINING PANEL MNT 110VAC 5A", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "IMEDSRM72C110" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FUSES (Lines 102-104)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Fuse", description: "#FUSM205-KIT. M205 Fast Fuse Assorted Kit 250V", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "FUSM205-KIT" },
  { componentType: "Fuse", description: "PHO3046090 . UT 4-HESILED 24 (5X20), Fuse modula", maxQty: "20", minQty: "10", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PHO3046090" },
  { componentType: "Fuse", description: "PHO3004171. Fused Terminal Block Screwed 2 Wire 0.5-16mm Black PA", maxQty: "10", minQty: "4", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PHO3004171" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TERMINALS (Lines 105-108)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Terminal", description: "PHO3044076. Rail Terminal Block Screwed 2 Wire 0.14-4mm Grey PA", maxQty: "100", minQty: "50", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PHO3044076" },
  { componentType: "Terminal", description: "PHO3047028. Rail Terminal End Cover Grey F/D-UT 2.5/10 Terminals", maxQty: "20", minQty: "10", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PHO3047028" },
  { componentType: "Terminal", description: "PHO3044092. Rail Earth Terminal Block SCRW 2 Wire 0.14-4mm Green/Yellow", maxQty: "20", minQty: "10", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PHO3044092" },
  { componentType: "Terminal", description: "PHO3030271. Plug-In Bridge 10 Position 6.2mm Pitch Red", maxQty: "10", minQty: "4", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PHO3030271" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PUSH BUTTONS, SWITCHES, LIGHTS, CONTACTS (Lines 109-122)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Push Button", description: "TEEXB7NA31. Monolit PB green unmark 1NO", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "TEEXB7NA31" },
  { componentType: "Push Button", description: "SHNXB7NA42. Pushbutton Spring Return Red 1NC", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7NA42" },
  { componentType: "Switch", description: "SHNXB7ND25. Selector -2Pos-1No And 1Nc", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7ND25" },
  { componentType: "Light", description: "SHNXB7EV04BP. LED Red Pilot Light 24V", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7EV04BP" },
  { componentType: "Light", description: "SHNXB7EV07BP. Monolit Pilot Light plast clear 24V", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7EV07BP" },
  { componentType: "Light", description: "SHNXB7EV03BP. Monolit Pilot Light plast green 24V", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7EV03BP" },
  { componentType: "Contact", description: "TEEZBE-101. Contact Block W/ Screw Term XB5 & XB4 Single 1NO SB Front", maxQty: "6", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "TEEZBE-101" },
  { componentType: "Contact", description: "TEEZBE102. Contact block silver screw 1NC", maxQty: "6", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "TEEZBE102" },
  { componentType: "Push Button", description: "SHNXB5AS8442. Emergency Stop Pushbutton TTR 600V 10A 1NC 22x40mm Red", maxQty: "10", minQty: "6", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB5AS8442" },
  { componentType: "Switch", description: "SHNXB7ND33. Monolit SS 3pos stay put 2NO", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7ND33" },
  { componentType: "Light", description: "SHNXB7EV05BP. Monolit Pilot Light plastic 24V", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7EV05BP" },
  { componentType: "Light", description: "SHNXB7EV08BP. Monolit Pilot Light plast orange 24V", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNXB7EV08BP" },
  { componentType: "Earth", description: "ALSEB12. Earth Bar 165A 12Hole Front Wiring Surface Mount M8 Bolt", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "ALSEB12" },
  { componentType: "Earth", description: "ALSEB24. Earth Bar 165A 24Hole Front Wiring Surface Mount M8 Bolt", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "ALSEB24" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CIRCUIT BREAKERS (Lines 123-148, 185-192)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Circuit Breaker", description: "SHNA9D11810. RCBO 240V 10A 10kA 1P DIN Rail 30mA IP20", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9D11810" },
  { componentType: "Circuit Breaker", description: "SHNA9D11816. RCBO 240V 16A 10kA 1P DIN Rail 30mA IP20", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9D11816" },
  { componentType: "Circuit Breaker", description: "SHNA9D11820. RCBO 240V 20A 10kA 1P DIN Rail 30mA IP20", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9D11820" },
  { componentType: "Circuit Breaker", description: "SHNA9D11825. RCBO 240V 25A 10kA 1P DIN Rail 30mA IP20", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9D11825" },
  { componentType: "Circuit Breaker", description: "SHNA9D11832. RCBO 240V 32A 10kA 1P DIN Rail 30mA IP20", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9D11832" },
  { componentType: "Circuit Breaker", description: "SHNA9F54102. Mini Circuit Breaker C Curve 1P 2A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54102" },
  { componentType: "Circuit Breaker", description: "SHNA9F54104. Mini Circuit Breaker C Curve 1P 4A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54104" },
  { componentType: "Circuit Breaker", description: "SHNA9F5410. Mini Circuit Breaker C Curve 1P 6A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F5410" },
  { componentType: "Circuit Breaker", description: "SHNA9F54110. Mini Circuit Breaker C Curve 1P 10A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54110" },
  { componentType: "Circuit Breaker", description: "SHNA9F54116 Mini Circuit Breaker C Curve 1P 16A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54116" },
  { componentType: "Circuit Breaker", description: "SHNA9F54120. Mini Circuit Breaker C Curve 1P 20A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54120" },
  { componentType: "Circuit Breaker", description: "SHNA9F54125. Mini Circuit Breaker C Curve 1P 25A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54125" },
  { componentType: "Circuit Breaker", description: "SHNA9F54132 Mini Circuit Breaker C Curve 1P 32A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54132" },
  { componentType: "Circuit Breaker", description: "SHNA9F54140. Mini Circuit Breaker C Curve 1P 40A 10kA 1MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54140" },
  { componentType: "Circuit Breaker", description: "SHNA9F54310. Mini Circuit Breaker C Curve 3P 10A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54310" },
  { componentType: "Circuit Breaker", description: "SHNA9F54316. Mini Circuit Breaker C Curve 3P 16A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54316" },
  { componentType: "Circuit Breaker", description: "SHNA9F54320. Mini Circuit Breaker C Curve 3P 20A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54320" },
  { componentType: "Circuit Breaker", description: "SHNA9F54325. Mini Circuit Breaker C Curve 3P 25A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54325" },
  { componentType: "Circuit Breaker", description: "SHNA9F54332. Mini Circuit Breaker C Curve 3P 32A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54332" },
  { componentType: "Circuit Breaker", description: "SHNA9F54340. Mini Circuit Breaker C Curve 3P 40A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54340" },
  { componentType: "Circuit Breaker", description: "SHNA9F54350. Mini Circuit Breaker C Curve 3P 50A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54350" },
  { componentType: "Circuit Breaker", description: "SHNA9F54363. Mini Circuit Breaker C Curve 3P 63A 10kA 3MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54363" },
  { componentType: "Circuit Breaker", description: "SHNA9F54220. Mini Circuit Breaker C Curve 2P 20A 10kA 2MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54220" },
  { componentType: "Circuit Breaker", description: "SHNA9S66363. Safety Isolating Swtch DIN Rail Toggle 3P 63A 415V Grey", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9S66363" },
  { componentType: "Circuit Breaker", description: "SHNA9F54206. Mini Circuit Breaker C Curve 2P 6A 10kA 2MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54206" },
  { componentType: "Circuit Breaker", description: "SHNA9F54210. Mini Circuit Breaker C Curve 2P 10A 10kA 2MOD DIN Rail Mount", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9F54210" },
  { componentType: "Circuit Breaker", description: "NHPDTM10310D. DIN-T MCB 10kA 3P 10A D Curve", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTM10310D" },
  { componentType: "Circuit Breaker", description: "NHPDTM10320D. DIN-T MCB 10kA 3P 20A D Curve", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTM10320D" },
  { componentType: "Circuit Breaker", description: "NHPDTM10316D. DIN-T MCB 10kA 3P 16A D Curve", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTM10316D" },
  { componentType: "Circuit Breaker", description: "NHPDTAAXAL. DIN-T Auxiliary Alarm 1 C/O", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTAAXAL" },
  { componentType: "Circuit Breaker", description: "NHPDTRS2030A. DIN-T RCBO 10kA 1P+N 20A C CURVE 30mA Type A", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTRS2030A" },
  { componentType: "Circuit Breaker", description: "NHPDTR6S0630A. DIN-T RCBO 6kA 1P+N 06A C CURVE 30mA Type A", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTR6S0630A" },
  { componentType: "Circuit Breaker", description: "NHPDTM10206D. DIN-T MCB 10kA 2P 06A D Curve", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTM10206D" },
  { componentType: "Circuit Breaker", description: "NHPDTM10204D. DIN-T MCB 10kA 2P 04A D Curve", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTM10204D" },
  { componentType: "Circuit Breaker", description: "NHPDTM10106C. DIN-T MCB 10kA 1P 06A C Curve", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPDTM10106C" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MOTOR STARTERS & CONTACTORS (Lines 149-164, 194-195)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Motor Starter", description: "SHNGV4P115B. Motor Circuit breaker TeSys GV4, TeSys GV4, 3P, 115A, Icu", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "SHNGV4P115B" },
  { componentType: "Motor Starter", description: "TEEGV3P50. Circuit Breaker Motor Therm/Mag 37-50A Everlink", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV3P50" },
  { componentType: "Motor Starter", description: "TEEGV2P32. Circuit Breaker Motor Rated 3P 32A 50kA 15kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P32" },
  { componentType: "Motor Starter", description: "TEEGV2P22. Circuit Breaker Motor Rated 3P 25A 50kA 11 kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P22" },
  { componentType: "Motor Starter", description: "TEEGV2P20. Circuit Breaker Motor Rated 3P 18A 50kA 7.5 kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P20" },
  { componentType: "Motor Starter", description: "TEEGV2P16. Circuit Breaker Motor Rated 3P 14A 100kA 5.5kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P16" },
  { componentType: "Motor Starter", description: "TEEGV2P14. Circuit Breaker Motor Rated 3P 10A 100kA 4kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P14" },
  { componentType: "Motor Starter", description: "TEEGV2P10. Circuit Breaker Motor Rated 3P 6.3A 100kA 2.2 kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P10" },
  { componentType: "Motor Starter", description: "TEEGV2P08. Circuit Breaker Motor Rated 3P 4A 100kA 1.1 kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P08" },
  { componentType: "Motor Starter", description: "TEEGV2P06. Circuit Breaker Motor Rated 3P 1.6A 100kA 0.55 kW", maxQty: "2", minQty: "1", equipmentTag: "Motor", uom: "EA", vendor: "MME", oemPartNumber: "TEEGV2P06" },
  { componentType: "Motor Starter", description: "SHNLC1D25B. TeSys3P CTR 25A AC3 11KW1NO1NC24VDC COIL", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNLC1D25B" },
  { componentType: "Motor Starter", description: "SHNLC1D32BD. TeSys3P CTR32A AC3 15KW1NO1NC 24VDC COIL", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNLC1D32BD" },
  { componentType: "Motor Starter", description: "#SHNLC1D65AM7. TeSys 3P EVLK CTR 65A 30KW AC3 220VAC", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNLC1D65AM7" },
  { componentType: "Contactor", description: "SHNLC1D115BD. Contactor TeSys Deca 115A 3P 24VDC Screw", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNLC1D115BD" },
  { componentType: "Contactor", description: "SHNLC1D09BD. TeSys 3P CTR 9A AC3 4KW 1NO1NC24VDC COIL", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNLC1D09BD" },
  { componentType: "Contactor", description: "SHNA9C20731. Contactor DIN 1P AC3 25A 240V 1NO 1P DIN Rail", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNA9C20731" },
  { componentType: "Contactor", description: "NHPCA71210110VAC. CONTACTOR 5.5KW 3P 110VAC COIL 1NO AUXILIARY", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPCA71210110VAC" },
  { componentType: "Contactor", description: "NHPCS7PV11. AUXILIARY CONTACT 1NO 1NC TOP MOUNT", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHPCS7PV11" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OVERLOADS (Lines 196-199)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Overload", description: "S&SCT7N-23-B16.Thermal O/L Relay 1.1-1.6A 690V 1NO/NC Class 10A Auto/Man", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "S&SCT7N-23-B16" },
  { componentType: "Overload", description: "S&SCT7N-23-B25. Thermal O/L Relay 1.8-2.5A 690V 1NO/NC Class 10A Auto/Man", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "S&SCT7N-23-B25" },
  { componentType: "Overload", description: "S&SCT7N-23-B32. Thermal O/L Relay 2.3-3.2A 690V 1NO/NC Class 10A Auto/Man", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "S&SCT7N-23-B32" },
  { componentType: "Overload", description: "S&SCT7N-23-C12. Thermal O/L Relay 9-12.5A 690V 1NO/NC Class 10A Auto/Man", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "S&SCT7N-23-C12" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ISOLATORS & POWER SUPPLIES (Lines 200-204)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Isolator", description: "SOCSLB6303P. L-brk swtch Front Op 3P 630A AC21 280kW AC23 Base Mount IP6", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SOCSLB6303P" },
  { componentType: "Isolator", description: "ABBOT63B22R3-K. LBS 63A 3P BASE MOUNT ABB KIT C/W R/Y DOOR HANDLE 22MM", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "ABBOT63B22R3-K" },
  { componentType: "Power Supply", description: "NHP1606XLE240E. POWER SUPPLY ESS 1PH 100-240VAC TO 24-28VDC 240W10A", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHP1606XLE240E" },
  { componentType: "Transformer", description: "NHP4151102000. TRANSFORMER 415V AC TO 110V AC 2000VA", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "NHP4151102000" },
  { componentType: "Siren", description: "MEC204697. Sounder/Strobe YL80/D50/R/RF/ WR YL8 WR 24VDC Red 204697", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "MEC204697" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MILL LUBE SYSTEM COMPONENTS (Lines 205-254)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Breather", description: "BREATHER TRICEPTOR SINGLE 934330TX1", maxQty: "2", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "934330TX1" },
  { componentType: "Sensor", description: "OIL LEVEL/ TEMPERATURE CONTROLLER SCLTSD-520-10-05", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCLTSD-520-10-05" },
  { componentType: "Sensor", description: "PRESSURE SENSOR AND SWITCH SCPSD-400-14-25", maxQty: "2", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCPSD-400-14-25" },
  { componentType: "Cable", description: "CABLE ( LEVEL, TEMP, PRESSURE SCK-400-10-55", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCK-400-10-55" },
  { componentType: "Coupling", description: "COUPLING SPIDER LP R62", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "LP R62" },
  { componentType: "Coupling", description: "PUMP COUPLING LP ND65HD99", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "ND65HD99" },
  { componentType: "Coupling", description: "MOTOR COUPLING LP ND65C", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "ND65C" },
  { componentType: "Valve", description: "RELIEF VALVE LP RAH201S10", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "RAH201S10" },
  { componentType: "Filter", description: "FILTER MEDIUM PRESSURE FILTREC D761G10AV", maxQty: "6", minQty: "4", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "D761G10AV" },
  { componentType: "Filter", description: "ELECTRICAL INDICATOR MP FILTER 929599", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "929599" },
  { componentType: "Pump", description: "DRIVE RING HP R103", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "R103" },
  { componentType: "Coupling", description: "PUMP COUPLING HP ND108HD24", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "ND108HD24" },
  { componentType: "Coupling", description: "MOTOR COUPLING HP ND108R142", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "ND108R142" },
  { componentType: "Coupling", description: "COUPLING SPIDER HP R142", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "R142" },
  { componentType: "Valve", description: "PRESSURE RELIEF VALVE HP RVD 2-10-S-0-35", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "RVD 2-10-S-0-35" },
  { componentType: "Valve", description: "SOLENOID VALVE AND DIRECTIONAL VALVE SV 3-10-0-0-24DG", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SV 3-10-0-0-24DG" },
  { componentType: "Filter", description: "RETURN FILTER ELEMENT FILTREC A221T125", maxQty: "4", minQty: "2", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "A221T125" },
  { componentType: "Filter", description: "ELECTRICAL INDICATOR RETURN FILTER 937858", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "937858" },
  { componentType: "Filter", description: "OFF LINE FILTER ELEMENT FILTREC A141G10", maxQty: "2", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "A141G10" },
  { componentType: "Cooler", description: "COOLER ELEMENT 30 PLATE SEALED TEC", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "" },
  { componentType: "Heater", description: "OIL HEATER 3 PH 6KW 380V AC ORH-E3-6000-380", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "ORH-E3-6000-380" },
  { componentType: "Sensor", description: "TEMPERATURE SWITCH (TRUNNION DELIVERY) OTS-70-N-25-H1/8NPT", maxQty: "2", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "OTS-70-N-25-H1/8NPT" },
  { componentType: "Sensor", description: "PRESSURE SWITCH LP 0.5 BAR SCP-350-N2-050-G1/4-S", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCP-350-N2-050-G1/4-S" },
  { componentType: "Sensor", description: "PRESSURE SWITCH LP 0.7 BAR SCP-350-N2-070-G1/4-S", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCP-350-N2-070-G1/4-S" },
  { componentType: "Sensor", description: "PRESSURE SWITCH HP 80 BAR SCP-400-14-080-G1/4-S", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCP-400-14-080-G1/4-S" },
  { componentType: "Sensor", description: "FLOW TX LP 20L/MIN SCFT-300-02-020", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCFT-300-02-020" },
  { componentType: "Sensor", description: "FLOW TX HP 2.5L/MIN SCFT-200-01-003", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCFT-200-01-003" },
  { componentType: "Sensor", description: "PRESSURE TX LP SCP-400-14-060-G1/4-S-A", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCP-400-14-060-G1/4-S-A" },
  { componentType: "Sensor", description: "PRESSURE TX HP SCP-400-34-200-G1/4-S", maxQty: "1", minQty: "1", equipmentTag: "Mill Lube System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "SCP-400-34-200-G1/4-S" },
  { componentType: "Pump", description: "GIRTH GEAR LUBE PUMP BIELOMATIK 30901050 (REPLACEMENT)", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30901050" },
  { componentType: "Pump", description: "GIRTH GEAR LUBE PUMP BIELOMATIK 30901050 (SERVICE KIT)", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30901050-SK" },
  { componentType: "Pump Element", description: "GIRTH GEAR PUMP ELEMENT BIELOMATIK 30500020", maxQty: "2", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30500020" },
  { componentType: "Valve", description: "GIRTH GEAR PROGRESSIVE VALVE BIELOMATIK 30200120", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30200120" },
  { componentType: "Sensor", description: "GIRTH GEAR CYCLE SWITCH BIELOMATIK 30300125", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30300125" },
  { componentType: "Controller", description: "GIRTH GEAR CONTROLLER BIELOMATIK 30704100", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30704100" },
  { componentType: "Nozzle", description: "GIRTH GEAR SPRAY NOZZLE BIELOMATIK 30601000", maxQty: "4", minQty: "2", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30601000" },
  { componentType: "Tube", description: "GIRTH GEAR SUCTION TUBE BIELOMATIK 12300003", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 12300003" },
  { componentType: "Follower Plate", description: "GIRTH GEAR FOLLOWER PLATE BIELOMATIK 12102400", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 12102400" },
  { componentType: "Pressure Switch", description: "GIRTH GEAR PRESSURE SWITCH BIELOMATIK 30400000", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30400000" },
  { componentType: "Valve", description: "GIRTH GEAR NON-RETURN VALVE BIELOMATIK 30200180", maxQty: "2", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 30200180" },
  { componentType: "Gauge", description: "GIRTH GEAR PRESSURE GAUGE BIELOMATIK 60602060", maxQty: "1", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "EA", vendor: "Ausdraulics", oemPartNumber: "BIELOMATIK 60602060" },
  { componentType: "Grease", description: "OPEN GEAR LUBRICANT TRIBOL 800/220 (200L DRUM)", maxQty: "2", minQty: "1", equipmentTag: "Mill Girth Gear Grease System", uom: "DR", vendor: "Fuchs", oemPartNumber: "TRIBOL 800/220" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MISC MCC COMPONENTS (Lines 165-184 continued)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "PLC", description: "PRYCUB4LP40. Loop Powered Process Meter, Re", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PRYCUB4LP40" },
  { componentType: "Level", description: "#OMRK8AK-LS1. Omron Level Control 100-240VAC", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "OMRK8AK-LS1" },
  { componentType: "Gauge", description: "SMCAW20K-02EH-C-D. FILT/REG 1/4 ,SQ GAUGE,B/FLOW", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SMCAW20K-02EH-C-D" },
  { componentType: "Solenoid", description: "CFS92122270. SOLENOID VALVE WITH SS NOZZLES", maxQty: "6", minQty: "4", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "CFS92122270" },
  { componentType: "Module", description: "SHNHMIS5T. STU rear module", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SHNHMIS5T" },
  { componentType: "Level", description: "TEERM35LM33MW. Multifunc Lev Contrl Resist 24-240Vac/Dc", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "TEERM35LM33MW" },
  { componentType: "Solenoid", description: "SMCVT307K-5DZ1-02. VLV 3/2 1/4 N/C 24VDC,H/PRESS Solenoid", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SMCVT307K-5DZ1-02" },
  { componentType: "Valve", description: "CFSD3W002CNJP. Parker Cetop 5 24Vdc Open Centre 4/3 Hydraulic Solenoid", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "CFSD3W002CNJP" },
  { componentType: "Valve", description: "CFSD1VW002CNJPG. Dcv Cetop 3 Dbl Sol 345Bar 4/3 24Vdc", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "CFSD1VW002CNJPG" },
  { componentType: "Sensor", description: "#PRY1XTX00-P19/M276/M. 1XTX00-P19/M276/M449, Loop powered HART transmitter", maxQty: "1", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "1XTX00-P19/M276/M449" },
  { componentType: "Lubricator", description: "#SMCAL40-04B-D. LUBRICATING UNIT", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SMCAL40-04B-D" },
  { componentType: "Lubricator", description: "#SMCAL40-04-D. LUBRICATOR 1/2", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SMCAL40-04-D" },
  { componentType: "Solenoid", description: "SMCVS3135-045. VLV 3/2 1/2 N/C 24VDC Solenoid Valve", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SMCVS3135-045" },
  { componentType: "Regulator", description: "SMCAR40K-04H-D. REGULATOR 1/2 ,B/FLOW", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "SMCAR40K-04H-D" },
  { componentType: "Sensor", description: "#PRTSPN7071. Electronic pressure monitor", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PRTSPN7071" },
  { componentType: "Solenoid", description: "OILWE-2B2-02G-D2-303. WE-2B2-02G-D2-3035 Solenoid", maxQty: "2", minQty: "1", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "WE-2B2-02G-D2-3035" },
  { componentType: "Switch", description: "#PRTS557745. SWITCH, PROXIMITY", maxQty: "4", minQty: "2", equipmentTag: "MCC", uom: "EA", vendor: "MME", oemPartNumber: "PRTS557745" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // V-BELTS (Lines 764-776)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Belt", description: "SPA1250GAT GATES SUPER HC WEDGE BELT", maxQty: "8", minQty: "4", equipmentTag: "Sump Pumps", uom: "EA", vendor: "CBC", oemPartNumber: "SPA1250GAT" },
  { componentType: "Belt", description: "SPB1260PGAT WEDGE BELT 1260X17MM", maxQty: "4", minQty: "2", equipmentTag: "Carbon Transfer Pump", uom: "EA", vendor: "CBC", oemPartNumber: "SPB1260PGAT" },
  { componentType: "Belt", description: "SPC2650PGAT GATES-PREDATOR BELT", maxQty: "6", minQty: "3", equipmentTag: "Tails Pump", uom: "EA", vendor: "CBC", oemPartNumber: "SPC2650PGAT" },
  { componentType: "Belt", description: "SPC2360GAT GATES SUPER HC WEDGE BELT", maxQty: "16", minQty: "8", equipmentTag: "Cyclone Pump", uom: "EA", vendor: "CBC", oemPartNumber: "SPC2360GAT" },
  { componentType: "Belt", description: "SPB1320ULTRA+ FENNER ULTRA PLUS SPB1320 WRAPPED WEDGE V-BELT", maxQty: "6", minQty: "2", equipmentTag: "Elution/Grinding sump Pump", uom: "EA", vendor: "CBC", oemPartNumber: "SPB1320ULTRA+" },
  { componentType: "Belt", description: "SPB 1800", maxQty: "8", minQty: "4", equipmentTag: "Mill Feed Conveyor", uom: "EA", vendor: "CBC", oemPartNumber: "SPB 1800" },
  { componentType: "Belt", description: "SPC 2240", maxQty: "8", minQty: "4", equipmentTag: "Thickener Underflow Pumps", uom: "EA", vendor: "CBC", oemPartNumber: "SPC 2240" },
  { componentType: "Belt", description: "SPA 1500", maxQty: "8", minQty: "4", equipmentTag: "Filter Press Sump Pump", uom: "EA", vendor: "CBC", oemPartNumber: "SPA 1500" },
  { componentType: "Belt", description: "B57GAT GATES HI POWER V-BELT 17X1525MM", maxQty: "8", minQty: "4", equipmentTag: "Filter Press", uom: "EA", vendor: "CBC", oemPartNumber: "B57GAT" },
  { componentType: "Belt", description: "B76GAT GATES HI POWER V-BELT 17X2005MM", maxQty: "8", minQty: "4", equipmentTag: "Filter Press", uom: "EA", vendor: "CBC", oemPartNumber: "B76GAT" },
  { componentType: "Belt", description: "B71GAT GATES HI POWER V-BELT 17X1880MM", maxQty: "8", minQty: "4", equipmentTag: "Filter Press", uom: "EA", vendor: "CBC", oemPartNumber: "B71GAT" },
  { componentType: "Belt", description: "B88GAT GATES HI POWER V-BELT 17X2310MM", maxQty: "12", minQty: "6", equipmentTag: "Filter Press", uom: "EA", vendor: "CBC", oemPartNumber: "B88GAT" },
  { componentType: "Belt", description: "XPB1850GAT GATES QUAD POWER RAW EDGE NOTCH WEDGE BELT", maxQty: "16", minQty: "8", equipmentTag: "Filter Press", uom: "EA", vendor: "CBC", oemPartNumber: "XPB1850GAT" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BEARINGS (Lines 747-751, 816-819, 861-865)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Bearing", description: "DD005M BEARING KIT. SUITS 4DDAHF WARMAN", maxQty: "2", minQty: "1", equipmentTag: "Thickener underflow Pump Barrel Bearing Assembly", uom: "EA", vendor: "CBC", oemPartNumber: "DD005M" },
  { componentType: "Bearing", description: "E005M BEARING KIT SUIT 8/6AH WARMAN", maxQty: "2", minQty: "1", equipmentTag: "Cyclone Pump barrel Bearing Assembly", uom: "EA", vendor: "CBC", oemPartNumber: "E005M" },
  { componentType: "Bearing", description: "F207ECO BRG HSG ECO 4 BOLT FLANGE SQU", maxQty: "2", minQty: "0", equipmentTag: "Lime Rotary Valve Gearbox Bearing", uom: "EA", vendor: "CBC", oemPartNumber: "F207ECO" },
  { componentType: "Bearing", description: "UC207-104NTN INSERT BALL BRG 1-1/4IN X 72X42.9MM WIR", maxQty: "2", minQty: "0", equipmentTag: "Lime Rotary Valve Gearbox Bearing", uom: "EA", vendor: "CBC", oemPartNumber: "UC207-104NTN" },
  { componentType: "Bearing", description: "7099-6.5X1M SILPAK01 SYNTHETIC/PTFE 6.5MMX1MTR", maxQty: "1", minQty: "0", equipmentTag: "Lime Rotary Valve Gearbox Bearing", uom: "EA", vendor: "CBC", oemPartNumber: "7099-6.5X1M" },
  { componentType: "Bearing", description: "2316ECO DBL ROW SELF ALIGN BRG ECO 2316", maxQty: "2", minQty: "1", equipmentTag: "Tails and Trash Screen Exciter Bearings", uom: "EA", vendor: "CBC", oemPartNumber: "2316ECO" },
  { componentType: "Bearing", description: "NU2316EMC3NSK BRG CYL ROLLER MET NSK 80X170X58MM", maxQty: "2", minQty: "1", equipmentTag: "Tails and Trash Screen Exciter Bearings", uom: "EA", vendor: "CBC", oemPartNumber: "NU2316EMC3NSK" },
  { componentType: "Bearing", description: "30311NSK BRG TAPER ROLLER MET CUP/CONE NSK 55X120X31.5MM", maxQty: "4", minQty: "2", equipmentTag: "Process Water Pump Bearings", uom: "EA", vendor: "CBC", oemPartNumber: "30311NSK" },
  { componentType: "Seal", description: "RSM05507008LNC ROTARY SEAL MET 55 X 70 X 8 MM LP NBR TC", maxQty: "4", minQty: "2", equipmentTag: "Process Water Pump Bearings", uom: "EA", vendor: "CBC", oemPartNumber: "RSM05507008LNC" },
  { componentType: "Bearing", description: "NJ2311ECPSKF SKF CYLINDRICAL ROLLER BEARING 55X120X43MM", maxQty: "4", minQty: "2", equipmentTag: "Process Water Pump", uom: "EA", vendor: "CBC", oemPartNumber: "NJ2311ECPSKF" },
  { componentType: "Bearing", description: "7311BECBPSKF SKF ANG CONTACT BALL BRG 55X120X29MM", maxQty: "4", minQty: "2", equipmentTag: "Process Water Pump", uom: "EA", vendor: "CBC", oemPartNumber: "7311BECBPSKF" },
  { componentType: "Mech Seal", description: "RB824-0530CCV RB824 53MM CARBON CERAMIC VITON", maxQty: "2", minQty: "1", equipmentTag: "Process Water Pump", uom: "EA", vendor: "CBC", oemPartNumber: "RB824-0530CCV" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GEARBOXES (Lines 752-755)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Gearbox", description: "R37 AMS80 HELICAL GEARBOX 71.7613018001.0001.18", maxQty: "1", minQty: "0", equipmentTag: "Regen Kiln", uom: "EA", vendor: "CBC", oemPartNumber: "R37 AMS80" },
  { componentType: "Gearbox", description: "H4Y21520ET000 SUMI G/BOX HSM215 (G) 20:1 TAPER GRIP BORE", maxQty: "1", minQty: "0", equipmentTag: "Mill Feed conveyor Gearbox", uom: "EA", vendor: "CBC", oemPartNumber: "H4Y21520ET000" },
  { componentType: "Gearbox", description: "044G0100 SUMI / FENNER BACKSTOP HSM215 (G)", maxQty: "1", minQty: "0", equipmentTag: "Mill Feed conveyor Gearbox", uom: "EA", vendor: "CBC", oemPartNumber: "044G0100" },
  { componentType: "Gearbox", description: "012H1075 SUMI TAPER BUSH 75MM HSM215 (G)", maxQty: "1", minQty: "0", equipmentTag: "Mill Feed conveyor Gearbox", uom: "EA", vendor: "CBC", oemPartNumber: "012H1075" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // VALVES (Lines 756-763, 821-828)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Valve", description: "DN200 ORBINOX ET SERIES KNIFE GATE VALVE CF8M BODY 316SS DISC", maxQty: "1", minQty: "0", equipmentTag: "Valve", uom: "EA", vendor: "KeyFlo", oemPartNumber: "ORBINOX-DN200" },
  { componentType: "Valve", description: "DN100 ORBINOX ET SERIES KNIFE GATE VALVE CF8M BODY 316SS DISC", maxQty: "1", minQty: "0", equipmentTag: "Valve", uom: "EA", vendor: "KeyFlo", oemPartNumber: "ORBINOX-DN100" },
  { componentType: "Valve", description: "DN200 CLARKSON SU10R KNIFE GATE VALVE with pneumatic actuator", maxQty: "1", minQty: "0", equipmentTag: "Filter Press Valves", uom: "EA", vendor: "KeyFlo", oemPartNumber: "123330" },
  { componentType: "Valve", description: "KEYSTONE F791 24VDC SOLENOID VALVE MODEL: F791NA024DCSWP00", maxQty: "2", minQty: "1", equipmentTag: "Filter Press Valves", uom: "EA", vendor: "KeyFlo", oemPartNumber: "10026120" },
  { componentType: "Valve", description: "DN50 F990 C4E4 BUTTERFLY VALVE PTFE SEAT WAFER", maxQty: "2", minQty: "1", equipmentTag: "Elution", uom: "EA", vendor: "KeyFlo", oemPartNumber: "2003075" },
  { componentType: "Valve", description: "HL8SP-50X50 50MM PRESSURE RELIEF VALVE SS BODY PTFE SEAT", maxQty: "1", minQty: "0", equipmentTag: "Elution", uom: "EA", vendor: "BRAECO", oemPartNumber: "HL8SP-50X50" },
  { componentType: "Valve", description: "MK50-50-DI-W 50MM JORDAN MK50 BACK PRESSURE REGULATOR DI BODY", maxQty: "1", minQty: "0", equipmentTag: "Elution", uom: "EA", vendor: "BRAECO", oemPartNumber: "MK50-50-DI-W" },
  { componentType: "Valve", description: "BVWNL200 200mm Lever Wafer Butterfly Valve 316 SS Disc, NBR Seat", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVWNL200" },
  { componentType: "Valve", description: "BVWNL150 150mm Lever Wafer Butterfly Valve 316 SS Disc, NBR Seat", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVWNL150" },
  { componentType: "Valve", description: "BVWNL100 100mm Lever Wafer Butterfly Valve 316 SS Disc, NBR Seat", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVWNL100" },
  { componentType: "Valve", description: "BVS2P050 50mm BSP 316 Stainless Ball Valve 2 Piece F/F Watermark", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVS2P050" },
  { componentType: "Valve", description: "BVS2P025 25mm BSP 316 Stainless Ball Valve 2 Piece F/F Watermark", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVS2P025" },
  { componentType: "Valve", description: "BVWNL180 180mm Lever Wafer Butterfly Valve 316 SS Disc, NBR Seat", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVWNL180" },
  { componentType: "Valve", description: "BVWNL080 80mm Lever Wafer Butterfly Valve 316 SS Disc, NBR Seat", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVWNL080" },
  { componentType: "Valve", description: "BVWNL050 50mm Lever Wafer Butterfly Valve 316 SS Disc, NBR Seat", maxQty: "10", minQty: "4", equipmentTag: "Valve", uom: "EA", vendor: "GWG", oemPartNumber: "BVWNL050" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MOTORS (Lines 829-860)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Motor", description: "Monarch Motor, 75kW, 1485rpm, Frame- D250M 125.2A, Foot Mount. PN-KTE46 W22M", maxQty: "1", minQty: "0", equipmentTag: "Thickener Pump Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE46 W22M" },
  { componentType: "Motor", description: "TECO Motor, 11kW, 1465rpm, Frame- D160M, 19.4A, Flange Mount. PN-MTE30 W22M", maxQty: "1", minQty: "0", equipmentTag: "Thickener Hydraulic Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MTE30 W22M" },
  { componentType: "Motor", description: "TechTop Motor, 30kW, 1760rpm, Frame-T3CR 200LI-4, 51.98 Flange Mounted. PN- KTE204 W22M>VSD", maxQty: "1", minQty: "0", equipmentTag: "Filter Press Hydraulic Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE204 W22M" },
  { componentType: "Motor", description: "TechTop Motor, 11kW, 1740rpm, Frame- T3CR 160M-4, 18.82A, Flange Mount. PN- MTE30 W22M", maxQty: "1", minQty: "0", equipmentTag: "Filter Press Hydraulic Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MTE30 W22M" },
  { componentType: "Motor", description: "WEG motor, 200kW, 1485rpm, Frame- D315/SM, Foot Mount. PN- KTE204 W22M>VSD", maxQty: "1", minQty: "0", equipmentTag: "Filter Press Feed Pump Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE204 W22M" },
  { componentType: "Motor", description: "SELI Motor, 15kW,1465rpm, Frame- S3G 160 L4, 27A, Foot Mount. PN- KTE32 W22M.", maxQty: "2", minQty: "1", equipmentTag: "Filter Press Collector/Extraction Belt Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE32 W22M" },
  { componentType: "Motor", description: "SELI Motor, 22kW, 1470rpm, Frame-S3G 180 L4, 40A, Foot Mount. PN- KTE36 W22M", maxQty: "1", minQty: "0", equipmentTag: "Filter Press Incline Belt Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE36 W22M" },
  { componentType: "Motor", description: "SELI Motor, 1.1kW, 1430rpm, Frame- S3A 90 S4, 2.5A, Flange Mount. PN- MTE10 W22M", maxQty: "1", minQty: "0", equipmentTag: "Filter Press Incline Belt Radial Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MTE10 W22M" },
  { componentType: "Motor", description: "UKCA,1.1kW,1430rpm,Frame- SK 90SP/4 TF, Flange Mount, 2.38A. PN- MTE10 W22M", maxQty: "1", minQty: "0", equipmentTag: "Floc Dosing pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MTE10 W22M" },
  { componentType: "Motor", description: "Flowmax,1.1kW,2800rpm, Frame- 2RB 510-7AT16,2.5A,Flange Mount.", maxQty: "1", minQty: "0", equipmentTag: "Floc Storage Tk Transfer Pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "" },
  { componentType: "Motor", description: "SEW Eurodrive,0.18 kW, 1375rpm, Frame-RF17 DRN63M4/DH,0.56A, Flange Mount. PN- RF17 DRN63M4/DH", maxQty: "1", minQty: "0", equipmentTag: "Floc Storage Tk Powder Feed Drive", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "RF17 DRN63M4/DH" },
  { componentType: "Motor", description: "OLI Vibra,0.18kW,3000rpm, Frame- AVE 20073E 23 AO, 3.5A, Foot mount,", maxQty: "1", minQty: "0", equipmentTag: "Floc Storage Tk Vibrator", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "" },
  { componentType: "Motor", description: "SEW Eurodrive, 0.55kW, 1435kW,Frame- FAF27 DRN89MK4,1.29A, Flange Mount.PN-FAF27 DRN89MK4", maxQty: "1", minQty: "0", equipmentTag: "Floc Mixing Tk Mixer", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "FAF27 DRN89MK4" },
  { componentType: "Motor", description: "WEG Motor,11kW,1465rpm, Frame-160M, 20.2A, Foot Mount. PN-KTE30 W22M", maxQty: "1", minQty: "0", equipmentTag: "Mill Feed Conveyor", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE30 W22M" },
  { componentType: "Motor", description: "Weg Motor, 110kW, 1485rpm, Frame- 280S/M, 183A, Foot Mount. PN- KTE50 W22M.DOL", maxQty: "1", minQty: "0", equipmentTag: "Cyclone Feed Pumps", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE50 W22M" },
  { componentType: "Motor", description: "Weg Motor, 3kW,1500rpm, Frame-TR100LB4, 6A, B14 Flange Mount. PN-M23C ALIE2W21", maxQty: "1", minQty: "0", equipmentTag: "Mill Hydraulic Oil Unit Cooler", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "M23C ALIE2W21" },
  { componentType: "Motor", description: "Teco Motor, 5.5kW, 1460rpm,Frame- D132S, 9.3A, Foot mount.PN- KTE21 W22M", maxQty: "2", minQty: "1", equipmentTag: "Knelson Concentrator/Thickener sump Pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE21 W22M" },
  { componentType: "Motor", description: "Murakami Sieki Motor, 1.7kW,1440rpm, 2.1A,Foot Mount", maxQty: "1", minQty: "0", equipmentTag: "Gravity Screen Vibrating Motor", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "" },
  { componentType: "Motor", description: "Teco Motor, 5.5kW,1460rpm,Frame-D132S,9.3A, Foot Mount. PN- KTE21 W22M", maxQty: "1", minQty: "0", equipmentTag: "Mill Sump Pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE21 W22M" },
  { componentType: "Motor", description: "WEG Motor, 3kW, 1445rpm, Foot mount. PN- KTE23 W22M", maxQty: "1", minQty: "0", equipmentTag: "Gravity Table", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE23 W22M" },
  { componentType: "Motor", description: "WEG Motor, 22kW, 1470rpm, Frame-180L, 38A Flange Mount. PN- MTE36 W22M", maxQty: "1", minQty: "0", equipmentTag: "Agitator Motors", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MTE36 W22M" },
  { componentType: "Motor", description: "WEG Motor,110kW, 1485rpm, Frame- 280S/M, 183A, Foot Mount, KTE50 W22M.DOL", maxQty: "1", minQty: "0", equipmentTag: "Tails Pumps", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE50 W22M" },
  { componentType: "Motor", description: "Teco Motor, 5.5kW,1460rpm, Frame-D132S, 9.3A, Foot Mount. PN- KTE21 W22M", maxQty: "1", minQty: "0", equipmentTag: "Tank Sump Pumps", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE21 W22M" },
  { componentType: "Motor", description: "Monarch Motor, 0.37kW, 2800rpm, Frame-MS7112, Flange Mount. PN- MTE3 W22M", maxQty: "1", minQty: "0", equipmentTag: "EW blower", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MTE3 W22M" },
  { componentType: "Motor", description: "Teco Motor, .5kW, 1460rpm, Frame- D132S,9.3A, Foot Mount. PN- KTE21 W22M", maxQty: "1", minQty: "0", equipmentTag: "Kiln Sump Pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE21 W22M" },
  { componentType: "Motor", description: "Teco Motor, 3kW, 1460rpm, Frame- D100L, 6.01A, Foot Mount. PN- KTE23 W22M", maxQty: "1", minQty: "0", equipmentTag: "Kiln Discharge Pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE23 W22M" },
  { componentType: "Motor", description: "WEG Motor,0.75kW, 1440rpm, Frame- W22M, 2.87A, Flange Mount. PN- MTE8 W22M", maxQty: "1", minQty: "0", equipmentTag: "Kiln Carbon Feed Pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MTE8 W22M" },
  { componentType: "Motor", description: "Bonfiglioli Motor,.75kW, 1400rpm, Frame- BN 80 B4, Flange Mount. PN- 00.75kw3PH4PB5BON", maxQty: "1", minQty: "0", equipmentTag: "Kiln Drive #1", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "00.75kw3PH4PB5BON" },
  { componentType: "Motor", description: "WEG Motor, 55kW, 1480rpm, Frame- 250S/M, 93.4A, Foot Mount. PN- KTE44 W22M", maxQty: "1", minQty: "0", equipmentTag: "Process Water Pump", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KTE44 W22M" },
  { componentType: "Motor", description: "Bonfiglioli Motor, 1.5kW, Flange Mount. PN- MX3SB4/230/400V Compact Motor", maxQty: "1", minQty: "0", equipmentTag: "Inter Tank Screen Motor", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "MX3SB4/230/400V" },
  { componentType: "Motor", description: "URAS Motor,1.5kW. PN- KEE-34-4W", maxQty: "2", minQty: "1", equipmentTag: "Carbon transfer Screen", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KEE-34-4W" },
  { componentType: "Motor", description: "URAS KEE 75-4 URAS Vibrator motor. 3 kW, FLA 5.7, 1445rpm", maxQty: "2", minQty: "1", equipmentTag: "Tails & Trash Screen Exciter", uom: "EA", vendor: "Newmans Rewinding", oemPartNumber: "KEE 75-4" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PUMPS & PUMP COMPONENTS (Lines 591-643, 777-781)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Pump", description: "Impeller", maxQty: "2", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Volute Liner. Steel", maxQty: "", minQty: "", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Frame Plate Liner Insert Steel", maxQty: "", minQty: "", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Throat Bush Steel", maxQty: "", minQty: "", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Volute Liner Seal. Steel", maxQty: "", minQty: "", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Shaft Sleeve", maxQty: "2", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "TOROIDAL O-RING", maxQty: "2", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "IMPELLER O-RING", maxQty: "2", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "O-ring", maxQty: "2", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Joint Ring intake", maxQty: "4", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Joint Ring Discharge", maxQty: "4", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "SEAL, EXPELLER RING OR STUFFING BOX", maxQty: "4", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Q20 (Kevlar) not good on C21 Sleeve", maxQty: "4", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Lantern Restrictor", maxQty: "4", minQty: "1", equipmentTag: "Cyclone Feed Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Impeller", maxQty: "", minQty: "", equipmentTag: "Tails Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Frame Plate Liner", maxQty: "", minQty: "", equipmentTag: "Tails Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Cover plate Liner", maxQty: "", minQty: "", equipmentTag: "Tails Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Throat Bush", maxQty: "", minQty: "", equipmentTag: "Tails Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "Stuffing box O-Ring", maxQty: "", minQty: "", equipmentTag: "Tails Pump", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Pump", description: "WP-02-12239 P200/PKPPP/TWS/TF/PTV AOD WILDEN PUMP", maxQty: "1", minQty: "0", equipmentTag: "Gold Room", uom: "EA", vendor: "PPS", oemPartNumber: "WP-02-12239" },
  { componentType: "Pump", description: "WP-00-9616 1/4\" WILDEN P0.25/PZPPP/TNL/TF/PTV", maxQty: "1", minQty: "0", equipmentTag: "Gold Room", uom: "EA", vendor: "PPS", oemPartNumber: "WP-00-9616" },
  { componentType: "Pump", description: "WP-08-14983 WILDEN PUMP POLY TEFLON 50MM", maxQty: "1", minQty: "0", equipmentTag: "Gold Room", uom: "EA", vendor: "PPS", oemPartNumber: "WP-08-14983" },
  { componentType: "Pump", description: "96500530 GRUNDFOS PUMP MULTISTAGE CRI20-7", maxQty: "1", minQty: "0", equipmentTag: "Water Services", uom: "EA", vendor: "PPS", oemPartNumber: "96500530" },
  { componentType: "Pump", description: "LWSV3SV09F011T. 1.1 KW 3 PH MULTI STAGE 26-10-16LC491.", maxQty: "1", minQty: "0", equipmentTag: "Water Services", uom: "EA", vendor: "PPS", oemPartNumber: "LWSV3SV09F011T" },
  { componentType: "Pump", description: "LOWARA PUMP MULTISTAGE SV10 4.0KW 415V", maxQty: "1", minQty: "0", equipmentTag: "Water Services", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Mech Seal", description: "LWSPKL01AAE LOWARA MECH SEAL SV8-SV16", maxQty: "2", minQty: "1", equipmentTag: "Water Services", uom: "EA", vendor: "PPS", oemPartNumber: "LWSPKL01AAE" },
  { componentType: "Mech Seal", description: "LWSPKL01AAD LOWARA SEAL KIT C/W O-RINGS SV 2-4 ESV 1,3,. 5", maxQty: "2", minQty: "1", equipmentTag: "Water Services", uom: "EA", vendor: "PPS", oemPartNumber: "LWSPKL01AAD" },
  { componentType: "Mech Seal", description: "96525458 GRUNDFOS SHAFT SEAL KIT CR/N 32/45/64/90 HQQE", maxQty: "2", minQty: "1", equipmentTag: "Water Services", uom: "EA", vendor: "PPS", oemPartNumber: "96525458" },
  { componentType: "Pump", description: "97725544. PUMP GRUNDFOS CRI45-3", maxQty: "1", minQty: "0", equipmentTag: "Water Services", uom: "EA", vendor: "PPS", oemPartNumber: "97725544" },
  { componentType: "Pump", description: "PUMP DLT 1050-2H BARE SHAFT (Complete replacement Pump)", maxQty: "1", minQty: "0", equipmentTag: "Filter Press Feed Pump", uom: "EA", vendor: "Matec", oemPartNumber: "" },
  { componentType: "Pump", description: "IMPELLER ØF60 -100 Part No. CDA000151.02", maxQty: "2", minQty: "1", equipmentTag: "Filter Press Feed Pump", uom: "EA", vendor: "Matec", oemPartNumber: "CDA000151.02" },
  { componentType: "Pump", description: "IMPELLER Ø48 - 100 Part No. CDA000150.00", maxQty: "2", minQty: "1", equipmentTag: "Filter Press Feed Pump", uom: "EA", vendor: "Matec", oemPartNumber: "CDA000150.00" },
  { componentType: "Mech Seal", description: "MECH. SEAL EMG1 G6 Ø70 SILICON CARBIDE Part No. TENUEMG1G6D70CSCS", maxQty: "4", minQty: "2", equipmentTag: "Filter Press Feed Pump", uom: "EA", vendor: "Matec", oemPartNumber: "TENUEMG1G6D70CSCS" },
  { componentType: "Pump", description: "96517212. PUMP GRUNDFOS CRN5-12.", maxQty: "1", minQty: "0", equipmentTag: "RO Plant", uom: "EA", vendor: "PPS", oemPartNumber: "96517212" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // THICKENER UNDERFLOW PUMP COMPONENTS (Lines 633-643)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Pump", description: "KCPL-4ESRTL.NL56 KETO COVER PLATE LINER MULTIFIT 4E RUBBER", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "KCPL-4ESRTL.NL56" },
  { componentType: "Pump", description: "KFPL-4ETLHS.NL56 KETO FRAME PLATE LINER THK MULTIFIT 4E RUBBER", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "KFPL-4ETLHS.NL56" },
  { componentType: "Pump", description: "MISC TRB-4E.NL56. THROAT BUSH 4E RUBBER", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "TRB-4E.NL56" },
  { componentType: "Pump", description: "INJR-4E.SL01 KETO JOINT RING INTAKE", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "INJR-4E.SL01" },
  { componentType: "Pump", description: "KSBOX-DHS.WI05 DHS STUFFING BOX", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "KSBOX-DHS.WI05" },
  { componentType: "Pump", description: "KSLV/L-DM.420S KETO SHAFT SLEEVE AND SPACER", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "KSLV/L-DM.420S" },
  { componentType: "Pump", description: "MISC LTRR-D.316S. LANTERN RING RESTRICTOR D 316S/S", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "LTRR-D.316S" },
  { componentType: "Pump", description: "KPAK-D.GP65 KETO GLAND PACKING D' GP65 13X13", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "KPAK-D.GP65" },
  { componentType: "Pump", description: "OR-148.SL10 KETO ORING", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "OR-148.SL10" },
  { componentType: "Pump", description: "MISC KHEE-4E.UR01. IMP, HI EFF, 5VC, 4E, URETHANE", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "KHEE-4E.UR01" },
  { componentType: "Pump", description: "COT-4E.CS62 KETO THROAT BUSH WEDGE COTTERS 4E MSZP", maxQty: "2", minQty: "1", equipmentTag: "Thickener Underflow Pump", uom: "EA", vendor: "PPS", oemPartNumber: "COT-4E.CS62" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // LUBRICANTS (Lines 647-654)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Lube", description: "RENOLIN CLP 220 1000L IBC", maxQty: "2", minQty: "1", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "RENOLIN CLP 220" },
  { componentType: "Lube", description: "RENOLIN CLP 320 1000L IBC", maxQty: "2", minQty: "1", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "RENOLIN CLP 320" },
  { componentType: "Lube", description: "RENOLIT XTB 2 450G CRT", maxQty: "48", minQty: "24", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "RENOLIT XTB 2" },
  { componentType: "Lube", description: "RenoLit GP3 450g CRT", maxQty: "12", minQty: "6", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "RenoLit GP3" },
  { componentType: "Lube", description: "RENOLIN B 46 PLUS 1000L IBC", maxQty: "2", minQty: "1", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "RENOLIN B 46 PLUS" },
  { componentType: "Lube", description: "RENOLIN B 68 PLUS 205L MET", maxQty: "2", minQty: "1", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "RENOLIN B 68 PLUS" },
  { componentType: "Lube", description: "TITAN SUPERGEAR GL-5 85W-140 20L TPL", maxQty: "2", minQty: "1", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "TITAN SUPERGEAR GL-5" },
  { componentType: "Lube", description: "RENOCLEAN DEGREASER 9110 205L MET", maxQty: "2", minQty: "1", equipmentTag: "Lubricants", uom: "EA", vendor: "Fuchs", oemPartNumber: "RENOCLEAN 9110" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // POLY FITTINGS (Lines 655-702) - LOW PRIORITY
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Poly", description: "7010014 25mm Metric Coupling PlassonCompression", maxQty: "40", minQty: "20", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7010014" },
  { componentType: "Poly", description: "CME025 25mm Metric 90D Elbow Compression", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CME025" },
  { componentType: "Poly", description: "CMT025 25mm Metric Tee Compression", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMT025" },
  { componentType: "Poly", description: "7020026 25mm x 1\" Metric Male Adaptor Plasson", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7020026" },
  { componentType: "Poly", description: "CMC032 32mm Metric Coupling Compression", maxQty: "40", minQty: "20", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMC032" },
  { componentType: "Poly", description: "7050009 32mm 90D Metric Elbow Plasson", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7050009" },
  { componentType: "Poly", description: "7040009 32mm Metric Tee Plasson", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7040009" },
  { componentType: "Poly", description: "7020028 32mm x 1\" Metric Male Adaptor Plasson", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7020028" },
  { componentType: "Poly", description: "CMC040 40mm Metric Coupling Compression", maxQty: "40", minQty: "20", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMC040" },
  { componentType: "Poly", description: "7050010 40mm 90D Metric Elbow Plasson", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7050010" },
  { componentType: "Poly", description: "CMT040 40mm Metric Tee Compression", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMT040" },
  { componentType: "Poly", description: "7020031 40mm x 1\" Metric Male Adaptor Plasson", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7020031" },
  { componentType: "Poly", description: "CMC050 50mm Metric Coupling Compression", maxQty: "40", minQty: "20", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMC050" },
  { componentType: "Poly", description: "7050011 50mm 90D Metric Elbow Plasson", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7050011" },
  { componentType: "Poly", description: "CMT050 50mm Metric Tee Compression", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMT050" },
  { componentType: "Poly", description: "7020038 50mm x 2\" Metric Male AdaptorPlasson", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7020038" },
  { componentType: "Poly", description: "CMC063 63mm Metric Coupling Compression", maxQty: "40", minQty: "20", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMC063" },
  { componentType: "Poly", description: "CME063 63mm Metric 90D Elbow Compression", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CME063" },
  { componentType: "Poly", description: "CMT063 63mm Metric Tee Compression", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMT063" },
  { componentType: "Poly", description: "7020039 63mm x 1 1/4\" Metric Male Adaptor Plasson", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7020039" },
  { componentType: "Poly", description: "7010020 90mm Metric Coupling Plasson Compression", maxQty: "40", minQty: "20", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7010020" },
  { componentType: "Poly", description: "7050014 90mm 90D Metric Elbow Plasson", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7050014" },
  { componentType: "Poly", description: "7040014 90mm Metric Tee Plasson", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "7040014" },
  { componentType: "Poly", description: "CMMA090X2 90mm x 2\" Metric Male Adaptor Compression", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "CMMA090X2" },
  { componentType: "Poly", description: "EFC11110 110mm SDR11 Coupling Electrofusion", maxQty: "40", minQty: "20", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFC11110" },
  { componentType: "Poly", description: "EFE9011110 110mm SDR11 90D Elbow Electrofusion", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFE9011110" },
  { componentType: "Poly", description: "EFT11110 110mm SDR11 Tee Electrofusion", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFT11110" },
  { componentType: "Poly", description: "SFL11110 110mm PE100 SDR11 Long Spigot Stub Flange", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "SFL11110" },
  { componentType: "Flange", description: "110mm x 4\" Table E AS2129 Galvanised Backing Flange", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "" },
  { componentType: "Poly", description: "EFC11160 160mm SDR11 Coupling Electrofusion", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFC11160" },
  { componentType: "Poly", description: "EFE9011160 160mm SDR11 90D Elbow Electrofusion", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFE9011160" },
  { componentType: "Poly", description: "EFT11160 160mm SDR11 Tee Electrofusion", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFT11160" },
  { componentType: "Poly", description: "SFL11160 160mm PE100 SDR11 Long Spigot Stub Flange", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "SFL11160" },
  { componentType: "Flange", description: "BFGE160 160mm x 6\" Table E AS2129 Galvanised Backing Flange", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "BFGE160" },
  { componentType: "Poly", description: "EFC11180 180mm SDR11 Coupling Electrofusion", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFC11180" },
  { componentType: "Poly", description: "EFE9011180 180mm SDR11 90D Elbow Electrofusion", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFE9011180" },
  { componentType: "Poly", description: "EFT11180 180mm SDR11 Tee Electrofusion", maxQty: "10", minQty: "5", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFT11180" },
  { componentType: "Poly", description: "SFL11180 180mm PE100 SDR11 Long Spigot Stub Flange", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "SFL11180" },
  { componentType: "Flange", description: "180mm x 6\" Table E AS2129 Galvanised Backing Flange", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "" },
  { componentType: "Poly", description: "EFC11200 200mm SDR11 Coupling Electrofusion", maxQty: "20", minQty: "10", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFC11200" },
  { componentType: "Poly", description: "EFT11200 200mm SDR11 Tee Electrofusion", maxQty: "6", minQty: "2", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "EFT11200" },
  { componentType: "Poly", description: "SFL11200 200mm PE100 SDR11 Long Spigot Stub. Flange", maxQty: "10", minQty: "4", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "SFL11200" },
  { componentType: "Flange", description: "BFGE200 200mm x 8\" Table E AS2129 Galvanised Backing Flange", maxQty: "10", minQty: "4", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "BFGE200" },
  { componentType: "Saddle", description: "TSD063X2 63mm x 2\" Ductile Iron Tapping Saddle SS Bolt", maxQty: "10", minQty: "4", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "TSD063X2" },
  { componentType: "Saddle", description: "TSD090X2 90mm x 2\" Ductile Iron Tapping. Saddle SS Bolt", maxQty: "10", minQty: "4", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "TSD090X2" },
  { componentType: "Saddle", description: "TSD110X2 110mm x 2\" Ductile Iron Tapping. Saddle SS Bolt", maxQty: "10", minQty: "4", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "TSD110X2" },
  { componentType: "Saddle", description: "TSD160X2 160mm x 2\" Ductile Iron Tapping. Saddle SS Bolt", maxQty: "10", minQty: "4", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "TSD160X2" },
  { componentType: "Saddle", description: "TSD200X2 200mm x 2\" Ductile Iron Tapping. Saddle SS Bolt", maxQty: "10", minQty: "4", equipmentTag: "Poly Fittings", uom: "EA", vendor: "GWG", oemPartNumber: "TSD200X2" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // POTABLE WATER (Lines 868-875)
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Potable Water", description: "RES6 PURETEC RES6 ELECTRONIC REPLACEMENT BALLAST 240V", maxQty: "2", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "RES6" },
  { componentType: "Potable Water", description: "RQS6 PURETEC HYBRID QUARTZ SLEEVE 540MM DOE", maxQty: "2", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "RQS6" },
  { componentType: "Potable Water", description: "RL6 PURETEC HYBRID UV LAMP, SUITS G/P/R SERIES 520MM 4 PIN 46W", maxQty: "2", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "RL6" },
  { componentType: "Potable Water", description: "PL05MP2 PURETEC CARTRIDGE PLEATED 20\" S MAXIPLUS 5UM", maxQty: "2", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "PL05MP2" },
  { componentType: "Potable Water", description: "CB05MP2 PURETEC FILTER CARTRIDGE CARBON 20\" S 10MICRON", maxQty: "2", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "CB05MP2" },
  { componentType: "Potable Water", description: "PX01MP2 PURETEC CARTRIDGE SEDI 20\" S 1 MICRON", maxQty: "2", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "PX01MP2" },
  { componentType: "Potable Water", description: "HR-G13R11P PURETEC HYBRID P SERIES MAINTENANCE KIT G13 & R11", maxQty: "2", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "HR-G13R11P" },
  { componentType: "Pump", description: "98507627 GRUNDFOS PUMP BOOSTER SELF-PRIMING CMB-SP 3-28", maxQty: "1", minQty: "1", equipmentTag: "Potable Water", uom: "EA", vendor: "PPS", oemPartNumber: "98507627" },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MISC ITEMS - Encoder, Portable Pump, Filters
  // ═══════════════════════════════════════════════════════════════════════════
  { componentType: "Encoder", description: "Encoder with Torque arm. HOG10 DN 1024 R LR 16H7 KLK", maxQty: "1", minQty: "0", equipmentTag: "Mill Motor", uom: "EA", vendor: "Toshiba", oemPartNumber: "HOG10 DN 1024" },
  { componentType: "Pump", description: "MACNAUGHT AFP12-40LP 12V ELECTRIC DIESEL PUMP 40LPM", maxQty: "1", minQty: "0", equipmentTag: "LV Diesel Pod", uom: "EA", vendor: "Sydney Tools", oemPartNumber: "AFP12-40LP" },
  { componentType: "Filter", description: "MISC SEDIMENT-X FILTER", maxQty: "2", minQty: "1", equipmentTag: "Ice Machine Filters", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Filter", description: "MISC CARBON-X FILTER", maxQty: "2", minQty: "1", equipmentTag: "Ice Machine Filters", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Filter", description: "MISC FT3. FILTER", maxQty: "2", minQty: "1", equipmentTag: "Ice Machine Filters", uom: "EA", vendor: "PPS", oemPartNumber: "" },
  { componentType: "Sensor", description: "TEEXS112B3PBM12 PROXIMITY SENSOR M12 PNP NC 4MM DETECTION 10-36VDC", maxQty: "2", minQty: "1", equipmentTag: "Filter Conveyor Underspeed Sensor", uom: "EA", vendor: "MME", oemPartNumber: "TEEXS112B3PBM12" },
  { componentType: "Relay", description: "TEERUMC22BD UNIV RELAY 10 2CO LOCK LED 24V DC", maxQty: "8", minQty: "4", equipmentTag: "Generators", uom: "EA", vendor: "MME", oemPartNumber: "TEERUMC22BD" },
  { componentType: "Relay", description: "TEERUZ-C2M Mixed Contact Socket 10A 250VAC For RUMC2 Relay", maxQty: "8", minQty: "4", equipmentTag: "Generators", uom: "EA", vendor: "MME", oemPartNumber: "TEERUZ-C2M" },
  { componentType: "Portable Pump", description: "FT201818-UNIT FLEXTOOL PUMP SUBMERSIBLE P212A-9 ABRASION RESISTANT 9MTR", maxQty: "2", minQty: "1", equipmentTag: "Portable Pumps", uom: "EA", vendor: "PPS", oemPartNumber: "FT201818" },
  { componentType: "Poly", description: "SF11180 180mm PE100 SDR11 Short Stub Flange", maxQty: "12", minQty: "4", equipmentTag: "Filter Feed T-Piece", uom: "EA", vendor: "GWG", oemPartNumber: "SF11180" },
  { componentType: "Poly", description: "TLS11180 180mm PE100 SDR11 Long Spigot Tee", maxQty: "4", minQty: "2", equipmentTag: "Filter Feed T-Piece", uom: "EA", vendor: "GWG", oemPartNumber: "TLS11180" },
  { componentType: "Flange", description: "BFGE180 180mm Galvanised Backing Flange", maxQty: "12", minQty: "6", equipmentTag: "Filter Feed T-Piece", uom: "EA", vendor: "GWG", oemPartNumber: "BFGE180" },
];

// Transform raw catalogue items to SiteSpareItem format, excluding duplicates
let catalogueIdCounter = 168; // Start after critical spares (167 items)

const catalogueData: SiteSpareItem[] = rawCatalogueItems
  .filter(item => !existingDescriptions.has(item.description.toLowerCase().trim()))
  .map((item) => {
    const { priority, reason } = determinePriority(item.componentType, item.description);
    const location = determineArea(item.equipmentTag, item.description);
    
    return {
      id: `SS-${String(catalogueIdCounter++).padStart(4, "0")}`,
      area: location.area,
      areaLabel: location.areaLabel,
      subArea: location.subArea,
      system: location.system,
      parentAsset: "",
      assetNumber: "",
      pidTag: item.equipmentTag.startsWith("30-") || item.equipmentTag.startsWith("50-") || 
              item.equipmentTag.startsWith("60-") || item.equipmentTag.startsWith("70-") || 
              item.equipmentTag.startsWith("80-") ? item.equipmentTag : "",
      componentName: item.componentType,
      componentType: item.componentType,
      sparePartDescription: item.description,
      oemPartNumber: item.oemPartNumber,
      manufacturer: "",
      vendor: item.vendor,
      assetManufacturer: "",
      assetModel: "",
      priority,
      priorityReason: reason,
      reviewFlag: false,
      spareCriticality: priority === "HIGH" ? "High" : priority === "MEDIUM" ? "Medium" : "Low",
      criticalitySource: "Assumed" as const,
      reasonCritical: reason,
      minQty: item.minQty || "TBC",
      maxQty: item.maxQty || "TBC",
      qtyPerSystem: "1",
      unitPrice: "",
      uom: item.uom || "EA",
      leadTime: "",
      storageRequirement: "",
      notes: "",
      confidence: "Medium" as const,
      status: "Provisional" as const,
    };
  });

// Site Spares data - MASTER INVENTORY
// This is the source of truth for ALL site spares
// Merges Critical Spares + Site Catalogue data (deduplicated)
export const siteSparesData: SiteSpareItem[] = [
  ...transformedCriticalSpares,
  ...catalogueData,
];

// Helper functions
export const getPriorityCounts = (): { high: number; medium: number; low: number } => {
  const high = siteSparesData.filter((item) => item.priority === "HIGH").length;
  const medium = siteSparesData.filter((item) => item.priority === "MEDIUM").length;
  const low = siteSparesData.filter((item) => item.priority === "LOW").length;
  return { high, medium, low };
};

// Get items flagged for review
export const getReviewItems = (): SiteSpareItem[] => {
  return siteSparesData.filter((item) => item.reviewFlag);
};

// Get critical items only (HIGH + MEDIUM) for Critical Spares Catalogue
export const getCriticalItems = (): SiteSpareItem[] => {
  return siteSparesData.filter((item) => item.priority === "HIGH" || item.priority === "MEDIUM");
};
