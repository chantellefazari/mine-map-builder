import { Link } from "react-router-dom";
import { TreePine, Wrench, Package, Cpu, ClipboardList, Warehouse, BookOpen, ShoppingCart, FileInput } from "lucide-react";

const sections = [
  {
    title: "PO Import + Component Cleaner",
    subtitle: "Extract & Normalise",
    description: "Upload PO exports to extract, normalise, and deduplicate components for catalogue population.",
    icon: FileInput,
    href: "/po-import",
  },
  {
    title: "Maintenance Process Foundations",
    subtitle: "Definitions & Standards",
    description: "Foundational rules for maintenance work types, job data standards, numbering, and history structure.",
    icon: BookOpen,
    href: "/maintenance-foundations",
  },
  {
    title: "Asset Tree",
    subtitle: "Locked Structure",
    description: "Single source of truth for all plant assets. Hierarchy is locked and validated.",
    icon: TreePine,
    href: "/asset-tree",
  },
  {
    title: "Preventive Maintenance (PM) Design",
    subtitle: "Equipment-Based Templates",
    description: "Design PMs by equipment type before linking to assets. Templates, principles, and master list.",
    icon: Wrench,
    href: "/pm-design",
  },
  {
    title: "Work Order Templates",
    subtitle: "Standardized Procedures",
    description: "Pre-defined work order templates for common maintenance tasks and repairs.",
    icon: ClipboardList,
    href: "/work-order-templates",
  },
  {
    title: "Components & OEM Data",
    subtitle: "Reusable Specifications",
    description: "Store motor, gearbox, pump, and reducer specifications for reuse across assets.",
    icon: Cpu,
    href: "/components-oem",
  },
  {
    title: "Suppliers & Procurement",
    subtitle: "Vendor & Parts Foundation",
    description: "Master supplier contacts and OEM parts catalogue. Foundation for procurement and spares standardisation.",
    icon: ShoppingCart,
    href: "/suppliers-procurement",
  },
  {
    title: "Critical Spares Catalogue",
    subtitle: "Inventory Strategy",
    description: "Critical spares with OEM data, lead times, and stock strategies. Items flagged from Site Catalogue.",
    icon: Package,
    href: "/critical-spares",
  },
  {
    title: "Site Spares Catalogue",
    subtitle: "Full Inventory",
    description: "Complete site spares inventory. Flag items as critical to populate the Critical Spares Catalogue.",
    icon: Warehouse,
    href: "/site-spares",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-xl">TC</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                TCMG – Asset & Maintenance Framework
              </h1>
              <p className="text-muted-foreground mt-1">
                Tennant Creek Gold Mine • Structure, Design & Logic Workspace
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-10">
        {/* Section Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
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

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground py-4 border-t border-border">
          <p>
            TCMG Asset Framework • Design workspace for CMMS/D365 readiness
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
