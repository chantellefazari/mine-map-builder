/**
 * Exports the Processing Plant asset hierarchy as a comprehensive CSV
 * pulling live data from the database (Rev B).
 * 
 * Includes all 7 hierarchy levels, functional locations, P&ID tags,
 * and component-level engineering specifications.
 */
import { fetchAllProcessingPlantRows } from "@/utils/fetchProcessingPlantData";
import { buildAreasFromRows } from "@/hooks/useProcessingPlantAssets";

function escapeCSV(value: string): string {
  if (!value) return "";
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rowToCSV(row: string[]): string {
  return row.map(escapeCSV).join(",");
}

/**
 * Generates CSV content string from live database data.
 * Used by both the CSV download and the PDF export.
 */
export async function generateProcessingPlantCSVContent(): Promise<string> {
  const allRows = await fetchAllProcessingPlantRows();
  const areas = buildAreasFromRows(allRows);

  const SITE = "TCMG";
  const FACILITY = "Processing Plant";

  const headers = [
    "Level",
    "Level 1 - Site",
    "Level 2 - Facility",
    "Level 3 - Area Code",
    "Level 3 - Area Name",
    "Level 4 - Sub-Area",
    "Level 5 - System / Parent Asset",
    "Level 5 - Functional Location",
    "Level 6 - Asset Number",
    "Level 6 - Equipment Name",
    "Level 6 - Functional Location",
    "Level 6 - P&ID Tags",
    "Level 7 - Component Code",
    "Level 7 - Component Type",
    "Level 7 - Component Name",
    "Level 7 - Model",
    "Level 7 - Manufacturer",
    "Level 7 - Serial Number",
    "Level 7 - P&ID Tags",
    "Level 7 - Motor Speed",
    "Level 7 - Voltage",
    "Level 7 - Protection",
    "Level 7 - Oil Type",
    "Level 7 - Oil Volume",
    "Level 7 - Input Speed",
    "Level 7 - Output Speed",
    "Level 7 - Weight",
    "Level 7 - Pump Flow",
    "Level 7 - Operating Pressure",
    "Level 7 - Displacement",
    "Level 7 - Motor Ref",
    "Level 7 - Pump Ref",
  ];

  const csvLines: string[] = [rowToCSV(headers)];

  // Level 1 row
  csvLines.push(rowToCSV(["1", SITE, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]));

  // Level 2 row
  csvLines.push(rowToCSV(["2", SITE, FACILITY, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]));

  for (const area of areas) {
    // Level 3 — Area
    csvLines.push(rowToCSV(["3", SITE, FACILITY, area.code, area.label, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]));

    for (const sub of area.subAreas) {
      // Level 4 — Sub-Area
      csvLines.push(rowToCSV(["4", SITE, FACILITY, area.code, area.label, sub.label, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]));

      for (const pa of sub.parentAssets) {
        // Level 5 — Parent Asset / System
        csvLines.push(rowToCSV(["5", SITE, FACILITY, area.code, area.label, sub.label, pa.label, pa.functionalLocation || "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]));

        for (const equip of pa.equipment) {
          const equipTags = equip.pidTags?.join("; ") || "";

          // Level 6 — Equipment
          csvLines.push(rowToCSV([
            "6", SITE, FACILITY, area.code, area.label, sub.label, pa.label, pa.functionalLocation || "",
            equip.assetNumber, equip.name, equip.functionalLocation || "", equipTags,
            "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
          ]));

          // Level 7 — Components
          if (equip.components) {
            for (const comp of equip.components) {
              const compTags = comp.pidTags?.join("; ") || "";
              csvLines.push(rowToCSV([
                "7", SITE, FACILITY, area.code, area.label, sub.label, pa.label, pa.functionalLocation || "",
                equip.assetNumber, equip.name, equip.functionalLocation || "", "",
                comp.componentCode, comp.componentType, comp.componentName, comp.manufacturer,
                comp.model || "", comp.serialNumber || "", compTags,
                comp.oilType || "", comp.oilVolume || "", comp.inputSpeed || "", comp.outputSpeed || "",
                comp.weight || "", comp.motorSpeed || "", comp.protection || "", comp.voltage || "",
                comp.pumpFlow || "", comp.operatingPressure || "", comp.displacement || "",
                comp.motorRef || "", comp.pumpRef || "",
              ]));
            }
          }
        }
      }
    }
  }

  return csvLines.join("\n");
}

export async function exportProcessingPlantCSV() {
  const csvContent = await generateProcessingPlantCSVContent();
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "TCMG_Processing_Plant_Hierarchy.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
