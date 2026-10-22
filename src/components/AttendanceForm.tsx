import { useState } from 'react'
import { CheckCircle2, Heart, Send, XCircle } from 'lucide-react'

type Attendance = 'HADIR' | 'TIDAK HADIR'

export function AttendanceForm({ guestName, token, demoMode }: { guestName: string; token: string; demoMode: boolean }) {
  const [selection, setSelection] = useState<Attendance | null>(null)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ status: Attendance; message: string } | null>(null)
  const [error, setError] = useState('')

  async function submit() {
    if (!selection || saving) return
    if (!token) { setError('Link khusus tamu belum tersedia. Mintalah link pribadi dari panitia.'); return }
    if (selection === 'TIDAK HADIR' && !reason.trim()) { setError('Tuliskan alasan berhalangan hadir terlebih dahulu.'); return }
    setError('')
    setSaving(true)
    try {
      if (demoMode) {
        setResult({ status: selection, message: 'Mode demo: pilihan berhasil dicoba tetapi belum disimpan ke Google Sheets.' })
        return
      }
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, attendance: selection, reason: selection === 'TIDAK HADIR' ? reason.trim() : '' }),
      })
      const json: { ok?: boolean; error?: string } = await response.json()
      if (!response.ok || !json.ok) throw new Error(json.error || 'Gagal menyimpan konfirmasi. Coba lagi.')
      setResult({ status: selection, message: 'Konfirmasi tersimpan. Terima kasih! Panitia telah menerima jawaban Anda.' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tidak dapat menghubungi server. Periksa internet dan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="attendance-widget">
      {guestName ? <div className="attendance-greeting">Undangan untuk <strong>{guestName}</strong></div> : <div className="attendance-greeting">Konfirmasi kehadiran pribadi</div>}
      {!token && <p className="attendance-notice">Tautan ini belum dipersonalisasi. Untuk melakukan RSVP, buka tautan unik dari panitia.</p>}
      {result ? <div className="attendance-success" role="status">
        <CheckCircle2 size={34} />
        <h3>{result.status === 'HADIR' ? 'Sampai jumpa di perayaan Natal!' : 'Terima kasih atas konfirmasinya.'}</h3>
        <p>{result.message}</p>
        <button className="change-choice" type="button" onClick={() => { setResult(null); setSelection(null) }}>Ubah jawaban</button>
      </div> : <>
        <div className="attendance-options" role="group" aria-label="Pilihan kehadiran">
          <button disabled={!token || saving} type="button" className={`attendance-option ${selection === 'HADIR' ? 'selected' : ''}`} onClick={() => { setSelection('HADIR'); setError('') }} aria-pressed={selection === 'HADIR'}>
            <CheckCircle2 size={22} /> Bersedia Hadir
          </button>
          <button disabled={!token || saving} type="button" className={`attendance-option decline ${selection === 'TIDAK HADIR' ? 'selected' : ''}`} onClick={() => { setSelection('TIDAK HADIR'); setError('') }} aria-pressed={selection === 'TIDAK HADIR'}>
            <XCircle size={22} /> Tidak Dapat Hadir
          </button>
        </div>
        {selection === 'TIDAK HADIR' && <div className="attendance-reason"><label htmlFor="absence-reason">Alasan tidak dapat hadir <span>*</span></label><textarea id="absence-reason" maxLength={400} rows={3} placeholder="Mohon tuliskan alasan Anda..." value={reason} onChange={e => setReason(e.target.value)} /><small>{reason.length}/400 karakter</small></div>}
        {error && <p className="attendance-error" role="alert">{error}</p>}
        <button type="button" disabled={!token || !selection || saving} className="attendance-submit" onClick={submit}>{saving ? 'Menyimpan jawaban...' : <>Kirim Konfirmasi <Send size={16} /></>}</button>
        <p className="attendance-footnote"><Heart size={13} /> Jawaban dapat diperbarui sebelum acara. Status tersimpan di daftar panitia.</p>
      </>}
    </div>
  )
}
