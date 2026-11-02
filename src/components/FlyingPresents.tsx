import { useEffect, useState } from 'react'

const WRAPS = ['#E76F51', '#E9C46A', '#2A9D8F', '#7CB342', '#F4A261']
const RIBBONS = ['#fff3d6', '#E9C46A', '#E76F51', '#2A9D8F']

type Gift = {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  rotate: number
  sway: number
  wrap: string
  ribbon: string
}

function makeGifts() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: 2 + Math.random() * 96,
    delay: i < 14 ? Math.random() * 0.12 : 0.15 + Math.random() * 0.5,
    duration: 2.2 + Math.random() * 1.4,
    size: 30 + Math.random() * 42,
    rotate: (Math.random() - 0.5) * 36,
    sway: (Math.random() - 0.5) * 90,
    wrap: WRAPS[i % WRAPS.length],
    ribbon: RIBBONS[i % RIBBONS.length],
  }))
}

export function FlyingPresents() {
  const [gifts, setGifts] = useState<Gift[]>([])

  useEffect(() => {
    const launch = () => {
      setGifts(makeGifts())
      window.setTimeout(() => setGifts([]), 5000)
    }
    window.addEventListener('birthday-unwrap', launch)
    return () => window.removeEventListener('birthday-unwrap', launch)
  }, [])

  return (
    <div id="flying-presents-root" className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className="present"
          style={{
            left: `${gift.left}%`,
            width: gift.size,
            height: gift.size,
            background: gift.wrap,
            animationDuration: `${gift.duration}s`,
            animationDelay: `${gift.delay}s`,
            ['--ribbon' as string]: gift.ribbon,
            ['--rot' as string]: `${gift.rotate}deg`,
            ['--sway' as string]: `${gift.sway}px`,
          }}
        />
      ))}
    </div>
  )
}
