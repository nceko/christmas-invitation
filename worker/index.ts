/**
 * Cloudflare Workers entry point for Natal Digital V5.
 * Existing Pages RSVP validation is reused without exposing Google secrets.
 */
import { onRequestGet, onRequestPost } from '../functions/api/rsvp'

type Env = {
  ASSETS: { fetch(request: Request): Promise<Response> }
  APPS_SCRIPT_URL?: string
  RSVP_SHARED_SECRET?: string
}

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/'

    if (path === '/api/rsvp') {
      if (request.method === 'GET') return onRequestGet({ env })
      if (request.method === 'POST') return onRequestPost({ request, env })
      return new Response(JSON.stringify({ ok: false, error: 'Metode tidak diizinkan.' }), {
        status: 405,
        headers: { ...jsonHeaders, Allow: 'GET, POST' },
      })
    }

    // Unknown API routes must not silently become the React index.html.
    if (path.startsWith('/api/')) {
      return new Response(JSON.stringify({ ok: false, error: 'Endpoint tidak ditemukan.' }), {
        status: 404,
        headers: jsonHeaders,
      })
    }

    return env.ASSETS.fetch(request)
  },
}
