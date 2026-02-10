 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     if (!LOVABLE_API_KEY) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     const { partName, partId } = await req.json();
 
     if (!partName || !partId) {
       return new Response(
         JSON.stringify({ error: "Missing partName or partId" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
      // Mining-specific image generation prompt - kept terse to maximise image output
      const prompt = `Product photo, white background, centered, sharp focus, no text: ${partName}. Industrial/mining part, OEM catalogue style.`;

      console.log(`Generating image for part: ${partName}`);

      const MAX_ATTEMPTS = 2;
      let imageData: string | undefined;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            console.warn("AI gateway rate limited (429)");
            return new Response(
              JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (response.status === 402) {
            console.warn("AI gateway credits exhausted (402)");
            return new Response(
              JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          const errorText = await response.text();
          console.error("AI gateway error:", response.status, errorText);
          return new Response(
            JSON.stringify({ error: "Failed to generate image" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const data = await response.json();
        imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageData) break;

        console.warn(`Attempt ${attempt}/${MAX_ATTEMPTS}: No image in response, ${attempt < MAX_ATTEMPTS ? "retrying..." : "giving up."}`);
        if (attempt < MAX_ATTEMPTS) {
          // Small delay before retry
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      if (!imageData) {
        return new Response(
          JSON.stringify({ error: "No image was generated after retries. Try a different description." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
 
     // Extract base64 data and convert to binary
     const base64Match = imageData.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
     if (!base64Match) {
       console.error("Invalid image data format");
       return new Response(
         JSON.stringify({ error: "Invalid image format received" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const imageType = base64Match[1];
     const base64Data = base64Match[2];
 
     // Decode base64 to Uint8Array
     const binaryString = atob(base64Data);
     const bytes = new Uint8Array(binaryString.length);
     for (let i = 0; i < binaryString.length; i++) {
       bytes[i] = binaryString.charCodeAt(i);
     }
 
     // Upload to Supabase storage
     const supabaseUrl = Deno.env.get("SUPABASE_URL");
     const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 
     if (!supabaseUrl || !supabaseKey) {
       throw new Error("Supabase configuration missing");
     }
 
     const supabase = createClient(supabaseUrl, supabaseKey);
 
     const fileName = `${partId}/ai-${Date.now()}.${imageType}`;
 
     const { error: uploadError } = await supabase.storage
       .from("visual-parts-images")
       .upload(fileName, bytes, {
         contentType: `image/${imageType}`,
         upsert: false,
       });
 
     if (uploadError) {
       console.error("Storage upload error:", uploadError);
       return new Response(
         JSON.stringify({ error: "Failed to save generated image" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const { data: urlData } = supabase.storage
       .from("visual-parts-images")
       .getPublicUrl(fileName);
 
     console.log(`Image generated and saved: ${urlData.publicUrl}`);
 
     return new Response(
       JSON.stringify({ 
         success: true, 
         imageUrl: urlData.publicUrl 
       }),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error: unknown) {
     console.error("generate-part-image error:", error);
     const errorMessage = error instanceof Error ? error.message : "Unknown error";
     return new Response(
       JSON.stringify({ error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });