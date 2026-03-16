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

const MOUNT_TIMEOUT_MS = 10000;
const SETTLE_DELAY_MS = 400;
const GENERATION_TIMEOUT_MS = 90000;
const PRINT_WINDOW_WAIT_MS = 700;

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

const collectPrintStyles = () => {
  return Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join("\n");
};

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

    await waitFrame();
    await waitFrame();

    while (Date.now() - start < MOUNT_TIMEOUT_MS) {
      const sectionCount =
        printRef.current?.querySelectorAll("[data-stores-pdf-root-section]").length ?? 0;

      if (sectionCount >= SECTION_COMPONENTS.length) {
        await waitMs(SETTLE_DELAY_MS);
        return true;
      }

      await waitMs(120);
    }

    return false;
  }, []);

  const generateWithTimeout = useCallback(async (container: HTMLElement) => {
    let timeoutId: number | null = null;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => {
        reject(new Error("PDF generation timed out. Please try again."));
      }, GENERATION_TIMEOUT_MS);
    });

    try {
      return await Promise.race([generateStoresPdfBlob(container), timeoutPromise]);
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    }
  }, []);

  const printFromMountedContent = useCallback(async (container: HTMLElement) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error("Print window was blocked.");
    }

    const styleMarkup = collectPrintStyles();

    // Clone innerHTML and convert relative image URLs to absolute
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = container.innerHTML;
    const baseUrl = window.location.origin;
    tempDiv.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("blob:")) {
        img.setAttribute("src", new URL(src, baseUrl).href);
      }
    });

    // Also handle background-image inline styles
    tempDiv.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
      const style = el.getAttribute("style") || "";
      if (style.includes("url(") && !style.includes("http")) {
        el.setAttribute(
          "style",
          style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
            if (url.startsWith("http") || url.startsWith("data:")) return match;
            return `url('${new URL(url, baseUrl).href}')`;
          })
        );
      }
    });

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stores & Warehouse Design</title>
          ${styleMarkup}
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm;
            }

            html, body {
              margin: 0;
              padding: 0;
              background: #fff !important;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }

            .stores-print-root {
              width: 100%;
              max-width: 794px;
              margin: 0 auto;
              padding: 20px;
              background: #fff;
            }

            /* Prevent ANY section from being split across pages */
            .stores-print-root .stores-print-section {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            /* Cards, tables, list items — keep together */
            .stores-print-root [class*="card"],
            .stores-print-root [class*="Card"],
            .stores-print-root table,
            .stores-print-root tr,
            .stores-print-root li,
            .stores-print-root [class*="rounded-lg"],
            .stores-print-root [class*="border-border"] {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            /* Force images to render */
            .stores-print-root img {
              max-width: 100%;
              height: auto;
              display: block;
            }

            /* Preserve background colours */
            .stores-print-root [style*="background"],
            .stores-print-root [class*="bg-"] {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            /* Hide interactive controls */
            .stores-print-root button,
            .stores-print-root input,
            .stores-print-root select,
            .stores-print-root [role="combobox"] {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div class="stores-print-root">${tempDiv.innerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for images and stylesheets to load
    await new Promise<void>((resolve) => {
      const imgs = Array.from(printWindow.document.querySelectorAll("img"));
      if (imgs.length === 0) {
        setTimeout(resolve, PRINT_WINDOW_WAIT_MS);
        return;
      }

      let loaded = 0;
      const checkDone = () => {
        loaded++;
        if (loaded >= imgs.length) {
          setTimeout(resolve, 300);
        }
      };

      imgs.forEach((img) => {
        if (img.complete) {
          checkDone();
        } else {
          img.addEventListener("load", checkDone);
          img.addEventListener("error", checkDone);
        }
      });

      // Safety timeout
      setTimeout(resolve, 8000);
    });

    printWindow.focus();
    printWindow.print();
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

        if (action === "print") {
          try {
            await printFromMountedContent(container);
            return;
          } catch (printError) {
            console.warn("Direct print path failed, falling back to PDF print.", printError);
          }
        }

        const result = await generateWithTimeout(container);

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
    [phase, shouldRender, waitForSectionsToMount, generateWithTimeout, printFromMountedContent]
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
      : phase === "generating" && activeAction === "print"
      ? "Preparing print…"
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
              padding: "20px",
              zIndex: -1,
              pointerEvents: "none",
              fontSize: "8px",
              lineHeight: "1.25",
            }}
            className="stores-pdf-compact"
          >
            {SECTION_COMPONENTS.map((Component, i) => (
              <div
                key={SECTION_TITLES[i]}
                data-pdf-section
                data-stores-pdf-root-section
                className={`stores-print-section ${i > 0 ? "mt-4 pt-3 border-t-2 border-primary/30" : ""}`}
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