import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen, FileText, ClipboardList, CalendarDays, Loader2,
  Plus, Pencil, Trash2, X, Check, Search,
  ListChecks, FileQuestion, Link2,
  ArrowLeft, UploadCloud, Image as ImageIcon, FileVideo, FileAudio,
  Lightbulb, Star, Bell, MessageSquare, Globe,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Schedule } from '@/types';

// ============================================================
// SHARED TYPES
// ============================================================
interface TeachingMaterial {
  id: string;
  teacher_id: string;
  class_id: string | null;
  title: string;
  subject: string;
  description: string | null;
  content: string | null;
  file_url: string | null;
  file_type: string;
  created_at: string;
  class_name?: string | null;
  topic?: string | null;
  learning_objectives?: string | null;
  tags?: string | null;
  material_type?: string;
  thumbnail_url?: string | null;
  label_color?: string;
  access_level?: string;
  is_published?: boolean;
  is_favorite?: boolean;
  allow_comments?: boolean;
  notify_students?: boolean;
  file_size?: number | null;
  status?: string;
}

interface QuestionBank {
  id: string;
  teacher_id: string;
  class_id: string | null;
  title: string;
  subject: string;
  description: string | null;
  questions: QuestionItem[];
  created_at: string;
  class_name?: string | null;
}

interface Survey {
  id: string;
  teacher_id: string;
  class_id: string | null;
  title: string;
  description: string | null;
  questions: QuestionItem[];
  created_at: string;
  class_name?: string | null;
}

interface ClassPreparation {
  id: string;
  teacher_id: string;
  class_id: string;
  schedule_id: string | null;
  material_id: string | null;
  question_bank_id: string | null;
  survey_id: string | null;
  title: string;
  notes: string | null;
  preparation_date: string;
  created_at: string;
}

interface KelasOption {
  id: string;
  name: string;
}

interface QuestionItem {
  id: number;
  text: string;
  type: string;
}

const fmtDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtTime = (t: string) => t.slice(0, 5);

// ============================================================
// BAHAN AJAR PAGE
// ============================================================
export function BahanAjarPage({ teacherId }: { teacherId: string }) {
  const [materials, setMaterials] = useState<(TeachingMaterial & { class_name?: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<TeachingMaterial | null>(null);
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState<KelasOption[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [matRes, classRes] = await Promise.all([
      supabase.from('teaching_materials').select('*, classes(name)').eq('teacher_id', teacherId).order('created_at', { ascending: false }),
      supabase.from('classes').select('id, name').eq('is_active', true).order('name'),
    ]);
    setMaterials((matRes.data || []).map((m: TeachingMaterial & { classes: { name: string } | null }) => ({
      ...m,
      class_name: m.classes?.name || null,
    })));
    setClasses(classRes.data || []);
    setLoading(false);
  }, [teacherId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus bahan ajar ini?')) return;
    await supabase.from('teaching_materials').delete().eq('id', id);
    load();
  };

  const filtered = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bahan Ajar</h2>
          <p className="text-sm text-slate-500">{materials.length} bahan ajar tersimpan</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari bahan ajar..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="Belum ada bahan ajar" desc="Tambahkan bahan ajar pertama Anda untuk mulai mengajar." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{m.title}</p>
                  <p className="text-xs text-slate-500">{m.subject}{m.class_name ? ` · ${m.class_name}` : ''}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${m.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {m.status === 'published' ? 'Terbit' : 'Draft'}
                </span>
              </div>
              {m.description && <p className="text-sm text-slate-500 mb-3 line-clamp-2">{m.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{fmtDate(m.created_at)}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditItem(m); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BahanAjarForm
          teacherId={teacherId}
          classes={classes}
          editItem={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); load(); }}
        />
      )}
    </div>
  );
}

function BahanAjarForm({ teacherId, classes, editItem, onClose, onSaved }: {
  teacherId: string;
  classes: KelasOption[];
  editItem: TeachingMaterial | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(editItem?.title || '');
  const [subject, setSubject] = useState(editItem?.subject || '');
  const [classId, setClassId] = useState(editItem?.class_id || '');
  const [topic, setTopic] = useState(editItem?.topic || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [learningObjectives, setLearningObjectives] = useState(editItem?.learning_objectives || '');
  const [tags, setTags] = useState(editItem?.tags || '');
  const [materialType, setMaterialType] = useState(editItem?.material_type || 'document');
  const [labelColor, setLabelColor] = useState(editItem?.label_color || 'blue');
  const [accessLevel, setAccessLevel] = useState(editItem?.access_level || 'class');
  const [isPublished, setIsPublished] = useState(editItem?.is_published ?? true);
  const [isFavorite, setIsFavorite] = useState(editItem?.is_favorite ?? false);
  const [allowComments, setAllowComments] = useState(editItem?.allow_comments ?? true);
  const [notifyStudents, setNotifyStudents] = useState(editItem?.notify_students ?? true);
  const [thumbnailUrl, setThumbnailUrl] = useState(editItem?.thumbnail_url || '');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; url: string; type: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const SUBJECTS = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'IPA', 'IPS', 'PPKn', 'Informatika', 'Seni Budaya', 'PJOK', 'Prakarya'];
  const MATERIAL_TYPES = [
    { key: 'document', label: 'Dokumen', icon: FileText },
    { key: 'video', label: 'Video', icon: FileVideo },
    { key: 'presentation', label: 'Presentasi', icon: ClipboardList },
    { key: 'audio', label: 'Audio', icon: FileAudio },
    { key: 'link', label: 'Link/Lainnya', icon: Link2 },
  ];
  const COLORS = [
    { key: 'blue', hex: '#3b82f6' },
    { key: 'orange', hex: '#f97316' },
    { key: 'green', hex: '#22c55e' },
    { key: 'cyan', hex: '#06b6d4' },
    { key: 'pink', hex: '#ec4899' },
    { key: 'teal', hex: '#14b8a6' },
  ];
  const ACCEPTED_TYPES = '.pdf,.pptx,.docx,.mp4,.mp3,.jpg,.png';

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const filePath = `${teacherId}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage.from('meeting-materials').upload(filePath, file);
    if (error) {
      alert('Gagal mengunggah: ' + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('meeting-materials').getPublicUrl(filePath);
    setUploadedFile({ name: file.name, size: file.size, url: urlData.publicUrl, type: file.name.split('.').pop() || '' });
    setUploading(false);
  };

  const handleThumbUpload = async (file: File) => {
    setUploadingThumb(true);
    const filePath = `${teacherId}/thumb-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage.from('meeting-materials').upload(filePath, file);
    if (error) {
      alert('Gagal mengunggah gambar: ' + error.message);
      setUploadingThumb(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('meeting-materials').getPublicUrl(filePath);
    setThumbnailUrl(urlData.publicUrl);
    setUploadingThumb(false);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const onThumbInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleThumbUpload(file);
  };

  const submit = async (publish: boolean) => {
    setSaving(true);
    const payload = {
      teacher_id: teacherId,
      title, subject,
      class_id: classId || null,
      topic: topic || null,
      description: description || null,
      learning_objectives: learningObjectives || null,
      tags: tags || null,
      material_type: materialType,
      label_color: labelColor,
      access_level: accessLevel,
      is_published: publish,
      is_favorite: isFavorite,
      allow_comments: allowComments,
      notify_students: notifyStudents,
      thumbnail_url: thumbnailUrl || null,
      file_url: uploadedFile?.url || editItem?.file_url || null,
      file_type: uploadedFile?.type || editItem?.file_type || materialType,
      file_size: uploadedFile?.size || editItem?.file_size || null,
      status: publish ? 'published' : 'draft',
    };
    if (editItem) {
      await supabase.from('teaching_materials').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('teaching_materials').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <span className="text-slate-300">|</span>
          <h2 className="text-base font-bold text-slate-900">{editItem ? 'Edit Bahan Ajar' : 'Tambah Bahan Ajar'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => submit(false)}
            disabled={saving}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Simpan sebagai Draft
          </button>
          <button
            onClick={() => submit(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Simpan & Publikasikan
          </button>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT COLUMN - Informasi Bahan Ajar */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Informasi Bahan Ajar
              </h3>

              {/* Title */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Judul Bahan Ajar <span className="text-rose-500">*</span></label>
                <input
                  required
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="Contoh: Persamaan Linear Satu Variabel"
                />
                <span className="text-xs text-slate-400 mt-1 block text-right">{title.length}/100</span>
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Deskripsi Singkat <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  value={description}
                  maxLength={300}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="Jelaskan secara singkat isi dan tujuan bahan ajar ini..."
                />
                <span className="text-xs text-slate-400 mt-1 block text-right">{description.length}/300</span>
              </div>

              {/* 3 dropdowns */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Kelas <span className="text-rose-500">*</span></label>
                  <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                    <option value="">Pilih kelas</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Mata Pelajaran <span className="text-rose-500">*</span></label>
                  <select required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                    <option value="">Pilih mapel</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Topik / Materi <span className="text-rose-500">*</span></label>
                  <input required value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="Topik materi" />
                </div>
              </div>

              {/* Learning objectives */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tujuan Pembelajaran</label>
                <textarea
                  value={learningObjectives}
                  maxLength={200}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm min-h-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
                />
                <span className="text-xs text-slate-400 mt-1 block text-right">{learningObjectives.length}/200</span>
              </div>

              {/* Tags */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tag / Kata Kunci</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="Contoh: persamaan, aljabar, variabel"
                />
                <p className="text-xs text-slate-400 mt-1">Pisahkan tag dengan koma. Tag membantu pencarian bahan ajar.</p>
              </div>

              {/* Material type selector */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Jenis Bahan Ajar</label>
                <div className="flex gap-2 flex-wrap">
                  {MATERIAL_TYPES.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMaterialType(key)}
                      className={`inline-flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 transition-all min-w-[90px] ${
                        materialType === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File upload dropzone */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Unggah File <span className="text-rose-500">*</span></label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl py-8 px-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-sm text-slate-500">Mengunggah...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <UploadCloud className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">Seret & lepas file di sini atau klik untuk memilih</p>
                      <p className="text-xs text-slate-400">Mendukung: PDF, PPTX, DOCX, MP4, MP3, JPG, PNG (Maks. 100 MB)</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" accept={ACCEPTED_TYPES} onChange={onFileInput} />
                </div>

                {/* Uploaded file row */}
                {(uploadedFile || (editItem?.file_url && !uploadedFile)) && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{uploadedFile?.name || 'File existing'}</p>
                      <p className="text-xs text-slate-400">{uploadedFile ? fmtFileSize(uploadedFile.size) : 'File tersimpan'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="p-1 rounded text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                      aria-label="Hapus file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Settings */}
          <div className="space-y-5">
            {/* Pengaturan Tampilan */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-5">Pengaturan Tampilan</h3>

              {/* Thumbnail */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Sampul / Thumbnail</label>
                <div
                  onClick={() => thumbInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl py-6 px-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {uploadingThumb ? (
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                  ) : thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Thumbnail" className="max-h-24 mx-auto rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">Pilih Gambar</button>
                    </div>
                  )}
                  <input ref={thumbInputRef} type="file" className="hidden" accept=".jpg,.png" onChange={onThumbInput} />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">JPG, PNG maks. 2MB</p>
              </div>

              {/* Label color */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Warna Label</label>
                <div className="flex gap-2.5">
                  {COLORS.map(({ key, hex }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setLabelColor(key)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        labelColor === key ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: hex }}
                      aria-label={`Warna ${key}`}
                    >
                      {labelColor === key && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Access level */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tingkat Akses</label>
                <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                  <option value="class">Siswa di kelas ini</option>
                  <option value="public">Semua siswa (publik)</option>
                  <option value="private">Privat (hanya saya)</option>
                </select>
                <p className="text-xs text-slate-400 mt-1.5">Mengatur siapa yang dapat melihat bahan ajar ini.</p>
              </div>
            </div>

            {/* Opsi Tambahan */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Opsi Tambahan</h3>

              <ToggleRow
                icon={Globe}
                title="Publikasikan sekarang"
                desc="Bahan ajar langsung tersedia untuk siswa"
                checked={isPublished}
                onChange={setIsPublished}
              />
              <ToggleRow
                icon={Star}
                title="Tandai sebagai favorit"
                desc="Akan ditampilkan di bagian favorit"
                checked={isFavorite}
                onChange={setIsFavorite}
              />
              <ToggleRow
                icon={MessageSquare}
                title="Izinkan komentar"
                desc="Siswa dapat memberikan komentar"
                checked={allowComments}
                onChange={setAllowComments}
              />
              <ToggleRow
                icon={Bell}
                title="Notifikasi ke siswa"
                desc="Beritahu siswa tentang bahan ajar ini"
                checked={notifyStudents}
                onChange={setNotifyStudents}
              />

              {/* Tips box */}
              <div className="mt-5 rounded-lg bg-blue-50 border border-blue-100 p-3 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">Pastikan bahan ajar yang Anda unggah relevan, berkualitas, dan sesuai dengan tujuan pembelajaran.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, title, desc, checked, onChange }: {
  icon: typeof Globe;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-start gap-2.5 flex-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${checked ? 'bg-blue-100' : 'bg-slate-100'}`}>
          <Icon className={`w-4 h-4 ${checked ? 'text-blue-600' : 'text-slate-400'}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-1 ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
        aria-label={title}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

function fmtFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================================
// KUMPULAN SOAL PAGE
// ============================================================
export function KumpulanSoalPage({ teacherId }: { teacherId: string }) {
  const [banks, setBanks] = useState<(QuestionBank & { class_name?: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<QuestionBank | null>(null);
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState<KelasOption[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [qbRes, classRes] = await Promise.all([
      supabase.from('question_banks').select('*, classes(name)').eq('teacher_id', teacherId).order('created_at', { ascending: false }),
      supabase.from('classes').select('id, name').eq('is_active', true).order('name'),
    ]);
    setBanks((qbRes.data || []).map((q: QuestionBank & { classes: { name: string } | null }) => ({
      ...q,
      class_name: q.classes?.name || null,
    })));
    setClasses(classRes.data || []);
    setLoading(false);
  }, [teacherId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kumpulan soal ini?')) return;
    await supabase.from('question_banks').delete().eq('id', id);
    load();
  };

  const filtered = banks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kumpulan Soal</h2>
          <p className="text-sm text-slate-500">{banks.length} set soal tersimpan</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari soal..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={ListChecks} title="Belum ada soal" desc="Buat kumpulan soal pertama Anda untuk evaluasi siswa." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <ListChecks className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{b.title}</p>
                  <p className="text-xs text-slate-500">{b.subject}{b.class_name ? ` · ${b.class_name}` : ''}</p>
                </div>
              </div>
              {b.description && <p className="text-sm text-slate-500 mb-3 line-clamp-2">{b.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{fmtDate(b.created_at)}</span>
                  <span className="inline-flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{Array.isArray(b.questions) ? b.questions.length : 0} soal</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditItem(b); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SoalForm
          teacherId={teacherId}
          classes={classes}
          editItem={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); load(); }}
        />
      )}
    </div>
  );
}

function SoalForm({ teacherId, classes, editItem, onClose, onSaved }: {
  teacherId: string;
  classes: KelasOption[];
  editItem: QuestionBank | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(editItem?.title || '');
  const [subject, setSubject] = useState(editItem?.subject || '');
  const [classId, setClassId] = useState(editItem?.class_id || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [questions, setQuestions] = useState<QuestionItem[]>(editItem?.questions || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions([...questions, { id: Date.now(), text: newQuestion.trim(), type: 'essay' }]);
    setNewQuestion('');
  };

  const removeQuestion = (id: number) => setQuestions(questions.filter((q) => q.id !== id));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      teacher_id: teacherId,
      title, subject,
      class_id: classId || null,
      description: description || null,
      questions,
    };
    if (editItem) {
      await supabase.from('question_banks').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('question_banks').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <ModalForm title={editItem ? 'Edit Kumpulan Soal' : 'Tambah Kumpulan Soal'} onClose={onClose} saving={saving} onSubmit={submit}>
      <Field label="Judul"><input required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Latihan Soal Bab 1" /></Field>
      <Field label="Mata Pelajaran"><input required value={subject} onChange={(e) => setSubject(e.target.value)} className="form-input" placeholder="Matematika" /></Field>
      <Field label="Kelas (opsional)">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="form-input">
          <option value="">Pilih kelas</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Deskripsi (opsional)"><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-input min-h-[60px]" placeholder="Deskripsi singkat" /></Field>
      <Field label="Daftar Soal">
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-400 font-mono shrink-0">{i + 1}.</span>
              <span className="text-sm text-slate-700 flex-1">{q.text}</span>
              <button type="button" onClick={() => removeQuestion(q.id)} className="text-rose-400 hover:text-rose-600 shrink-0"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addQuestion(); } }}
              placeholder="Tulis soal baru..."
              className="form-input flex-1"
            />
            <button type="button" onClick={addQuestion} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 shrink-0 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Tambah</button>
          </div>
        </div>
      </Field>
    </ModalForm>
  );
}

// ============================================================
// KUMPULAN ANGKET PAGE
// ============================================================
export function KumpulanAngketPage({ teacherId }: { teacherId: string }) {
  const [surveys, setSurveys] = useState<(Survey & { class_name?: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Survey | null>(null);
  const [search, setSearch] = useState('');
  const [classes, setClasses] = useState<KelasOption[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [surRes, classRes] = await Promise.all([
      supabase.from('surveys').select('*, classes(name)').eq('teacher_id', teacherId).order('created_at', { ascending: false }),
      supabase.from('classes').select('id, name').eq('is_active', true).order('name'),
    ]);
    setSurveys((surRes.data || []).map((s: Survey & { classes: { name: string } | null }) => ({
      ...s,
      class_name: s.classes?.name || null,
    })));
    setClasses(classRes.data || []);
    setLoading(false);
  }, [teacherId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus angket ini?')) return;
    await supabase.from('surveys').delete().eq('id', id);
    load();
  };

  const filtered = surveys.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Kumpulan Angket</h2>
          <p className="text-sm text-slate-500">{surveys.length} angket tersimpan</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari angket..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileQuestion} title="Belum ada angket" desc="Buat angket untuk mengumpulkan feedback dari siswa." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                  <FileQuestion className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{s.title}</p>
                  <p className="text-xs text-slate-500">{s.class_name || 'Semua kelas'}</p>
                </div>
              </div>
              {s.description && <p className="text-sm text-slate-500 mb-3 line-clamp-2">{s.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{fmtDate(s.created_at)}</span>
                  <span className="inline-flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" />{Array.isArray(s.questions) ? s.questions.length : 0} pertanyaan</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditItem(s); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AngketForm
          teacherId={teacherId}
          classes={classes}
          editItem={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); load(); }}
        />
      )}
    </div>
  );
}

function AngketForm({ teacherId, classes, editItem, onClose, onSaved }: {
  teacherId: string;
  classes: KelasOption[];
  editItem: Survey | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(editItem?.title || '');
  const [classId, setClassId] = useState(editItem?.class_id || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [questions, setQuestions] = useState<QuestionItem[]>(editItem?.questions || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions([...questions, { id: Date.now(), text: newQuestion.trim(), type: 'scale' }]);
    setNewQuestion('');
  };

  const removeQuestion = (id: number) => setQuestions(questions.filter((q) => q.id !== id));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      teacher_id: teacherId,
      title,
      class_id: classId || null,
      description: description || null,
      questions,
    };
    if (editItem) {
      await supabase.from('surveys').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('surveys').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <ModalForm title={editItem ? 'Edit Angket' : 'Tambah Angket'} onClose={onClose} saving={saving} onSubmit={submit}>
      <Field label="Judul"><input required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Angket Minat Belajar" /></Field>
      <Field label="Kelas (opsional)">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="form-input">
          <option value="">Pilih kelas</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Deskripsi (opsional)"><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-input min-h-[60px]" placeholder="Deskripsi singkat" /></Field>
      <Field label="Daftar Pertanyaan">
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-400 font-mono shrink-0">{i + 1}.</span>
              <span className="text-sm text-slate-700 flex-1">{q.text}</span>
              <button type="button" onClick={() => removeQuestion(q.id)} className="text-rose-400 hover:text-rose-600 shrink-0"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addQuestion(); } }}
              placeholder="Tulis pertanyaan baru..."
              className="form-input flex-1"
            />
            <button type="button" onClick={addQuestion} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 shrink-0 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Tambah</button>
          </div>
        </div>
      </Field>
    </ModalForm>
  );
}

// ============================================================
// PERSIAPAN KELAS PAGE
// Guru memilih jadwal, lalu melink bahan ajar, soal, dan angket
// ============================================================
export function PersiapanKelasPage({ teacherId }: { teacherId: string }) {
  const [schedules, setSchedules] = useState<(Schedule & { class_name: string })[]>([]);
  const [preparations, setPreparations] = useState<(ClassPreparation & { class_name: string; material_title?: string; question_bank_title?: string; survey_title?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ClassPreparation | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [schedRes, prepRes] = await Promise.all([
      supabase.from('schedules').select('*, classes!inner(name)').eq('teacher_id', teacherId).order('day').order('start_time'),
      supabase.from('class_preparations').select('*, classes(name), teaching_materials(title), question_banks(title), surveys(title)').eq('teacher_id', teacherId).order('preparation_date', { ascending: false }),
    ]);
    setSchedules((schedRes.data || []).map((s: Schedule & { classes: { name: string } }) => ({
      ...s,
      class_name: s.classes?.name || '-',
    })));
    setPreparations((prepRes.data || []).map((p: ClassPreparation & {
      classes: { name: string } | null;
      teaching_materials: { title: string } | null;
      question_banks: { title: string } | null;
      surveys: { title: string } | null;
    }) => ({
      ...p,
      class_name: p.classes?.name || '-',
      material_title: p.teaching_materials?.title,
      question_bank_title: p.question_banks?.title,
      survey_title: p.surveys?.title,
    })));
    setLoading(false);
  }, [teacherId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus persiapan kelas ini?')) return;
    await supabase.from('class_preparations').delete().eq('id', id);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Persiapan Kelas</h2>
          <p className="text-sm text-slate-500">{preparations.length} persiapan tersimpan · {schedules.length} jadwal tersedia</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Buat Persiapan
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-600 animate-spin" /></div>
      ) : preparations.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Belum ada persiapan kelas" desc="Buat persiapan kelas dengan melink bahan ajar, soal, dan angket dari koleksi Anda." />
      ) : (
        <div className="space-y-3">
          {preparations.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.class_name} · {fmtDate(p.preparation_date)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setEditItem(p); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {p.notes && <p className="text-sm text-slate-500 mb-3">{p.notes}</p>}
              <div className="flex flex-wrap gap-2">
                {p.material_title && (
                  <LinkBadge icon={BookOpen} label={p.material_title} color="emerald" />
                )}
                {p.question_bank_title && (
                  <LinkBadge icon={ListChecks} label={p.question_bank_title} color="amber" />
                )}
                {p.survey_title && (
                  <LinkBadge icon={FileQuestion} label={p.survey_title} color="sky" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PersiapanForm
          teacherId={teacherId}
          schedules={schedules}
          editItem={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSaved={() => { setShowForm(false); setEditItem(null); load(); }}
        />
      )}
    </div>
  );
}

function PersiapanForm({ teacherId, schedules, editItem, onClose, onSaved }: {
  teacherId: string;
  schedules: (Schedule & { class_name: string })[];
  editItem: ClassPreparation | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(editItem?.title || '');
  const [scheduleId, setScheduleId] = useState(editItem?.schedule_id || '');
  const [materialId, setMaterialId] = useState(editItem?.material_id || '');
  const [questionBankId, setQuestionBankId] = useState(editItem?.question_bank_id || '');
  const [surveyId, setSurveyId] = useState(editItem?.survey_id || '');
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [prepDate, setPrepDate] = useState(editItem?.preparation_date || new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    (async () => {
      const [mRes, qRes, sRes] = await Promise.all([
        supabase.from('teaching_materials').select('*').eq('teacher_id', teacherId).order('title'),
        supabase.from('question_banks').select('*').eq('teacher_id', teacherId).order('title'),
        supabase.from('surveys').select('*').eq('teacher_id', teacherId).order('title'),
      ]);
      setMaterials(mRes.data || []);
      setQuestionBanks(qRes.data || []);
      setSurveys(sRes.data || []);
    })();
  }, [teacherId]);

  const selectedSchedule = schedules.find((s) => s.id === scheduleId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      teacher_id: teacherId,
      title,
      schedule_id: scheduleId || null,
      class_id: selectedSchedule?.class_id || null,
      material_id: materialId || null,
      question_bank_id: questionBankId || null,
      survey_id: surveyId || null,
      notes: notes || null,
      preparation_date: prepDate,
    };
    if (editItem) {
      await supabase.from('class_preparations').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('class_preparations').insert(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <ModalForm title={editItem ? 'Edit Persiapan Kelas' : 'Buat Persiapan Kelas'} onClose={onClose} saving={saving} onSubmit={submit}>
      <Field label="Judul Persiapan"><input required value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Persiapan Matematika - Pertemuan 1" /></Field>
      <Field label="Tanggal"><input type="date" required value={prepDate} onChange={(e) => setPrepDate(e.target.value)} className="form-input" /></Field>
      <Field label="Pilih Jadwal (opsional)">
        <select value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} className="form-input">
          <option value="">Pilih jadwal mengajar</option>
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>{s.day} · {s.subject} · {s.class_name} · {fmtTime(s.start_time)}</option>
          ))}
        </select>
      </Field>
      <Field label="Link Bahan Ajar (opsional)">
        <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="form-input">
          <option value="">Pilih bahan ajar</option>
          {materials.map((m) => <option key={m.id} value={m.id}>{m.title} · {m.subject}</option>)}
        </select>
      </Field>
      <Field label="Link Kumpulan Soal (opsional)">
        <select value={questionBankId} onChange={(e) => setQuestionBankId(e.target.value)} className="form-input">
          <option value="">Pilih kumpulan soal</option>
          {questionBanks.map((q) => <option key={q.id} value={q.id}>{q.title} · {q.subject}</option>)}
        </select>
      </Field>
      <Field label="Link Angket (opsional)">
        <select value={surveyId} onChange={(e) => setSurveyId(e.target.value)} className="form-input">
          <option value="">Pilih angket</option>
          {surveys.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </Field>
      <Field label="Catatan (opsional)"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-input min-h-[80px]" placeholder="Catatan persiapan..." /></Field>
    </ModalForm>
  );
}

// ============================================================
// SHARED UI COMPONENTS
// ============================================================
function EmptyState({ icon: Icon, title, desc }: { icon: typeof BookOpen; title: string; desc: string }) {
  return (
    <div className="text-center py-16 text-slate-400">
      <Icon className="w-10 h-10 mx-auto mb-3 opacity-40" />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-xs mt-1">{desc}</p>
    </div>
  );
}

function LinkBadge({ icon: Icon, label, color }: { icon: typeof BookOpen; label: string; color: 'emerald' | 'amber' | 'sky' }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border ${colors[color]} px-2.5 py-1 text-xs font-medium`}>
      <Link2 className="w-3.5 h-3.5" />
      <Icon className="w-3.5 h-3.5" />
      <span className="truncate max-w-[200px]">{label}</span>
    </span>
  );
}

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
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
