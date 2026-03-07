-- Cleanup previously mis-imported component descriptions stored in manufacturer field.
-- Move known non-spec descriptions into componentName and clear manufacturer.
UPDATE public.processing_plant_assets_rev_b AS a
SET components = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'manufacturer' IN (
        'Conveyor belt',
        'Head pulley Bearing',
        'Head pulley Pillow Block',
        'Tail pulley Bearings',
        'Tail pulley Pillow Block'
      )
      THEN jsonb_set(
        jsonb_set(elem, '{componentName}', to_jsonb(elem->>'manufacturer')),
        '{manufacturer}',
        'null'::jsonb
      )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(a.components::jsonb) AS elem
),
updated_at = now()
WHERE a.components IS NOT NULL
  AND a.components::text <> 'null'
  AND a.components::text <> '[]'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(a.components::jsonb) AS x
    WHERE x->>'manufacturer' IN (
      'Conveyor belt',
      'Head pulley Bearing',
      'Head pulley Pillow Block',
      'Tail pulley Bearings',
      'Tail pulley Pillow Block'
    )
  );