import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AssetTree from "./pages/AssetTree";
import PMDesign from "./pages/PMDesign";
import CriticalSpares from "./pages/CriticalSpares";
import ComponentsOEM from "./pages/ComponentsOEM";
import MaintenanceStrategy from "./pages/MaintenanceStrategy";
import OpenItems from "./pages/OpenItems";
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
          <Route path="/components-oem" element={<ComponentsOEM />} />
          <Route path="/maintenance-strategy" element={<MaintenanceStrategy />} />
          <Route path="/open-items" element={<OpenItems />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
