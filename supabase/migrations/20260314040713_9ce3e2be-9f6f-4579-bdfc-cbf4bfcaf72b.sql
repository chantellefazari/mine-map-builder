
UPDATE site_spares SET is_critical = false
WHERE is_critical = true
AND (
  description ILIKE '%gsket%'
  OR description ILIKE '%piston ring%'
  OR description ILIKE '%network management%'
  OR description ILIKE '%conveyor spare parts%'
  OR description ILIKE '%filter press plates%'
);
