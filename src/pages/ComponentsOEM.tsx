import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ComponentsTable } from "@/components/components-oem/ComponentsTable";

const ComponentsOEM = () => {
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
                Components & OEM Data
              </h1>
              <p className="text-muted-foreground text-sm">
                Reusable component specifications for motors, gearboxes, pumps, and reducers
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary text-sm">i</span>
          </div>
          <div className="text-sm">
            <p className="text-foreground font-medium">
              Component data is reusable across multiple assets.
            </p>
            <p className="text-muted-foreground mt-1">
              Store manufacturer specs, ratings, and typical failure modes for reference during PM design and spares planning.
            </p>
          </div>
        </div>

        {/* Components Table */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <ComponentsTable />
        </div>
      </main>
    </div>
  );
};

export default ComponentsOEM;
