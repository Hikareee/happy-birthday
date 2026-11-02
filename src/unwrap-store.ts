export const unwrapState = {
  startedAt: 0,
  done: false,
}

export function startUnwrap() {
  unwrapState.startedAt = performance.now()
  unwrapState.done = false
}

export function finishUnwrap() {
  unwrapState.done = true
}

export function unwrapAge() {
  if (!unwrapState.startedAt) return 0
  return (performance.now() - unwrapState.startedAt) / 1000
}
