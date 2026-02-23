import { Link, useNavigate } from "react-router-dom";
import { TreePine, Wrench, Package, ClipboardList, Warehouse, BookOpen, ShoppingCart, Building2, CalendarClock, LogOut, Shield, PackageSearch } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const ALL_SECTIONS = [
  {
    title: "Maintenance Process Foundations",
    subtitle: "Definitions & Standards",
    description: "Foundational rules for maintenance work types, job data standards, numbering, and history structure.",
    icon: BookOpen,
    href: "/maintenance-foundations",
    tabKey: "maintenance-foundations",
  },
  {
    title: "Asset Tree",
    subtitle: "Locked Structure",
    description: "Single source of truth for all plant assets. Hierarchy is locked and validated.",
    icon: TreePine,
    href: "/asset-tree",
    tabKey: "asset-tree",
  },
  {
    title: "Preventive Maintenance (PM) Design",
    subtitle: "Equipment-Based Templates",
    description: "Design PMs by equipment type before linking to assets. Templates, principles, and master list.",
    icon: Wrench,
    href: "/pm-design",
    tabKey: "pm-design",
  },
  {
    title: "Work Order Templates",
    subtitle: "Standardized Procedures",
    description: "Pre-defined work order templates for common maintenance tasks and repairs.",
    icon: ClipboardList,
    href: "/work-order-templates",
    tabKey: "work-order-templates",
  },
  {
    title: "Suppliers & Procurement",
    subtitle: "Vendor & Parts Foundation",
    description: "Master supplier contacts and OEM parts catalogue. Foundation for procurement and spares standardisation.",
    icon: ShoppingCart,
    href: "/suppliers-procurement",
    tabKey: "suppliers-procurement",
  },
  {
    title: "Stores & Warehouse Design",
    subtitle: "Design & Governance",
    description: "Logical design, rules, and structure for TCMG stores and warehouse setup before physical build.",
    icon: Building2,
    href: "/stores-warehouse-design",
    tabKey: "stores-warehouse-design",
  },
  {
    title: "Site Spares Catalogue",
    subtitle: "Full Inventory",
    description: "Complete site spares inventory. Flag items as critical to populate the Critical Spares Catalogue.",
    icon: Warehouse,
    href: "/site-spares",
    tabKey: "site-spares",
  },
  {
    title: "Planning & Revision Control",
    subtitle: "Scheduling Governance",
    description: "Work centres, classifications, weekly revision calendar, shutdown revisions, and capacity loading logic.",
    icon: CalendarClock,
    href: "/planning-revision",
    tabKey: "planning-revision",
  },
  {
    title: "PO Tracker",
    subtitle: "Purchase Order Tracking",
    description: "Track purchase orders linked to work orders. Monitor delivery status and confirm parts on site.",
    icon: PackageSearch,
    href: "/po-tracker",
    tabKey: "po-tracker",
  },
];

const Home = () => {
  const { user, isAdmin, allowedTabs, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Filter sections by permissions (admins see all)
  const visibleSections = ALL_SECTIONS.filter((s) => {
    if (isAdmin) return true;
    return allowedTabs.includes(s.tabKey);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-xl">TC</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                TCMG – Asset & Maintenance Framework
              </h1>
              <p className="text-muted-foreground mt-1">
                Tennant Creek Gold Mine • Structure, Design & Logic Workspace
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate("/admin")}
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Button>
              )}
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
          {user && (
            <p className="text-xs text-muted-foreground mt-3 ml-[4.5rem]">
              Signed in as <span className="font-medium text-foreground">{user.email}</span>
              {isAdmin && <span className="ml-2 text-primary font-semibold">• Admin</span>}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-10">
        {!loading && visibleSections.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Access Granted</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Your account doesn't have access to any modules yet. Please contact your administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSections.map((section) => (
              <Link
                key={section.href}
                to={section.href}
                className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  {section.title}
                </h2>
                <p className="text-sm font-medium text-primary/80 mb-2">
                  {section.subtitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground py-4 border-t border-border">
          <p>TCMG Asset Framework • Design workspace for CMMS/D365 readiness</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
