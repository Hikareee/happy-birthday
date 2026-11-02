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

type Party = {
  entered: boolean
  enter: () => void
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
    goToStage(0)
    setEntered(true)
    startScore()
    burst('enter')
  }, [ready])

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
