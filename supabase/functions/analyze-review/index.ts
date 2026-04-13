import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewId, reviewText, rating, customerName, productId } = await req.json();

    if (!reviewId || !reviewText || !rating || !productId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a review analysis AI. Analyze the given product review and return a JSON object with:
1. "sentiment": one of "positive", "negative", or "neutral"
2. "emotions": array of detected emotions (e.g., "happy", "satisfied", "frustrated", "angry", "disappointed", "excited", "indifferent")
3. "aspects": array of objects with "name" (product aspect like "battery", "performance", "screen", "sound quality", "durability", etc.) and "sentiment" ("positive", "negative", or "neutral")
4. "is_fake": boolean - true if the review seems fake (generic praise, no specifics, suspicious patterns)
5. "fake_score": number 0-1 indicating confidence the review is fake (0 = definitely real, 1 = definitely fake)

Consider the rating (${rating}/5) along with the text. Respond ONLY with valid JSON, no markdown.`;

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
          { role: "user", content: `Review by "${customerName}" (Rating: ${rating}/5):\n"${reviewText}"` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    // Parse the AI response - strip markdown code blocks if present
    let analysis;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      analysis = {
        sentiment: rating >= 4 ? "positive" : rating <= 2 ? "negative" : "neutral",
        emotions: [],
        aspects: [],
        is_fake: false,
        fake_score: 0,
      };
    }

    // Update the review in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from("reviews")
      .update({
        sentiment: analysis.sentiment,
        emotions: analysis.emotions || [],
        aspects: analysis.aspects || [],
        is_fake: analysis.is_fake || false,
        fake_score: analysis.fake_score || 0,
      })
      .eq("id", reviewId);

    if (updateError) {
      console.error("DB update error:", updateError);
      throw new Error(`Failed to update review: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-review error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
