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
  functional_location: string | null;
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

export function buildAreasFromRows(rows: DBAssetRow[]): Area[] {
  // Preserve insertion order via Map
  const areaMap = new Map<string, {
    code: AreaType;
    label: string;
    subAreas: Map<string, {
      label: string;
      parentAssets: Map<string, {
        label: string;
        functionalLocation?: string;
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
        functionalLocation: row.functional_location || undefined,
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
      functionalLocation: row.functional_location || undefined,
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
      parentAssets: Array.from(sub.parentAssets.values()).map((pa) => ({
        label: pa.label,
        functionalLocation: pa.functionalLocation,
        equipment: pa.equipment,
      })),
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

// Component suffixes that indicate Level 7 sub-equipment
const COMPONENT_SUFFIXES = ["-LCS", "-MTR", "-MCC", "-VSD", "-GBX", "-CPL", "-BRG", "-SEAL", "-AGT"];

/**
 * Auto-nest component-suffix assets under their parent equipment.
 * e.g. RWPA01-MTR becomes a component of RWPA01.
 */
function nestComponentsInAreas(areas: Area[]): Area[] {
  for (const area of areas) {
    for (const subArea of area.subAreas) {
      for (const pa of subArea.parentAssets) {
        const equipMap = new Map<string, Equipment>();
        const componentRows: Equipment[] = [];
        const kept: Equipment[] = [];

        // First pass: identify parent equipment vs components
        for (const equip of pa.equipment) {
          let isComponent = false;
          for (const suffix of COMPONENT_SUFFIXES) {
            if (equip.assetNumber.endsWith(suffix)) {
              isComponent = true;
              break;
            }
          }
          // Also check numbered suffixes like -MTR01, -LCS01
          if (!isComponent) {
            for (const suffix of COMPONENT_SUFFIXES) {
              const baseSuffix = suffix; // e.g. "-MTR"
              const idx = equip.assetNumber.lastIndexOf(baseSuffix);
              if (idx > 0) {
                const afterSuffix = equip.assetNumber.slice(idx + baseSuffix.length);
                if (/^\d*$/.test(afterSuffix)) {
                  isComponent = true;
                  break;
                }
              }
            }
          }

          if (isComponent) {
            componentRows.push(equip);
          } else {
            equipMap.set(equip.assetNumber, equip);
            kept.push(equip);
          }
        }

        // Second pass: nest components under their parent
        for (const comp of componentRows) {
          let parentKey: string | null = null;
          for (const suffix of COMPONENT_SUFFIXES) {
            const idx = comp.assetNumber.lastIndexOf(suffix);
            if (idx > 0) {
              parentKey = comp.assetNumber.slice(0, idx);
              break;
            }
          }

          const parentEquip = parentKey ? equipMap.get(parentKey) : null;
          if (parentEquip) {
            if (!parentEquip.components) parentEquip.components = [];
            parentEquip.components.push({
              componentCode: comp.assetNumber,
              componentType: comp.assetNumber.slice(comp.assetNumber.lastIndexOf("-") + 1).replace(/\d+$/, ""),
              componentName: comp.name,
              manufacturer: "",
            });
          } else {
            // No parent found — keep as equipment
            kept.push(comp);
          }
        }

        pa.equipment = kept;
      }
    }
  }
  return areas;
}

export function useRevBPlantAssets() {
  return useQuery({
    queryKey: ["rev-b-plant-assets-tree"],
    queryFn: async (): Promise<Area[]> => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("id, area_code, area_label, sub_area, parent_asset_label, asset_number, asset_name, pid_tags, components, functional_location, sort_order")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      const areas = buildAreasFromRows(data as DBAssetRow[]);
      return nestComponentsInAreas(areas);
    },
    staleTime: 2 * 60 * 1000,
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
