import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierRegisterSection } from "@/components/suppliers-procurement/SupplierRegisterSection";
import { SupplierCatalogueSection } from "@/components/suppliers-procurement/SupplierCatalogueSection";

const SuppliersProcurement = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Suppliers & Procurement
              </h1>
              <p className="text-muted-foreground">
                Supplier contacts and OEM parts catalogue • Foundation for procurement and spares management
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Info Box */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h2 className="font-semibold text-foreground mb-2">About This Module</h2>
          <p className="text-sm text-muted-foreground">
            This module separates <strong>who we buy from</strong> (Supplier Register) from <strong>what they supply</strong> (Supplier Catalogue).
            Start with the Supplier Register to build your vendor base, then populate the Catalogue with specific parts and OEM data.
            This structure supports future linking to assets, PMs, and critical spares.
          </p>
        </div>

        {/* Section 1: Supplier Register */}
        <SupplierRegisterSection />

        {/* Section 2: Supplier Catalogue */}
        <SupplierCatalogueSection />
      </main>
    </div>
  );
};

export default SuppliersProcurement;
