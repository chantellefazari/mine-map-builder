import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

const ALLOWED_TABLES = [
  "site_spares",
  "visual_parts_catalogue",
  "suppliers",
  "supplier_catalogue",
  "normalized_components",
  "po_line_items",
  "po_uploads",
  "pm_master_list",
  "pm_templates",
  "pm_asset_link_staging",
  "po_tracker",
  "po_tracker_lines",
  "processing_plant_assets_rev_b",
  "rev_b_pid_extraction_register",
  "processing_functional_locations",
  "processing_naming_conventions",
  "work_orders",
  "work_order_parts",
  "work_order_parts_audit",
  "audit_log",
  "site_config",
  "purchase_requests",
  "purchase_request_lines",
  "quote_requests",
  "quote_responses",
  "practice_suppliers",
  "notifications",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const url = new URL(req.url);
    const table = url.searchParams.get("table");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 1000);
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const select = url.searchParams.get("select") || "*";

    if (!table) {
      return new Response(
        JSON.stringify({ error: "Missing 'table' query parameter", allowed_tables: ALLOWED_TABLES }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!ALLOWED_TABLES.includes(table)) {
      return new Response(
        JSON.stringify({ error: `Table '${table}' is not allowed`, allowed_tables: ALLOWED_TABLES }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error, count } = await supabase
      .from(table)
      .select(select, { count: "exact" })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return new Response(
      JSON.stringify({ data, count, table, limit, offset }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
