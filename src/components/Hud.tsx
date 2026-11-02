import { useParty } from '../party-context'

export function Hud() {
  const { muted, toggleMuted, entered, endingOpen } = useParty()
  if (!entered || endingOpen) return null

  return (
    <div className="pointer-events-none fixed top-0 right-0 z-50 p-4 md:p-6">
      <button
        type="button"
        onClick={toggleMuted}
        className="pointer-events-auto rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[11px] tracking-[0.22em] text-white/70 uppercase backdrop-blur-md"
      >
        {muted ? 'Sound off' : 'Sound on'}
      </button>
    </div>
  )
}
