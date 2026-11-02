const TRACK = '/photos/hapede.mp3'

let track: HTMLAudioElement | null = null
let started = false
let muted = false
let chimeCtx: AudioContext | null = null

function ensureTrack() {
  if (track) return track
  const audio = new Audio(TRACK)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0.72
  audio.setAttribute('playsinline', '')
  audio.style.display = 'none'
  document.body.appendChild(audio)
  track = audio
  return audio
}

function ensureChime() {
  if (chimeCtx) return chimeCtx
  chimeCtx = new AudioContext()
  return chimeCtx
}

export function startScore() {
  const audio = ensureTrack()
  audio.muted = muted
  started = true
  void audio.play()
  void ensureChime().resume()
}

export function setMutedAudio(nextMuted: boolean) {
  muted = nextMuted
  if (track) track.muted = nextMuted
}

export function setScorePaused(paused: boolean) {
  if (!track || !started) return
  if (paused) {
    track.pause()
    return
  }
  if (!muted) void track.play()
}

export function chime() {
  if (!started || muted) return
  const audio = ensureChime()
  void audio.resume()
  const t = audio.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, t + i * 0.09)
    gain.gain.exponentialRampToValueAtTime(0.1, t + i * 0.09 + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.5)
    osc.connect(gain)
    gain.connect(audio.destination)
    osc.start(t + i * 0.09)
    osc.stop(t + i * 0.09 + 0.55)
  })
}
