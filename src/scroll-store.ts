import { useSyncExternalStore } from 'react'

export const scrollState = {
  offset: 0,
  target: 0,
}

let bucket = -1
const listeners = new Set<() => void>()

export function addScrollDelta(delta: number) {
  scrollState.target = Math.min(1, Math.max(0, scrollState.target + delta))
}

export function tickScroll(current: number) {
  scrollState.offset = current
  const next = Math.round(current * 48)
  if (next === bucket) return
  bucket = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useScrollOffset() {
  return useSyncExternalStore(
    subscribe,
    () => scrollState.offset,
    () => 0,
  )
}
