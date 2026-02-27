import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all PM master list records
  const { data: pmMasterList, error: pmError } = await supabase
    .from("pm_master_list")
    .select("*")
    .order("pm_name");

  if (pmError) {
    return new Response(JSON.stringify({ error: pmError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch all PM templates records
  const { data: pmTemplates, error: tplError } = await supabase
    .from("pm_templates")
    .select("*")
    .order("pm_title");

  if (tplError) {
    return new Response(JSON.stringify({ error: tplError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    totalPMsInMasterList: pmMasterList?.length ?? 0,
    totalPMTemplates: pmTemplates?.length ?? 0,
    pm_master_list: pmMasterList,
    pm_templates: pmTemplates,
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=pm-templates-complete-export.json",
    },
  });
});
