"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PerspectiveCamera } from "three";

export default function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    const aspect = size.width / Math.max(size.height, 1);

    if (aspect > 2.1) {
      camera.position.set(0, 1.0, 6.4);
      camera.fov = 34;
    } else if (aspect > 1.6) {
      camera.position.set(0, 1.05, 5.9);
      camera.fov = 36;
    } else if (aspect > 1.2) {
      camera.position.set(0, 1.1, 5.45);
      camera.fov = 38;
    } else if (aspect > 0.9) {
      camera.position.set(0, 1.2, 6.0);
      camera.fov = 40;
    } else {
      camera.position.set(0, 1.3, 6.8);
      camera.fov = 44;
    }

    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}
