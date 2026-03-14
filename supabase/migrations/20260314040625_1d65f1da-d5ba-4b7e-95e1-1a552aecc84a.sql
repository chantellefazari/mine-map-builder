
-- Fix false positives: set items back to not critical that were incorrectly flagged
UPDATE site_spares SET is_critical = false
WHERE is_critical = true
AND (
  -- Vee belts / transmission belts (consumables)
  description ILIKE '%vee belt%'
  OR description ILIKE '%v-belt%'
  OR description ILIKE '%transmission belt%'
  OR description ILIKE '%transmission vee belt%'
  -- Nylon tubing (fittings)
  OR description ILIKE '%nylon tubing%'
  -- Hose fittings/couplings (not complete hoses)
  OR description ILIKE '%hosetail%'
  OR description ILIKE '%hose coupling%'
  OR description ILIKE '%hose end%'
  OR description ILIKE '%hose clamp%'
  -- Compression glands (electrical consumable)
  OR description ILIKE '%compression gland%'
  OR description ILIKE '%cable gland%'
  -- Diesel transfer pumps (non-production)
  OR (description ILIKE '%diesel pump%' AND description ILIKE '%electric%')
  OR description ILIKE '%12v electric diesel pump%'
  -- Conveyor belts (MEDIUM, not HIGH)
  OR description ILIKE '%conveyor belt%'
  -- Polyurethane/rubber liners (wear consumables - MEDIUM)
  OR description ILIKE '%polyurethane%'
  OR description ILIKE '%pu liner%'
  OR description ILIKE '%weir pu%'
  OR description ILIKE '%clip on weir%'
  OR (description ILIKE '%liner%' AND description ILIKE '%cyclone%')
  OR (description ILIKE '%liner%' AND description ILIKE '%rubber%')
  OR description ILIKE '%cover plate liner%'
  OR description ILIKE '%cover liner%'
  -- Coupling adaptor parts (not drive couplings)
  OR (description ILIKE '%coupling for%' AND description ILIKE '%motor%')
);
