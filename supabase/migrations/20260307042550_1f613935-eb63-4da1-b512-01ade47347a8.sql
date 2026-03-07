
UPDATE processing_plant_assets_rev_b
SET components = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'componentName' = 'Side Guide Roller' THEN elem || '{"model": "P/N: K-ROL-SG-60x125-B"}'::jsonb
      WHEN elem->>'componentName' = 'Roller - Steel Trough' THEN elem || '{"model": "P/N: K-ROL-STR-600B25"}'::jsonb
      WHEN elem->>'componentName' = 'Roller - Steel Return' THEN elem || '{"model": "P/N: K-ROL-SRR-600B25"}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(components::jsonb) AS elem
)
WHERE asset_number = 'MFCV01'
