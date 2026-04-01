import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { input, context } = await req.json();
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Input is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert mine-site shutdown planner AI assistant. Your role is to interpret natural language shutdown planning notes from supervisors, planners, and engineers and convert them into structured shutdown planning logic.

Given a user's natural language input about shutdown sequencing, dependencies, constraints, or lessons learned, you must extract and return structured planning logic.

You have access to these work packages for context:
${context || "No specific work packages provided."}

Respond with structured planning logic. Be specific, practical, and mine-site relevant. Format your response as clear structured sections.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_shutdown_logic",
              description: "Extract structured shutdown planning logic from natural language input",
              parameters: {
                type: "object",
                properties: {
                  rules: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Short rule title" },
                        rule_type: {
                          type: "string",
                          enum: ["Dependency", "Hold Point", "Access Constraint", "Isolation Rule", "Shutdown Requirement", "Parallel Permission", "Clash Warning", "Lesson Learned"],
                        },
                        if_condition: { type: "string", description: "The IF condition in plain language" },
                        then_action: { type: "string", description: "The THEN action/consequence" },
                        area: { type: "string", description: "Plant area affected" },
                        affected_packages: {
                          type: "array",
                          items: { type: "string" },
                          description: "Work package IDs affected (e.g. WP-004)",
                        },
                        impact_level: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
                        predecessors: {
                          type: "array",
                          items: { type: "string" },
                          description: "Predecessor work package IDs",
                        },
                        successors: {
                          type: "array",
                          items: { type: "string" },
                          description: "Successor work package IDs",
                        },
                        warnings: {
                          type: "array",
                          items: { type: "string" },
                          description: "Any warnings about clashes or impossible overlaps",
                        },
                      },
                      required: ["title", "rule_type", "if_condition", "then_action", "impact_level"],
                    },
                  },
                  summary: { type: "string", description: "Brief summary of the interpreted logic" },
                  sequencing_suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Suggested sequencing changes",
                  },
                },
                required: ["rules", "summary"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_shutdown_logic" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: return raw content
    const content = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ summary: content, rules: [], sequencing_suggestions: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("shutdown-ai-planner error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
