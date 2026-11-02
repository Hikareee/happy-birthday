import { useEffect, useRef, useState } from 'react'
import { encoreVideo, endingVideo } from '../config'
import { useParty } from '../party-context'

type Beat = 'watch' | 'still' | 'prompt' | 'bonus' | 'done'

export function EndingVideo() {
  const { entered, endingOpen, dismissEnding, muted } = useParty()
  const video = useRef<HTMLVideoElement>(null)
  const clip = useRef<'main' | 'bonus'>('main')
  const [beat, setBeat] = useState<Beat>('watch')
  const src = beat === 'bonus' || beat === 'done' ? encoreVideo : endingVideo

  useEffect(() => {
    const el = video.current
    if (!el) return
    el.muted = muted
  }, [muted])

  useEffect(() => {
    if (!endingOpen) return
    clip.current = 'main'
    setBeat('watch')
  }, [endingOpen])

  useEffect(() => {
    const el = video.current
    if (!el || !endingOpen) return

    const playing = beat === 'watch' || beat === 'bonus'
    if (playing) {
      let started = false
      const start = () => {
        if (started) return
        started = true
        el.muted = muted
        if (el.currentTime > 0.15) el.currentTime = 0
        void el.play()
      }
      if (el.readyState >= 3) start()
      else el.addEventListener('canplay', start, { once: true })
    }

    const onEnded = () => {
      setBeat(clip.current === 'main' ? 'still' : 'done')
    }
    const onPause = () => {
      if (playing && !el.ended && endingOpen) void el.play()
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
  }, [beat, endingOpen, src])

  useEffect(() => {
    if (!endingOpen || beat !== 'still') return
    const prompt = window.setTimeout(() => setBeat('prompt'), 2000)
    return () => window.clearTimeout(prompt)
  }, [beat, endingOpen])

  useEffect(() => {
    if (endingOpen) return
    video.current?.pause()
  }, [endingOpen])

  const onContinue = () => {
    if (beat === 'prompt') {
      clip.current = 'bonus'
      setBeat('bonus')
      return
    }
    if (beat === 'done') dismissEnding()
  }

  if (!entered && !endingOpen) return null

  const lingering = beat === 'still' || beat === 'prompt'
  const canContinue = beat === 'prompt'

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
        src={src}
        preload="auto"
        playsInline
        disablePictureInPicture
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        className={endingOpen ? 'h-full w-full object-contain' : 'hidden'}
      />
      <video src={encoreVideo} preload="auto" className="hidden" playsInline />
      {endingOpen && lingering ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/72 px-6 text-center">
          <h2 className="linger-copy display gold-text text-5xl leading-[0.9] sm:text-7xl md:text-8xl">
            You&apos;re still here?
          </h2>
          {canContinue ? (
            <button
              type="button"
              onClick={onContinue}
              className="linger-copy mt-10 rounded-full border border-amber-200/70 bg-gradient-to-r from-orange-500 via-yellow-300 to-teal-400 px-8 py-3 text-xs font-semibold tracking-[0.28em] text-black uppercase"
            >
              Continue
            </button>
          ) : null}
        </div>
      ) : null}
      {endingOpen && beat === 'done' ? (
        <button
          type="button"
          onClick={onContinue}
          className="linger-copy absolute bottom-8 rounded-full border border-amber-200/70 bg-gradient-to-r from-orange-500 via-yellow-300 to-teal-400 px-8 py-3 text-xs font-semibold tracking-[0.28em] text-black uppercase"
        >
          Continue
        </button>
      ) : null}
    </div>
  )
}
