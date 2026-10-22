export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; expired: boolean }

export function getTimeLeft(isoDate: string, now = Date.now()): TimeLeft {
  const diff = new Date(isoDate).getTime() - now
  if (!Number.isFinite(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  }
}

export function dateParts(iso: string) {
  const date = new Date(iso)
  const timezone = timezoneFromOffset(iso)
  return {
    day: new Intl.DateTimeFormat('id-ID', { day: '2-digit', timeZone: timezone }).format(date),
    month: new Intl.DateTimeFormat('id-ID', { month: 'long', timeZone: timezone }).format(date),
    year: new Intl.DateTimeFormat('id-ID', { year: 'numeric', timeZone: timezone }).format(date),
    weekday: new Intl.DateTimeFormat('id-ID', { weekday: 'long', timeZone: timezone }).format(date),
    time: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: timezone }).format(date).replace('.', ':'),
    tzLabel: iso.endsWith('+08:00') ? 'WITA' : iso.endsWith('+09:00') ? 'WIT' : 'WIB',
  }
}

function timezoneFromOffset(iso: string) {
  if (iso.endsWith('+08:00')) return 'Asia/Makassar'
  if (iso.endsWith('+09:00')) return 'Asia/Jayapura'
  return 'Asia/Jakarta'
}

export function makeGoogleCalendarUrl(event: { title: string; startsAt: string; endsAt: string; location: string; description: string }) {
  const asUTC = (iso: string) => new Date(iso).toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}Z$/, 'Z')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${asUTC(event.startsAt)}/${asUTC(event.endsAt)}`,
    details: event.description,
    location: event.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function whatsappLink(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, '')
  if (!/^\d{8,15}$/.test(digits)) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
