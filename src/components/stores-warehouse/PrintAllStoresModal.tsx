import React, { useRef, useState } from "react";
import { X, Printer, FileText, Download, Loader2 } from "lucide-react";
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
  const [printing, setPrinting] = useState(false);

  const generatePdf = async () => {
    const el = printRef.current;
    if (!el) return null;
    return generateStoresPdfBlob(el);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);

    try {
      const result = await generatePdf();
      if (!result) return;

      if (result.pageCount > 20) {
        console.warn(`Stores PDF is ${result.pageCount} pages even after compaction.`);
      }

      await uploadAndShowPdf(
        result.blob,
        "TCMG-Stores-Warehouse-Design.pdf",
        "Stores & Warehouse Design"
      );
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    setPrinting(true);

    try {
      const result = await generatePdf();
      if (!result) return;

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
      console.error("PDF print error:", err);
    } finally {
      setPrinting(false);
    }
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
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="gap-2"
              disabled={downloading || printing}
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {downloading ? "Generating…" : "Download PDF"}
            </Button>
            <Button onClick={handlePrint} className="gap-2" disabled={downloading || printing}>
              {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {printing ? "Preparing…" : "Print"}
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
