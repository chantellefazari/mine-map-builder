import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio_base64 } = await req.json();
    if (!audio_base64) {
      return new Response(JSON.stringify({ error: "No audio provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Step 1: Transcribe using Gemini (accepts audio)
    const transcribeResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a plant maintenance intelligence assistant. The user has recorded a voice note about a plant rule, dependency, interaction, safety constraint, or lesson learned at a gold mine processing plant.

Transcribe the audio and then extract a structured rule from it.

Return ONLY valid JSON in this exact format:
{
  "transcript": "the full transcription of what was said",
  "suggested_rule": {
    "title": "short descriptive title",
    "area": "plant area mentioned",
    "asset": "primary asset or system mentioned",
    "related_asset": "related/dependent asset if mentioned",
    "rule_type": "one of: Dependency, Interaction, Access Constraint, Isolation Rule, Safety Constraint, Sequence Rule, Shutdown Logic, Operational Note, Lessons Learned, Area Specific Rule, Asset Specific Rule",
    "impact_level": "one of: Low, Medium, High, Critical",
    "if_condition": "the IF part of the logic",
    "then_action": "the THEN part of the logic",
    "because_reason": "the BECAUSE part of the logic",
    "description": "any additional context",
    "requires_isolation": false,
    "requires_permit": false,
    "requires_shutdown": false,
    "requires_scaffold": false,
    "requires_crane": false
  }
}`,
              },
              {
                type: "input_audio",
                input_audio: {
                  data: audio_base64,
                  format: "webm",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!transcribeResponse.ok) {
      const errText = await transcribeResponse.text();
      throw new Error(`AI API error [${transcribeResponse.status}]: ${errText}`);
    }

    const aiResult = await transcribeResponse.json();
    const content = aiResult.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({
        transcript: content,
        suggested_rule: { title: "", rule_type: "Operational Note", impact_level: "Medium" },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("transcribe-plant-rule error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
