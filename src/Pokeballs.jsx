import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Instances, Instance } from '@react-three/drei'
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing'

function Pokeball({ index, z, speed }) {
  const ref = useRef()
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z])

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

  return <Instance ref={ref} />
}

useGLTF.preload("/model/realistic-pokeball.glb");

export default function Pokeballs({ speed = 1, depth = 80, easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)) }) {
  const { nodes, materials } = useGLTF('/model/realistic-pokeball.glb')
  const { viewport, camera } = useThree()
  const { width } = viewport.getCurrentViewport(camera)
  const count = Math.max(Math.floor(width) * 150, 200)

  return (
    <>
      <color attach="background" args={['#1C4CBD']} />
      <spotLight position={[10, 20, 10]} penumbra={1} intensity={3} color="red" />
      <Instances range={count} material={materials.skin} geometry={nodes.pokeball.geometry}>
            {Array.from({ length: count }, (_, i) => <Pokeball key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} /> /* prettier-ignore */)}
      </Instances>
      <Environment preset="sunset" />
      <EffectComposer disableNormalPass multisampling={0}>
        <DepthOfField target={[0, 0, 60]} focalLength={0.4} bokehScale={4} height={700} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  )
}
