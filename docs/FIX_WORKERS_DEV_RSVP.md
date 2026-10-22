# Fix: /api/rsvp menampilkan halaman undangan pada workers.dev

Source Natal Digital V5 menggunakan `functions/api/rsvp.ts` (Cloudflare **Pages Functions**). Deployment Anda menggunakan **Cloudflare Workers + Static Assets** dengan domain `workers.dev`. Pada Workers, direktori `functions/` **tidak didaftarkan sebagai route secara otomatis**. Dalam mode SPA, URL tak dikenal dapat menampilkan halaman utama React.

Patch ini **tidak mengubah desain, animasi, musik, Google Sheets, maupun validasi RSVP lama**. Hanya menambah entry point Cloudflare Workers yang memanggil handler RSVP yang sudah ada.

## 1. Pasang patch

Letakkan 2 file di folder yang sama dengan `package.json`:
- `wrangler.jsonc`
- `worker/index.ts`

Biarkan file asli `functions/api/rsvp.ts` tetap ada; **jangan dihapus**, karena worker baru mengimpornya.

Jika Worker kamu bukan bernama `christmas-invitation`, sesuaikan properti `name` di `wrangler.jsonc` persis dengan nama Worker pada dashboard Cloudflare. Di alamat contoh `christmas-invitation.nc-ekohidayat.workers.dev`, nama Worker adalah `christmas-invitation`.

## 2. Uji di Mac

```bash
npm ci
npm run build
# Memerlukan koneksi npm dan autentikasi Cloudflare untuk tahap deploy.
npx wrangler login
npx wrangler deploy
```

Perintah `npx wrangler deploy` menjalankan deployment Worker beserta folder `dist/`; jalankan **setelah** `npm run build`. Jika sudah menghubungkan GitHub ke Worker dan memakai auto deploy, lebih baik atur langkah 3, commit dan push, tanpa deploy manual.

## 3. Jika deploy otomatis melalui GitHub

Cloudflare Dashboard -> Workers & Pages -> `christmas-invitation` -> Settings -> Builds:
- Root directory: folder tempat `package.json` dan `wrangler.jsonc` berada
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main` (atau branch production milikmu)

Push patch ke repository. Tinjau log deployment sampai status sukses. Jangan commit file `.env`, `.dev.vars`, atau credential.

## 4. Secrets (wajib untuk RSVP)

Pada Worker **yang sama** di Cloudflare -> Settings -> Variables and Secrets, buat dua secret Production:

- `APPS_SCRIPT_URL` = URL deployment Google Apps Script yang berakhir `/exec`
- `RSVP_SHARED_SECRET` = secret yang ditampilkan dari Google Sheets -> menu Undangan Natal -> Lihat Kunci Cloudflare

Keduanya secret **server-side**; jangan menggunakan `VITE_`, jangan taruh di `src/config.ts`, jangan commit ke GitHub.

Jika secret baru ditambahkan, aktifkan deployment terbaru melalui Dashboard / redeploy. Worker menyimpan nilai secret di environment, bukan di `wrangler.jsonc`.

## 5. Cara tes

Buka: `https://christmas-invitation.nc-ekohidayat.workers.dev/api/rsvp`

Setelah Worker patch sudah benar, respons GET harus berupa JSON, contohnya:

```json
{"ok":true,"service":"natal-rsvp-v3","configured":true}
```

`service: natal-rsvp-v3` adalah versi layanan API lama yang memang tetap dipakai; **bukan** versi tema visual.

- Jika masih tampil halaman Natal: kode Worker baru belum terdeploy/aktif, atau `run_worker_first` belum terbaca; periksa `wrangler.jsonc`, build/deploy command, dan branch.
- Jika `configured:false`: dua secret belum aktif di **Worker tersebut**.
- Jika JSON `configured:true`: API menerima GET. **Belum menjamin Google Sheets bisa ditulis**; wajib tes RSVP sungguhan.

Untuk tes menulis Google Sheets: isi daftar tamu -> Generate Link -> buka undangan tamu pribadi -> klik Hadir / Tidak Hadir dengan alasan -> periksa kolom E/F/G di Google Sheets.

Jika terjadi 502 pada pengiriman RSVP, periksa Apps Script Web App: `Execute as Me`, akses `Anyone`, URL `/exec` yang tepat, dan deployment versi terbaru. URL `/exec` sendiri saat dibuka harus menampilkan JSON. Jangan bagikan nilai secret kepada siapa pun.

## Catatan keamanan

URL undangan berisi token akses tamu; jangan sebarkan seluruh daftar link, nomor HP atau spreadsheet ke publik. `run_worker_first` hanya mengarahkan `/api/*` ke Worker; aset dan halaman statis tetap berjalan seperti sebelumnya.
