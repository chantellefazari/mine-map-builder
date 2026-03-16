import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 12;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const PAGE_CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
const SECTION_GAP_MM = 4;
const MAX_PAGES = 20;

const MIN_RENDER_SCALE = 0.72;
const MAX_RENDER_SCALE = 0.96;
const CANVAS_SCALE = 1;
const JPEG_QUALITY = 0.82;

type PdfResult = {
  blob: Blob;
  pageCount: number;
};

type CanvasCache = WeakMap<HTMLElement, Promise<HTMLCanvasElement>>;
type ImageCache = WeakMap<HTMLCanvasElement, string>;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getTopLevelSections = (root: HTMLElement) => {
  return Array.from(root.querySelectorAll("[data-pdf-section]")) as HTMLElement[];
};

const yieldThread = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const getCachedCanvas = (node: HTMLElement, cache: CanvasCache) => {
  const existing = cache.get(node);
  if (existing) return existing;

  const canvasPromise = html2canvas(node, {
    scale: CANVAS_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 794,
  });

  cache.set(node, canvasPromise);
  return canvasPromise;
};

const getCachedImageData = (canvas: HTMLCanvasElement, cache: ImageCache) => {
  const cached = cache.get(canvas);
  if (cached) return cached;

  const imgData = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  cache.set(canvas, imgData);
  return imgData;
};

const estimateInitialScale = (root: HTMLElement, sections: HTMLElement[]) => {
  const rootWidthPx = root.getBoundingClientRect().width || 794;
  const totalHeightPx = sections.reduce((sum, section) => sum + section.getBoundingClientRect().height, 0);

  if (rootWidthPx <= 0 || totalHeightPx <= 0) {
    return MAX_RENDER_SCALE;
  }

  const pxPerMMAtBase = rootWidthPx / CONTENT_WIDTH_MM;
  const totalHeightMM = totalHeightPx / pxPerMMAtBase;
  const estimatedPages = Math.max(1, Math.ceil(totalHeightMM / PAGE_CONTENT_HEIGHT_MM));

  if (estimatedPages <= MAX_PAGES) {
    return MAX_RENDER_SCALE;
  }

  return clamp(MAX_PAGES / estimatedPages, MIN_RENDER_SCALE, MAX_RENDER_SCALE);
};

const buildPdfForScale = async (
  sections: HTMLElement[],
  renderScale: number,
  canvasCache: CanvasCache,
  imageCache: ImageCache
) => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = MARGIN_MM;

  for (let index = 0; index < sections.length; index += 1) {
    const block = sections[index];
    const canvas = await getCachedCanvas(block, canvasCache);

    const logicalWidthPx = canvas.width / CANVAS_SCALE;
    const logicalHeightPx = canvas.height / CANVAS_SCALE;

    const baseScaleFactor = CONTENT_WIDTH_MM / logicalWidthPx;
    const baseHeightMM = logicalHeightPx * baseScaleFactor;

    const drawWidthMM = CONTENT_WIDTH_MM * renderScale;
    const drawHeightMM = baseHeightMM * renderScale;
    const drawXMM = MARGIN_MM + (CONTENT_WIDTH_MM - drawWidthMM) / 2;

    if (drawHeightMM > PAGE_CONTENT_HEIGHT_MM) {
      const totalHeightPx = canvas.height;
      const pxPerMMAtBase = logicalWidthPx / CONTENT_WIDTH_MM;
      let srcYPx = 0;
      let sliceCounter = 0;

      while (srcYPx < totalHeightPx) {
        sliceCounter += 1;
        if (sliceCounter > 1200) {
          throw new Error("PDF generation exceeded safe slice limit.");
        }

        const availableHeightMM = A4_HEIGHT_MM - MARGIN_MM - currentY;
        if (availableHeightMM < 12) {
          pdf.addPage();
          currentY = MARGIN_MM;
          continue;
        }

        const sliceHeightPx = Math.min(
          (availableHeightMM * pxPerMMAtBase * CANVAS_SCALE) / renderScale,
          totalHeightPx - srcYPx
        );

        if (sliceHeightPx <= 0) {
          pdf.addPage();
          currentY = MARGIN_MM;
          continue;
        }

        const sliceBaseHeightMM = (sliceHeightPx / CANVAS_SCALE) * baseScaleFactor;
        const sliceDrawHeightMM = sliceBaseHeightMM * renderScale;

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.ceil(sliceHeightPx);

        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            srcYPx,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx
          );
        }

        const sliceData = sliceCanvas.toDataURL("image/jpeg", JPEG_QUALITY);
        pdf.addImage(sliceData, "JPEG", drawXMM, currentY, drawWidthMM, sliceDrawHeightMM);

        srcYPx += sliceHeightPx;
        if (srcYPx < totalHeightPx) {
          pdf.addPage();
          currentY = MARGIN_MM;
        } else {
          currentY += sliceDrawHeightMM + SECTION_GAP_MM * renderScale;
        }

        if (sliceCounter % 5 === 0) {
          await yieldThread();
        }
      }

      continue;
    }

    const remainingSpaceMM = A4_HEIGHT_MM - MARGIN_MM - currentY;
    if (drawHeightMM > remainingSpaceMM && currentY > MARGIN_MM) {
      pdf.addPage();
      currentY = MARGIN_MM;
    }

    const imgData = getCachedImageData(canvas, imageCache);
    pdf.addImage(imgData, "JPEG", drawXMM, currentY, drawWidthMM, drawHeightMM);
    currentY += drawHeightMM + SECTION_GAP_MM * renderScale;

    await yieldThread();
  }

  return {
    pdf,
    pageCount: pdf.getNumberOfPages(),
  };
};

export async function generateStoresPdfBlob(root: HTMLElement): Promise<PdfResult> {
  const sections = getTopLevelSections(root);

  if (sections.length === 0) {
    throw new Error("No printable sections found.");
  }

  const estimatedScale = estimateInitialScale(root, sections);
  const fallbackScale = clamp(estimatedScale - 0.08, MIN_RENDER_SCALE, MAX_RENDER_SCALE);
  const scales = Array.from(new Set([estimatedScale, fallbackScale]));

  const canvasCache: CanvasCache = new WeakMap();
  const imageCache: ImageCache = new WeakMap();
  let bestPdf: jsPDF | null = null;
  let bestPageCount = Number.POSITIVE_INFINITY;

  for (const renderScale of scales) {
    const { pdf, pageCount } = await buildPdfForScale(sections, renderScale, canvasCache, imageCache);
    bestPdf = pdf;
    bestPageCount = pageCount;

    if (pageCount <= MAX_PAGES) {
      break;
    }

    await yieldThread();
  }

  if (!bestPdf) {
    throw new Error("Failed to generate PDF.");
  }

  return {
    blob: bestPdf.output("blob"),
    pageCount: bestPageCount,
  };
}
