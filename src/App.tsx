import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
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
import PlanningRevisionControl from "./pages/PlanningRevisionControl";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected: Home */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

            {/* Tab-protected routes */}
            <Route path="/asset-tree" element={<ProtectedRoute tabKey="asset-tree"><AssetTree /></ProtectedRoute>} />
            <Route path="/pm-design" element={<ProtectedRoute tabKey="pm-design"><PMDesign /></ProtectedRoute>} />
            <Route path="/critical-spares" element={<ProtectedRoute tabKey="critical-spares"><CriticalSpares /></ProtectedRoute>} />
            <Route path="/site-spares" element={<ProtectedRoute tabKey="site-spares"><SiteSparesCatalogue /></ProtectedRoute>} />
            <Route path="/components-oem" element={<ProtectedRoute tabKey="components-oem"><ComponentsOEM /></ProtectedRoute>} />
            <Route path="/work-order-templates" element={<ProtectedRoute tabKey="work-order-templates"><WorkOrderTemplates /></ProtectedRoute>} />
            <Route path="/maintenance-foundations" element={<ProtectedRoute tabKey="maintenance-foundations"><MaintenanceFoundations /></ProtectedRoute>} />
            <Route path="/supplier-register" element={<ProtectedRoute tabKey="suppliers-procurement"><SupplierRegister /></ProtectedRoute>} />
            <Route path="/suppliers-procurement" element={<ProtectedRoute tabKey="suppliers-procurement"><SuppliersProcurement /></ProtectedRoute>} />
            <Route path="/po-import" element={<ProtectedRoute tabKey="po-import"><POImport /></ProtectedRoute>} />
            <Route path="/stores-warehouse-design" element={<ProtectedRoute tabKey="stores-warehouse-design"><StoresWarehouseDesign /></ProtectedRoute>} />
            <Route path="/planning-revision" element={<ProtectedRoute tabKey="planning-revision"><PlanningRevisionControl /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
