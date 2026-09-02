import { useState } from "react";
import { ArrowLeft, Calendar, Download, MoreVertical, FileText, Play, Info, Users, ChevronDown, X } from "lucide-react";

type StudentPerformance = {
  no: number;
  name: string;
  avatar: string;
  struggleScore: number;
  struggleLabel: "Baik" | "Sedang" | "Perlu Pendampingan";
  problemSolvingScore: number;
  problemSolvingLabel: "Baik" | "Sedang" | "Cukup" | "Perlu Pendampingan";
  taskScore: number;
  taskLabel: "Baik" | "Sedang" | "Perlu Pendampingan";
  peerTutorName: string;
  peerTutorAvatar: string;
};

const studentsData: StudentPerformance[] = [
  { no: 1, name: "Aldi Pratama", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", struggleScore: 85, struggleLabel: "Baik", problemSolvingScore: 78, problemSolvingLabel: "Baik", taskScore: 92, taskLabel: "Baik", peerTutorName: "Raka Maulana", peerTutorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
  { no: 2, name: "Anisa Rahma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", struggleScore: 72, struggleLabel: "Sedang", problemSolvingScore: 65, problemSolvingLabel: "Sedang", taskScore: 80, taskLabel: "Baik", peerTutorName: "Salsa Putri", peerTutorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80" },
  { no: 3, name: "Dimas Arya", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", struggleScore: 48, struggleLabel: "Perlu Pendampingan", problemSolvingScore: 45, problemSolvingLabel: "Perlu Pendampingan", taskScore: 60, taskLabel: "Sedang", peerTutorName: "Raka Maulana", peerTutorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
  { no: 4, name: "Faisal Hakim", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80", struggleScore: 60, struggleLabel: "Sedang", problemSolvingScore: 55, problemSolvingLabel: "Sedang", taskScore: 70, taskLabel: "Sedang", peerTutorName: "Rafi Alfarizi", peerTutorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80" },
  { no: 5, name: "Gita Lestari", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80", struggleScore: 75, struggleLabel: "Sedang", problemSolvingScore: 82, problemSolvingLabel: "Baik", taskScore: 95, taskLabel: "Baik", peerTutorName: "Salsa Putri", peerTutorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80" },
  { no: 6, name: "Hafidz Alif", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80", struggleScore: 38, struggleLabel: "Perlu Pendampingan", problemSolvingScore: 40, problemSolvingLabel: "Perlu Pendampingan", taskScore: 50, taskLabel: "Perlu Pendampingan", peerTutorName: "Rafi Alfarizi", peerTutorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80" },
  { no: 7, name: "Intan Permata", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80", struggleScore: 68, struggleLabel: "Sedang", problemSolvingScore: 70, problemSolvingLabel: "Sedang", taskScore: 85, taskLabel: "Baik", peerTutorName: "Gita Lestari", peerTutorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" },
  { no: 8, name: "Joko Suryono", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80", struggleScore: 55, struggleLabel: "Sedang", problemSolvingScore: 50, problemSolvingLabel: "Sedang", taskScore: 65, taskLabel: "Sedang", peerTutorName: "Raka Maulana", peerTutorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
  { no: 9, name: "Kirana Putri", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", struggleScore: 82, struggleLabel: "Baik", problemSolvingScore: 85, problemSolvingLabel: "Baik", taskScore: 90, taskLabel: "Baik", peerTutorName: "Salsa Putri", peerTutorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80" },
  { no: 10, name: "M. Rafiqi", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80", struggleScore: 45, struggleLabel: "Perlu Pendampingan", problemSolvingScore: 48, problemSolvingLabel: "Perlu Pendampingan", taskScore: 55, taskLabel: "Sedang", peerTutorName: "Rafi Alfarizi", peerTutorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80" },
];

function getScoreColor(score: number) {
  if (score >= 75) return { text: "text-emerald-600", bg: "bg-emerald-500", pill: "text-emerald-600" };
  if (score >= 50) return { text: "text-amber-500", bg: "bg-amber-400", pill: "text-amber-500" };
  return { text: "text-rose-500", bg: "bg-rose-500", pill: "text-rose-500" };
}

export default function TeacherActiveRoomDetail({ onBack }: { onBack: () => void }) {
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft size={14} /> Kembali ke Kelas Aktif
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Ruang Kelas - Kelas 7A</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pantau progres belajar siswa dan berikan rekomendasi belajar yang tepat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
            <Calendar size={15} className="text-slate-500" />
            <span>31 Mei 2025</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-muted shadow-sm transition"
          >
            <Download size={15} /> Ekspor Laporan
          </button>
        </div>
      </div>

      {/* Grid Cards: Materi Terbaru & Ringkasan Kelas */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Materi Terbaru Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Materi Terbaru</h2>
            <button type="button" className="text-xs font-bold text-sky-600 hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Visual Graphic Thumbnail */}
            <div className="relative flex h-36 w-full shrink-0 flex-col justify-between rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-4 sm:w-44 border border-amber-200/60 shadow-inner">
              <span className="text-xs font-extrabold text-amber-900/80">Sudut</span>
              <div className="my-auto flex justify-center">
                <svg viewBox="0 0 120 70" className="h-20 w-auto" role="img" aria-label="Diagram Sudut">
                  <line x1="15" y1="60" x2="105" y2="60" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="15" y1="60" x2="85" y2="15" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 35 60 A 20 20 0 0 0 29 48" fill="none" stroke="#10b981" strokeWidth="2" />
                  <circle cx="15" cy="60" r="3" fill="#10b981" />
                  <text x="5" y="65" fontSize="10" fontWeight="bold" fill="#1e293b">O</text>
                  <text x="90" y="20" fontSize="10" fontWeight="bold" fill="#1e293b">A</text>
                  <text x="108" y="65" fontSize="10" fontWeight="bold" fill="#1e293b">B</text>
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-amber-800/70">Kelas 7 SMP</span>
            </div>

            {/* Content Details */}
            <div className="flex min-w-0 flex-1 flex-col justify-between space-y-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Sudut dan Jenis-jenisnya</h3>
                <p className="mt-0.5 text-[11px] text-slate-400">Dipublikasikan: 30 Mei 2025</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Materi ini membahas pengertian sudut, jenis-jenis sudut, serta cara mengukurnya.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Sudut
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-extrabold text-orange-600">
                  <FileText size={11} /> PPT
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-600">
                  <FileText size={11} /> PDF
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-extrabold text-sky-600">
                  <Play size={10} fill="currentColor" /> Video
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600">
                  <FileText size={11} /> Worksheet
                </span>
              </div>
            </div>
          </div>

          {/* Pagination Carousel Dots */}
          <div className="mt-4 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-800 dark:bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* Ringkasan Kelas Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-extrabold text-slate-900 dark:text-white">Ringkasan Kelas</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Stat 1 */}
            <div className="flex flex-col justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/20">
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">
                Rata-rata Struggle Lifetime
              </p>
              <div className="mt-3">
                <p className="text-2xl font-black text-emerald-600">62%</p>
                <p className="text-[10px] font-semibold text-slate-500">Sedang</p>
              </div>
              <svg className="mt-2 h-6 w-full text-emerald-500" viewBox="0 0 100 24" fill="none">
                <path d="M0 20 L25 18 L50 14 L75 8 L100 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col justify-between rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 dark:border-amber-950 dark:bg-amber-950/20">
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">
                Rata-rata Kemampuan Pemecahan Masalah
              </p>
              <div className="mt-3">
                <p className="text-2xl font-black text-amber-600">58%</p>
                <p className="text-[10px] font-semibold text-slate-500">Cukup</p>
              </div>
              <svg className="mt-2 h-6 w-full text-amber-500" viewBox="0 0 100 24" fill="none">
                <path d="M0 18 L25 19 L50 15 L75 17 L100 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col justify-between rounded-xl border border-sky-100 bg-sky-50/50 p-3.5 dark:border-sky-950 dark:bg-sky-950/20">
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">
                Rata-rata Tugas Ketercapaian
              </p>
              <div className="mt-3">
                <p className="text-2xl font-black text-sky-600">72%</p>
                <p className="text-[10px] font-semibold text-slate-500">Baik</p>
              </div>
              <svg className="mt-2 h-6 w-full text-sky-500" viewBox="0 0 100 24" fill="none">
                <path d="M0 20 L25 15 L50 12 L75 10 L100 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Stat 4 */}
            <div className="relative flex flex-col justify-between rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 dark:border-purple-950 dark:bg-purple-950/20">
              <p className="text-[10px] font-semibold text-purple-900 dark:text-purple-300 leading-tight">
                Siswa Perlu Pendampingan
              </p>
              <div className="mt-3">
                <p className="text-2xl font-black text-purple-700 dark:text-purple-400">9</p>
                <p className="text-[10px] font-semibold text-slate-500">Siswa</p>
              </div>
              <div className="absolute bottom-3 right-3 text-purple-300 dark:text-purple-800">
                <Users size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performa Siswa Section */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Performa Siswa</h2>
            <p className="mt-0.5 text-xs text-slate-400">Data diupdate otomatis berdasarkan aktivitas belajar siswa.</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Baik (≥ 75%)
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-500">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Sedang (50% - 74%)
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-rose-500">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Perlu Pendampingan (&lt; 50%)
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2 w-10">No</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3">
                  <span className="inline-flex items-center gap-1">
                    Struggle Lifetime <Info size={12} className="text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3">
                  <span className="inline-flex items-center gap-1">
                    Kemampuan Pemecahan Masalah <Info size={12} className="text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3">
                  <span className="inline-flex items-center gap-1">
                    Tugas Ketercapaian <Info size={12} className="text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3">Rekomendasi Tutor Sebaya</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {studentsData.map((student) => {
                const struggleColor = getScoreColor(student.struggleScore);
                const problemColor = getScoreColor(student.problemSolvingScore);
                const taskColor = getScoreColor(student.taskScore);

                return (
                  <tr key={student.no} className="hover:bg-muted/40 transition">
                    <td className="py-3 px-2 text-slate-400 font-medium">{student.no}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                          crossOrigin="anonymous"
                        />
                        <span className="font-extrabold text-slate-800 dark:text-slate-100">{student.name}</span>
                      </div>
                    </td>

                    {/* Struggle Lifetime */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 text-right font-extrabold text-slate-700 dark:text-slate-300">
                          {student.struggleScore}%
                        </span>
                        <div className="h-1.5 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${struggleColor.bg}`}
                            style={{ width: `${student.struggleScore}%` }}
                          />
                        </div>
                        <span className={`min-w-20 font-semibold ${struggleColor.pill}`}>
                          {student.struggleLabel}
                        </span>
                      </div>
                    </td>

                    {/* Kemampuan Pemecahan Masalah */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 text-right font-extrabold text-slate-700 dark:text-slate-300">
                          {student.problemSolvingScore}%
                        </span>
                        <div className="h-1.5 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${problemColor.bg}`}
                            style={{ width: `${student.problemSolvingScore}%` }}
                          />
                        </div>
                        <span className={`min-w-20 font-semibold ${problemColor.pill}`}>
                          {student.problemSolvingLabel}
                        </span>
                      </div>
                    </td>

                    {/* Tugas Ketercapaian */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 text-right font-extrabold text-slate-700 dark:text-slate-300">
                          {student.taskScore}%
                        </span>
                        <div className="h-1.5 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${taskColor.bg}`}
                            style={{ width: `${student.taskScore}%` }}
                          />
                        </div>
                        <span className={`min-w-20 font-semibold ${taskColor.pill}`}>
                          {student.taskLabel}
                        </span>
                      </div>
                    </td>

                    {/* Rekomendasi Tutor Sebaya */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={student.peerTutorAvatar}
                          alt={student.peerTutorName}
                          className="h-6 w-6 rounded-full object-cover ring-1 ring-border"
                          crossOrigin="anonymous"
                        />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {student.peerTutorName}
                        </span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(student)}
                          className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-extrabold text-indigo-600 hover:bg-muted transition"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1 text-slate-400 hover:bg-muted hover:text-slate-600"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  crossOrigin="anonymous"
                />
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-400">SMP Kelas 7A · Matematika</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-full bg-muted p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <span className="text-slate-500">Struggle Lifetime</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedStudent.struggleScore}% ({selectedStudent.struggleLabel})
                </span>
              </div>
              <div className="flex justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <span className="text-slate-500">Pemecahan Masalah</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedStudent.problemSolvingScore}% ({selectedStudent.problemSolvingLabel})
                </span>
              </div>
              <div className="flex justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                <span className="text-slate-500">Tugas Ketercapaian</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedStudent.taskScore}% ({selectedStudent.taskLabel})
                </span>
              </div>
              <div className="flex justify-between rounded-xl bg-indigo-50/60 p-3 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300">
                <span>Rekomendasi Tutor Sebaya</span>
                <span className="font-bold">{selectedStudent.peerTutorName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white dark:bg-white dark:text-slate-900 hover:brightness-110"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
