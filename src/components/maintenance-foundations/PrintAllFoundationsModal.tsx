import React, { useRef, useState } from "react";
import { X, Printer, FileText, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HierarchyRulesSection } from "./HierarchyRulesSection";
import { AssetNumberingSection } from "./AssetNumberingSection";
import { SitePartNumberingSection } from "./SitePartNumberingSection";
import { JobNumberingSection } from "./JobNumberingSection";
import { PMStandardsSection } from "./PMStandardsSection";
import { SparesStrategySection } from "./SparesStrategySection";
import { DataGovernanceSection } from "./DataGovernanceSection";
import { ProcessingPlantAssetTaggingSection } from "./ProcessingPlantAssetTaggingSection";
import { AssetTagRolloutPlanSection } from "./AssetTagRolloutPlanSection";

interface PrintAllFoundationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = [
  { title: "1. Asset Hierarchy & Parent-Child Rules", Component: HierarchyRulesSection },
  { title: "2. Functional Location Codes", Component: AssetNumberingSection },
  { title: "3. Site Part Numbering Standards", Component: SitePartNumberingSection },
  { title: "4. Maintenance WO Numbering Standards", Component: JobNumberingSection },
  { title: "5. PM Standards", Component: PMStandardsSection },
  { title: "6. Spare Parts Strategy & Criticality", Component: SparesStrategySection },
  { title: "7. Data Governance & Change Control", Component: DataGovernanceSection },
  { title: "8. Processing Plant Asset Tagging", Component: ProcessingPlantAssetTaggingSection },
  { title: "9. Asset Tag Rollout Plan", Component: AssetTagRolloutPlanSection },
];

export const PrintAllFoundationsModal: React.FC<PrintAllFoundationsModalProps> = ({
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TCMG-Maintenance-Foundations.pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Maintenance Process Foundations — TCMG</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }

            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 11px;
              line-height: 1.5;
              color: #111;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* Cover header */
            .doc-cover {
              text-align: center;
              padding: 20mm 0 10mm;
              border-bottom: 3px solid #d4a017;
              margin-bottom: 10mm;
            }

            .doc-cover h1 {
              font-size: 22px;
              font-weight: 700;
              letter-spacing: -0.5px;
              color: #111;
            }

            .doc-cover p {
              font-size: 12px;
              color: #555;
              margin-top: 4px;
            }

            /* Section divider */
            .section-break {
              page-break-before: always;
              padding-top: 6mm;
            }

            .section-title {
              font-size: 15px;
              font-weight: 700;
              color: #111;
              border-left: 4px solid #d4a017;
              padding-left: 10px;
              margin-bottom: 8mm;
            }

            /* Cards */
            .card, [class*="rounded"] {
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 10px 12px;
              margin-bottom: 8px;
            }

            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px;
            }

            th, td {
              border: 1px solid #ccc;
              padding: 5px 8px;
              text-align: left;
              font-size: 10px;
            }

            th {
              background-color: #f5f0e0;
              font-weight: 600;
            }

            tr:nth-child(even) td {
              background-color: #fafafa;
            }

            /* Badges / inline colour chips */
            .badge, [class*="badge"] {
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 1px 6px;
              font-size: 9px;
              display: inline-block;
            }

            /* Muted text */
            .text-muted, [class*="muted"] {
              color: #666;
            }

            /* Hide interactive controls */
            button, input, select {
              display: none !important;
            }

            /* SVG tag mockups — keep visible */
            svg {
              display: block;
            }

            /* Preserve inline backgrounds & gradients on tag mockups */
            [style*="background"] {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            /* Force tag mockup gradient backgrounds to render */
            [style*="linear-gradient"] {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background: inherit !important;
            }

            h2, h3, h4 {
              margin-bottom: 4px;
              font-weight: 600;
            }

            ul, ol {
              padding-left: 16px;
              margin-bottom: 6px;
            }

            li {
              margin-bottom: 2px;
              font-size: 10px;
            }

            p {
              margin-bottom: 4px;
              font-size: 10px;
            }

            .separator, hr {
              border: none;
              border-top: 1px solid #ddd;
              margin: 6px 0;
            }

            /* Footer on each page */
            @page {
              @bottom-right {
                content: "TCMG Maintenance Foundations | " counter(page) " of " counter(pages);
                font-size: 8px;
                color: #999;
              }
            }
          </style>
        </head>
        <body>
          <div class="doc-cover">
            <h1>Maintenance Process Foundations</h1>
            <p>Tennant Mines Gold — Proposal Document | ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

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
              Print All — Maintenance Process Foundations
            </DialogTitle>
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

        {/* Scrollable preview of all sections */}
        <div className="flex-1 overflow-auto bg-muted/40 p-6">
          <div
            ref={printRef}
            className="bg-white mx-auto shadow-xl rounded-lg"
            style={{ maxWidth: "210mm", padding: "12mm" }}
          >
            {SECTIONS.map(({ title, Component }, i) => (
              <div key={title} className={i > 0 ? "mt-10 pt-8 border-t-2 border-primary/30" : ""}>
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
