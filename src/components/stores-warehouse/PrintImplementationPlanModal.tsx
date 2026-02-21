import React, { useRef } from "react";
import { X, Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImplementationPlanDocument } from "./ImplementationPlanDocument";

interface PrintImplementationPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintImplementationPlanModal: React.FC<PrintImplementationPlanModalProps> = ({
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stores & Warehouse Implementation Plan — TCMG</title>
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
              font-size: 10px;
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

            /* Page break markers */
            .print-page-break {
              page-break-before: always;
            }

            /* Cards */
            .card, [class*="rounded-lg"] {
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
              font-size: 9px;
            }

            th, td {
              border: 1px solid #ccc;
              padding: 4px 6px;
              text-align: left;
              font-size: 9px;
            }

            th {
              background-color: #f5f0e0;
              font-weight: 600;
            }

            tr:nth-child(even) td {
              background-color: #fafafa;
            }

            /* Badges */
            .badge, [class*="badge"] {
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 1px 6px;
              font-size: 8px;
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

            svg {
              display: inline-block;
              width: 16px;
              height: 16px;
            }

            h2, h3, h4 {
              margin-bottom: 4px;
              font-weight: 600;
            }

            h2 { font-size: 14px; }
            h3 { font-size: 12px; }
            h4 { font-size: 11px; }

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

            /* Dashed placeholder boxes */
            [class*="border-dashed"] {
              border: 2px dashed #ccc;
              padding: 12px;
              text-align: center;
              margin: 8px 0;
              border-radius: 6px;
            }

            /* Avoid breaking inside elements */
            table, .card, [class*="rounded-lg"] {
              page-break-inside: avoid;
            }

            /* Footer */
            @page {
              @bottom-right {
                content: "TCMG Stores Implementation Plan | " counter(page) " of " counter(pages);
                font-size: 8px;
                color: #999;
              }
            }
          </style>
        </head>
        <body>
          <div class="doc-cover">
            <h1>Stores & Warehouse Implementation Plan</h1>
            <p>Tennant Creek Mines Gold — TCMG-PLAN-STORES-001 | 21st February 2026</p>
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
              Print Preview — Stores & Warehouse Implementation Plan
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable A4 preview */}
        <div className="flex-1 overflow-auto bg-muted/40 p-6">
          <style>{`
            .a4-print-preview .print-page-break:not(:first-child) {
              border-top: 2px dashed hsl(var(--destructive));
              margin-top: 2rem;
              padding-top: 2rem;
              position: relative;
            }
            .a4-print-preview .print-page-break:not(:first-child)::before {
              content: '— PAGE BREAK —';
              position: absolute;
              top: -0.75rem;
              left: 50%;
              transform: translateX(-50%);
              background: hsl(var(--destructive));
              color: white;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 1px;
              padding: 2px 12px;
              border-radius: 4px;
            }
          `}</style>
          <div
            ref={printRef}
            className="mx-auto bg-white dark:bg-card shadow-xl rounded-lg a4-print-preview"
            style={{ maxWidth: "210mm", padding: "15mm" }}
          >
            <ImplementationPlanDocument />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
