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

export async function exportProcessingPlantCSV() {
  // Fetch all rows – paginate to avoid the 1000-row default limit
  let allRows: DBAssetRow[] = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("processing_plant_assets_rev_b")
      .select("id, area_code, area_label, sub_area, parent_asset_label, asset_number, asset_name, pid_tags, components, functional_location, sort_order")
      .order("sort_order", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(`Failed to fetch assets: ${error.message}`);
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data as DBAssetRow[]);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  // Build the tree structure (same logic as the UI)
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
    "Level 7 - Manufacturer",
    "Level 7 - Model",
    "Level 7 - Serial Number",
    "Level 7 - P&ID Tags",
    "Level 7 - Oil Type",
    "Level 7 - Oil Volume",
    "Level 7 - Input Speed",
    "Level 7 - Output Speed",
    "Level 7 - Weight",
    "Level 7 - Motor Speed",
    "Level 7 - Protection",
    "Level 7 - Voltage",
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

  const csvContent = csvLines.join("\n");
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
