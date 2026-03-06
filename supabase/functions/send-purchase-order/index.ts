import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const confirmLink = `https://mine-map-builder.lovable.app/supplier-portal?mode=confirm&token=${confirmToken}`;
    const trackingLink = `https://mine-map-builder.lovable.app/track-shipment?po=${po.id}`;

    // Build line items HTML
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
        <p style="font-size:14px">Please find below the details of Purchase Order <strong>${po.po_number}</strong>.</p>
        
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
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TCMG Procurement <onboarding@resend.dev>",
          to: [email],
          subject: `Purchase Order ${po.po_number}`,
          html: htmlBody,
        }),
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error("Resend error:", resendData);
      } else {
        emailSent = true;
        console.log("PO email sent via Resend:", resendData.id);
      }
    } else {
      console.log("=== MOCK EMAIL: Purchase Order ===");
      console.log(`To: ${email}`);
      console.log(`Subject: Purchase Order ${po.po_number}`);
      console.log(`Dear ${po.supplier || "Supplier"},`);
      console.log(`Description: ${po.description}`);
      console.log(`Total Value: $${po.total_value}`);
      console.log(`Items: ${(lines || []).length} line items`);
      (lines || []).forEach((l: any, i: number) => {
        console.log(`  ${i + 1}. ${l.part_description} — Qty: ${l.quantity_ordered} @ $${l.unit_price}`);
      });
      console.log(`Confirm link: ${confirmLink}`);
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
      message: emailSent
        ? `PO email sent to ${email}`
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
