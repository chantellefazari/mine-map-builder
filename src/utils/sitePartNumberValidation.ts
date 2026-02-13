/**
 * Site Part Number Validation & Utilities
 *
 * Format: SSCCNNN (7 digits, numeric only)
 *   SS  = Site code (currently "10" for Tennant Creek)
 *   CC  = Category code (01–23)
 *   NNN = Sequential identifier (001–999)
 *
 * Total capacity: 999 slots per category
 */

/** Valid site codes */
const VALID_SITE_CODES = ["10"] as const;

/** Valid category codes (01–23) */
const VALID_CATEGORY_CODES = Array.from({ length: 23 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

/** Full regex: 2-digit site + 2-digit category + 3-digit sequential */
const SSCCNNN_REGEX = /^(\d{2})(\d{2})(\d{3})$/;

export interface PartNumberValidation {
  valid: boolean;
  siteCode: string | null;
  categoryCode: string | null;
  sequenceId: string | null;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a site part number against the SSCCNNN standard.
 *
 * @param partNumber - The part number string to validate
 * @returns Detailed validation result
 */
export function validateSitePartNumber(
  partNumber: string
): PartNumberValidation {
  const result: PartNumberValidation = {
    valid: false,
    siteCode: null,
    categoryCode: null,
    sequenceId: null,
    errors: [],
    warnings: [],
  };

  if (!partNumber || typeof partNumber !== "string") {
    result.errors.push("Part number is empty or not a string");
    return result;
  }

  const trimmed = partNumber.trim();

  // Accept both legacy 6-char and new 7-digit formats for backwards compatibility
  if (trimmed.length !== 7 && trimmed.length !== 6) {
    result.errors.push(
      `Part number must be 7 digits (got ${trimmed.length})`
    );
    return result;
  }

  // Try 7-digit format first
  const match7 = trimmed.match(SSCCNNN_REGEX);
  if (match7) {
    const [, site, category, sequence] = match7;
    result.siteCode = site;
    result.categoryCode = category;
    result.sequenceId = sequence;

    if (!(VALID_SITE_CODES as readonly string[]).includes(site)) {
      result.errors.push(
        `Invalid site code "${site}". Valid codes: ${VALID_SITE_CODES.join(", ")}`
      );
    }

    if (!VALID_CATEGORY_CODES.includes(category)) {
      result.errors.push(
        `Invalid category code "${category}". Valid range: 01–${VALID_CATEGORY_CODES[VALID_CATEGORY_CODES.length - 1]}`
      );
    }

    if (sequence === "000") {
      result.errors.push('Sequential number "000" is not valid. Range starts at 001');
    }

    result.valid = result.errors.length === 0;
    return result;
  }

  // Fallback: legacy 6-char format (SSCCXX)
  const LEGACY_REGEX = /^(\d{2})(\d{2})([0-9]{2}|[A-Z][0-9])$/;
  const match6 = trimmed.toUpperCase().match(LEGACY_REGEX);
  if (match6) {
    const [, site, category, sequence] = match6;
    result.siteCode = site;
    result.categoryCode = category;
    result.sequenceId = sequence;
    result.warnings.push("Legacy 6-character format detected. New parts should use 7-digit SSCCNNN format.");
    result.valid = true;
    return result;
  }

  result.errors.push(
    "Part number does not match SSCCNNN format (e.g. 1003001)"
  );
  return result;
}

/**
 * Quick boolean check — does this string look like a valid part number?
 */
export function isValidSitePartNumber(partNumber: string): boolean {
  return validateSitePartNumber(partNumber).valid;
}

/**
 * Get the category name for a given category code.
 */
const CATEGORY_NAMES: Record<string, string> = {
  "01": "Pumps",
  "02": "Motors",
  "03": "Gearboxes / Reducers",
  "04": "Bearings",
  "05": "Valves",
  "06": "Instrumentation",
  "07": "Electrical Components",
  "08": "Conveying Components",
  "09": "Wear Parts",
  "10": "Structural & Mechanical",
  "11": "Hoses & Pipework",
  "12": "Seals & Gaskets",
  "13": "Filters",
  "14": "Lubrication System Components",
  "15": "Air & Pneumatic Components",
  "16": "Tanks & Vessels",
  "17": "Safety Equipment",
  "18": "Power Generation & Distribution",
  "19": "Tools & Workshop Equipment",
  "20": "OEM Assemblies / Packages",
  "21": "Fasteners",
  "22": "Consumables",
  "23": "Unknown / To Be Confirmed",
};

export function getCategoryName(code: string): string | null {
  return CATEGORY_NAMES[code] ?? null;
}

/**
 * Parse a valid part number into its human-readable components.
 *
 * @returns null if the part number is invalid
 */
export function parseSitePartNumber(partNumber: string) {
  const v = validateSitePartNumber(partNumber);
  if (!v.siteCode || !v.categoryCode || !v.sequenceId) return null;

  return {
    siteCode: v.siteCode,
    siteName: v.siteCode === "10" ? "Tennant Creek" : `Site ${v.siteCode}`,
    categoryCode: v.categoryCode,
    categoryName: getCategoryName(v.categoryCode) ?? "Unknown",
    sequenceId: v.sequenceId,
    formatted: `${v.siteCode}${v.categoryCode}${v.sequenceId}`,
  };
}
