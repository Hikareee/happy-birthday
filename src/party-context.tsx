import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { preloadHtmlAssets } from './assets'
import { chime, setMutedAudio, setScorePaused, startScore } from './audio'
import { burst } from './fx'
import { goToStage } from './scroll-store'
import { setStageKeysEnabled } from './stage-keys'
import { finishUnwrap, startUnwrap, unwrapAge } from './unwrap-store'

type Party = {
  entered: boolean
  enter: () => void
  unwrapDone: boolean
  ready: boolean
  htmlProgress: number
  sceneReady: boolean
  markSceneReady: () => void
  wishMade: boolean
  makeWish: () => void
  endingOpen: boolean
  dismissEnding: () => void
  muted: boolean
  toggleMuted: () => void
}

const PartyContext = createContext<Party | null>(null)

export function PartyProvider({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false)
  const [htmlProgress, setHtmlProgress] = useState(0)
  const [htmlReady, setHtmlReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [wishMade, setWishMade] = useState(false)
  const [endingOpen, setEndingOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [unwrapDone, setUnwrapDone] = useState(false)
  const ready = htmlReady && sceneReady

  useEffect(() => {
    let cancelled = false
    void preloadHtmlAssets((ratio) => {
      if (!cancelled) setHtmlProgress(ratio)
    })
      .then(() => {
        if (cancelled) return
        setHtmlProgress(1)
        setHtmlReady(true)
      })
      .catch(() => {
        // Stay on the loader until assets actually succeed.
      })
    return () => {
      cancelled = true
    }
  }, [])

  const markSceneReady = useCallback(() => {
    setSceneReady(true)
  }, [])

  useEffect(() => {
    if (!htmlReady || sceneReady) return
    const timeout = window.setTimeout(() => setSceneReady(true), 8000)
    return () => window.clearTimeout(timeout)
  }, [htmlReady, sceneReady])

  const enter = useCallback(() => {
    if (!ready) return
    startUnwrap()
    goToStage(0)
    setEntered(true)
    setUnwrapDone(false)
    setStageKeysEnabled(false)
    window.dispatchEvent(new Event('birthday-unwrap'))
    startScore()
  }, [ready])

  useEffect(() => {
    if (!entered || unwrapDone) return
    const burstAt = window.setTimeout(() => burst('enter'), 4600)
    const tick = window.setInterval(() => {
      if (unwrapAge() < 5.2) return
      finishUnwrap()
      setUnwrapDone(true)
      goToStage(1)
      setStageKeysEnabled(true)
    }, 80)
    return () => {
      window.clearTimeout(burstAt)
      window.clearInterval(tick)
    }
  }, [entered, unwrapDone])

  const makeWish = useCallback(() => {
    setWishMade((already) => {
      if (already) return true
      burst('wish')
      chime()
      window.setTimeout(() => burst('finale'), 700)
      window.setTimeout(() => {
        setEndingOpen(true)
        setScorePaused(true)
        setStageKeysEnabled(false)
      }, 1600)
      return true
    })
  }, [])

  const dismissEnding = useCallback(() => {
    setEndingOpen(false)
    setScorePaused(false)
    setStageKeysEnabled(true)
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      setMutedAudio(!current)
      return !current
    })
  }, [])

  const value = useMemo(
    () => ({
      entered,
      enter,
      unwrapDone,
      ready,
      htmlProgress,
      sceneReady,
      markSceneReady,
      wishMade,
      makeWish,
      endingOpen,
      dismissEnding,
      muted,
      toggleMuted,
    }),
    [
      entered,
      enter,
      unwrapDone,
      ready,
      htmlProgress,
      sceneReady,
      markSceneReady,
      wishMade,
      makeWish,
      endingOpen,
      dismissEnding,
      muted,
      toggleMuted,
    ],
  )

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>
}

export function useParty() {
  const value = useContext(PartyContext)
  if (!value) throw new Error('useParty must be used inside PartyProvider')
  return value
}
