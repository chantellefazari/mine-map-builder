import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 12;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const PAGE_CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
const SECTION_GAP_MM = 4;
const MAX_PAGES = 20;
const RENDER_SCALES = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6] as const;

type PdfResult = {
  blob: Blob;
  pageCount: number;
};

const getTopLevelSections = (root: HTMLElement) => {
  return Array.from(root.querySelectorAll("[data-pdf-section]")) as HTMLElement[];
};

const getChildBlocks = (node: HTMLElement) => {
  return Array.from(node.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement
  );
};

const renderNodeCanvas = async (node: HTMLElement) => {
  return html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 794,
  });
};

const buildPdfForScale = async (sections: HTMLElement[], renderScale: number) => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let currentY = MARGIN_MM;
  const blocksQueue = [...sections];

  while (blocksQueue.length > 0) {
    const block = blocksQueue.shift();
    if (!block) continue;

    const canvas = await renderNodeCanvas(block);

    const baseScaleFactor = CONTENT_WIDTH_MM / (canvas.width / 2);
    const baseHeightMM = (canvas.height / 2) * baseScaleFactor;
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
      const pxPerMMAtBase = (canvas.width / 2) / CONTENT_WIDTH_MM;
      let srcYPx = 0;

      while (srcYPx < totalHeightPx) {
        const availableHeightMM = A4_HEIGHT_MM - MARGIN_MM - currentY;
        if (availableHeightMM < 12) {
          pdf.addPage();
          currentY = MARGIN_MM;
          continue;
        }

        const sliceHeightPx = Math.min(
          (availableHeightMM * pxPerMMAtBase * 2) / renderScale,
          totalHeightPx - srcYPx
        );

        const sliceBaseHeightMM = (sliceHeightPx / 2) * baseScaleFactor;
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

        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
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

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    pdf.addImage(imgData, "JPEG", drawXMM, currentY, drawWidthMM, drawHeightMM);
    currentY += drawHeightMM + SECTION_GAP_MM * renderScale;
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

  let bestPdf: jsPDF | null = null;
  let bestPageCount = Number.POSITIVE_INFINITY;

  for (const renderScale of RENDER_SCALES) {
    const { pdf, pageCount } = await buildPdfForScale(sections, renderScale);
    bestPdf = pdf;
    bestPageCount = pageCount;

    if (pageCount <= MAX_PAGES) {
      break;
    }
  }

  if (!bestPdf) {
    throw new Error("Failed to generate PDF.");
  }

  return {
    blob: bestPdf.output("blob"),
    pageCount: bestPageCount,
  };
}
