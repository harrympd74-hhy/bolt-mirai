import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const db = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
type Payload = { action: "list" | "create" | "update" | "delete" | "publish"; id?: string; className?: string; subject?: string; teacherId?: string | null; dayOfWeek?: number; startTime?: string; endTime?: string; room?: string; semester?: string; status?: "draft" | "published" };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: authData, error: authError } = await db.auth.getUser(token);
    const user = authData.user;
    if (authError || !user) return json({ error: "Sesi tidak valid." }, 401);
    const role = user.app_metadata?.role as string | undefined;
    const body = await request.json() as Payload;

    if (body.action === "list") {
      let query = db.from("class_schedules").select("*, teacher_profiles(id, kode_guru, nama_lengkap, mata_pelajaran)").order("day_of_week").order("start_time");
      if (role === "teacher") {
        const { data: account } = await db.from("teacher_accounts").select("teacher_id").eq("auth_user_id", user.id).maybeSingle();
        if (!account) return json({ schedules: [] });
        query = query.eq("teacher_id", account.teacher_id).eq("status", "published");
      } else if (role === "student") {
        const { data: account } = await db.from("student_accounts").select("student_id").eq("auth_user_id", user.id).maybeSingle();
        if (!account) return json({ schedules: [] });
        const { data: profile } = await db.from("student_profiles").select("class_name").eq("id", account.student_id).maybeSingle();
        if (!profile) return json({ schedules: [] });
        query = query.eq("class_name", profile.class_name).eq("status", "published");
      } else if (role !== "admin") return json({ error: "Akses jadwal ditolak." }, 403);
      const { data, error } = await query;
      if (error) return json({ error: error.message }, 400);
      return json({ schedules: data || [] });
    }

    if (role !== "admin") return json({ error: "Hanya admin yang dapat mengubah jadwal." }, 403);
    if (body.action === "delete") {
      if (!body.id) return json({ error: "ID jadwal wajib diisi." }, 400);
      const { error } = await db.from("class_schedules").delete().eq("id", body.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }
    if (body.action === "publish") {
      if (!body.id) return json({ error: "ID jadwal wajib diisi." }, 400);
      const { data, error } = await db.from("class_schedules").update({ status: "published", updated_at: new Date().toISOString() }).eq("id", body.id).select("*").single();
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, schedule: data });
    }

    if (!body.className || !body.subject || !body.dayOfWeek || !body.startTime || !body.endTime || body.dayOfWeek < 1 || body.dayOfWeek > 7 || body.endTime <= body.startTime) return json({ error: "Kelas, mata pelajaran, hari, dan waktu yang valid wajib diisi." }, 400);
    const currentId = body.action === "update" ? body.id : undefined;
    const conflictQuery = db.from("class_schedules").select("id, class_name, subject, start_time, end_time, teacher_id").eq("day_of_week", body.dayOfWeek).neq("id", currentId || "00000000-0000-0000-0000-000000000000").or(`class_name.eq.${body.className},teacher_id.eq.${body.teacherId || "00000000-0000-0000-0000-000000000000"}`);
    const { data: conflicts } = await conflictQuery;
    const conflict = (conflicts || []).find((item) => overlaps(body.startTime!, body.endTime!, item.start_time, item.end_time) && (item.class_name === body.className || (body.teacherId && item.teacher_id === body.teacherId)));
    if (conflict) return json({ error: `Jadwal bentrok dengan ${conflict.subject} (${conflict.start_time}-${conflict.end_time}).` }, 409);
    const values = { class_name: body.className, subject: body.subject, teacher_id: body.teacherId || null, day_of_week: body.dayOfWeek, start_time: body.startTime, end_time: body.endTime, room: body.room || null, semester: body.semester || "Ganjil", status: body.status || "draft", updated_at: new Date().toISOString() };
    const result = body.action === "update" && body.id ? await db.from("class_schedules").update(values).eq("id", body.id).select("*").single() : await db.from("class_schedules").insert(values).select("*").single();
    if (result.error) return json({ error: result.error.message }, 400);
    return json({ ok: true, schedule: result.data });
  } catch (error) { console.error("schedule-management error", error instanceof Error ? error.message : "unknown"); return json({ error: "Layanan jadwal mengalami gangguan." }, 500); }
});

function overlaps(start: string, end: string, otherStart: string, otherEnd: string) { return start < otherEnd && end > otherStart; }
function json(payload: unknown, status = 200) { return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
