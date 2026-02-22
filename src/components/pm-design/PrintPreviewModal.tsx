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
              margin: 8mm;
            }
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 8px;
              line-height: 1.3;
              color: #1a1a1a;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              width: 100%;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: auto;
              table-layout: fixed;
            }
            
            tr {
              page-break-inside: avoid;
            }
            
            th, td {
              border: 1px solid #1a1a1a;
              padding: 2px 4px;
              text-align: left;
              font-size: 7.5px;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            
            th {
              background-color: #f5f5f5;
              font-weight: 600;
            }
            
            .bg-primary\\/10 {
              background-color: rgba(212, 160, 23, 0.1) !important;
            }
            
            .bg-primary {
              background-color: #d4a017 !important;
            }
            
            .bg-muted {
              background-color: #f5f5f5 !important;
            }
            
            .bg-muted\\/50 {
              background-color: rgba(245, 245, 245, 0.5) !important;
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
              margin-bottom: 0.3em;
            }
            
            /* Checkbox styling for print */
            input[type="checkbox"],
            button[role="checkbox"] {
              width: 10px;
              height: 10px;
              border: 1px solid #1a1a1a;
              appearance: none;
              -webkit-appearance: none;
              background: white;
              display: inline-block;
              vertical-align: middle;
            }
            
            /* Input fields for print */
            input[type="text"],
            input {
              border: 1px solid #ccc;
              padding: 1px 3px;
              font-size: 7.5px;
              background: white;
              height: auto;
              min-height: 14px;
            }

            /* Scale down all content containers */
            .border-2 {
              border-width: 1px !important;
            }

            /* Reduce padding throughout */
            .px-4 { padding-left: 6px; padding-right: 6px; }
            .py-2 { padding-top: 3px; padding-bottom: 3px; }
            .px-2 { padding-left: 4px; padding-right: 4px; }
            .py-1\\.5 { padding-top: 2px; padding-bottom: 2px; }
            .px-3 { padding-left: 5px; padding-right: 5px; }
            .p-4 { padding: 6px; }
            .gap-2 { gap: 4px; }
            
            /* Font size overrides */
            .text-sm { font-size: 8px; }
            .text-xs { font-size: 7px; }
            .text-lg { font-size: 10px; }
            .text-base { font-size: 8.5px; }
            
            /* Grid layouts - compact */
            .grid { display: grid; }

            /* Ensure content doesn't overflow */
            div, td, th {
              max-width: 100%;
            }

            /* Sign off section compact */
            .space-y-4 > * + * { margin-top: 6px; }
            .space-y-3 > * + * { margin-top: 4px; }
            .space-y-2 > * + * { margin-top: 3px; }
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
                width: "794px",
                minHeight: "1123px",
                padding: "8mm",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {/* Scale content to fit A4 width */}
              <div className="origin-top-left" style={{ fontSize: "9px", width: "100%" }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
