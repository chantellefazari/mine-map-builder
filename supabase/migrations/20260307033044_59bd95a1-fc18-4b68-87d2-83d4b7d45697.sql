
-- Fix typo: 04-JE-101 → 04-FE-101 in extraction register
UPDATE public.rev_b_pid_extraction_register
SET tag_id = '04-FE-101', updated_at = now()
WHERE tag_id = '04-JE-101';

-- Fix typo: 04-JE-101 → 04-FE-101 in all Rev B asset pid_tags arrays
UPDATE public.processing_plant_assets_rev_b
SET pid_tags = array_replace(pid_tags, '04-JE-101', '04-FE-101'),
    updated_at = now()
WHERE '04-JE-101' = ANY(pid_tags);
