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
  /** Overlap in px between page slices to prevent glyph clipping (default 2) */
  sliceOverlapPx?: number;
  /** Draw a border around the content area on each page (default false) */
  addBorder?: boolean;
  /** Trailing blank page threshold in mm — pages with less content than this are removed (default 15) */
  blankPageThreshold?: number;
  /** CSS selector used to find printable sections inside the container (default "[data-pdf-section]") */
  sectionSelector?: string;
  /** Lower bound (ratio) where row snapping is allowed near page bottom (default 0.7) */
  rowSnapStartRatio?: number;
  /** Max allowable whitespace ratio when snapping to row boundaries (default 0.18) */
  maxWhitespaceRatio?: number;
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
  sectionSelector: "[data-pdf-section]",
  rowSnapStartRatio: 0.7,
  maxWhitespaceRatio: 0.18,
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

  const sections = (() => {
    const selected = Array.from(
      container.querySelectorAll<HTMLElement>(cfg.sectionSelector)
    );
    if (selected.length > 0) return selected;
    return Array.from(container.querySelectorAll<HTMLElement>("[data-pdf-section]"));
  })();

  let currentY = MARGIN;

  // ── Slice a single canvas across pages ──────────────────────────
  const addCanvasAcrossPages = (
    canvas: HTMLCanvasElement,
    rowBreaksPx: number[] = [],
    keepTogetherRegionsPx: Array<{ top: number; bottom: number }> = []
  ) => {
    const pxPerMm = canvas.width / CONTENT_W;
    const safeBreaks = Array.from(new Set(rowBreaksPx))
      .map((v) => Math.round(v))
      .filter((v) => v > 0 && v < canvas.height)
      .sort((a, b) => a - b);
    const safeRegions = keepTogetherRegionsPx
      .map((region) => ({
        top: Math.max(0, Math.round(region.top)),
        bottom: Math.min(canvas.height, Math.round(region.bottom)),
      }))
      .filter((region) => region.bottom - region.top > 6)
      .sort((a, b) => a.top - b.top);

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

      // If this cut would split a keep-together block (e.g. SIGN OFF),
      // force the break to happen BEFORE that block starts.
      const conflictingRegion = safeRegions.find(
        (region) => region.top > sourceY && region.top < maxEnd && region.bottom > maxEnd
      );

      // Avoid creating tiny slices (1–12px) before protected blocks.
      // Those micro-slices are the main cause of visual clipping at page starts.
      const MIN_PRE_BREAK_SLICE_PX = 12;
      const canMoveToFreshPage = currentY > MARGIN + 0.5;
      if (conflictingRegion && conflictingRegion.top - sourceY < MIN_PRE_BREAK_SLICE_PX && canMoveToFreshPage) {
        pdf.addPage();
        currentY = MARGIN;
        continue;
      }

      const forcedBreak =
        conflictingRegion && conflictingRegion.top - sourceY >= MIN_PRE_BREAK_SLICE_PX
          ? conflictingRegion.top
          : -1;

      // Find the closest row break BEFORE the max cut point.
      // Only snap in the lower part of the page, and never inside protected regions.
      let bestBreak = -1;
      const snapZoneStart = sourceY + Math.floor(maxSliceHeightPx * cfg.rowSnapStartRatio);
      const isInsideProtectedRegion = (point: number) =>
        safeRegions.some((region) => point > region.top + 1 && point < region.bottom - 1);

      for (let i = safeBreaks.length - 1; i >= 0; i--) {
        const point = safeBreaks[i];
        if (point <= sourceY + 10) break;
        if (point > maxEnd) continue;
        if (point < snapZoneStart) continue;
        if (isInsideProtectedRegion(point)) continue;
        bestBreak = point;
        break;
      }

      // Ignore overly-early snap points that would create large visible gaps at page bottoms.
      const maxWhitespacePx = Math.floor(maxSliceHeightPx * cfg.maxWhitespaceRatio);
      if (bestBreak > sourceY && maxEnd - bestBreak > maxWhitespacePx) {
        bestBreak = -1;
      }

      // Prioritise keep-together forced break, then row break, then hard cut fallback.
      const sliceEnd = forcedBreak > sourceY ? forcedBreak : bestBreak > sourceY ? bestBreak : maxEnd;
      const usedForcedBreak = forcedBreak > sourceY && sliceEnd === forcedBreak;
      const usedRowBreak = bestBreak > sourceY && sliceEnd === bestBreak;

      const sliceHeightPx = Math.max(
        1,
        Math.min(canvas.height - sourceY, Math.floor(sliceEnd - sourceY))
      );

      // Prevent tiny page-bottom slices that visually cut lines/items.
      const MIN_SLICE_HEIGHT_PX = 24;
      if (sliceHeightPx < MIN_SLICE_HEIGHT_PX && canMoveToFreshPage) {
        pdf.addPage();
        currentY = MARGIN;
        continue;
      }

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
      // When we break at explicit semantic boundaries (forced or row),
      // don't overlap, it causes clipped/duplicated lines at page tops.
      const overlapPx = reachedEnd || usedForcedBreak || usedRowBreak ? 0 : cfg.sliceOverlapPx;
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
    section: HTMLElement,
    remainingMmOnPage: number
  ): Promise<{
    canvas: HTMLCanvasElement;
    rowBreaksPx: number[];
    keepTogetherRegionsPx: Array<{ top: number; bottom: number }>;
  }> => {
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

    const isContinuousFlowContainer = section.hasAttribute("data-pdf-flow-container");
    if (isContinuousFlowContainer) {
      clone.querySelectorAll<HTMLElement>("[data-pdf-section]").forEach((element) => {
        element.removeAttribute("data-pdf-section");
      });
    }

    const hasAdaptiveFitContent =
      section.hasAttribute("data-pdf-adaptive-fit") ||
      section.querySelector("[data-pdf-adaptive-fit]") !== null;
    if (hasAdaptiveFitContent) {
      const remainingRatio = Math.max(0.22, Math.min(1, remainingMmOnPage / CONTENT_H));
      const commentsPaddingPx = Math.round(2 + remainingRatio * 6);
      const commentsMinHeightPx = Math.round(24 + remainingRatio * 34);

      clone.querySelectorAll<HTMLElement>("[data-pdf-comments-wrap]").forEach((element) => {
        element.style.paddingTop = `${commentsPaddingPx}px`;
        element.style.paddingBottom = `${commentsPaddingPx}px`;
      });

      clone.querySelectorAll<HTMLTextAreaElement>("[data-pdf-flex-comments]").forEach((element) => {
        element.style.height = "auto";
        element.style.maxHeight = "none";
        element.style.minHeight = `${commentsMinHeightPx}px`;
      });
    }

    // Sync live input/textarea values into the clone so html2canvas can see them
    const origInputs = section.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    const clonedInputs = clone.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    origInputs.forEach((orig, idx) => {
      const target = clonedInputs[idx];
      if (!target) return;

      const val = orig.value ?? "";
      const shouldRenderAsText = orig.hasAttribute("data-pdf-text-value");

      // Resource-like fields opt-in to text rendering so long values wrap in PDFs.
      // Keep all other controls as native elements to preserve measured layout flow.
      if (shouldRenderAsText) {
        const computed = window.getComputedStyle(orig);
        const textSpan = document.createElement("span");
        textSpan.textContent = val;
        textSpan.style.display = "inline-block";
        textSpan.style.width = "100%";
        textSpan.style.fontFamily = computed.fontFamily;
        textSpan.style.fontSize = computed.fontSize;
        textSpan.style.fontWeight = computed.fontWeight;
        textSpan.style.lineHeight = computed.lineHeight;
        textSpan.style.color = computed.color;
        textSpan.style.whiteSpace = "pre-wrap";
        textSpan.style.wordBreak = "break-word";
        textSpan.style.overflowWrap = "anywhere";
        target.replaceWith(textSpan);
        return;
      }

      // Preserve non-text inputs as-is and sync key state
      target.setAttribute("value", val);
      target.value = val;
      if (target.tagName === "TEXTAREA") {
        target.textContent = val;
      }
      if (
        orig instanceof HTMLInputElement &&
        target instanceof HTMLInputElement &&
        ["checkbox", "radio"].includes((orig.type || "").toLowerCase())
      ) {
        target.checked = orig.checked;
      }
    });

    clone.querySelectorAll<HTMLElement>("table").forEach((table) => {
      table.style.width = "100%";
      table.style.tableLayout = "fixed";
    });

    clone.querySelectorAll<HTMLElement>("th, td").forEach((cell) => {
      cell.style.whiteSpace = "normal";
      cell.style.wordBreak = "break-word";
      cell.style.overflowWrap = "anywhere";
    });

    // Force natural print flow in the export clone: no clipping, no viewport-sized wrappers,
    // and no explicit break-before/after rules that can inject blank pages.
    clone
      .querySelectorAll<HTMLElement>(
        "[class*='overflow-hidden'], [style*='overflow:hidden'], [style*='overflow: hidden']"
      )
      .forEach((element) => {
        element.style.overflow = "visible";
      });

    clone
      .querySelectorAll<HTMLElement>(
        "[class*='h-screen'], [class*='min-h-screen'], [class*='max-h-screen']"
      )
      .forEach((element) => {
        element.style.height = "auto";
        element.style.minHeight = "0";
        element.style.maxHeight = "none";
      });

    clone
      .querySelectorAll<HTMLElement>(
        "[class*='break-before'], [class*='break-after'], [style*='break-before'], [style*='break-after'], [style*='page-break-before'], [style*='page-break-after']"
      )
      .forEach((element) => {
        element.style.breakBefore = "auto";
        element.style.breakAfter = "auto";
        element.style.pageBreakBefore = "auto";
        element.style.pageBreakAfter = "auto";
      });

    clone
      .querySelectorAll<HTMLElement>(
        "[class*='break-inside'], [style*='break-inside'], [style*='page-break-inside']"
      )
      .forEach((element) => {
        if (element.hasAttribute("data-pdf-keep-together")) return;
        element.style.breakInside = "auto";
        element.style.pageBreakInside = "auto";
      });

    // Remove UI-only elements
    clone.querySelectorAll<HTMLElement>(".print-hide").forEach((el) => el.remove());

    wrapper.appendChild(clone);

    document.body.appendChild(wrapper);
    try {
      const wrapperRect = wrapper.getBoundingClientRect();

      // Collect row/line boundaries from tables, lists, and explicit section dividers
      const breakElements = clone.querySelectorAll<HTMLElement>(
        "tr, li, [data-pdf-break]"
      );
      const rowBreaksCssPx = Array.from(breakElements)
        .map((row) => row.getBoundingClientRect().bottom - wrapperRect.top)
        .filter((value) => Number.isFinite(value) && value > 0);

      const keepTogetherRegionsCssPx = Array.from(
        clone.querySelectorAll<HTMLElement>("[data-pdf-keep-together]")
      )
        .map((region) => {
          const rect = region.getBoundingClientRect();
          return {
            top: rect.top - wrapperRect.top,
            bottom: rect.bottom - wrapperRect.top,
          };
        })
        .filter(
          (region) =>
            Number.isFinite(region.top) &&
            Number.isFinite(region.bottom) &&
            region.bottom - region.top > 6
        );

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
        keepTogetherRegionsPx: keepTogetherRegionsCssPx.map((region) => ({
          top: Math.round(region.top * cfg.scale),
          bottom: Math.round(region.bottom * cfg.scale),
        })),
      };
    } finally {
      document.body.removeChild(wrapper);
    }
  };

  // ── Main loop ───────────────────────────────────────────────────
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const remainingMm = A4_H - MARGIN - currentY;
    const { canvas, rowBreaksPx, keepTogetherRegionsPx } = await renderSectionCanvas(
      section,
      remainingMm
    );

    const sectionHeightMm = canvas.height / (canvas.width / CONTENT_W);
    const hasAdaptiveFitContent =
      section.hasAttribute("data-pdf-adaptive-fit") ||
      section.querySelector("[data-pdf-adaptive-fit]") !== null;

    // If a section fits on a single page but not in remaining space,
    // start it on a fresh page to preserve clean section flow.
    // Adaptive-fit sections (Comments/Sign Off blocks) are allowed to use
    // remaining space first, then naturally continue to the next page if needed.
    if (!hasAdaptiveFitContent && sectionHeightMm <= CONTENT_H && sectionHeightMm > remainingMm) {
      pdf.addPage();
      currentY = MARGIN;
    }

    addCanvasAcrossPages(canvas, rowBreaksPx, keepTogetherRegionsPx);

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
