import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy-load all pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AssetTree = lazy(() => import("./pages/AssetTree"));
const PMDesign = lazy(() => import("./pages/PMDesign"));
const StoresWarehouseDesign = lazy(() => import("./pages/StoresWarehouseDesign"));
const CriticalSpares = lazy(() => import("./pages/CriticalSpares"));
const SiteSparesCatalogue = lazy(() => import("./pages/SiteSparesCatalogue"));
const ComponentsOEM = lazy(() => import("./pages/ComponentsOEM"));
const WorkOrderTemplates = lazy(() => import("./pages/WorkOrderTemplates"));
const MaintenanceFoundations = lazy(() => import("./pages/MaintenanceFoundations"));
const SupplierRegister = lazy(() => import("./pages/SupplierRegister"));
const SuppliersProcurement = lazy(() => import("./pages/SuppliersProcurement"));
const POImport = lazy(() => import("./pages/POImport"));
const PlanningRevisionControl = lazy(() => import("./pages/PlanningRevisionControl"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
        <span className="text-primary font-bold text-sm">TC</span>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading module…</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
