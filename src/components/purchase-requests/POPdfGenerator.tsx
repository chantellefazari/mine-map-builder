import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { type POTrackerItem } from "@/hooks/usePOTracker";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";

interface POPdfGeneratorProps {
  po: POTrackerItem;
}

export const POPdfGenerator: React.FC<POPdfGeneratorProps> = ({ po }) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const trackingUrl = `${window.location.origin}/track-shipment?po=${po.id}`;

  const headerVal = Number(po.total_value || 0);
  const linesTotal = (po.lines || []).reduce(
    (sum, l) => sum + Number(l.unit_price || 0) * Number(l.quantity_ordered || 0),
    0
  );
  const displayVal = headerVal > 0 ? headerVal : linesTotal;

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    const wrapper = pdfRef.current;
    wrapper.style.display = "block";

    try {
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 794,
        windowWidth: 794,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfW = 210;
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, Math.min(pdfH, 297));
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${po.po_number}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    } finally {
      wrapper.style.display = "none";
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={handleDownload}>
        <FileDown className="h-3 w-3" /> PDF
      </Button>

      {/* Hidden PDF content */}
      <div
        ref={pdfRef}
        style={{
          display: "none",
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "794px",
          background: "#fff",
          color: "#000",
          fontFamily: "Arial, sans-serif",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "4px" }}>PURCHASE ORDER</div>
            <div style={{ fontSize: "14px", color: "#666" }}>TCMG – Tennant Creek Gold Mine</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", fontFamily: "monospace" }}>{po.po_number}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {po.order_date ? format(new Date(po.order_date), "dd MMM yyyy") : format(new Date(po.created_at), "dd MMM yyyy")}
            </div>
          </div>
        </div>

        <hr style={{ border: "1px solid #ddd", margin: "16px 0" }} />

        {/* Supplier & Details */}
        <div style={{ display: "flex", gap: "40px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>SUPPLIER</div>
            <div style={{ fontSize: "14px", fontWeight: "600" }}>{po.supplier}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>TOTAL VALUE</div>
            <div style={{ fontSize: "14px", fontWeight: "600" }}>
              ${displayVal.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </div>
          </div>
          {po.eta && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>EXPECTED DELIVERY</div>
              <div style={{ fontSize: "14px" }}>{format(new Date(po.eta), "dd MMM yyyy")}</div>
            </div>
          )}
        </div>

        {/* Description */}
        {po.description && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>DESCRIPTION</div>
            <div style={{ fontSize: "13px" }}>{po.description}</div>
          </div>
        )}

        {/* Part Image */}
        {po.image_url && (
          <div style={{ textAlign: "center", margin: "16px 0" }}>
            <img
              src={po.image_url}
              alt="Part"
              crossOrigin="anonymous"
              style={{ maxHeight: "160px", objectFit: "contain", border: "1px solid #eee", borderRadius: "6px" }}
            />
          </div>
        )}

        {/* Line Items Table */}
        {po.lines && po.lines.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>LINE ITEMS</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>#</th>
                  <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Description</th>
                  <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Part #</th>
                  <th style={{ padding: "8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>Qty</th>
                  <th style={{ padding: "8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>Unit Price</th>
                  <th style={{ padding: "8px", textAlign: "right", borderBottom: "1px solid #ddd" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {po.lines.map((line, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{i + 1}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{line.part_description}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee", fontFamily: "monospace" }}>{line.part_number || "—"}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee", textAlign: "right" }}>{line.quantity_ordered}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee", textAlign: "right" }}>
                      ${Number(line.unit_price || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee", textAlign: "right" }}>
                      ${(Number(line.unit_price || 0) * Number(line.quantity_ordered || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <hr style={{ border: "1px solid #ddd", margin: "16px 0" }} />

        {/* QR Code Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>📦 Shipment Tracking</div>
            <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.5" }}>
              Scan the QR code at each transit point to update<br />
              the delivery location and track this shipment<br />
              in real-time.
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <QRCodeSVG value={trackingUrl} size={120} level="M" />
            <div style={{ fontSize: "9px", color: "#999", marginTop: "4px" }}>Scan to update location</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "30px", borderTop: "1px solid #ddd", paddingTop: "12px", fontSize: "10px", color: "#999", textAlign: "center" }}>
          TCMG – Tennant Creek Gold Mine • Purchase Order {po.po_number} • Generated {format(new Date(), "dd MMM yyyy")}
        </div>
      </div>
    </>
  );
};
