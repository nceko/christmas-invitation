/** SVG dekoratif buatan sendiri; tidak memuat gambar dari layanan pihak ketiga. */
export function Starburst({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 84 84" fill="none" className={className} aria-hidden="true">
      <path d="M42 0 48 35 84 42 48 49 42 84 36 49 0 42 36 35Z" fill="currentColor" />
      <circle cx="42" cy="42" r="5" fill="#FFF7E5" />
    </svg>
  )
}

export function PineBranch({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 270" fill="none" className={className} aria-hidden="true">
      <path d="M-20 22C89 82 161 135 328 240" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {Array.from({ length: 13 }, (_, i) => {
        const x = 12 + i * 22
        const y = 42 + i * 14
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(35)`}>
            <path d="M0 0 C-15 -33 -12 -56 -10 -72 M0 0 C16 -32 26 -45 34 -55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M-6 -18 -28 -32 M-9 -32 -25 -48 M15 -17 35 -28 M23 -29 42 -37" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        )
      })}
      <circle cx="98" cy="95" r="9" fill="#B36C5B" />
      <circle cx="228" cy="184" r="8" fill="#B36C5B" />
      <circle cx="256" cy="146" r="6" fill="#DDBD7E" />
    </svg>
  )
}

export function ChristmasArtwork() {
  return (
    <svg className="artwork-svg" viewBox="0 0 480 550" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="artGold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFF4CB" />
          <stop offset=".42" stopColor="#DDC089" />
          <stop offset="1" stopColor="#AB7A3D" />
        </linearGradient>
        <radialGradient id="artGlow">
          <stop stopColor="#E3BC78" stopOpacity=".27" />
          <stop offset="1" stopColor="#E3BC78" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="artForest" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2C624B" />
          <stop offset="1" stopColor="#09281F" />
        </linearGradient>
      </defs>
      <circle cx="240" cy="259" r="206" fill="url(#artGlow)" />
      <path d="M83 477V188C83 101 151 35 240 35S397 101 397 188V477" stroke="url(#artGold)" strokeOpacity=".65" strokeWidth="1.2" />
      <path d="M100 477V192C100 117 161 52 240 52S380 117 380 192V477" stroke="#D8B978" strokeOpacity=".23" />
      <path d="M68 489H411" stroke="#C7AB6A" strokeOpacity=".7" />
      <path d="M110 504H371" stroke="#C7AB6A" strokeOpacity=".3" />
      <g opacity=".6" fill="#E6D29D">
        <circle cx="115" cy="160" r="2.1" /><circle cx="350" cy="121" r="1.6" />
        <circle cx="138" cy="267" r="1.8" /><circle cx="366" cy="249" r="1.7" />
        <circle cx="315" cy="95" r="1.8" /><circle cx="185" cy="127" r="1.7" />
        <circle cx="324" cy="337" r="1.8" /><circle cx="156" cy="382" r="1.5" />
      </g>
      <g transform="translate(239 170)">
        <path d="M0 -52 6 -7 46 0 6 7 0 52 -6 7 -46 0 -6 -7Z" fill="url(#artGold)" />
        <path d="M0 -70V-57M0 57V70M-64 0H-51M51 0H64M-38 -38 -29 -29M29 29 38 38M38 -38 29 -29M-29 29 -38 38" stroke="#E9D49B" strokeLinecap="round" />
      </g>
      <path d="M114 394C142 355 169 339 199 336C224 332 242 341 260 350C294 366 327 365 368 328V489H114V394Z" fill="#12392C" />
      <path d="M127 454 150 388 174 454H127Z" fill="#376B51" />
      <path d="M138 419 153 368 168 419H138Z" fill="#4B7C5B" />
      <path d="M312 444 342 361 372 444H312Z" fill="#2D6047" />
      <path d="M324 410 342 343 360 410H324Z" fill="#44785A" />
      <g stroke="url(#artGold)" strokeLinejoin="round">
        <path d="M171 469V361L240 311L309 361V469" fill="url(#artForest)" strokeWidth="1.6" />
        <path d="M158 366 240 303 322 366" strokeWidth="3" strokeLinecap="round" />
        <path d="M199 340V307L240 269 281 307V340" fill="#163E30" />
        <path d="M210 309V289L240 265L270 289V309" fill="#1A4232" />
        <path d="M237 266V244H243V266" fill="url(#artGold)" />
        <path d="M227 253H253" strokeWidth="2.4" />
        <rect x="216" y="381" width="48" height="88" rx="24" fill="#051D19" strokeWidth="1.2" />
        <path d="M240 383V469" strokeWidth="1" opacity=".6" />
        <path d="M190 382h19v37h-19zM271 382h19v37h-19z" fill="#D9B578" fillOpacity=".66" />
        <path d="M190 397h19M199.5 382v37M271 397h19M280.5 382v37" stroke="#214E3C" />
        <path d="M223 343h34v23h-34z" fill="#CBA867" fillOpacity=".8" />
        <path d="M240 343v23M223 354h34" stroke="#214E3C" />
      </g>
      <path d="M107 473C157 445 182 483 231 476C280 468 323 451 376 475" stroke="#D7B76D" strokeOpacity=".6" strokeWidth="1.2" />
      <g fill="#D6BB7A">
        <circle cx="125" cy="478" r="2.5" /><circle cx="139" cy="472" r="1.3" />
        <circle cx="337" cy="475" r="2.5" /><circle cx="356" cy="477" r="1.5" />
      </g>
    </svg>
  )
}
