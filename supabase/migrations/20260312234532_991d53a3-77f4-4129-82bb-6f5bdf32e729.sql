UPDATE processing_plant_assets_rev_b
SET components = '[
  {"componentCode":"","componentName":"Gear Box Replacement unit","componentType":"Gear Reducer","manufacturer":null,"model":"JKD 4504150638.01.001 / H1 SH 15 B"},
  {"componentCode":"","componentName":"Coupling motor side (high speed)","componentType":"Coupling","manufacturer":null,"model":"Rupex RWN 450 Coupling"},
  {"componentCode":"","componentName":"Coupling pinion side (lowspeed)","componentType":"Coupling","manufacturer":null,"model":"Zapex ZWN 415 Coupling"}
]'::jsonb
WHERE asset_number = 'BM01-GBX01'