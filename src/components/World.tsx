import { Preload } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useParty } from '../party-context'
import { Effects } from './Effects'
import { Scene } from './Scene'

function SceneReadySignal({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree()
  const frames = useRef(0)
  const sent = useRef(false)

  useLayoutEffect(() => {
    gl.compile(scene, camera)
    frames.current = 0
  }, [camera, gl, scene])

  useFrame(() => {
    if (sent.current) return
    frames.current += 1
    if (frames.current < 3) return
    sent.current = true
    onReady()
  })

  return null
}

export function World() {
  const { sceneReady, markSceneReady } = useParty()

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 0.42, 9.4], fov: 40, near: 0.1, far: 80 }}
      style={{
        width: '100%',
        height: '100%',
        opacity: sceneReady ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <color attach="background" args={['#07140c']} />
      <Suspense fallback={null}>
        <Scene />
        <Effects />
        <SceneReadySignal onReady={markSceneReady} />
      </Suspense>
      <Suspense fallback={null}>
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
