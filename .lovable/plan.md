

## Problem

The "Hierarchy Workbook" and "Download Workbook" buttons on the Asset Tree page fail silently. The console shows `"Importing a module script failed"` — this is the `xlsx` library (SheetJS) failing to load at runtime, likely due to a chunking/dynamic import issue in the production build.

## Root Cause

The `xlsx` package (v0.18.5) is a large CommonJS library that can fail in certain Vite bundling scenarios, particularly in preview/sandbox environments. The `import * as XLSX from "xlsx"` pattern pulls the entire library into the initial bundle or a chunk that fails to resolve.

## Plan

### 1. Add error resilience with dynamic import of xlsx

Modify `exportHierarchyWorkbook.ts` and `exportAssetTreeWorkbook.ts` to use **dynamic `import()`** for the `xlsx` module instead of top-level static imports. This ensures:
- The library loads on-demand only when the user clicks the button
- If the chunk fails, the error is caught gracefully with a toast message
- The main bundle size is reduced

### 2. Update safariDownload.ts

Make `writeXlsxFile` accept the XLSX module as a parameter (or dynamically import it internally) so it doesn't also fail from the same static import issue.

### 3. Files to modify

- **`src/utils/safariDownload.ts`** — Change `writeXlsxFile` to accept a pre-imported XLSX instance or dynamically import xlsx internally
- **`src/utils/exportHierarchyWorkbook.ts`** — Switch to `const XLSX = await import("xlsx")` inside the function body
- **`src/utils/exportAssetTreeWorkbook.ts`** — Same dynamic import pattern
- **`src/utils/exportStoresWorkbook.ts`** — Same fix for consistency
- **`src/utils/exportPMWorkbook.ts`** — Same fix for consistency

This is a minimal, targeted fix that addresses the module loading failure without changing any business logic.

