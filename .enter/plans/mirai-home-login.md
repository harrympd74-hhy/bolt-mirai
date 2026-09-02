# Rencana: Panel Teman AI Guru dengan Tautan Eksternal dan Fallback MIRAI

## Context
Guru meminta Teman AI pada dasbor guru berfungsi seperti mini-browser: menyediakan empat pilihan AI eksternal (GPT, Gemini, DeepSeek, Claude), guru login langsung di situs resmi AI tersebut, dan tidak ada password akun eksternal yang disimpan MIRAI. Jika tautan tidak tersedia atau gagal dibuka, guru tetap memakai Teman AI UjiBetaversiMIrai.

## Pendekatan
1. Refactor `TemanAI` menjadi panel workspace dengan kartu empat provider, status tautan, tombol buka di tab baru, dan area percakapan fallback UjiBetaversiMIrai.
2. Gunakan URL resmi eksternal melalui `window.open`/tautan biasa; jangan iframe login dan jangan menangkap username/password/API key.
3. Simpan hanya provider terakhir yang dipilih dan riwayat prompt lokal non-rahasia; tidak menyimpan kredensial, token, cookie, atau isi password.
4. Jika `window.open` diblokir atau URL tidak tersedia, tampilkan pesan dan aktifkan panel UjiBetaversiMIrai sebagai fallback otomatis.
5. Tetap gunakan backend AI MIRAI yang sudah ada hanya untuk fallback internal, bukan untuk meneruskan kredensial provider eksternal.

## File yang dibuat/diubah
- `src/pages/guru/TemanAI.tsx`: provider picker, external links, fallback chat, riwayat lokal aman.
- `src/components/guru/AIProviderLauncher.tsx`: kartu/link provider reusable bila diperlukan.
- `src/pages/guru/Beranda.tsx`: tetap memakai TemanAI tanpa mengubah layout dashboard lain.

## Provider
- GPT: `https://chatgpt.com/`
- Gemini: `https://gemini.google.com/`
- DeepSeek: `https://chat.deepseek.com/`
- Claude: `https://claude.ai/`

## Batasan keamanan
- Login terjadi langsung di situs provider.
- MIRAI tidak menyimpan password, API key, access token, cookie, atau data kredensial.
- Jangan menambahkan provider secret ke frontend atau localStorage.
- Riwayat lokal dapat dihapus dan diberi label tersimpan di perangkat saat ini.

## Implementation checklist
- [ ] Buat kartu empat provider dengan tombol Buka.
- [ ] Implementasikan pembukaan tautan eksternal di tab baru dengan fallback jika diblokir.
- [ ] Tambahkan provider aktif dan fallback UjiBetaversiMIrai.
- [ ] Simpan hanya provider terakhir/riwayat prompt non-rahasia di localStorage.
- [ ] Tambahkan tombol hapus riwayat lokal.
- [ ] Pertahankan percakapan fallback Teman AI.
- [ ] Jalankan `pnpm run check` dan `pnpm run build`.

## Verification checklist
- [ ] Empat tombol provider membuka situs resmi di tab baru.
- [ ] Tidak ada form login/password provider di MIRAI.
- [ ] Jika tab diblokir, fallback UjiBetaversiMIrai terlihat dan dapat dipakai.
- [ ] Provider terakhir dan riwayat prompt dapat dipulihkan pada perangkat yang sama.
- [ ] Tombol hapus riwayat menghapus data lokal.
- [ ] Tidak ada secret/token/cookie tersimpan di localStorage.
- [ ] `pnpm run check` dan `pnpm run build` berhasil.
