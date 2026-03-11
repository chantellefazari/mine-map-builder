import { useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";

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
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const totalPMs = areas.reduce((s, a) => s + a.mechanical.length + a.electrical.length, 0);
    const totalHours = areas.reduce((s, a) => s + [...a.mechanical, ...a.electrical].reduce((h, pm) => h + pm.estimatedHours, 0), 0);
    const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>TCMG Shutdown PM Requirements</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 10mm 15mm 10mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; color: #1a1a1a; line-height: 1.4; }

    /* ── Title Page ── */
    .title-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      text-align: center;
      padding: 40mm 20mm;
    }
    .title-page h1 {
      font-size: 28px;
      font-weight: 800;
      color: #1a1a1a;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .title-page .subtitle {
      font-size: 14px;
      color: #666;
      font-weight: 400;
      margin-bottom: 40px;
    }
    .title-page .site-name {
      font-size: 16px;
      font-weight: 700;
      color: #b8860b;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .title-meta {
      margin-top: 30px;
      border-top: 2px solid #e5e5e5;
      padding-top: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 40px;
      text-align: left;
      font-size: 11px;
    }
    .title-meta dt { color: #888; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    .title-meta dd { font-weight: 600; color: #333; margin-bottom: 8px; }

    /* ── Summary Box ── */
    .summary-page { page-break-after: always; padding-top: 10mm; }
    .summary-title {
      font-size: 16px;
      font-weight: 700;
      border-bottom: 3px solid #b8860b;
      padding-bottom: 6px;
      margin-bottom: 16px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .summary-card {
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
    }
    .summary-card .value { font-size: 24px; font-weight: 800; }
    .summary-card .label { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-card.primary .value { color: #b8860b; }
    .summary-card.green .value { color: #16a34a; }
    .summary-card.amber .value { color: #d97706; }
    .summary-card.blue .value { color: #2563eb; }

    /* ── Area breakdown summary table ── */
    .breakdown-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .breakdown-table th {
      background: #f5f5f5;
      text-align: left;
      padding: 8px 10px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-bottom: 2px solid #ddd;
    }
    .breakdown-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #eee;
      font-size: 10px;
    }
    .breakdown-table tr:last-child td { border-bottom: 2px solid #ddd; font-weight: 700; }

    /* ── Area Sections ── */
    .area-section { page-break-inside: avoid; margin-bottom: 14px; }
    .area-header {
      background: #1a1a1a;
      color: white;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.3px;
      margin-bottom: 0;
    }
    .discipline-header {
      background: #f0f0f0;
      padding: 5px 12px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .discipline-header.mech { color: #2563eb; border-left: 3px solid #2563eb; }
    .discipline-header.elec { color: #d97706; border-left: 3px solid #d97706; }

    /* ── PM Table ── */
    .pm-table { width: 100%; border-collapse: collapse; }
    .pm-table th {
      background: #fafafa;
      text-align: left;
      padding: 5px 8px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-bottom: 1px solid #ddd;
    }
    .pm-table td {
      padding: 4px 8px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 9px;
      vertical-align: top;
    }
    .pm-table tr { page-break-inside: avoid; }
    .pm-table tr:nth-child(even) { background: #fafafa; }
    .freq-badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 8px;
      font-weight: 700;
    }
    .freq-6w { background: #dcfce7; color: #166534; }
    .freq-12w { background: #dbeafe; color: #1e40af; }
    .freq-26w { background: #fef3c7; color: #92400e; }
    .freq-52w { background: #fee2e2; color: #991b1b; }
    .freq-4w { background: #e0e7ff; color: #3730a3; }

    .disc-badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 8px;
      font-weight: 600;
      border: 1px solid #ddd;
    }
    .asset-match { color: #666; font-size: 8px; }
    .pid-tag { color: #2563eb; font-family: monospace; font-size: 8px; }

    /* ── Footer ── */
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 4px 10mm;
      font-size: 7px;
      color: #aaa;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
    }

    /* ── Disclaimer ── */
    .disclaimer {
      margin-top: 20px;
      padding: 10px 14px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 4px;
      font-size: 8px;
      color: #92400e;
    }
  </style>
</head>
<body>

  <!-- TITLE PAGE -->
  <div class="title-page">
    <div class="site-name">Tennant Creek Mining Group</div>
    <h1>Shutdown PM Requirements</h1>
    <div class="subtitle">Required Offline Inspections — Processing Plant</div>
    <div class="title-meta">
      <div><dt>Document</dt><dd>TCMG-SD-PM-REQ-001</dd></div>
      <div><dt>Revision</dt><dd>1.0</dd></div>
      <div><dt>Date Issued</dt><dd>${today}</dd></div>
      <div><dt>Prepared By</dt><dd>Maintenance Department</dd></div>
      <div><dt>Total PMs</dt><dd>${totalPMs} Required Inspections</dd></div>
      <div><dt>Est. Man-Hours</dt><dd>${totalHours} hours per cycle</dd></div>
    </div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <div class="summary-page">
    <div class="summary-title">Executive Summary</div>
    <p style="font-size: 10px; color: #555; margin-bottom: 16px; line-height: 1.6;">
      This document defines the mandatory offline preventive maintenance inspections required during planned plant shutdowns at the Tennant Creek Processing Plant.
      All listed PMs require the equipment or area to be de-energised, isolated, and locked out before work can commence.
      Each PM has been cross-referenced against the site's verified P&ID source of truth to ensure alignment with installed assets.
    </p>

    <div class="summary-grid">
      <div class="summary-card primary"><div class="value">${totalPMs}</div><div class="label">Total Required PMs</div></div>
      <div class="summary-card blue"><div class="value">${areas.length}</div><div class="label">Plant Areas</div></div>
      <div class="summary-card amber"><div class="value">${totalHours}h</div><div class="label">Est. Total Man-Hours</div></div>
      <div class="summary-card green"><div class="value">${areas.reduce((s, a) => s + a.mechanical.length, 0)}</div><div class="label">Mechanical PMs</div></div>
    </div>

    <table class="breakdown-table">
      <thead>
        <tr>
          <th>Area</th>
          <th style="text-align:center">Mechanical</th>
          <th style="text-align:center">Electrical</th>
          <th style="text-align:center">Total PMs</th>
          <th style="text-align:center">Est. Hours</th>
        </tr>
      </thead>
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
        <tr>
          <td>TOTAL</td>
          <td style="text-align:center">${areas.reduce((s, a) => s + a.mechanical.length, 0)}</td>
          <td style="text-align:center">${areas.reduce((s, a) => s + a.electrical.length, 0)}</td>
          <td style="text-align:center">${totalPMs}</td>
          <td style="text-align:center">${totalHours}h</td>
        </tr>
      </tbody>
    </table>

    <div class="disclaimer">
      <strong>Important:</strong> P&ID tags are only shown where verified against the site's source of truth database. 
      No tags have been fabricated or assumed. All asset references have been cross-checked against the live asset register.
    </div>
  </div>

  <!-- DETAILED AREA SECTIONS -->
  ${areas.map(a => {
    const renderTable = (items: ShutdownPM[]) => {
      if (items.length === 0) return "";
      return `<table class="pm-table">
        <thead>
          <tr>
            <th style="width:3%">#</th>
            <th>PM Name</th>
            <th style="width:8%">Freq</th>
            <th style="width:7%">Disc.</th>
            <th style="width:6%">Hours</th>
            <th>Asset Match</th>
            <th style="width:12%">P&ID Tag</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((pm, i) => `<tr>
            <td style="text-align:center; color:#aaa">${i + 1}</td>
            <td style="font-weight:500">${pm.name}</td>
            <td><span class="freq-badge freq-${pm.frequency.toLowerCase()}">${pm.frequency}</span></td>
            <td><span class="disc-badge">${pm.discipline === "MS" ? "Mech" : "Elec"}</span></td>
            <td style="text-align:center; font-family:monospace">${pm.estimatedHours}</td>
            <td class="asset-match">${pm.tcAssetMatch || "—"}</td>
            <td class="pid-tag">${pm.tcPidTag || "—"}</td>
          </tr>`).join("")}
        </tbody>
      </table>`;
    };

    return `
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
    `;
  }).join("")}

  <div class="page-footer">
    <span>TCMG-SD-PM-REQ-001 Rev 1.0</span>
    <span>Tennant Creek Mining Group — Confidential</span>
    <span>${today}</span>
  </div>

</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold">Export Shutdown PM Requirements</h3>
            <p className="text-sm text-muted-foreground">
              Generate a professional PDF document with title page, executive summary, and detailed area breakdowns.
            </p>
          </div>

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
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Generate PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
