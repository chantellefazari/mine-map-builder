import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, addWeeks, addDays, startOfYear, format, getISOWeek } from "date-fns";

export const WORK_CENTRES = [
  { key: "Mechanical", label: "Mechanical", short: "MECH" },
  { key: "Electrical", label: "Electrical", short: "ELEC" },
  { key: "Mobile & LVS", label: "Mobile & LVS", short: "MOB" },
] as const;

export type WorkCentreKey = typeof WORK_CENTRES[number]["key"];

export interface WeekCapacity {
  personnel: number;
  hoursPerDay: number;
  loadingTarget: number;
}

export const DEFAULT_CAPACITY: Record<string, WeekCapacity> = {
  Mechanical: { personnel: 6, hoursPerDay: 10.5, loadingTarget: 80 },
  Electrical: { personnel: 4, hoursPerDay: 10.5, loadingTarget: 90 },
  "Mobile & LVS": { personnel: 3, hoursPerDay: 10.5, loadingTarget: 80 },
};

const TOTAL_WEEKS = 52;
const CONFIG_KEY = "capacity_grid";

function buildInitialGrid(): Record<string, WeekCapacity[]> {
  const grid: Record<string, WeekCapacity[]> = {};
  for (const wc of WORK_CENTRES) {
    grid[wc.key] = Array.from({ length: TOTAL_WEEKS }, () => ({ ...DEFAULT_CAPACITY[wc.key] }));
  }
  return grid;
}

export interface WeekInfo {
  index: number;
  weekNum: number;
  label: string;
  shortLabel: string;
}

export function buildWeekInfos(year: number): WeekInfo[] {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const infos: WeekInfo[] = [];
  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const ws = startOfWeek(addWeeks(yearStart, w), { weekStartsOn: 1 });
    const we = addDays(ws, 6);
    const wNum = w + 1;
    infos.push({
      index: w,
      weekNum: wNum,
      label: `W${wNum} — ${format(ws, "dd MMM yy")} – ${format(we, "dd MMM yy")}`,
      shortLabel: `W${wNum}`,
    });
  }
  return infos;
}

/** Get the week index (0-based) for a given date within a year */
export function getWeekIndex(date: Date, year: number): number {
  const isoWeek = getISOWeek(date);
  // Clamp to 0-51
  return Math.max(0, Math.min(isoWeek - 1, TOTAL_WEEKS - 1));
}

export function useCapacityGrid() {
  const [grid, setGrid] = useState<Record<string, WeekCapacity[]>>(buildInitialGrid);
  const [loaded, setLoaded] = useState(false);
  const [year] = useState(() => new Date().getFullYear());

  // Load from site_config on mount
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_config")
        .select("config_value")
        .eq("config_key", CONFIG_KEY)
        .maybeSingle();
      
      if (data?.config_value) {
        try {
          const parsed = typeof data.config_value === "string" 
            ? JSON.parse(data.config_value) 
            : data.config_value;
          if (parsed.grid) {
            // Merge with defaults in case new work centres were added
            const merged = buildInitialGrid();
            for (const key of Object.keys(parsed.grid)) {
              if (merged[key] && Array.isArray(parsed.grid[key])) {
                merged[key] = parsed.grid[key].map((w: any, i: number) => ({
                  personnel: w?.personnel ?? merged[key][i].personnel,
                  hoursPerDay: w?.hoursPerDay ?? merged[key][i].hoursPerDay,
                  loadingTarget: w?.loadingTarget ?? merged[key][i].loadingTarget,
                }));
              }
            }
            setGrid(merged);
          }
        } catch { /* use defaults */ }
      }
      setLoaded(true);
    })();
  }, []);

  // Persist to site_config with debounce
  const persist = useCallback(async (newGrid: Record<string, WeekCapacity[]>) => {
    const payload = { grid: newGrid, updatedAt: new Date().toISOString() };
    const { data: existing } = await supabase
      .from("site_config")
      .select("id")
      .eq("config_key", CONFIG_KEY)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("site_config")
        .update({ config_value: payload as any, updated_at: new Date().toISOString() })
        .eq("config_key", CONFIG_KEY);
    } else {
      await supabase
        .from("site_config")
        .insert({ config_key: CONFIG_KEY, config_value: payload as any });
    }
  }, []);

  const updateCell = useCallback((wc: string, weekIdx: number, field: keyof WeekCapacity, val: number) => {
    setGrid(prev => {
      const next = { ...prev };
      const arr = [...next[wc]];
      arr[weekIdx] = { ...arr[weekIdx], [field]: val };
      next[wc] = arr;
      // Persist async
      setTimeout(() => persist(next), 500);
      return next;
    });
  }, [persist]);

  const applyToAll = useCallback((wc: string, values: WeekCapacity) => {
    setGrid(prev => {
      const next = { ...prev };
      next[wc] = Array.from({ length: TOTAL_WEEKS }, () => ({ ...values }));
      setTimeout(() => persist(next), 500);
      return next;
    });
  }, [persist]);

  const applyToRange = useCallback((wc: string, values: WeekCapacity, start: number, end: number) => {
    setGrid(prev => {
      const next = { ...prev };
      const arr = [...next[wc]];
      for (let i = start; i < end; i++) {
        arr[i] = { ...values };
      }
      next[wc] = arr;
      setTimeout(() => persist(next), 500);
      return next;
    });
  }, [persist]);

  /** Get capacity for a specific discipline and date */
  const getCapacityForDate = useCallback((disciplineKey: string, date: Date): WeekCapacity => {
    // Map discipline aliases
    let wcKey = disciplineKey;
    if (disciplineKey === "Mobile & LVs") wcKey = "Mobile & LVS";
    
    const weekIdx = getWeekIndex(date, year);
    return grid[wcKey]?.[weekIdx] ?? DEFAULT_CAPACITY[wcKey] ?? DEFAULT_CAPACITY["Mechanical"];
  }, [grid, year]);

  return {
    grid,
    setGrid,
    loaded,
    year,
    updateCell,
    applyToAll,
    applyToRange,
    persist,
    getCapacityForDate,
  };
}
