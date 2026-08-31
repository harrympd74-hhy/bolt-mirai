import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const db = createClient(supabaseUrl, serviceKey);
const repository = "harrympd74-hhy/bolt-mirai";
const branch = "main";

const studentSchema = z.object({ nis: z.string().min(1), nisn: z.string().optional().nullable(), full_name: z.string().min(1), class_name: z.string().min(1), gender: z.string().optional(), guardian_email: z.string().optional().nullable(), guardian_phone: z.string().optional().nullable(), status: z.string().optional() });
const teacherSchema = z.object({ kode_guru: z.string().min(1), jenis_guru: z.enum(["tetap", "honor", "magang"]), nama_lengkap: z.string().min(1) }).passthrough();

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const startedAt = new Date().toISOString();
  let runId: string | null = null;
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: userData } = await db.auth.getUser(token);
    if (!userData.user || userData.user.app_metadata?.role !== "admin") return json({ error: "Admin access required" }, 403);

    const { data: run, error: runError } = await db.from("sync_runs").insert({ repository, branch, status: "running", started_at: startedAt }).select("id").single();
    if (runError) throw runError;
    runId = run.id;

    const githubToken = Deno.env.get("GITHUB_TOKEN");
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (githubToken) headers.Authorization = `Bearer ${githubToken}`;
    const commitResponse = await fetch(`https://api.github.com/repos/${repository}/commits/${branch}`, { headers });
    if (!commitResponse.ok) throw new Error(`GitHub commit request failed: ${commitResponse.status}`);
    const commit = await commitResponse.json();

    const files = ["data/students.json", "data/teachers.json", "data/classes.json", "data/schedules.json"];
    const datasets: Record<string, unknown[]> = {};
    let filesProcessed = 0;
    let recordsImported = 0;
    for (const path of files) {
      const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}?ref=${branch}`, { headers });
      if (response.status === 404) continue;
      if (!response.ok) throw new Error(`Gagal membaca ${path}: ${response.status}`);
      const file = await response.json();
      const content = decodeBase64(file.content || "");
      const parsed = JSON.parse(content);
      const values = Array.isArray(parsed) ? parsed : parsed.data;
      if (!Array.isArray(values)) throw new Error(`${path} harus berupa array JSON atau memiliki property data berupa array.`);
      datasets[path] = values; filesProcessed += 1;
    }

    if (filesProcessed === 0) throw new Error("File data/*.json belum tersedia di repository GitHub.");
    const students = (datasets["data/students.json"] || []).map((item) => studentSchema.parse(item));
    const teachers = (datasets["data/teachers.json"] || []).map((item) => teacherSchema.parse(item));
    if (students.length) { const { error } = await db.from("student_profiles").upsert(students, { onConflict: "nis" }); if (error) throw error; recordsImported += students.length; }
    if (teachers.length) { const { error } = await db.from("teacher_profiles").upsert(teachers, { onConflict: "kode_guru" }); if (error) throw error; recordsImported += teachers.length; }
    await db.from("sync_runs").update({ status: "success", commit_sha: commit.sha, files_processed: filesProcessed, records_imported: recordsImported, completed_at: new Date().toISOString() }).eq("id", runId);
    return json({ ok: true, repository, branch, commitSha: commit.sha, filesProcessed, recordsImported, datasets: Object.fromEntries(Object.entries(datasets).map(([key, value]) => [key, value.length])) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sinkronisasi gagal.";
    console.error("github-sync error", error);
    if (runId) await db.from("sync_runs").update({ status: "failed", error_message: message, completed_at: new Date().toISOString() }).eq("id", runId);
    return json({ error: message }, 400);
  }
});

function decodeBase64(value: string) { const bytes = Uint8Array.from(atob(value.replace(/\n/g, "")), (character) => character.charCodeAt(0)); return new TextDecoder().decode(bytes); }
function json(payload: unknown, status = 200) { return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
