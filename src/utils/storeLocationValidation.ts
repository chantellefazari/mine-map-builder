/**
 * Store Location Code Validation
 *
 * Format: [Container]-[Discipline]-[Bay][Bin]
 * Example: C01-EL-A3
 *
 * Rules:
 * - Container: C01–C05
 * - Discipline must match container: C01=EL, C02=IN, C03=ME, C04=LU, C05=FA
 * - Bay: A–H (skip I), J–K for rear wall
 * - Bin: 1–99
 * - No duplicate location codes allowed
 *
 * External storage prefixes:
 * - DM = Dome Storage (e.g. DM-A1)
 * - LD = Laydown Yard (e.g. LD-B3)
 */

/** Container → Discipline mapping (single source of truth) */
export const CONTAINER_DISCIPLINE_MAP: Record<string, string> = {
  C01: "EL",
  C02: "IN",
  C03: "ME",
  C04: "LU",
  C05: "FA",
};

/** All valid container IDs */
export const VALID_CONTAINERS = ["C01", "C02", "C03", "C04", "C05"] as const;

/** All valid discipline codes */
export const VALID_DISCIPLINES = ["EL", "IN", "ME", "LU", "FA"] as const;

/** Valid bay letters: A–H (skip I), J–K for rear */
export const VALID_BAYS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"] as const;

/** Bay layout mapping */
export const BAY_LAYOUT = {
  leftWall: ["A", "B", "C", "D"],
  rightWall: ["E", "F", "G", "H"],
  rearWall: ["J", "K"],
} as const;

/** External storage prefix — all external locations use LD */
export const EXTERNAL_PREFIXES = {
  LD: "Laydown & Dome Storage",
} as const;

/** External bay assignments */
export const EXTERNAL_BAY_LAYOUT = {
  domeRows: ["A", "B"] as const,
  yardBays: ["C", "D", "E", "F"] as const,
} as const;

/** All valid external bay letters */
export const VALID_EXTERNAL_BAYS = ["A", "B", "C", "D", "E", "F"] as const;

export type ExternalBayLetter = typeof VALID_EXTERNAL_BAYS[number];

export type ContainerId = typeof VALID_CONTAINERS[number];
export type DisciplineCode = typeof VALID_DISCIPLINES[number];
export type BayLetter = typeof VALID_BAYS[number];

export interface LocationCodeParts {
  container: ContainerId;
  discipline: DisciplineCode;
  bay: BayLetter;
  bin: number;
}

export interface ExternalLocationParts {
  prefix: "LD";
  bay: ExternalBayLetter;
  bin: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  parsed?: LocationCodeParts | ExternalLocationParts;
  isExternal?: boolean;
}

/** Regex for container location: C0X-XX-A1 through C0X-XX-K99 */
const CONTAINER_REGEX = /^(C0[1-5])-([A-Z]{2})-([A-HJ-K])(\d{1,2})$/;

/** Regex for external location: DM-A1 or LD-B3 */
const EXTERNAL_REGEX = /^LD-([A-F])(\d{1,2})$/;

/**
 * Validate a store location code against the standard.
 */
export function validateLocationCode(code: string): ValidationResult {
  if (!code || typeof code !== "string") {
    return { valid: false, error: "Location code is required" };
  }

  const trimmed = code.trim().toUpperCase();

  // Check external location first (LD-A1 through LD-F99)
  const extMatch = trimmed.match(EXTERNAL_REGEX);
  if (extMatch) {
    const [, bay, binStr] = extMatch;
    const bin = parseInt(binStr, 10);
    if (bin < 1 || bin > 99) {
      return { valid: false, error: "Position number must be between 1 and 99" };
    }
    return {
      valid: true,
      isExternal: true,
      parsed: {
        prefix: "LD" as const,
        bay: bay as ExternalBayLetter,
        bin,
      },
    };
  }

  // Check container location
  const match = trimmed.match(CONTAINER_REGEX);
  if (!match) {
    return {
      valid: false,
      error: "Invalid format. Expected: C0X-XX-A1 (e.g. C01-EL-A3) or LD-A1 (e.g. LD-B3)",
    };
  }

  const [, container, discipline, bay, binStr] = match;
  const bin = parseInt(binStr, 10);

  // Validate bin range
  if (bin < 1 || bin > 99) {
    return { valid: false, error: "Bin number must be between 1 and 99" };
  }

  // Validate discipline matches container
  const expectedDiscipline = CONTAINER_DISCIPLINE_MAP[container];
  if (discipline !== expectedDiscipline) {
    return {
      valid: false,
      error: `Discipline "${discipline}" does not match container ${container}. Expected "${expectedDiscipline}"`,
    };
  }

  return {
    valid: true,
    isExternal: false,
    parsed: {
      container: container as ContainerId,
      discipline: discipline as DisciplineCode,
      bay: bay as BayLetter,
      bin,
    },
  };
}

/**
 * Check for duplicate location codes in a set.
 */
export function findDuplicateLocations(codes: string[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const code of codes) {
    const normalized = code.trim().toUpperCase();
    if (seen.has(normalized)) {
      duplicates.push(normalized);
    }
    seen.add(normalized);
  }
  return duplicates;
}

/**
 * Format a location code from parts.
 */
export function formatLocationCode(parts: LocationCodeParts): string {
  return `${parts.container}-${parts.discipline}-${parts.bay}${parts.bin}`;
}

/**
 * Format an external location code.
 */
export function formatExternalLocation(parts: ExternalLocationParts): string {
  return `${parts.prefix}-${parts.bay}${parts.bin}`;
}

/**
 * Get the wall position for a bay letter.
 */
export function getBayWall(bay: string): "Left Wall" | "Right Wall" | "Rear Wall" | "Unknown" {
  if (BAY_LAYOUT.leftWall.includes(bay as any)) return "Left Wall";
  if (BAY_LAYOUT.rightWall.includes(bay as any)) return "Right Wall";
  if (BAY_LAYOUT.rearWall.includes(bay as any)) return "Rear Wall";
  return "Unknown";
}
