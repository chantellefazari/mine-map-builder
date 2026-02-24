import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Notification {
  id: string;
  user_email: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  pr_id: string | null;
  created_at: string;
}

const QUERY_KEY = ["notifications"];

export function useNotifications(userEmail?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...QUERY_KEY, userEmail],
    queryFn: async (): Promise<Notification[]> => {
      if (!userEmail) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as unknown as Notification[];
    },
    enabled: !!userEmail,
  });

  // Realtime subscription
  useEffect(() => {
    if (!userEmail) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const notif = payload.new as Notification;
          if (notif.user_email === userEmail) {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, userEmail] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userEmail, queryClient]);

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, userEmail] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true } as any)
        .eq("user_email", userEmail)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, userEmail] }),
  });

  const createNotification = async (notif: { user_email: string; title: string; message: string; link?: string; pr_id?: string }) => {
    const { error } = await supabase.from("notifications").insert({
      user_email: notif.user_email,
      title: notif.title,
      message: notif.message,
      link: notif.link || "",
      pr_id: notif.pr_id || null,
    } as any);
    if (error) throw error;
  };

  const unreadCount = query.data?.filter((n) => !n.is_read).length ?? 0;

  return { notifications: query.data ?? [], unreadCount, isLoading: query.isLoading, markRead, markAllRead, createNotification };
}
