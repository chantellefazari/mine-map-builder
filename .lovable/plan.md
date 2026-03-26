

## Plan: Update Work Request types to Inspect, Repair, Replace

**What changes:**

1. **`src/components/work-requests/WorkRequestTemplate.tsx`** (line 144):
   - Change `workTypeOptions` from `["Breakdown", "Planned", "Shutdown"]` to `["Inspect", "Repair", "Replace"]`
   - Update default `work_type` value from `"Breakdown"` to `"Inspect"` (lines 33 and 50)

2. **`src/components/work-requests/WorkRequestTemplate.tsx`** (line 108):
   - Update the "Convert to WO" logic — when converting a WR to a WO, the WO type should default to `"Planned"` instead of using the WR's work_type (since Inspect/Repair/Replace are not valid WO types)

**No changes needed** to the WO creation dialog (`WOTypeSelectDialog.tsx`) — it already uses Breakdown, Planned, Shutdown, and PM as WO types.

**Technical detail:**
- The `work_type` column in the `work_requests` database table stores free text, so no migration is needed — the new values will just be stored as strings.

