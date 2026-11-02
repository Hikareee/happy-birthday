import { Sparkles, Stars } from '@react-three/drei'

export function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={['#07140c', 14, 32]} />
      <ambientLight intensity={0.38} color="#d7ead0" />
      <spotLight
        position={[5, 9, 7]}
        angle={0.48}
        penumbra={0.92}
        intensity={1.45}
        color="#ffe7a8"
      />
      <pointLight position={[-5, 2, 4]} intensity={0.55} color="#2A9D8F" />
      <pointLight position={[4, 0, 3]} intensity={0.4} color="#E76F51" />
      <Stars radius={60} depth={30} count={520} factor={2.1} saturation={0} fade speed={0.22} />
      <Sparkles count={14} scale={11} size={1.6} speed={0.12} color="#E9C46A" opacity={0.32} />
    </>
  )
}
