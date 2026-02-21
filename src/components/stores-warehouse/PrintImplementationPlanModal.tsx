import React, { useRef, useEffect, useState, useCallback } from "react";
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

/**
 * A4 dimensions at 96 DPI:
 *   210mm = 793.7px, 297mm = 1122.5px
 *   With 15mm margins: content = 180mm × 267mm = 680.3px × 1009.1px
 */
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const MARGIN_PX = 57; // ~15mm at 96dpi
const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - MARGIN_PX * 2; // ~1009px

export const PrintImplementationPlanModal: React.FC<PrintImplementationPlanModalProps> = ({
  isOpen,
  onClose,
}) => {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([]);

  const buildPages = useCallback(() => {
    const container = hiddenRef.current;
    if (!container) return;

    const topChildren = Array.from(container.children[0]?.children ?? []) as HTMLElement[];
    if (topChildren.length === 0) return;

    const builtPages: string[] = [];
    let currentPageElements: HTMLElement[] = [];
    let currentHeight = 0;

    const flushPage = () => {
      if (currentPageElements.length === 0) return;
      const wrapper = document.createElement("div");
      wrapper.setAttribute("style", "display:flex;flex-direction:column;gap:16px;");
      currentPageElements.forEach((el) => wrapper.appendChild(el.cloneNode(true)));
      builtPages.push(wrapper.innerHTML);
      currentPageElements = [];
      currentHeight = 0;
    };

    const addElement = (el: HTMLElement) => {
      const h = el.getBoundingClientRect().height;
      if (currentHeight + h > CONTENT_HEIGHT_PX && currentPageElements.length > 0) {
        flushPage();
      }
      currentPageElements.push(el);
      currentHeight += h + 16; // 16px gap between items
    };

    /**
     * For elements that exceed an A4 page, drill into their children
     * and distribute them across pages individually.
     */
    const distributeElement = (el: HTMLElement) => {
      const h = el.getBoundingClientRect().height;

      // Skip separators
      if (el.getAttribute("data-slot") === "separator" || el.getAttribute("role") === "separator") {
        return;
      }

      // Fits on current page — just add it
      if (h <= CONTENT_HEIGHT_PX && currentHeight + h <= CONTENT_HEIGHT_PX) {
        addElement(el);
        return;
      }

      // Fits on a fresh page — flush and add
      if (h <= CONTENT_HEIGHT_PX) {
        flushPage();
        addElement(el);
        return;
      }

      // Too tall for one page — break into inner children
      const innerChildren = Array.from(el.children) as HTMLElement[];
      if (innerChildren.length <= 1) {
        // Can't break further — force onto its own page
        flushPage();
        addElement(el);
        return;
      }

      // For section wrappers, add the section header first, then distribute inner content
      innerChildren.forEach((inner) => {
        const innerH = inner.getBoundingClientRect().height;
        if (innerH > CONTENT_HEIGHT_PX) {
          // Recursively break down deeply nested large elements
          const deepChildren = Array.from(inner.children) as HTMLElement[];
          if (deepChildren.length > 1) {
            deepChildren.forEach((deep) => distributeElement(deep));
          } else {
            flushPage();
            addElement(inner);
          }
        } else {
          if (currentHeight + innerH > CONTENT_HEIGHT_PX && currentPageElements.length > 0) {
            flushPage();
          }
          addElement(inner);
        }
      });
    };

    topChildren.forEach((child) => distributeElement(child));
    flushPage();
    setPages(builtPages);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Wait for the hidden content to render
      const timer = setTimeout(buildPages, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, buildPages]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const pagesHtml = pages
      .map(
        (html, i) =>
          `<div class="print-page" ${i > 0 ? 'style="page-break-before: always;"' : ""}>${html}</div>`
      )
      .join("\n");

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
              font-size: 9px;
              line-height: 1.4;
              color: #111;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .doc-cover {
              text-align: center;
              padding: 20mm 0 10mm;
              border-bottom: 3px solid #d4a017;
              margin-bottom: 10mm;
              page-break-after: always;
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

            .print-page { }

            [class*="rounded-lg"] {
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 10px 12px;
              margin-bottom: 8px;
            }

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

            [class*="badge"] {
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 1px 6px;
              font-size: 8px;
              display: inline-block;
            }

            [class*="muted"] { color: #666; }

            button, input, select { display: none !important; }

            svg { display: inline-block; width: 16px; height: 16px; }

            h2, h3, h4 { margin-bottom: 3px; font-weight: 600; }
            h2 { font-size: 13px; }
            h3 { font-size: 11px; }
            h4 { font-size: 10px; }

            ul, ol { padding-left: 14px; margin-bottom: 4px; }
            li { margin-bottom: 1px; font-size: 9px; }
            p { margin-bottom: 3px; font-size: 9px; }

            .separator, hr {
              border: none;
              border-top: 1px solid #ddd;
              margin: 6px 0;
            }

            [class*="border-dashed"] {
              border: 2px dashed #ccc;
              padding: 12px;
              text-align: center;
              margin: 8px 0;
              border-radius: 6px;
            }

            table, [class*="rounded-lg"] {
              page-break-inside: avoid;
            }

            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="doc-cover">
            <h1>Stores & Warehouse Implementation Plan</h1>
            <p>Tennant Creek Mines Gold — TCMG-PLAN-STORES-001 | 21st February 2026</p>
          </div>
          ${pagesHtml}
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
            <Button onClick={handlePrint} className="gap-2" disabled={pages.length === 0}>
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Hidden measurer — uses compact print sizing */}
        <div
          ref={hiddenRef}
          aria-hidden
          className="print-compact-text"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: `${A4_WIDTH_PX - MARGIN_PX * 2}px`,
            visibility: "hidden",
          }}
        >
          <ImplementationPlanDocument />
        </div>

        {/* Compact text styles for preview and measurer */}
        <style>{`
          .print-compact-text { font-size: 11px; line-height: 1.45; }
          .print-compact-text p,
          .print-compact-text li,
          .print-compact-text span { font-size: 11px !important; line-height: 1.45 !important; }
          .print-compact-text h2 { font-size: 15px !important; }
          .print-compact-text h3 { font-size: 13px !important; }
          .print-compact-text h4 { font-size: 12px !important; }
          .print-compact-text th,
          .print-compact-text td { font-size: 10px !important; padding: 3px 5px !important; }
          .print-compact-text .text-sm { font-size: 11px !important; }
          .print-compact-text .text-xs { font-size: 10px !important; }
          .print-compact-text .text-2xl { font-size: 18px !important; }
          .print-compact-text .text-xl { font-size: 16px !important; }
          .print-compact-text .text-base { font-size: 12px !important; }
          .print-compact-text .space-y-4 > * + * { margin-top: 10px !important; }
          .print-compact-text .space-y-2 > * + * { margin-top: 6px !important; }
          .print-compact-text .space-y-8 > * + * { margin-top: 16px !important; }
          .print-compact-text .gap-4 { gap: 10px !important; }
          .print-compact-text .p-4 { padding: 10px !important; }
          .print-compact-text .p-6 { padding: 12px !important; }
          .print-compact-text .mb-6 { margin-bottom: 12px !important; }
          .print-compact-text .mb-3 { margin-bottom: 8px !important; }
          .print-compact-text .pl-12 { padding-left: 28px !important; }
        `}</style>

        {/* Scrollable A4 page preview */}
        <div className="flex-1 overflow-auto bg-muted/40 py-8 px-4">
          <div className="flex flex-col items-center gap-8">
            {pages.length === 0 && (
              <div className="text-sm text-muted-foreground py-20">Building page preview…</div>
            )}
            {pages.map((html, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 bg-white dark:bg-card rounded shadow-lg print-compact-text"
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  minHeight: `${A4_HEIGHT_PX}px`,
                  padding: `${MARGIN_PX}px`,
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: html }} />
                <div
                  className="absolute bottom-3 right-4 text-[9px] text-muted-foreground"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Page {i + 1} of {pages.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
