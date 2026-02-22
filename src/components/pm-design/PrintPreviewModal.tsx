import React, { useRef, useEffect, useState } from "react";
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

// A4 at 96dpi: 794px x 1123px, with 8mm margins ≈ 30px each side
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const MARGIN = 30; // ~8mm
const CONTENT_HEIGHT = A4_HEIGHT - MARGIN * 2;

const printStyles = `
  @page {
    size: A4 portrait;
    margin: 8mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 8px; line-height: 1.3; color: #1a1a1a;
    background: white;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    width: 100%;
  }
  table { width: 100%; border-collapse: collapse; page-break-inside: auto; table-layout: fixed; }
  tr { page-break-inside: avoid; }
  th, td { border: 1px solid #1a1a1a; padding: 2px 4px; text-align: left; font-size: 7.5px; word-wrap: break-word; overflow-wrap: break-word; }
  th { background-color: #f5f5f5; font-weight: 600; }
  .bg-primary\\/10 { background-color: rgba(212, 160, 23, 0.1) !important; }
  .bg-primary { background-color: #d4a017 !important; }
  .bg-muted { background-color: #f5f5f5 !important; }
  .bg-muted\\/50 { background-color: rgba(245, 245, 245, 0.5) !important; }
  .text-primary { color: #d4a017 !important; }
  .border-border { border-color: #1a1a1a !important; }
  img { max-width: 100%; height: auto; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  h1, h2, h3, h4 { margin-bottom: 0.3em; }
  input[type="checkbox"], button[role="checkbox"] {
    width: 10px; height: 10px; border: 1px solid #1a1a1a;
    appearance: none; -webkit-appearance: none; background: white;
    display: inline-block; vertical-align: middle;
  }
  input[type="text"], input {
    border: 1px solid #ccc; padding: 1px 3px; font-size: 7.5px;
    background: white; height: auto; min-height: 14px;
  }
  .border-2 { border-width: 1px !important; }
  .px-4 { padding-left: 6px; padding-right: 6px; }
  .py-2 { padding-top: 3px; padding-bottom: 3px; }
  .px-2 { padding-left: 4px; padding-right: 4px; }
  .py-1\\.5 { padding-top: 2px; padding-bottom: 2px; }
  .px-3 { padding-left: 5px; padding-right: 5px; }
  .p-4 { padding: 6px; }
  .gap-2 { gap: 4px; }
  .text-sm { font-size: 8px; }
  .text-xs { font-size: 7px; }
  .text-lg { font-size: 10px; }
  .text-base { font-size: 8.5px; }
  .grid { display: grid; }
  div, td, th { max-width: 100%; }
  .space-y-4 > * + * { margin-top: 6px; }
  .space-y-3 > * + * { margin-top: 4px; }
  .space-y-2 > * + * { margin-top: 3px; }
`;

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Print Preview",
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  // Calculate page count after content renders
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (measureRef.current) {
        const contentH = measureRef.current.scrollHeight;
        setPageCount(Math.max(1, Math.ceil(contentH / CONTENT_HEIGHT)));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isOpen, children]);

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
          <style>${printStyles}</style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* A4 Preview Container - shows pages */}
        <div className="flex-1 overflow-auto bg-muted/50 p-8">
          <div className="mx-auto flex flex-col items-center gap-8">
            {/* Render pages as clipped views of content */}
            {Array.from({ length: pageCount }).map((_, pageIdx) => (
              <div key={pageIdx} className="relative">
                {/* Page number label */}
                <div className="absolute -top-6 left-0 text-xs text-muted-foreground font-medium">
                  Page {pageIdx + 1} of {pageCount}
                </div>
                {/* A4 page */}
                <div
                  className="bg-white shadow-xl border border-border/30"
                  style={{
                    width: `${A4_WIDTH}px`,
                    height: `${A4_HEIGHT}px`,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: `${MARGIN - pageIdx * CONTENT_HEIGHT}px`,
                      left: `${MARGIN}px`,
                      width: `${A4_WIDTH - MARGIN * 2}px`,
                      fontSize: "9px",
                    }}
                  >
                    {children}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hidden measurement container for accurate height + print content */}
          <div
            ref={printRef}
            style={{ position: "absolute", left: "-9999px", top: 0, width: `${A4_WIDTH - MARGIN * 2}px` }}
          >
            <div ref={measureRef} style={{ fontSize: "9px" }}>
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
