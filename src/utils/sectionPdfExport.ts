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
}

const DEFAULTS: Required<SectionPdfOptions> = {
  margin: 8,
  gap: 2,
  renderWidth: 740,
  fontSize: "13px",
  lineHeight: "1.4",
  scale: 2,
  sliceOverlapPx: 14,
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

  const sections = Array.from(
    container.querySelectorAll<HTMLElement>("[data-pdf-section]")
  );

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
      let bestBreak = -1;
      for (let i = 0; i < safeBreaks.length; i++) {
        const point = safeBreaks[i];
        if (point <= sourceY + 10) continue;
        if (point > maxEnd) break;
        bestBreak = point;
      }

      const sliceEnd = bestBreak > sourceY ? bestBreak : maxEnd;
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
      pdf.addImage(
        sliceCanvas.toDataURL("image/png"),
        "PNG",
        MARGIN,
        currentY,
        CONTENT_W,
        sliceHeightMm
      );

      const reachedEnd = sourceY + sliceHeightPx >= canvas.height - 1;
      sourceY = reachedEnd ? canvas.height : sourceY + sliceHeightPx;
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

    clone.querySelectorAll<HTMLElement>("table").forEach((table) => {
      table.style.width = "100%";
      table.style.tableLayout = "fixed";
    });

    clone.querySelectorAll<HTMLElement>("th, td").forEach((cell) => {
      cell.style.whiteSpace = "normal";
      cell.style.wordBreak = "break-word";
      cell.style.overflowWrap = "anywhere";
    });

    wrapper.appendChild(clone);

    document.body.appendChild(wrapper);
    try {
      const wrapperRect = wrapper.getBoundingClientRect();
      const rowBreaksCssPx = Array.from(
        clone.querySelectorAll<HTMLElement>("tbody tr")
      )
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

    if (
      sectionHeightMm <= CONTENT_H &&
      sectionHeightMm > remainingMm &&
      currentY > MARGIN + 0.5
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

  const blob = pdf.output("blob");
  await uploadAndShowPdf(blob, filename);
  return blob;
}
