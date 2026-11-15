import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import projectsData from "../../data/projects.json";
import FitGroup from "../FitGroup";

function RackPod({ project, index, total, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Distribute along x-axis with gentle curve
  const spacing = 2.6;
  const startX = -((total - 1) * spacing) / 2;
  const x = startX + index * spacing;
  const z = -Math.abs(x) * 0.15;

  const statusColor = project.status === "healthy" ? "#34D3A1" : "#F5B544";

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetY = hovered ? 0.4 : 0;
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 4.5, delta);
    }
  });

  return (
    <group position={[x, 0, z]} ref={meshRef}>
      {/* Tall Server Rack Pod: RoundedBox with glass-metal finish */}
      <RoundedBox
        args={[1.45, 3.2, 0.95]}
        radius={0.12}
        smoothness={4}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect(project.slug);
        }}
      >
        <meshPhysicalMaterial
          color="#0B1017"
          emissive={hovered ? "#7CC4FF" : "#141D28"}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.12}
          metalness={0.92}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </RoundedBox>

      {/* Front server bay slot dividers */}
      {[-1.1, -0.7, -0.3, 0.1, 0.5, 0.9, 1.3].map((yOffset, i) => (
        <mesh key={i} position={[0, yOffset, 0.49]}>
          <planeGeometry args={[1.25, 0.04]} />
          <meshBasicMaterial color="#253246" />
        </mesh>
      ))}

      {/* Front server blade activity LEDs */}
      {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((yOffset, i) => (
        <React.Fragment key={i}>
          <mesh position={[0.55, yOffset, 0.49]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color={i === 0 ? statusColor : i % 2 === 0 ? "#7CC4FF" : "#34D3A1"} />
          </mesh>
          <mesh position={[-0.55, yOffset, 0.49]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#7CC4FF" opacity={0.6} transparent />
          </mesh>
        </React.Fragment>
      ))}

      {/* Name labels live in the page as a DOM legend (Projects.jsx) so they can never be clipped. */}
    </group>
  );
}

export default function ProjectRacksScene({ onSelectProject }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle sway with pointer
      const targetY = (state.pointer.x * Math.PI) / 14;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 2.5, delta);
    }
  });

  return (
    <FitGroup contentWidth={10.5} contentHeight={4.6} maxScale={1.5} position={[0, 0, 0]}>
      <group ref={groupRef}>
        {projectsData.map((project, idx) => (
          <RackPod
            key={project.slug}
            project={project}
            index={idx}
            total={projectsData.length}
            onSelect={onSelectProject}
          />
        ))}
      </group>
    </FitGroup>
  );
}
