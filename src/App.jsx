import { useState } from "react";
import { Suspense } from "react";
import { FadeIn } from "./layout/styles";
import { lazy } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Pokeballs = lazy(() => import('./Pokeballs'))

export default function App() {
    const [speed, set] = useState(1)
    return (
      <>
        <Suspense fallback={null}>
          <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 20, near: 0.01, far: 80 + 15 }}>
            <Pokeballs speed={speed} />
          </Canvas>
          <FadeIn />
        </Suspense>
        <Loader />
      </>
    )
}
