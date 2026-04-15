"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import CameraAutoFit from "@/components/3d/CameraAutoFit";
import ResponsiveCamera from "@/components/3d/ResponsiveCamera";
import CameraLook from "@/components/3d/CameraLook";

function CarModel() {
  const { scene } = useGLTF("/models/car.glb");
  const modelRef = useRef<THREE.Object3D>(null);
  const wrapperRef = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!modelRef.current || !wrapperRef.current) {
      return;
    }

    const t = performance.now() * 0.001;
    const targetYaw = -0.42 + t * 0.22;
    const targetBobY = Math.sin(t * 1.15) * 0.035;

    wrapperRef.current.rotation.y = THREE.MathUtils.damp(
      wrapperRef.current.rotation.y,
      targetYaw,
      6,
      delta,
    );
    wrapperRef.current.position.y = THREE.MathUtils.damp(
      wrapperRef.current.position.y,
      targetBobY,
      5,
      delta,
    );
  });

  return (
    <group position={[0, -0.6, 0]}>
      <group ref={wrapperRef}>
        <Center top>
          <primitive
            ref={modelRef}
            object={scene}
            scale={1.35}
            rotation={[0, -0.45, 0]}
            position={[0, 0, 0]}
          />
        </Center>
      </group>
    </group>
  );
}

function CarFallback() {
  return (
    <group position={[0, -0.25, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.48, 1.15]} />
        <meshStandardMaterial color="#1b232b" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0.18, 0.82, 0]} castShadow>
        <boxGeometry args={[1.55, 0.42, 0.92]} />
        <meshStandardMaterial color="#0f1419" metalness={0.8} roughness={0.16} />
      </mesh>
      <mesh position={[-0.72, 0.76, 0]} castShadow>
        <boxGeometry args={[0.6, 0.24, 0.78]} />
        <meshStandardMaterial color="#10161b" metalness={0.75} roughness={0.2} />
      </mesh>
    </group>
  );
}

function HeroLights() {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 6, 5]} intensity={2.8} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={1.1} color="#f1d3a3" />
      <pointLight position={[0, 2, 3]} intensity={1.7} color="#f7cb7a" />
      <pointLight position={[-2, 1, -3]} intensity={0.95} color="#ff7345" />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_22%,rgba(231,190,111,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,104,62,0.14),transparent_24%),linear-gradient(180deg,#11161b_0%,#090b0d_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />
      <div className="absolute left-1/2 top-[56%] h-40 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/55 blur-3xl" />

      <Canvas camera={{ position: [0, 1.1, 5.25], fov: 38 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["#090b0d"]} />
        <CameraAutoFit />
        <ResponsiveCamera />
        <CameraLook />
        <HeroLights />
        <Suspense fallback={<CarFallback />}>
          <CarModel />
          <ContactShadows position={[0, -0.98, 0]} opacity={0.55} scale={14} blur={2.8} far={5} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-6 top-6 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-stone-200/80 backdrop-blur-sm">
        Sahil Narula Atelier
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 max-w-sm rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-amber-200/70">
          Automotive Bespoke Division
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-200/90">
          A private commissioning experience focused on craftsmanship, discretion, and personalization.
        </p>
      </div>
    </div>
  );
}

useGLTF.preload("/models/car.glb");
