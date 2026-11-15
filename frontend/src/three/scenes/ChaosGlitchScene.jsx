import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import FitGroup from "../FitGroup";
import { useApp } from "../../context/AppContext";

export default function ChaosGlitchScene() {
  const { chaosState } = useApp(); // 'normal' | 'glitch' | 'alert' | 'recovering'
  const groupRef = useRef();
  const failingNodeRef = useRef();
  const alertRingRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Shake camera / cluster during glitch phase
    if (chaosState === "glitch") {
      groupRef.current.position.x = (Math.random() - 0.5) * 0.28;
      groupRef.current.position.y = (Math.random() - 0.5) * 0.28;
    } else {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, 0, 5, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, 0, 5, delta);
      groupRef.current.rotation.y += delta * 0.22;
    }

    // Alert ring expanding
    if (alertRingRef.current) {
      if (chaosState === "alert" || chaosState === "glitch") {
        alertRingRef.current.visible = true;
        const s = (state.clock.getElapsedTime() * 3.2) % 3.5;
        alertRingRef.current.scale.set(s + 0.6, s + 0.6, 1);
      } else {
        alertRingRef.current.visible = false;
      }
    }
  });

  const nodeColor =
    chaosState === "glitch"
      ? "#FF6B7A"
      : chaosState === "alert"
      ? "#F5B544"
      : chaosState === "recovering"
      ? "#7CC4FF"
      : "#34D3A1";

  return (
    <FitGroup contentWidth={8.5} contentHeight={3.4} maxScale={1.5}>
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Healthy stable node 1 */}
      <group position={[-2.4, 0, 0]}>
        <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.16} smoothness={4}>
          <meshPhysicalMaterial
            color="#0B1017"
            emissive="#34D3A1"
            emissiveIntensity={0.65}
            roughness={0.12}
            metalness={0.92}
            clearcoat={1}
          />
        </RoundedBox>
      </group>

      {/* Healthy stable node 2 */}
      <group position={[2.4, 0, 0]}>
        <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.16} smoothness={4}>
          <meshPhysicalMaterial
            color="#0B1017"
            emissive="#7CC4FF"
            emissiveIntensity={0.65}
            roughness={0.12}
            metalness={0.92}
            clearcoat={1}
          />
        </RoundedBox>
      </group>

      {/* Target Chaos Node in Center */}
      <group ref={failingNodeRef} position={[0, 0, 0]}>
        <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.2} smoothness={4}>
          <meshPhysicalMaterial
            color="#06090E"
            emissive={nodeColor}
            emissiveIntensity={chaosState === "glitch" ? 2.8 : 0.85}
            roughness={0.1}
            metalness={0.95}
            clearcoat={1}
          />
        </RoundedBox>
      </group>

      {/* Alert Ring */}
      <mesh ref={alertRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} visible={false}>
        <ringGeometry args={[1.5, 1.6, 32]} />
        <meshBasicMaterial color="#FF6B7A" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
    </FitGroup>
  );
}
