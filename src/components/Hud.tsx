import { useParty } from '../party-context'

export function Hud() {
  const { muted, toggleMuted, entered } = useParty()
  if (!entered) return null

  return (
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex items-start justify-between p-4 md:p-6">
      <p className="kicker hidden pt-2 sm:block">Scroll through time</p>
      <button
        type="button"
        onClick={toggleMuted}
        className="pointer-events-auto rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[11px] tracking-[0.22em] uppercase backdrop-blur-md"
      >
        {muted ? 'Sound off' : 'Sound on'}
      </button>
    </div>
  )
}
