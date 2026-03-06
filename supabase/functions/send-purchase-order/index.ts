import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d.getDate().toString().padStart(2,"0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return dateStr; }
}

function buildPdf(po: any, lines: any[], trackingUrl: string, qrDataUrl: string | null): string {
  const doc = new jsPDF("p", "mm", "a4");
  const W = 210;
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("PURCHASE ORDER", 20, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("TCMG – Tennant Creek Gold Mine", 20, y);

  // PO number top-right
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(po.po_number, W - 20, 20, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(formatDate(po.order_date || po.created_at), W - 20, 28, { align: "right" });

  // Line
  y += 6;
  doc.setDrawColor(200);
  doc.line(20, y, W - 20, y);
  y += 10;

  // Details section
  doc.setTextColor(150);
  doc.setFontSize(9);
  doc.text("SUPPLIER", 20, y);
  doc.text("TOTAL VALUE", 90, y);
  if (po.eta) doc.text("EXPECTED DELIVERY", 150, y);
  y += 5;

  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(po.supplier || "—", 20, y);

  const headerVal = Number(po.total_value || 0);
  const linesTotal = (lines || []).reduce(
    (sum: number, l: any) => sum + Number(l.unit_price || 0) * Number(l.quantity_ordered || 0), 0
  );
  const displayVal = headerVal > 0 ? headerVal : linesTotal;
  doc.text(`$${displayVal.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`, 90, y);
  if (po.eta) {
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(po.eta), 150, y);
  }
  y += 10;

  // Description
  if (po.description) {
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("DESCRIPTION", 20, y);
    y += 5;
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(po.description, W - 40);
    doc.text(descLines, 20, y);
    y += descLines.length * 5 + 4;
  }

  // Line items table
  if (lines && lines.length > 0) {
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("LINE ITEMS", 20, y);
    y += 6;

    // Table header
    doc.setFillColor(245, 245, 245);
    doc.rect(20, y - 4, W - 40, 7, "F");
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("#", 22, y);
    doc.text("Description", 30, y);
    doc.text("Part #", 110, y);
    doc.text("Qty", 142, y, { align: "right" });
    doc.text("Unit Price", 162, y, { align: "right" });
    doc.text("Total", W - 22, y, { align: "right" });
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    lines.forEach((l: any, i: number) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setDrawColor(230);
      doc.line(20, y + 2, W - 20, y + 2);
      doc.text(`${i + 1}`, 22, y);
      const desc = doc.splitTextToSize(l.part_description || "—", 75);
      doc.text(desc, 30, y);
      doc.text(l.part_number || "—", 110, y);
      doc.text(`${l.quantity_ordered}`, 142, y, { align: "right" });
      doc.text(`$${Number(l.unit_price || 0).toFixed(2)}`, 162, y, { align: "right" });
      doc.text(`$${(Number(l.unit_price || 0) * Number(l.quantity_ordered || 0)).toFixed(2)}`, W - 22, y, { align: "right" });
      y += Math.max(desc.length * 4, 6) + 2;
    });
    y += 4;
  }

  // Separator
  doc.setDrawColor(200);
  doc.line(20, y, W - 20, y);
  y += 10;

  // QR code section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("Shipment Tracking", 20, y);
  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Scan the QR code at each transit point to update", 20, y);
  y += 4;
  doc.text("the delivery location and track this shipment in real-time.", 20, y);

  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, "PNG", W - 55, y - 14, 30, 30);
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text("Scan to update location", W - 40, y + 20, { align: "center" });
    } catch (e) {
      console.error("QR image add failed:", e);
    }
  }

  y += 20;

  // Tracking URL text fallback
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Tracking link: ${trackingUrl}`, 20, y);
  y += 10;

  // Footer
  doc.setDrawColor(200);
  doc.line(20, y, W - 20, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    `TCMG – Tennant Creek Gold Mine • Purchase Order ${po.po_number} • Generated ${formatDate(new Date().toISOString())}`,
    W / 2, y, { align: "center" }
  );

  // Return base64 without the data URI prefix
  const pdfOutput = doc.output("datauristring");
  // Strip "data:application/pdf;filename=generated.pdf;base64," prefix
  const base64 = pdfOutput.split(",")[1];
  return base64;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const { po_id, supplier_email } = await req.json();

    if (!po_id) {
      return new Response(JSON.stringify({ error: "po_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get PO details
    const { data: po, error: poErr } = await supabase
      .from("po_tracker")
      .select("*")
      .eq("id", po_id)
      .single();

    if (poErr || !po) {
      return new Response(JSON.stringify({ error: "PO not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get PO lines
    const { data: lines } = await supabase
      .from("po_tracker_lines")
      .select("*")
      .eq("po_tracker_id", po_id);

    // Get image from linked quote request
    let imageUrl = "";
    if (po.quote_request_id) {
      const { data: qr } = await supabase
        .from("quote_requests")
        .select("image_url")
        .eq("id", po.quote_request_id)
        .single();
      if (qr?.image_url) imageUrl = qr.image_url;
    }

    const confirmToken = po.confirmation_token;
    const email = supplier_email || "";
    const confirmLink = `https://parts.minesite.ai/supplier-portal?mode=confirm&token=${confirmToken}`;
    const trackingLink = `https://parts.minesite.ai/track-shipment?po=${po.id}`;

    // Generate QR code image via external API
    let qrDataUrl: string | null = null;
    try {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trackingLink)}`;
      const qrRes = await fetch(qrApiUrl);
      if (qrRes.ok) {
        const qrBuf = await qrRes.arrayBuffer();
        const qrBase64 = btoa(String.fromCharCode(...new Uint8Array(qrBuf)));
        qrDataUrl = `data:image/png;base64,${qrBase64}`;
      }
    } catch (e) {
      console.error("QR code generation failed:", e);
    }

    // Generate PDF
    let pdfBase64: string | null = null;
    try {
      pdfBase64 = buildPdf(po, lines || [], trackingLink, qrDataUrl);
      console.log("PDF generated successfully, size:", pdfBase64.length);
    } catch (e) {
      console.error("PDF generation failed:", e);
    }

    // Build line items HTML for email body
    const linesHtml = (lines || []).map((l: any, i: number) => `
      <tr>
        <td style="padding:6px 8px;border:1px solid #e5e5e5;font-size:13px;text-align:center">${i + 1}</td>
        <td style="padding:6px 8px;border:1px solid #e5e5e5;font-size:13px">${l.part_description}</td>
        <td style="padding:6px 8px;border:1px solid #e5e5e5;font-size:13px;font-family:monospace">${l.part_number || "—"}</td>
        <td style="padding:6px 8px;border:1px solid #e5e5e5;font-size:13px;text-align:center">${l.quantity_ordered}</td>
        <td style="padding:6px 8px;border:1px solid #e5e5e5;font-size:13px;text-align:right">$${Number(l.unit_price || 0).toFixed(2)}</td>
      </tr>
    `).join("");

    const imageBlock = imageUrl
      ? `<div style="text-align:center;margin:16px 0"><img src="${imageUrl}" alt="Part reference" style="max-height:160px;border-radius:8px;border:1px solid #e5e5e5" /></div>`
      : "";

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a1a;margin-bottom:4px">Purchase Order ${po.po_number}</h2>
        <p style="color:#666;font-size:14px">TCMG Procurement</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
        
        <p style="font-size:14px">Dear ${po.supplier || "Supplier"},</p>
        <p style="font-size:14px">Please find below the details of Purchase Order <strong>${po.po_number}</strong>. The full Purchase Order PDF with tracking QR code is attached.</p>
        
        ${imageBlock}
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
          <tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9;width:140px">PO Number</td><td style="padding:8px;border:1px solid #e5e5e5;font-family:monospace">${po.po_number}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Description</td><td style="padding:8px;border:1px solid #e5e5e5">${po.description || "—"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Total Value</td><td style="padding:8px;border:1px solid #e5e5e5">$${Number(po.total_value || 0).toFixed(2)}</td></tr>
          ${po.eta ? `<tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Expected Delivery</td><td style="padding:8px;border:1px solid #e5e5e5">${po.eta}</td></tr>` : ""}
          ${po.freight_company ? `<tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Freight</td><td style="padding:8px;border:1px solid #e5e5e5">${po.freight_company}</td></tr>` : ""}
        </table>
        
        ${(lines || []).length > 0 ? `
          <h3 style="font-size:14px;margin-bottom:8px">Line Items</h3>
          <table style="width:100%;border-collapse:collapse;margin:8px 0">
            <tr style="background:#f9f9f9">
              <th style="padding:6px 8px;border:1px solid #e5e5e5;font-size:12px;text-align:center">#</th>
              <th style="padding:6px 8px;border:1px solid #e5e5e5;font-size:12px;text-align:left">Description</th>
              <th style="padding:6px 8px;border:1px solid #e5e5e5;font-size:12px;text-align:left">Part #</th>
              <th style="padding:6px 8px;border:1px solid #e5e5e5;font-size:12px;text-align:center">Qty</th>
              <th style="padding:6px 8px;border:1px solid #e5e5e5;font-size:12px;text-align:right">Unit Price</th>
            </tr>
            ${linesHtml}
          </table>
        ` : ""}
        
        ${po.comments ? `<p style="font-size:14px"><strong>Notes:</strong> ${po.comments}</p>` : ""}
        
        <p style="font-size:14px">Please confirm receipt of this Purchase Order and provide your estimated delivery date:</p>
        
        <div style="text-align:center;margin:24px 0">
          <a href="${confirmLink}" style="display:inline-block;background:#D97706;color:#fff;text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:bold;font-size:14px">Confirm Order</a>
        </div>
        
        <p style="font-size:13px;color:#888">If the button doesn't work, copy and paste this link:<br/><a href="${confirmLink}" style="color:#D97706;word-break:break-all">${confirmLink}</a></p>
        
        <div style="background:#f5f5f5;border-radius:6px;padding:12px;margin:16px 0;text-align:center">
          <p style="font-size:12px;color:#888;margin:0 0 4px 0">📦 Shipment Tracking Link</p>
          <a href="${trackingLink}" style="font-size:12px;color:#D97706;word-break:break-all">${trackingLink}</a>
        </div>
        
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0" />
        <p style="font-size:12px;color:#999">Kind regards,<br/>TCMG Procurement</p>
      </div>
    `;

    let emailSent = false;

    if (RESEND_API_KEY && email) {
      const emailPayload: any = {
        from: "TCMG Procurement <admin@send.minesite.ai>",
        to: [email],
        subject: `Purchase Order ${po.po_number}`,
        html: htmlBody,
      };

      // Attach PDF if generated
      if (pdfBase64) {
        emailPayload.attachments = [
          {
            content: pdfBase64,
            filename: `${po.po_number}.pdf`,
            type: "application/pdf",
          },
        ];
      }

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error("Resend error:", resendData);
      } else {
        emailSent = true;
        console.log("PO email sent via Resend with PDF:", resendData.id);
      }
    } else {
      console.log("=== MOCK EMAIL: Purchase Order ===");
      console.log(`To: ${email}`);
      console.log(`Subject: Purchase Order ${po.po_number}`);
      console.log(`PDF attached: ${!!pdfBase64}`);
      console.log("=== END MOCK EMAIL ===");
    }

    // Update PO status to Issued
    await supabase
      .from("po_tracker")
      .update({ status: "Issued" })
      .eq("id", po_id);

    return new Response(JSON.stringify({
      success: true,
      po_number: po.po_number,
      confirmation_token: confirmToken,
      email_sent: emailSent,
      pdf_attached: !!pdfBase64,
      message: emailSent
        ? `PO email sent to ${email} with PDF attached`
        : "PO processed. Email logged to console.",
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-purchase-order error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
