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
  organizer: 'GKNI SPA Sungai Deden',
  eyebrow: 'Dengan penuh sukacita, kami mengundang Anda',
  headline: 'Perayaan Natal',
  theme: 'Terang di Tengah Kegelapan',
  verse: 'Terang itu bercahaya di dalam kegelapan dan kegelapan itu tidak menguasainya.',
  verseReference: 'Yohanes 1:5',
  introduction:
    'Dalam hangatnya kasih dan indahnya kebersamaan, mari merayakan anugerah Natal yang membawa terang, damai, dan harapan baru.',
  invitationMessage:
    'Kehadiran Anda dan keluarga akan menjadi sukacita dan berkat yang begitu berarti bagi kami.',
  startsAt: '2026-12-18T19:00:00+07:00', 
  endsAt: '2026-12-18T23:00:00+07:00',
  rsvpDeadline: '2026-12-17T23:59:00+07:00',
  venue: 'GKNI SPA Sungai Deden',
  address: 'GKNI SPA Sungai Deden',
  mapsUrl: '',
  dressCode: 'Bebas Rapih',
  contactName: 'Panitia Natal',
  contactWhatsApp: '', 
  audioUrl: '/audio/christmas-bells.mp3',
  agenda: [
    { time: '19.30', title: 'Registrasi & penyambutan', description: 'Penerimaan tamu dan ramah tamah.' },
    { time: '20.00', title: 'Ibadah Natal', description: 'Pujian, doa, dan pemberitaan firman.' },
    { time: '21.30', title: 'Persembahan sukacita', description: 'Penampilan spesial dan persembahan pujian.' },
    { time: '22.15', title: 'Perayaan & kebersamaan', description: 'Foto bersama, pembagian kasih, dan penutup.' },
  ],
}
