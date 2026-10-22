# NATAL DIGITAL V5 — RED CHRISTMAS

Project undangan Natal gereja/komunitas. React + TypeScript + Vite + Tailwind CSS 4. **Satu halaman scroll, tanpa navbar.** Warna merah cranberry, hijau evergreen, dan emas. Animasi salju/ornamen, musik lokal 56 detik looping, kartu undangan personal, countdown, jadwal, lokasi, dan RSVP ke Google Sheets via Cloudflare Pages Functions + Apps Script.

**V5 tidak menggunakan `theme-v3.css` maupun `theme-v4.css`.** CSS visual hanya `src/styles.css`. Ini sengaja untuk menghilangkan konflik cascade versi sebelumnya.

## LANGKAH 1 — Jalankan V5 baru (bukan folder lama)

1. Extract file ZIP ini **ke folder baru**, misalnya `~/Documents/NATAL_V5_BERSIH/`. Jangan merge ke V3/V4 dulu.
2. Buka Terminal, masuk **ke folder `christmas-invitation-web` hasil extract**.
3. Jalankan:

```bash
npm ci
npm run diagnose
npm run dev
```

4. Buka **http://localhost:5199**. Port sengaja berbeda dari 5173 dan 5180. Jika port sudah dipakai, Vite akan mengeluarkan error daripada diam-diam memakai server lain. Matikan proses lama atau pilih port lain secara sadar.
5. **Buka http://localhost:5199/version.json**. Harus muncul `"version": "V5 RED CHRISTMAS"` (bukan HTML halaman website). Jika bukan JSON tersebut, kamu sedang membuka project/proses yang salah.
6. Buka undangan: sebelum ditap muncul cover **merah burgundy**; setelah tap muncul hero **merah** dengan judul Perayaan Natal, countdown **hijau**, detail dan RSVP **emas/hijau/merah**. Tidak ada navbar.
7. Jika tampilan tidak berubah, hentikan semua terminal Vite yang lama dengan `Ctrl+C`, tutup tab localhost lama, lalu ulangi dari folder hasil extract. Di terminal V5 jalankan `pwd` dan `npm run diagnose` untuk membuktikan folder aktif.

Untuk uji build di komputer kamu: `npm run typecheck && npm run build`.

## LANGKAH 2 — Personalisasi

Semua data acara terdapat di `src/config.ts`: `organizer`, `headline`, `theme`, `startsAt`, `endsAt`, `rsvpDeadline`, `venue`, `address`, `mapsUrl`, `agenda`, dan `audioUrl`.

`public/audio/christmas-bells.mp3` sudah disertakan. Browser dapat memblokir autoplay bersuara; tombol **BUKA UNDANGAN** memicu pemutaran melalui klik/tap pengguna dan ada kontrol play/pause di bawah.

## LANGKAH 3 — Google Sheets + RSVP

Ikuti `docs/SETUP_GOOGLE_SHEETS.md` (panduan lengkap instalasi). Alurnya:

1. Buat Google Sheets kosong → **Ekstensi → Apps Script** (script terikat ke spreadsheet).
2. Tempel seluruh `google-apps-script/Code.gs` ke file `Code.gs` bawaan; jangan membuat `Code.gs.gs`.
3. Save → jalankan `installOrCheck` (bukan `onOpen`) → berikan izin → refresh Sheets.
4. Isi nama tamu di kolom B dan nomor HP di C.
5. Deploy Apps Script sebagai Web App: **Execute as Me, Anyone**, salin URL `/exec`.
6. Deploy repository ini ke Cloudflare Pages (folder `functions/` harus ikut) dengan build `npm run build`, output `dist`.
7. Tambahkan secret Cloudflare: `APPS_SCRIPT_URL` dan `RSVP_SHARED_SECRET`, redeploy.
8. Isi `Konfigurasi!B2` dengan URL website Cloudflare; Generate Link Tamu dari menu 🎄 Undangan Natal.
9. Uji satu link: hadir → kolom E jadi Hadir; tidak hadir + alasan → kolom E/F/G diperbarui.

**PENTING:** Pada `npm run dev` lokal, Cloudflare Pages Functions **tidak berjalan**, jadi form RSVP belum dapat menulis langsung ke Google Sheets dari Vite dev server. Pengujian end-to-end lakukan pada deployment Cloudflare Pages / lingkungan Functions. Halaman dan musik tetap bisa diuji lokal.

## Deploy

Hubungkan GitHub ke Cloudflare Pages. Build command `npm run build`, output `dist`, Node 22. Source root `christmas-invitation-web` jika repository berisi folder ini, atau `/` bila file package.json berada di root. Pastikan `functions/api/rsvp.ts` tidak terhapus.

**Jangan commit nomor HP tamu, isi Google Sheets, atau `RSVP_SHARED_SECRET` ke GitHub.** Link pribadi tamu memiliki token rahasia dan sebaiknya dikirim langsung lewat WhatsApp, bukan diposting publik.

## Diagnostik cepat

- `npm run diagnose` → harus mengatakan V5, stylesheet tunggal, audio ada, dan tanpa navbar.
- `http://localhost:5199/version.json` → harus JSON V5.
- Tab browser lama `localhost:5180` boleh tetap menampilkan website lama; bukan alamat V5.
- Kode ini telah lolos pemeriksaan TypeScript serta simulasi alur Sheets → RSVP. Build bundler lokal perlu diuji pada macOS karena paket native Rollup Linux tidak tersedia di lingkungan pembuatan arsip.
