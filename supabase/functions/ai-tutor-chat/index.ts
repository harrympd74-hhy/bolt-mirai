import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

const SYSTEM_PROMPT =
  "Kamu adalah MIRAI Tutor, asisten belajar AI untuk siswa SMP kelas 7 di Indonesia. " +
  "Jawab pertanyaan dalam Bahasa Indonesia yang mudah dipahami. " +
  "Bantu siswa memahami materi pelajaran, berikan penjelasan yang jelas dan contoh sederhana. " +
  "Jangan memberikan jawaban langsung untuk tugas sekolah, tapi bimbing siswa untuk menemukan jawabannya. " +
  "Jika pertanyaan di luar konteks pendidikan, arahkan kembali ke topik belajar.";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the active AI provider config from the database
    const { data: provider, error: providerError } = await supabase
      .from("ai_providers")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    if (providerError || !provider) {
      return new Response(
        JSON.stringify({ error: "Belum ada provider AI yang aktif. Mintalah admin untuk mengatur API Key di halaman AI Connector." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if API key is configured
    if (!provider.api_key || provider.api_key.trim() === "") {
      return new Response(
        JSON.stringify({ error: "API Key belum diatur. Mintalah admin untuk mengisi API Key di halaman AI Connector." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiry
    if (provider.expires_at) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(provider.expires_at) < today) {
        return new Response(
          JSON.stringify({ error: "Masa aktif provider AI sudah berakhir. Mintalah admin untuk memperpanjang API Key." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const body: RequestBody = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Pesan tidak boleh kosong." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepend system prompt
    const fullMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    let aiResponse: string;

    if (provider.provider === "claude") {
      aiResponse = await callClaude(provider, fullMessages);
    } else if (provider.provider === "gpt") {
      aiResponse = await callOpenAI(provider, fullMessages);
    } else if (provider.provider === "gemini") {
      aiResponse = await callGemini(provider, fullMessages);
    } else {
      return new Response(
        JSON.stringify({ error: "Provider AI tidak dikenali." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ reply: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ============================================================
// Provider: Anthropic Claude
// ============================================================
async function callClaude(
  provider: { api_key: string; model: string; temperature: number; max_tokens: number; top_p: number },
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": provider.api_key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: provider.model || "claude-3-5-sonnet-20241022",
      max_tokens: provider.max_tokens || 2048,
      temperature: provider.temperature || 0.7,
      top_p: provider.top_p || 0.9,
      messages: messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content })),
      system: messages.find((m) => m.role === "system")?.content || "",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "Maaf, saya tidak dapat memberikan respons saat ini.";
}

// ============================================================
// Provider: OpenAI GPT
// ============================================================
async function callOpenAI(
  provider: { api_key: string; model: string; temperature: number; max_tokens: number; top_p: number },
  messages: ChatMessage[]
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.api_key}`,
    },
    body: JSON.stringify({
      model: provider.model || "gpt-4o-mini",
      max_tokens: provider.max_tokens || 2048,
      temperature: provider.temperature || 0.7,
      top_p: provider.top_p || 0.9,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Maaf, saya tidak dapat memberikan respons saat ini.";
}

// ============================================================
// Provider: Google Gemini
// ============================================================
async function callGemini(
  provider: { api_key: string; model: string; temperature: number; max_tokens: number; top_p: number },
  messages: ChatMessage[]
): Promise<string> {
  const model = provider.model || "gemini-3.5-flash-lite";
  const systemContent = messages.find((m) => m.role === "system")?.content || "";
  const chatMessages = messages.filter((m) => m.role !== "system");

  const contents = chatMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${provider.api_key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: systemContent ? { parts: [{ text: systemContent }] } : undefined,
        generationConfig: {
          temperature: provider.temperature || 0.7,
          maxOutputTokens: provider.max_tokens || 2048,
          topP: provider.top_p || 0.9,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Maaf, saya tidak dapat memberikan respons saat ini."
  );
}
