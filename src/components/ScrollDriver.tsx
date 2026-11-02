import { useEffect } from 'react'
import { useParty } from '../party-context'
import { addScrollDelta } from '../scroll-store'

export function ScrollDriver() {
  const { entered } = useParty()

  useEffect(() => {
    if (!entered) return

    const onWheel = (event: WheelEvent) => {
      addScrollDelta(event.deltaY / (window.innerHeight * 5.4))
    }

    let lastY = 0
    const onTouchStart = (event: TouchEvent) => {
      lastY = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? lastY
      addScrollDelta((lastY - y) / (window.innerHeight * 3.6))
      lastY = y
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [entered])

  return null
}
