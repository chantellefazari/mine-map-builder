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

    // Handle GET — return quote request details for the portal page
    if (req.method === "GET") {
      const url = new URL(req.url);
      const token = url.searchParams.get("token");
      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: qr, error } = await supabase
        .from("quote_requests")
        .select("id, part_description, part_number, image_url, quantity, specifications, notes, supplier_name, status, expires_at")
        .eq("token", token)
        .single();

      if (error || !qr) {
        return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check expiry
      if (qr.expires_at && new Date(qr.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "This quote request has expired", expired: true }), {
          status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already responded
      const { data: existing } = await supabase
        .from("quote_responses")
        .select("id")
        .eq("quote_request_id", qr.id)
        .limit(1);

      return new Response(JSON.stringify({ ...qr, already_responded: (existing?.length ?? 0) > 0 }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle POST — submit quote response
    const body = await req.json();
    const { token, unit_price, total_price, lead_time_days, validity_days, currency, supplier_reference, notes } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: "Token required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up the quote request
    const { data: qr, error: qrErr } = await supabase
      .from("quote_requests")
      .select("id, status, expires_at")
      .eq("token", token)
      .single();

    if (qrErr || !qr) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (qr.expires_at && new Date(qr.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "This quote request has expired" }), {
        status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert response
    const { data: resp, error: respErr } = await supabase
      .from("quote_responses")
      .insert({
        quote_request_id: qr.id,
        unit_price: unit_price || 0,
        total_price: total_price || 0,
        lead_time_days: lead_time_days || 0,
        validity_days: validity_days || 30,
        currency: currency || "AUD",
        supplier_reference: supplier_reference || "",
        notes: notes || "",
      })
      .select("id")
      .single();

    if (respErr) throw respErr;

    // Update quote request status
    await supabase
      .from("quote_requests")
      .update({ status: "Quoted" })
      .eq("id", qr.id);

    return new Response(JSON.stringify({
      success: true,
      response_id: resp.id,
      message: "Quote submitted successfully. Thank you!",
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-quote-response error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
