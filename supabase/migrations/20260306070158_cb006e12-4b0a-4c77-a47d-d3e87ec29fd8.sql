-- Replace '-LINE' with '-PIPE' in all piping asset numbers
UPDATE processing_plant_assets_rev_b
SET asset_number = REPLACE(asset_number, '-LINE', '-PIPE'),
    updated_at = now()
WHERE asset_number LIKE '%-LINE%';