import { useState, useEffect, useCallback } from 'react';
import {
  CalendarDays, Clock, Plus, Loader2, ArrowLeft, BookOpen,
  ClipboardList, Link2, Upload, Trash2, X, Check, FileText,
  Video, ExternalLink, Lock, CheckCircle2,
  AlertCircle, Calendar, Pencil,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Schedule } from '@/types';

// ============================================================
// TYPES
// ============================================================
interface ClassMeeting {
  id: string;
  teacher_id: string;
  class_id: string;
  schedule_id: string | null;
  meeting_number: number;
  title: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  locked: boolean;
  completed: boolean;
  partially_completed: boolean;
  notes: string | null;
  created_at: string;
  class_name?: string | null;
  material_count?: number;
  assignment_count?: number;
}

interface MeetingMaterial {
  id: string;
  meeting_id: string;
  type: string;
  title: string;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  external_url: string | null;
  created_at: string;
}

interface MeetingAssignment {
  id: string;
  meeting_id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  created_at: string;
}

interface KelasOption {
  id: string;
  name: string;
}

type MeetingStatus = 'akan_datang' | 'selesai' | 'sebagian_selesai' | 'terkunci' | 'belum_aktif';

// ============================================================
// STATUS LOGIC
// ============================================================
function getMeetingStatus(meeting: ClassMeeting): MeetingStatus {
  if (meeting.locked) return 'terkunci';
  if (meeting.completed) return 'selesai';
  if (meeting.partially_completed) return 'sebagian_selesai';

  const now = new Date();
  const meetingDateTime = new Date(`${meeting.meeting_date}T${meeting.start_time}`);
  const meetingEndDateTime = new Date(`${meeting.meeting_date}T${meeting.end_time}`);

  // If meeting has ended, mark as selesai
  if (now > meetingEndDateTime) return 'selesai';

  const diffMs = meetingDateTime.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const diffHours = diffMs / (1000 * 60 * 60);

  // Belum Aktif: >4 days before or >2 hours before
  if (diffDays > 4 || diffHours > 2) return 'belum_aktif';

  return 'akan_datang';
}

const STATUS_CONFIG: Record<MeetingStatus, { label: string; color: string; bg: string; border: string; text: string; dot: string }> = {
  akan_datang: { label: 'Akan datang', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', dot: 'bg-blue-500' },
  selesai: { label: 'Selesai', color: 'green', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  sebagian_selesai: { label: 'Sebagian Selesai', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', dot: 'bg-amber-500' },
  terkunci: { label: 'Terkunci', color: 'slate', bg: 'bg-slate-100', border: 'border-slate-400', text: 'text-slate-600', dot: 'bg-slate-600' },
  belum_aktif: { label: 'Belum Aktif', color: 'silver', bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-500', dot: 'bg-slate-400' },
};

const fmtDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const fmtTime = (t: string) => t.slice(0, 5);

const fmtFileSize = (bytes: number | null): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return FileText;
  if (fileType.startsWith('video/')) return Video;
  if (fileType.includes('pdf') || fileType.includes('doc') || fileType.includes('ppt')) return FileText;
  return FileText;
};

const ACCEPTED_FILE_TYPES = '.doc,.docx,.pdf,.ppt,.pptx,.mp4,.flash,.flipbook';

// ============================================================
// PERTEMUAN KELAS PAGE (main list)
// ============================================================
export function PertemuanKelasPage({ teacherId }: { teacherId: string }) {
  const [meetings, setMeetings] = useState<ClassMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ClassMeeting | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<ClassMeeting | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('class_meetings')
      .select(`
        *,
        classes(name),
        meeting_materials(count),
        meeting_assignments(count)
      `)
      .eq('teacher_id', teacherId)
      .order('meeting_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Gagal memuat pertemuan:', error.message);
      setMeetings([]);
    } else {
      const enriched = (data || []).map((m: ClassMeeting & {
        classes: { name: string } | null;
        meeting_materials: { count: number }[];
        meeting_assignments: { count: number }[];
      }) => ({
        ...m,
        class_name: m.classes?.name || null,
        material_count: m.meeting_materials?.[0]?.count || 0,
        assignment_count: m.meeting_assignments?.[0]?.count || 0,
      }));
      setMeetings(enriched);
    }
    setLoading(false);
  }, [teacherId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pertemuan ini? Semua bahan ajar dan tugas terkait akan ikut terhapus.')) return;
    await supabase.from('class_meetings').delete().eq('id', id);
    load();
  };

  // If a meeting is selected, show detail page
  if (selectedMeeting) {
    return (
      <MeetingDetailPage
        meeting={selectedMeeting}
        onBack={() => { setSelectedMeeting(null); load(); }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pertemuan Kelas</h2>
          <p className="text-sm text-slate-500 mt-0.5">Klik pada pertemuan untuk menyiapkan bahan ajar dan tugas.</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Pertemuan
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-slate-500">Belum ada pertemuan</p>
          <p className="text-xs mt-1">Buat pertemuan pertama Anda untuk mulai menyiapkan bahan ajar dan tugas.</p>
        </div>
      ) : (
        <>
          {/* Horizontal scrollable cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-1 px-1 snap-x">
            {meetings.map((m) => {
              const status = getMeetingStatus(m);
              const cfg = STATUS_CONFIG[status];
              return (
                <div
                  key={m.id}
                  className={`snap-start shrink-0 w-80 rounded-xl border-2 ${cfg.border} ${cfg.bg} bg-white p-5 cursor-pointer hover:shadow-lg transition-all relative group`}
                  onClick={() => setSelectedMeeting(m)}
                >
                  {/* Meeting number */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`text-4xl font-bold ${cfg.text} opacity-80`}>
                      {String(m.meeting_number).padStart(2, '0')}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} px-2.5 py-1 text-xs font-medium`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-semibold text-slate-900 mb-3 line-clamp-2 min-h-[2.5rem]">{m.title}</p>

                  {/* Date & time */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {fmtDate(m.meeting_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {fmtTime(m.start_time)} - {fmtTime(m.end_time)}
                    </span>
                    {m.class_name && (
                      <span className="inline-flex items-center gap-1 truncate">
                        <BookOpen className="w-3.5 h-3.5" />
                        {m.class_name}
                      </span>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="flex items-center gap-4 pt-3 border-t border-slate-200/60 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-medium">{m.material_count || 0}</span> Bahan Ajar
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span className="font-medium">{m.assignment_count || 0}</span> Tugas
                    </span>
                  </div>

                  {/* Action button */}
                  <button
                    className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                      status === 'terkunci'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : status === 'selesai' || status === 'sebagian_selesai'
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={status === 'terkunci'}
                    onClick={(e) => { e.stopPropagation(); setSelectedMeeting(m); }}
                  >
                    {status === 'terkunci' ? 'Terkunci' : status === 'selesai' || status === 'sebagian_selesai' ? 'Lihat Detail' : 'Siapkan'}
                  </button>

                  {/* Edit/delete on hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditItem(m); setShowForm(true); }}
                      className="p-1 rounded bg-white/80 text-slate-500 hover:text-slate-700"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                      className="p-1 rounded bg-white/80 text-rose-400 hover:text-rose-600"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-600 mb-3">Legenda Status</p>
            <div className="flex flex-wrap gap-4">
              <LegendItem color="bg-blue-500" label="Akan datang" desc="≤4 hari atau ≤2 jam sebelum KBM" />
              <LegendItem color="bg-amber-500" label="Sebagian Selesai" desc="Ditandai sebagian selesai" />
              <LegendItem color="bg-emerald-500" label="Selesai" desc="Pertemuan telah selesai" />
              <LegendItem color="bg-slate-600" label="Terkunci" desc="Dikunci oleh guru" />
              <LegendItem color="bg-slate-300" label="Belum Aktif" desc=">4 hari atau >2 jam sebelum KBM" />
            </div>
          </div>
        </>
      )}

      {showForm && (
        <MeetingForm
          teacherId={teacherId}
          editItem={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); load(); }}
        />
      )}
    </div>
  );
}

function LegendItem({ color, label, desc }: { color: string; label: string; desc: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color} shrink-0`} />
      <div>
        <p className="text-xs font-medium text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

// ============================================================
// MEETING FORM (create/edit)
// ============================================================
function MeetingForm({ teacherId, editItem, onClose, onSaved }: {
  teacherId: string;
  editItem: ClassMeeting | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [meetingNumber, setMeetingNumber] = useState(editItem?.meeting_number || 1);
  const [title, setTitle] = useState(editItem?.title || '');
  const [classId, setClassId] = useState(editItem?.class_id || '');
  const [scheduleId, setScheduleId] = useState(editItem?.schedule_id || '');
  const [meetingDate, setMeetingDate] = useState(editItem?.meeting_date || new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(editItem?.start_time || '07:30');
  const [endTime, setEndTime] = useState(editItem?.end_time || '09:00');
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<KelasOption[]>([]);
  const [schedules, setSchedules] = useState<(Schedule & { class_name: string })[]>([]);

  useEffect(() => {
    (async () => {
      const [classRes, schedRes] = await Promise.all([
        supabase.from('classes').select('id, name').eq('is_active', true).order('name'),
        supabase.from('schedules').select('*, classes!inner(name)').eq('teacher_id', teacherId).order('day').order('start_time'),
      ]);
      setClasses(classRes.data || []);
      setSchedules((schedRes.data || []).map((s: Schedule & { classes: { name: string } }) => ({
        ...s,
        class_name: s.classes?.name || '-',
      })));
    })();
  }, [teacherId]);

  const onScheduleChange = (id: string) => {
    setScheduleId(id);
    const sched = schedules.find((s) => s.id === id);
    if (sched) {
      setClassId(sched.class_id);
      setStartTime(fmtTime(sched.start_time));
      setEndTime(fmtTime(sched.end_time));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      teacher_id: teacherId,
      meeting_number: meetingNumber,
      title,
      class_id: classId,
      schedule_id: scheduleId || null,
      meeting_date: meetingDate,
      start_time: startTime,
      end_time: endTime,
      notes: notes || null,
    };
    if (editItem) {
      await supabase.from('class_meetings').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('class_meetings').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <ModalForm title={editItem ? 'Edit Pertemuan' : 'Tambah Pertemuan'} onClose={onClose} saving={saving} onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pertemuan ke-">
          <input type="number" min={1} required value={meetingNumber} onChange={(e) => setMeetingNumber(Number(e.target.value))} className="form-input" />
        </Field>
        <Field label="Tanggal">
          <input type="date" required value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="form-input" />
        </Field>
      </div>
      <Field label="Judul Materi">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Bab 1 - Bilangan Bulat" />
      </Field>
      <Field label="Pilih Jadwal (opsional)">
        <select value={scheduleId} onChange={(e) => onScheduleChange(e.target.value)} className="form-input">
          <option value="">Pilih jadwal mengajar</option>
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>{s.day} · {s.subject} · {s.class_name} · {fmtTime(s.start_time)}</option>
          ))}
        </select>
      </Field>
      <Field label="Kelas">
        <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="form-input">
          <option value="">Pilih kelas</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Jam Mulai">
          <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="form-input" />
        </Field>
        <Field label="Jam Selesai">
          <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="form-input" />
        </Field>
      </div>
      <Field label="Catatan (opsional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-input min-h-[60px]" placeholder="Catatan pertemuan..." />
      </Field>
    </ModalForm>
  );
}

// ============================================================
// MEETING DETAIL PAGE (preparation: upload materials, add links, assignments)
// ============================================================
function MeetingDetailPage({ meeting, onBack }: {
  meeting: ClassMeeting;
  onBack: () => void;
}) {
  const [materials, setMaterials] = useState<MeetingMaterial[]>([]);
  const [assignments, setAssignments] = useState<MeetingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [assigTitle, setAssigTitle] = useState('');
  const [assigDesc, setAssigDesc] = useState('');
  const [assigDeadline, setAssigDeadline] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<'idle' | 'saving'>('idle');

  const status = getMeetingStatus(meeting);
  const cfg = STATUS_CONFIG[status];

  const load = useCallback(async () => {
    setLoading(true);
    const [matRes, assigRes] = await Promise.all([
      supabase.from('meeting_materials').select('*').eq('meeting_id', meeting.id).order('created_at', { ascending: false }),
      supabase.from('meeting_assignments').select('*').eq('meeting_id', meeting.id).order('created_at', { ascending: false }),
    ]);
    setMaterials(matRes.data || []);
    setAssignments(assigRes.data || []);
    setLoading(false);
  }, [meeting.id]);

  useEffect(() => { load(); }, [load]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${meeting.id}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('meeting-materials')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      setUploading(false);
      alert('Gagal mengunggah file: ' + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('meeting-materials')
      .getPublicUrl(filePath);

    await supabase.from('meeting_materials').insert({
      meeting_id: meeting.id,
      type: 'file',
      title: file.name,
      file_url: urlData.publicUrl,
      file_type: fileExt || file.type,
      file_size: file.size,
    });

    setUploading(false);
    load();
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    await supabase.from('meeting_materials').insert({
      meeting_id: meeting.id,
      type: 'link',
      title: linkTitle.trim(),
      external_url: linkUrl.trim(),
    });
    setLinkTitle('');
    setLinkUrl('');
    setShowLinkForm(false);
    load();
  };

  const handleDeleteMaterial = async (id: string, fileUrl: string | null) => {
    if (!confirm('Hapus item ini?')) return;
    // Delete from storage if it's a file
    if (fileUrl) {
      const filePath = fileUrl.split('/meeting-materials/')[1];
      if (filePath) {
        await supabase.storage.from('meeting-materials').remove([filePath]);
      }
    }
    await supabase.from('meeting_materials').delete().eq('id', id);
    load();
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigTitle.trim()) return;
    await supabase.from('meeting_assignments').insert({
      meeting_id: meeting.id,
      title: assigTitle.trim(),
      description: assigDesc.trim() || null,
      deadline: assigDeadline ? new Date(assigDeadline).toISOString() : null,
    });
    setAssigTitle('');
    setAssigDesc('');
    setAssigDeadline('');
    setShowAssignmentForm(false);
    load();
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Hapus tugas ini?')) return;
    await supabase.from('meeting_assignments').delete().eq('id', id);
    load();
  };

  const updateMeetingStatus = async (updates: { locked?: boolean; completed?: boolean; partially_completed?: boolean }) => {
    setStatusUpdate('saving');
    await supabase.from('class_meetings').update(updates).eq('id', meeting.id);
    setStatusUpdate('idle');
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Pertemuan Kelas
      </button>

      {/* Meeting header */}
      <div className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-5 mb-5`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4">
            <div className={`text-5xl font-bold ${cfg.text} opacity-80`}>
              {String(meeting.meeting_number).padStart(2, '0')}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{meeting.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {fmtDate(meeting.meeting_date)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {fmtTime(meeting.start_time)} - {fmtTime(meeting.end_time)}
                </span>
              </div>
              {meeting.class_name && (
                <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {meeting.class_name}
                </p>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} px-3 py-1 text-xs font-medium`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* Status controls */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200/60">
          <button
            onClick={() => updateMeetingStatus({ completed: true, partially_completed: false, locked: false })}
            disabled={statusUpdate === 'saving'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Selesai
          </button>
          <button
            onClick={() => updateMeetingStatus({ partially_completed: true, completed: false, locked: false })}
            disabled={statusUpdate === 'saving'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <AlertCircle className="w-3.5 h-3.5" /> Sebagian Selesai
          </button>
          <button
            onClick={() => updateMeetingStatus({ locked: !meeting.locked, completed: false, partially_completed: false })}
            disabled={statusUpdate === 'saving'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" /> {meeting.locked ? 'Buka Kunci' : 'Kunci'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
      ) : (
        <>
          {/* Bahan Ajar section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800">Bahan Ajar</h3>
                <span className="text-xs text-slate-400">({materials.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 text-blue-700 px-3 py-1.5 text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer">
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploading ? 'Mengunggah...' : 'Unggah File'}
                  <input
                    type="file"
                    className="hidden"
                    accept={ACCEPTED_FILE_TYPES}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <button
                  onClick={() => setShowLinkForm(!showLinkForm)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-600 px-3 py-1.5 text-xs font-medium hover:bg-slate-200 transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" /> Tambah Link
                </button>
              </div>
            </div>

            {/* Supported formats hint */}
            <p className="text-[10px] text-slate-400 mb-3">
              Format didukung: .doc, .docx, .pdf, .ppt, .pptx, .mp4, .flash, flipbook, link Google Drive/YouTube
            </p>

            {/* Link form */}
            {showLinkForm && (
              <form onSubmit={handleAddLink} className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <input
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Judul link (contoh: Video Pembelajaran YouTube)"
                  className="form-input"
                  required
                />
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="form-input"
                  required
                />
                <div className="flex items-center gap-2">
                  <button type="submit" className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Tambah</button>
                  <button type="button" onClick={() => setShowLinkForm(false)} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-300">Batal</button>
                </div>
              </form>
            )}

            {/* Materials list */}
            {materials.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Belum ada bahan ajar. Unggah file atau tambahkan link pembelajaran.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {materials.map((mat) => {
                  const Icon = mat.type === 'link' ? ExternalLink : getFileIcon(mat.file_type);
                  return (
                    <div key={mat.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 group">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{mat.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="uppercase">{mat.type}</span>
                          {mat.file_type && <span>· {mat.file_type}</span>}
                          {mat.file_size && <span>· {fmtFileSize(mat.file_size)}</span>}
                        </div>
                      </div>
                      {mat.type === 'link' && mat.external_url && (
                        <a
                          href={mat.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="Buka link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {mat.type === 'file' && mat.file_url && (
                        <a
                          href={mat.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 p-1"
                          aria-label="Buka file"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteMaterial(mat.id, mat.type === 'file' ? mat.file_url : null)}
                        className="text-rose-400 hover:text-rose-600 p-1"
                        aria-label="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tugas section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-semibold text-slate-800">Tugas</h3>
                <span className="text-xs text-slate-400">({assignments.length})</span>
              </div>
              <button
                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 text-amber-700 px-3 py-1.5 text-xs font-medium hover:bg-amber-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Tugas
              </button>
            </div>

            {/* Assignment form */}
            {showAssignmentForm && (
              <form onSubmit={handleAddAssignment} className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                <input
                  value={assigTitle}
                  onChange={(e) => setAssigTitle(e.target.value)}
                  placeholder="Judul tugas"
                  className="form-input"
                  required
                />
                <textarea
                  value={assigDesc}
                  onChange={(e) => setAssigDesc(e.target.value)}
                  placeholder="Deskripsi tugas (opsional)"
                  className="form-input min-h-[60px]"
                />
                <input
                  type="datetime-local"
                  value={assigDeadline}
                  onChange={(e) => setAssigDeadline(e.target.value)}
                  className="form-input"
                />
                <div className="flex items-center gap-2">
                  <button type="submit" className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">Tambah</button>
                  <button type="button" onClick={() => setShowAssignmentForm(false)} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-300">Batal</button>
                </div>
              </form>
            )}

            {/* Assignments list */}
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Belum ada tugas untuk pertemuan ini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {assignments.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{a.title}</p>
                      {a.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{a.description}</p>}
                      {a.deadline && (
                        <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Deadline: {new Date(a.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAssignment(a.id)}
                      className="text-rose-400 hover:text-rose-600 p-1 shrink-0"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// SHARED UI
// ============================================================
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function ModalForm({ title, onClose, saving, onSubmit, children }: {
  title: string;
  onClose: () => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400" aria-label="Tutup"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {children}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// SISWA: Meeting view for Ruang Kelas (read-only)
// Shows meeting materials and assignments for a given class
// ============================================================
export function SiswaMeetingView({ classId, onBack }: { classId: string; onBack: () => void }) {
  const [meetings, setMeetings] = useState<ClassMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<ClassMeeting | null>(null);
  const [materials, setMaterials] = useState<MeetingMaterial[]>([]);
  const [assignments, setAssignments] = useState<MeetingAssignment[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('class_meetings')
      .select(`
        *,
        classes(name),
        meeting_materials(count),
        meeting_assignments(count)
      `)
      .eq('class_id', classId)
      .order('meeting_date', { ascending: true })
      .order('start_time', { ascending: true });

    const enriched = (data || []).map((m: ClassMeeting & {
      classes: { name: string } | null;
      meeting_materials: { count: number }[];
      meeting_assignments: { count: number }[];
    }) => ({
      ...m,
      class_name: m.classes?.name || null,
      material_count: m.meeting_materials?.[0]?.count || 0,
      assignment_count: m.meeting_assignments?.[0]?.count || 0,
    }));
    setMeetings(enriched);
    setLoading(false);
  }, [classId]);

  useEffect(() => { load(); }, [load]);

  const loadDetail = useCallback(async (meetingId: string) => {
    setDetailLoading(true);
    const [matRes, assigRes] = await Promise.all([
      supabase.from('meeting_materials').select('*').eq('meeting_id', meetingId).order('created_at', { ascending: false }),
      supabase.from('meeting_assignments').select('*').eq('meeting_id', meetingId).order('created_at', { ascending: false }),
    ]);
    setMaterials(matRes.data || []);
    setAssignments(assigRes.data || []);
    setDetailLoading(false);
  }, []);

  if (selectedMeeting) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setSelectedMeeting(null)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="text-4xl font-bold text-sky-600 opacity-80">
              {String(selectedMeeting.meeting_number).padStart(2, '0')}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{selectedMeeting.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {fmtDate(selectedMeeting.meeting_date)}</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {fmtTime(selectedMeeting.start_time)} - {fmtTime(selectedMeeting.end_time)}</span>
              </div>
            </div>
          </div>
        </div>

        {detailLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-sky-600 animate-spin" /></div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-800">Bahan Ajar</h3>
              </div>
              {materials.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">Belum ada bahan ajar.</p>
              ) : (
                <div className="space-y-2">
                  {materials.map((mat) => {
                    const Icon = mat.type === 'link' ? ExternalLink : getFileIcon(mat.file_type);
                    const url = mat.type === 'link' ? mat.external_url : mat.file_url;
                    return (
                      <a
                        key={mat.id}
                        href={url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 hover:border-sky-300 hover:bg-sky-50/50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-sky-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{mat.title}</p>
                          <p className="text-xs text-slate-400 uppercase">{mat.type}{mat.file_type ? ` · ${mat.file_type}` : ''}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-semibold text-slate-800">Tugas</h3>
              </div>
              {assignments.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">Belum ada tugas.</p>
              ) : (
                <div className="space-y-2">
                  {assignments.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <ClipboardList className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{a.title}</p>
                        {a.description && <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>}
                        {a.deadline && (
                          <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Deadline: {new Date(a.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Ruang Kelas
      </button>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Pertemuan Kelas</h2>
      <p className="text-sm text-slate-500 mb-4">{meetings.length} pertemuan tersedia</p>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-sky-600 animate-spin" /></div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Belum ada pertemuan untuk kelas ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meetings.map((m) => {
            const status = getMeetingStatus(m);
            const cfg = STATUS_CONFIG[status];
            const isLocked = status === 'terkunci';
            return (
              <div
                key={m.id}
                className={`rounded-xl border-2 ${cfg.border} ${cfg.bg} p-4 ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'} transition-all`}
                onClick={() => { if (!isLocked) { setSelectedMeeting(m); loadDetail(m.id); } }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`text-3xl font-bold ${cfg.text} opacity-80`}>
                    {String(m.meeting_number).padStart(2, '0')}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} px-2 py-0.5 text-[10px] font-medium`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">{m.title}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(m.meeting_date)}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {fmtTime(m.start_time)}</span>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-200/60">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                    <FileText className="w-3 h-3" /> {m.material_count || 0} Bahan
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                    <ClipboardList className="w-3 h-3" /> {m.assignment_count || 0} Tugas
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
