"use client";

import { useFrame, useThree } from "@react-three/fiber";

export default function CameraLook() {
  const { camera } = useThree();

  useFrame(() => {
    camera.lookAt(0, 0.4, 0);
  });

  return null;
}
