"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollValue } from "@/components/ScrollContext";

export default function CameraRig() {
  const { camera } = useThree();
  const scroll = useScrollValue();

  useFrame(() => {
    const progress = scroll.current;

    camera.position.z = THREE.MathUtils.lerp(6, 3.8, progress);
    camera.position.y = THREE.MathUtils.lerp(1.2, 0.9, progress);
    camera.position.x = THREE.MathUtils.lerp(0.15, 0.03, progress);
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}
