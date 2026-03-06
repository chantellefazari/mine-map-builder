-- Fix process flow sort ordering across 6 sub-areas
-- Strategy: Use a CTE to assign new sort_order values based on correct parent_asset_label sequence within each sub-area

-- We need the current min/max sort ranges per parent. Let's re-number within each sub-area.

-- STEP 1: Feed/Reclaim — correct order: RCFD01 → TRCV01 → MFCV01
-- Current: MFCV01 (208-226), RCFD01 (227-234), TRCV01 (235-241)
-- Target: RCFD01 (208+), TRCV01, MFCV01
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      ORDER BY 
        CASE parent_asset_label
          WHEN 'RCFD01 Reclaim Hopper & Feeder' THEN 1
          WHEN 'TRCV01 Transfer Conveyor' THEN 2
          WHEN 'MFCV01 Mill Feed Conveyor' THEN 3
        END,
        sort_order
    ) + 207 AS new_sort
  FROM processing_plant_assets_rev_b
  WHERE sub_area = 'Feed / Reclaim'
)
UPDATE processing_plant_assets_rev_b t
SET sort_order = r.new_sort
FROM ranked r WHERE t.id = r.id;

-- STEP 2: Grinding — correct order: BM01 → CFP01 → MLUB01 → MANC01
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      ORDER BY 
        CASE parent_asset_label
          WHEN 'BM01 Primary Ball Mill' THEN 1
          WHEN 'CFP01 Cyclone Feed Pumps' THEN 2
          WHEN 'MLUB01 Mill Lubrication System' THEN 3
          WHEN 'MANC01 Milling Ancillary' THEN 4
        END,
        sort_order
    ) + 241 AS new_sort
  FROM processing_plant_assets_rev_b
  WHERE sub_area = 'Grinding'
)
UPDATE processing_plant_assets_rev_b t
SET sort_order = r.new_sort
FROM ranked r WHERE t.id = r.id;

-- STEP 3: Gravity Circuit — correct order: GSCN01 → KNL01 → STBL01 → GRV01
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      ORDER BY 
        CASE parent_asset_label
          WHEN 'GSCN01 Gravity Screen' THEN 1
          WHEN 'KNL01 Knelson Concentrator' THEN 2
          WHEN 'STBL01 Shaking Table & Tails' THEN 3
          WHEN 'GRV01 Gravity Ancillary' THEN 4
        END,
        sort_order
    ) + 345 AS new_sort
  FROM processing_plant_assets_rev_b
  WHERE sub_area = 'Gravity Circuit'
)
UPDATE processing_plant_assets_rev_b t
SET sort_order = r.new_sort
FROM ranked r WHERE t.id = r.id;

-- STEP 4: CIP — correct order: TSCN01 → LCH01 → CIP01 → CT01 → ADS01 → LANC01
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      ORDER BY 
        CASE parent_asset_label
          WHEN 'TSCN01 Trash Screen' THEN 1
          WHEN 'LCH01 Leach Tanks' THEN 2
          WHEN 'CIP01 CIP Tanks & Agitators' THEN 3
          WHEN 'CT01 Carbon Transfer' THEN 4
          WHEN 'ADS01 Adsorption Ancillary' THEN 5
          WHEN 'LANC01 Leaching Ancillary' THEN 6
        END,
        sort_order
    ) + 391 AS new_sort
  FROM processing_plant_assets_rev_b
  WHERE sub_area = 'CIP'
)
UPDATE processing_plant_assets_rev_b t
SET sort_order = r.new_sort
FROM ranked r WHERE t.id = r.id;

-- STEP 5: Elution — correct order: AW01 → ELU01 → EANC01
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      ORDER BY 
        CASE parent_asset_label
          WHEN 'AW01 Acid Wash' THEN 1
          WHEN 'ELU01 Elution Column & Heating' THEN 2
          WHEN 'EANC01 Elution Ancillary' THEN 3
        END,
        sort_order
    ) + 545 AS new_sort
  FROM processing_plant_assets_rev_b
  WHERE sub_area = 'Elution'
)
UPDATE processing_plant_assets_rev_b t
SET sort_order = r.new_sort
FROM ranked r WHERE t.id = r.id;

-- STEP 6: Thickening — correct order: THK01 → THYD01 → TUFP01 → TFLO01 → TANC01
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      ORDER BY 
        CASE parent_asset_label
          WHEN 'THK01 Tails Thickener' THEN 1
          WHEN 'THYD01 Thickener Hydraulic System' THEN 2
          WHEN 'TUFP01 Thickener Underflow Pumps' THEN 3
          WHEN 'TFLO01 Flocculant System' THEN 4
          WHEN 'TANC01 Thickener Ancillary' THEN 5
        END,
        sort_order
    ) + 692 AS new_sort
  FROM processing_plant_assets_rev_b
  WHERE sub_area = 'Thickening'
)
UPDATE processing_plant_assets_rev_b t
SET sort_order = r.new_sort
FROM ranked r WHERE t.id = r.id;