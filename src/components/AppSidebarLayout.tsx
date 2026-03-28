import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  TreePine, Wrench, ClipboardList, Warehouse, BookOpen,
  ShoppingCart, Building2, CalendarClock, LogOut, Shield,
  PackageSearch, FileInput, Home, Box, Brain, ChevronLeft,
  ChevronRight, Radar, ClipboardCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";

const NAV_ITEMS = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Maintenance Foundations", icon: BookOpen, href: "/maintenance-foundations", tabKey: "maintenance-foundations" },
  { title: "Asset Tree", icon: TreePine, href: "/asset-tree", tabKey: "asset-tree" },
  { title: "PM Design", icon: Wrench, href: "/pm-design", tabKey: "pm-design" },
  { title: "Work Orders", icon: ClipboardList, href: "/work-order-templates", tabKey: "work-order-templates" },
  { title: "Work Requests", icon: FileInput, href: "/work-request-templates", tabKey: "work-order-templates" },
  { title: "Suppliers & Procurement", icon: ShoppingCart, href: "/suppliers-procurement", tabKey: "suppliers-procurement" },
  { title: "Stores & Warehouse", icon: Building2, href: "/stores-warehouse-design", tabKey: "stores-warehouse-design" },
  { title: "Site Spares", icon: Warehouse, href: "/site-spares", tabKey: "site-spares" },
  { title: "Planning & Revision", icon: CalendarClock, href: "/planning-revision", tabKey: "planning-revision" },
  { title: "PO Register", icon: PackageSearch, href: "/po-tracker", tabKey: "po-tracker" },
  { title: "Purchase Requests", icon: FileInput, href: "/purchase-requests", tabKey: "purchase-requests" },
  { title: "3D Concepts", icon: Box, href: "/3d-concepts", tabKey: "3d-concepts" },
  { title: "Plant Intelligence", icon: Brain, href: "/plant-intelligence", tabKey: "plant-intelligence" },
  { title: "Mission Control", icon: Radar, href: "/mission-control", tabKey: "mission-control" },
  { title: "Work Order Centre", icon: ClipboardList, href: "/work-order-centre", tabKey: "work-order-centre" },
  { title: "Implementation Readiness", icon: ClipboardCheck, href: "/implementation-readiness", tabKey: "implementation-readiness" },
];

export function AppSidebarLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, allowedTabs, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.tabKey) return true;
    if (isAdmin) return true;
    return allowedTabs.includes(item.tabKey);
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen flex flex-col border-r border-border bg-card transition-all duration-200 z-30",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 py-4 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">TC</span>
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-foreground truncate">TCMG Framework</span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex items-center gap-2.5 w-full rounded-md text-sm transition-colors",
                  collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-2 py-3 space-y-1">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className={cn(
                "flex items-center gap-2.5 w-full rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                collapsed ? "justify-center px-2 py-2" : "px-3 py-2"
              )}
              title={collapsed ? "Admin Panel" : undefined}
            >
              <Shield className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </button>
          )}
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-2.5 w-full rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
              collapsed ? "justify-center px-2 py-2" : "px-3 py-2"
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center justify-center w-full rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 py-1.5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* User info */}
          {!collapsed && user && (
            <p className="text-[10px] text-muted-foreground truncate px-3 pt-1">
              {user.email}
            </p>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Thin top bar */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm px-4 py-2 flex items-center justify-end gap-2">
          <NotificationBell />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
