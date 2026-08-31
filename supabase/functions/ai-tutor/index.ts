const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ChatMessage = { role: "user" | "model"; content: string };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: { message: "API Gemini belum dikonfigurasi oleh administrator." } }, 503);

    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages as ChatMessage[] : [];
    const model = typeof body.model === "string" ? body.model : "gemini-1.5-flash";
    const temperature = typeof body.temperature === "number" ? body.temperature : 0.7;
    const maxTokens = typeof body.maxTokens === "number" ? body.maxTokens : 1024;
    const topP = typeof body.topP === "number" ? body.topP : 0.9;

    if (!messages.length) return json({ error: { message: "Pesan belum tersedia." } }, 400);

    const contents = messages.map((message) => ({
      role: message.role === "model" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Kamu adalah AI Tutor MIRAI untuk siswa SMP kelas 7. Jawab dalam Bahasa Indonesia yang ramah, singkat, bertahap, dan mendorong siswa berpikir sendiri. Fokus pada materi Sudut dan Garis-Garis Sejajar. Jangan memberikan data pribadi atau informasi sensitif." }] },
        contents,
        generationConfig: { temperature, maxOutputTokens: maxTokens, topP },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Gemini request failed", response.status, result);
      return json({ error: { message: result.error?.message || "Koneksi ke Gemini gagal." } }, response.status);
    }

    const text = result.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
    if (!text) return json({ error: { message: "Gemini tidak mengembalikan jawaban." } }, 502);
    return json({ text, model });
  } catch (error) {
    console.error("AI Tutor error", error);
    return json({ error: { message: "Terjadi gangguan saat menghubungkan AI Tutor." } }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
