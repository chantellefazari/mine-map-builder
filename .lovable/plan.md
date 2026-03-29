

## Plan: Add "Data Centre — Workbook" Tab with CSV Download

### What
Add a third tab to the Site Spares Catalogue page called **"Data Centre — Workbook"** that provides a CSV download button for all 2184 parts (all data fields, no photos).

### Structure

**1. Update `src/pages/SiteSparesCatalogue.tsx`**
- Add a third tab trigger: "Data Centre — Workbook" with a `Database` icon
- Add matching `TabsContent` rendering a new `DataCentreWorkbook` component

**2. Create `src/components/site-spares/DataCentreWorkbook.tsx`**
- Info banner explaining this is the complete parts data export for deliverable submission
- Summary card showing total part count (fetched from `site_spares` table)
- **"Download Complete CSV"** button that:
  - Fetches ALL rows from `site_spares` (paginated to handle >1000 rows)
  - Excludes `image_urls` and `id` columns
  - Exports all remaining fields: `part_number`, `description`, `category`, `subcategory`, `manufacturer`, `oem_part_number`, `alternate_part_number`, `preferred_supplier`, `warehouse_area`, `aisle`, `rack`, `bin_location`, `storage_type`, `qty_on_hand`, `min_qty`, `max_qty`, `reorder_point`, `unit_cost`, `uom`, `lead_time_days`, `last_purchase_date`, `condition`, `status`, `is_critical`, `critical_spare_id`, `asset_tag`, `specifications`, `notes`
  - Generates CSV in-browser and triggers download as `TCMG_Site_Spares_Complete_{date}.csv`
  - Shows loading spinner during fetch, toast on success/error

### Technical Details
- CSV generation uses native browser APIs (no library needed) — build CSV string with proper escaping for commas/quotes
- Pagination loop (same pattern as `generate-spares-pdf`) to fetch >1000 rows
- File named with date stamp for version tracking
- Matches existing minesite.io styling (card layout, primary accent, compact design)

