import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ShutdownPMRow {
  id: string;
  area: string;
  discipline: "MS" | "ES";
  name: string;
  frequency: string;
  estimated_hours: number;
  tc_asset_match: string;
  tc_pid_tag: string;
  sort_order: number;
}

export interface ShutdownArea {
  area: string;
  mechanical: ShutdownPMRow[];
  electrical: ShutdownPMRow[];
}

export function useShutdownPMRequirements() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["shutdown-pm-requirements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shutdown_pm_requirements")
        .select("*")
        .order("area")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as ShutdownPMRow[];
    },
  });

  // Group into areas
  const areas: ShutdownArea[] = [];
  const areaMap = new Map<string, ShutdownArea>();
  // Preserve order from data
  const areaOrder = [
    "Ore Handling (Feed / Reclaim)",
    "Grinding (Comminution)",
    "Leaching (CIP)",
    "Thickening",
    "Tailings / Filtering",
    "Gold Room / Elution",
    "Reagents",
    "Water",
  ];

  for (const areaName of areaOrder) {
    areaMap.set(areaName, { area: areaName, mechanical: [], electrical: [] });
  }

  for (const row of rows) {
    let entry = areaMap.get(row.area);
    if (!entry) {
      entry = { area: row.area, mechanical: [], electrical: [] };
      areaMap.set(row.area, entry);
    }
    if (row.discipline === "MS") entry.mechanical.push(row);
    else entry.electrical.push(row);
  }

  for (const areaName of areaOrder) {
    const entry = areaMap.get(areaName);
    if (entry && (entry.mechanical.length > 0 || entry.electrical.length > 0)) {
      areas.push(entry);
    }
  }
  // Add any areas not in the predefined order
  for (const [name, entry] of areaMap) {
    if (!areaOrder.includes(name) && (entry.mechanical.length > 0 || entry.electrical.length > 0)) {
      areas.push(entry);
    }
  }

  return { areas, rows, isLoading };
}
