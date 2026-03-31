

## Plan: Add Stock Code Standard & Asset Hierarchy Sheets to Deliverable Workbook

### What
Add two new sheets to the existing TCMG Site Deliverable Workbook (`exportDeliverableWorkbook.ts`), bringing the total from 9 to 11 sheets.

### New Sheets

**Sheet 9 — Stock Code Standard**
Contains the full category table from `SitePartNumberingSection.tsx`:
- Columns: Category Code, Category Name, Examples, Storage Container
- 25 rows (codes 01–25)
- A header section with the format rules (SSCCNNN structure, 7-digit numeric, site code 10)
- The allocation workflow steps

**Sheet 10 — Asset Hierarchy & Parent-Child Rules**
Contains the structured data from `HierarchyRulesSection.tsx`:
- Hierarchy Levels table: Level, Name, Example, Description, Has FL
- Parent-Child Rules list (6 rules)
- Constraints / "Do NOT" rules (6 items)
- Equipment abbreviations table: Code, Meaning
- Asset numbering examples: Number, Description

### Files Changed

1. **`src/utils/exportDeliverableWorkbook.ts`** — Add two new sheet-building sections after the Lifecycle sheet. Import the data arrays from `HierarchyRulesSection.tsx` (will extract the data constants or duplicate them inline since they're small).

2. **`src/components/site-spares/DataCentreWorkbook.tsx`** — Update sheet count from 9 to 11 and add "Stock Code Standard" and "Asset Hierarchy Rules" to the sheet tag list.

3. **Update the Document Register** (Sheet 0) to include rows for the two new documents.

### Technical Notes
- The stock code category data lives in `SitePartNumberingSection.tsx` as a local `categoryData` array — will extract inline since it's static.
- The hierarchy data lives in `HierarchyRulesSection.tsx` as local constants — same approach.
- No database changes needed; all data is file-based.

