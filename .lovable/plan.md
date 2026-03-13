

## Root Cause Analysis

The Resource/s field is getting cut off in the Download PDF because of **two compounding issues**:

### Issue 1: `html2canvas` cannot reliably capture `<input>` element values

The Resource/s field in `PMMetadataGrid.tsx` (line 158) uses a native `<input type="text">` element. When `sectionPdfExport.ts` clones the DOM for off-screen rendering, `cloneNode(true)` copies the HTML but **does not copy the `.value` property** of input elements (it's a DOM property, not an HTML attribute). So html2canvas sees the input as empty or partially rendered, causing the text to be cut off or missing entirely.

This affects every `<input>` and `<textarea>` inside PM documents -- Resource/s just happens to be the most visible victim.

### Issue 2: `data-pdf-break` on the Resources row invites page breaks at exactly the wrong spot

In `PMMetadataGrid.tsx` line 155, the Resources row has `data-pdf-break` which tells the PDF slicer that the bottom of this element is a valid page-break candidate. If Resources lands near the bottom 30% of a page, the engine will slice right through it.

---

## Fix Plan

### 1. Fix input value capture in `sectionPdfExport.ts`

After cloning the section (around line 255), add logic to:
- Find all `<input>` elements in both the **original** section and the **clone**
- Copy the original's `.value` to the clone's `.value` **and** set the `value` attribute
- Do the same for `<textarea>` elements (for the Comments box)
- Optionally replace empty-looking inputs with `<span>` elements so html2canvas renders the text as plain DOM text (most reliable approach)

### 2. Remove `data-pdf-break` from Resources row in `PMMetadataGrid.tsx`

Line 155: Change `data-pdf-keep-together data-pdf-break` to just `data-pdf-keep-together`. This prevents the slicer from choosing the resources row as a page-break point.

### Files to edit:
- `src/utils/sectionPdfExport.ts` — add input/textarea value transfer after cloning
- `src/components/pm-design/PMMetadataGrid.tsx` — remove `data-pdf-break` from Resources row

