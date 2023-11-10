import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

function Pokeball({ index, z, speed }) {
  const ref = useRef()
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z])
  const { nodes, materials } = useGLTF('/model/pokeball.glb')

  const [data] = useState({
    y: THREE.MathUtils.randFloatSpread(height * 2),
    x: THREE.MathUtils.randFloatSpread(2),
    spin: THREE.MathUtils.randFloat(8, 12),
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI
  })

  useFrame((state, dt) => {
    if (dt < 0.1) ref.current.position.set(index === 0 ? 0 : data.x * width, (data.y -= dt * speed), -z)
    ref.current.rotation.set((data.rX += dt / data.spin), Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI, (data.rZ += dt / data.spin))
    if (data.y < -(height * (index === 0 ? 4 : 1))) data.y = (height * (index === 0 ? 4 : 1))
  })

  return <group ref={ref}>
        <mesh
            geometry={nodes.bottom.geometry}
            material={materials.pokeballWhite}
            material-emissive="#fff"
        />
        <mesh
            geometry={nodes.center.geometry}
            material={materials.pokeballBlack}
            material-emissive="#000"
        />
        <mesh
            geometry={nodes.top.geometry}
            material={materials.pokeballRed}
            material-emissive="#e70041"
        />
    </group>
}

export default function Pokeballs({ speed = 1, count = 500, depth = 80, easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)) }) {
  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 20, near: 0.01, far: depth + 15 }}>
      <color attach="background" args={['#1C4CBD']} />
      <spotLight position={[10, 20, 10]} penumbra={1} intensity={3} color="red" />
      {Array.from({ length: count }, (_, i) => <Pokeball key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} /> /* prettier-ignore */)}
      <Environment preset="sunset" />
      <EffectComposer disableNormalPass multisampling={0}>
        <DepthOfField target={[0, 0, 60]} focalLength={0.4} bokehScale={4} height={700} />
      </EffectComposer>
    </Canvas>
  )
}
