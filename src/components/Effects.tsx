import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useEffect, useState } from 'react'

export function Effects() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const mobile = window.innerWidth < 720 || window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(!mobile && !reduced)
  }, [])

  if (!enabled) return null

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom luminanceThreshold={0.34} intensity={0.38} mipmapBlur luminanceSmoothing={0.4} />
      <Vignette darkness={0.55} offset={0.32} />
    </EffectComposer>
  )
}
