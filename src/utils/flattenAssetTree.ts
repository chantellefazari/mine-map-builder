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

  // Add major areas as selectable items
  for (const area of areasData) {
    assets.push({
      assetId: area.code,
      assetName: area.label,
      area: area.label,
      subArea: "",
      parentAsset: "",
    });
  }

  // Add CRU as a major area
  assets.push({
    assetId: "CRU",
    assetName: "Crushing Plant",
    area: "Crushing Plant",
    subArea: "",
    parentAsset: "",
  });

  // Processing plant areas – parent assets + equipment
  for (const area of areasData) {
    for (const subArea of area.subAreas) {
      for (const parent of subArea.parentAssets) {
        // Add the parent asset (system) as a searchable entry
        assets.push({
          assetId: parent.label.split(" ")[0] || parent.label,
          assetName: parent.label,
          area: area.label,
          subArea: subArea.label,
          parentAsset: "",
        });
        for (const eq of parent.equipment) {
          assets.push({
            assetId: eq.assetNumber,
            assetName: eq.name,
            area: area.label,
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
          area: `Crushing Plant`,
          subArea: cruArea.label,
          parentAsset: parent.label,
        });
      }
    }
  }

  return assets;
}
