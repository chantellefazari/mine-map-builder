/**
 * PM Auto-Generation Hook
 *
 * Queries pm_master_list, calculates occurrence dates based on frequency,
 * checks for existing PM WOs, and bulk-creates missing WO-12xxxx entries
 * with scheduled_date pre-populated so they appear directly in the calendar.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addDays, startOfWeek, format, isWithinInterval } from "date-fns";

interface PMMasterRow {
  id: string;
  pm_name: string;
  frequency: string;
  discipline: string;
  asset_number: string;
  status: string;
  estimated_duration: string;
  equipment_type: string;
}

/** Anchor date for PM scheduling: Wednesday 26 March 2025 */
const PM_ANCHOR = new Date("2025-03-26");

function freqToDays(freq: string): number {
  if (!freq) return 28;
  const lower = freq.toLowerCase().trim();
  if (lower === "daily") return 1;
  const match = lower.match(/^(\d+)\s*week/i);
  if (match) return parseInt(match[1]) * 7;
  if (lower.includes("month")) return 30;
  if (lower.includes("quarter") || lower.includes("13")) return 91;
  if (lower.includes("year") || lower.includes("52")) return 364;
  if (lower.includes("26")) return 182;
  return 28;
}

/**
 * Generate occurrence dates for a PM within a given window.
 */
function getOccurrences(frequency: string, rangeStart: Date, rangeEnd: Date): Date[] {
  const freqDays = freqToDays(frequency);
  const dates: Date[] = [];

  if (freqDays === 1) {
    // Daily: every day in range
    let d = new Date(rangeStart);
    while (d <= rangeEnd) {
      dates.push(new Date(d));
      d = addDays(d, 1);
    }
    return dates;
  }

  // Start from anchor and step forward
  let d = new Date(PM_ANCHOR);
  while (d <= rangeEnd) {
    if (d >= rangeStart) {
      dates.push(new Date(d));
    }
    d = addDays(d, freqDays);
  }
  return dates;
}

/**
 * Build a fingerprint for checking if a PM WO already exists for a given date.
 * We match on: problem_description contains PM name AND scheduled_date matches.
 */
function pmFingerprint(pmName: string, date: string): string {
  return `${pmName}::${date}`;
}

export interface PMGenerateOptions {
  /** Start of the generation window */
  rangeStart: Date;
  /** End of the generation window */
  rangeEnd: Date;
  /** If true, suppress toast notifications (used for auto-generation) */
  silent?: boolean;
}

export function usePMAutoGenerate() {
  const queryClient = useQueryClient();

  const generate = useMutation({
    mutationFn: async (options: PMGenerateOptions) => {
      const { rangeStart, rangeEnd } = options;

      // 1. Fetch all active PMs
      const { data: pms, error: pmError } = await (supabase as any)
        .from("pm_master_list")
        .select("id, pm_name, frequency, discipline, asset_number, status, estimated_duration, equipment_type")
        .eq("status", "Active");

      if (pmError) throw pmError;
      if (!pms || pms.length === 0) {
        toast.info("No active PM templates found");
        return { created: 0, skipped: 0 };
      }

      // 2. Fetch existing PM work orders in the date range to avoid duplicates
      const startStr = format(rangeStart, "yyyy-MM-dd");
      const endStr = format(rangeEnd, "yyyy-MM-dd");

      const { data: existingWOs, error: woError } = await (supabase as any)
        .from("work_orders")
        .select("id, problem_description, scheduled_date, wo_number")
        .eq("work_type", "PM")
        .gte("scheduled_date", startStr)
        .lte("scheduled_date", endStr);

      if (woError) throw woError;

      // Build set of existing fingerprints
      const existingFingerprints = new Set<string>();
      for (const wo of existingWOs || []) {
        // Extract PM name from "PM: <name> (<frequency>)"
        const match = wo.problem_description?.match(/^PM:\s*(.+?)\s*\(/);
        if (match && wo.scheduled_date) {
          existingFingerprints.add(pmFingerprint(match[1].trim(), wo.scheduled_date));
        }
      }

      // 3. Calculate all needed WOs
      const toCreate: Array<{
        pmName: string;
        frequency: string;
        discipline: string;
        assetNumber: string;
        scheduledDate: string;
        estimatedDuration: string;
      }> = [];

      for (const pm of pms as PMMasterRow[]) {
        const occurrences = getOccurrences(pm.frequency, rangeStart, rangeEnd);
        for (const occ of occurrences) {
          const dateStr = format(occ, "yyyy-MM-dd");
          const fp = pmFingerprint(pm.pm_name, dateStr);
          if (!existingFingerprints.has(fp)) {
            toCreate.push({
              pmName: pm.pm_name,
              frequency: pm.frequency,
              discipline: pm.discipline,
              assetNumber: pm.asset_number || "",
              scheduledDate: dateStr,
              estimatedDuration: pm.estimated_duration || "",
            });
          }
        }
      }

      if (toCreate.length === 0) {
        return { created: 0, skipped: (existingWOs || []).length };
      }

      // 4. Bulk-create work orders sequentially (each needs next_wo_number)
      let created = 0;
      const batchSize = 10;

      for (let i = 0; i < toCreate.length; i += batchSize) {
        const batch = toCreate.slice(i, i + batchSize);

        // Allocate WO numbers for this batch
        const promises = batch.map(async (item) => {
          try {
            // Get next WO number
            const { data: woNumber, error: numError } = await (supabase as any)
              .rpc("next_wo_number", { p_work_type: "PM" });
            if (numError) throw numError;

            // Determine trade from discipline
            const trade = item.discipline || "Mechanical";

            // Create the work order
            const { error: insertError } = await (supabase as any)
              .from("work_orders")
              .insert({
                wo_number: woNumber,
                work_type: "PM",
                status: "Scheduled",
                problem_description: `PM: ${item.pmName} (${item.frequency})`,
                asset_id: item.assetNumber,
                trade,
                scheduled_date: item.scheduledDate,
                required_tooling: '[""]',
              });

            if (insertError) throw insertError;
            created++;
          } catch (err) {
            console.error(`Failed to create PM WO for ${item.pmName} on ${item.scheduledDate}:`, err);
          }
        });

        await Promise.all(promises);
      }

      return { created, skipped: toCreate.length - created };
    },
    onSuccess: (result, variables) => {
      if (result) {
        queryClient.invalidateQueries({ queryKey: ["work_orders"] });
        if (variables.silent) return;
        if (result.created > 0) {
          toast.success(`${result.created} PM work order${result.created !== 1 ? "s" : ""} auto-generated and scheduled`);
        } else {
          toast.info("All PM work orders for this period already exist");
        }
      }
    },
    onError: (err: any, variables) => {
      if (variables?.silent) return;
      toast.error(`PM generation failed: ${err.message}`);
    },
  });

  return { generate };
}
