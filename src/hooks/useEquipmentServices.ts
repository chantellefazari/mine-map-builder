import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EquipmentService {
  id: string;
  equipment_name: string;
  asset_number: string;
  current_hours: number;
  service_interval_hours: number;
  last_service_hours: number;
  last_service_date: string | null;
  next_service_due_hours: number;
  service_vendor: string;
  forms_required: string[];
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type EquipmentServiceInsert = Omit<EquipmentService, "id" | "created_at" | "updated_at">;

export const SERVICE_FORM_OPTIONS = [
  "Service Report",
  "JSEA / SWMS",
  "Take 5",
  "Permit to Work",
  "Site Induction Sign-off",
  "Equipment Inspection",
  "Toolbox Talk Record",
] as const;

function computeStatus(currentHours: number, nextDue: number, interval: number): string {
  const remaining = nextDue - currentHours;
  if (remaining <= 0) return "Overdue";
  if (remaining <= interval * 0.1) return "Due Soon";
  return "OK";
}

export function useEquipmentServices() {
  const qc = useQueryClient();
  const key = ["equipment_service_tracking"];

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("equipment_service_tracking")
        .select("*")
        .order("equipment_name", { ascending: true });
      if (error) throw error;
      return data as EquipmentService[];
    },
  });

  const addEquipment = useMutation({
    mutationFn: async (item: EquipmentServiceInsert) => {
      const { error } = await (supabase as any).from("equipment_service_tracking").insert(item);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Equipment added"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateEquipment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EquipmentService> }) => {
      const { error } = await (supabase as any).from("equipment_service_tracking").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Equipment updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteEquipment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("equipment_service_tracking").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Equipment removed"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateHours = useMutation({
    mutationFn: async ({ id, currentHours, interval, lastServiceHours }: { id: string; currentHours: number; interval: number; lastServiceHours: number }) => {
      const nextDue = lastServiceHours + interval;
      const status = computeStatus(currentHours, nextDue, interval);
      const { error } = await (supabase as any)
        .from("equipment_service_tracking")
        .update({ current_hours: currentHours, status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const recordService = useMutation({
    mutationFn: async ({ id, serviceHours, interval }: { id: string; serviceHours: number; interval: number }) => {
      const nextDue = serviceHours + interval;
      const { error } = await (supabase as any)
        .from("equipment_service_tracking")
        .update({
          last_service_hours: serviceHours,
          last_service_date: new Date().toISOString().split("T")[0],
          next_service_due_hours: nextDue,
          current_hours: serviceHours,
          status: "OK",
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success("Service recorded"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { equipment, isLoading, addEquipment, updateEquipment, deleteEquipment, updateHours, recordService };
}
