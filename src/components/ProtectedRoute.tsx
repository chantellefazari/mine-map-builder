import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Tab key this route maps to. Admins always have access. */
  tabKey?: string;
  /** Admin-only route */
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, tabKey, adminOnly }: ProtectedRouteProps) => {
  const { user, isAdmin, allowedTabs, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check tab-level permission (admins always pass)
  if (tabKey && !isAdmin) {
    const hasAccess = allowedTabs.includes(tabKey);
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
