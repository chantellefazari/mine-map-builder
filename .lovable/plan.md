

## Fix: Prevent Aspect logo overlapping with PM banner title

**Problem**: The logos are positioned `left-4` and the title is centered across the full width (`left-0 right-0`), so on longer titles (e.g. "Matec 1520HP Filter Press Daily Online Inspection") the text overlaps the logos.

**Solution**: Adjust the title container in `PMBannerHeader.tsx` to add left/right padding so the text sits between the logos and the WO# field, and reduce the title font size slightly to accommodate longer names.

### Changes to `src/components/pm-design/PMBannerHeader.tsx`

1. **Title container** (line 19): Add `pl-[160px] pr-[100px]` to the title's absolute container so it avoids the logo zone (left) and WO# zone (right)
2. **Title font size** (line 21): Reduce from `text-2xl` to `text-lg` so longer titles fit cleanly
3. **Subtitle font size** (line 22): Reduce from `text-base` to `text-sm`

This is a single shared component used by all 64+ PM templates, so the fix applies everywhere automatically. No other files need changes.

