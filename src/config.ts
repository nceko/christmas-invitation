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
  endsAt: '2026-12-18T21:00:00+07:00',
  rsvpDeadline: '2026-12-17T23:59:00+07:00',
  venue: 'GKNI SPA Sungai Deden',
  address: 'GKNI SPA Sungai Deden',
  mapsUrl: '',
  dressCode: 'Bebas Rapih',
  contactName: 'Panitia Natal',
  contactWhatsApp: '', 
  audioUrl: '/audio/christmas-bells.mp3',
  agenda: [
    { time: '19.00', title: 'Penyambutan & Pembukaan Ibadah', description: 'Tamu dan jemaat diharapkan datang tepat waktu.' },
    { time: '19.30', title: 'Ibadah Natal', description: 'Pujian, doa, dan pemberitaan firman.' },
    { time: '20.00', title: 'Persembahan Pujian Dari Jemaat', description: 'Persembahan Pujian dan Penampilan dari jemaat GKNI.' },
    { time: '20.30', title: 'Perayaan Natal', description: 'Pemberian Kenangan, Doorprize, Ramah Tamah dan Kesaksian.' },
    { time: '21.00', title: 'Ibadah Selesai', description: 'Penutupan ibadah dan ucapan terima kasih.' },
  ],
}
