import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 12;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const PAGE_CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
const SECTION_GAP_MM = 4;
const MAX_PAGES = 20;

// Fewer passes + wider steps to reduce generation time dramatically
const RENDER_SCALES = [1, 0.92, 0.84, 0.76, 0.68] as const;
const CANVAS_SCALE = 1.4;

type PdfResult = {
  blob: Blob;
  pageCount: number;
};

type CanvasCache = WeakMap<HTMLElement, Promise<HTMLCanvasElement>>;

const getTopLevelSections = (root: HTMLElement) => {
  return Array.from(root.querySelectorAll("[data-pdf-section]")) as HTMLElement[];
};

const getChildBlocks = (node: HTMLElement) => {
  return Array.from(node.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement
  );
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

const buildPdfForScale = async (
  sections: HTMLElement[],
  renderScale: number,
  canvasCache: CanvasCache
) => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = MARGIN_MM;
  const blocksQueue = [...sections];
  let processedBlocks = 0;

  while (blocksQueue.length > 0) {
    const block = blocksQueue.shift();
    if (!block) continue;

    processedBlocks += 1;
    if (processedBlocks > 3000) {
      throw new Error("PDF generation exceeded safe block limit.");
    }

    const canvas = await getCachedCanvas(block, canvasCache);

    const logicalWidthPx = canvas.width / CANVAS_SCALE;
    const logicalHeightPx = canvas.height / CANVAS_SCALE;

    const baseScaleFactor = CONTENT_WIDTH_MM / logicalWidthPx;
    const baseHeightMM = logicalHeightPx * baseScaleFactor;

    const drawWidthMM = CONTENT_WIDTH_MM * renderScale;
    const drawHeightMM = baseHeightMM * renderScale;
    const drawXMM = MARGIN_MM + (CONTENT_WIDTH_MM - drawWidthMM) / 2;

    if (drawHeightMM > PAGE_CONTENT_HEIGHT_MM) {
      const childBlocks = getChildBlocks(block);

      if (childBlocks.length > 1) {
        blocksQueue.unshift(...childBlocks);
        continue;
      }

      const totalHeightPx = canvas.height;
      const pxPerMMAtBase = logicalWidthPx / CONTENT_WIDTH_MM;
      let srcYPx = 0;

      while (srcYPx < totalHeightPx) {
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

        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.9);
        pdf.addImage(sliceData, "JPEG", drawXMM, currentY, drawWidthMM, sliceDrawHeightMM);

        srcYPx += sliceHeightPx;
        if (srcYPx < totalHeightPx) {
          pdf.addPage();
          currentY = MARGIN_MM;
        } else {
          currentY += sliceDrawHeightMM + SECTION_GAP_MM * renderScale;
        }
      }

      continue;
    }

    const remainingSpaceMM = A4_HEIGHT_MM - MARGIN_MM - currentY;
    if (drawHeightMM > remainingSpaceMM && currentY > MARGIN_MM) {
      pdf.addPage();
      currentY = MARGIN_MM;
    }

    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    pdf.addImage(imgData, "JPEG", drawXMM, currentY, drawWidthMM, drawHeightMM);
    currentY += drawHeightMM + SECTION_GAP_MM * renderScale;

    if (processedBlocks % 2 === 0) {
      await yieldThread();
    }
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

  const canvasCache: CanvasCache = new WeakMap();
  let bestPdf: jsPDF | null = null;
  let bestPageCount = Number.POSITIVE_INFINITY;

  for (const renderScale of RENDER_SCALES) {
    const { pdf, pageCount } = await buildPdfForScale(sections, renderScale, canvasCache);
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
