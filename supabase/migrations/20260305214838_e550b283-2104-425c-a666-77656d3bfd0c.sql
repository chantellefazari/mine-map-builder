-- Enrich vague pipe descriptions with function, size, material where known from P&ID context

-- WATER
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Raw Water Supply DN160 HDPE' WHERE id = '6282bd26-8bd3-4974-85d0-3417a8569049';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Raw Water Main DN160 HDPE' WHERE id = '4f9773ea-743a-43b0-bf2b-773173465013';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Raw Water Supply (Process Water System)' WHERE id = 'b12ba1f8-3714-49f2-8b72-a9c27aacc1ea';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Raw Water Supply (Reagents Area)' WHERE id = '21ebc835-c485-4a9c-9005-daaa8324fb46';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Raw Water Supply (Electrowinning)' WHERE id = 'd4c5d67c-ce3a-4b67-aae4-8ffe29c3a9a2';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Gland Water Supply (Thickener Area)' WHERE id = '62131a76-ab17-443e-ab1c-039d61d56330';

-- DIESEL
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Diesel Supply Main' WHERE id = '19741397-d115-4b6a-a6b1-224c35f9b097';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Diesel Supply (Elution Heater)' WHERE id = '817db336-d055-4f4a-8153-1307bd7d0647';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Diesel Supply (Carbon Regen Kiln)' WHERE id = '4cc47b35-8d66-4a89-9844-6261d8998ade';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Diesel Supply (Gold Room Furnace)' WHERE id = 'a1dde6dd-a07e-447e-a0f3-de9f2b9c1132';

-- CAUSTIC / ACID
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – HCl Acid Dosing Supply' WHERE id = '33a12389-304e-4e88-8b23-4e26e15a8ac4';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Caustic Soda Dosing Supply' WHERE id = '0cc09464-1d12-4dd2-b1d4-f8af7ac02b94';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Caustic Supply (Electrowinning)' WHERE id = 'a93d25b8-32a6-4766-90e0-5406848b59ef';

-- PLANT AIR
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Plant Air Supply (Reagents Area)' WHERE id = '54bef150-4729-4cf5-88d9-1d5983c38bb1';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Plant Air Supply (Adsorption Area)' WHERE id = '135969a5-8b21-4933-a235-0a2d7360e492';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Plant Air Supply (CIP Leaching Area)' WHERE id = '8bfc80f1-b81a-48ab-a1aa-f8d3538aae2f';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Plant Air Supply (Electrowinning)' WHERE id = '3fa21bc6-858c-4175-8bd7-a444f93caced';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Plant Air Supply (Electrowinning Cell)' WHERE id = '1c0308ae-a350-4960-96c8-b6dad2b75bcb';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Plant Air Supply (Thickener Area)' WHERE id = '4f287ee2-d8a5-426d-8699-06710e671fa0';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Plant Air Supply (Gold Room)' WHERE id = '9c1391d1-1be3-4d4c-a96c-455e4554e5fd';

-- SLURRY
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Slurry Feed (Gravity Screen Inlet)' WHERE id = 'a1abb340-02b9-4037-9af4-a845b722854e';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Slurry Transfer (Leaching Area)' WHERE id = 'df2337c3-cc64-44e7-a376-f2af110aee6d';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Slurry Transfer (small bore)' WHERE id = '405c7432-c95b-4198-b194-3c906e669431';

-- SUMP DISCHARGE
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Sump Discharge (Reagents Area)' WHERE id = '52fdba85-74df-42d9-927a-cb7d7427c351';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Sump Discharge (Carbon Regen Area)' WHERE id = '5f374c60-56f4-4a2b-950a-2aaa5d467c00';

-- SAFETY SHOWER
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Safety Shower Water Supply (Reagents)' WHERE id = '4322cdc3-f8bb-4d95-a936-7071d43bcea5';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Safety Shower Water Supply (CIP Area)' WHERE id = '261d9e39-43e8-4cd5-b8d6-efb8b4c640a5';

-- ELUTION
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Elution Circulation Line' WHERE id = '0987c0c7-ee05-4f1c-bb56-efe2e574025b';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Elution Return Line' WHERE id = '611014f2-4fa4-42c8-a5c6-8b09f9c72dad';

-- ELUATE
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Eluate Transfer to EW Cell' WHERE id = '3accc0f1-8f9c-4b1e-9eb2-3798ed9548b8';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Eluate Return to Tank' WHERE id = 'c799a64b-844c-463b-b3c6-7f5c59818206';

-- CARBON
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Barren Carbon Return to CIP' WHERE id = 'eec9b701-e308-4187-b70f-cd3da528d1a4';
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Barren Carbon to Regen Kiln' WHERE id = '3870e0d1-9b9d-451d-a686-4881b7015e6e';

-- PROCESS WATER (vague ones)
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Process Water Supply (CIP Leaching Area)' WHERE id = 'c42ee5d2-5eb7-4229-9b54-5099812b5c76';

-- CYANIDE (vague)
UPDATE processing_plant_assets_rev_b SET asset_name = 'Pipe – Cyanide Dosing Supply (CIP Area)' WHERE id = '82118bfb-9bf2-4ddf-81c5-4dca95bcb18e';

-- Set updated_at
UPDATE processing_plant_assets_rev_b SET updated_at = now() WHERE asset_number LIKE '%-LINE%';