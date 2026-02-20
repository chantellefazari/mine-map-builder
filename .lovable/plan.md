
# Move Stores Tree Into Store Visualisation Tab

## What Changes

The separate "Stores Tree" tab will be removed from the tab bar. Instead, the Stores Tree (interactive container navigator with search, tree, and detail panel) will be embedded directly below the visualisation area inside the "Store Visualisation" tab. This means when you're looking at either the 2D plan or 3D view, you'll see the full Stores Tree navigator underneath it -- giving you both the visual layout and the detailed tree drill-down in one view.

The default tab will change to "visualisation" (since "tree" no longer exists as a tab).

## Layout (Visualisation Tab)

1. Warning banner
2. Header with 2D/3D toggle + Live Inventory switch
3. 2D or 3D visualisation
4. **Stores Tree section** (search bar, collapsible tree + detail panel) -- sits directly below the visualisation

## Technical Details

### Modified Files

**1. `src/components/stores-warehouse/StoreVisualisation.tsx`**
- Import and render `StoresAssetTree` component below the visualisation area
- Add a visual separator/heading between the map and the tree

**2. `src/pages/StoresWarehouseDesign.tsx`**
- Remove the "Stores Tree" `TabsTrigger` and its `TabsContent`
- Change `defaultValue` from `"tree"` to `"visualisation"`
- Remove the `StoresAssetTree` import (no longer needed at page level)
