import { useState } from "react";
import { Suspense } from "react";
import { FadeIn } from "./layout/styles";
import { lazy } from "react";
import { Loader } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from 'maath'

const Pokeballs = lazy(() => import('./Pokeballs'))

export default function App() {
    return (
      <>
        <Suspense fallback={null}>
          <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 20, near: 0.01, far: 80 + 15 }}>
            <Pokeballs speed={0.6} />
            <Rig />
          </Canvas>
          <FadeIn />
        </Suspense>
        <Loader />
      </>
    )
}

function Rig() {
    useFrame((state, delta) => {
      easing.damp3(
        state.camera.position,
        [Math.sin(state.pointer.x) / 2, state.pointer.y / 2, 10],
        0.2,
        delta,
      )
    })
  }
