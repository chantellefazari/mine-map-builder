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
      pidTags: Array.isArray(c.pidTags)
        ? c.pidTags
        : Array.isArray(c.pid_tags)
          ? c.pid_tags
          : undefined,
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

    // System header rows: parent_asset_label === "ASSET_NUMBER ASSET_NAME" (self-referencing).
    // If they carry components or P&ID tags, keep them as equipment; otherwise skip (pure grouping node).
    const isSelfReferencing = row.parent_asset_label === `${row.asset_number} ${row.asset_name}`;
    if (isSelfReferencing) {
      if (row.functional_location) {
        parentAsset.functionalLocation = row.functional_location;
      }
      const components = parseComponents(row.components);
      const hasPidTags = row.pid_tags && row.pid_tags.length > 0;
      // Only render as equipment if it has real data (components or tags)
      if (components.length === 0 && !hasPidTags) {
        continue;
      }
      // Render with components attached
      const equip: Equipment = {
        assetNumber: row.asset_number,
        name: row.asset_name,
        pidTags: hasPidTags ? row.pid_tags! : undefined,
        components: components.length > 0 ? components : undefined,
        functionalLocation: row.functional_location || undefined,
      };
      parentAsset.equipment.push(equip);
      continue;
    }

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

/**
 * @deprecated Rev A has been deleted. Use useRevBPlantAssets() instead.
 * Kept as alias to prevent broken imports during transition.
 */
export const useProcessingPlantAssets = useRevBPlantAssets;

// Component suffix patterns (without leading dash) that indicate Level 7 sub-equipment
const COMPONENT_TYPE_PATTERNS = [
  "LCS", "MTR", "MCC", "VSD", "CPL", "BRG", "SEAL",
];

/**
 * Determines if an asset number represents a component of another asset.
 * Returns the parent asset number if it is, or null if not.
 */
function getComponentParent(assetNumber: string): string | null {
  const lastDash = assetNumber.lastIndexOf("-");
  if (lastDash <= 0) return null;

  const lastSegment = assetNumber.slice(lastDash + 1);
  const typeCode = lastSegment.replace(/\d+$/, "");

  if (COMPONENT_TYPE_PATTERNS.includes(typeCode)) {
    return assetNumber.slice(0, lastDash);
  }
  return null;
}

function inferVirtualParentName(componentName: string): string {
  return componentName
    .replace(/\s+(LCS|Motor|MCC\s*Cell|Gearbox|Variable\s*Speed\s*Drive|VSD|Coupling|Bearing|Seal|PH\s*Probe)$/i, "")
    .trim();
}

/**
 * Auto-nest component-suffix assets under their parent equipment.
 * If parent equipment is missing, create a virtual parent to preserve Level 6 → Level 7 structure.
 */
function nestComponentsInAreas(areas: Area[]): Area[] {
  for (const area of areas) {
    for (const subArea of area.subAreas) {
      for (const pa of subArea.parentAssets) {
        const equipMap = new Map<string, Equipment>();
        const orderIndex = new Map<string, number>();
        const virtualParents = new Set<string>();
        const nested = new Set<string>();

        pa.equipment.forEach((equip, idx) => {
          equipMap.set(equip.assetNumber, equip);
          orderIndex.set(equip.assetNumber, idx);
        });

        // Process deeper asset numbers first so child rows can create/find their immediate parent
        const sorted = [...pa.equipment].sort((a, b) => {
          const aDepth = (a.assetNumber.match(/-/g) || []).length;
          const bDepth = (b.assetNumber.match(/-/g) || []).length;
          if (aDepth !== bDepth) return bDepth - aDepth;
          return b.assetNumber.length - a.assetNumber.length;
        });

        // Derive system header asset number from the parent asset label (e.g. "THYD01 Thickener Hydraulic System" → "THYD01")
        const systemHeaderAssetNumber = pa.label.split(" ")[0];

        for (const equip of sorted) {
          const parentKey = getComponentParent(equip.assetNumber);
          if (!parentKey) continue;

          // If the asset has its own P&ID tag, it's independent Level 6 equipment — never auto-nest
          if (equip.pidTags && equip.pidTags.length > 0) continue;

          // If the asset has its own components in the DB, it's a parent equipment — never auto-nest
          if (equip.components && equip.components.length > 0) continue;

          // Don't nest under the system header — these are peer Level 6 equipment, not Level 7 components
          if (parentKey === systemHeaderAssetNumber && !equipMap.has(parentKey)) continue;

          let parentEquip = equipMap.get(parentKey);
          if (!parentEquip) {
            parentEquip = {
              assetNumber: parentKey,
              name: inferVirtualParentName(equip.name) || parentKey,
              components: [],
              functionalLocation: equip.functionalLocation,
            };
            equipMap.set(parentKey, parentEquip);
            virtualParents.add(parentKey);
            orderIndex.set(parentKey, orderIndex.get(equip.assetNumber) ?? 9999);
          }

          if (!parentEquip.components) parentEquip.components = [];
          const lastDash = equip.assetNumber.lastIndexOf("-");
          const lastSegment = equip.assetNumber.slice(lastDash + 1);
          const typeCode = lastSegment.replace(/\d+$/, "");

          // Merge: add auto-nested component row for this equipment.
          // If the equipment has exactly one DB-stored component, treat it as the equipment's own spec
          // and attach those specs directly to this nested component row (avoid duplicate child row).
          const singleSpec = equip.components && equip.components.length === 1 ? equip.components[0] : null;

          parentEquip.components.push({
            componentCode: equip.assetNumber,
            componentType: typeCode,
            componentName: equip.name,
            manufacturer: singleSpec?.manufacturer || "",
            pidTags: equip.pidTags?.length ? equip.pidTags : undefined,
            model: singleSpec?.model,
            serialNumber: singleSpec?.serialNumber,
            oilType: singleSpec?.oilType,
            oilVolume: singleSpec?.oilVolume,
            inputSpeed: singleSpec?.inputSpeed,
            outputSpeed: singleSpec?.outputSpeed,
            weight: singleSpec?.weight,
            motorSpeed: singleSpec?.motorSpeed,
            protection: singleSpec?.protection,
            voltage: singleSpec?.voltage,
            pumpFlow: singleSpec?.pumpFlow,
            operatingPressure: singleSpec?.operatingPressure,
            displacement: singleSpec?.displacement,
            motorRef: singleSpec?.motorRef,
            pumpRef: singleSpec?.pumpRef,
          });

          // If the child equipment had multiple DB-stored components, carry them forward as children.
          if (equip.components && equip.components.length > 1) {
            for (const childComp of equip.components) {
              const childKey = `${childComp.componentType || ""}::${childComp.componentName || ""}::${childComp.model || ""}`.toLowerCase();
              const exists = parentEquip.components.some((c) => {
                if (c.componentCode && childComp.componentCode) {
                  return c.componentCode === childComp.componentCode;
                }
                const existingKey = `${c.componentType || ""}::${c.componentName || ""}::${c.model || ""}`.toLowerCase();
                return existingKey === childKey;
              });

              if (!exists) {
                parentEquip.components.push(childComp);
              }
            }
          }
          nested.add(equip.assetNumber);
        }

        const remainingOriginal = pa.equipment.filter((e) => !nested.has(e.assetNumber));
        const virtualEquipment = [...virtualParents]
          .map((assetNumber) => equipMap.get(assetNumber)!)
          .filter(Boolean);

        pa.equipment = [...remainingOriginal, ...virtualEquipment].sort((a, b) => {
          const ia = orderIndex.get(a.assetNumber) ?? 9999;
          const ib = orderIndex.get(b.assetNumber) ?? 9999;
          if (ia !== ib) return ia - ib;
          return a.assetNumber.localeCompare(b.assetNumber);
        });
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
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export interface PidTagMapping {
  pidTag: string;
  assetNumber: string;
  description: string;
  status: string;
}

/**
 * Fetches P&ID tags from the Rev B extraction register (sole source of truth).
 */
export function useProcessingPidTags() {
  return useQuery({
    queryKey: ["rev-b-pid-tags"],
    queryFn: async (): Promise<PidTagMapping[]> => {
      const { data, error } = await supabase
        .from("rev_b_pid_extraction_register")
        .select("tag_id, description");

      if (error) throw error;
      return (data as any[]).map((r) => ({
        pidTag: r.tag_id,
        assetNumber: "",
        description: r.description,
        status: "mapped",
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
