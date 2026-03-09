import { useState } from "react";
import { BookOpen, Printer } from "lucide-react";
import { PageNavDropdown } from "@/components/PageNavDropdown";
import { Button } from "@/components/ui/button";
import { FoundationsContent } from "@/components/maintenance-foundations/FoundationsContent";
import { PrintAllFoundationsModal } from "@/components/maintenance-foundations/PrintAllFoundationsModal";

const MaintenanceFoundations = () => {
  const [printOpen, setPrintOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <PageNavDropdown />
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Maintenance Process Foundations
              </h1>
              <p className="text-muted-foreground text-sm">
                Definitions, standards, and structures for maintenance work — not system configuration
              </p>
            </div>
            <Button
              onClick={() => setPrintOpen(true)}
              variant="outline"
              className="gap-2 shrink-0"
            >
              <Printer className="w-4 h-4" />
              Print All Tabs
            </Button>
          </div>
        </div>
      </header>

      <PrintAllFoundationsModal isOpen={printOpen} onClose={() => setPrintOpen(false)} />

      {/* Main Content */}
      <main className="container py-8">
        <FoundationsContent />
      </main>
    </div>
  );
};

export default MaintenanceFoundations;
