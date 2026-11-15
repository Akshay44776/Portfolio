import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import FitGroup from "../FitGroup";

export const GATES = [
  { name: "lint", x: -4.2, color: "#F5B544", planned: true, desc: "ESLint (not configured yet)" },
  { name: "build", x: -1.4, color: "#34D3A1", desc: "Vite + React 19 production bundle + Docker image build" },
  { name: "scan", x: 1.4, color: "#34D3A1", desc: "Trivy scan of the image (fails on fixable HIGH/CRITICAL)" },
  { name: "deploy", x: 4.2, color: "#34D3A1", desc: "Image pushed to GHCR on main (hosting deploy not wired)" }
];

export default function PipelineConveyorScene() {
  const capsuleRef = useRef();

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.3) % 1;
    // Conveyor line spans from x = -5.2 to 5.2
    const posX = -5.2 + t * 10.4;
    if (capsuleRef.current) {
      capsuleRef.current.position.x = posX;
      // Pulse emission
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.15;
      capsuleRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <FitGroup contentWidth={12.2} contentHeight={3.6} maxScale={1.3} position={[0, -0.4, 0]}>
      {/* Conveyor track rails */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[11.0, 0.1, 0.45]} />
        <meshStandardMaterial color="#141D28" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Center track guide rail */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[11.0, 0.03, 0.08]} />
        <meshBasicMaterial color="#7CC4FF" opacity={0.5} transparent />
      </mesh>

      {/* Stage Gates */}
      {GATES.map((gate) => (
        <group key={gate.name} position={[gate.x, 0, 0]}>
          {/* Gate archway */}
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.82, 0.065, 16, 32, Math.PI]} />
            <meshPhysicalMaterial
              color="#0B1017"
              emissive={gate.color}
              emissiveIntensity={0.65}
              roughness={0.12}
              metalness={0.92}
              clearcoat={1}
            />
          </mesh>

          {/* Vertical posts */}
          <mesh position={[-0.82, -0.05, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.9, 16]} />
            <meshStandardMaterial color="#253246" metalness={0.85} />
          </mesh>
          <mesh position={[0.82, -0.05, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.9, 16]} />
            <meshStandardMaterial color="#253246" metalness={0.85} />
          </mesh>

          {/* Gate stage sensor light */}
          <mesh position={[0, 1.38, 0]}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshBasicMaterial color={gate.color} />
          </mesh>

          {/* Stage names are rendered as a DOM legend in Pipeline.jsx so they can never be clipped. */}
        </group>
      ))}

      {/* Moving build capsule */}
      <group ref={capsuleRef} position={[-5.2, 0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.2, 0.52, 16, 16]} />
          <meshPhysicalMaterial
            color="#06121F"
            emissive="#7CC4FF"
            emissiveIntensity={2.0}
            roughness={0.1}
            metalness={0.95}
            clearcoat={1}
          />
        </mesh>
        <pointLight color="#7CC4FF" intensity={15} distance={2.2} />
      </group>
    </FitGroup>
  );
}
