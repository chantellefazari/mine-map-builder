import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppSidebarLayout } from "@/components/AppSidebarLayout";

// Lazy-load all pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AssetTree = lazy(() => import("./pages/AssetTree"));
const PMDesign = lazy(() => import("./pages/PMDesign"));
const PMPrint = lazy(() => import("./pages/PMPrint"));
const StoresWarehouseDesign = lazy(() => import("./pages/StoresWarehouseDesign"));
const SiteSparesCatalogue = lazy(() => import("./pages/SiteSparesCatalogue"));
const WorkOrderTemplates = lazy(() => import("./pages/WorkOrderTemplates"));
const WorkRequestTemplates = lazy(() => import("./pages/WorkRequestTemplates"));
const MaintenanceFoundations = lazy(() => import("./pages/MaintenanceFoundations"));
const SupplierRegister = lazy(() => import("./pages/SupplierRegister"));
const SuppliersProcurement = lazy(() => import("./pages/SuppliersProcurement"));
const PlanningRevisionControl = lazy(() => import("./pages/PlanningRevisionControl"));
const POTracker = lazy(() => import("./pages/POTracker"));
const PurchaseRequests = lazy(() => import("./pages/PurchaseRequests"));
const SupplierPortal = lazy(() => import("./pages/SupplierPortal"));
const TrackShipment = lazy(() => import("./pages/TrackShipment"));
const ThreeDeeConcepts = lazy(() => import("./pages/ThreeDeeConcepts"));
const PlantIntelligence = lazy(() => import("./pages/PlantIntelligence"));
const MissionControl = lazy(() => import("./pages/MissionControl"));
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

/** Wraps a page in the sidebar layout + protected route */
const P = ({ children, tabKey, adminOnly }: { children: React.ReactNode; tabKey?: string; adminOnly?: boolean }) => (
  <ProtectedRoute tabKey={tabKey} adminOnly={adminOnly}>
    <AppSidebarLayout>{children}</AppSidebarLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
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
                <Route path="/supplier-portal" element={<SupplierPortal />} />
                <Route path="/track-shipment" element={<TrackShipment />} />

                {/* Protected with sidebar */}
                <Route path="/" element={<P><Home /></P>} />
                <Route path="/admin" element={<P adminOnly><AdminPanel /></P>} />
                <Route path="/asset-tree" element={<P tabKey="asset-tree"><AssetTree /></P>} />
                <Route path="/pm-design" element={<P tabKey="pm-design"><PMDesign /></P>} />
                <Route path="/pm-print/:id" element={<P tabKey="pm-design"><PMPrint /></P>} />
                <Route path="/site-spares" element={<P tabKey="site-spares"><SiteSparesCatalogue /></P>} />
                <Route path="/work-order-templates" element={<P tabKey="work-order-templates"><WorkOrderTemplates /></P>} />
                <Route path="/work-request-templates" element={<P tabKey="work-order-templates"><WorkRequestTemplates /></P>} />
                <Route path="/maintenance-foundations" element={<P tabKey="maintenance-foundations"><MaintenanceFoundations /></P>} />
                <Route path="/supplier-register" element={<P tabKey="suppliers-procurement"><SupplierRegister /></P>} />
                <Route path="/suppliers-procurement" element={<P tabKey="suppliers-procurement"><SuppliersProcurement /></P>} />
                <Route path="/stores-warehouse-design" element={<P tabKey="stores-warehouse-design"><StoresWarehouseDesign /></P>} />
                <Route path="/planning-revision" element={<P tabKey="planning-revision"><PlanningRevisionControl /></P>} />
                <Route path="/po-tracker" element={<P tabKey="po-tracker"><POTracker /></P>} />
                <Route path="/purchase-requests" element={<P tabKey="purchase-requests"><PurchaseRequests /></P>} />
                <Route path="/3d-concepts" element={<P tabKey="3d-concepts"><ThreeDeeConcepts /></P>} />
                <Route path="/plant-intelligence" element={<P tabKey="plant-intelligence"><PlantIntelligence /></P>} />
                <Route path="/mission-control" element={<P tabKey="mission-control"><MissionControl /></P>} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
