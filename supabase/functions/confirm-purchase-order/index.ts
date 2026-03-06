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

    // GET — return PO details for confirmation page
    if (req.method === "GET") {
      const url = new URL(req.url);
      const token = url.searchParams.get("token");
      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: po, error } = await supabase
        .from("po_tracker")
        .select("id, po_number, supplier, description, total_value, status, supplier_confirmed, eta")
        .eq("confirmation_token", token)
        .single();

      if (error || !po) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: lines } = await supabase
        .from("po_tracker_lines")
        .select("part_description, part_number, quantity_ordered, unit_price")
        .eq("po_tracker_id", po.id);

      return new Response(JSON.stringify({ ...po, lines: lines || [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST — supplier confirms PO receipt + provides ETA
    const { token, estimated_delivery_date, supplier_eta_update } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Token required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: po, error: poErr } = await supabase
      .from("po_tracker")
      .select("id, supplier_confirmed")
      .eq("confirmation_token", token)
      .single();

    if (poErr || !po) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const updates: any = {
      supplier_confirmed: true,
      supplier_confirmed_at: new Date().toISOString(),
      status: "In Transit",
    };

    if (estimated_delivery_date) updates.eta = estimated_delivery_date;
    if (supplier_eta_update) updates.supplier_eta_update = supplier_eta_update;

    const { error: updateErr } = await supabase
      .from("po_tracker")
      .update(updates)
      .eq("id", po.id);

    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({
      success: true,
      message: "Purchase order confirmed. Thank you!",
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("confirm-purchase-order error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
