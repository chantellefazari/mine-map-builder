UPDATE processing_plant_assets_rev_b
SET asset_number = REPLACE(asset_number, 'PcW-', 'PCW-'),
    updated_at = now()
WHERE asset_number LIKE 'PcW-%';