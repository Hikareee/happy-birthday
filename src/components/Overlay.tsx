import { friend, letter, photos, scrollMax } from '../config'
import { useParty } from '../party-context'
import { useScrollOffset } from '../scroll-store'

type Section = {
  kicker: string
  title: string
  body: string
  gold: boolean
  wish?: boolean
}

const copy: Section[] = [
  {
    kicker: `For ${friend.name}`,
    title: "It's your day",
    body: friend.tagline,
    gold: true,
  },
  ...photos.map((photo) => ({
    kicker: photo.kicker,
    title: photo.title,
    body: photo.copy,
    gold: false,
  })),
  {
    kicker: `${String(photos.length + 1).padStart(2, '0')} — Ritual`,
    title: 'Make a wish',
    body: 'Click the cake. Blow the candles. Unlock fireworks. This year is already yours.',
    gold: true,
    wish: true,
  },
]

export function Overlay() {
  const offset = useScrollOffset()
  const { entered, wishMade, makeWish } = useParty()
  if (!entered) return null

  const u = offset * scrollMax
  const letterActive = u > scrollMax - 0.65

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {copy.map((section, index) => {
        const distance = Math.abs(u - index)
        const opacity = Math.max(0, 1 - distance * 1.65)
        if (opacity <= 0.03) return null
        const left = index > 0 && !section.wish
        const layout = section.wish
          ? 'flex-col items-center justify-start pt-16 text-center'
          : left
            ? 'items-start pt-20 md:items-center md:pt-0'
            : 'flex-col items-center justify-end pb-14 text-center md:justify-between md:pt-24'
        return (
          <div
            key={section.title}
            className={`absolute inset-0 flex px-6 md:px-16 ${layout}`}
            style={{ opacity, transform: `translateY(${(u - index) * 12}px)` }}
          >
            <div className={left ? 'max-w-md md:max-w-[32vw]' : 'max-w-lg'}>
              <p className="kicker mb-3">{section.kicker}</p>
              <h2
                className={`display text-5xl md:text-7xl ${section.gold ? 'gold-text neon' : 'text-white'}`}
              >
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">{section.body}</p>
              {section.wish ? (
                <button
                  type="button"
                  onClick={makeWish}
                  className="pointer-events-auto mt-8 rounded-full border border-amber-200/60 bg-white/10 px-6 py-3 text-xs tracking-[0.28em] uppercase backdrop-blur-md"
                >
                  {wishMade ? 'Wish locked in' : 'Blow the candles'}
                </button>
              ) : null}
            </div>
            {index === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-2 text-[11px] tracking-[0.3em] text-white/55 uppercase md:mt-0">
                <span className="h-9 w-px bg-gradient-to-b from-transparent via-amber-200 to-transparent" />
                Scroll
              </div>
            ) : null}
          </div>
        )
      })}

      <div
        className="fixed bottom-0 left-0 z-30 h-[2px] bg-gradient-to-r from-fuchsia-500 via-amber-300 to-cyan-300"
        style={{ width: `${Math.min(100, offset * 100)}%` }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center px-4"
        style={{
          opacity: Math.max(0, (u - (scrollMax - 0.65)) * 2.2),
          pointerEvents: letterActive ? 'auto' : 'none',
          visibility: letterActive ? 'visible' : 'hidden',
        }}
      >
        <article className="letter-card max-h-[78vh] max-w-2xl overflow-y-auto rounded-3xl px-6 py-8 text-left md:px-10 md:py-10">
          <p className="kicker mb-5">{letter.kicker}</p>
          <p className="font-serif text-2xl text-amber-100 italic md:text-3xl">{letter.greeting}</p>
          {letter.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-4 font-serif text-lg leading-relaxed text-white/80">
              {paragraph}
            </p>
          ))}
          <p className="mt-6 whitespace-pre-line font-serif text-lg text-amber-100">{letter.signoff}</p>
        </article>
      </div>
    </div>
  )
}
