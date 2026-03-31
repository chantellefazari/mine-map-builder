

## Plan: TCMG Site Deliverable Workbook (.xlsx Download)

### What
Create a comprehensive multi-tab Excel workbook that consolidates all site data into a single deliverable document for TCMG handover. This will be an in-browser download button (similar to the existing Asset Tree Workbook export) producing a professional `.xlsx` file.

### Workbook Tabs (8 Sheets)

**Sheet 1 — Asset Register**
Full asset tree from `processing_plant_assets_rev_b` + Crushing Plant file data. Columns: Site, Facility, Area Code, Area, Sub-Area, Parent Asset, Asset Number, Equipment Name, Component Code, Component Type, Component Name, Manufacturer, P&ID Tags, Functional Location.

**Sheet 2 — Asset Criticality**
From `asset_criticality_ratings` table. Columns: Asset Number, Asset Name, Area, Sub-Area, Criticality Rating, Justification, Assessed By, Assessed Date.

**Sheet 3 — Critical Spares Register**
From `site_spares` (where `is_critical = true`). Columns: Stock Code, Description, Category, Manufacturer, OEM Part No, Qty On Hand, Min Qty, Reorder Point, Unit Cost, UOM, Lead Time Days, Preferred Supplier, Condition, Warehouse Area, Bin Location, Specifications, Notes. No photos.

**Sheet 4 — Complete Spares Catalogue**
All 2,184 parts from `site_spares` (same columns as Sheet 3 but all parts, not just critical).

**Sheet 5 — PM Template Register**
From `pm_master_list`. Columns: PM Name, Discipline, Equipment Type, Frequency, Duty Type, Skill Level, Estimated Duration, Resources, Purpose, Asset Number, Status.

**Sheet 6 — Naming Conventions**
From existing `namingConventionData.ts` — Area Codes, Equipment Prefixes, Component Suffixes, Instrumentation Suffixes, Special Patterns (same as current workbook Sheet 3).

**Sheet 7 — Functional Locations**
From `functionalLocations.ts` — FL Code, Area, Sub-Area, System Name.

**Sheet 8 — Lifecycle & Condition (Placeholder)**
Empty template with headers only to highlight missing data: Asset Number, Asset Name, Install Date, Expected Life (yrs), Condition Score (1-5), Last Inspection Date, Failure Mode, Run Hours, Meter Reading Date, Notes. This shows TCMG the gaps.

### Where to Place It
Add a **"Download Deliverable Workbook"** button on the existing **Data Centre — Workbook** tab in Site Spares Catalogue, below the existing CSV download card. Alternatively, a standalone export utility — but keeping it on the Data Centre tab is cleaner since it already serves as the export hub.

### Document Register (Cover Sheet idea)
Add a **Sheet 0 — Document Register** as the first tab listing all deliverable documents produced:
- Asset Register & Hierarchy
- Asset Criticality Assessment
- Critical Spares Register
- Site Spares Catalogue (Complete)
- PM Template Library (97 templates)
- Naming Convention Standard (TCMG-STD-NAM-001)
- Functional Location Register
- Lifecycle & Condition Data (Pending)
- Stock Code Standard (TCMG-STD-SPN-001)
- Asset Hierarchy Standard (TCMG-STD-AH-001)

Each row: Document Title, Reference No, Status (Complete/Pending/Partial), Description, Platform Access (Y/N).

### Technical Details

**File**: Create `src/utils/exportDeliverableWorkbook.ts`
- Uses the same `loadXLSX` / `writeXlsxFile` pattern from `safariDownload.ts`
- Fetches from 4 database tables with pagination: `processing_plant_assets_rev_b`, `asset_criticality_ratings`, `site_spares`, `pm_master_list`
- Crushing Plant + Naming + FL data from existing file-based sources
- Output: `TCMG_Site_Deliverable_Workbook_{date}.xlsx`

**UI**: Add a second card in `DataCentreWorkbook.tsx` with a "Download Deliverable Workbook" button, spinner, and sheet count summary.

