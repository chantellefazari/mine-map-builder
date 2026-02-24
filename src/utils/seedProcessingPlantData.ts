/**
 * Seeds the Processing Plant hierarchy data into the database.
 * Reads from the existing TS data files and inserts into Supabase tables.
 * Processing Plant ONLY — Crushing Plant is excluded.
 */
import { supabase } from "@/integrations/supabase/client";
import { areasData } from "@/components/hierarchy/assetData";
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

export async function seedProcessingPlantData(): Promise<SeedResult> {
  const result: SeedResult = {
    assets: 0,
    pidTags: 0,
    namingConventions: 0,
    functionalLocations: 0,
    errors: [],
  };

  // ========== 1. Assets ==========
  try {
    await supabase.from("processing_plant_assets" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const assetRows: any[] = [];
    for (const area of areasData) {
      if (area.code === "CRU") continue;
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

    for (let i = 0; i < assetRows.length; i += 50) {
      const batch = assetRows.slice(i, i + 50);
      const { error } = await supabase.from("processing_plant_assets" as any).insert(batch);
      if (error) {
        result.errors.push(`Assets batch ${i}: ${error.message}`);
      } else {
        result.assets += batch.length;
      }
    }
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

    for (let i = 0; i < uniquePidRows.length; i += 50) {
      const batch = uniquePidRows.slice(i, i + 50);
      const { error } = await supabase.from("processing_pid_tags" as any).insert(batch);
      if (error) {
        result.errors.push(`P&ID batch ${i}: ${error.message}`);
      } else {
        result.pidTags += batch.length;
      }
    }
  } catch (e: any) {
    result.errors.push(`P&ID Tags: ${e.message}`);
  }

  // ========== 3. Naming Conventions ==========
  try {
    await supabase.from("processing_naming_conventions" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const ncRows: any[] = [];

    for (const ac of areaCodes) {
      ncRows.push({ convention_type: "area_code", code: ac.code, meaning: ac.meaning, description: ac.description, example: "", category: "" });
    }
    for (const ep of equipmentPrefixes) {
      ncRows.push({ convention_type: "equipment_prefix", code: ep.prefix, meaning: ep.meaning, description: "", example: ep.example, category: ep.category });
    }
    for (const cs of componentSuffixes) {
      ncRows.push({ convention_type: "component_suffix", code: cs.suffix, meaning: cs.meaning, description: "", example: cs.example, category: cs.category });
    }
    for (const is_ of instrumentationSuffixes) {
      ncRows.push({ convention_type: "instrumentation_suffix", code: is_.suffix, meaning: is_.meaning, description: "", example: is_.example, category: is_.category });
    }
    for (const sp of specialPatterns) {
      ncRows.push({ convention_type: "special_pattern", code: sp.pattern, meaning: sp.meaning, description: "", example: sp.example, category: "" });
    }

    for (let i = 0; i < ncRows.length; i += 50) {
      const batch = ncRows.slice(i, i + 50);
      const { error } = await supabase.from("processing_naming_conventions" as any).insert(batch);
      if (error) {
        result.errors.push(`Naming conv batch ${i}: ${error.message}`);
      } else {
        result.namingConventions += batch.length;
      }
    }
  } catch (e: any) {
    result.errors.push(`Naming Conventions: ${e.message}`);
  }

  // ========== 4. Functional Locations ==========
  try {
    await supabase.from("processing_functional_locations" as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const flRows = functionalLocations.map((fl) => ({
      fl_code: fl.code,
      area: fl.area,
      area_code: fl.areaCode,
      sub_area: fl.subArea,
      sub_area_code: fl.subAreaCode,
      system_name: fl.systemName,
    }));

    for (let i = 0; i < flRows.length; i += 50) {
      const batch = flRows.slice(i, i + 50);
      const { error } = await supabase.from("processing_functional_locations" as any).insert(batch);
      if (error) {
        result.errors.push(`FL batch ${i}: ${error.message}`);
      } else {
        result.functionalLocations += batch.length;
      }
    }
  } catch (e: any) {
    result.errors.push(`Functional Locations: ${e.message}`);
  }

  return result;
}
