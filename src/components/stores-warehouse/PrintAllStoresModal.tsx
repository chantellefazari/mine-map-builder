import React, { useRef, useState, useCallback, useEffect } from "react";
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
import { ImplementationPlanDocument } from "./ImplementationPlanDocument";
import { StoresDesignPrinciples } from "./StoresDesignPrinciples";
import { ContainerStockingScopeSection } from "./ContainerStockingScopeSection";
import { StoreLocationCodingSection } from "./StoreLocationCodingSection";
import { DesignInputsSection } from "./DesignInputsSection";
import { CapacityAnalysis } from "./CapacityAnalysis";
import { StockControlProcedure } from "./StockControlProcedure";

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

const SECTION_COMPONENTS: React.FC[] = [
  ImplementationPlanDocument,
  StoresDesignPrinciples,
  ContainerStockingScopeSection,
  StoreLocationCodingSection,
  DesignInputsSection,
  CapacityAnalysis,
  StockControlProcedure,
];

type Phase = "idle" | "mounting" | "generating";

export const PrintAllStoresModal: React.FC<PrintAllStoresModalProps> = ({
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [shouldRender, setShouldRender] = useState(false);
  const pendingAction = useRef<"print" | "download" | null>(null);

  const handleClose = useCallback(() => {
    setShouldRender(false);
    setPhase("idle");
    pendingAction.current = null;
    onClose();
  }, [onClose]);

  // Once sections are mounted, generate the PDF
  useEffect(() => {
    if (phase !== "mounting" || !shouldRender) return;

    const timer = setTimeout(async () => {
      const el = printRef.current;
      const sections = el?.querySelectorAll("[data-pdf-section]");
      if (!el || !sections || sections.length === 0) {
        console.error("No sections found for PDF generation");
        setPhase("idle");
        return;
      }

      setPhase("generating");

      try {
        const result = await generateStoresPdfBlob(el);

        if (result.pageCount > 20) {
          console.warn(`Stores PDF is ${result.pageCount} pages.`);
        }

        const action = pendingAction.current;
        if (action === "download") {
          await uploadAndShowPdf(
            result.blob,
            "TCMG-Stores-Warehouse-Design.pdf",
            "Stores & Warehouse Design"
          );
        } else if (action === "print") {
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
              try { printWindow.focus(); printWindow.print(); } catch {}
            }, 1200);
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
          }
        }
      } catch (err) {
        console.error("PDF generation error:", err);
      } finally {
        setPhase("idle");
        pendingAction.current = null;
        // Keep rendered to avoid re-mounting on next click
      }
    }, 1500); // 1.5s settling time for DOM to paint

    return () => clearTimeout(timer);
  }, [phase, shouldRender]);

  const handleAction = useCallback((action: "print" | "download") => {
    pendingAction.current = action;
    if (shouldRender) {
      // Already mounted — go straight to generating
      setPhase("generating");
      // Trigger generation directly
      const el = printRef.current;
      if (!el) return;
      generateStoresPdfBlob(el).then(async (result) => {
        if (action === "download") {
          await uploadAndShowPdf(result.blob, "TCMG-Stores-Warehouse-Design.pdf", "Stores & Warehouse Design");
        } else {
          const pdfUrl = URL.createObjectURL(result.blob);
          const win = window.open(pdfUrl, "_blank");
          if (!win) {
            await uploadAndShowPdf(result.blob, "TCMG-Stores-Warehouse-Design.pdf", "Stores & Warehouse Design");
            URL.revokeObjectURL(pdfUrl);
          } else {
            setTimeout(() => { try { win.focus(); win.print(); } catch {} }, 1200);
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
          }
        }
      }).catch((err) => {
        console.error("PDF error:", err);
      }).finally(() => {
        setPhase("idle");
        pendingAction.current = null;
      });
    } else {
      setShouldRender(true);
      setPhase("mounting");
    }
  }, [shouldRender]);

  const isBusy = phase !== "idle";
  const statusText = phase === "mounting" ? "Loading sections…" : phase === "generating" ? "Building PDF…" : "";

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
            <Button variant="outline" onClick={() => handleAction("download")} className="gap-2" disabled={isBusy}>
              {isBusy && pendingAction.current === "download" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isBusy && pendingAction.current === "download" ? statusText : "Download PDF"}
            </Button>
            <Button onClick={() => handleAction("print")} className="gap-2" disabled={isBusy}>
              {isBusy && pendingAction.current === "print" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {isBusy && pendingAction.current === "print" ? statusText : "Print"}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              The following sections will be included. Click <strong>Download PDF</strong> or <strong>Print</strong> to generate.
            </p>
            {SECTION_TITLES.map((title) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
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

        {/* Off-screen render target — only mounted on first action */}
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
              visibility: "hidden",
            }}
          >
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
