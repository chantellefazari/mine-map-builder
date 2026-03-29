import { Package, FileText, Database } from "lucide-react";
import { SiteSparesCatalogue as SiteSparesGrid } from "@/components/site-spares/SiteSparesCatalogue";
import { BatchPDFDownloads } from "@/components/site-spares/BatchPDFDownloads";
import { DataCentreWorkbook } from "@/components/site-spares/DataCentreWorkbook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SiteSparesCatalogue = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Site Spares Catalogue
              </h1>
              <p className="text-muted-foreground text-sm">
                Visual inventory catalogue - click cards to upload photos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-6">
        <Tabs defaultValue="catalogue">
          <TabsList>
            <TabsTrigger value="catalogue" className="gap-2">
              <Package className="h-4 w-4" />
              Catalogue
            </TabsTrigger>
            <TabsTrigger value="pdf-downloads" className="gap-2">
              <FileText className="h-4 w-4" />
              PDF Parts List (with Images)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalogue" className="mt-6 space-y-6">
            {/* Info Banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="text-foreground font-medium">
                  Full site spares inventory with photo upload capability.
                </p>
                <p className="text-muted-foreground mt-1">
                  Click on any card image area to upload photos. Drag and drop is also supported.
                </p>
              </div>
            </div>
            <SiteSparesGrid />
          </TabsContent>

          <TabsContent value="pdf-downloads" className="mt-6">
            <BatchPDFDownloads />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SiteSparesCatalogue;
