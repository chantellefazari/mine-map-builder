/**
 * Shared utility to stamp Minesite.AI logo on every page of a jsPDF document.
 */
import { jsPDF } from "jspdf";
import minesiteLogoUrl from "@/assets/Minesite_ai_logo_full.png";

export async function loadPdfLogo(): Promise<HTMLImageElement | undefined> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = minesiteLogoUrl;
    });
    return img;
  } catch {
    return undefined;
  }
}

/**
 * Stamp the Minesite.AI logo on the bottom-right of every page.
 * Call AFTER all content has been added to the PDF.
 */
export function stampLogoOnAllPages(pdf: jsPDF, logoImg: HTMLImageElement | undefined, margin = 10) {
  if (!logoImg || !logoImg.naturalWidth) return;
  const LOGO_H_MM = 8;
  const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
  const LOGO_W_MM = LOGO_H_MM * aspect;
  const totalPages = pdf.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    const logoX = w - margin - LOGO_W_MM;
    const logoY = h - margin - LOGO_H_MM;
    pdf.addImage(logoImg, "PNG", logoX, logoY, LOGO_W_MM, LOGO_H_MM);
  }
}
