
-- Clear model field where it just duplicates the componentName (not real specs)
UPDATE processing_plant_assets_rev_b
SET components = (
  SELECT jsonb_agg(
    CASE
      WHEN lower(trim(elem->>'model')) = lower(trim(elem->>'componentName'))
        THEN elem - 'model'
      WHEN elem->>'model' IS NOT NULL 
        AND length(elem->>'model') > 0
        AND elem->>'model' !~ '[A-Z]{2,}[0-9]{2,}'
        AND elem->>'model' !~ 'P/N'
        AND elem->>'model' !~ '[0-9]+\s*[xX×]\s*[0-9]+'
        AND elem->>'model' !~ '[0-9]+\s*mm'
        AND elem->>'model' !~ '[0-9]+\s*NB'
        AND elem->>'model' !~ 'SEW|SIEMENS|ABB|WEG|FLENDER|SKF|NSK|FAG|WARMAN|METSO|ROPER'
        AND elem->>'model' !~ '[A-Z]-[A-Z]{2,}-[A-Z]'
        AND length(elem->>'model') < 30
        THEN elem || '{"model": null}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(components::jsonb) AS elem
)
WHERE components IS NOT NULL
  AND jsonb_array_length(components::jsonb) > 0;
