/**
 * Hook that joins shutdown_work_orders + work_orders + processing_plant_assets_rev_b
 * to produce live ShutdownWorkPackage[] for the Orchestrator.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import type { ShutdownWorkPackage, WPStatus } from "@/components/work-order-centre/shutdown-orchestrator/shutdownData";

/* ── Area code → label mapping (matches asset hierarchy) ── */
const AREA_CODE_TO_LABEL: Record<string, string> = {
  SITE: "Site Infrastructure",
  UTL: "Utilities & Power",
  COM: "Comminution / Process",
  REC: "Gold Recovery",
  TAIL: "Tailings",
  SUP: "Support Services",
};

function resolveArea(areaCode: string | null | undefined): string {
  if (!areaCode) return "Site Infrastructure";
  const upper = areaCode.toUpperCase();
  return AREA_CODE_TO_LABEL[upper] || "Site Infrastructure";
}

function mapWoStatusToWPStatus(woStatus: string): WPStatus {
  switch (woStatus) {
    case "Completed":
    case "Closed":
      return "Complete";
    case "Active":
      return "Active";
    case "On Hold":
      return "Blocked";
    case "Scheduled":
    case "Planned":
      return "Ready";
    default:
      return "Not Started";
  }
}

function mapPriority(p: string): boolean {
  return p === "P1" || p === "P2" || p === "Critical" || p === "High";
}

export function useShutdownPackages(shutdownId: string | null) {
  const queryClient = useQueryClient();

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["shutdown_packages", shutdownId],
    enabled: !!shutdownId,
    queryFn: async () => {
      // 1. Get shutdown_work_orders for this shutdown
      const { data: links, error: linkErr } = await (supabase as any)
        .from("shutdown_work_orders")
        .select("*")
        .eq("shutdown_id", shutdownId)
        .order("line_number");
      if (linkErr) throw linkErr;
      if (!links || links.length === 0) return [];

      // 2. Get the work orders
      const woIds = links.map((l: any) => l.work_order_id);
      const { data: workOrders, error: woErr } = await (supabase as any)
        .from("work_orders")
        .select("*")
        .in("id", woIds);
      if (woErr) throw woErr;

      // 3. Get unique asset_ids to look up areas
      const assetIds = [...new Set((workOrders || []).map((wo: any) => wo.asset_id).filter(Boolean))];
      let assetMap: Record<string, string> = {};
      if (assetIds.length > 0) {
        const { data: assets } = await (supabase as any)
          .from("processing_plant_assets_rev_b")
          .select("asset_number, area_code")
          .in("asset_number", assetIds);
        if (assets) {
          for (const a of assets) {
            assetMap[a.asset_number] = a.area_code;
          }
        }
      }

      // 4. Combine into ShutdownWorkPackage shape
      const woMap = new Map((workOrders || []).map((wo: any) => [wo.id, wo]));
      
      return links.map((link: any, idx: number) => {
        const wo = woMap.get(link.work_order_id) as any;
        if (!wo) return null;

        const areaCode = assetMap[wo.asset_id] || "";
        const area = resolveArea(areaCode);
        const status = mapWoStatusToWPStatus(wo.status);

        return {
          // IDs
          _linkId: link.id,
          _workOrderId: wo.id,
          id: wo.wo_number || `WP-${String(idx + 1).padStart(3, "0")}`,
          title: wo.problem_description || wo.wo_number || "Untitled",
          area,
          trade: wo.trade || "Mechanical",
          plannedStart: link.scheduled_date || "",
          plannedFinish: link.scheduled_date || "",
          durationHrs: Number(link.duration_hours) || 0,
          status,
          pctComplete: status === "Complete" ? 100 : 0,
          criticalPath: false,
          supervisor: wo.supervisor_name || wo.assigned_to || "",
          shift: "Day",
          nextAction: "",
          blockerType: "",
          blockerDescription: "",
          blockerOwner: "",
          blockerETA: "",
          delayReason: "",
          predecessors: [] as string[],
          successors: [] as string[],
          handoverNotes: wo.work_performed || "",
          priority: mapPriority(wo.priority),
          col: 0,
          row: idx,
          delayHrs: 0,
          nearCritical: false,
          floatHrs: 0,
          // Extra fields for UI
          scheduledDate: link.scheduled_date || null,
          vendorId: link.vendor_id || null,
          woStatus: wo.status,
          woPriority: wo.priority,
          assetId: wo.asset_id || "",
        };
      }).filter(Boolean);
    },
  });

  const packages: (ShutdownWorkPackage & { 
    _linkId: string; 
    _workOrderId: string; 
    scheduledDate: string | null;
    vendorId: string | null;
    woStatus: string;
    woPriority: string;
    assetId: string;
  })[] = useMemo(() => rawData || [], [rawData]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["shutdown_packages", shutdownId] });
    queryClient.invalidateQueries({ queryKey: ["shutdown_work_orders", shutdownId] });
  };

  return { packages, isLoading, invalidate };
}
