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

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL HIGH PRIORITY ITEMS FROM EXCEL DOCUMENT
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Leach Tank 3 (5-AG-002) ---
  { id: "CS-051", area: "Leaching", subArea: "Leaching", system: "Leach Tank 3", parentAsset: "5-AG-002", assetNumber: "LCH03-MTR01", pidTag: "05-AG-002", componentName: "Motor", componentType: "Motor", sparePartDescription: "Leach Tank 3 Agitator Motor", oemPartNumber: "WEG 15kW", manufacturer: "WEG", vendor: "NEWMAN", assetManufacturer: "MIXTEC", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-052", area: "Leaching", subArea: "Leaching", system: "Leach Tank 3", parentAsset: "5-AG-002", assetNumber: "LCH03-GBX01", pidTag: "05-AG-002", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Leach Tank 3 Agitator Gearbox", oemPartNumber: "TBC", manufacturer: "MIXTEC", vendor: "MIXTEC", assetManufacturer: "MIXTEC", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Leach Tank 4 (5-AG-003) ---
  { id: "CS-053", area: "Leaching", subArea: "Leaching", system: "Leach Tank 4", parentAsset: "5-AG-003", assetNumber: "LCH04-MTR01", pidTag: "05-AG-003", componentName: "Motor", componentType: "Motor", sparePartDescription: "Leach Tank 4 Agitator Motor", oemPartNumber: "WEG 15kW", manufacturer: "WEG", vendor: "NEWMAN", assetManufacturer: "MIXTEC", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-054", area: "Leaching", subArea: "Leaching", system: "Leach Tank 4", parentAsset: "5-AG-003", assetNumber: "LCH04-GBX01", pidTag: "05-AG-003", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Leach Tank 4 Agitator Gearbox", oemPartNumber: "TBC", manufacturer: "MIXTEC", vendor: "MIXTEC", assetManufacturer: "MIXTEC", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Intertank Screen 1 (5-SC-001) ---
  { id: "CS-055", area: "Leaching", subArea: "Leaching", system: "Intertank Screen 1", parentAsset: "5-SC-001", assetNumber: "ITS01-MTR01", pidTag: "05-SC-001", componentName: "Motor", componentType: "Motor", sparePartDescription: "Intertank Screen 1 Motor", oemPartNumber: "Bonfiglioli 1.5kW", manufacturer: "Bonfiglioli", vendor: "Bonfiglioli", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-056", area: "Leaching", subArea: "Leaching", system: "Intertank Screen 1", parentAsset: "5-SC-001", assetNumber: "ITS01-GBX01", pidTag: "05-SC-001", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Intertank Screen 1 Gearbox", oemPartNumber: "TBC", manufacturer: "Bonfiglioli", vendor: "Bonfiglioli", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Intertank Screen 2 (5-SC-002) ---
  { id: "CS-057", area: "Leaching", subArea: "Leaching", system: "Intertank Screen 2", parentAsset: "5-SC-002", assetNumber: "ITS02-MTR01", pidTag: "05-SC-002", componentName: "Motor", componentType: "Motor", sparePartDescription: "Intertank Screen 2 Motor", oemPartNumber: "Bonfiglioli 1.5kW", manufacturer: "Bonfiglioli", vendor: "Bonfiglioli", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-058", area: "Leaching", subArea: "Leaching", system: "Intertank Screen 2", parentAsset: "5-SC-002", assetNumber: "ITS02-GBX01", pidTag: "05-SC-002", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Intertank Screen 2 Gearbox", oemPartNumber: "TBC", manufacturer: "Bonfiglioli", vendor: "Bonfiglioli", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- CIP Tank 2 (5-AT-201) ---
  { id: "CS-059", area: "Adsorption", subArea: "CIP", system: "CIP Tank 2", parentAsset: "5-AT-201", assetNumber: "CIP02-MTR01", pidTag: "05-AT-201", componentName: "Motor", componentType: "Motor", sparePartDescription: "CIP Tank 2 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-060", area: "Adsorption", subArea: "CIP", system: "CIP Tank 2", parentAsset: "5-AT-201", assetNumber: "CIP02-GBX01", pidTag: "05-AT-201", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "CIP Tank 2 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // --- CIP Tank 3 (5-AT-202) ---
  { id: "CS-061", area: "Adsorption", subArea: "CIP", system: "CIP Tank 3", parentAsset: "5-AT-202", assetNumber: "CIP03-MTR01", pidTag: "05-AT-202", componentName: "Motor", componentType: "Motor", sparePartDescription: "CIP Tank 3 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-062", area: "Adsorption", subArea: "CIP", system: "CIP Tank 3", parentAsset: "5-AT-202", assetNumber: "CIP03-GBX01", pidTag: "05-AT-202", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "CIP Tank 3 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // --- CIP Tank 4 (5-AT-203) ---
  { id: "CS-063", area: "Adsorption", subArea: "CIP", system: "CIP Tank 4", parentAsset: "5-AT-203", assetNumber: "CIP04-MTR01", pidTag: "05-AT-203", componentName: "Motor", componentType: "Motor", sparePartDescription: "CIP Tank 4 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-064", area: "Adsorption", subArea: "CIP", system: "CIP Tank 4", parentAsset: "5-AT-203", assetNumber: "CIP04-GBX01", pidTag: "05-AT-203", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "CIP Tank 4 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // --- CIP Tank 5 (5-AT-204) ---
  { id: "CS-065", area: "Adsorption", subArea: "CIP", system: "CIP Tank 5", parentAsset: "5-AT-204", assetNumber: "CIP05-MTR01", pidTag: "05-AT-204", componentName: "Motor", componentType: "Motor", sparePartDescription: "CIP Tank 5 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-066", area: "Adsorption", subArea: "CIP", system: "CIP Tank 5", parentAsset: "5-AT-204", assetNumber: "CIP05-GBX01", pidTag: "05-AT-204", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "CIP Tank 5 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // --- CIP Tank 6 (5-AT-205) ---
  { id: "CS-067", area: "Adsorption", subArea: "CIP", system: "CIP Tank 6", parentAsset: "5-AT-205", assetNumber: "CIP06-MTR01", pidTag: "05-AT-205", componentName: "Motor", componentType: "Motor", sparePartDescription: "CIP Tank 6 Agitator Motor", oemPartNumber: "Siemens 1LA7163-2AA70 (15kW)", manufacturer: "Siemens", vendor: "NEWMAN", assetManufacturer: "Eriez Flotation", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-068", area: "Adsorption", subArea: "CIP", system: "CIP Tank 6", parentAsset: "5-AT-205", assetNumber: "CIP06-GBX01", pidTag: "05-AT-205", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "CIP Tank 6 Agitator Gearbox", oemPartNumber: "CAVEX Gearbox (refer Eriez FD)", manufacturer: "Eriez Flotation", vendor: "Eriez", assetManufacturer: "Eriez Flotation", assetModel: "CAVEX", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // --- Elution Column (8-EC-001) ---
  { id: "CS-069", area: "Gold System", subArea: "Elution", system: "Elution Column", parentAsset: "8-EC-001", assetNumber: "ELU-COL01-PUMP-MTR", pidTag: "08-EC-001", componentName: "Pump Motor", componentType: "Motor", sparePartDescription: "Elution Column Pump Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  
  // --- Acid Wash Column (8-EC-002) ---
  { id: "CS-070", area: "Gold System", subArea: "Elution", system: "Acid Wash Column", parentAsset: "8-EC-002", assetNumber: "AW-COL01-PUMP-MTR", pidTag: "08-EC-002", componentName: "Pump Motor", componentType: "Motor", sparePartDescription: "Acid Wash Column Pump Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Kiln (8-KN-001) ---
  { id: "CS-071", area: "Gold System", subArea: "Gold Room", system: "Kiln", parentAsset: "8-KN-001", assetNumber: "KLN01-MTR01", pidTag: "08-KN-001", componentName: "Motor", componentType: "Motor", sparePartDescription: "Kiln Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-072", area: "Gold System", subArea: "Gold Room", system: "Kiln", parentAsset: "8-KN-001", assetNumber: "KLN01-BNR01", pidTag: "08-KN-001", componentName: "Burner Unit", componentType: "Burner", sparePartDescription: "Kiln Burner Unit", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Burner unit - gold room critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Filter Press 2 (13-FP-101) ---
  { id: "CS-073", area: "Filter Press", subArea: "Dewatering", system: "Filter Press 2", parentAsset: "13-FP-101", assetNumber: "FP02-HPU-MTR", pidTag: "13-FP-101", componentName: "Hydraulic Power Unit Motor", componentType: "Motor", sparePartDescription: "Filter Press 2 Hydraulic Power Unit Motor", oemPartNumber: "MATEC", manufacturer: "MATEC", vendor: "MATEC", assetManufacturer: "MATEC", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-074", area: "Filter Press", subArea: "Dewatering", system: "Filter Press 2", parentAsset: "13-FP-101", assetNumber: "FP02-HPU-PUMP", pidTag: "13-FP-101", componentName: "Hydraulic Pump", componentType: "Pump", sparePartDescription: "Filter Press 2 Hydraulic Pump", oemPartNumber: "MATEC", manufacturer: "MATEC", vendor: "MATEC", assetManufacturer: "MATEC", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Pump - process critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },
  { id: "CS-075", area: "Filter Press", subArea: "Dewatering", system: "Filter Press 2", parentAsset: "13-FP-101", assetNumber: "FP02-PLC01", pidTag: "13-FP-101", componentName: "PLC", componentType: "Electrical", sparePartDescription: "Filter Press 2 PLC", oemPartNumber: "MATEC", manufacturer: "MATEC", vendor: "MATEC", assetManufacturer: "MATEC", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "PLC - critical instrumentation", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "Provisional" },

  // --- Flocculant Dosing System (12-DS-100) ---
  { id: "CS-076", area: "Thickener", subArea: "Reagents", system: "Flocculant Dosing", parentAsset: "12-DS-100", assetNumber: "FLOC-PUMP01-MTR", pidTag: "12-DS-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Flocculant Dosing Pump Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-077", area: "Thickener", subArea: "Reagents", system: "Flocculant Dosing", parentAsset: "12-DS-100", assetNumber: "FLOC-PUMP01", pidTag: "12-DS-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Flocculant Dosing Pump", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Caustic Dosing System (6-DS-100) ---
  { id: "CS-078", area: "Reagents", subArea: "Caustic", system: "Caustic Dosing", parentAsset: "6-DS-100", assetNumber: "REA-CA-PUMP01-MTR", pidTag: "06-DS-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Caustic Dosing Pump Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-079", area: "Reagents", subArea: "Caustic", system: "Caustic Dosing", parentAsset: "6-DS-100", assetNumber: "REA-CA-PUMP01", pidTag: "06-DS-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Caustic Dosing Pump", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Oxygen Dosing System (6-DS-101) ---
  { id: "CS-080", area: "Reagents", subArea: "Oxygen", system: "Oxygen Dosing", parentAsset: "6-DS-101", assetNumber: "REA-O2-PUMP01-MTR", pidTag: "06-DS-101", componentName: "Motor", componentType: "Motor", sparePartDescription: "Oxygen Dosing Pump Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Carbon Transfer Pump (5-PP-201) ---
  { id: "CS-081", area: "Adsorption", subArea: "CIP", system: "Carbon Transfer Pump", parentAsset: "5-PP-201", assetNumber: "CIP-CT-PUMP01-MTR", pidTag: "05-PP-201", componentName: "Motor", componentType: "Motor", sparePartDescription: "Carbon Transfer Pump Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-082", area: "Adsorption", subArea: "CIP", system: "Carbon Transfer Pump", parentAsset: "5-PP-201", assetNumber: "CIP-CT-PUMP01", pidTag: "05-PP-201", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Carbon Transfer Pump", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Loaded Carbon Screen (5-SC-100) ---
  { id: "CS-083", area: "Adsorption", subArea: "CIP", system: "Loaded Carbon Screen", parentAsset: "5-SC-100", assetNumber: "CIP-LCS01-MTR01", pidTag: "05-SC-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Loaded Carbon Screen Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-084", area: "Adsorption", subArea: "CIP", system: "Loaded Carbon Screen", parentAsset: "5-SC-100", assetNumber: "CIP-LCS01-GBX01", pidTag: "05-SC-100", componentName: "Gearbox", componentType: "Gearbox", sparePartDescription: "Loaded Carbon Screen Gearbox", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Gearbox - long lead time, plant impact", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Regeneration Kiln (8-KN-002) ---
  { id: "CS-085", area: "Gold System", subArea: "Carbon Regeneration", system: "Regeneration Kiln", parentAsset: "8-KN-002", assetNumber: "RGN-KLN01-MTR01", pidTag: "08-KN-002", componentName: "Motor", componentType: "Motor", sparePartDescription: "Regeneration Kiln Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-086", area: "Gold System", subArea: "Carbon Regeneration", system: "Regeneration Kiln", parentAsset: "8-KN-002", assetNumber: "RGN-KLN01-BNR01", pidTag: "08-KN-002", componentName: "Burner Unit", componentType: "Burner", sparePartDescription: "Regeneration Kiln Burner Unit", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Burner unit - regeneration critical", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Quench Tank (8-TK-001) ---
  { id: "CS-087", area: "Gold System", subArea: "Carbon Regeneration", system: "Quench Tank", parentAsset: "8-TK-001", assetNumber: "RGN-QT01-MTR01", pidTag: "08-TK-001", componentName: "Motor", componentType: "Motor", sparePartDescription: "Quench Tank Agitator Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Fine Carbon Screen (8-SC-001) ---
  { id: "CS-088", area: "Gold System", subArea: "Carbon Regeneration", system: "Fine Carbon Screen", parentAsset: "8-SC-001", assetNumber: "RGN-FCS01-MTR01", pidTag: "08-SC-001", componentName: "Motor", componentType: "Motor", sparePartDescription: "Fine Carbon Screen Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Process Water Pump (15-PP-100) ---
  { id: "CS-089", area: "Water Services", subArea: "Process Water", system: "Process Water Pump", parentAsset: "15-PP-100", assetNumber: "PW-PUMP01-MTR", pidTag: "15-PP-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Process Water Pump Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-090", area: "Water Services", subArea: "Process Water", system: "Process Water Pump", parentAsset: "15-PP-100", assetNumber: "PW-PUMP01", pidTag: "15-PP-100", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Process Water Pump", oemPartNumber: "TBC", manufacturer: "", vendor: "", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Plant Air Compressor (16-AC-100) ---
  { id: "CS-091", area: "Air Services", subArea: "Compressed Air", system: "Plant Air Compressor", parentAsset: "16-AC-100", assetNumber: "AIR-COMP01-MTR", pidTag: "16-AC-100", componentName: "Motor", componentType: "Motor", sparePartDescription: "Plant Air Compressor Motor", oemPartNumber: "TBC", manufacturer: "", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },

  // --- Secondary Cyclone Feed Pump (4-PP-101) ---
  { id: "CS-092", area: "Grinding", subArea: "Comminution", system: "Secondary Cyclone Feed Pump", parentAsset: "4-PP-101", assetNumber: "CYC02-PUMP-D-MTR", pidTag: "04-PP-101", componentName: "Motor", componentType: "Motor", sparePartDescription: "Secondary Cyclone Feed Pump Motor", oemPartNumber: "TBC", manufacturer: "Weg", vendor: "NEWMAN", assetManufacturer: "", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Motor - plant stoppage risk", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
  { id: "CS-093", area: "Grinding", subArea: "Comminution", system: "Secondary Cyclone Feed Pump", parentAsset: "4-PP-101", assetNumber: "CYC02-PUMP-D", pidTag: "04-PP-101", componentName: "Pump Full", componentType: "Pump", sparePartDescription: "Secondary Cyclone Feed Pump - Full Replacement", oemPartNumber: "TBC", manufacturer: "Metso", vendor: "Metso", assetManufacturer: "Metso", assetModel: "", spareCriticality: "High", criticalitySource: "Confirmed", reasonCritical: "Process pump - critical to operations", minQty: "0", maxQty: "1", qtyPerSystem: "1", unitPrice: "", uom: "EA", notes: "", status: "TBC" },
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
