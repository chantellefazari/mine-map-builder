import { useMemo } from "react";
import { useWorkOrders, WorkOrder } from "./useWorkOrders";
import { usePlantIntelligence } from "./usePlantIntelligence";

export type JobStatus = "Not Started" | "In Progress" | "Blocked" | "Complete" | "At Risk";

export interface MissionJob {
  id: string;
  name: string;
  woNumber: string;
  area: string;
  status: JobStatus;
  priority: string;
  percentComplete: number;
  assignedCrew: string;
  remainingHours: number;
  blockers: string;
  dependencies: string[];
  trade: string;
}

export interface AreaSummary {
  area: string;
  totalJobs: number;
  inProgress: number;
  delayed: number;
  completed: number;
  notStarted: number;
  indicator: "green" | "amber" | "red" | "grey";
  jobs: MissionJob[];
}

const AREA_MAP: Record<string, string> = {
  "100": "Crushing",
  "200": "Grinding",
  "300": "Screening",
  "400": "Flotation",
  "500": "CIL",
  "600": "Utilities",
  "700": "Reagents",
  "800": "Tailings",
  "900": "Water",
};

function mapWoStatus(wo: WorkOrder): JobStatus {
  const s = wo.status?.toLowerCase() ?? "";
  if (s === "complete" || s === "closed") return "Complete";
  if (s === "in progress" || s === "wip") return "In Progress";
  if (s === "blocked" || s === "on hold") return "Blocked";
  if (s === "at risk") return "At Risk";
  return "Not Started";
}

function inferArea(wo: WorkOrder): string {
  const fl = wo.functional_location ?? "";
  for (const [code, area] of Object.entries(AREA_MAP)) {
    if (fl.includes(code)) return area;
  }
  const desc = `${wo.problem_description ?? ""} ${wo.asset_id ?? ""}`.toLowerCase();
  if (desc.includes("crush")) return "Crushing";
  if (desc.includes("grind") || desc.includes("mill")) return "Grinding";
  if (desc.includes("screen")) return "Screening";
  if (desc.includes("flot")) return "Flotation";
  if (desc.includes("cil") || desc.includes("leach")) return "CIL";
  if (desc.includes("tail")) return "Tailings";
  if (desc.includes("reagent")) return "Reagents";
  if (desc.includes("water") || desc.includes("pump")) return "Water";
  return "Utilities";
}

function estimatePercent(status: JobStatus): number {
  switch (status) {
    case "Complete": return 100;
    case "In Progress": return 45;
    case "At Risk": return 30;
    case "Blocked": return 20;
    default: return 0;
  }
}

function getIndicator(jobs: MissionJob[]): "green" | "amber" | "red" | "grey" {
  if (jobs.length === 0) return "grey";
  const hasBlocked = jobs.some(j => j.status === "Blocked");
  if (hasBlocked) return "red";
  const hasAtRisk = jobs.some(j => j.status === "At Risk");
  if (hasAtRisk) return "amber";
  const allComplete = jobs.every(j => j.status === "Complete");
  if (allComplete) return "green";
  const allNotStarted = jobs.every(j => j.status === "Not Started");
  if (allNotStarted) return "grey";
  return "green";
}

export function useMissionControl() {
  const { workOrders, isLoading: woLoading } = useWorkOrders();
  const { rules, isLoading: rulesLoading } = usePlantIntelligence();

  const jobs: MissionJob[] = useMemo(() => {
    return workOrders.map((wo) => {
      const status = mapWoStatus(wo);
      return {
        id: wo.id,
        name: wo.problem_description || wo.wo_number,
        woNumber: wo.wo_number,
        area: inferArea(wo),
        status,
        priority: wo.priority,
        percentComplete: estimatePercent(status),
        assignedCrew: wo.assigned_to || "Unassigned",
        remainingHours: status === "Complete" ? 0 : 4,
        blockers: status === "Blocked" ? "Pending resolution" : "",
        dependencies: [],
        trade: wo.trade || "",
      };
    });
  }, [workOrders]);

  const areas: AreaSummary[] = useMemo(() => {
    const allAreas = ["Crushing", "Grinding", "Screening", "Flotation", "CIL", "Utilities", "Reagents", "Tailings", "Water"];
    return allAreas.map((area) => {
      const areaJobs = jobs.filter(j => j.area === area);
      return {
        area,
        totalJobs: areaJobs.length,
        inProgress: areaJobs.filter(j => j.status === "In Progress").length,
        delayed: areaJobs.filter(j => j.status === "Blocked" || j.status === "At Risk").length,
        completed: areaJobs.filter(j => j.status === "Complete").length,
        notStarted: areaJobs.filter(j => j.status === "Not Started").length,
        indicator: getIndicator(areaJobs),
        jobs: areaJobs,
      };
    });
  }, [jobs]);

  const overallProgress = useMemo(() => {
    if (jobs.length === 0) return 0;
    return Math.round(jobs.reduce((s, j) => s + j.percentComplete, 0) / jobs.length);
  }, [jobs]);

  const criticalJobs = useMemo(() => {
    return jobs.filter(j => j.status === "Blocked" || j.status === "At Risk" || j.priority === "High" || j.priority === "Emergency");
  }, [jobs]);

  const constraints = useMemo(() => {
    return rules.filter(r => r.status === "Approved" && (r.rule_type === "Dependency" || r.rule_type === "Shutdown Logic" || r.rule_type === "Isolation Rule"));
  }, [rules]);

  return {
    jobs,
    areas,
    overallProgress,
    criticalJobs,
    constraints,
    isLoading: woLoading || rulesLoading,
  };
}
