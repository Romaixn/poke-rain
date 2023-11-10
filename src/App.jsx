import { useState } from "react";
import { Suspense } from "react";
import { FadeIn } from "./layout/styles";
import { lazy } from "react";

const Pokeballs = lazy(() => import('./Pokeballs'))

export default function App() {
    const [speed, set] = useState(1)
    return (
      <>
        <Suspense fallback={null}>
          <Pokeballs speed={speed} />
          <FadeIn />
        </Suspense>
      </>
    )
}
