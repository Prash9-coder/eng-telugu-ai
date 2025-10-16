import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { level = "beginner", count = 10 } = await req.json();

    // Get user profile to understand their level
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("level")
      .eq("user_id", user.id)
      .single();

    const userLevel = profile?.level || level;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Generate lessons using AI
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
            content: `You are an expert English teacher for Telugu speakers. Generate ${count} comprehensive English lessons for ${userLevel} level learners.
            
Each lesson should include:
- title: Clear, engaging lesson title
- titleTelugu: Telugu translation
- description: Brief description
- level: ${userLevel}
- duration_minutes: Estimated time (10-30 minutes)
- vocabulary: Array of 5-8 words with { english, telugu, pronunciation, example, exampleTelugu }
- grammar_tip: One key grammar concept with English and Telugu explanations

Return ONLY a valid JSON array of lesson objects. No other text.`
          },
          {
            role: "user",
            content: `Generate ${count} lessons for ${userLevel} level covering topics like greetings, daily activities, food, travel, work, emotions, health, shopping, time, and family.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate lessons");
    }

    const aiData = await response.json();
    const generatedContent = aiData.choices?.[0]?.message?.content;
    
    let lessons;
    try {
      lessons = JSON.parse(generatedContent);
    } catch {
      throw new Error("Failed to parse AI response");
    }

    // Save lessons to database
    const lessonsToInsert = lessons.map((lesson: any, index: number) => ({
      user_id: user.id,
      title: lesson.title,
      description: lesson.description,
      level: userLevel,
      duration_minutes: lesson.duration_minutes || 15,
      order_index: index,
      content: {
        titleTelugu: lesson.titleTelugu,
        vocabulary: lesson.vocabulary,
        grammar_tip: lesson.grammar_tip
      },
      completed: false
    }));

    const { data: insertedLessons, error: insertError } = await supabase
      .from("lessons")
      .insert(lessonsToInsert)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    // Track generation
    await supabase.from("generated_lessons").upsert({
      lesson_type: "lesson",
      generation_date: new Date().toISOString().split('T')[0],
      level: userLevel,
      count: lessons.length
    }, {
      onConflict: 'lesson_type,generation_date,level'
    });

    return new Response(JSON.stringify({ lessons: insertedLessons }), {
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