import { useEffect, useRef, useState } from 'react'
import { Music2, Pause, Play } from 'lucide-react'

/**
 * Autoplay with sound is blocked by many browsers without a gesture.
 * Opening the invitation fires `christmas:open` synchronously in the button click.
 * MusicControl listens for that event and plays its local audio file.
 */
export function MusicControl({ audioUrl }: { audioUrl: string }) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const player = audio.current
    if (!player || !audioUrl) return
    const onPlay = () => { setPlaying(true); setError(false) }
    const onPause = () => setPlaying(false)
    function startMusic() {
      if (!player) return
      player.volume = 0.65
      void player.play().catch(() => setError(true))
    }
    player.volume = 0.65
    player.addEventListener('play', onPlay)
    player.addEventListener('pause', onPause)
    window.addEventListener('christmas:open', startMusic)
    // Best-effort autoplay. Playback will start via opening button if blocked.
    void player.play().catch(() => {})
    return () => {
      player.pause()
      player.removeEventListener('play', onPlay)
      player.removeEventListener('pause', onPause)
      window.removeEventListener('christmas:open', startMusic)
    }
  }, [audioUrl])

  async function toggle() {
    const player = audio.current
    if (!player) return
    if (!player.paused) { player.pause(); return }
    try { await player.play(); setError(false) } catch { setError(true) }
  }

  if (!audioUrl) return null
  return (
    <div className="music-control">
      <audio ref={audio} src={audioUrl} loop preload="auto" onError={() => setError(true)} />
      <button
        className={`music-button ${playing ? 'is-playing' : ''}`}
        onClick={toggle}
        type="button"
        aria-label={playing ? 'Jeda musik Natal' : 'Putar musik Natal'}
        aria-pressed={playing}
        title={error ? 'Musik belum dapat diputar. Sentuh tombol ini lagi.' : (playing ? 'Jeda musik Natal' : 'Putar musik Natal')}
      >
        <Music2 size={17} />
        <span>{playing ? 'Musik menyala' : 'Putar musik'}</span>
        <span className="music-equalizer" aria-hidden="true"><b/><b/><b/></span>
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>
    </div>
  )
}
