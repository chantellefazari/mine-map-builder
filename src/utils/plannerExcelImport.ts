/**
 * Excel import for the Maintenance Planner.
 * Parses uploaded XLSX, validates against expected schema, 
 * and returns structured change sets for review before commit.
 */
import { loadXLSX } from "@/utils/safariDownload";

export interface ImportChangeSet {
  sheet: string;
  totalRows: number;
  newRows: number;
  modifiedRows: number;
  skippedRows: number;
  errors: string[];
  rows: Record<string, unknown>[];
}

export interface PlannerImportResult {
  sheets: ImportChangeSet[];
  totalChanges: number;
  hasErrors: boolean;
}

const EXPECTED_SHEETS: Record<string, string[]> = {
  "Maintenance Plans": [
    "PM Name", "Asset Number", "Asset Name", "Area", "Sub Area",
    "Discipline", "Frequency", "Est Hours", "Duty Type", "Status",
    "Plan Category", "Priority",
  ],
  "Work Orders": [
    "WO Number", "WO Type", "Asset Number", "Area", "Sub Area",
    "Task Name", "Discipline", "Est Hours", "Priority", "Status",
    "Assigned To", "Scheduled Date", "Activity Type",
  ],
  "Forward Plan": [
    "Task Name", "WO Number", "WO Type", "Asset Number",
  ],
  "Capacity": [
    "Week", "Work Centre", "Headcount", "Daily Hours",
  ],
};

function normalizeHeader(h: string): string {
  return h?.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "";
}

function matchHeaders(actual: string[], expected: string[]): boolean {
  const normalActual = actual.map(normalizeHeader);
  return expected.every(e => normalActual.includes(normalizeHeader(e)));
}

export async function parsePlannerExcel(file: File): Promise<PlannerImportResult> {
  const XLSX = await loadXLSX();
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });

  const sheets: ImportChangeSet[] = [];
  let totalChanges = 0;
  let hasErrors = false;

  for (const sheetName of wb.SheetNames) {
    // Skip summary sheet
    if (sheetName.toLowerCase() === "summary") continue;

    const ws = wb.Sheets[sheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
    if (!data || data.length < 2) continue;

    const headers = (data[0] as string[]).map(h => h?.toString().trim() || "");
    const dataRows = data.slice(1).filter((row: any[]) => row.some(cell => cell !== null && cell !== undefined && cell !== ""));

    // Validate against expected schema if we have one
    const expectedKey = Object.keys(EXPECTED_SHEETS).find(k => k.toLowerCase() === sheetName.toLowerCase());
    const errors: string[] = [];
    
    if (expectedKey && !matchHeaders(headers, EXPECTED_SHEETS[expectedKey])) {
      errors.push(`Header mismatch: expected columns [${EXPECTED_SHEETS[expectedKey].join(", ")}]`);
      hasErrors = true;
    }

    // Convert rows to objects
    const rows = dataRows.map((row: any[]) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((h, idx) => {
        if (h) obj[h] = row[idx] ?? null;
      });
      return obj;
    });

    const changeSet: ImportChangeSet = {
      sheet: sheetName,
      totalRows: rows.length,
      newRows: 0,
      modifiedRows: rows.length, // All treated as potential updates
      skippedRows: 0,
      errors,
      rows,
    };

    totalChanges += rows.length;
    sheets.push(changeSet);
  }

  return { sheets, totalChanges, hasErrors };
}
