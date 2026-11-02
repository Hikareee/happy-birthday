import { useEffect, useRef, useState } from 'react'
import { endingVideo } from '../config'
import { useParty } from '../party-context'

export function EndingVideo() {
  const { entered, endingOpen, dismissEnding, muted } = useParty()
  const video = useRef<HTMLVideoElement>(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const el = video.current
    if (!el) return
    el.muted = muted
  }, [muted])

  useEffect(() => {
    const el = video.current
    if (!el || !endingOpen) return
    setFinished(false)
    el.currentTime = 0
    el.muted = muted
    void el.play()

    const onEnded = () => setFinished(true)
    const onPause = () => {
      if (!el.ended && endingOpen) void el.play()
    }
    const blockKeys = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()
    }

    el.addEventListener('ended', onEnded)
    el.addEventListener('pause', onPause)
    window.addEventListener('keydown', blockKeys, true)
    return () => {
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('pause', onPause)
      window.removeEventListener('keydown', blockKeys, true)
    }
  }, [endingOpen, muted])

  if (!entered && !endingOpen) return null

  return (
    <div
      className={
        endingOpen
          ? 'fixed inset-0 z-[120] flex items-center justify-center bg-black'
          : 'pointer-events-none fixed h-0 w-0 overflow-hidden opacity-0'
      }
      onContextMenu={(event) => event.preventDefault()}
    >
      <video
        ref={video}
        src={endingVideo}
        preload="auto"
        playsInline
        disablePictureInPicture
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        className={endingOpen ? 'h-full w-full object-contain' : 'hidden'}
      />
      {endingOpen && finished ? (
        <button
          type="button"
          onClick={dismissEnding}
          className="absolute bottom-8 rounded-full border border-amber-200/70 bg-gradient-to-r from-orange-500 via-yellow-300 to-teal-400 px-8 py-3 text-xs font-semibold tracking-[0.28em] text-black uppercase"
        >
          Continue
        </button>
      ) : null}
    </div>
  )
}
