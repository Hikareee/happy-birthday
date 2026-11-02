import { useEffect, useRef } from 'react'
import { useParty } from '../party-context'
import { bindStageKeys, setStageKeysEnabled } from '../stage-keys'

export function ScrollDriver() {
  const { entered, endingOpen, unwrapDone } = useParty()
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bindStageKeys()
    setStageKeysEnabled(entered && unwrapDone && !endingOpen)
    if (entered && unwrapDone && !endingOpen) frame.current?.focus({ preventScroll: true })
    return () => setStageKeysEnabled(false)
  }, [entered, endingOpen, unwrapDone])

  if (!entered) return null

  return (
    <div
      ref={frame}
      tabIndex={0}
      aria-label="Birthday stages. Use arrow keys to move."
      className="pointer-events-none absolute inset-0 z-10 h-0 w-0 overflow-hidden outline-none"
    />
  )
}
