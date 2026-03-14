import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface PMItem {
  id: string;
  pmName: string;
  discipline: string;
  frequency: string;
  equipmentType: string;
  status: string;
  estimatedDuration: string;
  dutyType: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pms: PMItem[];
}

export const PrintPMRegisterModal = ({ isOpen, onClose, pms }: Props) => {
  const [generating, setGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    try {
      // A4 Portrait dimensions
      const A4_WIDTH_MM = 210;
      const A4_HEIGHT_MM = 297;
      const MARGIN_MM = 8;
      const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
      const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
      const containerWidthPx = 794; // ~210mm at 96dpi

      const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });
      const mechCount = pms.filter(p => p.discipline === "Mechanical").length;
      const elecCount = pms.filter(p => p.discipline === "Electrical").length;
      const opsCount = pms.filter(p => p.discipline === "Ops" || p.discipline === "Inspection").length;

      // Frequency sort order
      const FREQ_ORDER: Record<string, number> = {
        "Daily": 0, "1 Week": 1, "2 Week": 2, "4 Week": 3, "6 Week": 4, "12 Week": 5, "26 Week": 6, "52 Week": 7,
      };
      const freqRank = (f: string) => FREQ_ORDER[f] ?? 99;

      // Group by discipline, sorted by frequency
      const grouped = new Map<string, PMItem[]>();
      for (const pm of pms) {
        const key = pm.discipline || "Other";
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(pm);
      }
      for (const [, items] of grouped) {
        items.sort((a, b) => freqRank(a.frequency) - freqRank(b.frequency));
      }

      // Group by frequency for summary
      const freqMap = new Map<string, number>();
      for (const pm of pms) {
        const f = pm.frequency || "Unspecified";
        freqMap.set(f, (freqMap.get(f) || 0) + 1);
      }

      const renderTable = (items: PMItem[]) => `
        <table class="pm-table">
          <thead><tr>
           <th style="width:3%">#</th>
            <th style="width:28%">PM Name</th>
            <th style="width:10%">Frequency</th>
            <th style="width:18%">Equipment Type</th>
            <th style="width:8%">Duty Type</th>
            <th style="width:16%">Resources</th>
            <th style="width:8%">Status</th>
          </tr></thead>
          <tbody>${items.map((pm, i) => `<tr>
            <td style="text-align:center; color:#999">${i + 1}</td>
            <td style="font-weight:500">${pm.pmName}</td>
            <td><span class="freq-badge freq-${pm.frequency.toLowerCase().replace(/\s+/g, '-')}">${pm.frequency}</span></td>
            <td class="equip-type">${pm.equipmentType}</td>
            <td style="text-align:center"><span class="duty-badge duty-${(pm.dutyType || 'Online').toLowerCase()}">${pm.dutyType || "Online"}</span></td>
            <td style="text-align:center; font-weight:500">${pm.estimatedDuration || "-"}</td>
            <td><span class="status-badge status-${pm.status.toLowerCase()}">${pm.status}</span></td>
          </tr>`).join("")}</tbody>
        </table>`;

      // Build sections as separate div elements for section-based page breaking
      const sections: string[] = [];

      // Section 0: Banner + Stats
      sections.push(`
        <div data-pdf-section>
          <div class="banner">
            <div class="banner-left">
              <div class="site-name">TENNANT CREEK MINING GROUP</div>
              <div class="doc-title">Current Site PM Register</div>
              <div class="doc-subtitle">Existing Preventive Maintenance Tasks — Processing Plant</div>
            </div>
            <div class="banner-right">
              <div class="meta-item"><span class="meta-label">Document</span><span class="meta-value">TCMG-PM-REG-001</span></div>
              <div class="meta-item"><span class="meta-label">Revision</span><span class="meta-value">1.0</span></div>
              <div class="meta-item"><span class="meta-label">Date</span><span class="meta-value">${today}</span></div>
            </div>
          </div>
          <div class="stats-bar">
            <div class="stat"><span class="stat-value">${pms.length}</span><span class="stat-label">Total PMs</span></div>
            <div class="stat"><span class="stat-value">${mechCount}</span><span class="stat-label">Mechanical</span></div>
            <div class="stat"><span class="stat-value">${elecCount}</span><span class="stat-label">Electrical</span></div>
            <div class="stat"><span class="stat-value">${opsCount}</span><span class="stat-label">Mobile Equipment</span></div>
            <div class="stat"><span class="stat-value">${freqMap.size}</span><span class="stat-label">Frequencies</span></div>
          </div>
        </div>
      `);

      // Section 1: Frequency Breakdown
      sections.push(`
        <div data-pdf-section>
          <div class="section-title">Frequency Breakdown</div>
          <table class="breakdown-table">
            <thead><tr>
              <th>Frequency</th>
              <th style="text-align:center">Count</th>
              <th style="text-align:center">% of Total</th>
            </tr></thead>
            <tbody>
              ${Array.from(freqMap.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([freq, count]) => `<tr>
                  <td>${freq}</td>
                  <td style="text-align:center">${count}</td>
                  <td style="text-align:center">${Math.round((count / pms.length) * 100)}%</td>
                </tr>`).join("")}
              <tr class="total-row">
                <td>TOTAL</td>
                <td style="text-align:center">${pms.length}</td>
                <td style="text-align:center">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      `);




      // Sections 3+: Each discipline group
      for (const [disc, items] of grouped.entries()) {
        // Split large groups into chunks of 25 rows to avoid page overflow
        const CHUNK_SIZE = 25;
        for (let c = 0; c < items.length; c += CHUNK_SIZE) {
          const chunk = items.slice(c, c + CHUNK_SIZE);
          const isFirst = c === 0;
          sections.push(`
            <div data-pdf-section>
              <div class="area-header">${disc} — ${items.length} PMs${!isFirst ? ` (continued)` : ''}</div>
              ${renderTable(chunk)}
            </div>
          `);
        }
      }

      // Footer section
      sections.push(`
        <div data-pdf-section>
          <div class="doc-footer">
            <span>TCMG-PM-REG-001 Rev 1.0</span>
            <span>Tennant Creek Mining Group — Confidential</span>
            <span>${today}</span>
          </div>
        </div>
      `);

      const pdfStyles = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; color: #1a1a1a; line-height: 1.4; background: white; }

        .banner {
          background: #1a1a1a;
          color: white;
          padding: 14px 18px;
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
          padding: 8px 10px;
          text-align: center;
          border-right: 1px solid #eee;
        }
        .stat:last-child { border-right: none; }
        .stat-value { display: block; font-size: 16px; font-weight: 800; color: #1a1a1a; }
        .stat-label { display: block; font-size: 7px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          padding: 10px 14px 4px;
          color: #1a1a1a;
          border-bottom: 1px solid #eee;
          margin-bottom: 0;
        }

        .breakdown-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        .breakdown-table th {
          background: #f5f5f5;
          text-align: left;
          padding: 5px 10px;
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 2px solid #ddd;
        }
        .breakdown-table td { padding: 4px 10px; border-bottom: 1px solid #eee; font-size: 9px; }
        .breakdown-table .total-row td { border-top: 2px solid #ddd; border-bottom: 2px solid #ddd; font-weight: 700; background: #f9f9f9; }

        .area-header {
          background: #1a1a1a;
          color: white;
          padding: 5px 12px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .pm-table { width: 100%; border-collapse: collapse; }
        .pm-table th {
          background: #fafafa;
          text-align: left;
          padding: 3px 6px;
          font-size: 7px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 1px solid #ddd;
        }
        .pm-table td { padding: 2px 6px; border-bottom: 1px solid #f0f0f0; font-size: 8px; vertical-align: middle; }
        .pm-table tr:nth-child(even) { background: #fafafa; }

        .freq-badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 7px; font-weight: 700; background: #e0e7ff; color: #3730a3; }
        .freq-badge.freq-daily { background: #dcfce7; color: #166534; }
        .freq-badge.freq-weekly, .freq-badge.freq-1-week { background: #dcfce7; color: #166534; }
        .freq-badge.freq-monthly, .freq-badge.freq-4-week { background: #dbeafe; color: #1e40af; }
        .freq-badge.freq-2-week { background: #d1fae5; color: #065f46; }
        .freq-badge.freq-6-week, .freq-badge.freq-6-weekly { background: #fef3c7; color: #92400e; }
        .freq-badge.freq-quarterly, .freq-badge.freq-12-week { background: #fef3c7; color: #92400e; }
        .freq-badge.freq-6-monthly, .freq-badge.freq-26-week { background: #fee2e2; color: #991b1b; }
        .freq-badge.freq-annual, .freq-badge.freq-52-week { background: #fce7f3; color: #9d174d; }

        .equip-type { color: #666; font-size: 8px; }

         .duty-badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 7px; font-weight: 600; }
         .duty-badge.duty-online { background: #dcfce7; color: #166534; }
         .duty-badge.duty-offline { background: #fee2e2; color: #991b1b; }
         .duty-badge.duty-both { background: #e0e7ff; color: #3730a3; }

        .status-badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 7px; font-weight: 600; }
        .status-badge.status-active, .status-badge.status-approved { background: #dcfce7; color: #166534; }
        .status-badge.status-draft { background: #fef3c7; color: #92400e; }
        .status-badge.status-review, .status-badge.status-reviewed { background: #dbeafe; color: #1e40af; }

        .doc-footer {
          margin-top: 8px;
          padding: 6px 12px;
          border-top: 1px solid #eee;
          font-size: 7px;
          color: #aaa;
          display: flex;
          justify-content: space-between;
        }
      `;

      // Create a hidden container and render each section for capture
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      let currentY = MARGIN_MM;
      let pageNum = 0;
      const SECTION_GAP_MM = 2;

      for (let si = 0; si < sections.length; si++) {
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
        content.innerHTML = sections[si];
        container.appendChild(content);

        document.body.appendChild(container);
        await new Promise(r => setTimeout(r, 100));

        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: containerWidthPx,
          windowWidth: containerWidthPx,
          backgroundColor: "#ffffff",
        });

        document.body.removeChild(container);

        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;
        const scaleFactor = CONTENT_WIDTH_MM / imgWidthPx;
        const sectionHeightMM = imgHeightPx * scaleFactor;

        // Check if section fits on current page
        const remainingSpace = CONTENT_HEIGHT_MM - (currentY - MARGIN_MM);
        if (sectionHeightMM > remainingSpace && currentY > MARGIN_MM) {
          pdf.addPage();
          pageNum++;
          currentY = MARGIN_MM;
        }

        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", MARGIN_MM, currentY, CONTENT_WIDTH_MM, sectionHeightMM);

        currentY += sectionHeightMM + SECTION_GAP_MM;
      }

      // Add page numbers
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(170, 170, 170);
        pdf.text(`Page ${i} of ${totalPages}`, A4_WIDTH_MM - MARGIN_MM, A4_HEIGHT_MM - 3, { align: "right" });
      }

      pdf.save("TCMG-Site-PM-Register.pdf");
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
        <DialogTitle className="text-lg font-bold">Export Site PM Register</DialogTitle>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate and download a professional A4 landscape PDF listing all preventive maintenance tasks with discipline breakdowns, duty types, and duration times sourced from PM design templates.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document:</span>
              <span className="font-medium">TCMG-PM-REG-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total PMs:</span>
              <span className="font-medium">{pms.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mechanical:</span>
              <span className="font-medium">{pms.filter(p => p.discipline === "Mechanical").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Electrical:</span>
              <span className="font-medium">{pms.filter(p => p.discipline === "Electrical").length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Format:</span>
              <span className="font-medium">A4 Portrait</span>
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
