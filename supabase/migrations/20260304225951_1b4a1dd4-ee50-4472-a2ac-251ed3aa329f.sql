-- =====================================================
-- COMPREHENSIVE VALVE DESCRIPTION ENRICHMENT
-- Adds size (mm) from tag prefix and fixes wrong types
-- using pid_valve_code naming conventions
-- =====================================================

-- === TYPE FIXES (wrong valve type decoded) ===
-- V11 = Needle Valve (was "Ball Valve")
UPDATE processing_plant_assets_rev_b SET asset_name = 'Needle Valve 15mm' WHERE asset_number = 'V296-15V11';
-- V05 = Butterfly (was "Ball Valve")
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 15mm' WHERE asset_number = '15V05 (multiple)';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 15mm' WHERE asset_number = '15V05-V012';

-- === GRAVITY CIRCUIT ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Knife Gate Valve 150mm' WHERE asset_number = '150V03-V250';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = '25V01-V253';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = '25V01-V254';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = '25V01-V255';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 50mm' WHERE asset_number = '50V01-V252';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 50mm' WHERE asset_number = '50V01-V257';

-- === CIP - LEACHING ANCILLARY ===
-- (15SV05-V008, 15SV05-V998 already have "Solenoid Valve 15mm" — check)
-- 15V05-V012 fixed above

-- === CIP - ADSORPTION ANCILLARY ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Solenoid Valve 15mm' WHERE asset_number = '15SV05-V35';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 50mm' WHERE asset_number = '50V01-V991';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = '80V05-V57';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = '80V05-V58';

-- === ELUTION ANCILLARY ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V106-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V109-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V110-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V113-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V115-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V115A-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V125-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V148-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 50mm' WHERE asset_number = 'V152-50V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = 'V153-80V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V154-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = 'V155-15V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V156-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V162-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = 'V163-80V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V164-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V165-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V169-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = 'V170-15V01';

-- === CARBON REGENERATION ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = '50V05-V178';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = '50V05-V186';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 54mm' WHERE asset_number = '54V01';

-- === GOLD ROOM ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = 'V176-15V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = 'V181-15V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 54mm' WHERE asset_number = 'V197-54V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V209-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 54mm' WHERE asset_number = 'V221-54V01';

-- === ELECTROWINNING ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = '15V01-V195';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V101-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V117-25V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = 'V135-15V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = 'V136-80V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = 'V137-50V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = 'V195-80V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = 'V1L1-15V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = 'V1L3-25V01';

-- === TAILINGS - THICKENER ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 15mm' WHERE asset_number = '15V01 (thickener)';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 32mm' WHERE asset_number = '32V01';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = '80V05' AND area_code = 'TAIL';

-- === TAILINGS - FILTER PRESS ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = '25V31-25V01';

-- === UTILITIES - WATER ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 100mm' WHERE asset_number = '100V05';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 50mm' WHERE asset_number = '50V05 (multiple)';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = '25V01-V301';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 50mm' WHERE asset_number = '50V01 (multiple)';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 200mm' WHERE asset_number = 'V305-200V05';

-- === UTILITIES - REAGENTS (CYANIDE) ===
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 100mm' WHERE asset_number = '100V05-V075';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 25mm' WHERE asset_number = '25V01-V074';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 50mm' WHERE asset_number = '50V01-V078';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 50mm' WHERE asset_number = '50V01-V079';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Ball Valve 80mm' WHERE asset_number = '80V01-V067';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = '80V05-V066';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Butterfly Valve 80mm' WHERE asset_number = '80V05-V071';