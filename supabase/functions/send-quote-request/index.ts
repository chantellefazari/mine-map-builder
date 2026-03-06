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

    const body = await req.json();
    const { spare_id, part_description, part_number, image_url, quantity, specifications, supplier_name, supplier_email, supplier_id, created_by, notes } = body;

    if (!supplier_email || !part_description) {
      return new Response(JSON.stringify({ error: "supplier_email and part_description are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create quote request record
    const { data: qr, error: qrErr } = await supabase
      .from("quote_requests")
      .insert({
        spare_id: spare_id || null,
        part_description,
        part_number: part_number || "",
        image_url: image_url || "",
        quantity: quantity || 1,
        specifications: specifications || "",
        supplier_name: supplier_name || "",
        supplier_email,
        supplier_id: supplier_id || null,
        created_by: created_by || "",
        notes: notes || "",
        status: "Sent",
      })
      .select("id, token")
      .single();

    if (qrErr) throw qrErr;

    // Build the supplier portal URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const projectRef = supabaseUrl.replace("https://", "").split(".")[0];
    const appUrl = `https://${projectRef}.supabase.co`;
    // Use the preview/published app URL pattern
    const portalLink = `https://parts.minesite.ai/supplier-portal?mode=quote&token=${qr.token}`;

    // Build HTML email
    const imageBlock = image_url
      ? `<div style="text-align:center;margin:16px 0"><img src="${image_url}" alt="Part image" style="max-height:180px;border-radius:8px;border:1px solid #e5e5e5" /></div>`
      : "";

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a1a;margin-bottom:4px">Request for Quote</h2>
        <p style="color:#666;font-size:14px">TCMG Procurement</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
        
        <p style="font-size:14px">Dear ${supplier_name || "Supplier"},</p>
        <p style="font-size:14px">We are requesting a quotation for the following part:</p>
        
        ${imageBlock}
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
          <tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9;width:140px">Part Description</td><td style="padding:8px;border:1px solid #e5e5e5">${part_description}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Part Number</td><td style="padding:8px;border:1px solid #e5e5e5">${part_number || "N/A"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Quantity</td><td style="padding:8px;border:1px solid #e5e5e5">${quantity || 1}</td></tr>
          ${specifications ? `<tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Specifications</td><td style="padding:8px;border:1px solid #e5e5e5">${specifications}</td></tr>` : ""}
          ${notes ? `<tr><td style="padding:8px;border:1px solid #e5e5e5;font-weight:bold;background:#f9f9f9">Notes</td><td style="padding:8px;border:1px solid #e5e5e5">${notes}</td></tr>` : ""}
        </table>
        
        <p style="font-size:14px">Please submit your quotation using the secure link below:</p>
        
        <div style="text-align:center;margin:24px 0">
          <a href="${portalLink}" style="display:inline-block;background:#D97706;color:#fff;text-decoration:none;padding:12px 32px;border-radius:6px;font-weight:bold;font-size:14px">Submit Quote</a>
        </div>
        
        <p style="font-size:13px;color:#888">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${portalLink}" style="color:#D97706;word-break:break-all">${portalLink}</a></p>
        
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0" />
        <p style="font-size:12px;color:#999">Kind regards,<br/>TCMG Procurement</p>
      </div>
    `;

    let emailSent = false;

    if (RESEND_API_KEY) {
      // Send real email via Resend
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TCMG Procurement <admin@send.minesite.ai>",
          to: [supplier_email],
          subject: `Request for Quote — ${part_description}`,
          html: htmlBody,
        }),
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error("Resend error:", resendData);
        // Don't throw — record was created, just log the email failure
      } else {
        emailSent = true;
        console.log("Email sent via Resend:", resendData.id);
      }
    } else {
      // Fallback: mock email
      console.log("=== MOCK EMAIL: Request for Quote ===");
      console.log(`To: ${supplier_email}`);
      console.log(`Subject: Request for Quote — ${part_description}`);
      console.log(`Part: ${part_description}, Qty: ${quantity || 1}`);
      console.log(`Portal link: ${portalLink}`);
      console.log("=== END MOCK EMAIL ===");
    }

    return new Response(JSON.stringify({
      success: true,
      quote_request_id: qr.id,
      token: qr.token,
      email_sent: emailSent,
      message: emailSent
        ? `Quote request sent to ${supplier_email}`
        : "Quote request created. Email delivery pending (check Resend config).",
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-quote-request error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
