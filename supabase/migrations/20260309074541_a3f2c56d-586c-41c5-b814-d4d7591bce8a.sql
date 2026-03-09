
-- Delete duplicate lighting towers from MOB01 (already exist under LTW01)
DELETE FROM processing_plant_assets_rev_b 
WHERE asset_number IN ('15-LT-001', '15-LT-002', '15-LT-003', '15-LT-004', '15-LT-005');

-- Re-number MOB01 fleet to standard codes
UPDATE processing_plant_assets_rev_b SET asset_number = 'MXY01' WHERE asset_number = '15-DT-001';
UPDATE processing_plant_assets_rev_b SET asset_number = 'MXY02' WHERE asset_number = '15-DT-003';
UPDATE processing_plant_assets_rev_b SET asset_number = 'EXC01' WHERE asset_number = '15-EX-001';
UPDATE processing_plant_assets_rev_b SET asset_number = 'EXC02' WHERE asset_number = '15-EX-002';
UPDATE processing_plant_assets_rev_b SET asset_number = 'SKD01' WHERE asset_number = '15-PR-001';
UPDATE processing_plant_assets_rev_b SET asset_number = 'CRN01' WHERE asset_number = '15-PR-002';
UPDATE processing_plant_assets_rev_b SET asset_number = 'FLT01' WHERE asset_number = '15-PR-003';
UPDATE processing_plant_assets_rev_b SET asset_number = 'TLH01' WHERE asset_number = '15-PR-004';
UPDATE processing_plant_assets_rev_b SET asset_number = 'EWP01' WHERE asset_number = '15-PR-005';
UPDATE processing_plant_assets_rev_b SET asset_number = 'EWP02' WHERE asset_number = '15-PR-006';
UPDATE processing_plant_assets_rev_b SET asset_number = 'EWP03' WHERE asset_number = '15-PR-007';
UPDATE processing_plant_assets_rev_b SET asset_number = 'EWP04' WHERE asset_number = '15-PR-008';
UPDATE processing_plant_assets_rev_b SET asset_number = 'SVT01' WHERE asset_number = '15-ST-001';
UPDATE processing_plant_assets_rev_b SET asset_number = 'WTR01' WHERE asset_number = '15-WC-001';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LDR01' WHERE asset_number = '15-WL-001';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LDR02' WHERE asset_number = '15-WL-002';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LDR03' WHERE asset_number = '15-WL-003';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LDR04' WHERE asset_number = '15-WL-004';

-- Re-number LTV01 fleet to standard codes
UPDATE processing_plant_assets_rev_b SET asset_number = 'BUS01' WHERE asset_number = '14-BUS-01';
UPDATE processing_plant_assets_rev_b SET asset_number = 'BUS02' WHERE asset_number = '14-BUS-02';
UPDATE processing_plant_assets_rev_b SET asset_number = 'BUS03' WHERE asset_number = '14-BUS-03';
UPDATE processing_plant_assets_rev_b SET asset_number = 'BUS04' WHERE asset_number = '14-BUS-04';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV01' WHERE asset_number = '14-LV-005';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV02' WHERE asset_number = '14-LV-011';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV03' WHERE asset_number = '14-LV-012';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV04' WHERE asset_number = '14-LV-013';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV05' WHERE asset_number = '14-LV-014';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV06' WHERE asset_number = '14-LV-015';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV07' WHERE asset_number = '14-LV-016';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV08' WHERE asset_number = '14-LV-017';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV09' WHERE asset_number = '14-LV-018';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV10' WHERE asset_number = '14-LV-019';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV11' WHERE asset_number = '14-LV-020';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV12' WHERE asset_number = '14-LV-021';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV13' WHERE asset_number = '14-LV-022';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV14' WHERE asset_number = '14-LV-023';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV15' WHERE asset_number = '14-LV-024';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV16' WHERE asset_number = '14-LV-026';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV17' WHERE asset_number = '14-LV-027';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV18' WHERE asset_number = '14-LV-028';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV19' WHERE asset_number = '14-LV-029';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LV20' WHERE asset_number = '14-LV-030';

-- Re-sort MOB01 fleet alphabetically by type
UPDATE processing_plant_assets_rev_b SET sort_order = 799 WHERE asset_number = 'CRN01';
UPDATE processing_plant_assets_rev_b SET sort_order = 800 WHERE asset_number = 'EWP01';
UPDATE processing_plant_assets_rev_b SET sort_order = 801 WHERE asset_number = 'EWP02';
UPDATE processing_plant_assets_rev_b SET sort_order = 802 WHERE asset_number = 'EWP03';
UPDATE processing_plant_assets_rev_b SET sort_order = 803 WHERE asset_number = 'EWP04';
UPDATE processing_plant_assets_rev_b SET sort_order = 804 WHERE asset_number = 'EXC01';
UPDATE processing_plant_assets_rev_b SET sort_order = 805 WHERE asset_number = 'EXC02';
UPDATE processing_plant_assets_rev_b SET sort_order = 806 WHERE asset_number = 'FLT01';
UPDATE processing_plant_assets_rev_b SET sort_order = 807 WHERE asset_number = 'LDR01';
UPDATE processing_plant_assets_rev_b SET sort_order = 808 WHERE asset_number = 'LDR02';
UPDATE processing_plant_assets_rev_b SET sort_order = 809 WHERE asset_number = 'LDR03';
UPDATE processing_plant_assets_rev_b SET sort_order = 810 WHERE asset_number = 'LDR04';
UPDATE processing_plant_assets_rev_b SET sort_order = 811 WHERE asset_number = 'MXY01';
UPDATE processing_plant_assets_rev_b SET sort_order = 812 WHERE asset_number = 'MXY02';
UPDATE processing_plant_assets_rev_b SET sort_order = 813 WHERE asset_number = 'SKD01';
UPDATE processing_plant_assets_rev_b SET sort_order = 814 WHERE asset_number = 'SVT01';
UPDATE processing_plant_assets_rev_b SET sort_order = 815 WHERE asset_number = 'TLH01';
UPDATE processing_plant_assets_rev_b SET sort_order = 816 WHERE asset_number = 'WTR01';

-- Re-sort LTV01 fleet
UPDATE processing_plant_assets_rev_b SET sort_order = 818 WHERE asset_number = 'BUS01';
UPDATE processing_plant_assets_rev_b SET sort_order = 819 WHERE asset_number = 'BUS02';
UPDATE processing_plant_assets_rev_b SET sort_order = 820 WHERE asset_number = 'BUS03';
UPDATE processing_plant_assets_rev_b SET sort_order = 821 WHERE asset_number = 'BUS04';
UPDATE processing_plant_assets_rev_b SET sort_order = 822 WHERE asset_number = 'LV01';
UPDATE processing_plant_assets_rev_b SET sort_order = 823 WHERE asset_number = 'LV02';
UPDATE processing_plant_assets_rev_b SET sort_order = 824 WHERE asset_number = 'LV03';
UPDATE processing_plant_assets_rev_b SET sort_order = 825 WHERE asset_number = 'LV04';
UPDATE processing_plant_assets_rev_b SET sort_order = 826 WHERE asset_number = 'LV05';
UPDATE processing_plant_assets_rev_b SET sort_order = 827 WHERE asset_number = 'LV06';
UPDATE processing_plant_assets_rev_b SET sort_order = 828 WHERE asset_number = 'LV07';
UPDATE processing_plant_assets_rev_b SET sort_order = 829 WHERE asset_number = 'LV08';
UPDATE processing_plant_assets_rev_b SET sort_order = 830 WHERE asset_number = 'LV09';
UPDATE processing_plant_assets_rev_b SET sort_order = 831 WHERE asset_number = 'LV10';
UPDATE processing_plant_assets_rev_b SET sort_order = 832 WHERE asset_number = 'LV11';
UPDATE processing_plant_assets_rev_b SET sort_order = 833 WHERE asset_number = 'LV12';
UPDATE processing_plant_assets_rev_b SET sort_order = 834 WHERE asset_number = 'LV13';
UPDATE processing_plant_assets_rev_b SET sort_order = 835 WHERE asset_number = 'LV14';
UPDATE processing_plant_assets_rev_b SET sort_order = 836 WHERE asset_number = 'LV15';
UPDATE processing_plant_assets_rev_b SET sort_order = 837 WHERE asset_number = 'LV16';
UPDATE processing_plant_assets_rev_b SET sort_order = 838 WHERE asset_number = 'LV17';
UPDATE processing_plant_assets_rev_b SET sort_order = 839 WHERE asset_number = 'LV18';
UPDATE processing_plant_assets_rev_b SET sort_order = 840 WHERE asset_number = 'LV19';
UPDATE processing_plant_assets_rev_b SET sort_order = 841 WHERE asset_number = 'LV20';

-- Update LTV01 header sort_order
UPDATE processing_plant_assets_rev_b SET sort_order = 817 WHERE asset_number = 'LTV01' AND parent_asset_label = 'LTV01 Light Vehicle Fleet';
