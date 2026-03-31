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
    ["Stock Code Standard", "TCMG-STD-SPN-001", "Complete", "7-digit numeric stock code allocation standard (SSCCNNN) with 25 category codes", "Y"],
    ["Asset Hierarchy Standard", "TCMG-STD-AH-001", "Complete", "7-level hierarchy with parent-child rules, constraints, and equipment abbreviations", "Y"],
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
  specialPatterns.forEach((s) => ncRows.push([s.pattern, s.meaning, s.example]));
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

  // ── Sheet 9: Stock Code Standard ──
  const scRows: string[][] = [];
  scRows.push(["TCMG Stock Code Standard (TCMG-STD-SPN-001)"]);
  scRows.push([]);
  scRows.push(["Format Structure"]);
  scRows.push(["Position", "Field", "Description"]);
  scRows.push(["SS", "Site Code", "10 = Tennant Creek Mine Gold"]);
  scRows.push(["CC", "Category Code", "01–25 (see table below)"]);
  scRows.push(["NNN", "Sequential Number", "001–999 per category"]);
  scRows.push([]);
  scRows.push(["Full Format: SSCCNNN — 7-digit numeric only, no letters, no dashes"]);
  scRows.push([]);
  scRows.push(["Allocation Workflow"]);
  scRows.push(["Step", "Action"]);
  scRows.push(["1", "Identify the correct Category Code (CC) from the table below"]);
  scRows.push(["2", "Open the Site Spares Catalogue and filter by that category"]);
  scRows.push(["3", "Find the highest existing NNN sequence number"]);
  scRows.push(["4", "Assign the next sequential number (e.g., if highest is 007, assign 008)"]);
  scRows.push(["5", "Enter the full 7-digit stock code (e.g., 1004008)"]);
  scRows.push(["6", "Verify: One Part = One Number — never reuse or reassign"]);
  scRows.push(["7", "Record in the Site Spares Catalogue with all required fields"]);
  scRows.push([]);
  scRows.push(["Category Code Table"]);
  scRows.push(["CC", "Category Name", "Examples", "Storage Container"]);
  const stockCategories = [
    { code: "01", name: "Pump Component", examples: "Slurry pumps, centrifugal pumps, dosing pumps, impellers, volutes", container: "C04-MP / C03-ME / LD" },
    { code: "02", name: "Motor Component", examples: "Electric motors, motor assemblies, motor couplings, motor fans", container: "LD / C04-MP" },
    { code: "03", name: "Gearbox", examples: "Gear reducers, speed reducers, helical & planetary gearboxes", container: "LD" },
    { code: "04", name: "Bearing", examples: "Ball bearings, roller bearings, pillow blocks, plummer blocks", container: "C04-MP" },
    { code: "05", name: "Valve", examples: "Ball, knife gate, pinch, butterfly, check, solenoid, gate valves", container: "C02-IN / C03-ME / LD" },
    { code: "06", name: "Instrumentation", examples: "Flow meters, level sensors, pressure transmitters, pH probes", container: "C02-IN" },
    { code: "07", name: "Electrical", examples: "VSDs, contactors, relays, PLC cards, circuit breakers, cables", container: "C01-EL" },
    { code: "08", name: "Conveyor Component", examples: "Rollers, idlers, pulleys, belts, belt scrapers, sprockets", container: "C03-ME / LD" },
    { code: "09", name: "Wear Parts", examples: "Crusher liners, jaw plates, cyclone liners, chute liners, screen panels", container: "LD / C03-ME" },
    { code: "10", name: "Mechanical", examples: "Flexible couplings, shaft couplings, brackets, clamps, mounts", container: "C03-ME" },
    { code: "11", name: "Pipe Fitting", examples: "Hoses, BSP fittings, flanges, couplings, camlock, PE fittings", container: "C02-IN / C03-ME" },
    { code: "12", name: "Seal", examples: "Mechanical seals, o-rings, gaskets, gland packing, oil seals", container: "C04-MP" },
    { code: "13", name: "Filter", examples: "Engine & air filters, hydraulic filters, oil filters, fuel filters", container: "C05-CS / C02-IN" },
    { code: "14", name: "Lubrication System", examples: "Lube pumps, grease pumps, auto-lube systems, oil coolers", container: "C04-MP / C05-CS" },
    { code: "15", name: "Air & Pneumatic", examples: "Air receivers, compressors, pneumatic actuators, FRL units", container: "C02-IN / LD" },
    { code: "16", name: "Tanks & Vessels", examples: "Process tanks, CIP tanks, reagent tanks, heat exchangers", container: "LD" },
    { code: "17", name: "Safety Equipment", examples: "Safety showers, eyewash stations, e-stops, fire extinguishers", container: "C05-CS" },
    { code: "18", name: "Power Generation", examples: "Generators, alternators, substations, distribution boards", container: "LD / C01-EL" },
    { code: "19", name: "Tooling", examples: "Hand tools, power tools, torque tools, site boxes", container: "C05-CS" },
    { code: "20", name: "OEM Assembly", examples: "Complete pump skids, lube skids, filter press packages", container: "LD" },
    { code: "21", name: "Fastener", examples: "Bolts, nuts, washers, studs, anchors, rivets", container: "C05-CS" },
    { code: "22", name: "Consumables", examples: "Flap discs, cutting wheels, lubricants, grease, adhesives", container: "C05-CS / Flammable Cabinet" },
    { code: "23", name: "Structural Steel", examples: "SHS, RHS, C-channel, equal angle, flat bar, steel plate", container: "LD" },
    { code: "24", name: "Rigging", examples: "Slings, chain blocks, lever hoists, shackles, wire rope", container: "C03-ME" },
    { code: "25", name: "PPE", examples: "Hard hats, safety glasses, respirators, gloves, hi-vis vests", container: "C05-CS" },
  ];
  stockCategories.forEach((c) => scRows.push([c.code, c.name, c.examples, c.container]));
  const ws9 = XLSX.utils.aoa_to_sheet(scRows);
  ws9["!cols"] = [{ wch: 12 }, { wch: 22 }, { wch: 60 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws9, "Stock Code Standard");

  // ── Sheet 10: Asset Hierarchy & Parent-Child Rules ──
  const ahRows: string[][] = [];
  ahRows.push(["TCMG Asset Hierarchy & Parent-Child Rules (TCMG-STD-AH-001)"]);
  ahRows.push([]);
  ahRows.push(["1. Hierarchy Levels"]);
  ahRows.push(["Level", "Name", "Example", "Description", "Has FL"]);
  ahRows.push(["1", "Site", "TCMG", "Top level site identifier", "Yes"]);
  ahRows.push(["2", "Facility", "Processing Plant / Crushing Plant", "Major operational facility", "Yes"]);
  ahRows.push(["3", "Main Area", "SITE / UTL / COM / GR / TAIL / SUP", "High level process grouping (not an asset)", "Yes"]);
  ahRows.push(["4", "Sub Area", "GRIND, CIP, FILT, ELEC, WTR", "Logical process subdivision", "Yes"]);
  ahRows.push(["5", "Parent Asset (System)", "BM01 Ball Mill, FP01 Filter Press", "Physical anchor asset. FL stops here", "Yes"]);
  ahRows.push(["6", "Equipment", "BM01-MTR01, FP01-GBX01", "Maintainable equipment items", "No"]);
  ahRows.push(["7", "Component", "Bearings, seals, impellers, belts", "OEM level parts. No asset number", "No"]);
  ahRows.push([]);
  ahRows.push(["2. Parent-Child Rules"]);
  ahRows.push(["#", "Rule"]);
  ahRows.push(["1", "Every level (except Site) must have exactly one parent"]);
  ahRows.push(["2", "Equipment (L6) must always sit under a Parent Asset (L5)"]);
  ahRows.push(["3", "Components (L7) inherit the Functional Location of their parent"]);
  ahRows.push(["4", "Electrical equipment sits under the equipment it powers"]);
  ahRows.push(["5", "No orphan assets are permitted. Every asset has a traceable path to Site"]);
  ahRows.push(["6", "Duty/Standby pairs share a single Parent FL"]);
  ahRows.push([]);
  ahRows.push(["3. Constraints (Non Negotiable)"]);
  ahRows.push(["#", "Constraint"]);
  ahRows.push(["1", "Do NOT merge hierarchy levels"]);
  ahRows.push(["2", "Do NOT skip levels in the structure"]);
  ahRows.push(["3", "Do NOT create duplicate Parent Assets"]);
  ahRows.push(["4", "Do NOT assign asset numbers to components (L7)"]);
  ahRows.push(["5", "Do NOT change hierarchy once assigned without formal MOC"]);
  ahRows.push(["6", "Do NOT create a Functional Location below Level 5"]);
  ahRows.push([]);
  ahRows.push(["4. Equipment Abbreviations"]);
  ahRows.push(["Code", "Meaning"]);
  ahRows.push(["CV", "Conveyor"]);
  ahRows.push(["PP", "Pump"]);
  ahRows.push(["MTR", "Motor"]);
  ahRows.push(["GBX", "Gearbox"]);
  ahRows.push(["AGT", "Agitator"]);
  ahRows.push(["FDR", "Feeder"]);
  ahRows.push(["BRG", "Bearing Assembly"]);
  ahRows.push(["VLV", "Valve"]);
  ahRows.push(["CYC", "Cyclone"]);
  ahRows.push(["CP", "Coupling"]);
  ahRows.push(["SCN", "Screen"]);
  ahRows.push(["DRV", "Drive"]);
  ahRows.push([]);
  ahRows.push(["5. Asset Numbering Examples"]);
  ahRows.push(["Asset Number", "Description"]);
  ahRows.push(["APRN01-CV01", "Transfer Conveyor 01 (Apron Feeder system)"]);
  ahRows.push(["GRND01-BM01", "Ball Mill 01 (Grinding system)"]);
  ahRows.push(["FILT01-FP01", "Filter Press 01 (Filtering system)"]);
  ahRows.push(["CIP01-AGT01", "Agitator 01 (CIP/Leaching system)"]);
  ahRows.push(["THK01-DRV01", "Drive 01 (Thickener system)"]);
  const ws10 = XLSX.utils.aoa_to_sheet(ahRows);
  ws10["!cols"] = [{ wch: 18 }, { wch: 40 }, { wch: 60 }, { wch: 45 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws10, "Asset Hierarchy Rules");

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
