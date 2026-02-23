/**
 * PM-to-Asset matching logic.
 * Strict order: Exact → Keyword → Multiple → None.
 * READ ONLY on source data — results go to staging table only.
 */
import { FlatAsset } from "./flattenAssetTree";

export interface MatchResult {
  matchedAssetId: string;
  matchedAssetName: string;
  matchedAssetArea: string;
  matchedAssetParent: string;
  assetMatchKey: string;
  matchConfidence: "Exact" | "Keyword" | "Multiple" | "None";
  validationStatus: "Pending" | "Confirmed" | "Manual Review Required";
}

// Common equipment tag patterns (full tag match only)
const EQUIPMENT_TAG_PATTERN = /^[A-Z]{2,6}\d{1,3}[A-Z]?$/;

function extractEquipmentTags(text: string): string[] {
  const words = text.replace(/[–—-]/g, " ").split(/\s+/);
  return words.filter((w) => EQUIPMENT_TAG_PATTERN.test(w));
}

export function matchPMToAsset(
  pmEquipmentRef: string,
  assets: FlatAsset[]
): MatchResult {
  const refNorm = pmEquipmentRef.trim().toLowerCase();
  const noResult: MatchResult = {
    matchedAssetId: "",
    matchedAssetName: "",
    matchedAssetArea: "",
    matchedAssetParent: "",
    assetMatchKey: "",
    matchConfidence: "None",
    validationStatus: "Manual Review Required",
  };

  if (!refNorm) return noResult;

  // STEP 1 — Exact Match (case-insensitive on asset name)
  const exactMatches = assets.filter(
    (a) => a.assetName.toLowerCase() === refNorm
  );
  if (exactMatches.length === 1) {
    const m = exactMatches[0];
    return {
      matchedAssetId: m.assetId,
      matchedAssetName: m.assetName,
      matchedAssetArea: m.area,
      matchedAssetParent: m.parentAsset,
      assetMatchKey: m.assetId,
      matchConfidence: "Exact",
      validationStatus: "Pending",
    };
  }
  if (exactMatches.length > 1) {
    return {
      ...noResult,
      matchedAssetId: exactMatches.map((a) => a.assetId).join("; "),
      matchedAssetName: exactMatches.map((a) => a.assetName).join("; "),
      matchedAssetArea: exactMatches[0].area,
      matchedAssetParent: exactMatches[0].parentAsset,
      assetMatchKey: refNorm,
      matchConfidence: "Multiple",
      validationStatus: "Manual Review Required",
    };
  }

  // STEP 2 — Controlled Keyword Match (equipment tag only, full match)
  const tags = extractEquipmentTags(pmEquipmentRef.toUpperCase());
  if (tags.length > 0) {
    const tagMatches: FlatAsset[] = [];
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();
      for (const a of assets) {
        // Match full asset ID or asset ID starts with tag
        if (
          a.assetId.toLowerCase() === tagLower ||
          a.assetId.toLowerCase().startsWith(tagLower + "-")
        ) {
          if (!tagMatches.find((t) => t.assetId === a.assetId)) {
            tagMatches.push(a);
          }
        }
      }
    }

    // Filter to only top-level matches (not sub-components)
    const topLevel = tagMatches.filter((a) => {
      const parts = a.assetId.split("-");
      return parts.length <= 1 || tags.some((t) => a.assetId.toUpperCase() === t);
    });

    const best = topLevel.length > 0 ? topLevel : tagMatches;

    if (best.length === 1) {
      const m = best[0];
      return {
        matchedAssetId: m.assetId,
        matchedAssetName: m.assetName,
        matchedAssetArea: m.area,
        matchedAssetParent: m.parentAsset,
        assetMatchKey: tags.join(", "),
        matchConfidence: "Keyword",
        validationStatus: "Pending",
      };
    }
    if (best.length > 1) {
      return {
        matchedAssetId: best.map((a) => a.assetId).join("; "),
        matchedAssetName: best.map((a) => a.assetName).join("; "),
        matchedAssetArea: best[0].area,
        matchedAssetParent: best[0].parentAsset,
        assetMatchKey: tags.join(", "),
        matchConfidence: "Multiple",
        validationStatus: "Manual Review Required",
      };
    }
  }

  // STEP 4 — No Match
  return noResult;
}
