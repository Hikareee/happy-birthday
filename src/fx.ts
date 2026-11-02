import confetti from 'canvas-confetti'

const colors = ['#ffd76a', '#22f0ff', '#ff2d95', '#fff6d5', '#8b5cff', '#ffffff']

export function burst(kind: 'enter' | 'wish' | 'finale') {
  const base = { colors, disableForReducedMotion: true, zIndex: 80 }

  if (kind === 'enter') {
    confetti({ ...base, particleCount: 180, spread: 90, origin: { y: 0.72 }, startVelocity: 48 })
    window.setTimeout(() => {
      confetti({ ...base, particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } })
      confetti({ ...base, particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } })
    }, 220)
    return
  }

  if (kind === 'wish') {
    confetti({ ...base, particleCount: 220, spread: 120, origin: { y: 0.55 }, scalar: 1.1 })
    window.setTimeout(() => {
      confetti({ ...base, particleCount: 90, spread: 360, startVelocity: 28, origin: { y: 0.4 } })
    }, 280)
    return
  }

  const fire = (x: number) =>
    confetti({
      ...base,
      particleCount: 40,
      spread: 70,
      origin: { x, y: 0.35 },
      startVelocity: 42,
    })
  fire(0.2)
  fire(0.5)
  fire(0.8)
}
