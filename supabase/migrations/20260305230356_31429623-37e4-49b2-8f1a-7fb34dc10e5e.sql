
-- Remove 56 Component Fill assets that are fabricated process equipment from Excel
-- with no P&ID backing. Infrastructure (buildings, generators, MCCs, vehicles) is preserved.
-- P&ID-verified assets and their valid components are preserved.

DELETE FROM processing_plant_assets_rev_b
WHERE change_type = 'Component Fill'
AND (
  -- Standalone orphaned process equipment (no P&ID tags exist)
  asset_number IN ('GSMP01', 'BLCH01', 'CT-CHU04', 'FPAR05', 'FPAR06', 'FPCMP01', 'FPCV03', 'FPCV04')
  -- Grinding Sump Pump components
  OR asset_number LIKE 'GSMP01-%'
  -- Second Knelson Hoist (HST01 is P&ID, HST02 is Excel fabrication)
  OR asset_number LIKE 'KNC01-HST02%'
  -- FP01 standalone header + all sub-equipment not on P&IDs
  OR asset_number = 'FP01'
  OR asset_number LIKE 'FP01-AGT%'
  OR asset_number LIKE 'FP01-CV02%'
  OR asset_number LIKE 'FP01-HPP%'
  OR asset_number LIKE 'FP01-HPU%'
  OR asset_number LIKE 'FP01-INST%'
  OR asset_number LIKE 'FP01-PIP%'
  OR asset_number LIKE 'FP01-PLC%'
  OR asset_number LIKE 'FP01-PNL%'
  OR asset_number LIKE 'FP01-TK%'
  -- FP02 Component Fill sub-equipment not on P&IDs (FP02 itself is P&ID "New")
  OR asset_number LIKE 'FP02-AGT%'
  OR asset_number LIKE 'FP02-CV02%'
  OR asset_number LIKE 'FP02-HPP%'
  OR asset_number LIKE 'FP02-HPU%'
  OR asset_number LIKE 'FP02-INST%'
  OR asset_number LIKE 'FP02-PIP%'
  OR asset_number LIKE 'FP02-PLC%'
  OR asset_number LIKE 'FP02-PNL%'
  OR asset_number LIKE 'FP02-TK%'
);
