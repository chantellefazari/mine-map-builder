
-- Fix Generator Daily GN-001 to GN-008: use 17-GN-XXX format from asset tree
UPDATE pm_master_list SET asset_number = '17-GN-001' WHERE pm_name = 'Generator Daily Inspection GN-001';
UPDATE pm_master_list SET asset_number = '17-GN-002' WHERE pm_name = 'Generator Daily Inspection GN-002';
UPDATE pm_master_list SET asset_number = '17-GN-003' WHERE pm_name = 'Generator Daily Inspection GN-003';
UPDATE pm_master_list SET asset_number = '17-GN-004' WHERE pm_name = 'Generator Daily Inspection GN-004';
UPDATE pm_master_list SET asset_number = '17-GN-005' WHERE pm_name = 'Generator Daily Inspection GN-005';
UPDATE pm_master_list SET asset_number = '17-GN-006' WHERE pm_name = 'Generator Daily Inspection GN-006';
UPDATE pm_master_list SET asset_number = '17-GN-007' WHERE pm_name = 'Generator Daily Inspection GN-007';
UPDATE pm_master_list SET asset_number = '17-GN-008' WHERE pm_name = 'Generator Daily Inspection GN-008';

-- Fix area-based references to proper asset tree codes
UPDATE pm_master_list SET asset_number = 'ELU01' WHERE pm_name = 'Acid Wash & Elution Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'COMP01, PW01' WHERE pm_name = 'Air & Water Services Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'CIP01' WHERE pm_name = 'Bottom of Tanks Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'CIP01' WHERE pm_name = 'Top of Tanks Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'GR01' WHERE pm_name = 'Gold Room Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'RA01' WHERE pm_name = 'Reagents Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'THK01' WHERE pm_name = 'Thickener Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'PW01-RO01' WHERE pm_name = 'RO Plant Daily Inspection';

-- Fix Filter Press Compressor references (FPAC01 doesn't exist, use FPAR01-CMP02)
UPDATE pm_master_list SET asset_number = 'FPAR01-CMP02' WHERE pm_name = 'Filter Press Compressor (Online) Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'FPAR01-CMP02' WHERE pm_name = 'Filter Press Compressor (Offline) Weekly Inspection';

-- Fix Electrical PM asset references
UPDATE pm_master_list SET asset_number = 'PWR05' WHERE pm_name = 'Field MCC Inspections Weekly';
UPDATE pm_master_list SET asset_number = 'SB-003B' WHERE pm_name = 'Ice Machine Weekly Inspection';
UPDATE pm_master_list SET asset_number = 'SUB100' WHERE pm_name = 'Substation Inspection Fortnightly';

-- Fix Statutory Motor Inspections
UPDATE pm_master_list SET asset_number = 'ELU01' WHERE pm_name = 'Statutory Motor Inspection - Elution';
UPDATE pm_master_list SET asset_number = 'FP01, FP02' WHERE pm_name = 'Statutory Motor Inspection - Filter Press';
UPDATE pm_master_list SET asset_number = 'GR01' WHERE pm_name = 'Statutory Motor Inspection - Gold Room';
UPDATE pm_master_list SET asset_number = 'KLN01' WHERE pm_name = 'Statutory Motor Inspection - Kiln Area';
UPDATE pm_master_list SET asset_number = 'BM01' WHERE pm_name = 'Statutory Motor Inspection - Milling Area';
UPDATE pm_master_list SET asset_number = 'PCW01-PND01' WHERE pm_name = 'Statutory Motor Inspection - Process Water Pond';
UPDATE pm_master_list SET asset_number = 'CIP01' WHERE pm_name = 'Statutory Motor Inspection - Tanks';
UPDATE pm_master_list SET asset_number = 'THK01' WHERE pm_name = 'Statutory Motor Inspection - Thickener';
