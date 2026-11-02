import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
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
      <Bloom luminanceThreshold={0.15} intensity={1.15} mipmapBlur luminanceSmoothing={0.2} />
      <ChromaticAberration radialModulation modulationOffset={0.35} offset={[0.0007, 0.0009]} />
      <Vignette darkness={0.62} offset={0.25} />
    </EffectComposer>
  )
}
