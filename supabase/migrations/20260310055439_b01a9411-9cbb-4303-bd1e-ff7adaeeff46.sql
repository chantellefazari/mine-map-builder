
UPDATE processing_plant_assets_rev_b
SET
  area_code = 'SUP',
  area_label = 'Support Services',
  sub_area = 'Mobile Equipment',
  parent_asset_label = 'MOB01 Mobile Equipment Fleet',
  functional_location = 'TCMG-PP-SUP-MOB-MOB01',
  sort_order = CASE asset_number
    WHEN 'LTW01' THEN 807
    WHEN 'LTW02' THEN 808
    WHEN 'LTW03' THEN 809
    WHEN 'LTW04' THEN 810
    WHEN 'LTW05' THEN 811
  END,
  updated_at = now()
WHERE asset_number IN ('LTW01', 'LTW02', 'LTW03', 'LTW04', 'LTW05');
