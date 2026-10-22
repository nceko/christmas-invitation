/**
 * SATU-SATUNYA FILE YANG WAJIB DIEDIT UNTUK PERSONALISASI ACARA.
 * Ganti seluruh data contoh sebelum membagikan undangan.
 * Tanggal wajib ISO 8601 dengan offset WIB (+07:00), WITA (+08:00), WIT (+09:00).
 * RSVP menggunakan Google Sheets + Cloudflare Functions; TIDAK memerlukan Google Forms.
 */
export type AgendaItem = {
  time: string
  title: string
  description: string
}

export type InvitationConfig = {
  /** Hapus mode demo hanya setelah semua data acara dan link benar. */
  demoMode: boolean
  year: string
  organizer: string
  eyebrow: string
  headline: string
  theme: string
  verse: string
  verseReference: string
  introduction: string
  invitationMessage: string
  startsAt: string
  endsAt: string
  rsvpDeadline: string
  venue: string
  address: string
  mapsUrl: string
  dressCode: string
  contactName: string
  contactWhatsApp: string
  /** Opsional: file audio milik sendiri di /public/audio/natal.mp3 */
  audioUrl: string
  agenda: AgendaItem[]
}

export const invitation: InvitationConfig = {
  demoMode: false,
  year: '2026',
  organizer: 'GEREJA / KOMUNITAS ANDA',
  eyebrow: 'Dengan penuh sukacita, kami mengundang Anda',
  headline: 'Perayaan Natal',
  theme: 'Terang yang Membawa Harapan',
  verse: 'Terang itu bercahaya di dalam kegelapan dan kegelapan itu tidak menguasainya.',
  verseReference: 'Yohanes 1:5',
  introduction:
    'Dalam hangatnya kasih dan indahnya kebersamaan, mari merayakan anugerah Natal yang membawa terang, damai, dan harapan baru.',
  invitationMessage:
    'Kehadiran Anda dan keluarga akan menjadi sukacita dan berkat yang begitu berarti bagi kami.',
  // DATA CONTOH: Jumat 25 Desember 2026, pukul 17.00–20.00 WIB
  startsAt: '2026-12-25T17:00:00+07:00',
  endsAt: '2026-12-25T20:00:00+07:00',
  rsvpDeadline: '2026-12-22T23:59:00+07:00',
  venue: 'Nama Gereja / Gedung Pertemuan',
  address: 'Masukkan alamat lengkap acara di sini',
  mapsUrl: '',
  dressCode: 'Festive / Merah • Hijau • Emas',
  contactName: 'Panitia Natal',
  contactWhatsApp: '', // format 6281234567890 tanpa tanda + dan spasi
  audioUrl: '/audio/christmas-bells.mp3',
  agenda: [
    { time: '16.30', title: 'Registrasi & penyambutan', description: 'Penerimaan tamu dan ramah tamah.' },
    { time: '17.00', title: 'Ibadah Natal', description: 'Pujian, doa, dan pemberitaan firman.' },
    { time: '18.30', title: 'Persembahan sukacita', description: 'Penampilan spesial dan persembahan pujian.' },
    { time: '19.15', title: 'Perayaan & kebersamaan', description: 'Foto bersama, pembagian kasih, dan penutup.' },
  ],
}
