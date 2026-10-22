import { useState } from 'react'
import { CalendarPlus, Check, Copy, Share2 } from 'lucide-react'
import type { InvitationConfig } from '../config'
import { makeGoogleCalendarUrl } from '../lib/date'

export function EventActions({ event }: { event: InvitationConfig }) {
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')
  const calendarUrl = makeGoogleCalendarUrl({
    title: `${event.headline} — ${event.organizer}`,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    description: `${event.theme}. ${event.invitationMessage}`,
    location: `${event.venue}, ${event.address}`,
  })

  async function share() {
    const url = window.location.origin + window.location.pathname
    try {
      if (navigator.share) {
        await navigator.share({ title: `${event.headline} ${event.year}`, text: event.invitationMessage, url })
        return
      }
      if (!navigator.clipboard) throw new Error('Clipboard tidak tersedia')
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setNotice('Tidak dapat menyalin otomatis. Salin alamat dari browser Anda.')
    }
  }

  return (
    <div className="event-actions">
      <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="action-button action-button-outline"><CalendarPlus size={17}/> Tambah ke Kalender</a>
      <button className="action-button action-button-light" type="button" onClick={share}>
        {copied ? <Check size={17} /> : <Share2 size={17} />}{copied ? 'Link Tersalin' : 'Bagikan Undangan'}
      </button>
      {notice && <p className="share-notice" role="status"><Copy size={14} /> {notice}</p>}
    </div>
  )
}
