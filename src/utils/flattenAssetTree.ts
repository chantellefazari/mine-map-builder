/**
 * Flattens the hierarchical asset tree into a flat list for matching.
 * READ ONLY — no modifications to source data.
 */
import { areasData, Area, Equipment } from "@/components/hierarchy/assetData";
import { crushingPlantAreas, CRUSubArea } from "@/components/hierarchy/crushingPlantData";

export interface FlatAsset {
  assetId: string;
  assetName: string;
  area: string;
  subArea: string;
  parentAsset: string;
}

export function flattenAssetTree(): FlatAsset[] {
  const assets: FlatAsset[] = [];

  // Processing plant areas
  for (const area of areasData) {
    for (const subArea of area.subAreas) {
      for (const parent of subArea.parentAssets) {
        for (const eq of parent.equipment) {
          assets.push({
            assetId: eq.assetNumber,
            assetName: eq.name,
            area: `${area.code} — ${area.label}`,
            subArea: subArea.label,
            parentAsset: parent.label,
          });
        }
      }
    }
  }

  // Crushing plant areas
  for (const cruArea of crushingPlantAreas) {
    for (const parent of cruArea.parentAssets) {
      for (const eq of parent.equipment) {
        assets.push({
          assetId: eq.assetNumber,
          assetName: eq.name,
          area: `CRU — Crushing Plant`,
          subArea: cruArea.label,
          parentAsset: parent.label,
        });
      }
    }
  }

  return assets;
}
