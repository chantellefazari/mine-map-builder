// Legacy P&ID Tag to Asset Number Mappings
// These tags are stored as searchable metadata only - they do not appear in asset names/numbers

export interface PidTagMapping {
  pidTag: string;
  assetNumber: string;
  description: string;
  status: "mapped" | "unmapped";
}

// Comprehensive P&ID tag mappings organized by area
export const pidTagMappings: PidTagMapping[] = [
  // ============ GRINDING / COMMINUTION ============
  // Reclaim / Feed System
  { pidTag: "FE-100", assetNumber: "APRN01", description: "Reclaim Feeder", status: "mapped" },
  { pidTag: "04-PB-099", assetNumber: "RHOP01", description: "Reclaim Hopper", status: "mapped" },
  { pidTag: "04-FE-100LCS", assetNumber: "APRN01-LCS01", description: "Reclaim Feeder LCS", status: "mapped" },
  { pidTag: "04-FE-100M", assetNumber: "APRN01-MTR01", description: "Reclaim Feeder Motor", status: "mapped" },
  { pidTag: "04-FE-100MC", assetNumber: "APRN01-MCC01", description: "Reclaim Feeder MCC Cell", status: "mapped" },
  { pidTag: "04-FE-100GB", assetNumber: "APRN01-GBX01", description: "Reclaim Feeder Gearbox", status: "mapped" },
  { pidTag: "04-FE-100-PWS", assetNumber: "APRN01-PWS01", description: "Reclaim Feeder Pullwire switch", status: "mapped" },
  { pidTag: "04-SIT-500", assetNumber: "APRN01-TX01", description: "Reclaim Feeder Speed Transmitter", status: "mapped" },
  
  // Transfer Conveyor
  { pidTag: "04-FE-101", assetNumber: "CV01", description: "Transfer Conveyor", status: "mapped" },
  { pidTag: "04-CH-100", assetNumber: "CV01-CHU01", description: "Transfer Conveyor Discharge Chute", status: "mapped" },
  { pidTag: "04-FE-101LCS", assetNumber: "CV01-LCS01", description: "Transfer Conveyor Local Control Station", status: "mapped" },
  { pidTag: "04-FE-101M", assetNumber: "CV01-MTR01", description: "Transfer Conveyor Motor", status: "mapped" },
  { pidTag: "04-FE-101MC", assetNumber: "CV01-MCC01", description: "Transfer Conveyor MCC Cell", status: "mapped" },
  { pidTag: "04-FE-101GB", assetNumber: "CV01-GBX01", description: "Transfer Conveyor Gearbox", status: "mapped" },
  { pidTag: "04-FE-101PWS", assetNumber: "CV01-PWS01", description: "Transfer Conveyor Pull Wire Switch", status: "mapped" },
  
  // Mill Feed Conveyor
  { pidTag: "04-BC-100", assetNumber: "MFC01", description: "Mill Feed Conveyor", status: "mapped" },
  { pidTag: "04-BC-100LCS", assetNumber: "MFC01-LCS01", description: "Mill Feed Conveyor Local Control station", status: "mapped" },
  { pidTag: "04-BC-100M", assetNumber: "MFC01-MTR01", description: "Mill Feed Conveyor Motor", status: "mapped" },
  { pidTag: "04-BC-100MC", assetNumber: "MFC01-MCC01", description: "Mill Feed Conveyor MCC Cell", status: "mapped" },
  { pidTag: "04-BC-100GB", assetNumber: "MFC01-GBX01", description: "Mill Feed Conveyor Gearbox", status: "mapped" },
  { pidTag: "04-SS-506", assetNumber: "MFC01-USS01", description: "Feed Conveyor Underspeed Switch", status: "mapped" },
  { pidTag: "04-WE-506", assetNumber: "MFC01-WTM01", description: "Ball Mill Feed Conveyor Weightometer Loadcells", status: "mapped" },
  { pidTag: "04-WQIT-506", assetNumber: "MFC01-WTM02", description: "Ball Mill Feed Conveyor Weightometer Transmitter", status: "mapped" },
  { pidTag: "04-XS-507A", assetNumber: "MFC01-PWS01", description: "Feed Conveyor Pull Wire Switch 1", status: "mapped" },
  { pidTag: "04-XS-507B", assetNumber: "MFC01-PWS02", description: "Feed Conveyor Pull Wire Switch 2", status: "mapped" },
  { pidTag: "04-XS-507C", assetNumber: "MFC01-PWS03", description: "Feed Conveyor Pull Wire Switch 3", status: "mapped" },
  { pidTag: "04-XS-507D", assetNumber: "MFC01-PWS04", description: "Feed Conveyor Pull Wire Switch 4", status: "mapped" },
  { pidTag: "04-ZS-508A", assetNumber: "MFC01-BAS01", description: "Feed Conveyor Belt Alignment Switch 1", status: "mapped" },
  { pidTag: "04-ZS-508B", assetNumber: "MFC01-BAS02", description: "Feed Conveyor Belt Alignment Switch 2", status: "mapped" },
  { pidTag: "04-ZS-508C", assetNumber: "MFC01-BAS03", description: "Feed Conveyor Belt Alignment Switch 3", status: "mapped" },
  { pidTag: "04-ZS-508D", assetNumber: "MFC01-BAS04", description: "Feed Conveyor Belt Alignment Switch 4", status: "mapped" },
  { pidTag: "04-LSH-510", assetNumber: "FHOP01-HLS01", description: "Ball Mill Feed Chute High Level Switch", status: "mapped" },
  { pidTag: "04-CH-101", assetNumber: "MFC01-CHU01", description: "Mill Feed Conveyor Discharge Chute", status: "mapped" },
  { pidTag: "04-CH-102", assetNumber: "FHOP01-CHU01", description: "Mill Feed Chute", status: "mapped" },
  { pidTag: "04-CH-010", assetNumber: "FHOP01-CHU02", description: "Ball Loading Chute", status: "mapped" },
  
  // Lime System
  { pidTag: "04-TK-100", assetNumber: "LSILO01", description: "Lime Storage Silo", status: "mapped" },
  { pidTag: "04-FE-102", assetNumber: "APRN01-VLV01", description: "Lime Feeder Rotary Valve", status: "mapped" },
  { pidTag: "-BA-103", assetNumber: "LSILO01-VIB01", description: "Lime Silo Vibrator", status: "mapped" },
  
  // Primary Ball Mill
  { pidTag: "04-ML-100", assetNumber: "BM01", description: "Primary Ball Mill", status: "mapped" },
  { pidTag: "04-ML-100M", assetNumber: "BM01-MTR01", description: "Primary Ball Mill Motor", status: "mapped" },
  { pidTag: "04-ML-100GB", assetNumber: "BM01-GBX01", description: "Primary Ball Mill Gearbox", status: "mapped" },
  { pidTag: "04-ML-100P", assetNumber: "BM01-PIN01", description: "Primary Ball Mill Pinion", status: "mapped" },
  { pidTag: "04-ML-100MC", assetNumber: "BM01-MCC01", description: "Primary Ball Mill MCC Cell", status: "mapped" },
  { pidTag: "04-ML-100VSD", assetNumber: "BM01-VSD01", description: "Primary Ball Mill VSD", status: "mapped" },
  { pidTag: "04-ML-100I", assetNumber: "BM01-LUB03", description: "Primary Ball mill Instruments", status: "mapped" },
  { pidTag: "04-TIT-536", assetNumber: "MFC01-TX01", description: "Feed End Trunnion Bearing Temperature Transmitter", status: "mapped" },
  { pidTag: "04-TE-536X", assetNumber: "MFC01-SEN01", description: "Feed End Trunnion Bearing Temperature Sensor 1", status: "mapped" },
  { pidTag: "04-TE-536Y", assetNumber: "MFC01-SEN02", description: "Feed End Trunnion Bearing Temperature Sensor 2", status: "mapped" },
  { pidTag: "04-TE-536Z", assetNumber: "MFC01-SEN03", description: "Feed End Trunnion Bearing Temperature Sensor 3", status: "mapped" },
  { pidTag: "04-TIT-537", assetNumber: "MFC01-TX02", description: "Dis End Trunnion Bearing Temperature Transmitter", status: "mapped" },
  { pidTag: "04-TE-537X", assetNumber: "MFC01-SEN04", description: "Dis End Trunnion Bearing Temperature Sensor 1", status: "mapped" },
  { pidTag: "04-TE-537Y", assetNumber: "MFC01-SEN05", description: "Dis End Trunnion Bearing Temperature Sensor 2", status: "mapped" },
  { pidTag: "04-TE-537Z", assetNumber: "MFC01-SEN06", description: "Dis End Trunnion Bearing Temperature Sensor 3", status: "mapped" },
  { pidTag: "04-TE-538", assetNumber: "BM01-RED01-INS01", description: "Mill Gear Reducer Temperature", status: "mapped" },
  { pidTag: "04-FCV-545", assetNumber: "BM01-VLV01", description: "Mill Discharge End Water Addition Control Valve", status: "mapped" },
  { pidTag: "04-FIT-545", assetNumber: "BM01-TX01", description: "Mill Discharge End Water Addition Flow Transmitter", status: "mapped" },
  { pidTag: "-LE-550", assetNumber: "BM01-TX02", description: "Mill Discharge Hopper Level Transmitter", status: "mapped" },
  { pidTag: "04-PB-105", assetNumber: "FHOP01-BOX01", description: "Primary Mill Feed Boiler Box", status: "mapped" },
  { pidTag: "04-GR-100", assetNumber: "BM01-RED01", description: "Primary Ball Mill Gear Reducer", status: "mapped" },
  { pidTag: "04-MR-100", assetNumber: "BM01-MNR01", description: "Ball Mill Loading Monorail", status: "mapped" },
  { pidTag: "04-CV-011", assetNumber: "CV02", description: "Ball Mill Scatts Conveyor", status: "mapped" },
  { pidTag: "04-SS-01", assetNumber: "MILL-SHW01", description: "Mill Area Safety Shower 1", status: "mapped" },
  { pidTag: "04-SS-02", assetNumber: "MILL-SHW02", description: "Mill Area Safety Shower 2", status: "mapped" },
  
  // Ball Mill Lube System
  { pidTag: "04-PU-016", assetNumber: "BM01-PMP01", description: "Primary Ball Mill Lube Recirculating Pump", status: "mapped" },
  { pidTag: "04-PU-016M", assetNumber: "BM01-MTR02", description: "Primary Ball Mill Lube Recirculating Pump Motor", status: "mapped" },
  { pidTag: "04-PU-016MC", assetNumber: "BM01-MCC02", description: "Primary Ball Mill Lube Recirculating Pump MCC Cell", status: "mapped" },
  { pidTag: "04-PU-016LCS", assetNumber: "BM01-LCS01", description: "Primary Ball Mill Lube Recirculating Pump LCS", status: "mapped" },
  { pidTag: "04-LS-100", assetNumber: "BM01-LUB01", description: "Primary Ball Mill Lube System", status: "mapped" },
  { pidTag: "04-FA-006", assetNumber: "BM01-LUB02", description: "Primary Ball Mill Lube Air Blast Oil Cooler", status: "mapped" },
  { pidTag: "04-FA-006M", assetNumber: "BM01-MTR03", description: "Primary Ball Mill Lube Air Blast Oil Cooler Motor", status: "mapped" },
  { pidTag: "04-FA-006MC", assetNumber: "BM01-MCC03", description: "Primary Ball Mill Lube Air Blast Oil Cooler MCC Cell", status: "mapped" },
  { pidTag: "04-FA-06LCS", assetNumber: "BM01-LCS02", description: "Primary Ball Mill Lube Air Blast Oil Cooler LCS", status: "mapped" },
  { pidTag: "04-PU-100A", assetNumber: "BM01-PMP02", description: "Primary Ball Mill Low Pressure Lube Pump A", status: "mapped" },
  { pidTag: "04-PU-100AM", assetNumber: "BM01-MTR04", description: "Primary Ball Mill Low Pressure Lube Pump A Motor", status: "mapped" },
  { pidTag: "04-PU-100AMC", assetNumber: "BM01-MCC04", description: "Primary Ball Mill Low Pressure Lube Pump A MCC Cell", status: "mapped" },
  { pidTag: "04-PU-100ALCS", assetNumber: "BM01-LCS03", description: "Primary Ball Mill Low Pressure Lube Pump A LCS", status: "mapped" },
  { pidTag: "04-PU-100B", assetNumber: "BM01-PMP03", description: "Primary Ball Mill Low Pressure Lube Pump B", status: "mapped" },
  { pidTag: "04-PU-100BM", assetNumber: "BM01-MTR05", description: "Primary Ball Mill Low Pressure Lube Pump B Motor", status: "mapped" },
  { pidTag: "04-PU-100BMC", assetNumber: "BM01-MCC05", description: "Primary Ball Mill Low Pressure Lube Pump B MCC Cell", status: "mapped" },
  { pidTag: "04-PU-100BLCS", assetNumber: "BM01-LCS04", description: "Primary Ball Mill Low Pressure Lube Pump B LCS", status: "mapped" },
  
  // Grinding Sump
  { pidTag: "04-PU-120", assetNumber: "GSPMP01-PMP01", description: "Grinding Area Sump Pump", status: "mapped" },
  { pidTag: "04-PU-120M", assetNumber: "GSPMP01-MTR01", description: "Grinding Area Sump Pump Motor", status: "mapped" },
  { pidTag: "04-PU-120MC", assetNumber: "GSPMP01-MCC01", description: "Grinding Area Sump Pump MCC Cell", status: "mapped" },
  { pidTag: "04-PU-120LCS", assetNumber: "GSPMP01-LCS01", description: "Grinding Area Sump Pump LCS", status: "mapped" },
  
  // High Pressure Lube
  { pidTag: "04-PU-101", assetNumber: "BM01-PMP04", description: "Primary Ball Mill High Pressure Lube Pump", status: "mapped" },
  { pidTag: "04-PU-101M", assetNumber: "BM01-MTR06", description: "Primary Ball Mill High Pressure Lube Pump Motor", status: "mapped" },
  { pidTag: "04-PU-101MC", assetNumber: "BM01-MCC06", description: "Primary Ball Mill High Pressure Lube Pump MCC Cell", status: "mapped" },
  { pidTag: "04-LS-100I", assetNumber: "BM01-LUB03", description: "Primary Mill Lube System Instruments", status: "mapped" },
  { pidTag: "04-PIT-520", assetNumber: "BM01-TX03", description: "Mill Low Pressure Lube Oil Pressure Transmitter", status: "mapped" },
  { pidTag: "04-FIT-521", assetNumber: "BM01-TX04", description: "Mill Low Pressure Lube Oil Flow Transmitter", status: "mapped" },
  { pidTag: "04-PIT-525", assetNumber: "BM01-TX05", description: "Mill High Pressure Lift Lube Oil Pressure Transmitter", status: "mapped" },
  { pidTag: "04-FE-526", assetNumber: "BM01-LUB04", description: "Mill High Pressure Lift Lube Oil Flow", status: "mapped" },
  { pidTag: "04-FIT-526", assetNumber: "BM01-TX06", description: "Mill High Pressure Lift Lube Oil Flow Transmitter", status: "mapped" },
  { pidTag: "04-LIT-528", assetNumber: "BM01-LUB05", description: "Mill Lube System Oil Level", status: "mapped" },
  { pidTag: "04-TIT-529", assetNumber: "BM01-LUB06", description: "Mill Lube System Oil Temperature", status: "mapped" },
  { pidTag: "04-PU-101LCS", assetNumber: "BM01-LCS05", description: "Primary Ball Mill High Pressure Lube Pump LCS", status: "mapped" },
  { pidTag: "04-LS-101", assetNumber: "BM01-LUB07", description: "Primary Ball Mill Girth Gear Lube System", status: "mapped" },
  { pidTag: "04-LS-101P", assetNumber: "BM01-PMP05", description: "Primary Ball Mill Girth Gear Lube System Pump", status: "mapped" },
  { pidTag: "04-LS-101CP", assetNumber: "BM01-LUB08", description: "Primary Ball Mill Girth Gear Lube System Control Panel", status: "mapped" },
  { pidTag: "04-FL-100A", assetNumber: "BM01-LUB09", description: "Primary Ball Mill Lube System Filter A", status: "mapped" },
  { pidTag: "04-FL-100B", assetNumber: "BM01-LUB10", description: "Primary Ball Mill Lube System Filter B", status: "mapped" },
  { pidTag: "04-PB-100", assetNumber: "BM01-HOP01", description: "Primary Mill Discharge Hopper", status: "mapped" },
  
  // Primary Cyclone Feed Pumps
  { pidTag: "04-PU-102A", assetNumber: "PCFPA01", description: "Primary Cyclone Feed Pump A", status: "mapped" },
  { pidTag: "04-PU-102AM", assetNumber: "PCFPA01-MTR01", description: "Primary Cyclone Feed Pump A Motor", status: "mapped" },
  { pidTag: "04-PU-102AMC", assetNumber: "PCFPA01-MCC01", description: "Primary Cyclone Feed Pump A MCC Cell", status: "mapped" },
  { pidTag: "04-PU-102ALCS", assetNumber: "PCFPA01-LCS01", description: "Primary Cyclone Feed Pump A LCS", status: "mapped" },
  { pidTag: "04-PU-102B", assetNumber: "PCFPB01", description: "Primary Cyclone Feed Pump B", status: "mapped" },
  { pidTag: "04-PU-102BM", assetNumber: "PCFPB01-MTR01", description: "Primary Cyclone Feed Pump B Motor", status: "mapped" },
  { pidTag: "04-PU-102BMC", assetNumber: "PCFPB01-MCC01", description: "Primary Cyclone Feed Pump B MCC Cell", status: "mapped" },
  { pidTag: "04-PU-102BLCS", assetNumber: "PCFPB01-LCS01", description: "Primary Cyclone Feed Pump B LCS", status: "mapped" },
  { pidTag: "04-XV-", assetNumber: "PCFI01-VLV01", description: "Primary Cyclone Feed TechTaylor Valve", status: "mapped" },
  
  // Primary Cyclone Cluster
  { pidTag: "04-CY-100", assetNumber: "CYC01", description: "Primary Cyclone Cluster", status: "mapped" },
  { pidTag: "04-CY-100I", assetNumber: "CYC01-INS01", description: "Primary Cyclone Cluster Instruments", status: "mapped" },
  { pidTag: "04-FIT-551", assetNumber: "PCFI01-TX01", description: "Primary Cyclone Feed Flow Transmitter", status: "mapped" },
  { pidTag: "04-PIT-552", assetNumber: "CYC01-TX01", description: "Primary Cyclone Pressure Transmitter", status: "mapped" },
  { pidTag: "04-PI-552A", assetNumber: "CYC01-PG01", description: "Primary Cyclone Pressure Gauge", status: "mapped" },
  { pidTag: "04-PB-101", assetNumber: "CYC01-SPL01", description: "Primary Cyclone Underflow Splitter Box", status: "mapped" },
  
  // ============ CIP AREA ============
  { pidTag: "05-CIP-01", assetNumber: "CIP-TK01", description: "CIP Area", status: "mapped" },
  { pidTag: "05-CH-001", assetNumber: "CPTS01-FBX01", description: "CIP Trash Screen Feed Box", status: "mapped" },
  { pidTag: "05-SC-001", assetNumber: "CPTS01", description: "CIP Feed Trash Screen", status: "mapped" },
  { pidTag: "05-SC-001EXA", assetNumber: "CPTS01-EXC01", description: "CIP Feed Trash Screen Exciter A", status: "mapped" },
  { pidTag: "05-SC-001EXALCS", assetNumber: "CPTS01-LCS01", description: "CIP Feed Trash Screen Exciter A LCS", status: "mapped" },
  { pidTag: "05-SC-001EXAMC", assetNumber: "CPTS01-MCC01", description: "CIP Feed Trash Screen Exciter A MCC Cell", status: "mapped" },
  { pidTag: "05-SC-001EXB", assetNumber: "CPTS01-EXC02", description: "CIP Feed Trash Screen Exciter B", status: "mapped" },
  { pidTag: "05-SC-001EXBLCS", assetNumber: "CPTS01-LCS02", description: "CIP Feed Trash Screen Exciter B LCS", status: "mapped" },
  { pidTag: "05-SC-001EXBMC", assetNumber: "CPTS01-MCC02", description: "CIP Feed Trash Screen Exciter B MCC Cell", status: "mapped" },
  { pidTag: "05-SC-001SB", assetNumber: "CPTS01-SPR01", description: "CIP Feed Trash Screen Spray Bars", status: "mapped" },
  { pidTag: "05-CH-002", assetNumber: "CPTS01-CHU01", description: "CIP Trash Screen Oversize Chute", status: "mapped" },
  
  // CIP Sump
  { pidTag: "05-PU-005", assetNumber: "CIP-PMP01", description: "CIP Leach Area Sump Pump", status: "mapped" },
  { pidTag: "05-PU-005M", assetNumber: "CIP-PMP01", description: "CIP Leach Area Sump Pump Motor", status: "mapped" },
  { pidTag: "05-PU-005MC", assetNumber: "CIP-PMP01", description: "CIP Leach Area Sump Pump MCC Cell", status: "mapped" },
  { pidTag: "05-PU-005LCS", assetNumber: "CIP-PMP01", description: "CIP Leach Area Sump Pump LCS", status: "mapped" },
  
  // CIP Safety Showers
  { pidTag: "05-SS", assetNumber: "CIP-SHW01", description: "CIP Area Safety Showers", status: "mapped" },
  { pidTag: "05-SS-001", assetNumber: "CIP-SHW01", description: "CIP Area Safety Shower 1", status: "mapped" },
  { pidTag: "05-SS-002", assetNumber: "CIP-SHW02", description: "CIP Area Safety Shower 2", status: "mapped" },
  { pidTag: "05-SS-003", assetNumber: "CIP-SHW04", description: "CIP Tails Area Safety Shower", status: "mapped" },
  
  // CIP Tank 1
  { pidTag: "05-TK-001", assetNumber: "CIP-TK01", description: "CIP Leach Tank 1", status: "mapped" },
  { pidTag: "05-AG-001", assetNumber: "CIP-TK01-AGT01", description: "CIP Leach Tank 1 Agitator", status: "mapped" },
  { pidTag: "05-AG-001M", assetNumber: "CIP-TK01-MTR01", description: "CIP Leach Tank 1 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-001MC", assetNumber: "CIP-TK01-MCC01", description: "CIP Leach Tank 1 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-001GB", assetNumber: "CIP-TK01-GBX01", description: "CIP Leach Tank 1 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-001LCS", assetNumber: "CIP-TK01-LCS01", description: "CIP Leach Tank 1 Agitator LCS", status: "mapped" },
  { pidTag: "05-AIT-933", assetNumber: "CIP-TK01", description: "CIP Leach Tank 1 PH Probe", status: "mapped" },
  { pidTag: "05-XM-001", assetNumber: "CIP-NZL01", description: "Leach Tank 1 Air Sparge Nozzles", status: "mapped" },
  
  // CIP Tank 2
  { pidTag: "05-TK-002", assetNumber: "CIP-TK02", description: "CIP Leach Tank 2", status: "mapped" },
  { pidTag: "05-AG-002", assetNumber: "CIP-TK02-AGT01", description: "CIP Leach Tank 2 Agitator", status: "mapped" },
  { pidTag: "05-AG-002M", assetNumber: "CIP-TK02-MTR01", description: "CIP Leach Tank 2 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-002MC", assetNumber: "CIP-TK02-MCC01", description: "CIP Leach Tank 2 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-00GB", assetNumber: "CIP-TK02-GBX01", description: "CIP Leach Tank 2 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-002LCS", assetNumber: "CIP-TK02-LCS01", description: "CIP Leach Tank 2 Agitator LCS", status: "mapped" },
  { pidTag: "05-XM-002", assetNumber: "CIP-NZL02", description: "Leach Tank 2 Air Sparge Nozzles", status: "mapped" },
  
  // CIP Tank 3-8
  { pidTag: "05-TK-003", assetNumber: "CIP-TK03", description: "CIP Tank 3", status: "mapped" },
  { pidTag: "05-AG-003", assetNumber: "CIP-TK03-AGT01", description: "CIP Tank 3 Agitator", status: "mapped" },
  { pidTag: "05-AG-003M", assetNumber: "CIP-TK03-MTR01", description: "CIP Tank 3 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-003MC", assetNumber: "CIP-TK03-MCC01", description: "CIP Tank 3 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-003GB", assetNumber: "CIP-TK03-GBX01", description: "CIP Tank 3 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-003LCS", assetNumber: "CIP-TK03-LCS01", description: "CIP Tank 3 Agitator LCS", status: "mapped" },
  { pidTag: "05-AL-002", assetNumber: "CIP-ALF02", description: "Carbon Transfer Air Lift 2", status: "mapped" },
  
  { pidTag: "05-TK-004", assetNumber: "CIP-TK04", description: "CIP Tank 4", status: "mapped" },
  { pidTag: "05-AG-004", assetNumber: "CIP-TK04-AGT01", description: "CIP Tank 4 Agitator", status: "mapped" },
  { pidTag: "05-AG-004M", assetNumber: "CIP-TK04-MTR01", description: "CIP Tank 4 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-004MC", assetNumber: "CIP-TK04-MCC01", description: "CIP Tank 4 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-004GB", assetNumber: "CIP-TK04-GBX01", description: "CIP Tank 4 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-004LCS", assetNumber: "CIP-TK04-LCS01", description: "CIP Tank 4 Agitator LCS", status: "mapped" },
  { pidTag: "05-AL-003", assetNumber: "CIP-ALF03", description: "Carbon Transfer Air Lift 3", status: "mapped" },
  
  { pidTag: "05-TK-005", assetNumber: "CIP-TK05", description: "CIP Tank 5", status: "mapped" },
  { pidTag: "05-AG-005", assetNumber: "CIP-TK05-AGT01", description: "CIP Tank 5 Agitator", status: "mapped" },
  { pidTag: "05-AG-005M", assetNumber: "CIP-TK05-MTR01", description: "CIP Tank 5 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-005MC", assetNumber: "CIP-TK05-MCC01", description: "CIP Tank 5 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-005GB", assetNumber: "CIP-TK05-GBX01", description: "CIP Tank 5 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-005LCS", assetNumber: "CIP-TK05-LCS01", description: "CIP Tank 5 Agitator LCS", status: "mapped" },
  { pidTag: "05-AL-004", assetNumber: "CIP-ALF04", description: "Carbon Transfer Air Lift 4", status: "mapped" },
  
  { pidTag: "05-TK-006", assetNumber: "CIP-TK06", description: "CIP Tank 6", status: "mapped" },
  { pidTag: "05-AG-006", assetNumber: "CIP-TK06-AGT01", description: "CIP Tank 6 Agitator", status: "mapped" },
  { pidTag: "05-AG-006M", assetNumber: "CIP-TK06-MTR01", description: "CIP Tank 6 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-006MC", assetNumber: "CIP-TK06-MCC01", description: "CIP Tank 6 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-006GB", assetNumber: "CIP-TK06-GBX01", description: "CIP Tank 6 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-006LCS", assetNumber: "CIP-TK06-LCS01", description: "CIP Tank 6 Agitator LCS", status: "mapped" },
  { pidTag: "05-AL-005", assetNumber: "CIP-ALF05", description: "Carbon Transfer Air Lift 5", status: "mapped" },
  
  { pidTag: "05-TK-007", assetNumber: "CIP-TK07", description: "CIP Tank 7", status: "mapped" },
  { pidTag: "05-AG-007", assetNumber: "CIP-TK07-AGT01", description: "CIP Tank 7 Agitator", status: "mapped" },
  { pidTag: "05-AG-007M", assetNumber: "CIP-TK07-MTR01", description: "CIP Tank 7 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-007MC", assetNumber: "CIP-TK07-MCC01", description: "CIP Tank 7 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-007GB", assetNumber: "CIP-TK07-GBX01", description: "CIP Tank 7 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-007LCS", assetNumber: "CIP-TK07-LCS01", description: "CIP Tank 7 Agitator LCS", status: "mapped" },
  { pidTag: "05-AL-006", assetNumber: "CIP-ALF06", description: "Carbon Transfer Air Lift 6", status: "mapped" },
  
  { pidTag: "05-TK-008", assetNumber: "CIP-TK08", description: "CIP Tank 8", status: "mapped" },
  { pidTag: "05-AG-008", assetNumber: "CIP-TK08-AGT01", description: "CIP Tank 8 Agitator", status: "mapped" },
  { pidTag: "05-AG-008M", assetNumber: "CIP-TK08-MTR01", description: "CIP Tank 8 Agitator Motor", status: "mapped" },
  { pidTag: "05-AG-008MC", assetNumber: "CIP-TK08-MCC01", description: "CIP Tank 8 Agitator MCC Cell", status: "mapped" },
  { pidTag: "05-AG-008GB", assetNumber: "CIP-TK08-GBX01", description: "CIP Tank 8 Agitator Gear Box", status: "mapped" },
  { pidTag: "05-AG-008LCS", assetNumber: "CIP-TK08-LCS01", description: "CIP Tank 8 Agitator LCS", status: "mapped" },
  
  // CIP Tails
  { pidTag: "05-PU-004", assetNumber: "CIPSMP01-PMP01", description: "CIP Tails Area Sump Pump", status: "mapped" },
  { pidTag: "05-PU-004M", assetNumber: "CIPSMP01-MTR01", description: "CIP Tails Area Sump Pump Motor", status: "mapped" },
  { pidTag: "05-PU-004MC", assetNumber: "CIPSMP01-MCC01", description: "CIP Tails Area Sump Pump MCC Cell", status: "mapped" },
  { pidTag: "05-PU-004LCS", assetNumber: "CIPSMP01-LCS01", description: "CIP Tails Area Sump Pump LCS", status: "mapped" },
  { pidTag: "05-HP-001", assetNumber: "TAILHOP01", description: "CIP Tailings Hopper", status: "mapped" },
  
  // CIP Tailings Pumps
  { pidTag: "05-PU-108A", assetNumber: "CIPPMP-A", description: "CIP Tailings Pump A", status: "mapped" },
  { pidTag: "05-PU-108AM", assetNumber: "CIPPMP-A-MTR01", description: "CIP Tailings Pump A Motor", status: "mapped" },
  { pidTag: "05-PU-108AMC", assetNumber: "CIPPMP-A-MCC01", description: "CIP Tailings Pump A MCC Cell", status: "mapped" },
  { pidTag: "05-PU-108ALCS", assetNumber: "CIPPMP-A-LCS01", description: "CIP Tailings Pump A LCS", status: "mapped" },
  { pidTag: "05-PU-108AVFD", assetNumber: "CIPPMP-A-VSD01", description: "CIP Tailings Pump A VSD", status: "mapped" },
  { pidTag: "05-PU-108B", assetNumber: "CIPPMP-B", description: "CIP Tailings Pump B", status: "mapped" },
  { pidTag: "05-PU-108BM", assetNumber: "CIPPMP-B-MTR01", description: "CIP Tailings Pump B Motor", status: "mapped" },
  { pidTag: "05-PU-108BMC", assetNumber: "CIPPMP-B-MCC01", description: "CIP Tailings Pump B MCC Cell", status: "mapped" },
  { pidTag: "05-PU-108BLCS", assetNumber: "CIPPMP-B-LCS01", description: "CIP Tailings Pump B LCS", status: "mapped" },
  { pidTag: "05-PU-108BVFD", assetNumber: "CIPPMP-B-VSD01", description: "CIP Tailings Pump B VSD", status: "mapped" },
  
  // CIP Tails Instruments
  { pidTag: "05-FIT-930", assetNumber: "THK01-FM01", description: "Tails Flow Meter", status: "mapped" },
  { pidTag: "05-LIT-925", assetNumber: "TAILHOP01-LT01", description: "CIP Tailings Hopper Level Transmitter", status: "mapped" },
  
  // CIP Gantry Crane
  { pidTag: "05-HT-001", assetNumber: "CIP-CRN01", description: "CIP Area Gantry Crane", status: "mapped" },
  
  // ============ THICKENER ============
  { pidTag: "12-TM-001", assetNumber: "THK01", description: "Tails Thickener", status: "mapped" },
  { pidTag: "12-TM-001P", assetNumber: "THK01-PIPE01", description: "Tails Thickener Piping and Valves", status: "mapped" },
  { pidTag: "PU-200A", assetNumber: "THKUFP-A", description: "Thickener Underflow Pump A", status: "mapped" },
  { pidTag: "PU-200AM", assetNumber: "THKUFP-A-MTR01", description: "Thickener Underflow Pump A Motor", status: "mapped" },
  { pidTag: "PU-200AMC", assetNumber: "THKUFP-A-MCC01", description: "Thickener Underflow Pump A MCC Cell", status: "mapped" },
  { pidTag: "PU-200ALCS", assetNumber: "THKUFP-A-LCS01", description: "Thickener Underflow Pump A LCS", status: "mapped" },
  { pidTag: "PU-200AVFD", assetNumber: "THKUFP-A-VSD01", description: "Thickener Underflow Pump A VSD", status: "mapped" },
  { pidTag: "12-PU-200B", assetNumber: "THKUFP-B", description: "Thickener Underflow Pump B", status: "mapped" },
  { pidTag: "12-PU-200BM", assetNumber: "THKUFP-B-MTR01", description: "Thickener Underflow Pump B Motor", status: "mapped" },
  { pidTag: "12-PU-200BMC", assetNumber: "THKUFP-B-MCC01", description: "Thickener Underflow Pump B MCC Cell", status: "mapped" },
  { pidTag: "12-PU-200BLCS", assetNumber: "THKUFP-B-LCS01", description: "Thickener Underflow Pump B LCS", status: "mapped" },
  { pidTag: "12-PU-200BVFD", assetNumber: "THKUFP-B-VSD01", description: "Thickener Underflow Pump B VSD", status: "mapped" },
  { pidTag: "12-HY-201", assetNumber: "THK01-HYD01", description: "Thickener Hydraulic Pack", status: "mapped" },
  
  // ============ GRAVITY ============
  { pidTag: "04-SC-100", assetNumber: "SCR01", description: "Gravity Screen", status: "mapped" },
  { pidTag: "04-GC-100", assetNumber: "KNC01", description: "Knelson Concentrator", status: "mapped" },
  { pidTag: "04-GC-100CP", assetNumber: "CR01-PNL01", description: "Knelson Concentrator Control Panel", status: "mapped" },
  { pidTag: "04-ST-100", assetNumber: "SHK01", description: "Concentrate Shaking Table", status: "mapped" },
  { pidTag: "04-PU-111", assetNumber: "PMP05", description: "Gravity Tails Pump", status: "mapped" },
  { pidTag: "04-MR-101", assetNumber: "CR01-PNL02", description: "Knelson Area Hoist", status: "mapped" },
  
  // ============ MOBILE EQUIPMENT ============
  { pidTag: "15-WL-001", assetNumber: "WL01", description: "Cat 980 Loader", status: "mapped" },
  { pidTag: "15-EX-001", assetNumber: "EX01", description: "Cat 30t Excavator", status: "mapped" },
  { pidTag: "15-DT-001", assetNumber: "MOXY01", description: "Cat Moxy", status: "mapped" },
  { pidTag: "15-DT-003", assetNumber: "MOXY02", description: "Cat Moxy", status: "mapped" },
  { pidTag: "15-LT-001", assetNumber: "LTW01", description: "Lighting Tower 1", status: "mapped" },
  { pidTag: "15-LT-002", assetNumber: "LTW02", description: "Lighting Tower 2", status: "mapped" },
  { pidTag: "15-LT-003", assetNumber: "LTW03", description: "Lighting Tower 3", status: "mapped" },
  { pidTag: "15-LT-004", assetNumber: "LTW04", description: "Lighting Tower 4", status: "mapped" },
  { pidTag: "15-LT-005", assetNumber: "LTW05", description: "Lighting Tower 5", status: "mapped" },
];

// Helper function to get P&ID tags for a given asset number
export function getPidTagsForAsset(assetNumber: string): string[] {
  return pidTagMappings
    .filter(m => m.assetNumber === assetNumber && m.status === "mapped")
    .map(m => m.pidTag);
}

// Helper function to get asset number for a given P&ID tag
export function getAssetForPidTag(pidTag: string): string | null {
  const mapping = pidTagMappings.find(m => m.pidTag === pidTag && m.status === "mapped");
  return mapping ? mapping.assetNumber : null;
}
