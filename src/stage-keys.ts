import { stepStage } from './scroll-store'

let enabled = false

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

function directionFromKey(event: KeyboardEvent): 1 | -1 | 0 {
  const key = event.key
  const code = event.code
  if (key === 'ArrowRight' || key === 'ArrowDown' || code === 'ArrowRight' || code === 'ArrowDown') {
    return 1
  }
  if (key === 'ArrowLeft' || key === 'ArrowUp' || code === 'ArrowLeft' || code === 'ArrowUp') {
    return -1
  }
  return 0
}

function onKeyDown(event: KeyboardEvent) {
  if (!enabled) return
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
  if (isTypingTarget(event.target)) return
  const direction = directionFromKey(event)
  if (!direction) return
  event.preventDefault()
  stepStage(direction)
}

let touchStartY = 0

function onTouchStart(event: TouchEvent) {
  if (!enabled) return
  touchStartY = event.touches[0]?.clientY ?? 0
}

function onTouchEnd(event: TouchEvent) {
  if (!enabled) return
  const y = event.changedTouches[0]?.clientY ?? touchStartY
  const delta = touchStartY - y
  if (Math.abs(delta) < 48) return
  stepStage(delta > 0 ? 1 : -1)
}

export function bindStageKeys() {
  const root = window as unknown as { __birthdayStageKeysBound?: boolean }
  if (root.__birthdayStageKeysBound) return
  root.__birthdayStageKeysBound = true
  window.addEventListener('keydown', onKeyDown, true)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
}

export function setStageKeysEnabled(next: boolean) {
  enabled = next
}
