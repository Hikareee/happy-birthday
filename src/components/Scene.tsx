import { Environment } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { letterStage, photos, scrollMax, teaseStage, wishStage } from '../config'
import { scrollState, tickScroll } from '../scroll-store'
import { unwrapAge, unwrapState } from '../unwrap-store'
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
    const mouseX = state.pointer.x * 0.1
    const mouseY = state.pointer.y * 0.06
    const intro = !unwrapState.done && unwrapAge() < 5.4

    if (intro) {
      const pull = THREE.MathUtils.smoothstep(unwrapAge(), 0, 1.05)
      cam.set(mouseX * 0.08, 0.48 + mouseY * 0.05, THREE.MathUtils.lerp(9.8, 11.5, pull))
      look.set(0, 0.18, 0)
    } else if (u < 0.9) {
      cam.set(mouseX, 0.38 + mouseY, 9.8)
      look.set(0, 0.12, 0)
    } else if (u < photos.length + 0.28) {
      cam.set(mouseX * 0.16, 0.16 + mouseY * 0.12, 7.6)
      look.set(0, 0.12, 0)
    } else if (u < letterStage + 0.45) {
      cam.set(mouseX * 0.08, 0.32, 8.8)
      look.set(0, 0.06, 0)
    } else if (u < teaseStage + 0.45) {
      cam.set(mouseX * 0.06, 0.28, 9.4)
      look.set(0, 0.04, 0)
    } else if (u < wishStage - 0.4) {
      cam.set(mouseX * 0.16, 0.16 + mouseY * 0.12, 7.6)
      look.set(0, 0.12, 0)
    } else {
      cam.set(mouseX * 0.08, 0.68, 7.2)
      look.set(0, 0.04, 0)
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, cam.x, 2.4, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cam.y, 2.4, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cam.z, 2.4, delta)
    state.camera.lookAt(look)
  })

  return (
    <>
      <Environment preset="sunset" />
      <Atmosphere />
      <BirthdayText />
      <PhotoCards />
      <Cake />
      <Fireworks />
    </>
  )
}
