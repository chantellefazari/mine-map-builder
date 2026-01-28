// Critical Spares Register Data
// Contains HIGH PRIORITY items from the Site Spares Catalogue
// These are items that would cause plant stoppage or have long lead times

export interface SpareItem {
  id: string;
  // Hierarchy linkage
  area: string;
  subArea: string;
  system: string;
  parentAsset: string;
  assetNumber: string; // Modern asset number from tree (e.g., APRN01-GMR01)
  pidTag: string;
  // Component details
  componentName: string;
  componentType: string;
  sparePartDescription: string;
  oemPartNumber: string;
  manufacturer: string;
  vendor: string;
  assetManufacturer: string;
  assetModel: string;
  // Criticality
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
  notes: string;
  status: "Provisional" | "Confirmed" | "TBC";
}

// Critical Spares data - Populated from HIGH priority items in Site Spares Catalogue
// All data is from the attached document - NO invented or assumed data
export const sparesData: SpareItem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GRINDING AREA (04)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // --- 4-FE-100 Reclaim Feeder (APRN01) ---
  { id: "CS-001", area: "Grinding", subArea: "Materials Handling", system: "Reclaim Feeder", parentAsset: "4-FE-100", assetNumber: "APRN01-MTR01", pidTag: "04-FE-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Reclaim Feeder Motor", oemPartNumber: "SEW-EURODRIVE KA107R77 DRN112M4/V", manufacturer: "SEW", vendor: "SEW", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "$16,450.00", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-002", area: "Grinding", subArea: "Materials Handling", system: "Reclaim Feeder", parentAsset: "4-FE-100", assetNumber: "APRN01-GBX01", pidTag: "04-FE-100", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Reclaim Feeder Gearbox", oemPartNumber: "SEW-EURODRIVE KA107R77 DRN112M4/V", manufacturer: "SEW", vendor: "SEW", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-FE-101 Transfer Conveyor (CV01) ---
  { id: "CS-003", area: "Grinding", subArea: "Materials Handling", system: "Transfer Conveyor", parentAsset: "4-FE-101", assetNumber: "CV01-MTR01", pidTag: "04-FE-101", componentName: "Motor", componentType: "Motor", sparePartDescription: "Transfer Conveyor Motor", oemPartNumber: "SEW-EURODRIVE KA77/T.DRE132M4/RS", manufacturer: "SEW", vendor: "SEW", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-004", area: "Grinding", subArea: "Materials Handling", system: "Transfer Conveyor", parentAsset: "4-FE-101", assetNumber: "CV01-GBX01", pidTag: "04-FE-101", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Transfer Conveyor Gearbox", oemPartNumber: "SEW-EURODRIVE KA77/T.DRE132M4/RS", manufacturer: "SEW", vendor: "SEW", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-BC-100 Mill Feed Conveyor (CV02) ---
  { id: "CS-005", area: "Grinding", subArea: "Materials Handling", system: "Mill Feed Conveyor", parentAsset: "4-BC-100", assetNumber: "CV02-MTR01", pidTag: "04-BC-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Mill Feed Conveyor Motor", oemPartNumber: "KTE30 PHEM", manufacturer: "WEG", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-006", area: "Grinding", subArea: "Materials Handling", system: "Mill Feed Conveyor", parentAsset: "4-BC-100", assetNumber: "CV02-GBX01", pidTag: "04-BC-100", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Gearbox (Robbie please advise)", oemPartNumber: "TBC", manufacturer: "", vendor: "CBC", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 4-WE-506 Weightometer ---
  { id: "CS-007", area: "Grinding", subArea: "Instrumentation", system: "Weightometer", parentAsset: "4-WE-506", assetNumber: "WGT01", pidTag: "04-WE-506", componentName: "Weightometer Replacement", componentType: "Mechanical", sparePartDescription: "Weightometer replacement", oemPartNumber: "WF16-600-4000", manufacturer: "Tecweigh", vendor: "Tecweigh", assetManufacturer: "Tecweigh", assetModel: "WF16-600-4000", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Instrumentation - production monitoring", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "$65,000.00", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-FE-102 Lime Rotary Valve ---
  { id: "CS-008", area: "Grinding", subArea: "Reagents", system: "Lime Rotary Valve", parentAsset: "4-FE-102", assetNumber: "LME01-MTR01", pidTag: "04-FE-102", componentName: "Motor and Gearbox", componentType: "Motor and Gearbox", sparePartDescription: "Lime Rotary Valve Motor and Gearbox", oemPartNumber: "MD67-M1 / Ratio 34.29 / 1.5kW", manufacturer: "Melbourne Machinery Co", vendor: "", assetManufacturer: "Melbourne Machinery Co", assetModel: "MD67-M1", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "$1,390.00", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-ML-100 Primary Ball Mill (BM01) ---
  { id: "CS-009", area: "Grinding", subArea: "Comminution", system: "Primary Ball Mill", parentAsset: "4-ML-100", assetNumber: "BM01-MTR01", pidTag: "04-ML-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Primary Ball Mill Motor 1000kW", oemPartNumber: "1LA4 454-4AN70-Z (1000kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-010", area: "Grinding", subArea: "Comminution", system: "Primary Ball Mill", parentAsset: "4-ML-100", assetNumber: "BM01-PIN01", pidTag: "04-ML-100", componentName: "Pinion Assembly", componentType: "Mechanical", sparePartDescription: "Pinion assembly (2 bearings, 2 pillow block, 1 pinion)", oemPartNumber: "TBC", manufacturer: "", vendor: "BLA", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Mill pinion - plant stoppage", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "", notes: "", status: "TBC" },
  { id: "CS-011", area: "Grinding", subArea: "Comminution", system: "Primary Ball Mill", parentAsset: "4-ML-100", assetNumber: "BM01-PIN02", pidTag: "04-ML-100", componentName: "Pinion", componentType: "Pinion", sparePartDescription: "Pinion (Robbie please advise)", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Mill pinion - plant stoppage", minQty: "0", maxQty: "0", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 4-GR-100 Primary Ball Mill Gear Reducer (GRD-BM-GBX) ---
  { id: "CS-012", area: "Grinding", subArea: "Comminution", system: "Primary Ball Mill Gear Reducer", parentAsset: "4-GR-100", assetNumber: "GRD-BM-GBX", pidTag: "04-GR-100", componentName: "Gear Box Replacement", componentType: "Gearbox", sparePartDescription: "Gear Box Replacement unit", oemPartNumber: "JKD 4504150638.01.001 / H1 SH 15 B", manufacturer: "Siemens", vendor: "Flender", assetManufacturer: "Flender", assetModel: "H1 SH 15B", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "$70,000.00", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-LS-100 Primary Ball Mill Lube System ---
  { id: "CS-013", area: "Grinding", subArea: "Comminution", system: "Lube System", parentAsset: "4-LS-100", assetNumber: "GRD-LP-LPUMP-D-MTR", pidTag: "04-LS-100", componentName: "Main Lube Pump Motor", componentType: "Motor", sparePartDescription: "Main Lube Pump Motor", oemPartNumber: "Weg W22 3 Phase 7.5kW / 4P / 132S / 1460 / 415V", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-014", area: "Grinding", subArea: "Comminution", system: "Lube System", parentAsset: "4-LS-100", assetNumber: "GRD-LP-LPUMP-S-MTR", pidTag: "04-LS-100", componentName: "Standby Lube Pump Motor", componentType: "Motor", sparePartDescription: "Standby Lube Pump Motor", oemPartNumber: "Weg W22 3 Phase 7.5kW / 4P / 132S / 1460 / 415V", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-015", area: "Grinding", subArea: "Comminution", system: "Lube System", parentAsset: "4-LS-100", assetNumber: "GRD-LP-LPUMP-D", pidTag: "04-LS-100", componentName: "Main Lube Pump", componentType: "Pump", sparePartDescription: "Main Lube Pump", oemPartNumber: "P/N: 3G55 AT10V A6O0 0036 00", manufacturer: "Rexroth", vendor: "Southern Cross", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Pump - process critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-016", area: "Grinding", subArea: "Comminution", system: "Lube System", parentAsset: "4-LS-100", assetNumber: "GRD-LP-LPUMP-S", pidTag: "04-LS-100", componentName: "Standby Lube Pump", componentType: "Pump", sparePartDescription: "Standby Lube Pump", oemPartNumber: "P/N: 3G55 AT10V A6O0 0036 00", manufacturer: "Rexroth", vendor: "Southern Cross", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Pump - process critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-017", area: "Grinding", subArea: "Comminution", system: "Lube System", parentAsset: "4-LS-100", assetNumber: "GRD-LP-CLR01", pidTag: "04-LS-100", componentName: "Air Cooler Replacement", componentType: "Air Cooler", sparePartDescription: "Air Cooler replacement", oemPartNumber: "P/N: AKG LA-80-4-LN / Motor 0.09kW 230/400V 50Hz IE2 4P B14/1", manufacturer: "AKG", vendor: "", assetManufacturer: "AKG", assetModel: "LA-80-4-LN", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Air cooler - lube system critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-PP-100 Mill Discharge Pump (PUMP01) ---
  { id: "CS-018", area: "Grinding", subArea: "Comminution", system: "Mill Discharge Pump", parentAsset: "4-PP-100", assetNumber: "PUMP01-MTR01", pidTag: "04-PP-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Mill Discharge Pump Motor", oemPartNumber: "Weg W22 Xd 185kW 985rpm 315S/M 415V 50Hz IE3", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-019", area: "Grinding", subArea: "Comminution", system: "Mill Discharge Pump", parentAsset: "4-PP-100", assetNumber: "PUMP01", pidTag: "04-PP-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Mill Discharge Pump - Full Replacement", oemPartNumber: "Metso HM200 (MCR200-320) Rubber Lined", manufacturer: "Metso", vendor: "Metso", assetManufacturer: "Metso", assetModel: "HM200 / MCR200-320", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "$30,000.00", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-SC-100 Mill Discharge Screen (SCN01) ---
  { id: "CS-020", area: "Grinding", subArea: "Comminution", system: "Mill Discharge Screen", parentAsset: "4-SC-100", assetNumber: "SCN01-MTR01", pidTag: "04-SC-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Mill Discharge Screen Motor", oemPartNumber: "ABB M2BAX160MLB4IE3 (15kW)", manufacturer: "ABB", vendor: "ABB", assetManufacturer: "Alesa", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 4-CY-100 Primary Cyclone Cluster ---
  { id: "CS-021", area: "Grinding", subArea: "Comminution", system: "Primary Cyclone Cluster", parentAsset: "4-CY-100", assetNumber: "CYC01-PUMP-D-MTR", pidTag: "04-CY-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Primary Cyclone Feed Pump Motor", oemPartNumber: "Weg W22 185kW 2P 3Ph", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-022", area: "Grinding", subArea: "Comminution", system: "Primary Cyclone Cluster", parentAsset: "4-CY-100", assetNumber: "CYC01-PUMP-D", pidTag: "04-CY-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Primary Cyclone Feed Pump - Full Replacement", oemPartNumber: "Metso HM200 (MCR200-320) Rubber Lined", manufacturer: "Metso", vendor: "Metso", assetManufacturer: "Metso", assetModel: "HM200 / MCR200-320", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "$30,000.00", uom: "EA", notes: "", status: "Provisional" },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEACHING AREA (05)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // --- 5-AT-100 Leach Tank 1 ---
  { id: "CS-023", area: "Leaching", subArea: "Leaching", system: "Leach Tank 1", parentAsset: "5-AT-100", assetNumber: "LCH01-MTR01", pidTag: "05-AT-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Leach Tank 1 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-024", area: "Leaching", subArea: "Leaching", system: "Leach Tank 1", parentAsset: "5-AT-100", assetNumber: "LCH01-GBX01", pidTag: "05-AT-100", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Leach Tank 1 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-025", area: "Leaching", subArea: "Leaching", system: "Leach Tank 1", parentAsset: "5-AT-100", assetNumber: "LCH01-AGT01", pidTag: "05-AT-100", componentName: "Agitator Shaft", componentType: "Agitator", sparePartDescription: "Agitator shaft replacement", oemPartNumber: "TBC", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Agitator shaft - long lead time", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 5-AT-101 Leach Tank 2 ---
  { id: "CS-026", area: "Leaching", subArea: "Leaching", system: "Leach Tank 2", parentAsset: "5-AT-101", assetNumber: "LCH02-MTR01", pidTag: "05-AT-101", componentName: "Motor", componentType: "Motor", sparePartDescription: "Leach Tank 2 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-027", area: "Leaching", subArea: "Leaching", system: "Leach Tank 2", parentAsset: "5-AT-101", assetNumber: "LCH02-GBX01", pidTag: "05-AT-101", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Leach Tank 2 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-028", area: "Leaching", subArea: "Leaching", system: "Leach Tank 2", parentAsset: "5-AT-101", assetNumber: "LCH02-AGT01", pidTag: "05-AT-101", componentName: "Agitator Shaft", componentType: "Agitator", sparePartDescription: "Agitator shaft replacement", oemPartNumber: "TBC", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Agitator shaft - long lead time", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 5-PP-100 Leach Transfer Pump ---
  { id: "CS-029", area: "Leaching", subArea: "Leaching", system: "Leach Transfer Pump", parentAsset: "5-PP-100", assetNumber: "LCH-PUMP01-MTR", pidTag: "05-PP-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Leach Transfer Pump Motor", oemPartNumber: "Weg W22 75kW 4P", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-030", area: "Leaching", subArea: "Leaching", system: "Leach Transfer Pump", parentAsset: "5-PP-100", assetNumber: "LCH-PUMP01", pidTag: "05-PP-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Leach Transfer Pump - Full Replacement", oemPartNumber: "Warman 6/4 AH", manufacturer: "Weir Minerals", vendor: "Weir", assetManufacturer: "Weir Minerals", assetModel: "6/4 AH", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADSORPTION AREA (05)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // --- 5-AT-200 CIP Tank 1 ---
  { id: "CS-031", area: "Adsorption", subArea: "CIP", system: "CIP Tank 1", parentAsset: "5-AT-200", assetNumber: "CIP01-MTR01", pidTag: "05-AT-200", componentName: "Motor", componentType: "Motor", sparePartDescription: "CIP Tank 1 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-032", area: "Adsorption", subArea: "CIP", system: "CIP Tank 1", parentAsset: "5-AT-200", assetNumber: "CIP01-GBX01", pidTag: "05-AT-200", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "CIP Tank 1 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  
  // --- 5-PP-200 CIP Transfer Pump ---
  { id: "CS-033", area: "Adsorption", subArea: "CIP", system: "CIP Transfer Pump", parentAsset: "5-PP-200", assetNumber: "CIP-PUMP01-MTR", pidTag: "05-PP-200", componentName: "Motor", componentType: "Motor", sparePartDescription: "CIP Transfer Pump Motor", oemPartNumber: "Weg W22 55kW 4P", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-034", area: "Adsorption", subArea: "CIP", system: "CIP Transfer Pump", parentAsset: "5-PP-200", assetNumber: "CIP-PUMP01", pidTag: "05-PP-200", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "CIP Transfer Pump - Full Replacement", oemPartNumber: "Warman 6/4 AH", manufacturer: "Weir Minerals", vendor: "Weir", assetManufacturer: "Weir Minerals", assetModel: "6/4 AH", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // ═══════════════════════════════════════════════════════════════════════════
  // GOLD SYSTEM AREA (08)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // --- 8-HX-100 Elution Heater ---
  { id: "CS-035", area: "Gold System", subArea: "Elution", system: "Elution Heater", parentAsset: "8-HX-100", assetNumber: "ELU-HTR01", pidTag: "08-HX-100", componentName: "Burner Unit", componentType: "Burner", sparePartDescription: "Burner replacement unit", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Burner unit - elution critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 8-EW-100 Electrowinning Rectifier ---
  { id: "CS-036", area: "Gold System", subArea: "Electrowinning", system: "Electrowinning Rectifier", parentAsset: "8-EW-100", assetNumber: "EW01-RCT01", pidTag: "08-EW-100", componentName: "Rectifier Unit", componentType: "Rectifier", sparePartDescription: "Electrowinning Rectifier", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Critical instrumentation - electrowinning", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 8-PP-100 Pregnant Solution Pump ---
  { id: "CS-037", area: "Gold System", subArea: "Elution", system: "Pregnant Solution Pump", parentAsset: "8-PP-100", assetNumber: "ELU-PUMP01-MTR", pidTag: "08-PP-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Pregnant Solution Pump Motor", oemPartNumber: "Weg W22 22kW 4P", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-038", area: "Gold System", subArea: "Elution", system: "Pregnant Solution Pump", parentAsset: "8-PP-100", assetNumber: "ELU-PUMP01", pidTag: "08-PP-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Pregnant Solution Pump - Full Replacement", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // ═══════════════════════════════════════════════════════════════════════════
  // THICKENER AREA (12)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // --- 12-TH-100 Tailings Thickener ---
  { id: "CS-039", area: "Thickener", subArea: "Tailings", system: "Tailings Thickener", parentAsset: "12-TH-100", assetNumber: "THK01-MTR01", pidTag: "12-TH-100", componentName: "Rake Drive Motor", componentType: "Motor", sparePartDescription: "Thickener Rake Drive Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-040", area: "Thickener", subArea: "Tailings", system: "Tailings Thickener", parentAsset: "12-TH-100", assetNumber: "THK01-GBX01", pidTag: "12-TH-100", componentName: "Rake Drive Gearbox", componentType: "Gearbox", sparePartDescription: "Thickener Rake Drive Gearbox", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 12-PP-100 Underflow Pump ---
  { id: "CS-041", area: "Thickener", subArea: "Tailings", system: "Underflow Pump", parentAsset: "12-PP-100", assetNumber: "THK01-PUMP01-MTR", pidTag: "12-PP-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Underflow Pump Motor", oemPartNumber: "Weg W22 90kW 4P", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-042", area: "Thickener", subArea: "Tailings", system: "Underflow Pump", parentAsset: "12-PP-100", assetNumber: "THK01-PUMP01", pidTag: "12-PP-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Underflow Pump - Full Replacement", oemPartNumber: "Warman 8/6 AH", manufacturer: "Weir Minerals", vendor: "Weir", assetManufacturer: "Weir Minerals", assetModel: "8/6 AH", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILTER PRESS AREA (13)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // --- 13-FP-100 Filter Press ---
  { id: "CS-043", area: "Filter Press", subArea: "Dewatering", system: "Filter Press", parentAsset: "13-FP-100", assetNumber: "FP01-HPU-MTR", pidTag: "13-FP-100", componentName: "Hydraulic Power Unit Motor", componentType: "Motor", sparePartDescription: "Filter Press Hydraulic Power Unit Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-044", area: "Filter Press", subArea: "Dewatering", system: "Filter Press", parentAsset: "13-FP-100", assetNumber: "FP01-HPU-PUMP", pidTag: "13-FP-100", componentName: "Hydraulic Pump", componentType: "Pump", sparePartDescription: "Filter Press Hydraulic Pump", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Pump - process critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 13-PP-100 Filter Press Feed Pump ---
  { id: "CS-045", area: "Filter Press", subArea: "Dewatering", system: "Filter Press Feed Pump", parentAsset: "13-PP-100", assetNumber: "FP01-PUMP01-MTR", pidTag: "13-PP-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Filter Press Feed Pump Motor", oemPartNumber: "Weg W22 75kW 4P", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-046", area: "Filter Press", subArea: "Dewatering", system: "Filter Press Feed Pump", parentAsset: "13-PP-100", assetNumber: "FP01-PUMP01", pidTag: "13-PP-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Filter Press Feed Pump - Full Replacement", oemPartNumber: "Warman 6/4 AH", manufacturer: "Weir Minerals", vendor: "Weir", assetManufacturer: "Weir Minerals", assetModel: "6/4 AH", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // ═══════════════════════════════════════════════════════════════════════════
  // REAGENTS AREA (06)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // --- 6-PP-100 Cyanide Dosing Pump ---
  { id: "CS-047", area: "Reagents", subArea: "Cyanide", system: "Cyanide Dosing Pump", parentAsset: "6-PP-100", assetNumber: "REA-CN-PUMP01-MTR", pidTag: "06-PP-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Cyanide Dosing Pump Motor", oemPartNumber: "Weg W22 5.5kW 4P", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-048", area: "Reagents", subArea: "Cyanide", system: "Cyanide Dosing Pump", parentAsset: "6-PP-100", assetNumber: "REA-CN-PUMP01", pidTag: "06-PP-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Cyanide Dosing Pump - Full Replacement", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- 6-AT-100 Cyanide Mix Tank ---
  { id: "CS-049", area: "Reagents", subArea: "Cyanide", system: "Cyanide Mix Tank", parentAsset: "6-AT-100", assetNumber: "REA-CN-TNK01-MTR", pidTag: "06-AT-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Cyanide Mix Tank Agitator Motor", oemPartNumber: "Weg W22 7.5kW 4P", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-050", area: "Reagents", subArea: "Cyanide", system: "Cyanide Mix Tank", parentAsset: "6-AT-100", assetNumber: "REA-CN-TNK01-GBX", pidTag: "06-AT-100", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Cyanide Mix Tank Agitator Gearbox", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
];

// Component types for filtering
export const componentTypes = [
  "Motor",
  "Gearbox",
  "Pump",
  "Valve",
  "Roller",
  "Bearing",
  "Seal",
  "Coupling",
  "Belt",
  "Impeller",
  "Liner",
  "Screen",
  "Sensor",
  "Actuator",
  "Pulley",
  "Consumable",
  "Heater",
  "Filter",
  "Electrical",
  "Mechanical",
  "Wear Items",
  "Pillow Block",
  "Burner",
  "Rectifier",
  "Air Cooler",
  "Agitator",
  "Pinion",
];

// Area codes for filtering
export const areaCodes = [
  "Grinding",
  "Leaching",
  "Adsorption",
  "Reagents",
  "Gold System",
  "Thickener",
  "Filter Press",
  "Water Services",
  "Air Services",
];

// Criticality colors
export const criticalityColors: Record<string, string> = {
  "High": "bg-destructive/20 text-destructive",
  "Medium": "bg-amber-500/20 text-amber-700",
  "Low": "bg-muted text-muted-foreground",
  "": "",
};

// Status colors
export const statusColors: Record<string, string> = {
  "Provisional": "bg-amber-500/20 text-amber-700",
  "Confirmed": "bg-green-500/20 text-green-700",
  "TBC": "bg-muted text-muted-foreground",
};

// Criticality source colors
export const criticalitySourceColors: Record<string, string> = {
  "Confirmed": "bg-green-500/20 text-green-700",
  "Assumed": "bg-amber-500/20 text-amber-700",
  "": "",
};
