/**
 * TCMG Standard PDF Export Engine
 * ================================
 * Reusable A4 section-based PDF generator.
 *
 * Usage:
 *   1. Mark sections in your JSX with `data-pdf-section` attributes.
 *   2. Pass the container ref and filename to `exportSectionsToPdf`.
 *
 * Example:
 *   <div ref={contentRef}>
 *     <div data-pdf-section>…</div>
 *     <div data-pdf-section>…</div>
 *   </div>
 *
 *   await exportSectionsToPdf(contentRef.current, "My_Document.pdf");
 */

import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";

export interface SectionPdfOptions {
  /** A4 margin in mm (default 8) */
  margin?: number;
  /** Gap between sections in mm (default 2) */
  gap?: number;
  /** Render width in px for off-screen clone (default 740) */
  renderWidth?: number;
  /** Clone font size (default "13px") */
  fontSize?: string;
  /** Clone line height (default "1.4") */
  lineHeight?: string;
  /** html2canvas scale factor (default 2) */
  scale?: number;
  /** Overlap in px between page slices to prevent glyph clipping (default 14) */
  sliceOverlapPx?: number;
  /** Draw a border around the content area on each page (default false) */
  addBorder?: boolean;
  /** Trailing blank page threshold in mm — pages with less content than this are removed (default 15) */
  blankPageThreshold?: number;
}

const DEFAULTS: Required<SectionPdfOptions> = {
  margin: 8,
  gap: 1,
  renderWidth: 740,
  fontSize: "13px",
  lineHeight: "1.4",
  scale: 1.5,
  sliceOverlapPx: 2,
  addBorder: false,
  blankPageThreshold: 15,
};

/**
 * Export all `[data-pdf-section]` children of `container` to A4 PDF.
 * Returns the jsPDF blob.
 */
export async function exportSectionsToPdf(
  container: HTMLElement,
  filename: string,
  opts?: SectionPdfOptions
): Promise<Blob> {
  const cfg = { ...DEFAULTS, ...opts };

  const html2canvas = (await import("html2canvas")).default;
  const jsPDF = (await import("jspdf")).default;

  const A4_W = 210;
  const A4_H = 297;
  const MARGIN = cfg.margin;
  const CONTENT_W = A4_W - MARGIN * 2;
  const CONTENT_H = A4_H - MARGIN * 2;
  const GAP = cfg.gap;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const sourceSections = Array.from(
    container.querySelectorAll<HTMLElement>("[data-pdf-section]")
  );

  const getLogicalSections = (roots: HTMLElement[]) => {
    if (roots.length !== 1) return roots;

    const [root] = roots;
    const borderContainer = root.querySelector<HTMLElement>(".border-2.border-border");
    const sectionHost = borderContainer ?? (root.firstElementChild as HTMLElement | null) ?? root;

    const childBlocks = Array.from(sectionHost.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    );

    const logicalBlocks = childBlocks.filter((block) => {
      const style = window.getComputedStyle(block);
      if (style.display === "none" || style.visibility === "hidden") return false;

      const text = (block.textContent ?? "").trim();
      const hasStructuredContent = Boolean(
        block.querySelector("table, img, svg, canvas, input, textarea, select")
      );

      return text.length > 0 || hasStructuredContent;
    });

    // If the template has identifiable top-level blocks (header/metadata/table/signoff),
    // paginate by these blocks to avoid section headers/sign-off being sliced.
    return logicalBlocks.length >= 3 ? logicalBlocks : roots;
  };

  const sections = getLogicalSections(sourceSections);

  let currentY = MARGIN;

  // ── Slice a single canvas across pages ──────────────────────────
  const addCanvasAcrossPages = (
    canvas: HTMLCanvasElement,
    rowBreaksPx: number[] = []
  ) => {
    const pxPerMm = canvas.width / CONTENT_W;
    const safeBreaks = Array.from(new Set(rowBreaksPx))
      .map((v) => Math.round(v))
      .filter((v) => v > 0 && v < canvas.height)
      .sort((a, b) => a - b);

    let sourceY = 0;
    let safety = 0;
    const MAX_SLICES = 400;

    while (sourceY < canvas.height && safety < MAX_SLICES) {
      safety++;

      const remainingMm = A4_H - MARGIN - currentY;
      if (remainingMm <= 0.5) {
        pdf.addPage();
        currentY = MARGIN;
        continue;
      }

      const maxSliceHeightPx = Math.min(
        canvas.height - sourceY,
        Math.floor(remainingMm * pxPerMm)
      );

      if (maxSliceHeightPx <= 0) {
        pdf.addPage();
        currentY = MARGIN;
        continue;
      }

      const maxEnd = sourceY + maxSliceHeightPx;

      // Find the CLOSEST row break to the max cut point that is BEFORE it.
      // This minimises wasted space while still avoiding cutting through rows.
      let bestBreak = -1;
      for (let i = safeBreaks.length - 1; i >= 0; i--) {
        const point = safeBreaks[i];
        if (point <= sourceY + 10) break; // too close to start
        if (point <= maxEnd) {
          bestBreak = point;
          break; // take the first (closest to maxEnd) break
        }
      }

      // Only use the break if it doesn't waste more than 15% of page height.
      // Otherwise just do a hard cut — better to clip a row slightly than
      // leave a huge gap.
      const wastedPx = bestBreak > sourceY ? (maxEnd - bestBreak) : maxSliceHeightPx;
      const wastedRatio = wastedPx / (CONTENT_H * pxPerMm);
      const sliceEnd = (bestBreak > sourceY && wastedRatio <= 0.15) ? bestBreak : maxEnd;

      const sliceHeightPx = Math.max(
        1,
        Math.min(canvas.height - sourceY, Math.floor(sliceEnd - sourceY))
      );

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;

      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) break;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        canvas.width,
        sliceHeightPx
      );

      const sliceHeightMm = sliceHeightPx / pxPerMm;
      const imgData = sliceCanvas.toDataURL("image/jpeg", 0.92);
      pdf.addImage(
        imgData,
        "JPEG",
        MARGIN,
        currentY,
        CONTENT_W,
        sliceHeightMm
      );

      const reachedEnd = sourceY + sliceHeightPx >= canvas.height - 1;
      // Advance with a tiny overlap to prevent glyph clipping at boundaries
      const overlapPx = reachedEnd ? 0 : cfg.sliceOverlapPx;
      sourceY = reachedEnd ? canvas.height : sourceY + sliceHeightPx - overlapPx;
      currentY += sliceHeightMm;

      if (!reachedEnd) {
        pdf.addPage();
        currentY = MARGIN;
      }
    }
  };

  // ── Render a section via off-screen clone ───────────────────────
  const renderSectionCanvas = async (
    section: HTMLElement
  ): Promise<{ canvas: HTMLCanvasElement; rowBreaksPx: number[] }> => {
    const sectionRenderWidth = Math.max(
      cfg.renderWidth,
      Math.ceil(section.scrollWidth) + 8
    );

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-100000px";
    wrapper.style.top = "0";
    wrapper.style.padding = "4px";
    wrapper.style.background = "#ffffff";
    wrapper.style.boxSizing = "content-box";
    wrapper.style.width = `${sectionRenderWidth}px`;
    wrapper.style.overflow = "visible";
    wrapper.style.fontSize = cfg.fontSize;
    wrapper.style.lineHeight = cfg.lineHeight;

    const clone = section.cloneNode(true) as HTMLElement;
    clone.style.margin = "0";
    clone.style.width = "100%";
    clone.style.maxWidth = "none";
    clone.style.overflow = "visible";

    // Ensure all tables render at full width
    clone.querySelectorAll<HTMLElement>("table").forEach((table) => {
      table.style.width = "100%";
      table.style.tableLayout = "fixed";
    });

    // Prevent text clipping in cells
    clone.querySelectorAll<HTMLElement>("th, td").forEach((cell) => {
      cell.style.whiteSpace = "normal";
      cell.style.wordBreak = "break-word";
      cell.style.overflowWrap = "anywhere";
    });

    // Remove any UI-only elements from the clone
    clone.querySelectorAll<HTMLElement>(".print-hide").forEach((el) => el.remove());

    // Expand all collapsed/scrollable areas
    clone.querySelectorAll<HTMLElement>("[data-state='closed']").forEach((el) => {
      el.setAttribute("data-state", "open");
    });

    wrapper.appendChild(clone);

    document.body.appendChild(wrapper);
    try {
      const wrapperRect = wrapper.getBoundingClientRect();

      // Collect ALL row boundaries — tbody tr, thead tr, and section dividers
      const breakElements = clone.querySelectorAll<HTMLElement>(
        "tr, [data-pdf-break], .border-b"
      );
      const rowBreaksCssPx = Array.from(breakElements)
        .map((row) => row.getBoundingClientRect().bottom - wrapperRect.top)
        .filter((value) => Number.isFinite(value) && value > 0);

      const canvas = await html2canvas(wrapper, {
        scale: cfg.scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: sectionRenderWidth + 8,
        windowWidth: sectionRenderWidth + 8,
      });

      return {
        canvas,
        rowBreaksPx: rowBreaksCssPx.map((value) => Math.round(value * cfg.scale)),
      };
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  // ── Main loop ───────────────────────────────────────────────────
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const { canvas, rowBreaksPx } = await renderSectionCanvas(section);

    const sectionHeightMm = canvas.height / (canvas.width / CONTENT_W);
    const remainingMm = A4_H - MARGIN - currentY;

    // Only push to a new page if the section fits on one page AND
    // there's less than 2mm remaining (keep content flowing continuously)
    if (
      sectionHeightMm <= CONTENT_H &&
      sectionHeightMm > remainingMm &&
      remainingMm < 2
    ) {
      pdf.addPage();
      currentY = MARGIN;
    }

    addCanvasAcrossPages(canvas, rowBreaksPx);

    if (i < sections.length - 1) {
      currentY += GAP;
      if (currentY > A4_H - MARGIN) {
        pdf.addPage();
        currentY = MARGIN;
      }
    }
  }

  // ── Remove trailing blank page if present ──────────────────────
  const totalPages = pdf.getNumberOfPages();
  if (totalPages > 1) {
    pdf.setPage(totalPages);
    // If nothing meaningful was drawn on this page, delete it
    if (currentY <= MARGIN + cfg.blankPageThreshold) {
      pdf.deletePage(totalPages);
    }
  }

  // ── Draw borders on every page if requested ─────────────────────
  if (cfg.addBorder) {
    const pageCount = pdf.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      pdf.setPage(p);
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.4);
      pdf.rect(MARGIN - 2, MARGIN - 2, CONTENT_W + 4, A4_H - MARGIN * 2 + 4);
    }
  }

  const blob = pdf.output("blob");
  await uploadAndShowPdf(blob, filename);
  return blob;
}
