import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";

export default function LostNodeScene() {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.35;
      meshRef.current.rotation.y += delta * 0.55;
      meshRef.current.rotation.z += delta * 0.18;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.4}>
      <group position={[0, 0, 0]}>
        <group ref={meshRef}>
          <RoundedBox args={[2.0, 2.0, 2.0]} radius={0.25} smoothness={4}>
            <meshPhysicalMaterial
              color="#0B1017"
              emissive="#FF6B7A"
              emissiveIntensity={0.5}
              roughness={0.12}
              metalness={0.92}
              clearcoat={1}
            />
          </RoundedBox>
        </group>

        {/* Orbiting distress particle */}
        <mesh position={[2.6, 0, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#FF6B7A" />
        </mesh>
      </group>
    </Float>
  );
}
