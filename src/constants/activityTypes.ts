// Australian mining standard activity type codes
// Classifies WHAT maintenance work is being done (separate from WO Type which is HOW it was triggered)

export const ACTIVITY_TYPES = [
  { code: "RPR", label: "Repair" },
  { code: "RPL", label: "Replace" },
  { code: "INS", label: "Inspect" },
  { code: "NEW", label: "New Install" },
  { code: "MON", label: "Monitor" },
] as const;

export type ActivityTypeCode = typeof ACTIVITY_TYPES[number]["code"];

// Maps Work Request "work_type" values to activity codes
const WR_TO_ACTIVITY: Record<string, ActivityTypeCode> = {
  "Repair": "RPR",
  "Replace": "RPL",
  "Inspect": "INS",
  "New Install": "NEW",
  "Monitor": "MON",
};

export function workTypeToActivityCode(workType: string | undefined | null): ActivityTypeCode | "" {
  if (!workType) return "";
  return WR_TO_ACTIVITY[workType] || "";
}

export function getActivityLabel(code: string): string {
  return ACTIVITY_TYPES.find((a) => a.code === code)?.label || code || "-";
}
