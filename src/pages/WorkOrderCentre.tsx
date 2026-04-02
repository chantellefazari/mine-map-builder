import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Clock, ClipboardList, Truck, FileText, Wrench,
  Calendar, Package, Shield, AlertTriangle, BookOpen, Settings,
  HelpCircle, ChevronLeft, ChevronRight, ArrowLeft, BarChart3,
} from "lucide-react";
import { WOCDashboard } from "@/components/work-order-centre/WOCDashboard";
import { WOCWorkRequests } from "@/components/work-order-centre/WOCWorkRequests";
import { WOCWorkOrderManagement } from "@/components/work-order-centre/WOCWorkOrderManagement";
import { WOCSchedule } from "@/components/work-order-centre/WOCSchedule";
import { WOCWorkspace } from "@/components/work-order-centre/WOCWorkspace";



export type WOCView =
  | "dashboard"
  | "shift-handover"
  | "daily-works"
  | "lv-prestart"
  | "work-requests"
  | "wo-management"
  | "schedule"
  | "performance"
  | "inventory"
  | "take5"
  | "incidents"
  | "audit-register"
  | "workspace";

interface SidebarSection {
  label: string;
  items: { key: WOCView; label: string; icon: React.ElementType }[];
}

const SECTIONS: SidebarSection[] = [
  {
    label: "Plant",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "shift-handover", label: "Shift Handover", icon: Clock },
      { key: "daily-works", label: "Daily Works", icon: ClipboardList },
      { key: "lv-prestart", label: "LV Prestart", icon: Truck },
    ],
  },
  {
    label: "Work Orders",
    items: [
      { key: "work-requests", label: "Work Requests", icon: FileText },
      { key: "wo-management", label: "Work Order Management", icon: Wrench },
      { key: "schedule", label: "Schedule", icon: Calendar },
      { key: "performance", label: "Performance", icon: BarChart3 },
    ],
  },
  {
    label: "Spare Parts",
    items: [{ key: "inventory", label: "Inventory", icon: Package }],
  },
  {
    label: "Quick Access",
    items: [
      { key: "take5", label: "Take 5", icon: Shield },
      { key: "incidents", label: "Incidents", icon: AlertTriangle },
      { key: "audit-register", label: "Audit Register", icon: BookOpen },
    ],
  },
];

const PLACEHOLDER_VIEWS: WOCView[] = [
  "shift-handover", "daily-works", "lv-prestart", "inventory",
  "take5", "incidents", "audit-register", 
];

export default function WorkOrderCentre() {
  const [view, setView] = useState<WOCView>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [workspaceWoId, setWorkspaceWoId] = useState<string | null>(null);
  const [returnView, setReturnView] = useState<WOCView>("wo-management");

  const openWorkspace = useCallback((woId: string, from?: WOCView) => {
    setWorkspaceWoId(woId);
    setReturnView(from ?? "wo-management");
    setView("workspace");
  }, []);

  const closeWorkspace = useCallback(() => {
    setView(returnView);
    setWorkspaceWoId(null);
  }, [returnView]);

  const isWorkspace = view === "workspace";

  return (
    <div className="flex w-full h-[calc(100vh-49px)]">
      {/* Internal Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card/50 transition-all duration-200 flex-shrink-0 overflow-hidden",
          collapsed ? "w-14" : "w-52"
        )}
      >
        {/* Module Title */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-border">
          <Wrench className="w-5 h-5 text-primary flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-bold text-foreground truncate">
              Work Order Centre
            </span>
          )}
        </div>

        {/* Back to list when in workspace */}
        {isWorkspace && (
          <button
            onClick={closeWorkspace}
            className={cn(
              "flex items-center gap-2 mx-2 mt-2 px-2 py-1.5 rounded-md text-xs font-medium text-primary hover:bg-primary/10 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
            {!collapsed && <span>Back to list</span>}
          </button>
        )}

        {/* Nav Sections */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-3">
          {SECTIONS.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = view === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (item.key !== "workspace") {
                          setView(item.key);
                          setWorkspaceWoId(null);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2 w-full rounded-md text-xs transition-colors",
                        collapsed ? "justify-center px-2 py-2" : "px-2.5 py-1.5",
                        isActive && !isWorkspace
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-1.5 py-2 space-y-0.5">
          {[
            { icon: Settings, label: "Settings" },
            { icon: HelpCircle, label: "Support" },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex items-center gap-2 w-full rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                collapsed ? "justify-center px-2 py-2" : "px-2.5 py-1.5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center justify-center w-full rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 py-1 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-auto">
        {view === "dashboard" && <WOCDashboard onNavigate={setView} />}
        {view === "work-requests" && <WOCWorkRequests onOpenWorkspace={openWorkspace} />}
        {view === "wo-management" && <WOCWorkOrderManagement onOpenWorkspace={openWorkspace} onNavigate={setView} />}
        {view === "schedule" && <WOCSchedule />}
        {view === "performance" && <WOCPerformance />}
        
        {view === "workspace" && workspaceWoId && (
          <WOCWorkspace woId={workspaceWoId} onClose={closeWorkspace} />
        )}
        {PLACEHOLDER_VIEWS.includes(view) && view !== "workspace" && (
          <div className="p-8 flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">
                {SECTIONS.flatMap((s) => s.items).find((i) => i.key === view)?.label}
              </p>
              <p className="text-sm text-muted-foreground">This module is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
