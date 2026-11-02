import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) return

    const onMove = (event: MouseEvent) => {
      const x = event.clientX
      const y = event.clientY
      if (ring.current) ring.current.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0)`
      if (dot.current) dot.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-90 hidden h-9 w-9 rounded-full border border-amber-200/80 shadow-[0_0_20px_rgba(231,111,81,0.55)] md:block"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-90 hidden h-1.5 w-1.5 rounded-full bg-teal-400 md:block"
      />
    </>
  )
}
