/**
 * Hook to fetch Processing Plant asset hierarchy from the database
 * instead of hardcoded TypeScript files.
 * Transforms flat DB rows into the Area[] tree structure used by AssetTree.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Area, AreaType, Equipment, Component } from "@/components/hierarchy/assetData";

interface DBAssetRow {
  id: string;
  area_code: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
  asset_number: string;
  asset_name: string;
  pid_tags: string[] | null;
  components: any;
}

interface DBPidTagRow {
  pid_tag: string;
  asset_number: string;
  description: string;
  status: string;
}

function parseComponents(raw: any): Component[] {
  if (!raw) return [];
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.map((c: any) => ({
      componentCode: c.componentCode || "",
      componentType: c.componentType || "",
      componentName: c.componentName || "",
      manufacturer: c.manufacturer || "",
      serialNumber: c.serialNumber,
      model: c.model,
      oilType: c.oilType,
      oilVolume: c.oilVolume,
      inputSpeed: c.inputSpeed,
      outputSpeed: c.outputSpeed,
      weight: c.weight,
      motorSpeed: c.motorSpeed,
      protection: c.protection,
      voltage: c.voltage,
      pumpFlow: c.pumpFlow,
      operatingPressure: c.operatingPressure,
      displacement: c.displacement,
      motorRef: c.motorRef,
      pumpRef: c.pumpRef,
    }));
  } catch {
    return [];
  }
}

function buildAreasFromRows(rows: DBAssetRow[]): Area[] {
  // Preserve insertion order via Map
  const areaMap = new Map<string, {
    code: AreaType;
    label: string;
    subAreas: Map<string, {
      label: string;
      parentAssets: Map<string, {
        label: string;
        equipment: Equipment[];
      }>;
    }>;
  }>();

  for (const row of rows) {
    // Area
    if (!areaMap.has(row.area_code)) {
      areaMap.set(row.area_code, {
        code: row.area_code as AreaType,
        label: row.area_label,
        subAreas: new Map(),
      });
    }
    const area = areaMap.get(row.area_code)!;

    // Sub-area
    if (!area.subAreas.has(row.sub_area)) {
      area.subAreas.set(row.sub_area, {
        label: row.sub_area,
        parentAssets: new Map(),
      });
    }
    const subArea = area.subAreas.get(row.sub_area)!;

    // Parent asset
    if (!subArea.parentAssets.has(row.parent_asset_label)) {
      subArea.parentAssets.set(row.parent_asset_label, {
        label: row.parent_asset_label,
        equipment: [],
      });
    }
    const parentAsset = subArea.parentAssets.get(row.parent_asset_label)!;

    // Equipment
    const components = parseComponents(row.components);
    const equip: Equipment = {
      assetNumber: row.asset_number,
      name: row.asset_name,
      pidTags: row.pid_tags?.length ? row.pid_tags : undefined,
      components: components.length > 0 ? components : undefined,
    };
    parentAsset.equipment.push(equip);
  }

  // Convert maps to arrays, then sort to match the approved hierarchy order
  const AREA_ORDER: string[] = ["SITE", "UTL", "COM", "REC", "TAIL", "SUP"];
  const unsorted = Array.from(areaMap.values()).map((area) => ({
    code: area.code,
    label: area.label,
    subAreas: Array.from(area.subAreas.values()).map((sub) => ({
      label: sub.label,
      parentAssets: Array.from(sub.parentAssets.values()),
    })),
  }));
  return unsorted.sort((a, b) => {
    const ia = AREA_ORDER.indexOf(a.code);
    const ib = AREA_ORDER.indexOf(b.code);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

export function useProcessingPlantAssets() {
  return useQuery({
    queryKey: ["processing-plant-assets"],
    queryFn: async (): Promise<Area[]> => {
      // Fetch all assets (may need pagination if >1000)
      const { data, error } = await supabase
        .from("processing_plant_assets")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return buildAreasFromRows(data as DBAssetRow[]);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export interface PidTagMapping {
  pidTag: string;
  assetNumber: string;
  description: string;
  status: string;
}

export function useProcessingPidTags() {
  return useQuery({
    queryKey: ["processing-pid-tags"],
    queryFn: async (): Promise<PidTagMapping[]> => {
      const { data, error } = await supabase
        .from("processing_pid_tags")
        .select("*");

      if (error) throw error;
      return (data as DBPidTagRow[]).map((r) => ({
        pidTag: r.pid_tag,
        assetNumber: r.asset_number,
        description: r.description,
        status: r.status,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
