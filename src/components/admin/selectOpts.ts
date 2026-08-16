import { kelasOptions, statusOptions, hubunganWaliOptions } from "@/data/siswaStore";

export const SELECT_OPTS: Record<string, string[]> = {
  jenisKelamin: ["", "Laki-laki", "Perempuan"],
  agama: ["", "Islam", "Kristen", "Katolik", "Hindu", "Buddha"],
  statusPernikahan: ["", "Belum Menikah", "Menikah"],
  golongan: ["", "II/a", "II/b", "III/a", "III/b", "III/c", "III/d", "IV/a", "IV/b"],
  jabatan: ["Guru Mata Pelajaran", "Wali Kelas", "Kepala Sekolah", "Wakil Kepala Sekolah"],
  pendidikanTerakhir: ["", "D3", "S1", "S2", "S3"],
  statusSertifikasi: ["Belum Sertifikasi", "Dalam Proses", "Sudah Sertifikasi"],
  kelas: ["", ...kelasOptions],
  hubunganWali: ["", ...hubunganWaliOptions],
  status: statusOptions,
};
