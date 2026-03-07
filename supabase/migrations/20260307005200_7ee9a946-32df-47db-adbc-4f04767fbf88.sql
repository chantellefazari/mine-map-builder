
UPDATE processing_plant_assets_rev_b b
SET components = a.components,
    updated_at = now()
FROM processing_plant_assets a
WHERE a.asset_number = b.asset_number
  AND a.components IS NOT NULL
  AND a.components::text LIKE '%componentCode%'
  AND (b.components IS NULL OR b.components::text = '[]' OR b.components::text = 'null');
