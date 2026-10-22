import { useEffect, useState } from 'react'
import { getTimeLeft } from '../lib/date'

export function Countdown({ startsAt }: { startsAt: string }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(startsAt))

  useEffect(() => {
    setTimeLeft(getTimeLeft(startsAt))
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(startsAt)), 1000)
    return () => window.clearInterval(timer)
  }, [startsAt])

  const units = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ]

  return (
    <div className="countdown" aria-label="Hitung mundur menuju acara">
      {timeLeft.expired ? (
        <p className="countdown-ended">Hari yang penuh sukacita telah tiba. Selamat Natal! ✨</p>
      ) : (
        units.map((item, index) => (
          <div className="countdown-unit" key={item.label}>
            <span className="countdown-number" aria-label={`${item.value} ${item.label}`}>
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="countdown-label">{item.label}</span>
            {index !== units.length - 1 && <span className="countdown-separator" aria-hidden="true">:</span>}
          </div>
        ))
      )}
    </div>
  )
}
