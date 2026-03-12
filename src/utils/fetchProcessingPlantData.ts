/**
 * Shared utility to fetch the full Processing Plant asset hierarchy from the database.
 * Used by all export functions (PDF, CSV, Workbook) to ensure a single source of truth.
 */
import { supabase } from "@/integrations/supabase/client";
import { buildAreasFromRows } from "@/hooks/useProcessingPlantAssets";
import type { Area } from "@/components/hierarchy/assetData";

export interface DBAssetRow {
  id: string;
  area_code: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
  asset_number: string;
  asset_name: string;
  pid_tags: string[] | null;
  components: any;
  functional_location: string | null;
}

/**
 * Fetches ALL processing plant assets from the database with pagination
 * to avoid the 1000-row default limit.
 */
export async function fetchAllProcessingPlantRows(): Promise<DBAssetRow[]> {
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

  return allRows;
}

/**
 * Fetches all rows and builds the Area[] tree structure.
 */
export async function fetchProcessingPlantAreas(): Promise<Area[]> {
  const rows = await fetchAllProcessingPlantRows();
  return buildAreasFromRows(rows);
}
