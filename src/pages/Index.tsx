import { useState } from "react";
import { AssetTree } from "@/components/hierarchy/AssetTree";
import { Legend } from "@/components/hierarchy/Legend";
import { AssetSearch } from "@/components/hierarchy/AssetSearch";
import { FunctionalLocationTable } from "@/components/hierarchy/FunctionalLocationTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreePine, TableProperties } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <span className="text-primary-foreground font-bold text-lg">TC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                TCMG Asset Hierarchy
              </h1>
              <p className="text-muted-foreground text-sm">
                Processing Plant Structure — Visual Model
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
              This is the foundational asset hierarchy for TCMG Processing Plant.
            </p>
            <p className="text-muted-foreground mt-1">
              Structure is expandable — each sub-area can be drilled down to Systems → Equipment → Components.
            </p>
          </div>
        </div>

        {/* Tabs: Asset Tree and Functional Locations */}
        <Tabs defaultValue="hierarchy" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hierarchy" className="gap-2">
              <TreePine className="h-4 w-4" />
              Asset Hierarchy
            </TabsTrigger>
            <TabsTrigger value="functional-locations" className="gap-2">
              <TableProperties className="h-4 w-4" />
              Functional Locations
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
                <AssetSearch value={searchQuery} onChange={setSearchQuery} />
              </div>
              
              <AssetTree searchQuery={searchQuery} />
            </div>
          </TabsContent>

          <TabsContent value="functional-locations" className="mt-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <FunctionalLocationTable />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>
            Master data source: Excel • Visual model for iteration & planning
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
