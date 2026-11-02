import { Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { Effects } from './Effects'
import { Scene } from './Scene'

export function World() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 0.42, 9.4], fov: 40, near: 0.1, far: 80 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#05010c']} />
      <Suspense fallback={null}>
        <Scene />
        <Effects />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
