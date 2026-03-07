
-- Move non-manufacturer descriptions out of manufacturer field into componentName
-- Keep manufacturer only for entries that look like actual manufacturer/model/part-number data
UPDATE public.processing_plant_assets_rev_b
SET components = (
  SELECT jsonb_agg(
    CASE
      -- Keep manufacturer for entries with known manufacturer patterns (brand names, P/N:, Dimensions:)
      WHEN elem->>'manufacturer' ~ '^(SEW|ABB|Siemens|WEG|Nord|Flender|P/N:|Dimensions:)'
        THEN elem
      -- Move everything else from manufacturer into componentName and clear manufacturer
      WHEN elem->>'manufacturer' IS NOT NULL AND elem->>'manufacturer' != ''
        THEN jsonb_set(
          jsonb_set(elem, '{componentName}', to_jsonb(COALESCE(elem->>'manufacturer', ''))),
          '{manufacturer}', 'null'::jsonb
        )
      ELSE elem
    END
  )
  FROM jsonb_array_elements(components::jsonb) AS elem
),
updated_at = now()
WHERE components IS NOT NULL
  AND components::text != 'null'
  AND components::text != '[]';
