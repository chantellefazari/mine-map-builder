import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Component data extracted from TCMG_Asset_Hierarchy_Master.xlsx
// Only "Existing" + "Locked" items that are sub-components of equipment
// Format: [asset_number, asset_name, area_code, area_label, sub_area, parent_asset_label]
type Row = [string, string, string, string, string, string];

const C = 'COM', CL = 'Comminution / Process';
const R = 'REC', RL = 'Gold Recovery';
const T = 'TAIL', TL = 'Tailings';
const U = 'UTL', UL = 'Utilities & Power';
const S = 'SITE', SL = 'Site Infrastructure';
const SP = 'SUP', SPL = 'Support Services';

const COMPONENT_DATA: Row[] = [
  // ── COM / Grinding / Primary Ball Mill ──
  ['04-ML-100M', 'Primary Ball Mill Motor', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-ML-100GB', 'Primary Ball Mill Gearbox', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-ML-100P', 'Primary Ball Mill Pinion', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-ML-100MC', 'Primary Ball Mill MCC Cell', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-ML-100VSD', 'Primary Ball Mill VSD', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-ML-100I', 'Primary Ball Mill Instruments', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-MR-100', 'Ball Mill Loading Monorail', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-PB-100', 'Primary Mill Discharge Hopper', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TIT-536', 'Feed End Trunnion Bearing Temperature Transmitter', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TE-536X', 'Feed End Trunnion Bearing Temperature Sensor', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TE-536Y', 'Feed End Trunnion Bearing Temperature Sensor', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TE-536Z', 'Feed End Trunnion Bearing Temperature Sensor', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TIT-537', 'Discharge End Trunnion Bearing Temperature Transmitter', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TE-537X', 'Discharge End Trunnion Bearing Temperature Sensor', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TE-537Y', 'Discharge End Trunnion Bearing Temperature Sensor', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TE-537Z', 'Discharge End Trunnion Bearing Temperature Sensor', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-TE-538', 'Mill Gear Reducer Temperature', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-FCV-545', 'Mill Discharge End Water Addition Control Valve', C, CL, 'Grinding', 'Primary Ball Mill'],
  ['04-FIT-545', 'Mill Discharge End Water Addition Flow Transmitter', C, CL, 'Grinding', 'Primary Ball Mill'],

  // ── COM / Grinding / Mill Lubrication System ──
  ['04-PU-016M', 'Lube Recirculating Pump Motor', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-016MC', 'Lube Recirculating Pump MCC Cell', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-016LCS', 'Lube Recirculating Pump LCS', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-FA-006M', 'Lube Air Blast Oil Cooler Motor', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-FA-006MC', 'Lube Air Blast Oil Cooler MCC Cell', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-FA-06LCS', 'Lube Air Blast Oil Cooler LCS', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-100AM', 'LP Lube Pump A Motor', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-100AMC', 'LP Lube Pump A MCC Cell', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-100ALCS', 'LP Lube Pump A LCS', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-100BM', 'LP Lube Pump B Motor', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-100BMC', 'LP Lube Pump B MCC Cell', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-100BLCS', 'LP Lube Pump B LCS', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-101M', 'HP Lube Pump Motor', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-101MC', 'HP Lube Pump MCC Cell', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-101LCS', 'HP Lube Pump LCS', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-120', 'Grinding Area Sump Pump', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-120M', 'Grinding Area Sump Pump Motor', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-120MC', 'Grinding Area Sump Pump MCC Cell', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PU-120LCS', 'Grinding Area Sump Pump LCS', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-LS-100I', 'Primary Mill Lube System Instruments', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PIT-520', 'Mill LP Lube Oil Pressure Transmitter', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-FIT-521', 'Mill LP Lube Oil Flow Transmitter', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-PIT-525', 'Mill HP Lube Oil Pressure Transmitter', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-FE-526', 'Mill HP Lube Oil Flow Element', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-FIT-526', 'Mill HP Lube Oil Flow Transmitter', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-LIT-528', 'Mill Lube System Oil Level', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-TIT-529', 'Mill Lube System Oil Temperature', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-LS-101CP', 'Girth Gear Lube System Control Panel', C, CL, 'Grinding', 'Mill Lubrication System'],
  ['04-LS-101P', 'Girth Gear Lube System Pump', C, CL, 'Grinding', 'Mill Lubrication System'],

  // ── COM / Feed / Reclaim / Reclaim & Feed System ──
  ['04-FE-100LCS', 'Reclaim Feeder LCS', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-100M', 'Reclaim Feeder Motor', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-100MC', 'Reclaim Feeder MCC Cell', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-100GB', 'Reclaim Feeder Gearbox', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-100-PWS', 'Reclaim Feeder Pullwire Switch', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-SIT-500', 'Reclaim Feeder Speed Transmitter', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-101LCS', 'Transfer Conveyor LCS', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-101M', 'Transfer Conveyor Motor', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-101MC', 'Transfer Conveyor MCC Cell', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-101GB', 'Transfer Conveyor Gearbox', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-FE-101PWS', 'Transfer Conveyor Pullwire Switch', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-BC-100LCS', 'Mill Feed Conveyor LCS', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-BC-100M', 'Mill Feed Conveyor Motor', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-BC-100MC', 'Mill Feed Conveyor MCC Cell', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-BC-100GB', 'Mill Feed Conveyor Gearbox', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-SS-506', 'Feed Conveyor Underspeed Switch', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-WE-506', 'Feed Conveyor Weightometer Loadcells', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-WQIT-506', 'Feed Conveyor Weightometer Transmitter', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-XS-507A', 'Feed Conveyor Pull Wire Switch A', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-XS-507B', 'Feed Conveyor Pull Wire Switch B', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-XS-507C', 'Feed Conveyor Pull Wire Switch C', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-XS-507D', 'Feed Conveyor Pull Wire Switch D', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-ZS-508A', 'Feed Conveyor Belt Alignment Switch A', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-ZS-508B', 'Feed Conveyor Belt Alignment Switch B', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-ZS-508C', 'Feed Conveyor Belt Alignment Switch C', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-ZS-508D', 'Feed Conveyor Belt Alignment Switch D', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-LSH-510', 'Ball Mill Feed Chute High Level Switch', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],
  ['04-CH-010', 'Ball Loading Chute', C, CL, 'Feed / Reclaim', 'Reclaim & Feed System'],

  // ── COM / Classification / Cyclone Feed Pumps ──
  ['04-PU-102AM', 'Cyclone Feed Pump A Motor', C, CL, 'Classification', 'Cyclone Feed Pumps'],
  ['04-PU-102AMC', 'Cyclone Feed Pump A MCC Cell', C, CL, 'Classification', 'Cyclone Feed Pumps'],
  ['04-PU-102ALCS', 'Cyclone Feed Pump A LCS', C, CL, 'Classification', 'Cyclone Feed Pumps'],
  ['04-PU-102BM', 'Cyclone Feed Pump B Motor', C, CL, 'Classification', 'Cyclone Feed Pumps'],
  ['04-PU-102BMC', 'Cyclone Feed Pump B MCC Cell', C, CL, 'Classification', 'Cyclone Feed Pumps'],
  ['04-PU-102BLCS', 'Cyclone Feed Pump B LCS', C, CL, 'Classification', 'Cyclone Feed Pumps'],

  // ── COM / Classification / Primary Cyclones ──
  ['04-CY-100I', 'Primary Cyclone Cluster Instruments', C, CL, 'Classification', 'Primary Cyclones'],
  ['04-FIT-551', 'Primary Cyclone Feed Flow Transmitter', C, CL, 'Classification', 'Primary Cyclones'],
  ['04-PIT-552', 'Primary Cyclone Pressure Transmitter', C, CL, 'Classification', 'Primary Cyclones'],
  ['04-PI-552A', 'Primary Cyclone Pressure Gauge', C, CL, 'Classification', 'Primary Cyclones'],

  // ── COM / Grinding / Gravity ──
  ['04-GC-100CP', 'Knelson Concentrator Control Panel', C, CL, 'Grinding', 'Milling Other'],
  ['04-ST-100M', 'Concentrate Shaking Table Motor', C, CL, 'Grinding', 'Milling Other'],
  ['04-ST-100MC', 'Concentrate Shaking Table MCC Cell', C, CL, 'Grinding', 'Milling Other'],
  ['04-ST-100LCS', 'Concentrate Shaking Table LCS', C, CL, 'Grinding', 'Milling Other'],
  ['04-ST-100GB', 'Concentrate Shaking Table Gearbox', C, CL, 'Grinding', 'Milling Other'],
  ['04-PU-111M', 'Gravity Tails Pump Motor', C, CL, 'Grinding', 'Milling Other'],
  ['04-PU-111MC', 'Gravity Tails Pump MCC Cell', C, CL, 'Grinding', 'Milling Other'],
  ['04-PU-111LCS', 'Gravity Tails Pump LCS', C, CL, 'Grinding', 'Milling Other'],
  ['04-MR-101', 'Knelson Area Hoist', C, CL, 'Grinding', 'Milling Other'],
  ['04-MR-101CP', 'Knelson Area Hoist Control Panel', C, CL, 'Grinding', 'Milling Other'],

  // ── REC / CIP / CIP sub-components ──
  // Trash Screen
  ['05-SC-001EXA', 'CIP Trash Screen Exciter A', R, RL, 'CIP', 'Trash Screen'],
  ['05-SC-001EXALCS', 'CIP Trash Screen Exciter A LCS', R, RL, 'CIP', 'Trash Screen'],
  ['05-SC-001EXAMC', 'CIP Trash Screen Exciter A MCC Cell', R, RL, 'CIP', 'Trash Screen'],
  ['05-SC-001EXB', 'CIP Trash Screen Exciter B', R, RL, 'CIP', 'Trash Screen'],
  ['05-SC-001EXBLCS', 'CIP Trash Screen Exciter B LCS', R, RL, 'CIP', 'Trash Screen'],
  ['05-SC-001EXBMC', 'CIP Trash Screen Exciter B MCC Cell', R, RL, 'CIP', 'Trash Screen'],
  ['05-SC-001SB', 'CIP Trash Screen Spray Bars', R, RL, 'CIP', 'Trash Screen'],
  ['05-CH-002', 'CIP Trash Screen Oversize Chute', R, RL, 'CIP', 'Trash Screen'],
  // CIP Sump Pump
  ['05-PU-005M', 'CIP Leach Area Sump Pump Motor', R, RL, 'CIP', 'CIP Pumps'],
  ['05-PU-005MC', 'CIP Leach Area Sump Pump MCC Cell', R, RL, 'CIP', 'CIP Pumps'],
  ['05-PU-005LCS', 'CIP Leach Area Sump Pump LCS', R, RL, 'CIP', 'CIP Pumps'],
  // Leach Tank 1
  ['05-AG-001M', 'Leach Tank 1 Agitator Motor', R, RL, 'CIP', 'Leach Tank 1'],
  ['05-AG-001MC', 'Leach Tank 1 Agitator MCC Cell', R, RL, 'CIP', 'Leach Tank 1'],
  ['05-AG-001GB', 'Leach Tank 1 Agitator Gearbox', R, RL, 'CIP', 'Leach Tank 1'],
  ['05-AG-001LCS', 'Leach Tank 1 Agitator LCS', R, RL, 'CIP', 'Leach Tank 1'],
  ['05-AIT-933', 'Leach Tank 1 PH Probe', R, RL, 'CIP', 'Leach Tank 1'],
  // Leach Tank 2
  ['05-AG-002M', 'Leach Tank 2 Agitator Motor', R, RL, 'CIP', 'Leach Tank 2'],
  ['05-AG-002MC', 'Leach Tank 2 Agitator MCC Cell', R, RL, 'CIP', 'Leach Tank 2'],
  ['05-AG-00GB', 'Leach Tank 2 Agitator Gearbox', R, RL, 'CIP', 'Leach Tank 2'],
  ['05-AG-002LCS', 'Leach Tank 2 Agitator LCS', R, RL, 'CIP', 'Leach Tank 2'],
  // CIP Tank 3
  ['05-AG-003M', 'CIP Tank 3 Agitator Motor', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-003MC', 'CIP Tank 3 Agitator MCC Cell', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-003GB', 'CIP Tank 3 Agitator Gearbox', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-003LCS', 'CIP Tank 3 Agitator LCS', R, RL, 'CIP', 'CIP Tanks'],
  // CIP Tank 4
  ['05-AG-004M', 'CIP Tank 4 Agitator Motor', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-004MC', 'CIP Tank 4 Agitator MCC Cell', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-004GB', 'CIP Tank 4 Agitator Gearbox', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-004LCS', 'CIP Tank 4 Agitator LCS', R, RL, 'CIP', 'CIP Tanks'],
  // CIP Tank 5
  ['05-AG-005M', 'CIP Tank 5 Agitator Motor', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-005MC', 'CIP Tank 5 Agitator MCC Cell', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-005GB', 'CIP Tank 5 Agitator Gearbox', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-005LCS', 'CIP Tank 5 Agitator LCS', R, RL, 'CIP', 'CIP Tanks'],
  // CIP Tank 6
  ['05-AG-006M', 'CIP Tank 6 Agitator Motor', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-006MC', 'CIP Tank 6 Agitator MCC Cell', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-006GB', 'CIP Tank 6 Agitator Gearbox', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-006LCS', 'CIP Tank 6 Agitator LCS', R, RL, 'CIP', 'CIP Tanks'],
  // CIP Tank 7
  ['05-AG-007M', 'CIP Tank 7 Agitator Motor', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-007MC', 'CIP Tank 7 Agitator MCC Cell', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-007GB', 'CIP Tank 7 Agitator Gearbox', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-007LCS', 'CIP Tank 7 Agitator LCS', R, RL, 'CIP', 'CIP Tanks'],
  // CIP Tank 8
  ['05-AG-008M', 'CIP Tank 8 Agitator Motor', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-008MC', 'CIP Tank 8 Agitator MCC Cell', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-008GB', 'CIP Tank 8 Agitator Gearbox', R, RL, 'CIP', 'CIP Tanks'],
  ['05-AG-008LCS', 'CIP Tank 8 Agitator LCS', R, RL, 'CIP', 'CIP Tanks'],
  // Carbon Screens (Inter-tank)
  ['05-SC-002M', 'Inter Tank Screen 1 Motor', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-002MC', 'Inter Tank Screen 1 MCC Cell', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-002LCS', 'Inter Tank Screen 1 LCS', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-003M', 'Inter Tank Screen 2 Motor', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-004M', 'Inter Tank Screen 3 Motor', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-005M', 'Inter Tank Screen 4 Motor', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-006M', 'Inter Tank Screen 5 Motor', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-007M', 'Inter Tank Screen 6 Motor', R, RL, 'CIP', 'Carbon Screens'],
  // Loaded Carbon Screen
  ['05-SC-010EX', 'Loaded Carbon Screen Exciter A', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-010EXALCS', 'Loaded Carbon Screen Exciter A LCS', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-010EXAMC', 'Loaded Carbon Screen Exciter A MCC Cell', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-010EXB', 'Loaded Carbon Screen Exciter B', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-010EXBLCS', 'Loaded Carbon Screen Exciter B LCS', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-010EXBMC', 'Loaded Carbon Screen Exciter B MCC Cell', R, RL, 'CIP', 'Carbon Screens'],
  ['05-SC-010EXSB', 'Loaded Carbon Screen Spray Bars', R, RL, 'CIP', 'Carbon Screens'],
  ['05-CH-009', 'Loaded Carbon Screen Underpan', R, RL, 'CIP', 'Carbon Screens'],

  // ── REC / Elution ──
  ['06-PU-001M', 'Elution Pump 1 Motor', R, RL, 'Elution', 'Elution General'],
  ['06-PU-001MC', 'Elution Pump 1 MCC Cell', R, RL, 'Elution', 'Elution General'],
  ['06-PU-001LCS', 'Elution Pump 1 LCS', R, RL, 'Elution', 'Elution General'],
  ['06-PU-002M', 'Elution Pump 2 Motor', R, RL, 'Elution', 'Elution General'],
  ['06-PU-002MC', 'Elution Pump 2 MCC Cell', R, RL, 'Elution', 'Elution General'],
  ['06-PU-002LCS', 'Elution Pump 2 LCS', R, RL, 'Elution', 'Elution General'],
  ['06-PU-003M', 'Elution Pump 3 Motor', R, RL, 'Elution', 'Elution General'],
  ['06-PU-003MC', 'Elution Pump 3 MCC Cell', R, RL, 'Elution', 'Elution General'],
  ['06-PU-003LCS', 'Elution Pump 3 LCS', R, RL, 'Elution', 'Elution General'],
  ['06-PU-004M', 'Elution Pump 4 Motor', R, RL, 'Elution', 'Elution General'],
  ['06-PU-004MC', 'Elution Pump 4 MCC Cell', R, RL, 'Elution', 'Elution General'],
  ['06-PU-004LCS', 'Elution Pump 4 LCS', R, RL, 'Elution', 'Elution General'],
  ['06-PU-005M', 'Elution Pump 5 Motor', R, RL, 'Elution', 'Elution General'],
  ['06-PU-005MC', 'Elution Pump 5 MCC Cell', R, RL, 'Elution', 'Elution General'],
  ['06-PU-005LCS', 'Elution Pump 5 LCS', R, RL, 'Elution', 'Elution General'],
  ['06-AG-001M', 'Elution Agitator Motor', R, RL, 'Elution', 'Elution General'],
  ['06-AG-001MC', 'Elution Agitator MCC Cell', R, RL, 'Elution', 'Elution General'],
  ['06-AG-001GB', 'Elution Agitator Gearbox', R, RL, 'Elution', 'Elution General'],
  ['06-AG-001LCS', 'Elution Agitator LCS', R, RL, 'Elution', 'Elution General'],

  // ── REC / Gold Room ──
  ['08-TI-7520', 'Electrowinning Flashpot Inlet Temperature Gauge', R, RL, 'Gold Room', 'Gold Room Equipment'],
  ['08-LSHH-7539', 'Electrowinning Flashpot High High Level Switch', R, RL, 'Gold Room', 'Gold Room Equipment'],
  ['08-BU-002', 'Barring Furnace Extraction Fan', R, RL, 'Gold Room', 'Gold Room Equipment'],
  ['08-HD-001', 'Barring Furnace Hood', R, RL, 'Gold Room', 'Gold Room Equipment'],
  ['08-XM-007', 'Gold Room Work Bench', R, RL, 'Gold Room', 'Gold Room Equipment'],
  ['08-XM-004', 'Gold Bullion Scale', R, RL, 'Gold Room', 'Gold Room Equipment'],
  ['08-XM-003', 'Gold Bullion Scale Bench', R, RL, 'Gold Room', 'Gold Room Equipment'],
  ['08-XM-005', 'Gold Room Bullion Safe', R, RL, 'Gold Room', 'Gold Room Equipment'],

  // ── TAIL / Thickening ──
  ['12-TM-001P', 'Tails Thickener Piping and Valves', T, TL, 'Thickening', 'Thickener'],
  ['PU-200AM', 'Thickener Underflow Pump A Motor', T, TL, 'Thickening', 'Thickener'],
  ['PU-200AMC', 'Thickener Underflow Pump A MCC Cell', T, TL, 'Thickening', 'Thickener'],
  ['PU-200ALCS', 'Thickener Underflow Pump A LCS', T, TL, 'Thickening', 'Thickener'],
  ['PU-200AVFD', 'Thickener Underflow Pump A VFD', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-200BM', 'Thickener Underflow Pump B Motor', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-200BMC', 'Thickener Underflow Pump B MCC Cell', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-200BLCS', 'Thickener Underflow Pump B LCS', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-200BVFD', 'Thickener Underflow Pump B VFD', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-210M', 'Tails Area Sump Pump Motor', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-210MC', 'Tails Area Sump Pump MCC Cell', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-210LCS', 'Tails Area Sump Pump LCS', T, TL, 'Thickening', 'Thickener'],
  ['12-HY-201', 'Thickener Hydraulic Pack', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-201', 'Thickener Hydraulic Pump', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-201M', 'Thickener Hydraulic Pump Motor', T, TL, 'Thickening', 'Thickener'],
  ['12-PU-201LCS', 'Thickener Hydraulic Pump LCS', T, TL, 'Thickening', 'Thickener'],
  ['12-HE-202', 'Hydraulic Oil Heater', T, TL, 'Thickening', 'Thickener'],
  ['12-FN-203', 'Hydraulic Oil Cooling Fan', T, TL, 'Thickening', 'Thickener'],
  ['12-PN-205', 'Thickener Hydraulic Pack Instruments', T, TL, 'Thickening', 'Thickener'],
  ['12-PN-205IN', 'Thickener Hydraulic Pack Instruments Detail', T, TL, 'Thickening', 'Thickener'],

  // ── TAIL / Filtering ──
  ['13-FP-301', 'Filter Press 1', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-301', 'Filter 1 Feed Pump', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-301M', 'Filter 1 Feed Pump Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-301VFD', 'Filter 1 Feed Pump VFD', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-301MC', 'Filter 1 Feed Pump MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-301', 'Filter 1 Extraction Conveyor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-301M', 'Filter 1 Extraction Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-301GB', 'Filter 1 Extraction Gearbox', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-301VFD', 'Filter 1 Extraction Conveyor VFD', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-301MC', 'Filter 1 Extraction Conveyor MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-TK-301', 'Filter 1 Stock Tank', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-301', 'Filter 1 Stock Tank Agitator', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-301M', 'Filter 1 Stock Tank Agitator Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-301GB', 'Filter 1 Stock Tank Agitator Gearbox', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-301MC', 'Filter 1 Stock Tank Agitator MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-PN-301PLC', 'Filter 1 PLC', T, TL, 'Filtering', 'Filter Press'],
  ['13-FP-301IN', 'Filter 1 Instruments', T, TL, 'Filtering', 'Filter Press'],
  ['13-FP-301P', 'Filter 1 Piping and Valves', T, TL, 'Filtering', 'Filter Press'],
  ['13-PN-301', 'Filter Press 1 Panel', T, TL, 'Filtering', 'Filter Press'],
  ['13-HY-301', 'Filter Press 1 Hydraulic Pack', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-301', 'Filter Press 1 Hydraulic Plate Pack Pump', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-301M', 'Filter Press 1 Hydraulic Plate Pack Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-301MC', 'Filter Press 1 Hydraulic Plate Pack MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-301B', 'Filter Press 1 Hydraulic TT Plate Pump', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-301BM', 'Filter Press 1 Hydraulic TT Plate Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-301BMC', 'Filter Press 1 Hydraulic TT Plate MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  // Filter Press 2
  ['13-FP-302', 'Filter Press 2', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-302', 'Filter 2 Feed Pump', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-302M', 'Filter 2 Feed Pump Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-302VFD', 'Filter 2 Feed Pump VFD', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-302MC', 'Filter 2 Feed Pump MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-302', 'Filter 2 Extraction Conveyor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-302M', 'Filter 2 Extraction Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-302GB', 'Filter 2 Extraction Gearbox', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-302VFD', 'Filter 2 Extraction Conveyor VFD', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-302MC', 'Filter 2 Extraction Conveyor MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-TK-302', 'Filter 2 Stock Tank', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-302', 'Filter 2 Stock Tank Agitator', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-302M', 'Filter 2 Stock Tank Agitator Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-302GB', 'Filter 2 Stock Tank Agitator Gearbox', T, TL, 'Filtering', 'Filter Press'],
  ['13-AG-302MC', 'Filter 2 Stock Tank Agitator MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-PN-302PLC', 'Filter 2 PLC', T, TL, 'Filtering', 'Filter Press'],
  ['13-FP-302IN', 'Filter 2 Instruments', T, TL, 'Filtering', 'Filter Press'],
  ['13-FP-302P', 'Filter 2 Piping and Valves', T, TL, 'Filtering', 'Filter Press'],
  ['13-PN-302', 'Filter Press 2 Panel', T, TL, 'Filtering', 'Filter Press'],
  ['13-HY-302', 'Filter Press 2 Hydraulic Pack', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-302', 'Filter Press 2 Hydraulic Plate Pack Pump', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-302M', 'Filter Press 2 Hydraulic Plate Pack Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-3012MC', 'Filter Press 2 Hydraulic Plate Pack MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-302B', 'Filter Press 2 Hydraulic TT Plate Pump', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-302BM', 'Filter Press 2 Hydraulic TT Plate Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-HP-302BMC', 'Filter Press 2 Hydraulic TT Plate MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  // Collection & Stacker Conveyors
  ['13-CV-303', 'Tails Filter Press Collection Conveyor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-303M', 'Collection Conveyor Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-303GB', 'Collection Conveyor Gearbox', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-303MC', 'Collection Conveyor MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-303VFD', 'Collection Conveyor VFD', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304', 'Radial Stacker Conveyor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304DAM', 'Radial Stacker Drive Motor A', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304DBM', 'Radial Stacker Drive Motor B', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304WDAM', 'Radial Stacker Wheel Drive Motor A', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304WDBM', 'Radial Stacker Wheel Drive Motor B', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304DGBA', 'Radial Stacker Drive Gearbox A', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304DGBB', 'Radial Stacker Drive Gearbox B', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304WDGBA', 'Radial Stacker Wheel Drive Gearbox A', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304WDGBB', 'Radial Stacker Wheel Drive Gearbox B', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304DAMC', 'Radial Stacker Drive A MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304DBMC', 'Radial Stacker Drive B MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304WDAMC', 'Radial Stacker Wheel Drive A MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-CV-304WDBMC', 'Radial Stacker Wheel Drive B MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-330', 'Filter Area Sump Pump', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-330M', 'Filter Area Sump Pump Motor', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-330LCS', 'Filter Area Sump Pump LCS', T, TL, 'Filtering', 'Filter Press'],
  ['13-PU-330MC', 'Filter Area Sump Pump MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  // Filter Area Compressed Air
  ['13-CP-133', 'Filter Area HP Air Compressor', T, TL, 'Filtering', 'Filter Press'],
  ['13-CP-133P', 'Filter Area HP Air Compressor Piping', T, TL, 'Filtering', 'Filter Press'],
  ['13-CP-133MC', 'Filter Area HP Air Compressor MCC Cell', T, TL, 'Filtering', 'Filter Press'],
  ['13-AR-139', 'Filter Area HP Air Receiver 1', T, TL, 'Filtering', 'Filter Press'],
  ['13-AR-140', 'Filter Area HP Air Receiver 2', T, TL, 'Filtering', 'Filter Press'],

  // ── UTL / Water ──
  ['11-PU-033AMC', 'Potable Water Pump Duty MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-033ALCS', 'Potable Water Pump Duty LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-33BMC', 'Potable Water Pump Standby MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-33BLCS', 'Potable Water Pump Standby LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-TK-202P', 'Potable Water Tank Pipework', U, UL, 'Water', 'Raw Water Tanks'],
  ['11-PU-26AM', 'Raw Water Pump Duty Motor', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-26AMC', 'Raw Water Pump Duty MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-26ALCS', 'Raw Water Pump Duty LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-26BM', 'Raw Water Pump Standby Motor', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-26BMC', 'Raw Water Pump Standby MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-26BLCS', 'Raw Water Pump Standby LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-TK-212P', 'Gland Water Tank Piping', U, UL, 'Water', 'Raw Water Tanks'],
  ['11-PU-135AM', 'Gland Water Pump Duty Motor', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-135AMC', 'Gland Water Pump Duty MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-135ALCS', 'Gland Water Pump Duty LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-135BM', 'Gland Water Pump Standby Motor', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-135BMC', 'Gland Water Pump Standby MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-135BLCS', 'Gland Water Pump Standby LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-TK-205P', 'Safety Shower Water Tank Pipework', U, UL, 'Water', 'Raw Water Tanks'],
  ['11-PU-205AM', 'Safety Shower Pump Duty Motor', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-205AMC', 'Safety Shower Pump Duty MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-205ALCS', 'Safety Shower Pump Duty LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-205BM', 'Safety Shower Pump Standby Motor', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-205BMC', 'Safety Shower Pump Standby MCC Cell', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-205BLCS', 'Safety Shower Pump Standby LCS', U, UL, 'Water', 'Raw Water Pumps'],
  ['11-PU-130AM', 'Process Water Pump Duty Motor', U, UL, 'Water', 'Process Water System'],
  ['11-PU-130AMC', 'Process Water Pump Duty MCC Cell', U, UL, 'Water', 'Process Water System'],
  ['11-PU-130ALCS', 'Process Water Pump Duty LCS', U, UL, 'Water', 'Process Water System'],
  ['11-PU-130AVFD', 'Process Water Pump Duty VFD', U, UL, 'Water', 'Process Water System'],
  ['11-PU-130BM', 'Process Water Pump Standby Motor', U, UL, 'Water', 'Process Water System'],
  ['11-PU-130BMC', 'Process Water Pump Standby MCC Cell', U, UL, 'Water', 'Process Water System'],
  ['11-PU-130BLCS', 'Process Water Pump Standby LCS', U, UL, 'Water', 'Process Water System'],
  ['11-PU-130BVFD', 'Process Water Pump Standby VFD', U, UL, 'Water', 'Process Water System'],
  ['11-PD-03P', 'Process Water Piping', U, UL, 'Water', 'Process Water System'],

  // ── UTL / Compressed Air ──
  ['05-CP-132P', 'HP Air Compressor 1 Piping', U, UL, 'Compressed Air', 'Compressed Air System'],
  ['05-CP-132MC', 'HP Air Compressor 1 MCC Cell', U, UL, 'Compressed Air', 'Compressed Air System'],
  ['05-CP-133P', 'HP Air Compressor 2 Piping', U, UL, 'Compressed Air', 'Compressed Air System'],
  ['05-CP-133MC', 'HP Air Compressor 2 MCC Cell', U, UL, 'Compressed Air', 'Compressed Air System'],
  ['05-AR-137', 'HP Air Receiver 1', U, UL, 'Compressed Air', 'Compressed Air System'],
  ['05-AR-138', 'HP Air Receiver 2', U, UL, 'Compressed Air', 'Compressed Air System'],

  // ── SITE / Site Infrastructure / Buildings ──
  ['16-BU-001', 'Admin Building', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-002', 'Workshop', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-003', 'Crib Room', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-004', 'Conference Room', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-005', 'First Aid Room', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-006', 'Male Toilet', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-007', 'Female Toilet', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-008', 'Control Room', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-009', 'Sub-100 Substation', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-010', 'Laboratory', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-011', 'Titration Hut', S, SL, 'Buildings', 'Site Buildings'],
  ['16-BU-012', 'Cyanide Dosing Hut', S, SL, 'Buildings', 'Site Buildings'],

  // ── SITE / Site Infrastructure / Power Generation ──
  ['17-Sub-100', 'Main Sub Station', S, SL, 'Power Generation', 'Power Station'],
  ['17-GN-001', 'Power Station Generator 1 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-002', 'Power Station Generator 2 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-003', 'Power Station Generator 3 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-004', 'Power Station Generator 4 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-005', 'Power Station Generator 5 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-006', 'Power Station Generator 6 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-007', 'Power Station Generator 7 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-008', 'Power Station Generator 8 (500kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-009', 'Admin Generator (50kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-010', 'Spare Generator', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-011', 'Nobles Natural Sump Generator (30kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-012', 'Lab Generator (30kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-013', 'Crusher Fuel Farm Generator (15kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-016', 'Juno Bore Generator (200kVA)', S, SL, 'Power Generation', 'Generators'],
  ['17-GN-017', 'Mining Workshop Generator (75kVA)', S, SL, 'Power Generation', 'Generators'],

  // ── SITE / Site Infrastructure / Field MCCs ──
  ['18-MCC-110', 'Mill Feed Conveyor Field MCC', S, SL, 'Electrical', 'Field MCCs'],
  ['18-MCC-111', 'Mill Area Field MCC', S, SL, 'Electrical', 'Field MCCs'],
  ['18-MCC-112', 'Gravity Field MCC', S, SL, 'Electrical', 'Field MCCs'],
  ['18-MCC-113', 'CIP Field MCC', S, SL, 'Electrical', 'Field MCCs'],
  ['18-MCC-114', 'Elution Field MCC', S, SL, 'Electrical', 'Field MCCs'],
  ['18-MCC-115', 'Carbon Regen Field MCC', S, SL, 'Electrical', 'Field MCCs'],
  ['18-MCC-116', 'Thickener Field MCC', S, SL, 'Electrical', 'Field MCCs'],

  // ── SUP / Support Services / Light Vehicles ──
  ['14-LV-005', 'LC Military', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-011', 'Toyota Hilux', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-012', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-014', 'Toyota Hilux', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-015', 'Toyota Hilux', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-016', 'Toyota Hilux', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-017', 'Toyota Hilux', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-018', 'Toyota Hilux', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-019', 'Toyota Hilux', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-020', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-021', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-022', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-023', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-024', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-026', 'Ranger Single Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-027', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-028', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-029', 'Kia', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-030', 'Ford Ranger XL Dual Cab', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-BUS-01', 'Toyota Hiace', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-BUS-02', 'Toyota Hiace', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-BUS-03', 'LDV Discovery 9', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-BUS-04', 'LDV Discovery 9', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],
  ['14-LV-013', 'Fuso TF Canter Flat Top Truck', SP, SPL, 'Light Vehicles', 'Light Vehicle Fleet'],

  // ── SUP / Support Services / Mobile Equipment ──
  ['15-PR-002', '25t Franna Crane', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-PR-003', 'Forklift', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-PR-004', 'Telehandler', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-PR-001', 'Bobcat', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-WC-001', 'Water Truck', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-ST-001', 'Service Truck', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-PR-005', 'Sino EWP', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-PR-006', 'Hire EWP', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-PR-007', 'Sino Scissor Lift 1', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-PR-008', 'Sino Scissor Lift 2', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-WL-001', 'Cat 980 Loader 1', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-WL-002', 'Cat 980 Loader 2', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-WL-003', 'Cat 980 Loader 3', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-WL-004', 'Cat 980 Loader 4', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-EX-001', 'Cat 30t Excavator', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-EX-002', 'Case Excavator', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-DT-001', 'Moxy Dump Truck 1', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-DT-003', 'Moxy Dump Truck 2', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-LT-001', 'Lighting Tower 1', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-LT-002', 'Lighting Tower 2', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-LT-003', 'Lighting Tower 3', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-LT-004', 'Lighting Tower 4', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],
  ['15-LT-005', 'Lighting Tower 5', SP, SPL, 'Mobile Equipment', 'Mobile Equipment Fleet'],

  // ── UTL / Reagents ──
  ['04-TK-100', 'Lime Storage Silo', U, UL, 'Reagents', 'Reagent Systems'],
  ['04-FE-102', 'Lime Feeder Rotary Valve', U, UL, 'Reagents', 'Reagent Systems'],
  ['-BA-103', 'Lime Silo Vibrator', U, UL, 'Reagents', 'Reagent Systems'],
  ['12-PN-206', 'Flocculant Panel 1', U, UL, 'Reagents', 'Reagent Systems'],
  ['12-PN-207', 'Flocculant Panel 2', U, UL, 'Reagents', 'Reagent Systems'],
  ['12-PN-208', 'Clarometer Panel', U, UL, 'Reagents', 'Reagent Systems'],
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get all existing Rev B asset_numbers
    const { data: existing, error: fetchErr } = await supabase
      .from('processing_plant_assets_rev_b')
      .select('asset_number')

    if (fetchErr) throw fetchErr
    const existingSet = new Set((existing || []).map((a: any) => a.asset_number))

    // Filter to only missing components
    const missing = COMPONENT_DATA.filter(c => !existingSet.has(c[0]))

    if (missing.length === 0) {
      return new Response(JSON.stringify({
        message: 'All components already exist in Rev B',
        total_checked: COMPONENT_DATA.length,
        already_exist: COMPONENT_DATA.length,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Build insert records
    let sortOrder = 6300
    const records = missing.map(([asset_number, asset_name, area_code, area_label, sub_area, parent_asset_label]) => ({
      asset_number,
      asset_name,
      area_code,
      area_label,
      sub_area,
      parent_asset_label,
      facility: 'Processing Plant',
      change_type: 'Component Fill',
      rev_status: 'Draft',
      sort_order: sortOrder++,
      notes: 'Auto-filled from TCMG Asset Hierarchy Master Excel',
    }))

    // Insert in batches of 50
    const results: any[] = []
    for (let i = 0; i < records.length; i += 50) {
      const batch = records.slice(i, i + 50)
      const { data, error } = await supabase
        .from('processing_plant_assets_rev_b')
        .insert(batch)
        .select('asset_number')
      results.push({
        batch: Math.floor(i / 50) + 1,
        inserted: data?.length || 0,
        error: error?.message || null,
      })
    }

    const totalInserted = results.reduce((s, r) => s + r.inserted, 0)

    return new Response(JSON.stringify({
      total_in_data: COMPONENT_DATA.length,
      already_in_rev_b: COMPONENT_DATA.length - missing.length,
      attempted_insert: missing.length,
      total_inserted: totalInserted,
      batches: results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
