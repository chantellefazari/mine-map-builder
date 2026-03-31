import { writeXlsxFile, loadXLSX } from "@/utils/safariDownload";
import { fetchProcessingPlantAreas } from "@/utils/fetchProcessingPlantData";
import { crushingPlantAreas } from "@/components/hierarchy/crushingPlantData";
import { functionalLocations } from "@/components/hierarchy/functionalLocations";
import { cruFunctionalLocations } from "@/components/hierarchy/crushingFunctionalLocations";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "@/components/hierarchy/namingConventionData";
import { supabase } from "@/integrations/supabase/client";

async function fetchAllRows(table: string, select: string, orderCol = "created_at") {
  let all: any[] = [];
  let from = 0;
  const size = 1000;
  while (true) {
    const { data, error } = await (supabase as any)
      .from(table)
      .select(select)
      .order(orderCol, { ascending: true })
      .range(from, from + size - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < size) break;
    from += size;
  }
  return all;
}

export async function exportDeliverableWorkbook() {
  const XLSX = await loadXLSX();
  const wb = XLSX.utils.book_new();

  // Fetch all data in parallel
  const [areasData, criticality, spares, pmTemplates, dbFLs] = await Promise.all([
    fetchProcessingPlantAreas(),
    fetchAllRows("asset_criticality_ratings", "asset_number,asset_name,area_label,sub_area,criticality,justification,assessed_by,assessed_at"),
    fetchAllRows("site_spares", "part_number,description,category,subcategory,manufacturer,oem_part_number,alternate_part_number,preferred_supplier,warehouse_area,aisle,rack,bin_location,storage_type,qty_on_hand,min_qty,max_qty,reorder_point,unit_cost,uom,lead_time_days,last_purchase_date,condition,status,is_critical,critical_spare_id,asset_tag,specifications,notes"),
    fetchAllRows("pm_master_list", "pm_name,discipline,equipment_type,frequency,duty_type,skill_level,estimated_duration,resources,purpose,asset_number,status"),
    fetchAllRows("processing_functional_locations", "fl_code,area,sub_area,system_name,area_code", "fl_code"),
  ]);

  // ── Sheet 0: Document Register ──
  const docRows: string[][] = [
    ["Document Title", "Reference No", "Status", "Description", "Platform Access"],
    ["Asset Register & Hierarchy", "TCMG-REG-AH-001", "Complete", "Full asset tree with components, P&ID tags, and functional locations", "Y"],
    ["Asset Criticality Assessment", "TCMG-REG-CRIT-001", "Complete", "ABC criticality ratings with justifications for all major equipment", "Y"],
    ["Critical Spares Register", "TCMG-REG-CS-001", "Complete", "Filtered list of high-criticality spare parts", "Y"],
    ["Site Spares Catalogue (Complete)", "TCMG-REG-SP-001", "Complete", "Full inventory of all site spare parts with stock codes", "Y"],
    ["PM Template Library", "TCMG-REG-PM-001", "Complete", `${pmTemplates.length} preventive maintenance templates across all disciplines`, "Y"],
    ["Naming Convention Standard", "TCMG-STD-NAM-001", "Complete", "Equipment prefixes, component suffixes, area codes", "Y"],
    ["Functional Location Register", "TCMG-REG-FL-001", "Complete", "CMMS functional location hierarchy mapping", "Y"],
    ["Lifecycle & Condition Data", "TCMG-REG-LC-001", "Pending", "Install dates, condition scores, run hours — data gaps identified", "Y"],
    ["Stock Code Standard", "TCMG-STD-SPN-001", "Complete", "7-digit numeric stock code allocation standard (SSCCNNN)", "Y"],
    ["Asset Hierarchy Standard", "TCMG-STD-AH-001", "Complete", "6-level hierarchy naming and structure standard", "Y"],
  ];
  const ws0 = XLSX.utils.aoa_to_sheet(docRows);
  ws0["!cols"] = [{ wch: 35 }, { wch: 22 }, { wch: 12 }, { wch: 65 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws0, "Document Register");

  // ── Sheet 1: Asset Register ──
  const treeRows: string[][] = [
    ["Site", "Facility", "Area Code", "Area", "Sub-Area", "Parent Asset", "Asset Number", "Equipment Name", "Component Code", "Component Type", "Component Name", "Manufacturer", "P&ID Tags", "Functional Location"],
  ];
  areasData.forEach((area) => {
    area.subAreas.forEach((sub) => {
      sub.parentAssets.forEach((parent) => {
        parent.equipment.forEach((equip) => {
          const tags = equip.pidTags?.join("; ") || "";
          const fl = (equip as any).functionalLocation || "";
          treeRows.push(["TCMG", "Processing Plant", area.code, area.label, sub.label, parent.label, equip.assetNumber, equip.name, "", "", "", "", tags, fl]);
          equip.components?.forEach((comp) => {
            treeRows.push(["TCMG", "Processing Plant", area.code, area.label, sub.label, parent.label, equip.assetNumber, equip.name, comp.componentCode, comp.componentType, comp.componentName, comp.manufacturer, "", ""]);
          });
        });
      });
    });
  });
  crushingPlantAreas.forEach((cruArea) => {
    cruArea.parentAssets.forEach((parent) => {
      parent.equipment.forEach((equip) => {
        treeRows.push(["TCMG", "Crushing Plant", cruArea.areaCode, cruArea.label, cruArea.label, parent.label, equip.assetNumber, equip.name, "", "", "", "", "", ""]);
        equip.components?.forEach((comp) => {
          treeRows.push(["TCMG", "Crushing Plant", cruArea.areaCode, cruArea.label, cruArea.label, parent.label, equip.assetNumber, equip.name, comp.componentCode, comp.componentType, comp.componentName, comp.manufacturer, "", ""]);
        });
      });
    });
  });
  const ws1 = XLSX.utils.aoa_to_sheet(treeRows);
  XLSX.utils.book_append_sheet(wb, ws1, "Asset Register");

  // ── Sheet 2: Asset Criticality ──
  const critRows: string[][] = [
    ["Asset Number", "Asset Name", "Area", "Sub-Area", "Criticality Rating", "Justification", "Assessed By", "Assessed Date"],
  ];
  criticality.forEach((r: any) => {
    critRows.push([r.asset_number, r.asset_name, r.area_label, r.sub_area, r.criticality, r.justification, r.assessed_by, r.assessed_at ? new Date(r.assessed_at).toLocaleDateString() : ""]);
  });
  const ws2 = XLSX.utils.aoa_to_sheet(critRows);
  XLSX.utils.book_append_sheet(wb, ws2, "Asset Criticality");

  // ── Spares helper ──
  const sparesHeaders = ["Stock Code", "Description", "Category", "Subcategory", "Manufacturer", "OEM Part No", "Alt Part No", "Preferred Supplier", "Qty On Hand", "Min Qty", "Max Qty", "Reorder Point", "Unit Cost", "UOM", "Lead Time (Days)", "Last Purchase Date", "Condition", "Status", "Warehouse Area", "Aisle", "Rack", "Bin Location", "Storage Type", "Asset Tag", "Specifications", "Notes"];
  const spareFields = ["part_number", "description", "category", "subcategory", "manufacturer", "oem_part_number", "alternate_part_number", "preferred_supplier", "qty_on_hand", "min_qty", "max_qty", "reorder_point", "unit_cost", "uom", "lead_time_days", "last_purchase_date", "condition", "status", "warehouse_area", "aisle", "rack", "bin_location", "storage_type", "asset_tag", "specifications", "notes"];
  const toSpareRow = (r: any) => spareFields.map((f) => r[f] ?? "");

  // ── Sheet 3: Critical Spares ──
  const critSpares = spares.filter((r: any) => r.is_critical === true);
  const cs3: string[][] = [sparesHeaders, ...critSpares.map(toSpareRow)];
  const ws3 = XLSX.utils.aoa_to_sheet(cs3);
  XLSX.utils.book_append_sheet(wb, ws3, "Critical Spares Register");

  // ── Sheet 4: Complete Spares ──
  const cs4: string[][] = [sparesHeaders, ...spares.map(toSpareRow)];
  const ws4 = XLSX.utils.aoa_to_sheet(cs4);
  XLSX.utils.book_append_sheet(wb, ws4, "Complete Spares Catalogue");

  // ── Sheet 5: PM Template Register ──
  const pmRows: string[][] = [
    ["PM Name", "Discipline", "Equipment Type", "Frequency", "Duty Type", "Skill Level", "Est. Duration", "Resources", "Purpose", "Asset Number", "Status"],
  ];
  pmTemplates.forEach((r: any) => {
    pmRows.push([r.pm_name, r.discipline, r.equipment_type, r.frequency, r.duty_type, r.skill_level, r.estimated_duration, r.resources, r.purpose, r.asset_number, r.status]);
  });
  const ws5 = XLSX.utils.aoa_to_sheet(pmRows);
  XLSX.utils.book_append_sheet(wb, ws5, "PM Template Register");

  // ── Sheet 6: Naming Conventions ──
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
  ncRows.push(["Suffix", "Meaning", "Example"]);
  instrumentationSuffixes.forEach((i) => ncRows.push([i.suffix, i.meaning, i.example]));
  ncRows.push([]);
  ncRows.push(["=== Special Patterns ==="]);
  ncRows.push(["Pattern", "Description", "Example"]);
  specialPatterns.forEach((s) => ncRows.push([s.pattern, s.description, s.example]));
  const ws6 = XLSX.utils.aoa_to_sheet(ncRows);
  XLSX.utils.book_append_sheet(wb, ws6, "Naming Conventions");

  // ── Sheet 7: Functional Locations ──
  const flRows: string[][] = [
    ["Functional Location Code", "Area", "Sub Area", "System Name"],
  ];
  // DB-sourced FLs first
  if (dbFLs.length > 0) {
    dbFLs.forEach((fl: any) => flRows.push([fl.fl_code, fl.area, fl.sub_area, fl.system_name]));
  } else {
    // Fallback to file-based
    functionalLocations.forEach((fl) => flRows.push([fl.code, fl.area, fl.subArea, fl.systemName]));
  }
  // Crushing FLs
  cruFunctionalLocations.forEach((fl) => flRows.push([fl.code, fl.area, fl.subArea, fl.systemName]));
  const ws7 = XLSX.utils.aoa_to_sheet(flRows);
  XLSX.utils.book_append_sheet(wb, ws7, "Functional Locations");

  // ── Sheet 8: Lifecycle & Condition (Placeholder) ──
  const lcRows: string[][] = [
    ["Asset Number", "Asset Name", "Install Date", "Expected Life (yrs)", "Condition Score (1-5)", "Last Inspection Date", "Failure Mode", "Run Hours", "Meter Reading Date", "Notes"],
    ["", "", "", "", "", "", "", "", "", "(No lifecycle data currently captured — this sheet highlights the data gap for future population)"],
  ];
  const ws8 = XLSX.utils.aoa_to_sheet(lcRows);
  ws8["!cols"] = [{ wch: 18 }, { wch: 30 }, { wch: 14 }, { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 18 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws8, "Lifecycle & Condition");

  // Write file
  const dateStamp = new Date().toISOString().slice(0, 10);
  writeXlsxFile(wb, `TCMG_Site_Deliverable_Workbook_${dateStamp}.xlsx`, XLSX);

  return {
    sheetCount: 9,
    assetRows: treeRows.length - 1,
    criticalityRows: critRows.length - 1,
    criticalSpares: critSpares.length,
    totalSpares: spares.length,
    pmTemplates: pmTemplates.length,
    flCount: flRows.length - 1,
  };
}
