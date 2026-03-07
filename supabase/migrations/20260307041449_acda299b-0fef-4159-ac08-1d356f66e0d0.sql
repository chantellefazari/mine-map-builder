-- Move components from MFCV01-BASD to MFCV01 where they belong
UPDATE public.processing_plant_assets_rev_b
SET components = (
  SELECT components FROM public.processing_plant_assets_rev_b WHERE asset_number = 'MFCV01-BASD'
)::jsonb,
updated_at = now()
WHERE asset_number = 'MFCV01';

-- Clear components from MFCV01-BASD
UPDATE public.processing_plant_assets_rev_b
SET components = '[]'::jsonb, updated_at = now()
WHERE asset_number = 'MFCV01-BASD';
