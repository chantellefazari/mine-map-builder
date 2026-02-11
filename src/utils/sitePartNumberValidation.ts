/**
 * Site Part Number Validation & Utilities
 *
 * Format: SSCCXX
 *   SS = Site code (currently "10" for Tennant Creek)
 *   CC = Category code (01–23)
 *   XX = Sequential identifier:
 *        - Numeric: 01–99
 *        - Alpha-numeric: A0–Z9 (letters I, O, Q excluded)
 *
 * Total capacity: 329 slots/category (conservative, excluding I/O/Q)
 *                 359 slots/category (if all 26 letters used)
 */

/** Valid site codes */
const VALID_SITE_CODES = ["10"] as const;

/** Valid category codes (01–23) */
const VALID_CATEGORY_CODES = Array.from({ length: 23 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

/** Letters excluded from alpha-numeric range to avoid misreads */
const EXCLUDED_LETTERS = new Set(["I", "O", "Q"]);

/** Full regex: 2-digit site + 2-digit category + (2-digit numeric OR uppercase-letter + digit) */
const SSCCXX_REGEX = /^(\d{2})(\d{2})([0-9]{2}|[A-Z][0-9])$/;

export interface PartNumberValidation {
  valid: boolean;
  siteCode: string | null;
  categoryCode: string | null;
  sequenceId: string | null;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a site part number against the SSCCXX standard.
 *
 * @param partNumber - The part number string to validate
 * @param strict - If true, rejects excluded letters (I, O, Q). Default: true
 * @returns Detailed validation result
 */
export function validateSitePartNumber(
  partNumber: string,
  strict = true
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

  const trimmed = partNumber.trim().toUpperCase();

  if (trimmed.length !== 6) {
    result.errors.push(
      `Part number must be exactly 6 characters (got ${trimmed.length})`
    );
    return result;
  }

  const match = trimmed.match(SSCCXX_REGEX);
  if (!match) {
    result.errors.push(
      "Part number does not match SSCCXX format (e.g. 100301 or 1001A3)"
    );
    return result;
  }

  const [, site, category, sequence] = match;
  result.siteCode = site;
  result.categoryCode = category;
  result.sequenceId = sequence;

  // Validate site code
  if (!(VALID_SITE_CODES as readonly string[]).includes(site)) {
    result.errors.push(
      `Invalid site code "${site}". Valid codes: ${VALID_SITE_CODES.join(", ")}`
    );
  }

  // Validate category code
  if (!VALID_CATEGORY_CODES.includes(category)) {
    result.errors.push(
      `Invalid category code "${category}". Valid range: 01–${VALID_CATEGORY_CODES[VALID_CATEGORY_CODES.length - 1]}`
    );
  }

  // Validate sequence — numeric 00 is not valid
  if (/^\d{2}$/.test(sequence) && sequence === "00") {
    result.errors.push('Sequential number "00" is not valid. Range starts at 01');
  }

  // Check excluded letters (strict mode)
  if (/^[A-Z]/.test(sequence)) {
    const letter = sequence[0];
    if (EXCLUDED_LETTERS.has(letter)) {
      const msg = `Letter "${letter}" is excluded to avoid misreads`;
      if (strict) {
        result.errors.push(msg);
      } else {
        result.warnings.push(msg);
      }
    }
  }

  result.valid = result.errors.length === 0;
  return result;
}

/**
 * Quick boolean check — does this string look like a valid SSCCXX part number?
 */
export function isValidSitePartNumber(
  partNumber: string,
  strict = true
): boolean {
  return validateSitePartNumber(partNumber, strict).valid;
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
  const v = validateSitePartNumber(partNumber, false);
  if (!v.siteCode || !v.categoryCode || !v.sequenceId) return null;

  return {
    siteCode: v.siteCode,
    siteName: v.siteCode === "10" ? "Tennant Creek" : `Site ${v.siteCode}`,
    categoryCode: v.categoryCode,
    categoryName: getCategoryName(v.categoryCode) ?? "Unknown",
    sequenceId: v.sequenceId,
    isAlphaNumeric: /^[A-Z]/.test(v.sequenceId),
    formatted: `${v.siteCode}${v.categoryCode}${v.sequenceId}`,
  };
}
