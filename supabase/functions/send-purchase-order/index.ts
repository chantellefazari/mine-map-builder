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

    const confirmToken = po.confirmation_token;
    const email = supplier_email || "";

    // --- MOCK EMAIL ---
    console.log("=== MOCK EMAIL: Purchase Order ===");
    console.log(`To: ${email}`);
    console.log(`Subject: Purchase Order ${po.po_number}`);
    console.log(`Body:`);
    console.log(`Dear ${po.supplier || "Supplier"},`);
    console.log(`Please find attached Purchase Order ${po.po_number}.`);
    console.log(`Description: ${po.description}`);
    console.log(`Total Value: $${po.total_value}`);
    console.log(`Items: ${(lines || []).length} line items`);
    (lines || []).forEach((l: any, i: number) => {
      console.log(`  ${i + 1}. ${l.part_description} — Qty: ${l.quantity_ordered} @ $${l.unit_price}`);
    });
    console.log(`Please confirm receipt using the confirmation link below:`);
    console.log(`  [Supplier portal link: /supplier-portal?mode=confirm&token=${confirmToken}]`);
    console.log("=== END MOCK EMAIL ===");

    // Update PO status to Issued
    await supabase
      .from("po_tracker")
      .update({ status: "Issued" })
      .eq("id", po_id);

    return new Response(JSON.stringify({
      success: true,
      po_number: po.po_number,
      confirmation_token: confirmToken,
      message: "PO sent (mock). Email logged to console.",
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
