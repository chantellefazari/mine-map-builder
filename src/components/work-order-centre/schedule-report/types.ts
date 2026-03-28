import { WorkOrder } from "@/hooks/useWorkOrders";

export const HRS_PER_PERSON = 10.5;

export const DISCIPLINES = [
  { key: "Mechanical", target: 80, accent: "#2563eb", light: "#eff6ff", dark: "#1e3a5f", band: "#dbeafe" },
  { key: "Electrical", target: 90, accent: "#f97316", light: "#fff8f1", dark: "#9a3412", band: "#fed7aa" },
] as const;

export type Discipline = typeof DISCIPLINES[number];

export interface DayData {
  dayKey: string;
  day: Date;
  wos: WorkOrder[];
  hrs: number;
  avail: number;
  personnel: number;
  loadPct: number;
}

export interface DiscData {
  key: string;
  target: number;
  accent: string;
  light: string;
  dark: string;
  band: string;
  byDay: DayData[];
  totalHrs: number;
  totalAvail: number;
  loadPct: number;
  totalJobs: number;
  pmCount: number;
  cmCount: number;
  reactiveCount: number;
  capacityStatus: string;
}

export interface QualityCheck {
  label: string;
  status: "green" | "amber" | "red";
  detail: string;
}

export interface UnscheduledWO {
  wo: WorkOrder;
  reason: string;
  action: string;
}

export function getWoHours(wo: WorkOrder): number {
  if (wo.labour_hours && Array.isArray(wo.labour_hours)) {
    return wo.labour_hours.reduce((h: number, l: any) => h + (Number(l.hours) || 0), 0);
  }
  return 2;
}

export function matchesDiscipline(wo: WorkOrder, key: string): boolean {
  const trade = wo.trade?.toLowerCase() || "";
  if (key === "Mechanical") return trade === "mechanical" || trade === "";
  if (key === "Electrical") return trade === "electrical";
  return false;
}

export function priorityLabel(p: string): string {
  for (let i = 1; i <= 7; i++) {
    if (p?.startsWith(`P${i}`)) return `P${i}`;
  }
  return p || "P3";
}

export function getCapacityStatus(loadPct: number, target: number): string {
  if (loadPct < target * 0.6) return "Underloaded";
  if (loadPct <= target) return "Balanced";
  if (loadPct <= 100) return "Near Capacity";
  return "Overloaded";
}

export function getCapacityColor(status: string): string {
  switch (status) {
    case "Underloaded": return "#d97706";
    case "Balanced": return "#16a34a";
    case "Near Capacity": return "#ea580c";
    case "Overloaded": return "#dc2626";
    default: return "#666";
  }
}

export function getDayLoadLabel(loadPct: number, target: number): { label: string; color: string } {
  if (loadPct === 0) return { label: "No Work", color: "#9ca3af" };
  if (loadPct < target * 0.6) return { label: "Underloaded", color: "#d97706" };
  if (loadPct <= target) return { label: "Balanced", color: "#16a34a" };
  if (loadPct <= 100) return { label: "Near Capacity", color: "#ea580c" };
  return { label: "Overloaded", color: "#dc2626" };
}

export const S: Record<string, React.CSSProperties> = {
  th: { padding: "5px 8px", fontSize: 9, fontWeight: 700, borderBottom: "1px solid #d1d5db", textAlign: "left" as const, whiteSpace: "nowrap" as const },
  td: { padding: "4px 8px", fontSize: 9, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" as const },
  badge: { display: "inline-block", padding: "1px 5px", borderRadius: 3, fontSize: 8, fontWeight: 600 },
  sectionTitle: { fontSize: 12, fontWeight: 800, color: "#1a1a1a", letterSpacing: 0.5, textTransform: "uppercase" as const, marginBottom: 10, paddingBottom: 4, borderBottom: "2px solid #C8960C" },
};
