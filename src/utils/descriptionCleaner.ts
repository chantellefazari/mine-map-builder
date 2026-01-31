/**
 * Description Cleaner Utility
 * Strips irrelevant information from PO line item descriptions
 * to extract only the essential component identification data
 */

// Patterns to remove from descriptions (case-insensitive)
const REMOVAL_PATTERNS: RegExp[] = [
  // Lead times
  /\b\d+[-\s]*(day|week|wk|month|mth)s?\s*(lead\s*time|l\/?t|delivery|del)?\b/gi,
  /\blead\s*time\s*[:=]?\s*\d+\s*(day|week|wk|month|mth)s?\b/gi,
  /\bl\/?t\s*[:=]?\s*\d+\s*(day|week|wk|month|mth)?s?\b/gi,
  /\bdelivery\s*[:=]?\s*\d+\s*(day|week|wk|month|mth)s?\b/gi,
  /\b(ex[-\s]*stock|in[-\s]*stock|available|avail\.?)\b/gi,
  
  // Pricing notes (we already capture price separately)
  /\bunit\s*price\s*[:=]?\s*\$?[\d,]+\.?\d*\b/gi,
  /\beach\s*[:=@]?\s*\$?[\d,]+\.?\d*\b/gi,
  /\bper\s*unit\s*[:=]?\s*\$?[\d,]+\.?\d*\b/gi,
  /\b\$[\d,]+\.?\d*\s*(ea|each|per|unit)?\b/gi,
  
  // Quantity notes (we capture qty separately)
  /\bqty\s*[:=]?\s*\d+\b/gi,
  /\bquantity\s*[:=]?\s*\d+\b/gi,
  /\bmin\s*(order|qty|quantity)\s*[:=]?\s*\d+\b/gi,
  /\bmoq\s*[:=]?\s*\d+\b/gi,
  
  // Freight/shipping references
  /\b(freight|shipping|postage)\s*(included|incl\.?|extra|excl\.?)?\b/gi,
  /\bfob\b/gi,
  /\bcif\b/gi,
  /\bexw\b/gi,
  
  // Order/quote references (we capture PO# separately)
  /\bquote\s*#?\s*[:=]?\s*[\w-]+\b/gi,
  /\bref\s*#?\s*[:=]?\s*[\w-]+\b/gi,
  /\border\s*#?\s*[:=]?\s*[\w-]+\b/gi,
  /\binquiry\s*#?\s*[:=]?\s*[\w-]+\b/gi,
  /\benquiry\s*#?\s*[:=]?\s*[\w-]+\b/gi,
  
  // Validity dates
  /\bvalid\s*(until|till|to)\s*\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b/gi,
  /\bexpir(es?|y)\s*[:=]?\s*\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b/gi,
  /\bprice\s*valid\s*\d+\s*(day|week|month)s?\b/gi,
  
  // Supplier internal codes/notes
  /\binternal\s*(code|ref|reference)\s*[:=]?\s*[\w-]+\b/gi,
  /\bstock\s*(code|#|no\.?|number)\s*[:=]?\s*[\w-]+\b/gi,
  /\bitem\s*(code|#|no\.?|number)\s*[:=]?\s*[\w-]+\b/gi,
  
  // Warranty info
  /\b\d+\s*(year|yr|month|mth)s?\s*warranty\b/gi,
  /\bwarranty\s*[:=]?\s*\d+\s*(year|yr|month|mth)s?\b/gi,
  
  // Misc noise
  /\b(note|notes|n\.b\.?|nb)\s*[:=]?\s*/gi,
  /\bsee\s*attached\b/gi,
  /\bplease\s*(note|advise|confirm)\b/gi,
  /\bsubject\s*to\s*(availability|confirmation)\b/gi,
  /\btbc\b/gi,
  /\btba\b/gi,
  /\bn\/?a\b/gi,
  /\bnot\s*applicable\b/gi,
  
  // Trailing/leading punctuation after cleanup
  /^[\s,;:\-\|\/]+/,
  /[\s,;:\-\|\/]+$/,
];

// Additional noise words that can be removed when they appear alone or as filler
const NOISE_PHRASES = [
  "as per sample",
  "as per quote",
  "as per order",
  "as discussed",
  "as requested",
  "urgent",
  "asap",
  "priority",
  "rush order",
  "standard",
  "genuine",
  "original",
  "oem",
  "aftermarket",
  "replacement",
  "new",
  "brand new",
  "unused",
];

/**
 * Clean a description by removing irrelevant information
 * @param description - The raw description from PO line item
 * @returns Cleaned description with only essential component info
 */
export const cleanDescription = (description: string): string => {
  if (!description) return "";
  
  let cleaned = description;
  
  // Apply removal patterns
  for (const pattern of REMOVAL_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ");
  }
  
  // Remove noise phrases (case-insensitive, whole word match)
  for (const phrase of NOISE_PHRASES) {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    cleaned = cleaned.replace(regex, " ");
  }
  
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  // Remove orphaned punctuation
  cleaned = cleaned.replace(/^[\s,;:\-\|\/\(\)\[\]]+/, "");
  cleaned = cleaned.replace(/[\s,;:\-\|\/\(\)\[\]]+$/, "");
  
  // Collapse multiple spaces again
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  return cleaned;
};

/**
 * Extract potential part numbers from description
 * @param description - The raw or cleaned description
 * @returns Array of potential part number strings found
 */
export const extractPartNumbers = (description: string): string[] => {
  if (!description) return [];
  
  const patterns = [
    // Common part number patterns
    /\b[A-Z]{2,4}[-\s]?\d{4,}[-\s]?[A-Z0-9]*\b/gi,  // ABC-12345 or ABC12345-XY
    /\b\d{3,}[-\s]?[A-Z]{2,}[-\s]?\d*\b/gi,         // 12345-ABC or 12345ABC
    /\b[A-Z]\d{5,}\b/gi,                              // A123456
    /\b\d{5,}[A-Z]\b/gi,                              // 123456A
    /\bP\/N\s*[:=]?\s*[\w\-]+\b/gi,                  // P/N: ABC123
    /\bPART\s*#?\s*[:=]?\s*[\w\-]+\b/gi,            // Part# ABC123
  ];
  
  const found: Set<string> = new Set();
  
  for (const pattern of patterns) {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach(m => {
        // Clean up the match
        const cleaned = m.replace(/^(P\/N|PART\s*#?)\s*[:=]?\s*/i, "").trim();
        if (cleaned.length >= 4) {
          found.add(cleaned.toUpperCase());
        }
      });
    }
  }
  
  return Array.from(found);
};

/**
 * Check if a description line is likely just noise/metadata
 * @param description - The description to check
 * @returns True if the line appears to be non-component data
 */
export const isNoiseRow = (description: string): boolean => {
  if (!description) return true;
  
  const cleaned = cleanDescription(description);
  
  // Too short after cleaning
  if (cleaned.length < 5) return true;
  
  // Just numbers
  if (/^\d+$/.test(cleaned)) return true;
  
  // Common header/footer text
  const headerPatterns = [
    /^(sub)?total$/i,
    /^grand\s*total$/i,
    /^shipping$/i,
    /^freight$/i,
    /^tax$/i,
    /^gst$/i,
    /^vat$/i,
    /^discount$/i,
    /^item$/i,
    /^description$/i,
    /^qty$/i,
    /^quantity$/i,
    /^price$/i,
    /^amount$/i,
    /^unit$/i,
    /^total$/i,
    /^page\s*\d+$/i,
    /^continued$/i,
  ];
  
  for (const pattern of headerPatterns) {
    if (pattern.test(cleaned)) return true;
  }
  
  return false;
};

export default {
  cleanDescription,
  extractPartNumbers,
  isNoiseRow,
};
