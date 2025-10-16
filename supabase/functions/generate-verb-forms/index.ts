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

    const { level = "beginner", count = 20 } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from("generated_lessons")
      .select("*")
      .eq("lesson_type", "verb_forms")
      .eq("generation_date", today)
      .eq("level", level)
      .maybeSingle();

    if (existing && existing.count >= count) {
      return new Response(JSON.stringify({ message: "Verb forms already generated today" }), {
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
            content: `You are an expert English teacher for Telugu speakers. Generate ${count} common English verbs with all their tense forms for ${level} level learners.
            
Each verb should include:
- base_form: Base verb (e.g., "eat")
- base_form_telugu: Telugu translation
- present_simple: "I/You/We/They eat, He/She/It eats"
- present_continuous: "I am eating, He/She/It is eating, We/You/They are eating"
- past_simple: "ate"
- past_continuous: "was/were eating"
- future_simple: "will eat"
- present_perfect: "have/has eaten"
- level: ${level}
- category: daily_activity/communication/movement/emotion/etc
- example_sentence: One clear example sentence
- example_sentence_telugu: Telugu translation of example

Return ONLY a valid JSON array. No other text.`
          },
          {
            role: "user",
            content: `Generate ${count} essential verbs covering: daily activities, communication, movement, emotions, learning, eating, working.`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate verb forms");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    const verbs = JSON.parse(content);

    const verbsWithDate = verbs.map((v: any) => ({ ...v, date: today }));

    const { error: insertError } = await supabase
      .from("verb_forms")
      .insert(verbsWithDate);

    if (insertError) throw insertError;

    await supabase.from("generated_lessons").upsert({
      lesson_type: "verb_forms",
      generation_date: today,
      level,
      count: verbs.length
    }, {
      onConflict: 'lesson_type,generation_date,level'
    });

    return new Response(JSON.stringify({ verbs, count: verbs.length }), {
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