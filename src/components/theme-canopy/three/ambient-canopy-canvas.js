"use no memo";
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCoarsePointer, useReducedMotion } from "@/hooks/use-media";

const PARTICLE_COUNT = 26;
const COLORS = ["#4f9b5c", "#d9a441", "#8fd39c"];

/** Deterministic pseudo-random in [0, 1) — pure function of (index, salt), no global RNG state. */
function hash(index, salt) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function LeafParticle({ index }) {
  const ref = useRef(null);
  const seed = useMemo(
    () => ({
      x: (hash(index, 1) - 0.5) * 12,
      y: (hash(index, 2) - 0.5) * 7,
      z: (hash(index, 3) - 0.5) * 6 - 2,
      speed: 0.15 + hash(index, 4) * 0.25,
      amp: 0.4 + hash(index, 5) * 0.6,
      rotSpeed: (hash(index, 6) - 0.5) * 0.6,
      scale: 0.12 + hash(index, 7) * 0.22,
    }),
    [index],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * seed.speed;
    ref.current.position.y = seed.y + Math.sin(t) * seed.amp;
    ref.current.position.x = seed.x + Math.cos(t * 0.6) * (seed.amp * 0.5);
    ref.current.rotation.z = t * seed.rotSpeed;
    ref.current.rotation.x = t * seed.rotSpeed * 0.5;
  });

  return (
    <mesh ref={ref} position={[seed.x, seed.y, seed.z]} scale={seed.scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={COLORS[index % COLORS.length]}
        roughness={0.5}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/** Single shared ambient WebGL canvas — mount once per Canopy page root, not per section. */
export function AmbientCanopyCanvas({ className = "" }) {
  const reducedMotion = useReducedMotion();
  const coarsePointer = useCoarsePointer();

  if (reducedMotion) return null;

  const count = coarsePointer ? Math.round(PARTICLE_COUNT / 2) : PARTICLE_COUNT;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={coarsePointer ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: false }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={0.6} />
        {Array.from({ length: count }).map((_, i) => (
          <LeafParticle key={i} index={i} />
        ))}
      </Canvas>
    </div>
  );
}
