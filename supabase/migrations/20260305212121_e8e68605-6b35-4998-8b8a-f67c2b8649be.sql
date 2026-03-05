UPDATE processing_plant_assets_rev_b SET asset_name = CASE id
-- === GENERIC / MEANINGLESS NAMES ===
WHEN '6006a916-2aff-49fe-b0ab-e7652cb4b98c' THEN 'Slurry Return Line DN125 RL'          -- GRV-LINE08 was "Line (RL)"
WHEN '50446447-48c6-44a2-bc08-af71b152eb89' THEN 'HD Service Line DN50'                  -- GRV-LINE11 was "General HD line"
WHEN '561cc032-088d-432b-ae26-69fca82c6435' THEN 'Lime Slurry Line DN110 HDPE'           -- CREG-LINE06 was "Line (material)"
WHEN '6b56841e-5329-414d-92de-d392dd721f2c' THEN 'HD Service Line DN90'                  -- CREG-LINE07 was "General line"
WHEN 'd6582055-c725-4875-94fd-e837c83c94f1' THEN 'Stainless Steel Line DN25'             -- GR-LINE01 was "Line (SS)"
WHEN '4050bb29-5990-4601-adc8-8a6f54647ddf' THEN 'HD Service Line DN90'                  -- THK-LINE02 was "General"

-- === GLAND WATER DUPLICATES (GW-LINE01–04) ===
WHEN '0ad89127-91c6-4212-a3c5-0ba1e678791e' THEN 'Gland Water DN32 (Mill Area)'         -- GW-LINE01
WHEN '5b3b2936-c02a-4463-9123-3904f217bc5d' THEN 'Gland Water DN32 (Cyclone Area)'      -- GW-LINE02
WHEN '50d4500f-cf50-4289-87fe-ba9ebe799a35' THEN 'Gland Water DN63 (Supply Header)'     -- GW-LINE03
WHEN '521caa78-f944-4f8a-93fe-6d3f1f61e270' THEN 'Gland Water DN63 (Distribution)'      -- GW-LINE04

-- === POTABLE WATER DUPLICATES ===
WHEN '34570565-7d0e-4179-9e77-a5d76ee66b44' THEN 'Potable Water DN63 PN8'               -- PW-LINE01
WHEN 'ee4de160-b055-4ea4-b5f0-74cca402a950' THEN 'Potable Water DN63 PN6'               -- PW-LINE02

-- === PROCESS WATER DUPLICATES (PCW) ===
WHEN 'aeceee91-74ff-4a12-99df-e6384a930472' THEN 'Process Water DN119 HDPE'              -- PCW-LINE01
WHEN 'e73c2e0a-da40-4ef1-89e9-3e85307c631d' THEN 'Process Water DN200 (Line 202)'       -- PCW-LINE04
WHEN '9adff041-b6d6-47ca-b8d1-4abec1e7a84f' THEN 'Process Water DN200 (Line 203)'       -- PCW-LINE05

-- === CYANIDE DUPLICATES ===
WHEN '483a9a20-062b-4d55-94b5-8005e3052940' THEN 'Cyanide Main DN100 CS'                -- CN-LINE01
WHEN '47f2ffb9-667a-452d-a830-b00b334a5eaf' THEN 'Cyanide DN90 CS'                      -- CN-LINE02
WHEN 'd0f77124-e23e-46ca-8e95-d0b48f120897' THEN 'Cyanide Return DN40 (Line 037)'       -- CN-LINE04
WHEN '193c06c6-1058-4c6c-8346-43da948a76ae' THEN 'Cyanide Return DN40 (Line 038)'       -- CN-LINE05

-- === GRAVITY CIRCUIT DUPLICATES ===
WHEN 'b9bae019-ade2-41aa-a86e-7b36de8e7fc4' THEN 'Knelson Bypass DN150 RL'              -- GRV-LINE04
WHEN 'a856017e-3d95-4c06-b10b-4a97d03faeee' THEN 'Knelson Bypass DN154 RL'              -- GRV-LINE05
WHEN '33393625-e035-492b-b910-5b78f773c328' THEN 'Process Water DN110 HDPE'             -- GRV-LINE09
WHEN 'f64355fc-a5b7-471e-9ebe-498934c3ec1f' THEN 'Process Water DN50 HDPE'              -- GRV-LINE12

-- === CIP / ADSORPTION DUPLICATES ===
WHEN 'd9938648-fb29-4039-af4e-d8a050166071' THEN 'Sump Discharge DN90 (Line 007)'       -- CIP-LINE05
WHEN 'cfe3edaa-213d-4a72-81b0-d9311a469848' THEN 'Sump Discharge DN90 HD3 (Line 015)'   -- CIP-LINE08
WHEN '59896e5f-44f4-4007-bc01-fa1d88840b9d' THEN 'Instrument Air DN6 (Line 096)'        -- CIP-LINE12
WHEN '8f8612a3-7a23-46ea-9887-f506cb694aa3' THEN 'Instrument Air DN6 (Line 097)'        -- CIP-LINE13
WHEN '95ed5f7e-1781-4ff1-9f4e-c31bb34db017' THEN 'Sump Discharge DN90 (Line 008)'       -- ADS-LINE01
WHEN 'a092cafa-6903-4538-9b76-c58f17391d54' THEN 'Sump Discharge DN90 (Line 009)'       -- ADS-LINE02
WHEN 'c5ede826-c520-4195-a7bb-0a3b03a14063' THEN 'Sump Discharge DN90 (Line 010)'       -- ADS-LINE03
WHEN 'c5dc0a98-edfd-4f0d-baa4-ced046691939' THEN 'Sump Discharge DN90 (Line 011)'       -- ADS-LINE04
WHEN '56a0a905-a299-466f-b5b1-26b602081800' THEN 'Slurry DN98 HDPE (Line 016)'          -- ADS-LINE06
WHEN 'd9ef5c87-116d-4672-b7a6-7a353143810a' THEN 'Process Water DN110 (Line 032)'       -- ADS-LINE07
WHEN 'b5d18522-c7b8-4377-829d-ba8f0a8de201' THEN 'Process Water DN63 (Line 053)'        -- ADS-LINE10
WHEN 'beed0220-faf7-4f0e-9e09-514f04152ff6' THEN 'Slurry DN315 HDPE (Line 118)'         -- ADS-LINE14

-- === ELUTION DUPLICATES (the user's original complaint) ===
WHEN 'f2acfc5c-8bbc-4cdf-a60d-6fae92808169' THEN 'Raw Water DN80 CS'                    -- ELU-LINE05
WHEN 'b053b344-f557-478c-b0ac-69677fd0d51d' THEN 'Raw Water DN50 CS'                    -- ELU-LINE07
WHEN 'aafb6687-8ee4-4297-a6e7-f220d556f880' THEN 'Barren Carbon DN80 CS'                -- ELU-LINE09
WHEN '1f69e1bc-8f11-406d-9630-138e69a5670f' THEN 'Barren Carbon DN90 HDPE'              -- ELU-LINE10

-- === THICKENER / FILTER PRESS DUPLICATES ===
WHEN '26cb533d-0967-4ffa-814d-ad5e8ea7db10' THEN 'Process Water DN200 HDPE'             -- THK-LINE05
WHEN '6c405e7b-1892-487e-a0f4-5147de615ccf' THEN 'Raw Water DN160 HDPE'                 -- THK-LINE06
WHEN 'c480e0d1-a061-4112-8dd6-e1b2c3629ab6' THEN 'Process Water DN200 HDPE'             -- FP-LINE01
WHEN 'e263d3a4-a85a-451a-b980-6843c1307a11' THEN 'Raw Water DN160 HDPE'                 -- FP-LINE02

ELSE asset_name END,
updated_at = now()
WHERE asset_number LIKE '%-LINE%';