import { useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { friend, photos } from '../config'
import { useParty } from '../party-context'

export function IntroGate() {
  const { enter } = useParty()
  const { progress, active } = useProgress()
  const ready = !active && progress >= 100

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-5 py-8 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(16px) saturate(1.4)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          'radial-gradient(ellipse at 50% 28%, rgba(139, 92, 255, 0.28), transparent 46%), #05010c',
      }}
    >
      <motion.p
        className="kicker mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Transmission incoming
      </motion.p>
      <motion.h1
        className="display gold-text neon mb-3 text-6xl sm:text-7xl md:text-8xl"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.7 }}
      >
        HAPPY
        <br />
        BIRTHDAY
      </motion.h1>
      <p className="display gold-text mb-3 text-4xl tracking-[0.18em] sm:text-5xl">
        {friend.name.toUpperCase()}
      </p>
      <p className="mb-6 max-w-md text-sm font-light tracking-wide text-white/70 md:text-base">
        A birthday prayer from Ko Nik. Put on the volume. This one is extra.
      </p>

      <div className="stack-scene mb-8">
        <div className="photo-stack">
          {photos.map((photo, index) => (
            <img
              key={photo.id}
              src={photo.src}
              alt={photo.title}
              style={{
                transform: `translateZ(${-index * 28}px) rotateY(${-10 + index * 7}deg) translate(${index * 10}px, ${index * 8}px)`,
                zIndex: photos.length - index,
              }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={!ready}
        onClick={enter}
        className="shimmer pointer-events-auto rounded-full border border-amber-200/70 bg-gradient-to-r from-fuchsia-600 via-amber-300 to-cyan-300 px-8 py-3 text-sm font-semibold tracking-[0.28em] text-black uppercase shadow-[0_0_40px_rgba(255,215,106,0.45)] disabled:opacity-50"
      >
        {ready ? 'Unwrap the gift' : `Loading ${Math.min(100, Math.round(progress))}%`}
      </button>
    </motion.div>
  )
}
