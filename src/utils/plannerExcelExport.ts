/**
 * Full multi-tab XLSX export for the Maintenance Planner.
 * Exports all planner views into a single workbook.
 */
import { loadXLSX, writeXlsxFile, primeDownloadGesture, cancelPrimedDownloadGesture } from "@/utils/safariDownload";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { PlannerItem } from "@/components/work-order-centre/advanced-planner/AdvancedPlannerView";

/* ── helpers ── */
function aoa(XLSX: any, data: any[][], name: string, wb: any, colWidths?: number[]) {
  const ws = XLSX.utils.aoa_to_sheet(data);
  if (colWidths) ws["!cols"] = colWidths.map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, name);
}

function safeStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join("; ");
  return String(v);
}

/* ── Sheet builders ── */

function buildMaintenancePlansSheet(items: PlannerItem[]) {
  const pmItems = items.filter(i => i.source === "pm");
  const headers = [
    "PM Name", "Asset Number", "Asset Name", "Area", "Sub Area",
    "Discipline", "Frequency", "Est Hours", "Duty Type", "Status",
    "Plan Category", "Priority", "Safety Notes", "Required Tools",
  ];
  const rows = pmItems.map(i => [
    i.taskName, i.assetNumber, i.assetName, i.area, i.subArea,
    i.discipline, i.frequency, i.estimatedHours, i.dutyType, i.status,
    i.planCategory, i.priority, safeStr(i.safetyNotes), safeStr(i.requiredTools),
  ]);
  return [headers, ...rows];
}

function buildWorkOrdersSheet(items: PlannerItem[]) {
  const woItems = items.filter(i => i.source === "wo");
  const headers = [
    "WO Number", "WO Type", "Asset Number", "Area", "Sub Area",
    "Task Name", "Discipline", "Est Hours", "Priority", "Status",
    "Assigned To", "Scheduled Date", "Activity Type", "Materials",
  ];
  const rows = woItems.map(i => [
    i.woNumber, i.woType, i.assetNumber, i.area, i.subArea,
    i.taskName, i.discipline, i.estimatedHours, i.priority, i.status,
    i.assignedTo, i.scheduledDate || "", i.activityType, safeStr(i.materialList),
  ]);
  return [headers, ...rows];
}

function buildForwardPlanSheet(items: PlannerItem[]) {
  const headers = [
    "Task Name", "WO Number", "WO Type", "Asset Number", "Area",
    "Frequency", "Est Hours", "Discipline", "Priority", "Status",
    "Duty Type", "Scheduled Date", "Plan Category",
  ];
  const rows = items.map(i => [
    i.taskName, i.woNumber, i.woType, i.assetNumber, i.area,
    i.frequency, i.estimatedHours, i.discipline, i.priority, i.status,
    i.dutyType, i.scheduledDate || "", i.planCategory,
  ]);
  return [headers, ...rows];
}

function buildForecastSheet(items: PlannerItem[]) {
  const headers = [
    "Task Name", "WO Type", "Asset Number", "Area", "Discipline",
    "Frequency", "Est Hours", "Status", "Scheduled Date",
  ];
  const rows = items.map(i => [
    i.taskName, i.woType, i.assetNumber, i.area, i.discipline,
    i.frequency, i.estimatedHours, i.status, i.scheduledDate || "",
  ]);
  return [headers, ...rows];
}

function buildCapacitySheet(capacityData: any[]) {
  const headers = [
    "Week", "Start Date", "Work Centre", "Headcount", "Daily Hours",
    "Available Hours", "Planned Hours", "Loading %",
  ];
  return [headers, ...capacityData];
}

function buildResourceLevelingSheet(items: PlannerItem[]) {
  const headers = [
    "Task Name", "WO Number", "WO Type", "Asset Number", "Area",
    "Discipline", "Frequency", "Est Hours", "Priority", "Status",
    "Duty Type", "Scheduled Date",
  ];
  const rows = items.map(i => [
    i.taskName, i.woNumber, i.woType, i.assetNumber, i.area,
    i.discipline, i.frequency, i.estimatedHours, i.priority, i.status,
    i.dutyType, i.scheduledDate || "",
  ]);
  return [headers, ...rows];
}

function buildAssetTreeSheet(items: PlannerItem[]) {
  const headers = [
    "Asset Number", "Asset Name", "Area", "Sub Area", "Discipline",
    "WO Count", "Total Est Hours", "PM Count",
  ];
  // Group by asset
  const assetMap = new Map<string, { name: string; area: string; sub: string; disc: string; woCount: number; hrs: number; pmCount: number }>();
  for (const i of items) {
    const key = i.assetNumber || "Unassigned";
    const existing = assetMap.get(key);
    if (existing) {
      existing.woCount += i.source === "wo" ? 1 : 0;
      existing.pmCount += i.source === "pm" ? 1 : 0;
      existing.hrs += i.estimatedHours;
    } else {
      assetMap.set(key, {
        name: i.assetName, area: i.area, sub: i.subArea, disc: i.discipline,
        woCount: i.source === "wo" ? 1 : 0, hrs: i.estimatedHours, pmCount: i.source === "pm" ? 1 : 0,
      });
    }
  }
  const rows = [...assetMap.entries()].map(([num, d]) => [
    num, d.name, d.area, d.sub, d.disc, d.woCount, d.hrs, d.pmCount,
  ]);
  return [headers, ...rows];
}

function buildRoundsSheet(items: PlannerItem[]) {
  const roundItems = items.filter(i =>
    i.frequency && ["daily", "weekly", "2 weekly", "shift"].some(f =>
      i.frequency.toLowerCase().includes(f)
    )
  );
  const headers = [
    "Task Name", "Asset Number", "Area", "Frequency", "Discipline",
    "Est Hours", "Status", "Duty Type",
  ];
  const rows = roundItems.map(i => [
    i.taskName, i.assetNumber, i.area, i.frequency, i.discipline,
    i.estimatedHours, i.status, i.dutyType,
  ]);
  return [headers, ...rows];
}

function buildSummarySheet(items: PlannerItem[]) {
  const pmCount = items.filter(i => i.source === "pm").length;
  const woCount = items.filter(i => i.source === "wo").length;
  const totalHrs = items.reduce((s, i) => s + i.estimatedHours, 0);
  const areas = new Set(items.map(i => i.area)).size;
  const assets = new Set(items.map(i => i.assetNumber)).size;
  const disciplines = [...new Set(items.map(i => i.discipline).filter(Boolean))];

  return [
    ["TCMG Maintenance Planner — Export Summary"],
    [],
    ["Export Date", format(new Date(), "dd MMM yyyy HH:mm")],
    ["Total Items", items.length],
    ["PM Plans", pmCount],
    ["Active Work Orders", woCount],
    ["Total Estimated Hours", totalHrs],
    ["Areas Covered", areas],
    ["Unique Assets", assets],
    ["Disciplines", disciplines.join(", ")],
    [],
    ["Sheet Index"],
    ["Sheet Name", "Description"],
    ["Summary", "This overview sheet"],
    ["Maintenance Plans", "All PM templates and recurring plans"],
    ["Work Orders", "Active work orders with scheduling data"],
    ["Forward Plan", "90-day forward projection of all maintenance work"],
    ["Forecast", "Frequency-based workload forecast"],
    ["Capacity", "Weekly capacity by work centre (from planner)"],
    ["Resource Leveling", "Demand vs capacity analysis data"],
    ["Asset Summary", "Per-asset maintenance workload summary"],
    ["Rounds", "High-frequency operational rounds"],
  ];
}

/* ── Capacity data fetch ── */
async function fetchCapacityRows(): Promise<any[][]> {
  const { data } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "capacity_grid")
    .maybeSingle();

  if (!data?.value) return [];
  const grid = data.value as any;
  const rows: any[][] = [];

  const workCentres = ["Mechanical", "Electrical", "Mobile & LVS", "Projects"];
  for (const wc of workCentres) {
    const wcData = grid[wc];
    if (!wcData) continue;
    for (let w = 1; w <= 52; w++) {
      const weekKey = `w${w}`;
      const week = wcData[weekKey] || {};
      rows.push([
        `W${w}`, "", wc,
        week.headcount ?? 0, week.dailyHours ?? 0,
        week.availableHours ?? 0, week.plannedHours ?? 0,
        week.loading ?? 0,
      ]);
    }
  }
  return rows;
}

/* ── Main export function ── */
export async function exportPlannerWorkbook(items: PlannerItem[]): Promise<{ sheetCount: number; totalItems: number }> {
  const XLSX = await loadXLSX();
  const wb = XLSX.utils.book_new();

  // Fetch capacity data in parallel
  const capacityRows = await fetchCapacityRows();

  const defaultWidths = [30, 16, 14, 16, 16, 14, 12, 12, 12, 12, 14, 14, 14, 30];

  aoa(XLSX, buildSummarySheet(items), "Summary", wb, [40, 30]);
  aoa(XLSX, buildMaintenancePlansSheet(items), "Maintenance Plans", wb, defaultWidths);
  aoa(XLSX, buildWorkOrdersSheet(items), "Work Orders", wb, defaultWidths);
  aoa(XLSX, buildForwardPlanSheet(items), "Forward Plan", wb, defaultWidths);
  aoa(XLSX, buildForecastSheet(items), "Forecast", wb, defaultWidths);
  aoa(XLSX, buildCapacitySheet(capacityRows), "Capacity", wb, [8, 14, 18, 12, 12, 14, 14, 12]);
  aoa(XLSX, buildResourceLevelingSheet(items), "Resource Leveling", wb, defaultWidths);
  aoa(XLSX, buildAssetTreeSheet(items), "Asset Summary", wb, [18, 30, 14, 16, 14, 12, 14, 12]);
  aoa(XLSX, buildRoundsSheet(items), "Rounds", wb, defaultWidths);

  const dateStamp = format(new Date(), "yyyy-MM-dd");
  writeXlsxFile(wb, `TCMG_Maintenance_Planner_${dateStamp}.xlsx`, XLSX);

  return { sheetCount: 9, totalItems: items.length };
}
