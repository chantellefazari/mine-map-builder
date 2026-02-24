/**
 * Seeds the FULL asset hierarchy into the database.
 * Includes: Processing Plant, Crushing Plant, CRU Functional Locations, CRU Naming Conventions.
 */
import { supabase } from "@/integrations/supabase/client";
import { areasData } from "@/components/hierarchy/assetData";
import { crushingPlantAreas } from "@/components/hierarchy/crushingPlantData";
import { cruFunctionalLocations } from "@/components/hierarchy/crushingFunctionalLocations";
import { pidTagMappings } from "@/components/hierarchy/pidTagMappings";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "@/components/hierarchy/namingConventionData";
import { functionalLocations } from "@/components/hierarchy/functionalLocations";

interface SeedResult {
  assets: number;
  pidTags: number;
  namingConventions: number;
  functionalLocations: number;
  errors: string[];
}

async function insertBatched(table: string, rows: any[], batchSize: number, result: SeedResult, counterKey: "assets" | "pidTags" | "namingConventions" | "functionalLocations", label: string) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table as any).insert(batch);
    if (error) {
      result.errors.push(`${label} batch ${i}: ${error.message}`);
    } else {
      result[counterKey] += batch.length;
    }
  }
}

export async function seedProcessingPlantData(): Promise<SeedResult> {
  const result: SeedResult = {
    assets: 0,
    pidTags: 0,
    namingConventions: 0,
    functionalLocations: 0,
    errors: [],
  };

  // ========== 1. Assets (Processing Plant) ==========
  try {
    await supabase.from("processing_plant_assets" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const assetRows: any[] = [];

    // Processing Plant areas
    for (const area of areasData) {
      if (area.code === "CRU") continue; // CRU handled separately below
      for (const subArea of area.subAreas) {
        for (const parent of subArea.parentAssets) {
          for (const eq of parent.equipment) {
            assetRows.push({
              facility: "Processing Plant",
              area_code: area.code,
              area_label: area.label,
              sub_area: subArea.label,
              parent_asset_label: parent.label,
              asset_number: eq.assetNumber,
              asset_name: eq.name,
              pid_tags: eq.pidTags || [],
              components: eq.components ? JSON.stringify(eq.components) : "[]",
            });
          }
        }
      }
    }

    // Crushing Plant areas
    for (const subArea of crushingPlantAreas) {
      for (const parent of subArea.parentAssets) {
        for (const eq of parent.equipment) {
          assetRows.push({
            facility: "Crushing Plant",
            area_code: subArea.areaCode,
            area_label: subArea.label,
            sub_area: subArea.label,
            parent_asset_label: parent.label,
            asset_number: eq.assetNumber,
            asset_name: eq.name,
            pid_tags: eq.pidTags || [],
            components: eq.components ? JSON.stringify(eq.components) : "[]",
          });
        }
      }
    }

    await insertBatched("processing_plant_assets", assetRows, 50, result, "assets", "Assets");
  } catch (e: any) {
    result.errors.push(`Assets: ${e.message}`);
  }

  // ========== 2. P&ID Tag Mappings ==========
  try {
    await supabase.from("processing_pid_tags" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const pidRows = pidTagMappings.map((m) => ({
      pid_tag: m.pidTag,
      asset_number: m.assetNumber,
      description: m.description,
      status: m.status,
    }));

    const seen = new Set<string>();
    const uniquePidRows = pidRows.filter((r) => {
      if (seen.has(r.pid_tag)) return false;
      seen.add(r.pid_tag);
      return true;
    });

    await insertBatched("processing_pid_tags", uniquePidRows, 50, result, "pidTags", "P&ID");
  } catch (e: any) {
    result.errors.push(`P&ID Tags: ${e.message}`);
  }

  // ========== 3. Naming Conventions (PRO + CRU) ==========
  try {
    await supabase.from("processing_naming_conventions" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const ncRows: any[] = [];

    // PRO Area codes
    for (const ac of areaCodes) {
      ncRows.push({ convention_type: "area_code", code: ac.code, meaning: ac.meaning, description: ac.description, example: "", category: "" });
    }
    // PRO Equipment prefixes
    for (const ep of equipmentPrefixes) {
      ncRows.push({ convention_type: "equipment_prefix", code: ep.prefix, meaning: ep.meaning, description: "", example: ep.example, category: ep.category });
    }
    // PRO Component suffixes
    for (const cs of componentSuffixes) {
      ncRows.push({ convention_type: "component_suffix", code: cs.suffix, meaning: cs.meaning, description: "", example: cs.example, category: cs.category });
    }
    // PRO Instrumentation suffixes
    for (const is_ of instrumentationSuffixes) {
      ncRows.push({ convention_type: "instrumentation_suffix", code: is_.suffix, meaning: is_.meaning, description: "", example: is_.example, category: is_.category });
    }
    // PRO Special patterns
    for (const sp of specialPatterns) {
      ncRows.push({ convention_type: "special_pattern", code: sp.pattern, meaning: sp.meaning, description: "", example: sp.example, category: "" });
    }

    // CRU Area codes
    const cruAreaCodes = [
      { code: "CRU-ROM", meaning: "ROM & Primary Feed", description: "Run of Mine wall, primary feeder, feed chutes" },
      { code: "CRU-PRI", meaning: "Primary Crushing", description: "Jaw crusher CR01, forward conveyor CV01" },
      { code: "CRU-SCN", meaning: "Screening Section", description: "Screen feed bin, SC01 vibrating screen, CV04" },
      { code: "CRU-SEC", meaning: "Secondary Crushing", description: "Cone feed bin, CR02 & CR03 cone crushers" },
      { code: "CRU-STK", meaning: "Conveying & Stockpiling", description: "All product conveyors CV02–CV15, radial stackers" },
      { code: "CRU-CTL", meaning: "Controls & MCC", description: "MCC, PLC, HMI, SCADA, operators cabin, earth grid" },
      { code: "CRU-DUS", meaning: "Dust Suppression", description: "Dust pump, spray system, poly pipe, nozzles" },
    ];
    for (const ac of cruAreaCodes) {
      ncRows.push({ convention_type: "cru_area_code", code: ac.code, meaning: ac.meaning, description: ac.description, example: "", category: "" });
    }

    // CRU Equipment prefixes
    const cruEquipPrefixes = [
      { prefix: "CR", meaning: "Crusher", example: "CR01 (Jaw), CR02/CR03 (Cone)", category: "Crushing" },
      { prefix: "CV", meaning: "Conveyor", example: "CV01–CV15", category: "Conveying" },
      { prefix: "SC", meaning: "Screen", example: "SC01 – BWC208", category: "Screening" },
      { prefix: "FDR", meaning: "Feeder / Vibrating Feeder", example: "ROM-FDR01, SCR-FDB01-FDR01", category: "Feed Systems" },
      { prefix: "FDB", meaning: "Feed Bin", example: "SCR-FDB01, SEC-CFB01", category: "Feed Systems" },
      { prefix: "MCC", meaning: "Motor Control Centre", example: "CRU-CTL-MCC01", category: "Controls" },
      { prefix: "PLC", meaning: "Programmable Logic Controller", example: "CRU-CTL-PLC01", category: "Controls" },
      { prefix: "HMI", meaning: "Human Machine Interface", example: "CRU-CTL-HMI01", category: "Controls" },
      { prefix: "SCADA", meaning: "SCADA Server & Workstation", example: "CRU-CTL-SCADA01", category: "Controls" },
      { prefix: "ROM", meaning: "Run of Mine (Wall/Area)", example: "ROM-WALL01", category: "ROM" },
    ];
    for (const ep of cruEquipPrefixes) {
      ncRows.push({ convention_type: "cru_equipment_prefix", code: ep.prefix, meaning: ep.meaning, description: "", example: ep.example, category: ep.category });
    }

    // CRU Component suffixes
    const cruCompSuffixes = [
      { suffix: "MTR", meaning: "Motor", example: "CR01-MTR01, CV01-MTR01" },
      { suffix: "GBX", meaning: "Gearbox / Gear Motor", example: "CV02-GBX01" },
      { suffix: "BLT", meaning: "Conveyor Belt", example: "CV02-BLT01" },
      { suffix: "HDR", meaning: "Head Drum", example: "CV02-HDR01" },
      { suffix: "TDR", meaning: "Tail Drum", example: "CV02-TDR01" },
      { suffix: "IDL", meaning: "Idlers", example: "CV02-IDL01" },
      { suffix: "SCR", meaning: "Belt Scraper", example: "CV02-SCR01" },
      { suffix: "LNY", meaning: "Lanyard Safety Switch", example: "CV02-LNY01" },
      { suffix: "SPD", meaning: "Speed Detection Sensor", example: "CV02-SPD01" },
      { suffix: "IMP", meaning: "Impact Bed / Impact Rollers", example: "CV01-IMP01" },
      { suffix: "SKT", meaning: "Skirt Panels / Rock Ledges", example: "CV02-SKT01" },
      { suffix: "WGH", meaning: "Belt Weigher / Weigh Scale", example: "CV02-WGH01" },
      { suffix: "MDT", meaning: "Metal Detector", example: "CV07-MDT01" },
      { suffix: "RAD", meaning: "Radial Drive", example: "CV12-RAD01" },
      { suffix: "EXC", meaning: "Exciter Unit (Feeder/Screen)", example: "SCR-FDB01-FDR01-EXC01" },
      { suffix: "VSD", meaning: "Variable Speed Drive", example: "ROM-FDR01-VSD01" },
      { suffix: "JAW", meaning: "Jaw Assembly", example: "CR01-JAW01" },
      { suffix: "BDY", meaning: "Crusher Body", example: "CR01-BDY01" },
      { suffix: "JKS", meaning: "Jackshaft Assembly", example: "CR01-JKS01" },
      { suffix: "BRG", meaning: "Bearings", example: "CR01-BRG01" },
      { suffix: "LUB", meaning: "Lube System / Tank", example: "CR02-LUB01" },
      { suffix: "HYD", meaning: "Hydraulic System / Tank", example: "CR02-HYD01" },
      { suffix: "CYL", meaning: "Hydraulic Cylinders (tramp release)", example: "CR02-CYL01" },
      { suffix: "DK", meaning: "Screen Deck", example: "SC01-DK01, SC01-DK02" },
      { suffix: "LVL", meaning: "Level Sensor", example: "SCR-FDB01-LVL01" },
      { suffix: "CHT", meaning: "Head Chute / Discharge Chute", example: "CV03-CHT01" },
      { suffix: "PLT", meaning: "Access Platform", example: "SC01-PLT01" },
    ];
    for (const cs of cruCompSuffixes) {
      ncRows.push({ convention_type: "cru_component_suffix", code: cs.suffix, meaning: cs.meaning, description: "", example: cs.example, category: "" });
    }

    await insertBatched("processing_naming_conventions", ncRows, 50, result, "namingConventions", "Naming conv");
  } catch (e: any) {
    result.errors.push(`Naming Conventions: ${e.message}`);
  }

  // ========== 4. Functional Locations (PRO + CRU) ==========
  try {
    await supabase.from("processing_functional_locations" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const flRows: any[] = [];

    // PRO Functional Locations
    for (const fl of functionalLocations) {
      flRows.push({
        fl_code: fl.code,
        area: fl.area,
        area_code: fl.areaCode,
        sub_area: fl.subArea,
        sub_area_code: fl.subAreaCode,
        system_name: fl.systemName,
      });
    }

    // CRU Functional Locations
    for (const fl of cruFunctionalLocations) {
      flRows.push({
        fl_code: fl.code,
        area: fl.area,
        area_code: `CRU-${fl.areaCode}`,
        sub_area: fl.subArea,
        sub_area_code: fl.areaCode,
        system_name: fl.systemName,
      });
    }

    await insertBatched("processing_functional_locations", flRows, 50, result, "functionalLocations", "FL");
  } catch (e: any) {
    result.errors.push(`Functional Locations: ${e.message}`);
  }

  return result;
}
