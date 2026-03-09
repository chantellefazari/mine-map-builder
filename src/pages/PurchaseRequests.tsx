import { FileText, Send, Package, History } from "lucide-react";
import { PageNavDropdown } from "@/components/PageNavDropdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PurchaseRequestRegister } from "@/components/purchase-requests/PurchaseRequestRegister";
import { QuoteRequestsTab } from "@/components/purchase-requests/QuoteRequestsTab";
import { PurchaseOrdersTab } from "@/components/purchase-requests/PurchaseOrdersTab";
import { HistoryAuditTab } from "@/components/purchase-requests/HistoryAuditTab";

const PurchaseRequests = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <PageNavDropdown />
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Procurement Hub</h1>
              <p className="text-muted-foreground text-sm">
                Purchase requests, quotes, purchase orders, and audit history
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Tabs defaultValue="pr-register" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="pr-register" className="gap-2 py-2.5 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">PR Register</span>
              <span className="sm:hidden">PRs</span>
            </TabsTrigger>
            <TabsTrigger value="quote-requests" className="gap-2 py-2.5 text-xs sm:text-sm">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Quote Requests</span>
              <span className="sm:hidden">Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="purchase-orders" className="gap-2 py-2.5 text-xs sm:text-sm">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Purchase Orders</span>
              <span className="sm:hidden">POs</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 py-2.5 text-xs sm:text-sm">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History & Audit</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pr-register">
            <PurchaseRequestRegister />
          </TabsContent>
          <TabsContent value="quote-requests">
            <QuoteRequestsTab />
          </TabsContent>
          <TabsContent value="purchase-orders">
            <PurchaseOrdersTab />
          </TabsContent>
          <TabsContent value="history">
            <HistoryAuditTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PurchaseRequests;
