import { useState } from "react";
import { Link } from "react-router-dom";
import { AssetTree as AssetTreeComponent } from "@/components/hierarchy/AssetTree";
import { Legend } from "@/components/hierarchy/Legend";
import { AssetSearch } from "@/components/hierarchy/AssetSearch";
import { FunctionalLocationTable } from "@/components/hierarchy/FunctionalLocationTable";
import { NamingConvention } from "@/components/hierarchy/NamingConvention";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreePine, TableProperties, ArrowLeft, BookText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAssetTreeCSV } from "@/utils/exportAssetTreeCSV";

const AssetTree = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  Asset Tree
                </h1>
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                  LOCKED
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                TCMG Processing Plant Structure — Single Source of Truth
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
              This asset hierarchy is LOCKED and validated for CMMS/D365 readiness.
            </p>
            <p className="text-muted-foreground mt-1">
              Structure follows: Site → Facility → Area → Sub-Area → Parent Asset → Components. No auto-changes permitted.
            </p>
          </div>
        </div>

        {/* Tabs: Asset Tree, Functional Locations, and Naming Convention */}
        <Tabs defaultValue="hierarchy" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="hierarchy" className="gap-2">
              <TreePine className="h-4 w-4" />
              Asset Hierarchy
            </TabsTrigger>
            <TabsTrigger value="functional-locations" className="gap-2">
              <TableProperties className="h-4 w-4" />
              Functional Locations
            </TabsTrigger>
            <TabsTrigger value="naming-convention" className="gap-2">
              <BookText className="h-4 w-4" />
              Naming Convention
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy" className="mt-6 space-y-6">
            {/* Legend */}
            <Legend />

            {/* Hierarchy Diagram */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Asset Structure
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    Levels 1–7 • Click nodes to expand
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AssetSearch value={searchQuery} onChange={setSearchQuery} />
                  <Button variant="outline" size="sm" onClick={exportAssetTreeCSV} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <AssetTreeComponent searchQuery={searchQuery} />
            </div>
          </TabsContent>

          <TabsContent value="functional-locations" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <FunctionalLocationTable />
            </div>
          </TabsContent>

          <TabsContent value="naming-convention" className="mt-6">
            <NamingConvention />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AssetTree;
