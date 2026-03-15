-- Record the agitator renaming as a locked change in site_config
INSERT INTO site_config (config_key, config_value, description)
VALUES (
  'agitator_rename_lock',
  '{
    "locked": true,
    "locked_at": "2026-03-15T20:35:00Z",
    "change_summary": "Shortened all 3-part agitator asset numbers to 2-part format (Level 6 independent equipment)",
    "changes": [
      {"old": "CN01-MXT01-AGT01", "new": "CN01-AGT01", "name": "Cyanide Mixing Tank Agitator"},
      {"old": "LCH01-TK01-AGT01", "new": "LCH01-AGT01", "name": "Leach Tank 1 Agitator"},
      {"old": "LCH01-TK02-AGT01", "new": "LCH01-AGT02", "name": "Leach Tank 2 Agitator"},
      {"old": "CIP01-TK03-AGT01", "new": "CIP01-AGT01", "name": "CIP Tank 1 Agitator"},
      {"old": "CIP01-TK04-AGT01", "new": "CIP01-AGT02", "name": "CIP Tank 2 Agitator"},
      {"old": "CIP01-TK05-AGT01", "new": "CIP01-AGT03", "name": "CIP Tank 3 Agitator"},
      {"old": "CIP01-TK06-AGT01", "new": "CIP01-AGT04", "name": "CIP Tank 4 Agitator"},
      {"old": "CIP01-TK07-AGT01", "new": "CIP01-AGT05", "name": "CIP Tank 5 Agitator"},
      {"old": "CIP01-TK08-AGT01", "new": "CIP01-AGT06", "name": "CIP Tank 6 Agitator"}
    ]
  }'::jsonb,
  'Hard-locked record of agitator asset number shortening. 3-part codes reduced to 2-part (System-AGTnn) since agitators are Level 6 independent equipment.'
)
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value, updated_at = now();