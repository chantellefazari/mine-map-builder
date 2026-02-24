import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PurchaseRequestRegister } from "@/components/purchase-requests/PurchaseRequestRegister";

const PurchaseRequests = () => {
  return (
    <div className="min-h-screen bg-background">
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Purchase Requests</h1>
              <p className="text-muted-foreground text-sm">
                Create, submit, and track purchase requests through the approval workflow
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <PurchaseRequestRegister />
      </main>
    </div>
  );
};

export default PurchaseRequests;
