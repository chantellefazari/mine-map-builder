import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Building2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierRegisterSection } from "@/components/suppliers-procurement/SupplierRegisterSection";
import { SupplierCatalogueSection } from "@/components/suppliers-procurement/SupplierCatalogueSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SuppliersProcurement = () => {
  const [activeTab, setActiveTab] = useState("register");

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

      {/* Sticky Tabs Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-14 w-full justify-start rounded-none border-0 bg-transparent p-0">
              <TabsTrigger 
                value="register" 
                className="h-14 rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Supplier Register
              </TabsTrigger>
              <TabsTrigger 
                value="catalogue" 
                className="h-14 rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Package className="h-4 w-4 mr-2" />
                Supplier Catalogue & OEM Data
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="register" className="mt-0">
            <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Supplier Register</strong> — Master contact list for all suppliers. This is the single source of truth for <em>who we buy from</em>.
              </p>
            </div>
            <SupplierRegisterSection />
          </TabsContent>
          
          <TabsContent value="catalogue" className="mt-0">
            <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Supplier Catalogue</strong> — Parts and OEM data for <em>what suppliers supply</em>. Visual cards for quick identification during purchasing.
              </p>
            </div>
            <SupplierCatalogueSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SuppliersProcurement;
