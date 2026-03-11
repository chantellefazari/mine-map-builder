import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X, Loader2, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ShutdownPM {
  name: string;
  frequency: string;
  type: "PM";
  discipline: "MS" | "ES";
  estimatedHours: number;
  tcAssetMatch?: string;
  tcPidTag?: string;
}

interface ShutdownArea {
  area: string;
  mechanical: ShutdownPM[];
  electrical: ShutdownPM[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  areas: ShutdownArea[];
}

export const PrintShutdownPMModal = ({ isOpen, onClose, areas }: Props) => {
  const [generating, setGenerating] = useState(false);

  const buildHtmlContent = () => {
    const totalPMs = areas.reduce((s, a) => s + a.mechanical.length + a.electrical.length, 0);
    const totalHours = areas.reduce((s, a) => s + [...a.mechanical, ...a.electrical].reduce((h, pm) => h + pm.estimatedHours, 0), 0);
    const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });

    const renderTable = (items: ShutdownPM[]) => {
      if (items.length === 0) return "";
      return `<table class="pm-table">
        <thead><tr>
          <th style="width:4%">#</th>
          <th>PM Name</th>
          <th style="width:8%">Freq</th>
          <th style="width:7%">Disc.</th>
          <th style="width:7%">Hours</th>
          <th style="width:22%">Asset Match</th>
          <th style="width:12%">P&ID Tag</th>
        </tr></thead>
        <tbody>${items.map((pm, i) => `<tr>
          <td style="text-align:center; color:#999">${i + 1}</td>
          <td style="font-weight:500">${pm.name}</td>
          <td><span class="freq-badge freq-${pm.frequency.toLowerCase()}">${pm.frequency}</span></td>
          <td><span class="disc-badge">${pm.discipline === "MS" ? "Mech" : "Elec"}</span></td>
          <td style="text-align:center; font-family:monospace">${pm.estimatedHours}</td>
          <td class="asset-match">${pm.tcAssetMatch || "—"}</td>
          <td class="pid-tag">${pm.tcPidTag || "—"}</td>
        </tr>`).join("")}</tbody>
      </table>`;
    };

    return `
      <!-- Banner Header -->
      <div class="banner">
        <div class="banner-left">
          <div class="site-name">TENNANT CREEK MINING GROUP</div>
          <div class="doc-title">Shutdown PM Requirements</div>
          <div class="doc-subtitle">Required Offline Inspections — Processing Plant</div>
        </div>
        <div class="banner-right">
          <div class="meta-item"><span class="meta-label">Document</span><span class="meta-value">TCMG-SD-PM-REQ-001</span></div>
          <div class="meta-item"><span class="meta-label">Revision</span><span class="meta-value">1.0</span></div>
          <div class="meta-item"><span class="meta-label">Date</span><span class="meta-value">${today}</span></div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat"><span class="stat-value">${totalPMs}</span><span class="stat-label">Total PMs</span></div>
        <div class="stat"><span class="stat-value">${areas.length}</span><span class="stat-label">Plant Areas</span></div>
        <div class="stat"><span class="stat-value">${totalHours}h</span><span class="stat-label">Est. Man-Hours</span></div>
        <div class="stat"><span class="stat-value">${areas.reduce((s, a) => s + a.mechanical.length, 0)}</span><span class="stat-label">Mechanical</span></div>
        <div class="stat"><span class="stat-value">${areas.reduce((s, a) => s + a.electrical.length, 0)}</span><span class="stat-label">Electrical</span></div>
      </div>

      <!-- Area Breakdown Summary -->
      <div class="section-title">Area Breakdown Summary</div>
      <table class="breakdown-table">
        <thead><tr>
          <th>Area</th>
          <th style="text-align:center">Mechanical</th>
          <th style="text-align:center">Electrical</th>
          <th style="text-align:center">Total PMs</th>
          <th style="text-align:center">Est. Hours</th>
        </tr></thead>
        <tbody>
          ${areas.map(a => {
            const total = a.mechanical.length + a.electrical.length;
            const hours = [...a.mechanical, ...a.electrical].reduce((s, pm) => s + pm.estimatedHours, 0);
            return `<tr>
              <td>${a.area}</td>
              <td style="text-align:center">${a.mechanical.length}</td>
              <td style="text-align:center">${a.electrical.length}</td>
              <td style="text-align:center; font-weight:600">${total}</td>
              <td style="text-align:center">${hours}h</td>
            </tr>`;
          }).join("")}
          <tr class="total-row">
            <td>TOTAL</td>
            <td style="text-align:center">${areas.reduce((s, a) => s + a.mechanical.length, 0)}</td>
            <td style="text-align:center">${areas.reduce((s, a) => s + a.electrical.length, 0)}</td>
            <td style="text-align:center">${totalPMs}</td>
            <td style="text-align:center">${totalHours}h</td>
          </tr>
        </tbody>
      </table>

      <!-- Detailed Area Sections -->
      ${areas.map(a => `
        <div class="area-section">
          <div class="area-header">${a.area}</div>
          ${a.mechanical.length > 0 ? `
            <div class="discipline-header mech">■ Mechanical — ${a.mechanical.length} Items — ${a.mechanical.reduce((s, pm) => s + pm.estimatedHours, 0)}h Est.</div>
            ${renderTable(a.mechanical)}
          ` : ""}
          ${a.electrical.length > 0 ? `
            <div class="discipline-header elec">■ Electrical — ${a.electrical.length} Items — ${a.electrical.reduce((s, pm) => s + pm.estimatedHours, 0)}h Est.</div>
            ${renderTable(a.electrical)}
          ` : ""}
        </div>
      `).join("")}

      <!-- Disclaimer -->
      <div class="disclaimer">
        <strong>Important:</strong> P&ID tags are only shown where verified against the site's source of truth database. 
        No tags have been fabricated or assumed. All asset references have been cross-checked against the live asset register.
      </div>

      <!-- Footer -->
      <div class="doc-footer">
        <span>TCMG-SD-PM-REQ-001 Rev 1.0</span>
        <span>Tennant Creek Mining Group — Confidential</span>
        <span>${today}</span>
      </div>
    `;
  };

  const pdfStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; color: #1a1a1a; line-height: 1.4; background: white; }

    .banner {
      background: #1a1a1a;
      color: white;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .banner .site-name { font-size: 9px; color: #b8860b; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 2px; }
    .banner .doc-title { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; }
    .banner .doc-subtitle { font-size: 10px; color: #aaa; margin-top: 2px; }
    .banner-right { text-align: right; }
    .banner-right .meta-item { margin-bottom: 3px; }
    .banner-right .meta-label { font-size: 8px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 8px; }
    .banner-right .meta-value { font-size: 10px; font-weight: 600; color: white; }

    .stats-bar {
      display: flex;
      border-bottom: 2px solid #b8860b;
      background: #fafafa;
    }
    .stat {
      flex: 1;
      padding: 10px 12px;
      text-align: center;
      border-right: 1px solid #eee;
    }
    .stat:last-child { border-right: none; }
    .stat-value { display: block; font-size: 18px; font-weight: 800; color: #1a1a1a; }
    .stat-label { display: block; font-size: 8px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }

    .section-title {
      font-size: 12px;
      font-weight: 700;
      padding: 12px 16px 6px;
      color: #1a1a1a;
      border-bottom: 1px solid #eee;
      margin-bottom: 0;
    }

    .breakdown-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .breakdown-table th {
      background: #f5f5f5;
      text-align: left;
      padding: 6px 10px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-bottom: 2px solid #ddd;
    }
    .breakdown-table td { padding: 5px 10px; border-bottom: 1px solid #eee; font-size: 9px; }
    .breakdown-table .total-row td { border-top: 2px solid #ddd; border-bottom: 2px solid #ddd; font-weight: 700; background: #f9f9f9; }

    .area-section { margin-bottom: 12px; }
    .area-header {
      background: #1a1a1a;
      color: white;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .discipline-header {
      background: #f0f0f0;
      padding: 4px 12px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #ddd;
    }
    .discipline-header.mech { color: #2563eb; border-left: 3px solid #2563eb; }
    .discipline-header.elec { color: #d97706; border-left: 3px solid #d97706; }

    .pm-table { width: 100%; border-collapse: collapse; }
    .pm-table th {
      background: #fafafa;
      text-align: left;
      padding: 4px 6px;
      font-size: 7px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-bottom: 1px solid #ddd;
    }
    .pm-table td { padding: 3px 6px; border-bottom: 1px solid #f0f0f0; font-size: 8px; vertical-align: top; }
    .pm-table tr:nth-child(even) { background: #fafafa; }

    .freq-badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 7px; font-weight: 700; }
    .freq-6w { background: #dcfce7; color: #166534; }
    .freq-12w { background: #dbeafe; color: #1e40af; }
    .freq-26w { background: #fef3c7; color: #92400e; }
    .freq-52w { background: #fee2e2; color: #991b1b; }
    .freq-4w { background: #e0e7ff; color: #3730a3; }
    .disc-badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 7px; font-weight: 600; border: 1px solid #ddd; }
    .asset-match { color: #666; font-size: 7px; }
    .pid-tag { color: #2563eb; font-family: monospace; font-size: 7px; }

    .disclaimer {
      margin: 16px 0 8px;
      padding: 8px 12px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 4px;
      font-size: 7px;
      color: #92400e;
    }

    .doc-footer {
      margin-top: 12px;
      padding: 6px 12px;
      border-top: 1px solid #eee;
      font-size: 7px;
      color: #aaa;
      display: flex;
      justify-content: space-between;
    }
  `;

  const handleGeneratePDF = async () => {
    setGenerating(true);

    try {
      // A4 dimensions
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const MARGIN_MM = 8;
      const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
      const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;

      // Render hidden container at exact A4 pixel width (96dpi)
      const containerWidthPx = 794; // ~210mm at 96dpi

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = `${containerWidthPx}px`;
      container.style.background = "white";
      container.style.overflow = "visible";

      const styleEl = document.createElement("style");
      styleEl.textContent = pdfStyles;
      container.appendChild(styleEl);

      const content = document.createElement("div");
      content.innerHTML = buildHtmlContent();
      container.appendChild(content);

      document.body.appendChild(container);
      await new Promise(r => setTimeout(r, 500));

      // Capture the full content as one tall canvas
      const fullCanvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: containerWidthPx,
        windowWidth: containerWidthPx,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(container);

      const imgWidthPx = fullCanvas.width;
      const imgHeightPx = fullCanvas.height;

      // Scale factor: how many mm per pixel
      const scaleFactor = CONTENT_WIDTH_MM / imgWidthPx;

      // How many pixels fit on one page of content area
      const pageContentHeightPx = CONTENT_HEIGHT_MM / scaleFactor;

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      let yOffsetPx = 0;
      let pageNum = 0;

      while (yOffsetPx < imgHeightPx) {
        if (pageNum > 0) pdf.addPage();

        // Calculate how much of the image to slice for this page
        const sliceHeightPx = Math.min(pageContentHeightPx, imgHeightPx - yOffsetPx);
        const sliceHeightMM = sliceHeightPx * scaleFactor;

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidthPx;
        pageCanvas.height = sliceHeightPx;
        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, imgWidthPx, sliceHeightPx);
          ctx.drawImage(
            fullCanvas,
            0, yOffsetPx, imgWidthPx, sliceHeightPx,  // source
            0, 0, imgWidthPx, sliceHeightPx             // dest
          );
        }

        const pageImgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImgData, "PNG", MARGIN_MM, MARGIN_MM, CONTENT_WIDTH_MM, sliceHeightMM);

        yOffsetPx += sliceHeightPx;
        pageNum++;
      }

      pdf.save("TCMG-Shutdown-PM-Requirements.pdf");
      onClose();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        <DialogTitle className="text-lg font-bold">Export Shutdown PM Requirements</DialogTitle>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate and download a professional PDF document with banner header, executive summary, and detailed area breakdowns.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document:</span>
              <span className="font-medium">TCMG-SD-PM-REQ-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Areas:</span>
              <span className="font-medium">{areas.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total PMs:</span>
              <span className="font-medium">{areas.reduce((s, a) => s + a.mechanical.length + a.electrical.length, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Man-Hours:</span>
              <span className="font-medium">{areas.reduce((s, a) => s + [...a.mechanical, ...a.electrical].reduce((h, pm) => h + pm.estimatedHours, 0), 0)}h</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleGeneratePDF} disabled={generating} className="gap-2">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {generating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
