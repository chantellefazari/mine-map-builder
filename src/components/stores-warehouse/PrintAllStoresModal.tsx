import React, { useRef, useState } from "react";
import { X, Printer, FileText, Download } from "lucide-react";
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
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const A4_W = 210;
      const A4_H = 297;
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      const imgRatio = canvas.height / canvas.width;
      const totalImgH = A4_W * imgRatio;
      let heightLeft = totalImgH;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, A4_W, totalImgH);
      heightLeft -= A4_H;

      while (heightLeft > 0) {
        position -= A4_H;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, A4_W, totalImgH);
        heightLeft -= A4_H;
      }

      const blob = pdf.output("blob");
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

    const styleId = "stores-all-print-styles";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        [data-stores-all-print-root],
        [data-stores-all-print-root] * { visibility: visible !important; }

        [data-stores-all-print-root] {
          display: block !important;
          position: fixed;
          inset: 0;
          width: 100%;
          z-index: 999999;
          overflow: visible;
          background: hsl(0 0% 100%);
        }

        @page { size: A4 portrait; margin: 15mm; }

        [data-stores-all-print-root] .stores-print-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `;

    const printRoot = document.createElement("div");
    printRoot.setAttribute("data-stores-all-print-root", "true");
    printRoot.innerHTML = `
      <div style="text-align:center;padding:20mm 0 10mm;border-bottom:3px solid hsl(45 71% 47%);margin-bottom:10mm;">
        <h1 style="font-size:22px;font-weight:700;color:hsl(0 0% 7%);">Stores & Warehouse Design</h1>
        <p style="font-size:12px;color:hsl(0 0% 35%);margin-top:4px;">Tennant Creek Mines Gold | ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>
      </div>
      ${printContent.innerHTML}
    `;
    printRoot.style.cssText = "display:block;font-family:Inter,-apple-system,sans-serif;font-size:11px;line-height:1.5;color:hsl(0 0% 7%);background:hsl(0 0% 100%);-webkit-print-color-adjust:exact;print-color-adjust:exact;";
    document.body.appendChild(printRoot);

    const cleanup = () => {
      printRoot.remove();
      if (style) style.textContent = "";
      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup, { once: true });

    setTimeout(() => {
      window.print();
      setTimeout(cleanup, 1200);
    }, 100);
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
              <Download className="w-4 h-4" />
              {downloading ? "Downloading…" : "Download PDF"}
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
            style={{ maxWidth: "210mm", padding: "12mm" }}
          >
            {SECTIONS.map(({ title, Component }, i) => (
              <div key={title} className={`stores-print-section ${i > 0 ? "mt-10 pt-8 border-t-2 border-primary/30" : ""}`}>
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
