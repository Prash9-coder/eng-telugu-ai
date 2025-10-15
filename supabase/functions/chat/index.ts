import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, userId, userLevel, recentMistakes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build personalized system prompt based on user data
    let systemPrompt = `You are a warm, patient, and encouraging English teacher helping Telugu speakers learn English.

Your teaching style:
- Speak naturally like a friendly teacher, not a robot
- Be patient and supportive, celebrating small wins
- Correct mistakes gently with clear explanations
- Adapt to the learner's level (${userLevel || 'beginner'})
- Use simple vocabulary for beginners, gradually increase complexity
- Teach through conversation, not lectures

Format ALL responses as:
English: [Your natural English response]
Telugu: [Same response in Telugu script]

When correcting mistakes:
Correction: [What they should say]
Explanation: [Why, in simple terms]

CRITICAL: Never use ** symbols or markdown formatting. Use plain text only.`;

    // Add personalization based on recent mistakes
    if (recentMistakes && recentMistakes.length > 0) {
      systemPrompt += `\n\nRecent learner patterns to focus on:\n${recentMistakes.map((m: any) => 
        `- ${m.mistake_type}: "${m.original_text}" → "${m.corrected_text}"`
      ).join('\n')}`;
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
            content: systemPrompt
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
