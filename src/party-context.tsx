import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { chime, setMutedAudio, startScore } from './audio'
import { burst } from './fx'

type Party = {
  entered: boolean
  enter: () => void
  wishMade: boolean
  makeWish: () => void
  muted: boolean
  toggleMuted: () => void
}

const PartyContext = createContext<Party | null>(null)

export function PartyProvider({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false)
  const [wishMade, setWishMade] = useState(false)
  const [muted, setMuted] = useState(false)

  const enter = useCallback(() => {
    setEntered(true)
    startScore()
    burst('enter')
  }, [])

  const makeWish = useCallback(() => {
    setWishMade((already) => {
      if (already) return true
      burst('wish')
      chime()
      window.setTimeout(() => burst('finale'), 700)
      return true
    })
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      setMutedAudio(!current)
      return !current
    })
  }, [])

  const value = useMemo(
    () => ({ entered, enter, wishMade, makeWish, muted, toggleMuted }),
    [entered, enter, wishMade, makeWish, muted, toggleMuted],
  )

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>
}

export function useParty() {
  const value = useContext(PartyContext)
  if (!value) throw new Error('useParty must be used inside PartyProvider')
  return value
}
