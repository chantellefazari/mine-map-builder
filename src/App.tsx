import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AssetTree from "./pages/AssetTree";
import PMDesign from "./pages/PMDesign";
import StoresWarehouseDesign from "./pages/StoresWarehouseDesign";
import CriticalSpares from "./pages/CriticalSpares";
import SiteSparesCatalogue from "./pages/SiteSparesCatalogue";
import ComponentsOEM from "./pages/ComponentsOEM";
import WorkOrderTemplates from "./pages/WorkOrderTemplates";
import MaintenanceFoundations from "./pages/MaintenanceFoundations";
import SupplierRegister from "./pages/SupplierRegister";
import SuppliersProcurement from "./pages/SuppliersProcurement";
import POImport from "./pages/POImport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/asset-tree" element={<AssetTree />} />
          <Route path="/pm-design" element={<PMDesign />} />
          <Route path="/critical-spares" element={<CriticalSpares />} />
          <Route path="/site-spares" element={<SiteSparesCatalogue />} />
          <Route path="/components-oem" element={<ComponentsOEM />} />
          <Route path="/work-order-templates" element={<WorkOrderTemplates />} />
          <Route path="/maintenance-foundations" element={<MaintenanceFoundations />} />
          <Route path="/supplier-register" element={<SupplierRegister />} />
          <Route path="/suppliers-procurement" element={<SuppliersProcurement />} />
          <Route path="/po-import" element={<POImport />} />
          <Route path="/stores-warehouse-design" element={<StoresWarehouseDesign />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
