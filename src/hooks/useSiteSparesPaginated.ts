import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SiteSpareItem } from "@/hooks/useSiteSpares";

// Map legacy/variant category names to approved Part Category Codes (TCMG)
const LEGACY_CATEGORY_MAP: Record<string, string> = {
  "Pump Component": "Pumps",
  "Pump": "Pumps",
  "Motor Component": "Motors",
  "Motor": "Motors",
  "Gearbox": "Gearboxes / Reducers",
  "Gearbox Component": "Gearboxes / Reducers",
  "Bearing": "Bearings",
  "Valve": "Valves",
  "Electrical": "Electrical Components",
  "Conveyor Component": "Conveying Components",
  "Conveyor": "Conveying Components",
  "Belt & Transmission": "Conveying Components",
  "Belt / Chain": "Conveying Components",
  "Belt and Chain": "Conveying Components",
  "Belt & Chain": "Conveying Components",
  "Wear Part": "Wear Parts",
  "Liner": "Wear Parts",
  "Structural": "Structural Steel",
  "Hose & Tubing": "Hoses & Pipework",
  "Pipe Fitting": "Hoses & Pipework",
  "Seal": "Seals & Gaskets",
  "Seal / Gasket": "Seals & Gaskets",
  "Filter": "Filters",
  "Pneumatic": "Air & Pneumatic Components",
  "Hydraulic": "Air & Pneumatic Components",
  "Fastener": "Fasteners",
  "Consumable": "Consumables",
  "Safety Equipment": "Safety Equipment",
  "Tooling": "Tooling",
  "Tools & Workshop Equipment": "Tooling",
  "Rigging": "Rigging",
  "PPE": "PPE",
  "Tools": "Tooling",
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
  criticality: string; // client-side only (derived from description)
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
    const [totalRes, lowStockRes, withPhotosRes] = await Promise.all([
      supabase.from("site_spares").select("*", { count: "exact", head: true }),
      supabase
        .from("site_spares")
        .select("*", { count: "exact", head: true })
        .in("status", ["Low Stock", "Out of Stock"]),
      supabase
        .from("site_spares")
        .select("*", { count: "exact", head: true })
        .not("image_urls", "eq", "{}"),
    ]);

    setStats({
      totalItems: totalRes.count ?? 0,
      lowStockCount: lowStockRes.count ?? 0,
      criticalCount: 0, // computed client-side via keyword engine
      withPhotosCount: withPhotosRes.count ?? 0,
    });
  }, []);

  // Fetch a page of filtered data
  const fetchPage = useCallback(
    async (filters: PaginationFilters, pageNum: number) => {
      setLoading(true);

      let query = supabase
        .from("site_spares")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      // Server-side filters
      if (filters.searchQuery.trim()) {
        const term = `%${filters.searchQuery.trim()}%`;
        query = query.or(
          `description.ilike.${term},part_number.ilike.${term},oem_part_number.ilike.${term},bin_location.ilike.${term},manufacturer.ilike.${term}`
        );
      }

      if (filters.category !== "all") {
        const rawCats = getRawCategoriesFor(filters.category);
        query = query.in("category", rawCats);
      }

      if (filters.warehouseArea !== "all") {
        query = query.eq("warehouse_area", filters.warehouseArea);
      }

      if (filters.status !== "all") {
        if (filters.status === "Low Stock") {
          query = query.in("status", ["Low Stock", "Out of Stock"]);
        } else {
          query = query.eq("status", filters.status);
        }
      }

      if (filters.supplier !== "all") {
        query = query.eq("preferred_supplier", filters.supplier);
      }

      if (filters.quickFilter === "lowStock") {
        query = query.in("status", ["Low Stock", "Out of Stock"]);
      } else if (filters.quickFilter === "critical") {
        query = query.eq("is_critical", true);
      }

      // Pagination
      const from = pageNum * pageSize;
      const to = from + pageSize - 1;
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
    [pageSize, toast]
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
