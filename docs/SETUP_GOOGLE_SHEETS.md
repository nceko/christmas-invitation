# PANDUAN GOOGLE SHEETS + APPS SCRIPT UNTUK NATAL V5 (IKUTI BERURUTAN)

Sistem ini **TIDAK memakai Google Forms**. Tamu tidak memasukkan nama; panitia mengisi nama/HP di Google Sheets dan menghasilkan link pribadi. Tombol RSVP di website mengubah kolom Status, Alasan, dan Waktu Respons di Google Sheets.

## ALUR RINGKAS

1. Google Sheets baru (asli, bukan file XLSX dalam mode Office).
2. Dari **Google Sheets** klik **Ekstensi → Apps Script**.
3. Tempel isi `google-apps-script/Code.gs` ke file **Code.gs** yang sudah ada; **jangan buat file bernama `Code.gs.gs`**.
4. Save → pilih `installOrCheck` dari dropdown editor → Jalankan → Beri izin.
5. Kembali ke Google Sheets → refresh → menu **🎄 Undangan Natal** akan tampil.
6. Isi Google Sheets, deploy Apps Script → salin URL `/exec`.
7. Tambah 2 secret di Cloudflare Pages dan redeploy.
8. Generate link tamu → uji RSVP.

## LANGKAH A — MULAI DARI GOOGLE SHEETS

**Paling mudah: mulai dari spreadsheet KOSONG** (script V3 membuat seluruh tab sendiri):

1. Buka `https://sheets.google.com` dalam akun Google panitia, klik Blank spreadsheet.
2. Nama: `Undangan Natal — Daftar Tamu 2026`.
3. Klik `Ekstensi` → `Apps Script`. Penting: harus dari spreadsheet ini; **jangan buat Project baru langsung dari halaman Apps Script**.
4. Di kiri ada file default `Code.gs`. Klik file tersebut dan ganti isinya dengan SEMUA kode dari `google-apps-script/Code.gs`.
5. Dari screenshot sebelumnya terlihat file **Code.gs.gs**. Jika ada: hapus file ekstra atau rename menjadi **Code** di dialog penamaan (editor otomatis menambahkan `.gs`). **Sisakan satu file kode utama saja**.
6. Simpan dengan **Cmd+S (Mac)** / **Ctrl+S**.
7. Di dropdown fungsi di sebelah `Jalankan`, pilih **`installOrCheck`**, **BUKAN `onOpen`**.
8. Klik `Jalankan`. Muncul permintaan izin Google: pilih akun panitia, review izin, izinkan. Jika aplikasi buatan sendiri mendapat layar peringatan belum diverifikasi, baca nama project dan izin dengan saksama; gunakan hanya script yang kamu percayai.
9. Log eksekusi yang diharapkan: **`INSTALASI BERHASIL`**. Jika gagal menyebut `Script harus dibuka DARI Google Sheets`, berarti script belum terikat ke spreadsheet; ulangi dari langkah 1–4.
10. Kembali ke tab Google Sheets dan refresh. Sekarang ada menu **🎄 Undangan Natal**.

**Alternatif dengan template:** unggah file `TEMPLATE_TAMU_NATAL_V3.xlsx` ke Google Drive, buka dengan Google Sheets, lalu `File → Save as Google Sheets` agar menjadi file Sheets asli. Setelah itu baru Ekstensi → Apps Script; semua langkah di atas sama. Template XLSX sendiri tidak menjalankan Apps Script.

## LANGKAH B — ISI DATA PANITIA

Di tab `Tamu`:
- **B: Nama yang Diundang** (harus ada).
- **C: No HP** (format teks; boleh 0812... atau +62812...).
- **D–J: Jangan diisi manual**, dikelola Apps Script dan RSVP.

Di tab `Konfigurasi`:
- `B2`: URL FINAL Cloudflare Pages, contoh `https://undangan-natal-jemaat.pages.dev/`.
- `B3`: batas RSVP, opsional; masukkan sebagai teks ISO 8601, contoh `'2026-12-22T23:59:00+07:00` (apostrof depan berarti teks di Google Sheets). Jika tidak perlu batas, kosongkan.

Buka menu **🎄 Undangan Natal → 2. Lihat Kunci Cloudflare**. Salin kunci rahasia yang otomatis dibuat oleh `installOrCheck`. **JANGAN masukkan ke sel Sheet atau source code GitHub.**

## LANGKAH C — DEPLOY APPS SCRIPT

1. Kembali ke tab Apps Script.
2. Klik kanan-atas **Terapkan / Deploy → Deployment baru / New deployment**.
3. Klik **Select type (gear)** → **Web app / Aplikasi web**.
4. Description: `Natal RSVP V3`.
5. **Execute as / Jalankan sebagai:** `Me / Saya` (pemilik Spreadsheet).
6. **Who has access / Siapa yang dapat mengakses:** `Anyone / Siapa saja` (akses anonim jika tersedia). Ini diperlukan agar server Cloudflare bisa memanggil endpoint tanpa login Google.
7. Klik Deploy/Terapkan, berikan izin jika diminta, dan **salin URL yang berakhir dengan `/exec`**. Jangan gunakan `/dev` atau URL editor.
8. **Uji URL `/exec` di tab browser baru:** hasil yang benar semacam:

```json
{"ok":true,"service":"natal-rsvp-v3","configured":true}
```

Jika mendapatkan 403/404/halaman login, deployment atau akses belum benar. Jika domain Workspace tidak mengizinkan `Anyone`, perlu perubahan policy akun atau backend lain.

**Setelah mengubah `Code.gs`:** pilih **Deploy → Manage deployments → Edit (pensil) → Version: New version → Deploy**. Menekan Save di editor saja tidak memperbarui URL `/exec` yang sudah ter-deploy.

## LANGKAH D — CONNECT CLOUDFARE PAGES

Repository GitHub HARUS mencakup folder `functions/api/rsvp.ts` (tidak boleh hanya `dist`).

Pada halaman project **Cloudflare Workers & Pages → pilih Pages Project → Settings → Variables and Secrets**, tambahkan untuk **Production**:

- `APPS_SCRIPT_URL` = `https://script.google.com/macros/s/...../exec` (exact `/exec`).
- `RSVP_SHARED_SECRET` = kunci dari menu **Lihat Kunci Cloudflare**.

Gunakan jenis **Encrypted secret** untuk keduanya, terutama `RSVP_SHARED_SECRET`. Pastikan tidak memakai prefix `VITE_` untuk secret ini (agar tidak terbuka ke browser). **Redeploy produksi** setelah menyimpan secret.

**Tes Endpoint Cloudflare:** buka `https://NAMA.pages.dev/api/rsvp` di browser (metode GET). Harus menampilkan:

```json
{"ok":true,"service":"natal-rsvp-v3","configured":true}
```

Jika website menampilkan HTML alih-alih JSON, Pages Function belum ikut ter-deploy. Jika `configured:false`, secret belum tersedia di environment produksi atau belum redeploy.

## LANGKAH E — GENERATE LINK & UJI RESPONS NYATA

1. Pastikan `src/config.ts` punya **`demoMode: false`** dan website sudah di-build/deploy setelah perubahan.
2. Di Google Sheets tab `Tamu`, isi B2 = `Tamu Uji` dan C2 nomor milik panitia.
3. Menu **🎄 Undangan Natal → 3. Generate / Perbarui Link Tamu**.
4. Kolom **D** akan muncul link URL `...?to=Tamu%20Uji&token=...`, kolom **J** link WhatsApp.
5. Buka URL di kolom D, klik **Buka Undangan & Putar Musik**, scroll ke RSVP.
6. Tekan **Bersedia Hadir → Kirim Konfirmasi**.
7. Kembali Google Sheets: **E2 berubah jadi Hadir**, **G2 tanggal/waktu terisi**.
8. Di website klik **Ubah jawaban → Tidak Dapat Hadir**, isi alasan; cek **E2 = Tidak Hadir**, **F2 = alasan**, **G2 berubah**.
9. Uji lagi 1 link tamu lain sebelum mengirim link secara massal.

## KALAU GAGAL, PASTIKAN STATUS INI

| Tanda | Artinya / perbaikan |
|---|---|
| `Fungsi skrip tidak ditemukan: onOpen` | Pastikan file utama **Code.gs**, tidak `Code.gs.gs`; semua kode ter-paste dan disimpan; reload. Run `installOrCheck`, bukan onOpen. |
| Tidak ada menu 🎄 | Script HARUS dibuat dari Google Sheets; refresh Google Sheets setelah `installOrCheck`. |
| `Script harus dibuka DARI Google Sheets` | Project standalone, buat ulang dari Ekstensi → Apps Script di spreadsheet. |
| `/exec` tidak mengeluarkan JSON | Salah deployment / URL `/dev` / akses bukan Anyone; deploy ulang. |
| `/api/rsvp` bukan JSON | Folder `functions/` tidak dideploy (misalnya Direct Upload `dist` saja). Gunakan Git integration untuk seluruh repo. |
| `/api/rsvp` `configured:false` | Tambahkan secrets di Cloudflare Production dan deploy ulang. |
| Website mode demo | Pastikan `src/config.ts` `demoMode:false`, commit dan deploy lagi. |
| RSVP 400 token | Link bukan dari kolom D, atau token berubah karena mengganti nama tamu lalu regenerate. |
| RSVP gagal 502 | Pastikan Apps Script `/exec` publik, domain Google bisa diakses Cloudflare, dan status Google Apps Script executions. |
| RSVP gagal 503 | Cloudflare secrets belum tersedia di deployment aktif. |

Keamanan: siapa saja yang memegang link tamu bisa mengubah RSVP tamu tersebut (token = bearer link); hindari membagikan link unik di tempat publik. Jangan memberi akses ke Google Sheets kepada tamu. Shared secret tidak pernah di-commit ke GitHub.
