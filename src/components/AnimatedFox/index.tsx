import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import Fox from "./Fox";

const AnimatedFox = () => {
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  // Let model follow the cursor
  const updateRotation = (event: MouseEvent) => {
    const xAxis = (event.clientX / window.innerWidth) * 2;
    const yAxis = (event.clientY / window.innerHeight) * 2;

    setRotation([
      // Vertical constraints
      yAxis * 0.5 - 0.5,
      // Horizontal constraints
      xAxis * 1 - 1,
      0,
    ]);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateRotation);
    return () => {
      window.removeEventListener("mousemove", updateRotation);
    };
  }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.8} />
      <Suspense fallback={null}>
        <Fox rotation={rotation} scale={[5.2, 5, 5]} />
      </Suspense>
    </Canvas>
  );
};

export { AnimatedFox };
