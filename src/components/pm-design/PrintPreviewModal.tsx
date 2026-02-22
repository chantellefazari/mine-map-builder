import React, { useRef, useEffect, useState, useCallback } from "react";
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

// A4 at 96dpi
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const MARGIN = 30; // ~8mm
const CONTENT_WIDTH = A4_WIDTH - MARGIN * 2;
const CONTENT_HEIGHT = A4_HEIGHT - MARGIN * 2;

const printStyles = `
  @page { size: A4 portrait; margin: 8mm; }
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

interface PageContent {
  elements: { html: string; height: number }[];
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  children,
  title = "Print Preview",
}) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<PageContent[]>([]);

  const paginateContent = useCallback(() => {
    const container = measureRef.current;
    if (!container) return;

    // Get all direct top-level breakable elements
    const breakableElements = getBreakableElements(container);
    
    const newPages: PageContent[] = [];
    let currentPage: PageContent = { elements: [] };
    let currentHeight = 0;

    for (const el of breakableElements) {
      const elHeight = el.offsetHeight;
      
      // If adding this element would exceed page height
      if (currentHeight + elHeight > CONTENT_HEIGHT && currentPage.elements.length > 0) {
        // Push current page and start new one
        newPages.push(currentPage);
        currentPage = { elements: [] };
        currentHeight = 0;
      }

      // If single element is taller than a page, we still add it (it'll overflow but won't be lost)
      currentPage.elements.push({
        html: el.outerHTML,
        height: elHeight,
      });
      currentHeight += elHeight;
    }

    // Push last page
    if (currentPage.elements.length > 0) {
      newPages.push(currentPage);
    }

    setPages(newPages.length > 0 ? newPages : [{ elements: [{ html: container.innerHTML, height: CONTENT_HEIGHT }] }]);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    // Wait for content to render and measure
    const timer = setTimeout(paginateContent, 300);
    return () => clearTimeout(timer);
  }, [isOpen, children, paginateContent]);

  const handlePrint = () => {
    if (pages.length === 0) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Build paginated HTML with explicit page breaks
    const pagesHtml = pages.map((page, idx) => {
      const pageBreak = idx < pages.length - 1 ? 'page-break-after: always;' : '';
      const elementsHtml = page.elements.map(e => e.html).join('');
      return `<div style="${pageBreak}">${elementsHtml}</div>`;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>${printStyles}</style>
        </head>
        <body>${pagesHtml}</body>
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
            <span className="text-sm text-muted-foreground">
              {pages.length} {pages.length === 1 ? 'page' : 'pages'}
            </span>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* A4 Preview - paginated */}
        <div className="flex-1 overflow-auto bg-muted/50 p-8">
          <div className="mx-auto flex flex-col items-center gap-8">
            {pages.map((page, pageIdx) => (
              <div key={pageIdx} className="relative">
                <div className="absolute -top-6 left-0 text-xs text-muted-foreground font-medium">
                  Page {pageIdx + 1} of {pages.length}
                </div>
                <div
                  className="bg-white shadow-xl border border-border/30"
                  style={{
                    width: `${A4_WIDTH}px`,
                    minHeight: `${A4_HEIGHT}px`,
                    padding: `${MARGIN}px`,
                    boxSizing: "border-box",
                    fontSize: "9px",
                  }}
                >
                  {page.elements.map((el, elIdx) => (
                    <div key={elIdx} dangerouslySetInnerHTML={{ __html: el.html }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Hidden measurement container - renders at print scale to measure heights */}
          <div
            style={{
              position: "absolute",
              left: "-9999px",
              top: 0,
              width: `${CONTENT_WIDTH}px`,
              fontSize: "9px",
              visibility: "hidden",
            }}
          >
            <div ref={measureRef}>
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Recursively collects breakable elements from the container.
 * Tries to break at table rows (tr), div sections, or top-level children.
 */
function getBreakableElements(container: HTMLElement): HTMLElement[] {
  const results: HTMLElement[] = [];
  
  // Walk through container's direct children
  const walker = (parent: HTMLElement) => {
    const children = Array.from(parent.children) as HTMLElement[];
    
    for (const child of children) {
      const tag = child.tagName.toLowerCase();
      const height = child.offsetHeight;
      
      // If it's small enough, take it as-is
      if (height <= CONTENT_HEIGHT) {
        results.push(child);
        continue;
      }
      
      // If it's a table, break by rows
      if (tag === 'table') {
        const thead = child.querySelector('thead');
        const rows = Array.from(child.querySelectorAll('tbody > tr')) as HTMLElement[];
        
        if (thead) results.push(thead as HTMLElement);
        for (const row of rows) {
          results.push(row as HTMLElement);
        }
        continue;
      }
      
      // If it's a large div, try to break its children
      if (child.children.length > 1) {
        walker(child);
      } else {
        // Can't break further, just add it
        results.push(child);
      }
    }
  };

  walker(container);
  
  // If no breakable elements found, return the container itself
  if (results.length === 0) {
    results.push(container);
  }
  
  return results;
}
