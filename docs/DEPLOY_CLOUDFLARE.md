# DEPLOY V4 KE CLOUDFLARE PAGES — GITHUB INTEGRATION

1. Di folder `christmas-invitation-web/`, `npm install` (Node >=22.12) dan `npm run build`. Hasil build di `dist/`.
2. Simpan **seluruh source project** (termasuk `functions/api/rsvp.ts`, `src/` dan `public/`) dalam repository GitHub. Jangan push `node_modules`, `dist`, spreadsheet dengan daftar tamu pribadi, atau secret.
3. Cloudflare Dashboard → **Workers & Pages → Create application → Pages → Connect to Git**. Hubungkan repository GitHub tersebut.
4. **Build command:** `npm run build` · **Build output directory:** `dist` · **Framework:** React (Vite) (atau Vite jika tersedia). **Root directory:** kosong jika package.json berada di root repository; atau `christmas-invitation-web` jika repo memiliki folder pembungkus.
5. Pastikan Node environment versi 22.x sesuai `.nvmrc`.
6. Deploy. URL website akan seperti `https://nama.pages.dev/`. Buka dan cari tanda `NATAL DIGITAL • V4 CRIMSON CHRISTMAS` di bagian bawah halaman untuk memastikan versi baru sudah aktif.
7. Isi `Konfigurasi!B2` di Google Sheets dengan URL tersebut.
8. Ikuti docs/SETUP_GOOGLE_SHEETS.md, sampai Web App Apps Script punya URL `/exec`.
9. Cloudflare Pages → Settings → Variables and Secrets (Production): simpan `APPS_SCRIPT_URL` dan `RSVP_SHARED_SECRET` **encrypted**.
10. Trigger **Redeploy** setelah mengubah secret / push commit kecil. Halaman `/api/rsvp` harus mengembalikan JSON health dengan `configured:true`.
11. Isi nama/HP di Google Sheets → generate link → buka link → submit RSVP → lihat status di Sheet.

**Penting:** Cloudflare Pages Functions di `functions/` berasal dari repository/source deployment. Jika hanya mengunggah folder `dist` melalui drag-and-drop dashboard, `/api/rsvp` tidak otomatis hadir. Gunakan integrasi Git repository atau deployment Wrangler yang juga menyertakan Functions.

## Sebelum kirim undangan

- Cek tanggal, jam, zona waktu, alamat, Google Maps, nomor panitia, rundown di `src/config.ts`.
- Pastikan `demoMode:false`; tidak ada pesan 'MODE DEMO' pada website.
- Test link tamu 1–2 baris dari Google Sheets; nama tampil tepat, dua jalur RSVP tersimpan.
- Musik diputar setelah tombol pembuka ditekan; browser umumnya memblokir musik bersuara sebelum interaksi.
- Jika hasil terbaru belum terlihat di Cloudflare, pastikan commit terbaru berhasil deployment (lihat build logs) dan hard refresh browser (`Cmd+Shift+R`).
