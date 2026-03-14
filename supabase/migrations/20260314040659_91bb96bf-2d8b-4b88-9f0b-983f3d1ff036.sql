
-- Final cleanup: remove false positives from is_critical
UPDATE site_spares SET is_critical = false
WHERE is_critical = true
AND (
  -- KETO/pump gaskets, O-rings, joint rings, restrictors, sleeves (parts not assemblies)
  description ILIKE '%gasket%'
  OR description ILIKE '%o-ring%'
  OR description ILIKE '%joint ring%'
  OR description ILIKE '%lantern restrictor%'
  OR description ILIKE '%shaft sleeve%'
  OR description ILIKE '%rotating element kit%'
  -- Heat shrink tubing (electrical consumable)
  OR description ILIKE '%heat shrink%'
  -- Suction filters (consumable)
  OR description ILIKE '%suction filter%'
  -- Scrapers/skirting (wear consumable)
  OR description ILIKE '%scraper%'
  OR description ILIKE '%skirting%'
  -- Pillow block housing (bearing component - MEDIUM)
  OR description ILIKE '%pillow block%'
  -- Bearing (MEDIUM)
  OR description ILIKE '%bearing%'
  -- Guide rollers (MEDIUM)
  OR description ILIKE '%guide roller%'
  -- Degassing valve (minor component)
  OR description ILIKE '%degassing valve%'
  -- Coupling pump bore (part, not assembly)
  OR (description ILIKE '%coupling pump%' AND description ILIKE '%bore%')
);
