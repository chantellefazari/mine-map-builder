import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteSparesTable } from "@/components/site-spares/SiteSparesTable";
import { VisualPartsCatalogue } from "@/components/visual-parts/VisualPartsCatalogue";

const SiteSparesCatalogue = () => {
  const [activeTab, setActiveTab] = useState("inventory");

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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Site Spares Catalogue
              </h1>
              <p className="text-muted-foreground text-sm">
                Complete inventory of all site spares – filter and flag critical items
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent border-b-0 p-0 gap-4">
              <TabsTrigger
                value="inventory"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 pt-3"
              >
                <Package className="h-4 w-4 mr-2" />
                Site Spares Inventory
              </TabsTrigger>
              <TabsTrigger
                value="visual"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 pt-3"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Visual Parts Catalogue
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="inventory" className="mt-0">
            {/* Info Banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-sm">i</span>
              </div>
              <div className="text-sm">
                <p className="text-foreground font-medium">
                  Full site spares inventory for all equipment and consumables.
                </p>
                <p className="text-muted-foreground mt-1">
                  Items flagged as critical will appear in the Critical Spares Catalogue. Use filters to manage and organize.
                </p>
              </div>
            </div>

            {/* Spares Table */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <SiteSparesTable />
            </div>
          </TabsContent>

          <TabsContent value="visual" className="mt-0">
            <VisualPartsCatalogue />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SiteSparesCatalogue;
