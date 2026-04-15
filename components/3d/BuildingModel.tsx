"use client";

import { useGLTF } from "@react-three/drei";
import { Group } from "three";

type BuildingModelProps = {
  scale?: number;
};

export default function BuildingModel({ scale = 1 }: BuildingModelProps) {
  const { scene } = useGLTF("/models/building.glb");

  return (
    <primitive
      object={scene as Group}
      scale={scale}
      position={[0, -1.6, 0]}
      rotation={[0, Math.PI * 0.22, 0]}
    />
  );
}
