import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Shutdown {
  id: string;
  name: string;
  shutdown_rev: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string | null;
  start_time: string;
  end_time: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ShutdownVendor {
  id: string;
  shutdown_id: string;
  vendor_code: string;
  vendor_name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  personnel_count: number;
  daily_hours: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ShutdownWorkOrder {
  id: string;
  shutdown_id: string;
  work_order_id: string;
  vendor_id: string | null;
  scheduled_date: string | null;
  line_number: number;
  duration_hours: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export function useShutdowns() {
  const queryClient = useQueryClient();

  const shutdowns = useQuery({
    queryKey: ["shutdowns"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shutdowns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Shutdown[];
    },
  });

  const createShutdown = useMutation({
    mutationFn: async (values: {
      name: string;
      type: string;
      start_date: string;
      end_date?: string;
      start_time?: string;
      end_time?: string;
      notes?: string;
    }) => {
      const { data, error } = await (supabase as any)
        .from("shutdowns")
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data as Shutdown;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shutdowns"] });
      toast.success("Shutdown created");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateShutdown = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Shutdown> }) => {
      const { error } = await (supabase as any)
        .from("shutdowns")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shutdowns"] }),
    onError: (e: any) => toast.error(e.message),
  });

  return { shutdowns: shutdowns.data ?? [], isLoading: shutdowns.isLoading, createShutdown, updateShutdown };
}

export function useShutdownVendors(shutdownId: string | null) {
  const queryClient = useQueryClient();

  const vendors = useQuery({
    queryKey: ["shutdown_vendors", shutdownId],
    enabled: !!shutdownId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shutdown_vendors")
        .select("*")
        .eq("shutdown_id", shutdownId)
        .order("vendor_name");
      if (error) throw error;
      return data as ShutdownVendor[];
    },
  });

  const addVendor = useMutation({
    mutationFn: async (values: Partial<ShutdownVendor> & { shutdown_id: string; vendor_name: string }) => {
      const { data, error } = await (supabase as any)
        .from("shutdown_vendors")
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shutdown_vendors", shutdownId] });
      toast.success("Vendor added");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateVendor = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ShutdownVendor> }) => {
      const { error } = await (supabase as any)
        .from("shutdown_vendors")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shutdown_vendors", shutdownId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const removeVendor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("shutdown_vendors")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shutdown_vendors", shutdownId] });
      toast.success("Vendor removed");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return { vendors: vendors.data ?? [], isLoading: vendors.isLoading, addVendor, updateVendor, removeVendor };
}

export function useShutdownWorkOrders(shutdownId: string | null) {
  const queryClient = useQueryClient();

  const woLinks = useQuery({
    queryKey: ["shutdown_work_orders", shutdownId],
    enabled: !!shutdownId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("shutdown_work_orders")
        .select("*")
        .eq("shutdown_id", shutdownId)
        .order("line_number");
      if (error) throw error;
      return data as ShutdownWorkOrder[];
    },
  });

  const assignWO = useMutation({
    mutationFn: async (values: { shutdown_id: string; work_order_id: string; vendor_id?: string; scheduled_date?: string; duration_hours?: number }) => {
      const { data, error } = await (supabase as any)
        .from("shutdown_work_orders")
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shutdown_work_orders", shutdownId] });
      toast.success("Work order assigned");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ShutdownWorkOrder> }) => {
      const { error } = await (supabase as any)
        .from("shutdown_work_orders")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shutdown_work_orders", shutdownId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const removeAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("shutdown_work_orders")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shutdown_work_orders", shutdownId] });
      toast.success("Work order unassigned");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return { woLinks: woLinks.data ?? [], isLoading: woLinks.isLoading, assignWO, updateAssignment, removeAssignment };
}
