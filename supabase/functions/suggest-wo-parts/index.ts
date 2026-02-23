import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const systemPrompt = `You are a maintenance parts advisor for a gold mine (Tennant Creek Gold Mine).
Given a work order description, asset number, and the asset's known components, suggest the most likely parts/materials needed to complete the work.

Return a JSON array of suggested parts. Each part object must have:
- part_number: string (component code if known, or "TBA")
- description: string (clear part description)
- quantity: number (estimated qty needed)
- reasoning: string (one sentence why this part is needed)

Only suggest parts that are directly relevant to the described work. Be specific to mining/processing equipment.
Return ONLY the JSON array, no other text.`;

    const userPrompt = `Work Order Description: ${description || "Not provided"}
Asset Number: ${asset_number || "Not provided"}
Known Components on this asset:
${asset_components && asset_components.length > 0
  ? asset_components.map((c: any) => `- ${c.componentCode}: ${c.componentName} (${c.componentType}, Mfr: ${c.manufacturer})`).join("\n")
  : "No components loaded for this asset"}

Suggest the parts/materials needed for this work order.`;

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

    // Extract JSON array from response
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
