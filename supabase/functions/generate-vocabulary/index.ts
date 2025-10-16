import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { level = "beginner", count = 10 } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Check if vocabulary was already generated today
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from("generated_lessons")
      .select("*")
      .eq("lesson_type", "vocabulary")
      .eq("generation_date", today)
      .eq("level", level)
      .maybeSingle();

    if (existing && existing.count >= count) {
      return new Response(JSON.stringify({ message: "Vocabulary already generated today" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
            role: "system",
            content: `You are an expert English teacher for Telugu speakers. Generate ${count} useful English vocabulary words for ${level} level learners.
            
Each word should include:
- english: The English word
- telugu: Telugu translation
- pronunciation: Simple pronunciation guide
- part_of_speech: noun/verb/adjective/adverb
- level: ${level}
- examples: Array of 2-3 example sentences in English

Return ONLY a valid JSON array. No other text.`
          },
          {
            role: "user",
            content: `Generate ${count} diverse vocabulary words covering everyday topics: food, family, work, emotions, time, travel, health, weather, activities.`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate vocabulary");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    const words = JSON.parse(content);

    const { error: insertError } = await supabase
      .from("vocabulary")
      .insert(words);

    if (insertError) throw insertError;

    await supabase.from("generated_lessons").upsert({
      lesson_type: "vocabulary",
      generation_date: today,
      level,
      count: words.length
    }, {
      onConflict: 'lesson_type,generation_date,level'
    });

    return new Response(JSON.stringify({ words, count: words.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});