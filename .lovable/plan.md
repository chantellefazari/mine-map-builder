
# Remove Safety Requirements & Isolation from Work Order Template

## What Changes

The entire "Safety Requirements" section (lines 137-224) will be removed from the Work Order template. This includes:

- Isolation / LOTO Details block (isolation required checkbox, isolation number, isolation points, lock numbers, isolated by, date/time)
- Permit Required block (Hot Work, Confined Space, Working at Heights)
- PPE Required block (Safety Glasses, Hard Hat, Steel Caps, Hearing Protection, Gloves, Face Shield, Respirator)

All of this information belongs on the Risk Assessment, not the Work Order.

## Result

The Work Order template will flow directly from "Problem Description" into "Work Performed", keeping the template focused on the actual maintenance work record.

## Technical Detail

**Modified file**: `src/components/work-orders/MechanicalWorkOrderTemplate.tsx`
- Delete the entire Safety Requirements `div` block (lines 137-224)
- No other files affected
