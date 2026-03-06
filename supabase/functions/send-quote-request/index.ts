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

    // Build the public quote submission URL
    const baseUrl = Deno.env.get("SUPABASE_URL")!.replace("/rest/v1", "").replace("https://", "");
    const projectId = baseUrl.split(".")[0];
    // The portal URL will be on the frontend app
    const portalUrl = `https://${projectId}.supabase.co/functions/v1/submit-quote-response?token=${qr.token}`;

    // --- MOCK EMAIL (replace with Resend later) ---
    console.log("=== MOCK EMAIL: Request for Quote ===");
    console.log(`To: ${supplier_email}`);
    console.log(`Subject: Request for Quote — ${part_description}`);
    console.log(`Body:`);
    console.log(`Dear ${supplier_name || "Supplier"},`);
    console.log(``);
    console.log(`We are requesting a quotation for the following part:`);
    console.log(`  Part: ${part_description}`);
    console.log(`  Part Number: ${part_number || "N/A"}`);
    console.log(`  Quantity: ${quantity || 1}`);
    console.log(`  Specifications: ${specifications || "See attached"}`);
    if (image_url) console.log(`  Image: ${image_url}`);
    if (notes) console.log(`  Notes: ${notes}`);
    console.log(``);
    console.log(`Please submit your quote using this link:`);
    console.log(`  [This will be the frontend portal URL with token: ${qr.token}]`);
    console.log("=== END MOCK EMAIL ===");

    return new Response(JSON.stringify({
      success: true,
      quote_request_id: qr.id,
      token: qr.token,
      message: "Quote request created. Email mock logged to console (Resend integration pending).",
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
