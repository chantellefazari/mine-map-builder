import React, { useRef, useState, useCallback, lazy, Suspense } from "react";
import { X, Printer, FileText, Download, Loader2, CheckCircle2 } from "lucide-react";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";
import { Button } from "@/components/ui/button";
import { generateStoresPdfBlob } from "./storesPdfGenerator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Lazy-load heavy document components — only imported when user clicks Print/Download
const ImplementationPlanDocument = lazy(() =>
  import("./ImplementationPlanDocument").then((m) => ({ default: m.ImplementationPlanDocument }))
);
const StoresDesignPrinciples = lazy(() =>
  import("./StoresDesignPrinciples").then((m) => ({ default: m.StoresDesignPrinciples }))
);
const ContainerStockingScopeSection = lazy(() =>
  import("./ContainerStockingScopeSection").then((m) => ({ default: m.ContainerStockingScopeSection }))
);
const StoreLocationCodingSection = lazy(() =>
  import("./StoreLocationCodingSection").then((m) => ({ default: m.StoreLocationCodingSection }))
);
const DesignInputsSection = lazy(() =>
  import("./DesignInputsSection").then((m) => ({ default: m.DesignInputsSection }))
);
const CapacityAnalysis = lazy(() =>
  import("./CapacityAnalysis").then((m) => ({ default: m.CapacityAnalysis }))
);
const StockControlProcedure = lazy(() =>
  import("./StockControlProcedure").then((m) => ({ default: m.StockControlProcedure }))
);

interface PrintAllStoresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTION_TITLES = [
  "1. Implementation Plan",
  "2. Stores Design Principles",
  "3. Container Stocking Scope",
  "4. Store Location Coding",
  "5. Design Inputs for 3D",
  "6. Capacity Analysis",
  "7. Stock Control Procedure",
];

const SECTION_COMPONENTS = [
  ImplementationPlanDocument,
  StoresDesignPrinciples,
  ContainerStockingScopeSection,
  StoreLocationCodingSection,
  DesignInputsSection,
  CapacityAnalysis,
  StockControlProcedure,
];

type RenderPhase = "idle" | "rendering" | "generating" | "done";

export const PrintAllStoresModal: React.FC<PrintAllStoresModalProps> = ({
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<RenderPhase>("idle");
  const [shouldRender, setShouldRender] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const pendingAction = useRef<"print" | "download" | null>(null);

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    setShouldRender(false);
    setPhase("idle");
    setProgressIdx(0);
    pendingAction.current = null;
    onClose();
  }, [onClose]);

  // Wait for all lazy sections to finish rendering, then generate PDF
  const waitForRenderAndGenerate = useCallback(async () => {
    setPhase("rendering");

    // Give React time to mount lazy components — poll until all sections appear
    const maxWait = 15000;
    const start = Date.now();
    while (Date.now() - start < maxWait) {
      const sections = printRef.current?.querySelectorAll("[data-pdf-section]");
      if (sections && sections.length === SECTION_TITLES.length) {
        // Additional settling time for images/tables
        await new Promise((r) => setTimeout(r, 500));
        break;
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    setPhase("generating");

    const el = printRef.current;
    if (!el) {
      setPhase("idle");
      return null;
    }

    try {
      const result = await generateStoresPdfBlob(el);
      setPhase("done");
      return result;
    } catch (err) {
      console.error("PDF generation error:", err);
      setPhase("idle");
      return null;
    }
  }, []);

  const handleAction = useCallback(
    async (action: "print" | "download") => {
      pendingAction.current = action;
      // Mount the heavy components
      setShouldRender(true);

      // Use requestAnimationFrame to ensure state update has flushed
      requestAnimationFrame(() => {
        setTimeout(async () => {
          const result = await waitForRenderAndGenerate();
          if (!result) return;

          if (result.pageCount > 20) {
            console.warn(`Stores PDF is ${result.pageCount} pages even after compaction.`);
          }

          if (action === "download") {
            await uploadAndShowPdf(
              result.blob,
              "TCMG-Stores-Warehouse-Design.pdf",
              "Stores & Warehouse Design"
            );
          } else {
            const pdfUrl = URL.createObjectURL(result.blob);
            const printWindow = window.open(pdfUrl, "_blank");

            if (!printWindow) {
              await uploadAndShowPdf(
                result.blob,
                "TCMG-Stores-Warehouse-Design.pdf",
                "Stores & Warehouse Design"
              );
              URL.revokeObjectURL(pdfUrl);
            } else {
              setTimeout(() => {
                try {
                  printWindow.focus();
                  printWindow.print();
                } catch (error) {
                  console.error("Print window error:", error);
                }
              }, 1200);
              setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
            }
          }

          pendingAction.current = null;
        }, 50);
      });
    },
    [waitForRenderAndGenerate]
  );

  const isBusy = phase === "rendering" || phase === "generating";

  const statusText =
    phase === "rendering"
      ? "Loading sections…"
      : phase === "generating"
      ? "Building PDF…"
      : phase === "done"
      ? "Complete"
      : "";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl w-full max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">
              Print — Stores & Warehouse Design
            </DialogTitle>
            <DialogDescription className="sr-only">
              Print or save the full Stores and Warehouse design document as PDF.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleAction("download")}
              className="gap-2"
              disabled={isBusy}
            >
              {isBusy && pendingAction.current === "download" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isBusy && pendingAction.current === "download" ? statusText : "Download PDF"}
            </Button>
            <Button
              onClick={() => handleAction("print")}
              className="gap-2"
              disabled={isBusy}
            >
              {isBusy && pendingAction.current === "print" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              {isBusy && pendingAction.current === "print" ? statusText : "Print"}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Lightweight section list — shown immediately */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              The following sections will be included in the document. Click <strong>Download PDF</strong> or <strong>Print</strong> to generate.
            </p>
            {SECTION_TITLES.map((title, i) => (
              <div
                key={title}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium">{title}</span>
              </div>
            ))}
          </div>

          {isBusy && (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-muted">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm font-medium">{statusText}</span>
            </div>
          )}
        </div>

        {/* Off-screen render area — only mounts when user triggers an action */}
        {shouldRender && (
          <div
            ref={printRef}
            aria-hidden
            style={{
              position: "fixed",
              left: "-9999px",
              top: 0,
              width: "794px",
              background: "white",
              padding: "30px",
              zIndex: -1,
            }}
          >
            <Suspense fallback={null}>
              {SECTION_COMPONENTS.map((Component, i) => (
                <div
                  key={SECTION_TITLES[i]}
                  data-pdf-section
                  className={`stores-print-section ${i > 0 ? "mt-10 pt-8 border-t-2 border-primary/30" : ""}`}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 border-l-4 border-primary pl-3">
                    {SECTION_TITLES[i]}
                  </p>
                  <Component />
                </div>
              ))}
            </Suspense>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
