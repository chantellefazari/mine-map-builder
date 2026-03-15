-- Shorten agitator asset numbers from 3-part to 2-part format
-- Agitators are Level 6 independent equipment and don't need the tank reference in their code

UPDATE processing_plant_assets_rev_b SET asset_number = 'CN01-AGT01' WHERE id = '8bf9fe64-d631-477d-b649-6c92e83fbbf4';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LCH01-AGT01' WHERE id = 'f4ee25d0-2cd2-44f3-8d5c-13068c1a2a84';
UPDATE processing_plant_assets_rev_b SET asset_number = 'LCH01-AGT02' WHERE id = '06908200-09d0-4d2d-adba-568fdee1f494';
UPDATE processing_plant_assets_rev_b SET asset_number = 'CIP01-AGT01' WHERE id = '5fe1615f-05d4-4590-81a3-33d9c10debee';
UPDATE processing_plant_assets_rev_b SET asset_number = 'CIP01-AGT02' WHERE id = 'e761c653-7afb-4d7f-842c-e741cfe65c09';
UPDATE processing_plant_assets_rev_b SET asset_number = 'CIP01-AGT03' WHERE id = '56148715-e622-4f66-a8da-2c900eacedb4';
UPDATE processing_plant_assets_rev_b SET asset_number = 'CIP01-AGT04' WHERE id = 'af94255c-da8a-45d3-9eb4-2ff67fec1639';
UPDATE processing_plant_assets_rev_b SET asset_number = 'CIP01-AGT05' WHERE id = '32891cf4-8697-4fc3-9964-407b0c2c6182';
UPDATE processing_plant_assets_rev_b SET asset_number = 'CIP01-AGT06' WHERE id = 'e029ec4c-cb89-41ed-bf7e-1260f10f822d';