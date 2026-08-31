import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const adminClient = createClient(supabaseUrl, serviceKey);

type TeacherPayload = { action: "create" | "reset-password"; teacher?: Record<string, unknown>; account?: { username: string; password: string }; teacherId?: string; password?: string };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: userData } = await adminClient.auth.getUser(token);
    if (!userData.user || userData.user.app_metadata?.role !== "admin") return json({ error: "Admin access required" }, 403);

    const body = await request.json() as TeacherPayload;
    if (body.action === "reset-password") {
      if (!body.teacherId || !body.password || body.password.length < 8) return json({ error: "Teacher ID dan password minimal 8 karakter wajib diisi." }, 400);
      const { data: account, error: accountError } = await adminClient.from("teacher_accounts").select("auth_user_id").eq("teacher_id", body.teacherId).maybeSingle();
      if (accountError || !account?.auth_user_id) return json({ error: "Akun guru belum tersedia." }, 404);
      const { error } = await adminClient.auth.admin.updateUserById(account.auth_user_id, { password: body.password });
      if (error) return json({ error: error.message }, 400);
      await adminClient.from("teacher_accounts").update({ last_password_reset_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("teacher_id", body.teacherId);
      return json({ ok: true, message: "Password guru berhasil direset." });
    }

    if (!body.teacher || !body.account?.username || !body.account.password || body.account.password.length < 8) return json({ error: "Data guru, username, dan password minimal 8 karakter wajib diisi." }, 400);
    const teacher = body.teacher;
    const username = body.account.username.trim().toLowerCase();
    const email = `${username}@mirai.local`;
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({ email, password: body.account.password, email_confirm: true, app_metadata: { role: "teacher" } });
    if (authError || !authData.user) return json({ error: authError?.message || "Akun guru gagal dibuat." }, 400);

    const { data: profile, error: profileError } = await adminClient.from("teacher_profiles").insert(teacher).select("id, kode_guru, jenis_guru, nama_lengkap").single();
    if (profileError || !profile) {
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return json({ error: profileError?.message || "Profil guru gagal disimpan." }, 400);
    }
    const { error: accountError } = await adminClient.from("teacher_accounts").insert({ teacher_id: profile.id, username, auth_user_id: authData.user.id });
    if (accountError) {
      await adminClient.from("teacher_profiles").delete().eq("id", profile.id);
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return json({ error: accountError.message }, 400);
    }
    return json({ ok: true, teacher: profile, username });
  } catch (error) {
    console.error("admin-teacher-accounts error", error);
    return json({ error: "Terjadi gangguan pada layanan akun guru." }, 500);
  }
});

function json(payload: unknown, status = 200) { return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
