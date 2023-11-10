import { useState } from "react";
import { Suspense } from "react";
import { FadeIn } from "./layout/styles";
import { lazy } from "react";

const Bananas = lazy(() => import('./Bananas'))

export default function App() {
    const [speed, set] = useState(1)
    return (
      <>
        <Suspense fallback={null}>
          <Bananas speed={speed} />
          <FadeIn />
        </Suspense>
      </>
    )
}
