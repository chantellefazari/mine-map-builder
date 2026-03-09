import { Building2 } from "lucide-react";
import { SupplierRegisterTable } from "@/components/supplier-register/SupplierRegisterTable";
import { PageNavDropdown } from "@/components/PageNavDropdown";

const SupplierRegister = () => {
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
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Supplier Register – Foundation
              </h1>
              <p className="text-muted-foreground">
                Single source of truth for supplier information • Manual entry only
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h2 className="font-semibold text-foreground mb-2">About This Register</h2>
          <p className="text-sm text-muted-foreground">
            This is a foundational supplier register for the mining operation. It shows who we buy from
            and what they generally supply. This is <strong>not</strong> a parts catalogue or inventory list.
            Supplier-to-asset and supplier-to-parts relationships will be added in future phases.
          </p>
        </div>

        <SupplierRegisterTable />
      </main>
    </div>
  );
};

export default SupplierRegister;
