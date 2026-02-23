/**
 * PM-to-Asset matching logic.
 * Order: Manual Map → Exact → Substring → Tag → None.
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

/**
 * Site-specific mapping: PM equipment_type → primary asset number(s).
 * This is the most reliable matching method for known equipment.
 * Key = lowercase equipment_type from pm_master_list.
 * Value = asset number(s) to match against.
 */
const SITE_EQUIPMENT_MAP: Record<string, string | string[]> = {
  // Processing Plant — Milling
  "ball mill": "BM01",
  
  // Processing Plant — Filter Press
  "filter press": "FP01",
  "filter press compressor": ["HCMP03", "HCMP04"],
  "filter press motor": "FP01-MTR01",

  // Processing Plant — Thickener
  "thickener": "THK01",

  // Processing Plant — Gold Room
  "gold room": "GR-SCL-01",
  "gold room motor": "FAN02",

  // Processing Plant — Reagents
  "reagents": "REAG-MCC01",

  // Processing Plant — CIP/Recovery
  "bottom of tanks": "CIP-TK01",
  "top of tanks": "CIP-TK01",
  "ph probe": "CIP-TK01",

  // Processing Plant — Acid Wash & Elution
  "acid wash & elution": "FLT02",
  "elution motor": "FLT03",

  // Processing Plant — Diesel / Supply
  "diesel farm": "DSL01-PMP01",
  "potable water": "PWT01",
  "grease & oils": "DSL01-TK01",

  // Processing Plant — Generators
  "admin generator": "GEN-ADM01",
  "lab generator": "GEN-LAB01",
  "juno generator": "GEN-JUNO01",
  "power station generator": ["GEN01", "GEN02", "GEN03", "GEN04", "GEN05", "GEN06", "GEN07", "GEN08"],
  "andy dam generator": "GEN-JUNO01", // closest match — Juno/Andy Dam bore pump gen
  "andys dam generator": "GEN-JUNO01",
  "crusher fuel farm generator": "GEN-WRK01",
  "crusher workshop generator": "GEN-WRK01",
  "juno bore pump generator": "GEN-JUNO01",
  "portable generators": "GEN-SPR01",
  "generator": ["GEN01", "GEN02", "GEN03", "GEN04", "GEN05", "GEN06", "GEN07", "GEN08"],

  // Processing Plant — Electrical
  "field mcc": "MILL-MCC01",
  "substation inspection": "MSUB01",
  "switchboard inspection": "MDB01",
  "air conditioner": "SINF03",
  "emergency lighting": "SINF03",
  "cable": "MDB01",
  "full test sheet": "MDB01",
  "rcd": "MDB01",
  "pull wire": "MILL-MCC01",
  "safety shower": ["REAG-SHW01", "CIP-SHW01", "GR-SHW01"],
  "ice machine": "MDB01-DB01",

  // Processing Plant — Air & Water Services
  "air & water services": "COMP01-MTR01",
  "ro plant": "MSUB01-DB01",

  // Motor inspections by area
  "milling area motor": "BM01-MTR01",
  "kiln area motor": "BM01-MTR01",
  "process water pond motor": "UTL-PW-PMP-D",

  // Mobile Equipment — these are NOT in the asset tree (no fixed asset number)
  // Mark as "None" confidence by omitting from this map

  // Support — Visual Zone / Area-based PMs
  "visual zone": "SINF01",
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
    validationStatus: confidence === "Multiple" ? "Manual Review Required" : "Pending",
  };
}

function buildMultiResult(matches: FlatAsset[], key: string): MatchResult {
  return {
    matchedAssetId: matches.map((a) => a.assetId).join("; "),
    matchedAssetName: matches.map((a) => a.assetName).join("; "),
    matchedAssetArea: matches[0]?.area ?? "",
    matchedAssetParent: matches[0]?.parentAsset ?? "",
    assetMatchKey: key,
    matchConfidence: "Multiple",
    validationStatus: "Manual Review Required",
  };
}

export function matchPMToAsset(
  pmEquipmentRef: string,
  assets: FlatAsset[]
): MatchResult {
  const refNorm = pmEquipmentRef.trim().toLowerCase();
  if (!refNorm) return { ...NO_RESULT };

  // ── STEP 1: Site-specific manual map ──
  const mapped = SITE_EQUIPMENT_MAP[refNorm];
  if (mapped) {
    const ids = Array.isArray(mapped) ? mapped : [mapped];
    const matchedAssets = ids
      .map((id) => assets.find((a) => a.assetId === id))
      .filter(Boolean) as FlatAsset[];

    if (matchedAssets.length === 1) {
      return buildResult(matchedAssets[0], `map:${ids[0]}`, "Exact");
    }
    if (matchedAssets.length > 1) {
      return buildMultiResult(matchedAssets, `map:${ids.join(",")}`);
    }
    // If mapped IDs not found in assets, still record the mapping
    if (ids.length === 1) {
      return {
        matchedAssetId: ids[0],
        matchedAssetName: `(mapped: ${pmEquipmentRef})`,
        matchedAssetArea: "",
        matchedAssetParent: "",
        assetMatchKey: `map:${ids[0]}`,
        matchConfidence: "Keyword",
        validationStatus: "Pending",
      };
    }
  }

  // ── STEP 2: Exact name match ──
  const exactMatches = assets.filter(
    (a) => a.assetName.toLowerCase() === refNorm
  );
  if (exactMatches.length === 1) {
    return buildResult(exactMatches[0], exactMatches[0].assetId, "Exact");
  }
  if (exactMatches.length > 1) {
    return buildMultiResult(exactMatches, refNorm);
  }

  // ── STEP 3: Substring match (PM type contained in asset name, or vice versa) ──
  // Only match top-level assets (no sub-components like MTR01, MCC01)
  const topLevelAssets = assets.filter((a) => !a.assetId.includes("-"));
  const substringMatches = topLevelAssets.filter((a) => {
    const name = a.assetName.toLowerCase();
    return name.includes(refNorm) || refNorm.includes(name);
  });

  if (substringMatches.length === 1) {
    return buildResult(substringMatches[0], substringMatches[0].assetId, "Keyword");
  }
  if (substringMatches.length > 1) {
    return buildMultiResult(substringMatches, refNorm);
  }

  // ── STEP 4: Equipment tag pattern ──
  const tags = extractEquipmentTags(pmEquipmentRef.toUpperCase());
  if (tags.length > 0) {
    const tagMatches: FlatAsset[] = [];
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();
      for (const a of assets) {
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

    const topLevel = tagMatches.filter((a) => {
      const parts = a.assetId.split("-");
      return parts.length <= 1 || tags.some((t) => a.assetId.toUpperCase() === t);
    });

    const best = topLevel.length > 0 ? topLevel : tagMatches;

    if (best.length === 1) {
      return buildResult(best[0], tags.join(", "), "Keyword");
    }
    if (best.length > 1) {
      return buildMultiResult(best, tags.join(", "));
    }
  }

  // ── STEP 5: No match ──
  return { ...NO_RESULT };
}
