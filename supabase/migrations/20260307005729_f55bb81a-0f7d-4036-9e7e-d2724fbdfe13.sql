
-- Transfer components from Rev A to Rev B using name-based matching
-- Only update Rev B assets that don't already have components

-- BM01-GBX01 -> BM01-GB (Gear Reducer)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'BM01-GBX01'), updated_at = now() WHERE asset_number = 'BM01-GB' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- BRN01 -> ELU-BRN01 (Elution Heater Burner)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'BRN01'), updated_at = now() WHERE asset_number = 'ELU-BRN01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- COL01 -> AW-COL01 (Acid Wash Column)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'COL01'), updated_at = now() WHERE asset_number = 'AW-COL01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- COL02 -> ELU-COL01 (Elution Column)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'COL02'), updated_at = now() WHERE asset_number = 'ELU-COL01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- CYN-MIX-AGT-01 -> CNAGT01 (Cyanide Mixing Tank Agitator)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'CYN-MIX-AGT-01'), updated_at = now() WHERE asset_number = 'CNAGT01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- FLT03 -> ELU-FLT01 (Elution Column Carbon Filters)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'FLT03'), updated_at = now() WHERE asset_number = 'ELU-FLT01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- HEX01 -> ELU-HEX01 (Heat Exchanger)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'HEX01'), updated_at = now() WHERE asset_number = 'ELU-HEX01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- HTR01 -> ELU-HTR01 (Elution Heater)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'HTR01'), updated_at = now() WHERE asset_number = 'ELU-HTR01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- LBS01 -> MLUB02 (Girth Gear Lube)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'LBS01'), updated_at = now() WHERE asset_number = 'MLUB02' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- MFC01 -> MFCV01 (Mill Feed Conveyor)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'MFC01'), updated_at = now() WHERE asset_number = 'MFCV01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- MFC01-MTR01 -> MFCV01-MTR (Mill Feed Conveyor Motor)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'MFC01-MTR01'), updated_at = now() WHERE asset_number = 'MFCV01-MTR' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- OCL02 -> MLUB01-CLR (Lube Air Blast Oil Cooler)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'OCL02'), updated_at = now() WHERE asset_number = 'MLUB01-CLR' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PMP05 -> GRV-PMP01 (Gravity Tails Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PMP05'), updated_at = now() WHERE asset_number = 'GRV-PMP01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PMP09 -> CNPU01 (Cyanide Solution Transfer Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PMP09'), updated_at = now() WHERE asset_number = 'CNPU01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PMP14 -> EW-PMP02 (Eluate Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PMP14'), updated_at = now() WHERE asset_number = 'EW-PMP02' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PMP15 -> GR-PMP01 (Cathode Wash Sludge Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PMP15'), updated_at = now() WHERE asset_number = 'GR-PMP01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- SCRF01 -> KLN-SCF01 (Regen Kiln Screw Feeder)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'SCRF01'), updated_at = now() WHERE asset_number = 'KLN-SCF01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- TNK01 -> CNST01 (Cyanide Solution Storage Tank)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'TNK01'), updated_at = now() WHERE asset_number = 'CNST01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- UTL-PW-PMP-D -> PCWPA01 (Process Water Pump Duty)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'UTL-PW-PMP-D'), updated_at = now() WHERE asset_number = 'PCWPA01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- UTL-PW-PMP-S -> PCWPB01 (Process Water Pump Standby)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'UTL-PW-PMP-S'), updated_at = now() WHERE asset_number = 'PCWPB01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- Additional matches by similar name
-- CFP01-A -> CFPA01 (Cyclone Feed Pump Duty)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'CFP01-A'), updated_at = now() WHERE asset_number = 'CFPA01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- CFP01-B -> CFPB01 (Cyclone Feed Pump Standby)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'CFP01-B'), updated_at = now() WHERE asset_number = 'CFPB01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- CYFPA01 -> CFPA01 (already matched above, skip if duplicate)
-- CYFPB01 -> CFPB01 (already matched above, skip if duplicate)

-- CIP-SUMP-PMP-D -> LCH-PMP01 (CIP Area Sump Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'CIP-SUMP-PMP-D'), updated_at = now() WHERE asset_number = 'LCH-PMP01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- FAN01 -> EW-FAN01 (Electrowinning Fan)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'FAN01'), updated_at = now() WHERE asset_number = 'EW-FAN01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- REC01 -> EW-RECT01 (Rectifier)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'REC01'), updated_at = now() WHERE asset_number = 'EW-RECT01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- SCN03 -> CT-SCN01 (Carbon Safety Screen)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'SCN03'), updated_at = now() WHERE asset_number = 'CT-SCN01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- SCN04 -> CT-SCN02 (Loaded Carbon Screen)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'SCN04'), updated_at = now() WHERE asset_number = 'CT-SCN02' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- THK01-HYD01 -> THKHYD01 (Thickener Hydraulic Pack)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'THK01-HYD01'), updated_at = now() WHERE asset_number = 'THKHYD01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- THKUFP-A -> THKUFPA01 (Thickener Underflow Pump A)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'THKUFP-A'), updated_at = now() WHERE asset_number = 'THKUFPA01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- THKUFP-B -> THKUFPB01 (Thickener Underflow Pump B)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'THKUFP-B'), updated_at = now() WHERE asset_number = 'THKUFPB01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- FLOC01-PMP01 -> FLOC-PMP01 (Flocculant Dosing Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'FLOC01-PMP01'), updated_at = now() WHERE asset_number = 'FLOC-PMP01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- GWTR01-PMP01 -> GWPA01 (Gland Water Pump Duty)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'GWTR01-PMP01'), updated_at = now() WHERE asset_number = 'GWPA01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- GWTR01-PMP02 -> GWPB01 (Gland Water Pump Standby)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'GWTR01-PMP02'), updated_at = now() WHERE asset_number = 'GWPB01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- HCMP03 -> FPCMP02 (Filter Area HP Air Compressor)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'HCMP03'), updated_at = now() WHERE asset_number = 'FPCMP02' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PWT01-PMP01 -> PWPA01 (Potable Water Pump Duty)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PWT01-PMP01'), updated_at = now() WHERE asset_number = 'PWPA01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PWT01-PMP02 -> PWPB01 (Potable Water Pump Standby)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PWT01-PMP02'), updated_at = now() WHERE asset_number = 'PWPB01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- RWT01-PMP01 -> RWPA01 (Raw Water Pump Duty)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'RWT01-PMP01'), updated_at = now() WHERE asset_number = 'RWPA01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PMP10 -> HCLP01 (HCl Acid Dosing Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PMP10'), updated_at = now() WHERE asset_number = 'HCLP01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- PMP13 -> ASDP01 (Antiscalant Dosing Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'PMP13'), updated_at = now() WHERE asset_number = 'ASDP01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- CIPSMP01 -> ADS-PMP01 (CIP Tails Sump Pump)
UPDATE processing_plant_assets_rev_b SET components = (SELECT components FROM processing_plant_assets WHERE asset_number = 'CIPSMP01'), updated_at = now() WHERE asset_number = 'ADS-PMP01' AND (components IS NULL OR components::text = '[]' OR components::text = 'null');

-- TC01 -> FPCV01 check if tailings conveyor exists
-- FLT01 -> check if Knelson prefilter exists
-- FLT02 -> check if AW carbon filters exist
-- PMP11 -> check if HCL sump pump exists
-- PMP12 -> check if elution sump pump exists
-- FFD01-PMP02 -> check if filter feed pump standby exists
-- APN01 -> check if apron feeder exists in Rev B
-- APN01-GMR01 -> check gearmotor
-- GRD-BM-GBX -> duplicate of BM01-GBX01
-- GRD-LP-HPUMP -> high pressure lube pump
-- GRD-LP-LPUMP-D/S -> low pressure lube pumps
-- OCL01 -> water oil cooler
-- CYC01-1/2/3 -> individual cyclones
-- GSPMP01-PMP01 -> grinding sump pump
-- FAN02 -> gold room fan
