import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  allowedTabs: string[];
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowedTabs, setAllowedTabs] = useState<string[]>([]);

  const fetchPermissions = async (userId: string) => {
    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    const adminStatus = !!roleData;
    setIsAdmin(adminStatus);

    if (adminStatus) {
      // Admins get access to all tabs
      setAllowedTabs(["all"]);
    } else {
      // Fetch granted tabs for this user
      const { data: tabData } = await supabase
        .from("user_tab_permissions")
        .select("tab_key")
        .eq("user_id", userId)
        .eq("granted", true);

      setAllowedTabs(tabData?.map((t) => t.tab_key) ?? []);
    }
  };

  const refreshPermissions = async () => {
    if (user) {
      await fetchPermissions(user.id);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let initialUserId: string | null = null;

    // Set up auth listener FIRST (per Supabase best practice)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Skip if this is the same user we already loaded permissions for during init
          if (newSession.user.id === initialUserId) {
            initialUserId = null; // Clear so future changes still trigger
            return;
          }
          setTimeout(() => {
            if (isMounted) fetchPermissions(newSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setAllowedTabs([]);
          if (!isMounted) return;
          setLoading(false);
        }
      }
    );

    // Then fetch initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          initialUserId = currentSession.user.id;
          await fetchPermissions(currentSession.user.id);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAllowedTabs([]);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, allowedTabs, signIn, signOut, refreshPermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
