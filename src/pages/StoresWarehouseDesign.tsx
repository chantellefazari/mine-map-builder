import { Link } from "react-router-dom";
import { ArrowLeft, Warehouse, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoresDesignPrinciples } from "@/components/stores-warehouse/StoresDesignPrinciples";
import { StorageZonesSection } from "@/components/stores-warehouse/StorageZonesSection";
import { ContainerStockingScopeSection } from "@/components/stores-warehouse/ContainerStockingScopeSection";
import { StoreLocationCodingSection } from "@/components/stores-warehouse/StoreLocationCodingSection";
import { DesignInputsSection } from "@/components/stores-warehouse/DesignInputsSection";
import { StoreVisualisation } from "@/components/stores-warehouse/StoreVisualisation";
import { CapacityAnalysis } from "@/components/stores-warehouse/CapacityAnalysis";

const StoresWarehouseDesign = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Stores & Warehouse Design
              </h1>
              <p className="text-sm text-muted-foreground">
                Logical design, rules, and structure for TCMG stores
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {/* Top-level Warning */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-700 dark:text-amber-300">Design, Logic & Governance Only</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              This section must NOT modify, move, rename, or update any existing assets, asset tree data, or CMMS records.
            </p>
          </div>
        </div>

        {/* Purpose Card */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h3 className="font-medium text-foreground mb-2">Purpose</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This section defines the logical design, rules, and structure for the Tennant Creek Mine (TCMG) stores and warehouse setup before physical build or 3D modelling.
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            It provides a single source of truth for:
          </p>
          <div className="grid gap-1 sm:grid-cols-2 text-sm text-muted-foreground mb-3">
            <span>• What will be stocked</span>
            <span>• Where it will be stored</span>
            <span>• Why it is stored there</span>
            <span>• How it will scale in future</span>
          </div>
          <p className="text-sm text-muted-foreground border-t border-border pt-3">
            This section prepares inputs for future physical layout design (containers, racking, airflow, access), but does not attempt to draw or model the store.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="principles" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-2 rounded-lg">
            <TabsTrigger value="principles" className="text-xs">
              <span className="hidden sm:inline">Stores Design Principles</span>
              <span className="sm:hidden">Principles</span>
            </TabsTrigger>
            <TabsTrigger value="zones" className="text-xs">
              <span className="hidden sm:inline">Storage Zones & Logical Areas</span>
              <span className="sm:hidden">Zones</span>
            </TabsTrigger>
            <TabsTrigger value="stocking" className="text-xs">
              <span className="hidden sm:inline">Container Stocking Scope</span>
              <span className="sm:hidden">Stocking</span>
            </TabsTrigger>
            <TabsTrigger value="coding" className="text-xs">
              <span className="hidden sm:inline">Store Location Coding</span>
              <span className="sm:hidden">Coding</span>
            </TabsTrigger>
            <TabsTrigger value="design-inputs" className="text-xs">
              <span className="hidden sm:inline">Design Inputs for 3D</span>
              <span className="sm:hidden">3D Inputs</span>
            </TabsTrigger>
            <TabsTrigger value="visualisation" className="text-xs">
              <span className="hidden sm:inline">Store Visualisation</span>
              <span className="sm:hidden">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="capacity" className="text-xs">
              <span className="hidden sm:inline">Capacity Scan</span>
              <span className="sm:hidden">Capacity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="principles">
            <StoresDesignPrinciples />
          </TabsContent>

          <TabsContent value="zones">
            <StorageZonesSection />
          </TabsContent>

          <TabsContent value="stocking">
            <ContainerStockingScopeSection />
          </TabsContent>

          <TabsContent value="coding">
            <StoreLocationCodingSection />
          </TabsContent>

          <TabsContent value="design-inputs">
            <DesignInputsSection />
          </TabsContent>

          <TabsContent value="visualisation">
            <StoreVisualisation />
          </TabsContent>

          <TabsContent value="capacity">
            <CapacityAnalysis />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StoresWarehouseDesign;
