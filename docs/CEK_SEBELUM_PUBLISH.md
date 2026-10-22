# Checklist sebelum undangan Natal didistribusikan

- [ ] Semua teks demo di `src/config.ts` diganti dengan nama gereja, tanggal, lokasi, ayat, rundown dan kontak panitia yang valid.
- [ ] `demoMode: false` (sudah default di V3); backend belum terpasang akan menampilkan error jelas, bukan simpan palsu.
- [ ] Halaman single-scroll terlihat baik pada Android, iOS, dan desktop.
- [ ] Animasi ringan dan aksesibilitas pengguna yang memilih "reduced motion" tetap berjalan.
- [ ] Musik Natal bebas lisensi / milik sendiri; tombol Buka Undangan mengaktifkan musik dan tombol musik dapat mematikannya.
- [ ] Data `Tamu` di Google Sheets sudah benar (nama, nomor HP).
- [ ] `Konfigurasi!B2` berisi URL Cloudflare Pages produksi dan B3 batas waktu RSVP yang diinginkan.
- [ ] Menu installOrCheck berhasil dari editor Apps Script dan fungsi diagnostik tidak error.
- [ ] URL `/exec` Apps Script menampilkan JSON `natal-rsvp-v3`, URL `/api/rsvp` Cloudflare JSON `configured:true`.
- [ ] Di Cloudflare Pages terdapat `APPS_SCRIPT_URL` dan `RSVP_SHARED_SECRET` dalam Variables and Secrets, nilainya cocok.
- [ ] Menu "Generate / Perbarui Link" berhasil mengisi setiap baris tamu.
- [ ] Undangan tanpa `token` tidak dapat mengirim RSVP.
- [ ] Tamu uji dengan link pribadi dapat memilih Hadir; Google Sheets kolom E/G langsung berubah.
- [ ] Tamu uji dapat mengubah jawaban menjadi Tidak Hadir + alasan; Google Sheets kolom E/F/G langsung berubah.
- [ ] Klik "Bagikan Undangan" tidak membagikan link pribadi/token tamu lain.
- [ ] Tidak ada Spreadsheet atau file dengan nomor HP tamu di repository GitHub publik.
- [ ] `npm ci && npm run build` berhasil pada komputer developer dengan koneksi npm.
- [ ] Cloudflare Pages berstatus sukses dan dapat dibuka mode Incognito.
