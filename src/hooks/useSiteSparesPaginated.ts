import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SiteSpareItem } from "@/hooks/useSiteSpares";
import { classifyCriticality, type CriticalityLevel } from "@/utils/criticalityClassification";

/**
 * Legacy → TCMG Category Normalization Map
 *
 * Canonical 25-category TCMG taxonomy. Must stay in sync with
 * src/hooks/useSiteSpares.ts and src/utils/categoryClassification.ts.
 */
const LEGACY_CATEGORY_MAP: Record<string, string> = {
  // ── CC 01 Pump Component ──────────────────────────────────────────────────
  "Pump": "Pump Component",
  "Pump Component": "Pump Component",

  // ── CC 02 Motor Component ─────────────────────────────────────────────────
  "Motor": "Motor Component",
  "Motor Component": "Motor Component",

  // ── CC 03 Gearbox ─────────────────────────────────────────────────────────
  "Gearbox": "Gearbox",
  "Gearbox Component": "Gearbox",

  // ── CC 04 Bearing ─────────────────────────────────────────────────────────
  "Bearing": "Bearing",
  "Bearings": "Bearing",

  // ── CC 05 Valve ───────────────────────────────────────────────────────────
  "Valve": "Valve",
  "Valves": "Valve",

  // ── CC 07 Electrical ──────────────────────────────────────────────────────
  "Electrical": "Electrical",
  "Electrical Components": "Electrical",

  // ── CC 08 Conveyor Component ──────────────────────────────────────────────
  "Conveyor": "Conveyor Component",
  "Conveyor Component": "Conveyor Component",
  "Conveying Components": "Conveyor Component",
  "Belt & Transmission": "Conveyor Component",
  "Belt / Chain": "Conveyor Component",
  "Belt and Chain": "Conveyor Component",
  "Belt & Chain": "Conveyor Component",

  // ── CC 09 Wear Parts ──────────────────────────────────────────────────────
  "Wear Part": "Wear Parts",
  "Wear Parts": "Wear Parts",
  "Liner": "Wear Parts",

  // ── CC 10 Mechanical ──────────────────────────────────────────────────────
  "Mechanical": "Mechanical",

  // ── CC 10b Structural Steel ───────────────────────────────────────────────
  "Structural": "Structural Steel",
  "Structural Steel": "Structural Steel",

  // ── CC 11 Pipe Fitting ────────────────────────────────────────────────────
  "Pipe Fitting": "Pipe Fitting",
  "Hose & Tubing": "Pipe Fitting",
  "Hoses & Pipework": "Pipe Fitting",

  // ── CC 12 Seal ────────────────────────────────────────────────────────────
  "Seal": "Seal",
  "Seal / Gasket": "Seal",
  "Seals & Gaskets": "Seal",

  // ── CC 13 Filter ──────────────────────────────────────────────────────────
  "Filter": "Filter",
  "Filters": "Filter",

  // ── CC 14 Lubrication System ──────────────────────────────────────────────
  "Lubrication": "Lubrication System",
  "Lubrication System": "Lubrication System",

  // ── CC 15 Air & Pneumatic ─────────────────────────────────────────────────
  "Pneumatic": "Air & Pneumatic",
  "Hydraulic": "Air & Pneumatic",
  "Air & Pneumatic": "Air & Pneumatic",
  "Air & Pneumatic Components": "Air & Pneumatic",

  // ── CC 16 Tanks & Vessels ─────────────────────────────────────────────────
  "Tanks & Vessels": "Tanks & Vessels",

  // ── CC 17 Safety Equipment ────────────────────────────────────────────────
  "Safety Equipment": "Safety Equipment",

  // ── CC 18 Power Generation ────────────────────────────────────────────────
  "Power Generation": "Power Generation",

  // ── CC 19 Tooling ─────────────────────────────────────────────────────────
  "Tooling": "Tooling",
  "Tools": "Tooling",
  "Tools & Workshop Equipment": "Tooling",

  // ── CC 19b Rigging ────────────────────────────────────────────────────────
  "Rigging": "Rigging",

  // ── CC 19c PPE ────────────────────────────────────────────────────────────
  "PPE": "PPE",

  // ── CC 20 OEM Assembly ────────────────────────────────────────────────────
  "OEM Assembly": "OEM Assembly",

  // ── CC 21 Fastener ────────────────────────────────────────────────────────
  "Fastener": "Fastener",
  "Fasteners": "Fastener",

  // ── CC 22 Consumables (catch-all) ─────────────────────────────────────────
  "Consumable": "Consumables",
  "Consumables": "Consumables",
  "General": "Consumables",
  "Unknown / TBC": "Consumables",
  "Unknown / To Be Confirmed": "Consumables",
};

const normalizeCategory = (category: string | null): string => {
  if (!category) return "Consumables";
  return LEGACY_CATEGORY_MAP[category] || category;
};

// Reverse lookup: given a normalized category, return all raw DB values that map to it
const getRawCategoriesFor = (normalized: string): string[] => {
  const raw: string[] = [normalized]; // the normalized name itself may exist in DB
  for (const [legacy, mapped] of Object.entries(LEGACY_CATEGORY_MAP)) {
    if (mapped === normalized && !raw.includes(legacy)) {
      raw.push(legacy);
    }
  }
  return raw;
};

export interface PaginationFilters {
  searchQuery: string;
  category: string;
  warehouseArea: string;
  status: string;
  supplier: string;
  criticality: string; // HIGH/MEDIUM/LOW across full filtered dataset
  quickFilter: "all" | "lowStock" | "critical";
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface SparesStats {
  totalItems: number;
  lowStockCount: number;
  criticalCount: number;
  withPhotosCount: number;
}

const DEFAULT_PAGE_SIZE = 60;

export const useSiteSparesPaginated = () => {
  const [spares, setSpares] = useState<SiteSpareItem[]>([]);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [stats, setStats] = useState<SparesStats>({
    totalItems: 0,
    lowStockCount: 0,
    criticalCount: 0,
    withPhotosCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const { toast } = useToast();

  // Fetch stats (lightweight — no row data)
  const fetchStats = useCallback(async () => {
    const [totalRes, lowStockRes, criticalRes, withPhotosRes] = await Promise.all([
      supabase.from("site_spares").select("*", { count: "exact", head: true }),
      supabase
        .from("site_spares")
        .select("*", { count: "exact", head: true })
        .in("status", ["Low Stock", "Out of Stock"]),
      supabase
        .from("site_spares")
        .select("*", { count: "exact", head: true })
        .eq("is_critical", true),
      supabase
        .from("site_spares")
        .select("*", { count: "exact", head: true })
        .not("image_urls", "eq", "{}"),
    ]);

    setStats({
      totalItems: totalRes.count ?? 0,
      lowStockCount: lowStockRes.count ?? 0,
      criticalCount: criticalRes.count ?? 0,
      withPhotosCount: withPhotosRes.count ?? 0,
    });
  }, []);

  const applyServerFilters = useCallback((query: any, filters: PaginationFilters) => {
    let next = query;

    if (filters.searchQuery.trim()) {
      const term = `%${filters.searchQuery.trim()}%`;
      next = next.or(
        `description.ilike.${term},part_number.ilike.${term},oem_part_number.ilike.${term},bin_location.ilike.${term},manufacturer.ilike.${term}`
      );
    }

    if (filters.category !== "all") {
      const rawCats = getRawCategoriesFor(filters.category);
      next = next.in("category", rawCats);
    }

    if (filters.warehouseArea !== "all") {
      next = next.eq("warehouse_area", filters.warehouseArea);
    }

    if (filters.status !== "all") {
      if (filters.status === "Low Stock") {
        next = next.in("status", ["Low Stock", "Out of Stock"]);
      } else {
        next = next.eq("status", filters.status);
      }
    }

    if (filters.supplier !== "all") {
      next = next.eq("preferred_supplier", filters.supplier);
    }

    if (filters.quickFilter === "lowStock") {
      next = next.in("status", ["Low Stock", "Out of Stock"]);
    } else if (filters.quickFilter === "critical") {
      next = next.eq("is_critical", true);
    }

    return next;
  }, []);

  // Fetch a page of filtered data
  const fetchPage = useCallback(
    async (filters: PaginationFilters, pageNum: number) => {
      setLoading(true);

      const from = pageNum * pageSize;
      const to = from + pageSize - 1;

      // For HIGH/MEDIUM/LOW filtering, we must classify across the full filtered dataset,
      // not just the current server page.
      if (filters.criticality !== "all") {
        const batchSize = 1000;
        let offset = 0;
        const allRows: SiteSpareItem[] = [];

        while (true) {
          let batchQuery = supabase
            .from("site_spares")
            .select("*")
            .order("created_at", { ascending: true })
            .order("id", { ascending: true });

          batchQuery = applyServerFilters(batchQuery, filters);
          batchQuery = batchQuery.range(offset, offset + batchSize - 1);

          const { data, error } = await batchQuery;

          if (error) {
            console.error("Error fetching spares page:", error);
            toast({
              title: "Error",
              description: "Failed to load inventory data.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }

          if (!data || data.length === 0) break;

          const normalizedBatch = data.map((row: any) => ({
            ...row,
            category: normalizeCategory(row.category),
            image_urls: (row.image_urls ?? []) as string[],
          })) as SiteSpareItem[];

          allRows.push(...normalizedBatch);

          if (data.length < batchSize) break;
          offset += batchSize;
        }

        const level = filters.criticality as CriticalityLevel;
        const criticalityFiltered = allRows.filter(
          (row) => classifyCriticality(row.description) === level
        );

        setTotalFiltered(criticalityFiltered.length);
        setSpares(criticalityFiltered.slice(from, to + 1));
        setLoading(false);
        return;
      }

      let query = supabase
        .from("site_spares")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      query = applyServerFilters(query, filters);
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching spares page:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const normalized = (data || []).map((row: any) => ({
        ...row,
        category: normalizeCategory(row.category),
        image_urls: (row.image_urls ?? []) as string[],
      })) as SiteSpareItem[];

      setSpares(normalized);
      setTotalFiltered(count ?? 0);
      setLoading(false);
    },
    [applyServerFilters, pageSize, toast]
  );

  // Update a spare (optimistic local update)
  const updateSpare = async (id: string, updates: Partial<SiteSpareItem>) => {
    const { error } = await supabase
      .from("site_spares")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating spare:", error);
      return false;
    }

    setSpares((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    return true;
  };

  // Delete a spare
  const deleteSpare = async (id: string) => {
    const { error } = await supabase
      .from("site_spares")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting spare:", error);
      return false;
    }

    setSpares((prev) => prev.filter((s) => s.id !== id));
    setTotalFiltered((prev) => prev - 1);
    return true;
  };

  // Fetch dynamic filter options (categories, suppliers)
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSuppliers, setAvailableSuppliers] = useState<string[]>([]);

  const fetchFilterOptions = useCallback(async () => {
    const [catRes, supRes] = await Promise.all([
      supabase.from("site_spares").select("category"),
      supabase.from("site_spares").select("preferred_supplier"),
    ]);

    if (catRes.data) {
      const cats = [
        ...new Set(
          catRes.data
            .map((r: any) => normalizeCategory(r.category))
            .filter(Boolean)
        ),
      ].sort() as string[];
      setAvailableCategories(cats);
    }

    if (supRes.data) {
      const sups = [
        ...new Set(
          supRes.data
            .map((r: any) => r.preferred_supplier)
            .filter(Boolean)
        ),
      ].sort() as string[];
      setAvailableSuppliers(sups);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchFilterOptions();
  }, [fetchStats, fetchFilterOptions]);

  return {
    spares,
    totalFiltered,
    stats,
    loading,
    page,
    pageSize,
    setPage,
    fetchPage,
    fetchStats,
    fetchFilterOptions,
    updateSpare,
    deleteSpare,
    availableCategories,
    availableSuppliers,
  };
};
