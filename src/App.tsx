import { AnimatePresence } from 'framer-motion'
import { EndingVideo } from './components/EndingVideo'
import { Hud } from './components/Hud'
import { IntroGate } from './components/IntroGate'
import { Overlay } from './components/Overlay'
import { ScrollDriver } from './components/ScrollDriver'
import { World } from './components/World'
import { PartyProvider, useParty } from './party-context'

function Experience() {
  const { entered } = useParty()

  return (
    <div className="relative h-full w-full">
      <World />
      <ScrollDriver />
      <Overlay />
      <AnimatePresence>{entered ? null : <IntroGate key="intro" />}</AnimatePresence>
      <Hud />
      <EndingVideo />
      <div className="vignette" />
    </div>
  )
}

export default function App() {
  return (
    <PartyProvider>
      <Experience />
    </PartyProvider>
  )
}
