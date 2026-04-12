/**
 * Hook that fetches ALL work_order_parts in a single query and computes
 * per-WO material readiness status for the Advanced Planner.
 * 
 * Statuses:
 *  🟢 Ready       – all parts On Site / In Laydown Yard
 *  🟡 Partial     – some parts received, some still pending
 *  🔴 Awaiting    – parts exist but none received yet
 *  🟠 PO Required – parts exist with status "Not Ordered"
 *  ⚪ No Parts    – WO has no parts rows (or confirmed "No Parts Required")
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export type MaterialStatus = "Ready" | "Partial" | "Awaiting" | "PO Required" | "No Parts";

export interface WOMaterialSummary {
  workOrderId: string;
  status: MaterialStatus;
  totalParts: number;
  partsReady: number;
  partsOrdered: number;
  partsNotOrdered: number;
}

const READY_STATUSES = ["On Site", "In Laydown Yard", "Installed"];

export function useMaterialReadiness() {
  const { data: rawParts, isLoading } = useQuery({
    queryKey: ["all_work_order_parts_readiness"],
    queryFn: async () => {
      // Fetch all parts — typically < 5000 rows on a mine site
      const all: any[] = [];
      let from = 0;
      const PAGE = 1000;
      while (true) {
        const { data, error } = await (supabase as any)
          .from("work_order_parts")
          .select("work_order_id, status")
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < PAGE) break;
        from += PAGE;
      }
      return all as { work_order_id: string; status: string }[];
    },
    staleTime: 60_000, // 1 min cache
  });

  const readinessMap = useMemo(() => {
    const map = new Map<string, WOMaterialSummary>();
    if (!rawParts) return map;

    // Group by work_order_id
    const grouped = new Map<string, { status: string }[]>();
    for (const p of rawParts) {
      if (!grouped.has(p.work_order_id)) grouped.set(p.work_order_id, []);
      grouped.get(p.work_order_id)!.push(p);
    }

    for (const [woId, parts] of grouped) {
      const totalParts = parts.length;
      const partsReady = parts.filter(p => READY_STATUSES.includes(p.status)).length;
      const partsNotOrdered = parts.filter(p => p.status === "Not Ordered").length;
      const partsOrdered = parts.filter(p => p.status === "Ordered").length;

      let status: MaterialStatus;
      if (totalParts === 0) {
        status = "No Parts";
      } else if (partsReady === totalParts) {
        status = "Ready";
      } else if (partsNotOrdered === totalParts) {
        status = "PO Required";
      } else if (partsReady > 0) {
        status = "Partial";
      } else {
        status = "Awaiting";
      }

      map.set(woId, { workOrderId: woId, status, totalParts, partsReady, partsOrdered, partsNotOrdered });
    }
    return map;
  }, [rawParts]);

  /** Get readiness for a specific WO id */
  const getReadiness = (workOrderId: string): WOMaterialSummary => {
    return readinessMap.get(workOrderId) || {
      workOrderId,
      status: "No Parts" as MaterialStatus,
      totalParts: 0,
      partsReady: 0,
      partsOrdered: 0,
      partsNotOrdered: 0,
    };
  };

  return { readinessMap, getReadiness, isLoading };
}
