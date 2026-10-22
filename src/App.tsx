import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Heart, MailOpen, MapPin, Music2, Users } from 'lucide-react'
import { invitation } from './config'
import { Countdown } from './components/Countdown'
import { ChristmasArtwork, PineBranch } from './components/Ornaments'
import { EventActions } from './components/EventActions'
import { MusicControl } from './components/MusicControl'
import { AttendanceForm } from './components/AttendanceForm'
import { dateParts, isHttpUrl, whatsappLink } from './lib/date'

const event = invitation
const flakes = Array.from({ length: 38 }, (_, n) => n)
const stars = Array.from({ length: 19 }, (_, n) => n)
const VERSION = 'V5 RED CHRISTMAS • 22 OKTOBER 2026'

function useGuest() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const name = (params.get('to') || '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80)
    const rawToken = params.get('token') || ''
    return { name, token: /^[a-f0-9-]{32,80}$/i.test(rawToken) ? rawToken : '' }
  }, [])
}

function Snow() {
  return <div className="snow" aria-hidden="true">{flakes.map(n => <span key={n} style={{'--x': `${(n * 59 + 13) % 100}%`, '--delay': `${-(n * 7 % 19)}s`, '--duration': `${13 + (n % 9)}s`, '--size': `${2 + n % 4}px`} as CSSProperties}>✦</span>)}</div>
}

function Badge({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <span className={'section-kicker' + (light ? ' kicker-light' : '')}><span>✦</span>{children}<span>✦</span></span>
}

function Opening({ guestName, onOpen, closing }: { guestName: string; onOpen: () => void; closing: boolean }) {
  return <div className={'opening ' + (closing ? 'opening-closing' : '')} role="dialog" aria-modal="true" aria-label="Buka undangan Natal">
    <Snow />
    <div className="opening-corner opening-corner-a" aria-hidden="true">❧</div>
    <div className="opening-corner opening-corner-b" aria-hidden="true">❧</div>
    <div className="opening-content">
      <span className="opening-eyebrow">✦ &nbsp; CHRISTMAS CELEBRATION &nbsp; ✦</span>
      <div className="opening-emblem" aria-hidden="true"><span className="opening-emblem-ring"/><span className="opening-emblem-inner">✦</span><span className="opening-emblem-leaf">❦</span></div>
      <div className="opening-script">You are invited to</div>
      <h2>Christmas<br/><em>Celebration</em></h2>
      <div className="small-ornaments" aria-hidden="true">✧ ━━━━━ ✦ ━━━━━ ✧</div>
      {guestName ? <p className="opening-guest">Khusus untuk <strong>{guestName}</strong></p> : <p className="opening-guest">Undangan Natal Gereja & Komunitas</p>}
      <p className="opening-description">Sebuah malam penuh terang, kasih, dan sukacita. Kehadiranmu begitu berarti.</p>
      <button className="opening-action" type="button" onClick={onOpen}><MailOpen size={18}/> BUKA UNDANGAN <Music2 size={17}/></button>
      <small>Ketuk untuk membuka undangan dan memutar musik Natal</small>
    </div>
  </div>
}

function Hero({ guestName }: { guestName: string }) {
  const date = dateParts(event.startsAt)
  return <section className="hero" id="beranda" aria-labelledby="hero-title">
    <Snow />
    <div className="hero-glow" aria-hidden="true"/>
    <div className="hero-top"><div className="brandmark"><span>✦</span><div><strong>NOËL</strong><small>CHRISTMAS CELEBRATION</small></div></div><div className="edition-mark">✧ &nbsp; {VERSION}</div></div>
    <PineBranch className="corner-pine corner-pine-left"/><PineBranch className="corner-pine corner-pine-right"/>
    <div className="hanging-ornaments" aria-hidden="true"><i/><i/><i/></div>
    <div className="hero-layout">
      <div className="hero-copy">
        <Badge light>NATAL GEREJA & KOMUNITAS</Badge>
        <span className="hero-script">Let heaven and nature sing</span>
        <h1 id="hero-title"><span>Perayaan</span><br/>Natal <em>{event.year}</em></h1>
        <div className="hero-divider" aria-hidden="true"><span/>✦<span/></div>
        <h2>{event.theme}</h2>
        <p className="hero-description">{event.introduction}</p>
        {guestName && <p className="hero-guest"><span>UNDANGAN KHUSUS</span><strong>{guestName}</strong></p>}
        <div className="hero-actions"><a className="button-gold" href="#detail">LIHAT DETAIL ACARA <ArrowRight size={17}/></a><a className="link-underline" href="#tentang">Baca Undangan <ArrowDown size={16}/></a></div>
        <div className="hero-date"><CalendarDays size={17}/>{date.weekday}, {date.day} {date.month} {date.year} · {date.time} {date.tzLabel}</div>
      </div>
      <div className="hero-visual">
        <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
        <div className="hero-visual-stars" aria-hidden="true">{stars.map(n => <i key={n} style={{left:`${(n*37+13)%90}%`,top:`${(n*51+9)%83}%`,animationDelay:`${n*.37}s`}}/>)}</div>
        <div className="hero-arch"><ChristmasArtwork/></div>
        <span className="hero-bauble bauble-one">✦</span><span className="hero-bauble bauble-two">✧</span>
        <div className="hero-visual-caption">✦ &nbsp; PEACE · LOVE · JOY &nbsp; ✦</div>
      </div>
    </div>
    <div className="marquee" aria-hidden="true"><div>✦&nbsp; MERRY CHRISTMAS &nbsp; ✦ &nbsp; PEACE ON EARTH &nbsp; ✦ &nbsp; JOY TO THE WORLD &nbsp; ✦ &nbsp; MERRY CHRISTMAS &nbsp; ✦ &nbsp; PEACE ON EARTH &nbsp; ✦ &nbsp; JOY TO THE WORLD &nbsp; ✦</div></div>
  </section>
}

function About() {
  return <section className="about section-pad" id="tentang" aria-labelledby="about-title">
    <div className="about-wreath" aria-hidden="true">❦</div>
    <div className="content-narrow center">
      <Badge>SEBUAH UNDANGAN PENUH KASIH</Badge>
      <span className="about-star" aria-hidden="true">✦</span>
      <p className="handwritten">You are warmly invited</p>
      <h2 id="about-title">Mari Rayakan <em>Keajaiban Natal</em> Bersama</h2>
      <p className="about-text">{event.eyebrow}. {event.invitationMessage}</p>
      <div className="verse-card"><span>“</span><blockquote>{event.verse}</blockquote><p>{event.verseReference}</p></div>
      <p className="about-signer">Dengan sukacita mengundang, <strong>{event.organizer}</strong></p>
    </div>
  </section>
}

function CountdownSection() {
  const start = dateParts(event.startsAt)
  return <section className="countdown-section" aria-label="Hitung mundur menuju acara">
    <div className="countdown-top-stars" aria-hidden="true">✦ &nbsp; ✧ &nbsp; ✦</div>
    <div className="countdown-layout"><div><Badge light>SAVE THE DATE</Badge><h2>Momennya<br/>semakin <em>dekat.</em></h2><p>Mari hitung hari menuju sukacita Natal.</p></div><div className="countdown-right"><p className="countdown-caption">MENUJU {start.day.toUpperCase()} {start.month.toUpperCase()} {start.year}</p><Countdown startsAt={event.startsAt}/></div></div>
  </section>
}

function Details() {
  const start = dateParts(event.startsAt)
  const end = dateParts(event.endsAt)
  const contact = whatsappLink(event.contactWhatsApp, `Halo ${event.contactName}, saya ingin bertanya mengenai ${event.headline}.`)
  return <section className="details section-pad" id="detail" aria-labelledby="details-title">
    <div className="content-wide"><div className="section-heading center"><Badge>MARK YOUR CALENDAR</Badge><h2 id="details-title">Detail <em>Perayaan</em></h2><p>Catat waktunya, siapkan hati, dan rayakan kehangatan Natal bersama.</p></div>
    <div className="details-layout"><div className="date-card"><span className="date-card-top">✦ &nbsp; HOLY NIGHT &nbsp; ✦</span><span className="date-card-month">{start.month}</span><strong className="date-card-day">{start.day}</strong><span className="date-card-year">{start.year}</span><span className="date-card-flourish">✧ ━━━ ✦ ━━━ ✧</span><span className="date-card-bottom">YOU'RE INVITED</span></div>
    <div className="detail-list"><div className="detail-item"><span className="detail-icon"><Clock3/></span><div><span>HARI & WAKTU</span><h3>{start.weekday}, {start.day} {start.month} {start.year}</h3><p>{start.time} – {end.time} {start.tzLabel}</p></div></div><div className="detail-item"><span className="detail-icon"><MapPin/></span><div><span>LOKASI PERAYAAN</span><h3>{event.venue}</h3><p>{event.address}</p>{isHttpUrl(event.mapsUrl) && <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer">Petunjuk arah <ArrowUpRight size={15}/></a>}</div></div><div className="detail-item"><span className="detail-icon"><Users/></span><div><span>DRESS CODE</span><h3>{event.dressCode}</h3><p>Datang dengan pakaian yang nyaman dan penuh sukacita.</p></div></div><EventActions event={event}/>{contact && <a className="detail-contact" href={contact} target="_blank" rel="noopener noreferrer">Hubungi {event.contactName} <ArrowUpRight size={16}/></a>}</div></div>
    </div>
  </section>
}

function Agenda() {
  return <section className="agenda section-pad" id="rundown" aria-labelledby="agenda-title">
    <div className="content-wide agenda-layout"><div className="agenda-intro"><Badge light>CHRISTMAS NIGHT</Badge><h2 id="agenda-title">Malam Penuh <em>Sukacita</em></h2><p>Setiap momen menjadi kesempatan untuk bersyukur, berbagi kasih, dan merayakan Natal bersama.</p><div className="agenda-decor">✦ &nbsp; JOY &nbsp; ✦ &nbsp; HOPE &nbsp; ✦ &nbsp; LOVE</div></div><div className="timeline">{event.agenda.map((item, i) => <div className="timeline-item" key={`${i}-${item.time}`}><span className="timeline-count">{String(i+1).padStart(2,'0')}</span><div><time>{item.time} {dateParts(event.startsAt).tzLabel}</time><h3>{item.title}</h3><p>{item.description}</p></div></div>)}</div></div>
  </section>
}

function RSVP({guestName, token}: {guestName: string; token: string}) {
  const d = dateParts(event.rsvpDeadline)
  return <section className="rsvp section-pad" id="rsvp" aria-labelledby="rsvp-title"><div className="content-wide"><div className="rsvp-card"><div className="rsvp-bulbs" aria-hidden="true">{Array.from({length:13},(_,n)=><span key={n}/>)}</div><div className="rsvp-inner"><Badge light>WE SAVED A SEAT FOR YOU</Badge><h2 id="rsvp-title">Kehadiranmu,<br/><em>Sukacita Kami.</em></h2><p className="rsvp-intro">Mohon berikan konfirmasi kehadiran melalui tombol di bawah ini.</p><AttendanceForm guestName={guestName} token={token} demoMode={event.demoMode}/><p className="rsvp-deadline"><CalendarDays size={15}/> Konfirmasi sebelum {d.day} {d.month} {d.year}</p><span className="rsvp-decoration" aria-hidden="true">✦ &nbsp; LET LOVE SHINE &nbsp; ✦</span></div></div></div></section>
}

function Footer() { return <footer className="footer"><span className="footer-star">✦</span><h2>NOËL</h2><p>Damai Natal menyertai kita semua.</p><small>“Kemuliaan bagi Allah di tempat yang mahatinggi.” — Lukas 2:14</small><div className="footer-base"><span>© {event.year} {event.organizer}</span><span>{VERSION}</span><a href="#beranda">Kembali ke atas ↑</a></div></footer> }

function App() {
  const guest = useGuest()
  const [opened, setOpened] = useState(false)
  const [closing, setClosing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setProgress(available > 0 ? Math.min(100, window.scrollY / available * 100) : 0)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, {passive:true})
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  useEffect(() => {
    if (!opened || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = document.querySelectorAll('.section-heading, .about .content-narrow, .detail-item, .date-card, .agenda-intro, .timeline-item, .rsvp-card')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target) }
    }), {threshold:.11})
    items.forEach(el => {el.classList.add('reveal'); observer.observe(el)})
    return () => observer.disconnect()
  }, [opened])

  function openInvitation() {
    window.dispatchEvent(new Event('christmas:open'))
    setClosing(true)
    window.setTimeout(() => setOpened(true), 550)
  }
  return <>
    <div className="scroll-progress" style={{width:`${progress}%`}} aria-hidden="true"/>
    {event.demoMode && <div className="demo-banner">MODE DEMO — Isi data acara di <strong>src/config.ts</strong> sebelum undangan dibagikan.</div>}
    {!opened && <Opening guestName={guest.name} onOpen={openInvitation} closing={closing}/>}
    <main id="undangan-natal"><Hero guestName={guest.name}/><About/><CountdownSection/><Details/><Agenda/><RSVP guestName={guest.name} token={guest.token}/></main>
    <Footer/>
    <div className="version-pill"><Check size={12}/>{VERSION}</div>
    <MusicControl audioUrl={event.audioUrl}/>
    {opened && guest.token && <a href="#rsvp" className="mobile-confirm"><Heart size={16}/> Konfirmasi Kehadiran</a>}
  </>
}

export default App
