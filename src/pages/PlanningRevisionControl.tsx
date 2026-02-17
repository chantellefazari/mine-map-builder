import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PlanningRevisionControlSection } from "@/components/maintenance-foundations/PlanningRevisionControlSection";

const PlanningRevisionControl = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
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
