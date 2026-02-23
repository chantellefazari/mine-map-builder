import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { description, asset_number, asset_components } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch site spares catalogue for matching
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const { data: spares } = await sb
      .from("site_spares")
      .select("part_number, description, bin_location, category")
      .limit(2000);

    const sparesContext = (spares || [])
      .map((s: any) => `${s.part_number || "—"} | ${s.description} | Bin: ${s.bin_location || "—"} | Cat: ${s.category || "—"}`)
      .join("\n");

    const systemPrompt = `You are a maintenance parts advisor for Tennant Creek Gold Mine.
Given a work order description, asset info, and the FULL site spares catalogue, suggest parts needed.

CRITICAL RULES:
1. You MUST match parts from the site spares catalogue below. Use the EXACT part_number and description from the catalogue.
2. If a catalogue part matches what's needed, use its real part_number (e.g. "1001001", "1009003").
3. Only use "TBA" for part_number if absolutely nothing in the catalogue matches.
4. Include the bin_location from the catalogue when available.

SITE SPARES CATALOGUE:
${sparesContext}

Return a JSON array. Each object must have:
- part_number: string (EXACT part number from catalogue, or "TBA")
- description: string (EXACT description from catalogue, or a clear description)
- quantity: number
- bin_location: string (from catalogue, or "")
- reasoning: string (one sentence)

Return ONLY the JSON array.`;

    const userPrompt = `Work Order Description: ${description || "Not provided"}
Asset Number: ${asset_number || "Not provided"}
Known Components on this asset:
${asset_components && asset_components.length > 0
  ? asset_components.map((c: any) => `- ${c.componentCode}: ${c.componentName} (${c.componentType}, Mfr: ${c.manufacturer})`).join("\n")
  : "No components loaded for this asset"}

Suggest parts from the site spares catalogue needed for this work.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Top up in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    let parts;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      parts = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse AI response:", content);
      parts = [];
    }

    return new Response(JSON.stringify({ parts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("suggest-wo-parts error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
