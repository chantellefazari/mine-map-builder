/**
 * PM-to-Asset matching logic.
 * Order: Manual Map → Exact → Substring → Tag → None.
 * READ ONLY on source data — results go to staging table only.
 *
 * IMPORTANT: The SITE_EQUIPMENT_MAP only contains verified 1:1 mappings
 * where the PM equipment_type unambiguously maps to a single asset number
 * in the asset tree. If unsure, leave it out — it will show as "None".
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

/**
 * VERIFIED site-specific mapping: PM equipment_type → asset number.
 * Only entries where the mapping is certain from assetData.ts / crushingPlantData.ts.
 */
const SITE_EQUIPMENT_MAP: Record<string, string> = {
  // ── Verified from assetData.ts ──
  "ball mill": "BM01",                    // "Primary Ball Mill"
  "filter press": "FP01",                 // "Filter Press"
  "filter press motor": "FP01-MTR01",     // "Filter Press – HPU Motor"
  "thickener": "THK01",                   // "Tails Thickener"
  "admin generator": "GEN-ADM01",         // "Admin Generator (50kVA)"
  "lab generator": "GEN-LAB01",           // "Lab Generator (30kVA)"
  "juno generator": "GEN-JUNO01",         // "Juno Bore Generator (200kVA)"
  "potable water": "PWT01",               // "Potable Water Tank"
  "milling area motor": "BM01-MTR01",     // "Primary Ball Mill – Main Motor"
  "process water pond motor": "UTL-PW-PMP-D", // "Process Water Pump (Duty)"
  "electrowinning cell": "EWCL01",        // "Electrowinning Cell"
};

const NO_RESULT: MatchResult = {
  matchedAssetId: "",
  matchedAssetName: "",
  matchedAssetArea: "",
  matchedAssetParent: "",
  assetMatchKey: "",
  matchConfidence: "None",
  validationStatus: "Manual Review Required",
};

// Equipment tag patterns (e.g., FP01, BM01, GEN01)
const EQUIPMENT_TAG_PATTERN = /^[A-Z]{2,6}\d{1,3}[A-Z]?$/;

function extractEquipmentTags(text: string): string[] {
  const words = text.replace(/[–—-]/g, " ").split(/\s+/);
  return words.filter((w) => EQUIPMENT_TAG_PATTERN.test(w));
}

function buildResult(asset: FlatAsset, key: string, confidence: MatchResult["matchConfidence"]): MatchResult {
  return {
    matchedAssetId: asset.assetId,
    matchedAssetName: asset.assetName,
    matchedAssetArea: asset.area,
    matchedAssetParent: asset.parentAsset,
    assetMatchKey: key,
    matchConfidence: confidence,
    validationStatus: "Pending",
  };
}

export function matchPMToAsset(
  pmEquipmentRef: string,
  assets: FlatAsset[]
): MatchResult {
  const refNorm = pmEquipmentRef.trim().toLowerCase();
  if (!refNorm) return { ...NO_RESULT };

  // ── STEP 1: Verified site-specific map (only 100% certain mappings) ──
  const mappedId = SITE_EQUIPMENT_MAP[refNorm];
  if (mappedId) {
    const matched = assets.find((a) => a.assetId === mappedId);
    if (matched) {
      return buildResult(matched, `map:${mappedId}`, "Exact");
    }
  }

  // ── STEP 2: Exact name match ──
  const exactMatches = assets.filter(
    (a) => a.assetName.toLowerCase() === refNorm
  );
  if (exactMatches.length === 1) {
    return buildResult(exactMatches[0], exactMatches[0].assetId, "Exact");
  }

  // ── STEP 3: Equipment tag pattern ──
  const tags = extractEquipmentTags(pmEquipmentRef.toUpperCase());
  if (tags.length > 0) {
    const tagMatches: FlatAsset[] = [];
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();
      for (const a of assets) {
        if (a.assetId.toLowerCase() === tagLower) {
          if (!tagMatches.find((t) => t.assetId === a.assetId)) {
            tagMatches.push(a);
          }
        }
      }
    }

    if (tagMatches.length === 1) {
      return buildResult(tagMatches[0], tags.join(", "), "Keyword");
    }
  }

  // ── STEP 4: No match — don't guess ──
  return { ...NO_RESULT };
}
