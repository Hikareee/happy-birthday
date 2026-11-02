import { useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { friend } from '../config'
import { useParty } from '../party-context'

export function IntroGate() {
  const { enter, ready, htmlProgress, sceneReady } = useParty()
  const { progress, total } = useProgress()

  const percent = ready
    ? 100
    : Math.min(
        99,
        Math.round(htmlProgress * 55 + (total > 0 ? progress * 0.35 : 0) + (sceneReady ? 10 : 0)),
      )

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-5 py-8 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          'radial-gradient(ellipse at 50% 18%, rgba(231, 111, 81, 0.32), transparent 42%), radial-gradient(ellipse at 80% 80%, rgba(42, 157, 143, 0.22), transparent 40%), #07140c',
      }}
      aria-busy={!ready}
    >
      {!ready ? (
        <div>
          <p className="display gold-text text-6xl sm:text-7xl" aria-live="polite">
            {percent}
          </p>
          <div className="load-track">
            <div className="load-bar" style={{ width: `${percent}%` }} />
          </div>
        </div>
      ) : (
        <>
          <motion.h1
            className="display gold-text mb-3 text-6xl sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.6 }}
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55 }}
          />

          <button
            type="button"
            onClick={enter}
            className="pointer-events-auto rounded-full border border-amber-200/60 bg-gradient-to-r from-orange-500 via-yellow-300 to-teal-400 px-10 py-3 text-sm font-semibold tracking-[0.24em] text-black uppercase"
          >
            Unwrap
          </button>
        </>
      )}
    </motion.div>
  )
}
