import { useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { friend } from '../config'
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
          'radial-gradient(ellipse at 50% 18%, rgba(231, 111, 81, 0.32), transparent 42%), radial-gradient(ellipse at 80% 80%, rgba(42, 157, 143, 0.22), transparent 40%), #07140c',
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
      <p className="display gold-text mb-8 text-4xl tracking-[0.18em] sm:text-5xl">
        {friend.name.toUpperCase()}
      </p>

      <motion.img
        src="/photos/meerkat.png"
        alt="Party meerkat with a guitar"
        className="mascot mb-8"
        initial={{ opacity: 0, y: 24, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      />

      <button
        type="button"
        disabled={!ready}
        onClick={enter}
        className="shimmer pointer-events-auto rounded-full border border-amber-200/70 bg-gradient-to-r from-orange-500 via-yellow-300 to-teal-400 px-10 py-3 text-sm font-semibold tracking-[0.28em] text-black uppercase shadow-[0_0_40px_rgba(231,111,81,0.45)] disabled:opacity-50"
      >
        {ready ? 'Unwrap' : `Loading ${Math.min(100, Math.round(progress))}%`}
      </button>
    </motion.div>
  )
}
