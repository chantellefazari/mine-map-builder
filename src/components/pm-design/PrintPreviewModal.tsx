import React, { useRef } from "react";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Print Preview",
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
          <title>${title}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 10px;
              line-height: 1.4;
              color: #1a1a1a;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: auto;
            }
            
            tr {
              page-break-inside: avoid;
            }
            
            th, td {
              border: 1px solid #1a1a1a;
              padding: 4px 6px;
              text-align: left;
              font-size: 9px;
            }
            
            th {
              background-color: #f5f5f5;
              font-weight: 600;
            }
            
            .bg-primary {
              background-color: #d4a017 !important;
            }
            
            .bg-muted {
              background-color: #f5f5f5 !important;
            }
            
            .text-primary {
              color: #d4a017 !important;
            }
            
            .border-border {
              border-color: #1a1a1a !important;
            }
            
            img {
              max-width: 100%;
              height: auto;
            }
            
            .font-mono {
              font-family: 'JetBrains Mono', monospace;
            }
            
            h1, h2, h3, h4 {
              margin-bottom: 0.5em;
            }
            
            /* Checkbox styling for print */
            input[type="checkbox"] {
              width: 12px;
              height: 12px;
              border: 1px solid #1a1a1a;
              appearance: none;
              -webkit-appearance: none;
              background: white;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* A4 Preview Container */}
        <div className="flex-1 overflow-auto bg-muted/50 p-8">
          <div className="mx-auto">
            {/* A4 Paper simulation - 210mm x 297mm at 96dpi ≈ 794px x 1123px */}
            <div
              ref={printRef}
              className="bg-white shadow-xl mx-auto"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "10mm",
                boxSizing: "border-box",
              }}
            >
              {/* Scale down the content to fit A4 */}
              <div className="origin-top-left" style={{ fontSize: "10px" }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
