
# Export Asset Tree to CSV

## Overview
Add an "Export CSV" button to the Asset Hierarchy tab on the Asset Tree page. One click will generate and download a CSV file containing the full hierarchy -- every equipment item and component flattened into rows with columns for each level.

## What Gets Exported
Each row will represent an equipment item or component, with columns:
- **Site** (TCMG)
- **Facility** (Processing Plant / Crushing Plant / Mining)
- **Area Code** (SITE, UTL, COM, REC, TAIL, SUP)
- **Area Name**
- **Sub-Area**
- **Parent Asset (System)**
- **Asset Number**
- **Equipment Name**
- **Component Code** (if Level 7)
- **Component Type** (if Level 7)
- **Component Name** (if Level 7)
- **Manufacturer** (if Level 7)
- **Legacy P&ID Tags** (comma-separated from both inline and pidTagMappings.ts)

This gives the mine site a complete flat register they can open in Excel.

## Button Placement
An "Export CSV" button (with download icon) will be placed in the Asset Structure header bar, next to the search field -- matching the style of the existing "Export CSV" button on the Functional Locations tab.

## Technical Approach

### Files Modified
1. **`src/pages/AssetTree.tsx`** -- Add the export button in the hierarchy tab content area, in the header row next to the search bar.

2. **`src/components/hierarchy/AssetTree.tsx`** (or a new utility) -- Add a `exportAssetTreeCSV()` function that:
   - Iterates through `areasData` (already imported)
   - Merges P&ID tags from `pidTagMappings.ts`
   - Flattens each equipment and component into a row
   - Generates CSV string with proper escaping (commas, quotes)
   - Triggers browser download as `TCMG_Asset_Tree_Register.csv`

### Export Logic
```typescript
function exportAssetTreeCSV() {
  const headers = ["Site","Facility","Area Code","Area","Sub-Area",
    "Parent Asset","Asset Number","Equipment Name",
    "Component Code","Component Type","Component Name",
    "Manufacturer","P&ID Tags"];
  const rows: string[][] = [];
  
  areasData.forEach(area => {
    area.subAreas.forEach(subArea => {
      subArea.parentAssets.forEach(parent => {
        parent.equipment.forEach(equip => {
          const pidTags = getAllPidTags(equip.assetNumber, equip.pidTags);
          rows.push(["TCMG","Processing Plant", area.code, area.label,
            subArea.label, parent.label, equip.assetNumber, equip.name,
            "","","","", pidTags.join("; ")]);
          // Component rows
          equip.components?.forEach(comp => {
            rows.push(["TCMG","Processing Plant", area.code, area.label,
              subArea.label, parent.label, equip.assetNumber, equip.name,
              comp.componentCode, comp.componentType, comp.componentName,
              comp.manufacturer, ""]);
          });
        });
      });
    });
  });
  // Download as CSV
}
```

No database or backend needed -- all data is already in `assetData.ts` and `pidTagMappings.ts`.
