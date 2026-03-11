import React, { useRef, useEffect, useState, useCallback } from "react";
import { X, Printer, FileText, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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
const GAP = 10; // gap between items on a page
const ORPHAN_THRESHOLD = 120; // keep at least this much content with a header

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
      wrapper.setAttribute("style", `display:flex;flex-direction:column;gap:${GAP}px;`);
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
      currentHeight += h + GAP;
    };

    /**
     * Check if an element is a section/subsection header (contains h2/h3/h4)
     */
    const isHeader = (el: HTMLElement): boolean => {
      const tag = el.tagName?.toLowerCase();
      if (tag === "h2" || tag === "h3" || tag === "h4") return true;
      // Check if it's a flex wrapper containing an h2/h3 (section header pattern)
      if (el.querySelector("h2, h3")) {
        const h = el.getBoundingClientRect().height;
        if (h < 60) return true; // Short element with heading = header row
      }
      return false;
    };

    /**
     * Add a header element together with the next sibling content
     * to prevent orphaned headers at page bottom
     */
    const addHeaderWithContent = (header: HTMLElement, nextContent: HTMLElement | null) => {
      const headerH = header.getBoundingClientRect().height;
      const contentH = nextContent ? Math.min(nextContent.getBoundingClientRect().height, ORPHAN_THRESHOLD) : 0;
      const combinedH = headerH + GAP + contentH;

      // If the header + minimum content won't fit, start a new page
      if (currentHeight + combinedH > CONTENT_HEIGHT_PX && currentPageElements.length > 0) {
        flushPage();
      }
      currentPageElements.push(header);
      currentHeight += headerH + GAP;
    };

    /**
     * Distribute an element across pages, recursively breaking
     * oversized elements into their children.
     */
    const distributeElement = (el: HTMLElement) => {
      const h = el.getBoundingClientRect().height;

      // Skip separators
      if (el.getAttribute("data-slot") === "separator" || el.getAttribute("role") === "separator") {
        return;
      }

      // Fits on current page
      if (h <= CONTENT_HEIGHT_PX && currentHeight + h <= CONTENT_HEIGHT_PX) {
        addElement(el);
        return;
      }

      // Fits on a fresh page
      if (h <= CONTENT_HEIGHT_PX) {
        flushPage();
        addElement(el);
        return;
      }

      // Too tall for one page, break into children
      const innerChildren = Array.from(el.children) as HTMLElement[];
      if (innerChildren.length <= 1) {
        // Can't break further, force onto its own page
        flushPage();
        addElement(el);
        return;
      }

      // Process children, keeping headers with their following content
      for (let i = 0; i < innerChildren.length; i++) {
        const child = innerChildren[i];
        const childH = child.getBoundingClientRect().height;

        if (isHeader(child)) {
          const nextSibling = i + 1 < innerChildren.length ? innerChildren[i + 1] : null;
          addHeaderWithContent(child, nextSibling);
          continue;
        }

        if (childH > CONTENT_HEIGHT_PX) {
          // Recursively break down deeply nested large elements
          const deepChildren = Array.from(child.children) as HTMLElement[];
          if (deepChildren.length > 1) {
            for (let j = 0; j < deepChildren.length; j++) {
              const deep = deepChildren[j];
              const deepH = deep.getBoundingClientRect().height;

              if (isHeader(deep)) {
                const nextDeep = j + 1 < deepChildren.length ? deepChildren[j + 1] : null;
                addHeaderWithContent(deep, nextDeep);
                continue;
              }

              if (deepH > CONTENT_HEIGHT_PX) {
                distributeElement(deep);
              } else {
                if (currentHeight + deepH > CONTENT_HEIGHT_PX && currentPageElements.length > 0) {
                  flushPage();
                }
                addElement(deep);
              }
            }
          } else {
            flushPage();
            addElement(child);
          }
        } else {
          if (currentHeight + childH > CONTENT_HEIGHT_PX && currentPageElements.length > 0) {
            flushPage();
          }
          addElement(child);
        }
      }
    };

    topChildren.forEach((child) => distributeElement(child));
    flushPage();
    setPages(builtPages);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(buildPages, 300);
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
          <title>Stores & Warehouse Implementation Plan, TCMG</title>
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
              font-size: 8px;
              line-height: 1.3;
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

            h2, h3, h4 { margin-bottom: 2px; font-weight: 600; }
            h2 { font-size: 11px; }
            h3 { font-size: 9.5px; }
            h4 { font-size: 9px; }

            ul, ol { padding-left: 14px; margin-bottom: 2px; }
            li { margin-bottom: 1px; font-size: 8px; }
            p { margin-bottom: 2px; font-size: 8px; }

            ol { list-style-type: decimal; }
            ol li { padding-left: 2px; }

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

            h2, h3, h4 {
              page-break-after: avoid;
            }

            img {
              max-width: 55%;
              max-height: 160px;
              height: auto;
              display: block;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="doc-cover">
            <h1>Stores & Warehouse Implementation Plan</h1>
            <p>Tennant Creek Mines Gold | TCMG-PLAN-STORES-001 | 23rd February 2026</p>
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

  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    const pageEls = document.querySelectorAll("[data-pdf-page]");
    if (pageEls.length === 0) return;

    setDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const A4_W = 210;
      const A4_H = 297;

      for (let i = 0; i < pageEls.length; i++) {
        const el = pageEls[i] as HTMLElement;

        const canvas = await html2canvas(el, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.85);
        if (i > 0) pdf.addPage();

        const canvasRatio = canvas.height / canvas.width;
        let imgW = A4_W;
        let imgH = A4_W * canvasRatio;
        if (imgH > A4_H) {
          imgH = A4_H;
          imgW = A4_H / canvasRatio;
        }

        pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH);
      }

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TCMG-Stores-Implementation-Plan.pdf";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">
              Print Preview: Stores & Warehouse Implementation Plan
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownloadPDF} className="gap-2" disabled={pages.length === 0 || downloading}>
              <Download className="w-4 h-4" />
              {downloading ? "Downloading…" : "Download PDF"}
            </Button>
            <Button onClick={handlePrint} className="gap-2" disabled={pages.length === 0}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Hidden measurer */}
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
          .print-compact-text { font-size: 9px; line-height: 1.3; }
          .print-compact-text p,
          .print-compact-text li,
          .print-compact-text span { font-size: 9px !important; line-height: 1.3 !important; }
          .print-compact-text h2 { font-size: 12px !important; margin-bottom: 2px !important; }
          .print-compact-text h3 { font-size: 10.5px !important; margin-bottom: 1px !important; }
          .print-compact-text h4 { font-size: 10px !important; margin-bottom: 1px !important; }
          .print-compact-text th,
          .print-compact-text td { font-size: 8px !important; padding: 2px 4px !important; line-height: 1.25 !important; }
          .print-compact-text .text-sm { font-size: 9px !important; }
          .print-compact-text .text-xs { font-size: 8px !important; }
          .print-compact-text .text-\\[10px\\] { font-size: 7px !important; }
          .print-compact-text .text-2xl { font-size: 14px !important; }
          .print-compact-text .text-xl { font-size: 12px !important; }
          .print-compact-text .text-base { font-size: 10px !important; }
          .print-compact-text .text-lg { font-size: 11px !important; }
          .print-compact-text .space-y-4 > * + * { margin-top: 6px !important; }
          .print-compact-text .space-y-3 > * + * { margin-top: 4px !important; }
          .print-compact-text .space-y-2 > * + * { margin-top: 3px !important; }
          .print-compact-text .space-y-1\\.5 > * + * { margin-top: 2px !important; }
          .print-compact-text .space-y-1 > * + * { margin-top: 1px !important; }
          .print-compact-text .space-y-8 > * + * { margin-top: 10px !important; }
          .print-compact-text .gap-4 { gap: 6px !important; }
          .print-compact-text .gap-3 { gap: 4px !important; }
          .print-compact-text .gap-2 { gap: 3px !important; }
          .print-compact-text .gap-1\\.5 { gap: 2px !important; }
          .print-compact-text .gap-1 { gap: 2px !important; }
          .print-compact-text .gap-0\\.5 { gap: 1px !important; }
          .print-compact-text .p-4 { padding: 6px !important; }
          .print-compact-text .p-6 { padding: 8px !important; }
          .print-compact-text .p-3 { padding: 5px !important; }
          .print-compact-text .p-2\\.5 { padding: 4px !important; }
          .print-compact-text .p-2 { padding: 3px !important; }
          .print-compact-text .px-4 { padding-left: 6px !important; padding-right: 6px !important; }
          .print-compact-text .py-3 { padding-top: 4px !important; padding-bottom: 4px !important; }
          .print-compact-text .py-2\\.5 { padding-top: 3px !important; padding-bottom: 3px !important; }
          .print-compact-text .mb-6 { margin-bottom: 6px !important; }
          .print-compact-text .mb-3 { margin-bottom: 4px !important; }
          .print-compact-text .mb-2 { margin-bottom: 3px !important; }
          .print-compact-text .mt-4 { margin-top: 6px !important; }
          .print-compact-text .mt-6 { margin-top: 8px !important; }
          .print-compact-text .mt-3 { margin-top: 4px !important; }
          .print-compact-text .mt-2 { margin-top: 3px !important; }
          .print-compact-text .mt-1 { margin-top: 2px !important; }
          .print-compact-text .pl-12 { padding-left: 20px !important; }
          .print-compact-text .pl-5 { padding-left: 14px !important; }
          .print-compact-text .pt-3 { padding-top: 4px !important; }
          .print-compact-text .pt-2 { padding-top: 3px !important; }
          .print-compact-text .py-4 { padding-top: 4px !important; padding-bottom: 4px !important; }
          .print-compact-text .w-9 { width: 24px !important; }
          .print-compact-text .h-9 { height: 24px !important; }
          .print-compact-text .w-10 { width: 28px !important; }
          .print-compact-text .h-10 { height: 28px !important; }
          .print-compact-text .w-7 { width: 20px !important; }
          .print-compact-text .h-7 { height: 20px !important; }
          .print-compact-text .w-6 { width: 18px !important; }
          .print-compact-text .h-6 { height: 18px !important; }
          .print-compact-text .w-5 { width: 14px !important; }
          .print-compact-text .h-5 { height: 14px !important; }
          .print-compact-text .w-4 { width: 12px !important; }
          .print-compact-text .h-4 { height: 12px !important; }
          .print-compact-text .w-3\\.5 { width: 10px !important; }
          .print-compact-text .h-3\\.5 { height: 10px !important; }
          .print-compact-text img { max-height: 140px !important; object-fit: contain !important; }
          .print-compact-text ul, .print-compact-text ol { margin-bottom: 3px !important; }
          .print-compact-text li { margin-bottom: 0px !important; }
          .print-compact-text .grid { gap: 4px !important; }
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
                data-pdf-page
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
