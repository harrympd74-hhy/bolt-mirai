import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const masterKey = Deno.env.get("MIRAI_CREDENTIAL_VAULT_KEY") || "";
const adminClient = createClient(supabaseUrl, serviceKey);

type AccountType = "student" | "parent" | "teacher" | "guest";
type Payload = { action: "list" | "reveal" | "upsert" | "delete"; id?: string; accountType?: AccountType; subjectKey?: string; displayName?: string; username?: string; password?: string; metadata?: Record<string, unknown> };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token || !masterKey) return json({ error: "Layanan vault belum siap." }, 503);
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || userData.user?.app_metadata?.role !== "admin") return json({ error: "Akses hanya untuk admin MIRAI." }, 403);
    const body = await request.json() as Payload;

    if (body.action === "list") {
      const { data, error } = await adminClient.from("admin_credentials").select("id, account_type, subject_key, display_name, username, metadata, created_at, updated_at").order("display_name");
      if (error) return json({ error: error.message }, 400);
      return json({ credentials: data || [] });
    }

    if (body.action === "reveal") {
      if (!body.id) return json({ error: "ID kredensial wajib diisi." }, 400);
      const { data, error } = await adminClient.from("admin_credentials").select("encrypted_password, iv").eq("id", body.id).maybeSingle();
      if (error || !data) return json({ error: "Kredensial tidak ditemukan." }, 404);
      return json({ password: await decrypt(data.encrypted_password, data.iv) });
    }

    if (body.action === "delete") {
      if (!body.id) return json({ error: "ID kredensial wajib diisi." }, 400);
      const { error } = await adminClient.from("admin_credentials").delete().eq("id", body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (body.action === "upsert") {
      if (!body.accountType || !body.subjectKey || !body.displayName || !body.username || !body.password || body.password.length < 8) return json({ error: "Jenis akun, identitas, username, dan password minimal 8 karakter wajib diisi." }, 400);
      const { encrypted, iv } = await encrypt(body.password);
      const { data, error } = await adminClient.from("admin_credentials").upsert({ account_type: body.accountType, subject_key: body.subjectKey.trim(), display_name: body.displayName.trim(), username: body.username.trim(), encrypted_password: encrypted, iv, metadata: body.metadata || {}, updated_at: new Date().toISOString() }, { onConflict: "account_type,subject_key" }).select("id, account_type, subject_key, display_name, username, metadata, created_at, updated_at").single();
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, credential: data });
    }
    return json({ error: "Aksi tidak dikenal." }, 400);
  } catch (error) {
    console.error("admin-credential-vault error", error instanceof Error ? error.message : "unknown");
    return json({ error: "Terjadi gangguan pada layanan kredensial." }, 500);
  }
});

async function getKey() {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(masterKey));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}
function encode(value: Uint8Array) { return btoa(String.fromCharCode(...value)); }
function decode(value: string) { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
async function encrypt(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await getKey(), new TextEncoder().encode(value));
  return { encrypted: encode(new Uint8Array(encrypted)), iv: encode(iv) };
}
async function decrypt(value: string, iv: string) {
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: decode(iv) }, await getKey(), decode(value));
  return new TextDecoder().decode(decrypted);
}
function json(payload: unknown, status = 200) { return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
