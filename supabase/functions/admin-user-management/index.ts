import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const db = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
const allowedRoles = new Set(["admin", "teacher", "student", "parent", "guest"]);
type Action = "list" | "reset-password" | "set-disabled" | "delete" | "set-role";
type Payload = { action: Action; userId?: string; password?: string; disabled?: boolean; role?: string };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: actorData, error: actorError } = await db.auth.getUser(token);
    const actor = actorData.user;
    if (actorError || !actor || actor.app_metadata?.role !== "admin") return json({ error: "Akses hanya untuk admin MIRAI." }, 403);
    const body = await request.json() as Payload;

    if (body.action === "list") {
      const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) return json({ error: error.message }, 400);
      return json({ users: data.users.map((user) => ({ id: user.id, email: user.email, role: user.app_metadata?.role || "guest", disabled: Boolean(user.banned_until && new Date(user.banned_until) > new Date()), emailConfirmed: Boolean(user.email_confirmed_at), lastSignInAt: user.last_sign_in_at, createdAt: user.created_at })) });
    }

    if (!body.userId) return json({ error: "User ID wajib diisi." }, 400);
    const { data: targetData, error: targetError } = await db.auth.admin.getUserById(body.userId);
    const target = targetData.user;
    if (targetError || !target) return json({ error: "Pengguna tidak ditemukan." }, 404);
    if (target.id === actor.id && ["delete", "set-disabled", "set-role"].includes(body.action)) return json({ error: "Admin aktif tidak dapat mengubah atau menghapus akunnya sendiri." }, 400);

    if (body.action === "reset-password") {
      if (!body.password || body.password.length < 8) return json({ error: "Password baru minimal 8 karakter." }, 400);
      const { error } = await db.auth.admin.updateUserById(target.id, { password: body.password });
      if (error) return json({ error: error.message }, 400);
      await audit(actor.id, "reset-password", target, {});
      return json({ ok: true, message: "Password berhasil direset." });
    }

    if (body.action === "set-disabled") {
      if (typeof body.disabled !== "boolean") return json({ error: "Status akun tidak valid." }, 400);
      const { data: allUsers } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (body.disabled && isLastAdmin(target, allUsers?.users || [])) return json({ error: "Admin terakhir tidak dapat dinonaktifkan." }, 400);
      const { error } = await db.auth.admin.updateUserById(target.id, { ban_duration: body.disabled ? "876000h" : "none" });
      if (error) return json({ error: error.message }, 400);
      await audit(actor.id, body.disabled ? "disable-user" : "enable-user", target, { disabled: body.disabled });
      return json({ ok: true, message: body.disabled ? "Pengguna dinonaktifkan." : "Pengguna diaktifkan." });
    }

    if (body.action === "set-role") {
      if (!body.role || !allowedRoles.has(body.role)) return json({ error: "Role tidak diizinkan." }, 400);
      const { data: allUsers } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (body.role !== "admin" && isLastAdmin(target, allUsers?.users || [])) return json({ error: "Role admin terakhir tidak dapat diturunkan." }, 400);
      const nextMetadata = { ...target.app_metadata, role: body.role };
      const { error } = await db.auth.admin.updateUserById(target.id, { app_metadata: nextMetadata });
      if (error) return json({ error: error.message }, 400);
      await audit(actor.id, "set-role", target, { role: body.role });
      return json({ ok: true, message: "Role pengguna berhasil diubah." });
    }

    if (body.action === "delete") {
      const { data: allUsers } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (isLastAdmin(target, allUsers?.users || [])) return json({ error: "Admin terakhir tidak dapat dihapus." }, 400);
      const { error } = await db.auth.admin.deleteUser(target.id);
      if (error) return json({ error: error.message }, 400);
      await audit(actor.id, "delete-user", target, {});
      return json({ ok: true, message: "Pengguna berhasil dihapus." });
    }

    return json({ error: "Aksi tidak dikenal." }, 400);
  } catch (error) {
    console.error("admin-user-management error", error instanceof Error ? error.message : "unknown");
    return json({ error: "Terjadi gangguan pada layanan manajemen pengguna." }, 500);
  }
});

function isLastAdmin(target: { id: string; app_metadata?: Record<string, unknown> }, users: Array<{ id: string; app_metadata?: Record<string, unknown> }>) { return target.app_metadata?.role === "admin" && users.filter((user) => user.app_metadata?.role === "admin").length <= 1; }
async function audit(actorId: string, action: string, target: { id: string; email?: string }, details: Record<string, unknown>) { const { error } = await db.from("admin_user_audit_logs").insert({ actor_user_id: actorId, action, target_user_id: target.id, target_email: target.email || null, details }); if (error) console.error("audit log failed", error.message); }
function json(payload: unknown, status = 200) { return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
