import { Link } from "react-router-dom";
import { TreePine, Wrench, Package, Cpu, BookOpen, FileQuestion } from "lucide-react";

const sections = [
  {
    title: "Asset Tree",
    subtitle: "Locked Structure",
    description: "Single source of truth for all plant assets. Hierarchy is locked and validated.",
    icon: TreePine,
    href: "/asset-tree",
    locked: true,
  },
  {
    title: "Preventive Maintenance (PM) Design",
    subtitle: "Equipment-Based Templates",
    description: "Design PMs by equipment type before linking to assets. Templates, principles, and master list.",
    icon: Wrench,
    href: "/pm-design",
    locked: false,
  },
  {
    title: "Critical Spares Catalogue",
    subtitle: "Inventory Strategy",
    description: "Define critical spares with OEM data, lead times, and stock strategies.",
    icon: Package,
    href: "/critical-spares",
    locked: false,
  },
  {
    title: "Components & OEM Data",
    subtitle: "Reusable Specifications",
    description: "Store motor, gearbox, pump, and reducer specifications for reuse across assets.",
    icon: Cpu,
    href: "/components-oem",
    locked: false,
  },
  {
    title: "Maintenance Strategy & Rules",
    subtitle: "Philosophy & Standards",
    description: "PM vs run-to-failure rules, duty/standby philosophy, naming conventions.",
    icon: BookOpen,
    href: "/maintenance-strategy",
    locked: false,
  },
  {
    title: "Open Items / Decisions / Notes",
    subtitle: "Tracking & Review",
    description: "Unconfirmed details, missing data, assumptions, and items needing site confirmation.",
    icon: FileQuestion,
    href: "/open-items",
    locked: false,
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
        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary text-sm font-bold">!</span>
          </div>
          <div className="text-sm">
            <p className="text-foreground font-medium">
              This is a DESIGN workspace — not a CMMS.
            </p>
            <p className="text-muted-foreground mt-1">
              Scheduling and work orders are handled in a separate AI system. This space is for structure, design, and logic only.
            </p>
          </div>
        </div>

        {/* Section Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              to={section.href}
              className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              {section.locked && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                    LOCKED
                  </span>
                </div>
              )}
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
