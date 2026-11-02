import { Environment } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { photos, scrollMax } from '../config'
import { scrollState, tickScroll } from '../scroll-store'
import { Atmosphere } from './Atmosphere'
import { BirthdayText } from './BirthdayText'
import { Cake } from './Cake'
import { Fireworks } from './Fireworks'
import { PhotoCards } from './PhotoCards'

export function Scene() {
  const { camera } = useThree()
  const look = useMemo(() => new THREE.Vector3(0, 0.25, 0), [])
  const cam = useMemo(() => new THREE.Vector3(0, 0.55, 8.2), [])

  useFrame((state, delta) => {
    scrollState.offset = THREE.MathUtils.damp(scrollState.offset, scrollState.target, 3.2, delta)
    tickScroll(scrollState.offset)
    const u = scrollState.offset * scrollMax
    const mouseX = state.pointer.x * 0.35
    const mouseY = state.pointer.y * 0.18

    if (u < 0.9) {
      cam.set(mouseX, 0.42 + mouseY, 9.4)
      look.set(0, 0.15, 0)
    } else if (u < photos.length + 0.7) {
      cam.set(-0.35 + mouseX * 0.4, 0.28 + mouseY * 0.4, 7.1)
      look.set(0.7, 0.15, 0)
    } else if (u < photos.length + 1.45) {
      cam.set(0.25 + mouseX * 0.25, 0.85, 6.8)
      look.set(0, 0.1, 0)
    } else {
      cam.set(mouseX * 0.35, 1.45, 10.4)
      look.set(0, 0.8, 0)
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, cam.x, 2.4, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cam.y, 2.4, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cam.z, 2.4, delta)
    state.camera.lookAt(look)
  })

  return (
    <>
      <Environment preset="city" />
      <Atmosphere />
      <BirthdayText />
      <PhotoCards />
      <Cake />
      <Fireworks />
    </>
  )
}
