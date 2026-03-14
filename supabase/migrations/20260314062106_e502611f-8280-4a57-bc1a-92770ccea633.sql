UPDATE processing_plant_assets_rev_b
SET 
  asset_number = REPLACE(asset_number, 'CA-COMP01-', 'COMP01-'),
  parent_asset_label = REPLACE(parent_asset_label, 'CA-COMP01', 'COMP01')
WHERE asset_number LIKE 'CA-COMP01-%';

UPDATE processing_plant_assets_rev_b
SET 
  asset_number = 'COMP01',
  parent_asset_label = 'COMP01 Compressed Air System'
WHERE asset_number = 'CA-COMP01';

UPDATE processing_plant_assets_rev_b
SET parent_asset_label = 'COMP01 Compressed Air System'
WHERE parent_asset_label = 'CA-COMP01 Compressed Air System';