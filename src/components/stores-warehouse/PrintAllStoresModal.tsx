import React, { useRef, useState, useCallback, ComponentType } from "react";
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

type ActionType = "print" | "download";
type Phase = "idle" | "mounting" | "generating";

const MOUNT_TIMEOUT_MS = 20000;
const SETTLE_DELAY_MS = 500;

const SECTION_TITLES = [
  "1. Implementation Plan",
  "2. Stores Design Principles",
  "3. Container Stocking Scope",
  "4. Store Location Coding",
  "5. Design Inputs for 3D",
  "6. Capacity Analysis",
  "7. Stock Control Procedure",
] as const;

const SECTION_COMPONENTS: ComponentType[] = [
  ImplementationPlanDocument,
  StoresDesignPrinciples,
  ContainerStockingScopeSection,
  StoreLocationCodingSection,
  DesignInputsSection,
  CapacityAnalysis,
  StockControlProcedure,
];

const waitFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const waitMs = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const PrintAllStoresModal: React.FC<PrintAllStoresModalProps> = ({
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const waitForSectionsToMount = useCallback(async () => {
    const start = Date.now();

    // Ensure React commits the off-screen tree first
    await waitFrame();
    await waitFrame();

    while (Date.now() - start < MOUNT_TIMEOUT_MS) {
      const sectionCount = printRef.current?.querySelectorAll("[data-pdf-section]").length ?? 0;
      if (sectionCount === SECTION_COMPONENTS.length) {
        await waitMs(SETTLE_DELAY_MS);
        return true;
      }
      await waitMs(150);
    }

    return false;
  }, []);

  const handleAction = useCallback(
    async (action: ActionType) => {
      if (phase !== "idle") return;

      setActiveAction(action);

      try {
        if (!shouldRender) {
          setPhase("mounting");
          setShouldRender(true);

          const mounted = await waitForSectionsToMount();
          if (!mounted) {
            throw new Error("Timed out while preparing print sections.");
          }
        }

        const container = printRef.current;
        if (!container) {
          throw new Error("Print container not found.");
        }

        setPhase("generating");

        const result = await generateStoresPdfBlob(container);

        if (result.pageCount > 20) {
          console.warn(`Stores PDF is ${result.pageCount} pages.`);
        }

        if (action === "download") {
          await uploadAndShowPdf(
            result.blob,
            "TCMG-Stores-Warehouse-Design.pdf",
            "Stores & Warehouse Design"
          );
          return;
        }

        const pdfUrl = URL.createObjectURL(result.blob);
        const printWindow = window.open(pdfUrl, "_blank");

        if (!printWindow) {
          await uploadAndShowPdf(
            result.blob,
            "TCMG-Stores-Warehouse-Design.pdf",
            "Stores & Warehouse Design"
          );
          URL.revokeObjectURL(pdfUrl);
          return;
        }

        setTimeout(() => {
          try {
            printWindow.focus();
            printWindow.print();
          } catch (error) {
            console.error("Print window error:", error);
          }
        }, 1200);

        setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
      } catch (err) {
        console.error("Stores print action failed:", err);
      } finally {
        setPhase("idle");
        setActiveAction(null);
      }
    },
    [phase, shouldRender, waitForSectionsToMount]
  );

  const handleClose = useCallback(() => {
    setPhase("idle");
    setActiveAction(null);
    setShouldRender(false);
    onClose();
  }, [onClose]);

  const isBusy = phase !== "idle";
  const statusText =
    phase === "mounting"
      ? "Loading sections…"
      : phase === "generating"
      ? "Building PDF…"
      : "";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl w-full max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">Print — Stores & Warehouse Design</DialogTitle>
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
              {isBusy && activeAction === "download" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isBusy && activeAction === "download" ? statusText : "Download PDF"}
            </Button>

            <Button onClick={() => handleAction("print")} className="gap-2" disabled={isBusy}>
              {isBusy && activeAction === "print" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              {isBusy && activeAction === "print" ? statusText : "Print"}
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

        {shouldRender && (
          <div
            ref={printRef}
            aria-hidden
            style={{
              position: "fixed",
              left: "-12000px",
              top: 0,
              width: "794px",
              background: "white",
              padding: "30px",
              zIndex: -1,
              pointerEvents: "none",
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
