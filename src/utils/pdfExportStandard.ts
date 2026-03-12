/**
 * TCMG Site-Wide PDF Export Standard
 * ====================================
 * Single source of truth for all PDF download buttons across the project.
 * Settings are also persisted in the site_config table (key: pdf_export_standard).
 *
 * Usage:
 *   import { PDF_COLORS, PDF_EXPORT_OPTS, PDF_TYPOGRAPHY, pdfHeadingStyle, pdfTableHeaderStyle, pdfCellStyle } from "@/utils/pdfExportStandard";
 */

import type { SectionPdfOptions } from "@/utils/sectionPdfExport";

// ─── Approved Color Palette ──────────────────────────────────────────
export const PDF_COLORS = {
  GOLD: "#C8960C",
  GOLD_LIGHT: "#f5ecd0",
  GOLD_BG: "#fdf8ea",
  DARK: "#1a1a1a",
  WHITE: "#ffffff",
  HEADER_BG: "#C8960C",
  HEADER_TEXT: "#ffffff",
  ALT_ROW_BG: "#fdf8ea",
  SECTION_BORDER: "#C8960C",
} as const;

// ─── Export Engine Settings (passed to exportSectionsToPdf) ──────────
export const PDF_EXPORT_OPTS: SectionPdfOptions = {
  margin: 10,
  renderWidth: 920,
  fontSize: "13px",
  lineHeight: "1.5",
  scale: 1.5,
  addBorder: true,
  gap: 0,
  sliceOverlapPx: 0,
};

// ─── Typography Constants ────────────────────────────────────────────
export const PDF_TYPOGRAPHY = {
  TITLE_SIZE: 20,
  SUBTITLE_SIZE: 11,
  SECTION_HEADING_SIZE: 14,
  BODY_SIZE: 12,
  SMALL_SIZE: 10,
  FONT_FAMILY: "Arial, Helvetica, sans-serif",
} as const;

// ─── Reusable Style Builders ─────────────────────────────────────────

/** Section heading style with gold underline */
export const pdfHeadingStyle = (fontSize?: number): React.CSSProperties => ({
  fontSize: fontSize ?? PDF_TYPOGRAPHY.SECTION_HEADING_SIZE,
  fontWeight: 700,
  margin: "14px 0 6px 0",
  borderBottom: `2px solid ${PDF_COLORS.GOLD}`,
  paddingBottom: 3,
  color: PDF_COLORS.DARK,
});

/** Gold table header row */
export const pdfTableHeaderStyle: React.CSSProperties = {
  background: PDF_COLORS.HEADER_BG,
  color: PDF_COLORS.HEADER_TEXT,
  fontWeight: 700,
  fontSize: PDF_TYPOGRAPHY.BODY_SIZE,
  padding: "8px 14px",
  textAlign: "left" as const,
};

/** Standard cell style */
export const pdfCellStyle = (isAlt?: boolean): React.CSSProperties => ({
  padding: "4px 8px",
  fontSize: PDF_TYPOGRAPHY.BODY_SIZE,
  borderBottom: `1px solid #e5e0d0`,
  background: isAlt ? PDF_COLORS.ALT_ROW_BG : "transparent",
});

/** Document title block style */
export const pdfTitleStyle: React.CSSProperties = {
  fontSize: PDF_TYPOGRAPHY.TITLE_SIZE,
  fontWeight: 800,
  color: PDF_COLORS.DARK,
  letterSpacing: -0.5,
};

/** Document subtitle / metadata style */
export const pdfSubtitleStyle: React.CSSProperties = {
  fontSize: PDF_TYPOGRAPHY.SUBTITLE_SIZE,
  color: "#555",
  fontWeight: 500,
};
