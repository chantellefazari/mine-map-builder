export const PRIORITIES = [
  { value: "P1 - Critical", label: "P1 – Critical", timeframe: "Within 24 hours" },
  { value: "P2 - High", label: "P2 – High", timeframe: "Within the week" },
  { value: "P3 - Medium", label: "P3 – Medium", timeframe: "Within 2 weeks" },
  { value: "P4 - Low", label: "P4 – Low", timeframe: "Within 3 weeks" },
  { value: "P5 - Shutdown", label: "P5 – Shutdown", timeframe: "Next shutdown window" },
  { value: "P6 - Engineering", label: "P6 – Engineering", timeframe: "Engineering schedule" },
  { value: "P7 - Projects", label: "P7 – Projects", timeframe: "Project schedule" },
] as const;

export const PRIORITY_VALUES = PRIORITIES.map((p) => p.value);

export function getPriorityColor(_priority: string): string {
  return "";
}

/** Work Request priorities (subset) */
export const WR_PRIORITIES = PRIORITIES.filter((p) =>
  ["P1 - Critical", "P2 - High", "P3 - Medium", "P4 - Low"].includes(p.value)
);

/** Work Order priorities (all 7) */
export const WO_PRIORITIES = PRIORITIES;
