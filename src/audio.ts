let ctx: AudioContext | null = null
let master: GainNode | null = null
let started = false

const SEMI = [0, 0, 2, 0, 5, 4, 0, 0, 2, 0, 7, 5, 0, 0, 12, 9, 5, 4, 2, 10, 10, 9, 5, 7, 5]
const BEATS = [0.45, 0.45, 0.9, 0.9, 0.9, 1.7, 0.45, 0.45, 0.9, 0.9, 0.9, 1.7, 0.45, 0.45, 0.9, 0.9, 0.9, 0.9, 1.7, 0.45, 0.45, 0.9, 0.9, 0.9, 2]

function freq(semi: number) {
  return 261.63 * 2 ** (semi / 12)
}

function tone(
  audio: AudioContext,
  dest: AudioNode,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
) {
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(dest)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

function sparkle(audio: AudioContext, dest: AudioNode, start: number) {
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(880, start)
  osc.frequency.exponentialRampToValueAtTime(1760, start + 0.18)
  gain.gain.setValueAtTime(0.08, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
  osc.connect(gain)
  gain.connect(dest)
  osc.start(start)
  osc.stop(start + 0.25)
}

function scheduleVerse(audio: AudioContext, dest: AudioNode, t0: number) {
  let t = t0
  const beat = 0.28
  SEMI.forEach((semi, i) => {
    const dur = BEATS[i] * beat
    tone(audio, dest, freq(semi), t, dur * 0.92, 'triangle', 0.12)
    tone(audio, dest, freq(semi) * 2, t, dur * 0.5, 'sine', 0.04)
    t += dur
  })
  return t
}

function startPad(audio: AudioContext, dest: AudioNode) {
  const lfo = audio.createOscillator()
  const lfoGain = audio.createGain()
  lfo.frequency.value = 0.08
  lfoGain.gain.value = 40
  lfo.connect(lfoGain)

  ;[130.81, 164.81, 196].forEach((f, i) => {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = 'sine'
    osc.frequency.value = f
    lfoGain.connect(osc.frequency)
    gain.gain.value = 0.03 - i * 0.006
    osc.connect(gain)
    gain.connect(dest)
    osc.start()
  })
  lfo.start()
}

export function startScore() {
  if (started) {
    void ctx?.resume()
    return
  }
  started = true
  const audio = new AudioContext()
  ctx = audio
  const gain = audio.createGain()
  master = gain
  gain.gain.value = 0.22
  const delay = audio.createDelay()
  delay.delayTime.value = 0.22
  const feedback = audio.createGain()
  feedback.gain.value = 0.22
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(gain)
  gain.connect(audio.destination)

  const dry = audio.createGain()
  dry.gain.value = 1
  dry.connect(gain)
  dry.connect(delay)

  startPad(audio, dry)

  const loop = () => {
    if (!ctx) return
    const now = ctx.currentTime + 0.08
    sparkle(ctx, dry, now)
    const end = scheduleVerse(ctx, dry, now)
    window.setTimeout(loop, Math.max(400, (end - ctx.currentTime + 1.8) * 1000))
  }
  loop()
}

export function setMutedAudio(muted: boolean) {
  if (!master || !ctx) return
  master.gain.setTargetAtTime(muted ? 0 : 0.22, ctx.currentTime, 0.08)
}

export function chime() {
  if (!ctx || !master) return
  const t = ctx.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    tone(ctx!, master!, f, t + i * 0.09, 0.5, 'sine', 0.1)
  })
}
