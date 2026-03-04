
-- Reorder Leach Tanks: group by tank number
WITH leach_order AS (
  SELECT id, 
    CASE asset_number
      WHEN '05-TK-001' THEN 1
      WHEN '05-AG-001' THEN 2
      WHEN '05-XM-001' THEN 3
      WHEN '05-AIT-933' THEN 4
      WHEN '05-TK-002' THEN 5
      WHEN '05-AG-002' THEN 6
      WHEN '05-XM-002' THEN 7
      WHEN '05-AG-00GB' THEN 8
      ELSE 9
    END as local_order
  FROM processing_plant_assets_rev_b
  WHERE parent_asset_label = 'Leach Tanks' AND sub_area = 'CIP'
)
UPDATE processing_plant_assets_rev_b p
SET sort_order = (
  SELECT MIN(sort_order) FROM processing_plant_assets_rev_b 
  WHERE parent_asset_label = 'Leach Tanks' AND sub_area = 'CIP'
) + lo.local_order - 1
FROM leach_order lo
WHERE p.id = lo.id;

-- CIP Tanks & Agitators: group by tank number (tank first, then its agitator)
WITH cip_order AS (
  SELECT id,
    CASE asset_number
      WHEN '05-TK-003' THEN 1
      WHEN '05-AG-003' THEN 2
      WHEN '05-TK-004' THEN 3
      WHEN '05-AG-004' THEN 4
      WHEN '05-TK-005' THEN 5
      WHEN '05-AG-005' THEN 6
      WHEN '05-TK-006' THEN 7
      WHEN '05-AG-006' THEN 8
      WHEN '05-TK-007' THEN 9
      WHEN '05-AG-007' THEN 10
      WHEN '05-TK-008' THEN 11
      WHEN '05-AG-008' THEN 12
      ELSE 13
    END as local_order
  FROM processing_plant_assets_rev_b
  WHERE parent_asset_label = 'CIP Tanks & Agitators' AND sub_area = 'CIP'
)
UPDATE processing_plant_assets_rev_b p
SET sort_order = (
  SELECT MIN(sort_order) FROM processing_plant_assets_rev_b 
  WHERE parent_asset_label = 'CIP Tanks & Agitators' AND sub_area = 'CIP'
) + co.local_order - 1
FROM cip_order co
WHERE p.id = co.id;

-- Clean up redundant "And Agitator" from tank names since agitators are separate assets
UPDATE processing_plant_assets_rev_b
SET asset_name = REPLACE(asset_name, ' And Agitator', '')
WHERE asset_number LIKE '05-TK-%' AND asset_name LIKE '% And Agitator';
