import { PageNavDropdown } from "@/components/PageNavDropdown";
import { PlanningRevisionControlSection } from "@/components/maintenance-foundations/PlanningRevisionControlSection";

const PlanningRevisionControl = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-3">
            <PageNavDropdown />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Planning & Revision Control</h1>
          <p className="text-muted-foreground mt-1">Planning governance structure for site scheduling</p>
        </div>
      </header>
      <main className="container py-8">
        <PlanningRevisionControlSection />
      </main>
    </div>
  );
};

export default PlanningRevisionControl;
