
# Stores & Warehouse Design -- Excel Workbook Export

## What You Get
A "Download Workbook" button added to the Stores & Warehouse Design page header. Clicking it generates a multi-sheet Excel file (`TCMG_Stores_Warehouse_Design.xlsx`) that captures all the logic, rules, and data from 6 of the 7 tabs (excluding Store Visualisation as requested). You can email this directly to your GM.

## Workbook Structure (6 Sheets)

| Sheet | Source Tab | Content |
|-------|-----------|---------|
| 1. Design Principles | Stores Design Principles | All 6 governing rules with title + description |
| 2. Container Stocking Scope | Container Stocking Scope | C01-C05 categories, eligible items per container, exclusions list for LD |
| 3. Location Coding | Store Location Coding | Code format, container-discipline map, bay layout, container examples, external (LD) examples, validation rules |
| 4. Design Inputs | Design Inputs for 3D | Container requirements table (zone, type, contents, environment, access, growth), safety constraints |
| 5. Capacity Analysis | Capacity Scan | Per-zone SKU counts, bin positions, items/bin ratio, status, furniture breakdown, concerns |
| 6. Stock Control Procedure | Stock Control Procedure | All 9 sections: purpose, receiving steps, stock-out fields, LD rules, min/max, weekly/monthly controls, accountability rules, integration links |

## Technical Approach

1. **New utility file**: `src/utils/exportStoresWorkbook.ts`
   - Uses the existing `xlsx` library (already installed) following the same pattern as `exportAssetTreeWorkbook.ts`
   - Pulls all data directly from the component data sources (the same arrays/objects rendered in the UI)
   - Each sheet gets formatted column headers and structured rows
   - Column widths auto-sized for readability

2. **Button placement**: Added to the `StoresWarehouseDesign.tsx` page header (next to the title), styled as an outline button with a Download icon -- consistent with other export buttons in the project

3. **No new dependencies required** -- `xlsx` is already installed
