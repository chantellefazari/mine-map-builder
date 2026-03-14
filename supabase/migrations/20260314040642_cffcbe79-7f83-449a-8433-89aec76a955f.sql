
-- Fix remaining false positives
UPDATE site_spares SET is_critical = false
WHERE is_critical = true
AND (
  -- Wear parts / kits (not complete assemblies)
  description ILIKE '%wear part%'
  OR description ILIKE '%kit wear%'
  OR description ILIKE '%kit pligs%'
  OR description ILIKE '%chamber stack kit%'
  OR description ILIKE '%bearing kit%'
  -- Conveyor rollers (MEDIUM)
  OR description ILIKE '%conveyor roller%'
  OR description ILIKE '%conveyor ring roller%'
  OR description ILIKE '%centre roller%'
  OR description ILIKE '%spiral roller%'
  OR description ILIKE '%steel conveyor roller%'
  -- PVC tubing (consumable)
  OR description ILIKE '%pvc flexing tubing%'
  OR description ILIKE '%pvc tubing%'
  -- Hose tails / fittings (not complete hoses)
  OR description ILIKE '%hose tail%'
  -- Crusher Part (generic, not complete crusher)
  OR description = 'Crusher Part'
  -- Fan blades (parts, not assemblies)
  OR description ILIKE '%blade blower fan%'
);
