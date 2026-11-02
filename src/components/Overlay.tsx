import { friend, letter, photos, scrollMax } from '../config'
import { useParty } from '../party-context'
import { useScrollOffset } from '../scroll-store'

type Section = {
  kicker: string
  title: string
  body: string
  gold: boolean
  wish?: boolean
  prayer?: boolean
}

const copy: Section[] = [
  {
    kicker: `For ${friend.name}`,
    title: '',
    body: '',
    gold: true,
  },
  ...photos.map((photo) => ({
    kicker: photo.kicker,
    title: photo.title,
    body: photo.copy,
    gold: false,
  })),
  {
    kicker: letter.kicker,
    title: '',
    body: '',
    gold: true,
    prayer: true,
  },
  {
    kicker: '',
    title: 'Make a wish',
    body: '',
    gold: true,
    wish: true,
  },
]

export function Overlay() {
  const offset = useScrollOffset()
  const { entered, wishMade, makeWish, endingOpen } = useParty()
  if (!entered || endingOpen) return null

  const u = offset * scrollMax

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {copy.map((section, index) => {
        const distance = Math.abs(u - index)
        const opacity = Math.max(0, 1 - distance * 2.35)
        if (opacity <= 0.03) return null
        if (!section.title && !section.wish && !section.prayer && index !== 0) return null
        const layout = section.wish
          ? 'flex-col items-center justify-start pt-12 text-center'
          : section.prayer
            ? 'items-center justify-center pt-14'
            : index === 0
              ? 'flex-col items-center justify-end pb-12 text-center'
              : 'flex-col items-center justify-end pb-16 text-center'
        return (
          <div
            key={section.title || section.kicker || `section-${index}`}
            className={`absolute inset-0 flex px-6 md:px-16 ${layout}`}
            style={{ opacity }}
          >
            {section.prayer ? (
              <>
                <div className="absolute inset-0 bg-[#07140c]/70" />
                <article className="letter-card pointer-events-auto relative z-10 max-h-[78vh] max-w-lg overflow-y-auto rounded-3xl px-8 py-9 text-left md:px-11 md:py-11">
                  <p className="kicker mb-5">{letter.kicker}</p>
                  <p className="font-serif text-2xl text-amber-100 italic md:text-3xl">{letter.greeting}</p>
                  {letter.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="mt-4 font-serif text-[17px] leading-relaxed text-white/78">
                      {paragraph}
                    </p>
                  ))}
                  <p className="mt-6 whitespace-pre-line font-serif text-lg text-amber-100">{letter.signoff}</p>
                </article>
              </>
            ) : (
              <div className="max-w-md">
                {index === 0 ? null : section.kicker ? <p className="kicker mb-3">{section.kicker}</p> : null}
                {section.title ? (
                  <h2
                    className={`display text-3xl md:text-4xl ${section.gold ? 'gold-text' : 'text-white/92'}`}
                  >
                    {section.title}
                  </h2>
                ) : null}
                {section.body ? (
                  <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-[15px]">{section.body}</p>
                ) : null}
                {section.wish ? (
                  <button
                    type="button"
                    onClick={makeWish}
                    className="pointer-events-auto mt-5 rounded-full border border-amber-200/45 bg-black/30 px-6 py-3 text-xs tracking-[0.28em] uppercase backdrop-blur-md"
                  >
                    {wishMade ? 'Wish locked in' : 'Blow the candles'}
                  </button>
                ) : null}
              </div>
            )}
            {index === 0 ? (
              <p className="mt-3 text-[11px] tracking-[0.38em] text-white/50 uppercase">← →</p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
