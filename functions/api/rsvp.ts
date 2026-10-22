/** Cloudflare Pages Function — same-origin API, credential stays server-side. */
type Env = { APPS_SCRIPT_URL?: string; RSVP_SHARED_SECRET?: string }
type RequestContext = { request: Request; env: Env }
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
function respond(body: Record<string, unknown>, status = 200) { return new Response(JSON.stringify(body), { status, headers }) }

export async function onRequestPost({ request, env }: RequestContext): Promise<Response> {
  if (!env.APPS_SCRIPT_URL || !env.RSVP_SHARED_SECRET) return respond({ ok: false, error: 'RSVP belum dikonfigurasi oleh panitia.' }, 503)
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(env.APPS_SCRIPT_URL)) return respond({ ok: false, error: 'URL Apps Script tidak valid.' }, 503)
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return respond({ ok: false, error: 'Gunakan format JSON.' }, 415)
  if (Number(request.headers.get('Content-Length') || 0) > 4000) return respond({ ok: false, error: 'Permintaan terlalu panjang.' }, 413)
  let data: Record<string, unknown>
  try { data = await request.json() as Record<string, unknown> } catch { return respond({ ok: false, error: 'JSON tidak valid.' }, 400) }
  const token = typeof data.token === 'string' ? data.token.trim() : ''
  const attendance = data.attendance
  const reason = typeof data.reason === 'string' ? data.reason.trim() : ''
  if (!/^[a-f\d-]{32,80}$/i.test(token)) return respond({ ok: false, error: 'Token undangan tidak valid.' }, 400)
  if (attendance !== 'HADIR' && attendance !== 'TIDAK HADIR') return respond({ ok: false, error: 'Pilihan konfirmasi tidak valid.' }, 400)
  if (reason.length > 400 || (attendance === 'TIDAK HADIR' && !reason)) return respond({ ok: false, error: 'Alasan tidak hadir wajib diisi (maks. 400 karakter).' }, 400)
  try {
    const form = new URLSearchParams({ guest_token: token, attendance, absence_reason: attendance === 'HADIR' ? '' : reason, shared_secret: env.RSVP_SHARED_SECRET })
    const remote = await fetch(env.APPS_SCRIPT_URL, { method: 'POST', body: form, redirect: 'follow', signal: AbortSignal.timeout(25000) })
    if (!remote.ok) return respond({ ok: false, error: 'Server Google Sheets belum dapat menerima RSVP.' }, 502)
    const json = await remote.json() as { ok?: boolean; error?: string }
    return respond(json.ok ? { ok: true } : { ok: false, error: json.error || 'Google Sheets menolak konfirmasi.' }, json.ok ? 200 : 400)
  } catch {
    return respond({ ok: false, error: 'Koneksi ke Google Sheets gagal. Coba beberapa saat lagi.' }, 502)
  }
}
export function onRequestGet({ env }: { env: Env }): Response { return respond({ ok: true, service: 'natal-rsvp-v3', configured: Boolean(env.APPS_SCRIPT_URL && env.RSVP_SHARED_SECRET) }) }
