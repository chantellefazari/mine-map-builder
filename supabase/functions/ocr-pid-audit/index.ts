import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { imageUrl, pageNumber, drawingNumber } = await req.json();
    if (!imageUrl) throw new Error("imageUrl is required");

    const prompt = `You are an expert P&ID (Piping & Instrumentation Diagram) reader. Carefully examine this engineering drawing and extract EVERY equipment tag visible.

For each piece of equipment you can identify, provide:
- tag_id: The P&ID tag exactly as written (e.g., "05-PU-003", "04-CV-011", "08-TK-001")
- description: The equipment name/description shown on the drawing
- tag_type: The type (Pump, Valve, Tank, Conveyor, Screen, Agitator, Instrument, Motor, Line/Pipe, Chute, Hopper, etc.)

CRITICAL RULES:
- Read EVERY character carefully - distinguish between 0 and O, 1 and I, 3 and 8
- Include ALL equipment - pumps, tanks, conveyors, screens, agitators, valves, instruments, lines/pipes, chutes, hoppers
- For piping/lines, capture the full line designation (e.g., "007-SU-HD1-90-PN10")
- For instruments, capture the ISA code (e.g., "YA PU004", "HS PU004", "LT-001")
- Do NOT guess or infer - only report what is clearly readable
- If a tag is partially obscured, note it as uncertain

Return a JSON array of objects with fields: tag_id, description, tag_type, confidence (High/Medium/Low)
Return ONLY the JSON array, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse JSON from response (may be wrapped in markdown code block)
    let extracted;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      extracted = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      extracted = [];
    }

    return new Response(
      JSON.stringify({
        pageNumber,
        drawingNumber,
        extractedTags: extracted,
        rawResponse: content,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
