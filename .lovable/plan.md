

## Plan: Combine Workbooks + Add Professional Cover Sheet

### What
Merge the Asset Tree Workbook and Deliverable Workbook into a single unified workbook, and add a professional intro/cover sheet as the first tab — styled like the "Mine Site Onboarding Workbook" screenshot (step-by-step guide, compatibility notes, important notes section).

### Changes

**1. Update `exportDeliverableWorkbook.ts`**

Replace the current "Document Register" (Sheet 0) with a professional **"Introduction"** cover sheet containing:
- Title: "TCMG Site Deliverable Workbook"
- Subtitle: "Complete this workbook accompanies all equipment data onboarded to the MineSite.AI Platform"
- **STEP-BY-STEP GUIDE** section listing all 11 data sheets with descriptions (similar to the screenshot's Step 1–11 format)
- **D365/EAM COMPATIBILITY** section: ISO 14224, Criticality Classes, Maintenance Strategy, Financial Integration
- **IMPORTANT NOTES** section: Date Format, Asset Reference, Required Fields notes
- **DATA SOURCES** section: listing where each sheet's data originates

This replaces both the old Document Register tab and eliminates the need for the separate Asset Tree Workbook since all its content (Asset Register, FLs, Naming Conventions) is already in the Deliverable Workbook.

**2. Remove the separate Asset Tree Workbook export from `AssetTree.tsx`**

Update the Asset Tree page's workbook download button to call `exportDeliverableWorkbook()` instead of `exportAssetTreeWorkbook()`, so there's only one workbook to maintain. The button label can change to "Download Site Workbook".

**3. Update `DataCentreWorkbook.tsx`**

Update the sheet list to show "Introduction" instead of "Document Register" as the first tag.

### Files Changed
1. `src/utils/exportDeliverableWorkbook.ts` — Replace Document Register sheet with professional Introduction cover sheet
2. `src/pages/AssetTree.tsx` — Point workbook button to the unified deliverable export
3. `src/components/site-spares/DataCentreWorkbook.tsx` — Update sheet tag label

### Cover Sheet Content Structure
```text
Row 1:  TCMG Site Deliverable Workbook  (merged, bold, large)
Row 2:  Complete asset data package for the MineSite.AI Platform
Row 3:  (blank)
Row 4:  STEP-BY-STEP GUIDE
Row 5:  (blank)
Row 6:  Sheet 1: Asset Register       | Full asset tree with components...
Row 7:  Sheet 2: Asset Criticality     | ABC criticality ratings...
Row 8:  Sheet 3: Critical Spares       | Filtered critical spare parts...
...     (one row per sheet)
Row 16: Sheet 11: Asset Hierarchy Rules | Parent-child rules...
Row 17: (blank)
Row 18: D365/EAM COMPATIBILITY
Row 19: ISO 14224 | Asset hierarchy follows ISO 14224...
...
Row 23: (blank)
Row 24: IMPORTANT NOTES
Row 25: Date Format | Use YYYY-MM-DD...
...
```

