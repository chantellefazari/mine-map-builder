

## 3D Concepts — New Standalone Tab/Module

### What We're Building
A brand-new "3D Concepts" page — completely independent from the existing Stores & Warehouse system. It will contain a simple 3D viewer with a "Container Gazebo Concept" model (shipping container + canvas canopy + support poles).

### Files to Create

1. **`src/pages/ThreeDeeConcepts.tsx`** — New page with header, PageNavDropdown, and the 3D viewer component
2. **`src/components/three-dee-concepts/ContainerGazeboConcept.tsx`** — Standalone 3D scene using `@react-three/fiber` + `@react-three/drei` (Canvas, OrbitControls, Text, Billboard) with:
   - **Shipping container**: ~12m × 2.4m × 2.6m box, neutral grey/steel color, corrugated wall texture via repeating box strips
   - **Canvas canopy**: A plane mesh extending ~4m outward from the container's top edge, slight downward angle for tension look, semi-transparent canvas material
   - **Two support poles**: Cylindrical meshes at the outer corners of the canopy, ground to canopy height
   - **Ground plane**: Flat surface beneath
   - **Label**: "Container Gazebo Concept" using Billboard Text
   - **Controls**: OrbitControls with zoom/pan/rotate (same pattern as StoreLayout3D)
   - **Lighting**: Ambient + directional, matching existing warehouse style

### Files to Modify

3. **`src/App.tsx`** — Add lazy import and protected route for `/3d-concepts` with a new tabKey `"3d-concepts"`
4. **`src/components/PageNavDropdown.tsx`** — Add nav item for "3D Concepts" with `Box` icon
5. **`src/pages/Home.tsx`** — Add card in ALL_SECTIONS for "3D Concepts"

### Technical Notes
- Uses same dependencies already in the project: `@react-three/fiber`, `@react-three/drei`, `three`
- Zero interaction with any stores-warehouse component or data file
- New component directory `src/components/three-dee-concepts/` keeps it fully isolated
- OrbitControls config mirrors the existing warehouse viewer (enablePan, minDistance, maxDistance, etc.)

