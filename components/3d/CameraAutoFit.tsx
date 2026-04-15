"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PerspectiveCamera } from "three";

export default function CameraAutoFit() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}
