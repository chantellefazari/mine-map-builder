import React, { useRef, useState } from "react";
import { X, Printer, Download, Loader2, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePdf?: () => Promise<void>;
  children: React.ReactNode;
  title?: string;
}

const A4_WIDTH = 794;
const MARGIN = 30;

const printStyles = `
  @page { size: A4 portrait; margin: 8mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 9px; line-height: 1.3; color: #1a1a1a;
    background: white;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    width: 100%;
  }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #1a1a1a; padding: 3px 5px; text-align: left; font-size: 8px; word-wrap: break-word; overflow-wrap: break-word; }
  th { background-color: #f5f5f5; font-weight: 600; }
  .bg-primary\\/10 { background-color: rgba(212, 160, 23, 0.1) !important; }
  .bg-primary { background-color: #d4a017 !important; }
  .bg-muted { background-color: #f5f5f5 !important; }
  .bg-muted\\/50 { background-color: rgba(245, 245, 245, 0.5) !important; }
  .text-primary { color: #d4a017 !important; }
  .border-border { border-color: #1a1a1a !important; }
  img { max-width: 100%; height: auto; }
  input[type="checkbox"], button[role="checkbox"] {
    width: 10px; height: 10px; border: 1px solid #1a1a1a;
    appearance: none; -webkit-appearance: none; background: white;
    display: inline-block; vertical-align: middle;
  }
  input[type="text"], input {
    border: 1px solid #ccc; padding: 1px 3px; font-size: 8px;
    background: white; height: auto; min-height: 14px;
  }
  .border-2 { border-width: 1px !important; }
  .px-4 { padding-left: 6px; padding-right: 6px; }
  .py-2 { padding-top: 3px; padding-bottom: 3px; }
  .px-2 { padding-left: 4px; padding-right: 4px; }
  .py-1\\.5 { padding-top: 2px; padding-bottom: 2px; }
  .py-3 { padding-top: 4px; padding-bottom: 4px; }
  .px-3 { padding-left: 5px; padding-right: 5px; }
  .p-4 { padding: 6px; }
  .gap-2 { gap: 4px; }
  .gap-1 { gap: 2px; }
  .text-sm { font-size: 8px; }
  .text-xs { font-size: 7.5px; }
  .text-lg { font-size: 10px; }
  .text-base { font-size: 9px; }
  .text-\\[10px\\] { font-size: 8px; }
  .grid { display: grid; }
  div, td, th { max-width: 100%; }
  .space-y-4 > * + * { margin-top: 6px; }
  .space-y-3 > * + * { margin-top: 4px; }
  .space-y-2 > * + * { margin-top: 3px; }
  .space-y-8 > * + * { margin-top: 12px; }

  /* Prevent sections from breaking mid-way */
  .border-b { page-break-inside: avoid; break-inside: avoid; }
  
  /* Keep sign-off block together */
  .space-y-4 { page-break-inside: avoid; break-inside: avoid; }
  .print-hide { display: none !important; }
`;

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  onSavePdf,
  children,
  title = "Print Preview",
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

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
        <body>${printContent.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleExportHtml = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${printStyles}
    html, body { margin: 0; padding: 0; }
    body { padding: 8mm; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
${printContent.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSavePdf = async () => {
    if (!onSavePdf) return;
    setIsSaving(true);
    try {
      await onSavePdf();
    } catch (err: any) {
      console.error("PDF save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0" aria-describedby={undefined}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <div className="flex items-center gap-3">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview - shows content at A4 width, browser print handles page breaks */}
        <div className="flex-1 overflow-auto bg-muted/50 p-8">
          <div className="mx-auto">
            <div
              ref={printRef}
              className="bg-white shadow-xl mx-auto [&_.print-hide]:hidden"
              style={{
                width: `${A4_WIDTH}px`,
                padding: `${MARGIN}px`,
                boxSizing: "border-box",
                fontSize: "9px",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
