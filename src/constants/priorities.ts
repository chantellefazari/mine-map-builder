export const PRIORITIES = [
  { value: "P1 - Critical", label: "P1 – Critical", timeframe: "Within 24 hours", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "P2 - High", label: "P2 – High", timeframe: "Within the week", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { value: "P3 - Medium", label: "P3 – Medium", timeframe: "Within 2 weeks", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "P4 - Low", label: "P4 – Low", timeframe: "Within 3 weeks", color: "bg-green-100 text-green-700 border-green-300" },
  { value: "P5 - Shutdown", label: "P5 – Shutdown", timeframe: "Next shutdown window", color: "bg-purple-100 text-purple-700 border-purple-300" },
  { value: "P6 - Engineering", label: "P6 – Engineering", timeframe: "Engineering schedule", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { value: "P7 - Projects", label: "P7 – Projects", timeframe: "Project schedule", color: "bg-slate-100 text-slate-700 border-slate-300" },
] as const;

export const PRIORITY_VALUES = PRIORITIES.map((p) => p.value);

export function getPriorityColor(priority: string): string {
  const p = priority?.toLowerCase() || "";
  if (p.includes("critical") || p === "p1") return "bg-red-100 text-red-700 border-red-300";
  if (p.includes("high") || p === "p2") return "bg-orange-100 text-orange-700 border-orange-300";
  if (p.includes("medium") || p === "p3") return "bg-amber-100 text-amber-700 border-amber-300";
  if (p.includes("low") || p === "p4") return "bg-green-100 text-green-700 border-green-300";
  if (p.includes("shutdown") || p === "p5") return "bg-purple-100 text-purple-700 border-purple-300";
  if (p.includes("engineering") || p === "p6") return "bg-blue-100 text-blue-700 border-blue-300";
  if (p.includes("project") || p === "p7") return "bg-slate-100 text-slate-700 border-slate-300";
  // Legacy fallbacks
  if (p === "urgent" || p === "emergency") return "bg-red-100 text-red-700 border-red-300";
  return "bg-muted text-muted-foreground border-border";
}

/** Work Request priorities (subset) */
export const WR_PRIORITIES = PRIORITIES.filter((p) =>
  ["P1 - Critical", "P2 - High", "P3 - Medium", "P4 - Low"].includes(p.value)
);

/** Work Order priorities (all 7) */
export const WO_PRIORITIES = PRIORITIES;
