import { useSyncExternalStore } from 'react'
import { scrollMax } from './config'

export const scrollState = {
  offset: 0,
  target: 0,
}

export const lastStage = scrollMax

let bucket = -1
const listeners = new Set<() => void>()

export function currentStage() {
  return Math.round(scrollState.target * lastStage)
}

export function goToStage(stage: number) {
  const next = Math.min(lastStage, Math.max(0, Math.round(stage)))
  scrollState.target = next / lastStage
}

export function stepStage(direction: 1 | -1) {
  goToStage(currentStage() + direction)
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
