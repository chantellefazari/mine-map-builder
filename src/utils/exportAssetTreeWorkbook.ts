import * as XLSX from "xlsx";
import { writeXlsxFile } from "@/utils/safariDownload";
import { areasData } from "@/components/hierarchy/assetData";
import { crushingPlantAreas } from "@/components/hierarchy/crushingPlantData";
import { pidTagMappings } from "@/components/hierarchy/pidTagMappings";
import { functionalLocations } from "@/components/hierarchy/functionalLocations";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "@/components/hierarchy/namingConventionData";

const buildPidTagLookup = () => {
  const lookup = new Map<string, string[]>();
  pidTagMappings.forEach((m) => {
    const existing = lookup.get(m.assetNumber) || [];
    existing.push(m.pidTag);
    lookup.set(m.assetNumber, existing);
  });
  return lookup;
};

export function exportAssetTreeWorkbook() {
  const wb = XLSX.utils.book_new();
  const pidTagsByAsset = buildPidTagLookup();
  const getAllPidTags = (assetNumber: string, inlineTags?: string[]) => {
    const mapped = pidTagsByAsset.get(assetNumber) || [];
    return [...new Set([...(inlineTags || []), ...mapped])];
  };

  // Sheet 1: Asset Tree Register
  const treeRows: string[][] = [
    ["Site", "Facility", "Area Code", "Area", "Sub-Area", "Parent Asset", "Asset Number", "Equipment Name", "Component Code", "Component Type", "Component Name", "Manufacturer", "P&ID Tags"],
  ];

  // Processing Plant rows
  areasData.forEach((area) => {
    area.subAreas.forEach((sub) => {
      sub.parentAssets.forEach((parent) => {
        parent.equipment.forEach((equip) => {
          const tags = getAllPidTags(equip.assetNumber, equip.pidTags);
          treeRows.push(["TCMG", "Processing Plant", area.code, area.label, sub.label, parent.label, equip.assetNumber, equip.name, "", "", "", "", tags.join("; ")]);
          equip.components?.forEach((comp) => {
            treeRows.push(["TCMG", "Processing Plant", area.code, area.label, sub.label, parent.label, equip.assetNumber, equip.name, comp.componentCode, comp.componentType, comp.componentName, comp.manufacturer, ""]);
          });
        });
      });
    });
  });

  // Crushing Plant rows
  crushingPlantAreas.forEach((cruArea) => {
    cruArea.parentAssets.forEach((parent) => {
      parent.equipment.forEach((equip) => {
        treeRows.push(["TCMG", "Crushing Plant", cruArea.areaCode, cruArea.label, cruArea.label, parent.label, equip.assetNumber, equip.name, "", "", "", "", ""]);
        equip.components?.forEach((comp) => {
          treeRows.push(["TCMG", "Crushing Plant", cruArea.areaCode, cruArea.label, cruArea.label, parent.label, equip.assetNumber, equip.name, comp.componentCode, comp.componentType, comp.componentName, comp.manufacturer, ""]);
        });
      });
    });
  });

  const ws1 = XLSX.utils.aoa_to_sheet(treeRows);
  XLSX.utils.book_append_sheet(wb, ws1, "Asset Tree Register");


  // Sheet 2: Functional Locations
  const flRows: string[][] = [
    ["Functional Location Code", "Area", "Sub Area", "System Name"],
  ];
  functionalLocations.forEach((fl) => {
    flRows.push([fl.code, fl.area, fl.subArea, fl.systemName]);
  });
  const ws2 = XLSX.utils.aoa_to_sheet(flRows);
  XLSX.utils.book_append_sheet(wb, ws2, "Functional Locations");

  // Sheet 3: Naming Convention
  const ncRows: string[][] = [];
  ncRows.push(["=== Area Codes (Level 3) ==="]);
  ncRows.push(["Code", "Meaning", "Description"]);
  areaCodes.forEach((a) => ncRows.push([a.code, a.meaning, a.description]));
  ncRows.push([]);
  ncRows.push(["=== Equipment Type Prefixes ==="]);
  ncRows.push(["Prefix", "Meaning", "Example", "Category"]);
  equipmentPrefixes.forEach((e) => ncRows.push([e.prefix, e.meaning, e.example, e.category]));
  ncRows.push([]);
  ncRows.push(["=== Component Suffixes ==="]);
  ncRows.push(["Suffix", "Meaning", "Example", "Category"]);
  componentSuffixes.forEach((c) => ncRows.push([c.suffix, c.meaning, c.example, c.category]));
  ncRows.push([]);
  ncRows.push(["=== Instrumentation Suffixes ==="]);
  ncRows.push(["Suffix", "Meaning", "Example", "Category"]);
  instrumentationSuffixes.forEach((i) => ncRows.push([i.suffix, i.meaning, i.example, i.category]));
  ncRows.push([]);
  ncRows.push(["=== Special Naming Patterns ==="]);
  ncRows.push(["Pattern", "Meaning", "Example"]);
  specialPatterns.forEach((p) => ncRows.push([p.pattern, p.meaning, p.example]));
  const ws3 = XLSX.utils.aoa_to_sheet(ncRows);
  XLSX.utils.book_append_sheet(wb, ws3, "Naming Convention");

  writeXlsxFile(wb, "TCMG_Asset_Tree_Workbook.xlsx");
}
