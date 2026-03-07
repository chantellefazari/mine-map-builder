-- Fix extraction register: 12-PU-206A → 12-PU-200A, 12-PU-206B → 12-PU-200B
UPDATE rev_b_pid_extraction_register SET tag_id = '12-PU-200A' WHERE tag_id = '12-PU-206A';
UPDATE rev_b_pid_extraction_register SET tag_id = '12-PU-200B' WHERE tag_id = '12-PU-206B';

-- Fix Rev B asset pid_tags arrays
UPDATE processing_plant_assets_rev_b 
SET pid_tags = array_replace(pid_tags, '12-PU-206A', '12-PU-200A')
WHERE '12-PU-206A' = ANY(pid_tags);

UPDATE processing_plant_assets_rev_b 
SET pid_tags = array_replace(pid_tags, '12-PU-206B', '12-PU-200B')
WHERE '12-PU-206B' = ANY(pid_tags);