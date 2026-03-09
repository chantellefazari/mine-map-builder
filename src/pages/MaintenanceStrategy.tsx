import { PageNavDropdown } from "@/components/PageNavDropdown";
import { StrategyContent } from "@/components/maintenance-strategy/StrategyContent";

const MaintenanceStrategy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Maintenance Strategy & Rules
              </h1>
              <p className="text-muted-foreground text-sm">
                Philosophy, standards, and integration guidelines for CMMS readiness
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <StrategyContent />
      </main>
    </div>
  );
};

export default MaintenanceStrategy;
