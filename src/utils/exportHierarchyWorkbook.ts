import * as XLSX from "xlsx";
import { areasData } from "@/components/hierarchy/assetData";
import { pidTagMappings } from "@/components/hierarchy/pidTagMappings";

/**
 * Exports a workbook with one row per hierarchy node, with explicit level columns.
 * This format allows any platform to reconstruct the full 7-level tree.
 *
 * Level 1: Site (TCMG)
 * Level 2: Facility (Processing Plant)
 * Level 3: Major Area (SITE, UTL, COM, REC, TAIL, SUP)
 * Level 4: Sub-Area
 * Level 5: Parent Asset / System
 * Level 6: Equipment
 * Level 7: Component
 */

const buildPidTagLookup = () => {
  const lookup = new Map<string, string[]>();
  pidTagMappings.forEach((m) => {
    const existing = lookup.get(m.assetNumber) || [];
    existing.push(m.pidTag);
    lookup.set(m.assetNumber, existing);
  });
  return lookup;
};

export function exportHierarchyWorkbook() {
  const wb = XLSX.utils.book_new();
  const pidTagsByAsset = buildPidTagLookup();

  const headers = [
    "Level",
    "Level 1 — Site",
    "Level 2 — Facility",
    "Level 3 — Major Area",
    "Level 4 — Sub-Area",
    "Level 5 — System / Parent Asset",
    "Level 6 — Equipment (Asset Number)",
    "Level 6 — Equipment Name",
    "Level 7 — Component Code",
    "Level 7 — Component Type",
    "Level 7 — Component Name",
    "Level 7 — Manufacturer",
    "P&ID Tags",
  ];

  const rows: (string | number)[][] = [headers];

  const SITE = "TCMG";
  const FACILITY = "Processing Plant";

  // Row for Level 1
  rows.push([1, SITE, "", "", "", "", "", "", "", "", "", "", ""]);

  // Row for Level 2
  rows.push([2, SITE, FACILITY, "", "", "", "", "", "", "", "", "", ""]);

  areasData.forEach((area) => {
    // Row for Level 3 — Major Area
    rows.push([3, SITE, FACILITY, `${area.code} — ${area.label}`, "", "", "", "", "", "", "", "", ""]);

    area.subAreas.forEach((sub) => {
      // Row for Level 4 — Sub-Area
      rows.push([4, SITE, FACILITY, `${area.code} — ${area.label}`, sub.label, "", "", "", "", "", "", "", ""]);

      sub.parentAssets.forEach((parent) => {
        // Row for Level 5 — Parent Asset / System
        rows.push([5, SITE, FACILITY, `${area.code} — ${area.label}`, sub.label, parent.label, "", "", "", "", "", "", ""]);

        parent.equipment.forEach((equip) => {
          const inlineTags = equip.pidTags || [];
          const mappedTags = pidTagsByAsset.get(equip.assetNumber) || [];
          const allTags = [...new Set([...inlineTags, ...mappedTags])];

          // Row for Level 6 — Equipment
          rows.push([
            6,
            SITE,
            FACILITY,
            `${area.code} — ${area.label}`,
            sub.label,
            parent.label,
            equip.assetNumber,
            equip.name,
            "",
            "",
            "",
            "",
            allTags.join("; "),
          ]);

          // Rows for Level 7 — Components
          equip.components?.forEach((comp) => {
            rows.push([
              7,
              SITE,
              FACILITY,
              `${area.code} — ${area.label}`,
              sub.label,
              parent.label,
              equip.assetNumber,
              equip.name,
              comp.componentCode,
              comp.componentType,
              comp.componentName,
              comp.manufacturer,
              "",
            ]);
          });
        });
      });
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths for readability
  ws["!cols"] = [
    { wch: 6 },   // Level
    { wch: 12 },  // Site
    { wch: 18 },  // Facility
    { wch: 25 },  // Major Area
    { wch: 28 },  // Sub-Area
    { wch: 32 },  // Parent Asset
    { wch: 18 },  // Asset Number
    { wch: 35 },  // Equipment Name
    { wch: 16 },  // Component Code
    { wch: 18 },  // Component Type
    { wch: 30 },  // Component Name
    { wch: 20 },  // Manufacturer
    { wch: 25 },  // P&ID Tags
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Processing Plant Hierarchy");

  XLSX.writeFile(wb, "TCMG_Processing_Plant_Hierarchy.xlsx");
}
