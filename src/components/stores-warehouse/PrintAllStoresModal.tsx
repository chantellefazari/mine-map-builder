import React, { useRef, useState } from "react";
import { X, Printer, FileText, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";
import { Button } from "@/components/ui/button";
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

const SECTIONS = [
  { title: "1. Implementation Plan", Component: ImplementationPlanDocument },
  { title: "2. Stores Design Principles", Component: StoresDesignPrinciples },
  { title: "3. Container Stocking Scope", Component: ContainerStockingScopeSection },
  { title: "4. Store Location Coding", Component: StoreLocationCodingSection },
  { title: "5. Design Inputs for 3D", Component: DesignInputsSection },
  { title: "6. Capacity Analysis", Component: CapacityAnalysis },
  { title: "7. Stock Control Procedure", Component: StockControlProcedure },
];

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 12;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;

export const PrintAllStoresModal: React.FC<PrintAllStoresModalProps> = ({
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    const el = printRef.current;
    if (!el) return;
    setDownloading(true);

    try {
      const MAX_PAGES = 20;
      const RENDER_SCALES = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6] as const;
      const PAGE_CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;

      const topSections = Array.from(
        el.querySelectorAll("[data-pdf-section]")
      ) as HTMLElement[];

      const buildPdfForScale = async (renderScale: number) => {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        let currentY = MARGIN_MM;
        const SECTION_GAP_MM = 4 * renderScale;
        const blocksQueue = [...topSections];

        while (blocksQueue.length > 0) {
          const block = blocksQueue.shift();
          if (!block) continue;

          const canvas = await html2canvas(block, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            windowWidth: 794,
          });

          const baseScaleFactor = CONTENT_WIDTH_MM / (canvas.width / 2);
          const baseHeightMM = (canvas.height / 2) * baseScaleFactor;
          const drawWidthMM = CONTENT_WIDTH_MM * renderScale;
          const drawHeightMM = baseHeightMM * renderScale;
          const drawXMM = MARGIN_MM + (CONTENT_WIDTH_MM - drawWidthMM) / 2;
          const imgData = canvas.toDataURL("image/jpeg", 0.92);

          // Prefer splitting by DOM child blocks to avoid cutting through content.
          if (drawHeightMM > PAGE_CONTENT_HEIGHT_MM) {
            const childBlocks = Array.from(block.children).filter(
              (child): child is HTMLElement => child instanceof HTMLElement
            );

            if (childBlocks.length > 1) {
              blocksQueue.unshift(...childBlocks);
              continue;
            }

            // Last-resort slice when a single block is taller than one page.
            const totalHeightPx = canvas.height;
            const pxPerMMAtBase = (canvas.width / 2) / CONTENT_WIDTH_MM;
            let srcYPx = 0;

            while (srcYPx < totalHeightPx) {
              const availableHeightMM = A4_HEIGHT_MM - MARGIN_MM - currentY;
              if (availableHeightMM < 12) {
                pdf.addPage();
                currentY = MARGIN_MM;
                continue;
              }

              const sliceHeightPx = Math.min(
                (availableHeightMM * pxPerMMAtBase * 2) / renderScale,
                totalHeightPx - srcYPx
              );

              const sliceBaseHeightMM = (sliceHeightPx / 2) * baseScaleFactor;
              const sliceDrawHeightMM = sliceBaseHeightMM * renderScale;

              const sliceCanvas = document.createElement("canvas");
              sliceCanvas.width = canvas.width;
              sliceCanvas.height = Math.ceil(sliceHeightPx);
              const ctx = sliceCanvas.getContext("2d");
              if (ctx) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
                ctx.drawImage(
                  canvas,
                  0,
                  srcYPx,
                  canvas.width,
                  sliceHeightPx,
                  0,
                  0,
                  canvas.width,
                  sliceHeightPx
                );
              }

              const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
              pdf.addImage(
                sliceData,
                "JPEG",
                drawXMM,
                currentY,
                drawWidthMM,
                sliceDrawHeightMM
              );

              srcYPx += sliceHeightPx;
              if (srcYPx < totalHeightPx) {
                pdf.addPage();
                currentY = MARGIN_MM;
              } else {
                currentY += sliceDrawHeightMM + SECTION_GAP_MM;
              }
            }

            continue;
          }

          const remainingSpaceMM = A4_HEIGHT_MM - MARGIN_MM - currentY;
          if (drawHeightMM > remainingSpaceMM && currentY > MARGIN_MM) {
            pdf.addPage();
            currentY = MARGIN_MM;
          }

          pdf.addImage(imgData, "JPEG", drawXMM, currentY, drawWidthMM, drawHeightMM);
          currentY += drawHeightMM + SECTION_GAP_MM;
        }

        return { pdf, pageCount: pdf.getNumberOfPages() };
      };

      let bestPdf: jsPDF | null = null;
      let bestPageCount = Number.POSITIVE_INFINITY;

      for (const renderScale of RENDER_SCALES) {
        const { pdf, pageCount } = await buildPdfForScale(renderScale);
        bestPdf = pdf;
        bestPageCount = pageCount;

        if (pageCount <= MAX_PAGES) break;
      }

      if (!bestPdf) return;

      if (bestPageCount > MAX_PAGES) {
        console.warn(`Stores PDF is ${bestPageCount} pages even after compaction.`);
      }

      const blob = bestPdf.output("blob");
      await uploadAndShowPdf(blob, "TCMG-Stores-Warehouse-Design.pdf", "Stores & Warehouse Design");
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Stores & Warehouse Design</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px; line-height: 1.5; color: #1a1a1a;
      background: white; width: 100%;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    tr { page-break-inside: avoid; break-inside: avoid; }
    thead { display: table-header-group; }
    th, td { border: 1px solid #d1d5db; padding: 4px 6px; text-align: left; font-size: 9px; word-wrap: break-word; overflow-wrap: break-word; }
    th { background-color: #f5f5f5; font-weight: 600; }
    img { max-width: 100%; height: auto; }
    .stores-print-section { break-inside: avoid; page-break-inside: avoid; margin-bottom: 16px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #C8960C; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #C8960C; }
    .border-primary\\/30 { border-color: rgba(200, 150, 12, 0.3); }
    .bg-primary\\/10, [class*="bg-primary/10"] { background-color: rgba(200, 150, 12, 0.1) !important; }
    .bg-primary, [class*="bg-primary"] { background-color: #C8960C !important; }
    .text-primary, [class*="text-primary"] { color: #C8960C !important; }
    .bg-muted, [class*="bg-muted"] { background-color: #f5f5f5 !important; }
    .text-muted-foreground { color: #6b7280 !important; }
    h1, h2, h3, h4 { color: #1a1a1a; }
    .text-sm { font-size: 9px; }
    .text-xs { font-size: 8px; }
    .text-lg { font-size: 12px; }
    .text-base { font-size: 10px; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .p-4 { padding: 8px; }
    .p-3 { padding: 6px; }
    .px-4 { padding-left: 8px; padding-right: 8px; }
    .py-2 { padding-top: 4px; padding-bottom: 4px; }
    .mb-4 { margin-bottom: 8px; }
    .mb-2 { margin-bottom: 4px; }
    .mt-2 { margin-top: 4px; }
    .gap-2 { gap: 4px; }
    .gap-4 { gap: 8px; }
    .grid { display: grid; }
    .flex { display: flex; }
    .space-y-4 > * + * { margin-top: 8px; }
    .space-y-3 > * + * { margin-top: 6px; }
    .space-y-2 > * + * { margin-top: 4px; }
    .rounded-lg { border-radius: 6px; }
    .border { border: 1px solid #e5e7eb; }
    .border-b { border-bottom: 1px solid #e5e7eb; }
    .border-t { border-top: 1px solid #e5e7eb; }
    .border-t-2 { border-top: 2px solid #e5e7eb; }
    .overflow-hidden { overflow: hidden; }
    div, td, th { max-width: 100%; }
    .print-hide { display: none !important; }
  </style>
</head>
<body>
${printContent.innerHTML}
</body>
</html>`);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0">
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
            <Button variant="outline" onClick={handleDownloadPDF} className="gap-2" disabled={downloading}>
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {downloading ? "Generating…" : "Download PDF"}
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-muted/40 p-6">
          <div
            ref={printRef}
            className="bg-white mx-auto shadow-xl rounded-lg"
            style={{ maxWidth: "794px", padding: "30px" }}
          >
            {SECTIONS.map(({ title, Component }, i) => (
              <div
                key={title}
                data-pdf-section
                className={`stores-print-section ${i > 0 ? "mt-10 pt-8 border-t-2 border-primary/30" : ""}`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 border-l-4 border-primary pl-3">
                  {title}
                </p>
                <Component />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
