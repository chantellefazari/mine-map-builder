import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { FoundationsContent } from "@/components/maintenance-foundations/FoundationsContent";

const MaintenanceFoundations = () => {
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
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Maintenance Process Foundations
              </h1>
              <p className="text-muted-foreground text-sm">
                Definitions, standards, and structures for maintenance work — not system configuration
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <FoundationsContent />
      </main>
    </div>
  );
};

export default MaintenanceFoundations;
