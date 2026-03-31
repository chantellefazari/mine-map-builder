

## Plan: Add Minesite.AI Logo to Stock Code Standard PDF

### What
Add the uploaded Minesite.AI logo to the bottom-right corner of the Stock Code Standard PDF document.

### Changes

**1. Copy logo to project assets**
Copy `user-uploads://Minesite.ai_LOGO.png` to `src/assets/Minesite_ai_logo.png`.

**2. Update `SitePartNumberingDocument.tsx`**
- Import the logo image
- Add the logo in the footer area (bottom-right), replacing the current simple text footer with one that includes the logo image aligned to the right
- The logo will render as an `<img>` tag inside the `data-pdf-section` div so html2canvas captures it in the PDF output

### Technical Detail
The footer div (line 257) currently uses `display: flex; justify-content: space-between`. We'll add an `<img>` element for the logo on the right side, sized appropriately (roughly 80px wide) so it appears cleanly in the bottom-right corner of the rendered PDF page.

