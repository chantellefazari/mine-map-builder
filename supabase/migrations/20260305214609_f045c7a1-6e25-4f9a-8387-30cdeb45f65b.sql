UPDATE processing_plant_assets_rev_b
SET asset_name = 'Pipe – ' || asset_name,
    updated_at = now()
WHERE asset_number LIKE '%-LINE%'
  AND asset_name NOT LIKE 'Pipe –%';