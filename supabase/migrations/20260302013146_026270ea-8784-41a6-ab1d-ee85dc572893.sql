
-- ============================================================
-- STRUCTURAL ALIGNMENT: Rev B → Rev A hierarchy labels
-- This ONLY updates area_label, sub_area, and area_code in
-- processing_plant_assets_rev_b. No Rev A data is touched.
-- ============================================================

-- 1. Fix area_labels
UPDATE processing_plant_assets_rev_b SET area_label = 'Comminution / Process' WHERE area_label = 'Comminution & Process';
UPDATE processing_plant_assets_rev_b SET area_label = 'Tailings' WHERE area_label = 'Tails';

-- 2. COM sub_area: split "Milling" → "Feed / Reclaim" and "Grinding"
UPDATE processing_plant_assets_rev_b SET sub_area = 'Feed / Reclaim' WHERE sub_area = 'Milling' AND parent_asset_label IN ('Reclaim & Feed System', 'Cyclone Feed Pumps');
UPDATE processing_plant_assets_rev_b SET sub_area = 'Grinding' WHERE sub_area = 'Milling';

-- 3. REC sub_area corrections
UPDATE processing_plant_assets_rev_b SET sub_area = 'CIP' WHERE sub_area = 'Adsorption';
UPDATE processing_plant_assets_rev_b SET sub_area = 'CIP' WHERE sub_area = 'Leaching';
UPDATE processing_plant_assets_rev_b SET sub_area = 'Carbon Regeneration' WHERE sub_area = 'Carbon Regen';
UPDATE processing_plant_assets_rev_b SET sub_area = 'Gold Room' WHERE sub_area = 'Electrowinning';
UPDATE processing_plant_assets_rev_b SET sub_area = 'Gold Room' WHERE sub_area = 'Goldroom';
UPDATE processing_plant_assets_rev_b SET sub_area = 'Gravity Circuit' WHERE sub_area = 'Gravity';

-- 4. TAIL sub_area corrections
UPDATE processing_plant_assets_rev_b SET sub_area = 'Filtering' WHERE sub_area = 'Filter Press';
UPDATE processing_plant_assets_rev_b SET sub_area = 'Thickening' WHERE sub_area = 'Thickener';

-- 5. SUP "Reagents" → move to UTL area
UPDATE processing_plant_assets_rev_b SET area_code = 'UTL', area_label = 'Utilities & Power', sub_area = 'Reagents' WHERE area_code = 'SUP' AND sub_area = 'Reagents';

-- 6. UTL sub_area: split "Process Water/Air"
UPDATE processing_plant_assets_rev_b SET sub_area = 'Compressed Air' WHERE sub_area = 'Process Water/Air' AND parent_asset_label = 'Compressed Air System';
UPDATE processing_plant_assets_rev_b SET sub_area = 'Water' WHERE sub_area = 'Process Water/Air';

-- 7. UTL "Raw Water" → "Water"
UPDATE processing_plant_assets_rev_b SET sub_area = 'Water' WHERE sub_area = 'Raw Water';
