import React, { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, QuadraticBezierLine, Stars, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { TIER_CONFIG } from "../quality";
import projectsData from "../../data/projects.json";

function ProjectNode({ node, isBooted, isHovered, onHover, onSelect, isMobile }) {
  const meshRef = useRef();
  const targetScale = !isBooted ? 0.001 : isHovered ? 1.3 : 1.0;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.x = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 5, delta);
      meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScale, 5, delta);
      meshRef.current.scale.z = THREE.MathUtils.damp(meshRef.current.scale.z, targetScale, 5, delta);
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.5}>
      <group position={node.position}>
        <group ref={meshRef} scale={isBooted ? 1 : 0.001}>
          {/* Glass-metal Rounded Cube Container Pod */}
          <RoundedBox
            args={[0.88, 0.88, 0.88]}
            radius={0.16}
            smoothness={4}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(node.slug);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(node.slug);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              onHover(null);
              document.body.style.cursor = "auto";
            }}
          >
            <meshPhysicalMaterial
              color="#0F1722"
              emissive={node.color}
              emissiveIntensity={isHovered ? 1.8 : 0.6}
              roughness={0.12}
              metalness={0.92}
              clearcoat={1}
              clearcoatRoughness={0.06}
            />
          </RoundedBox>

          {/* Status Indicator LED Pip */}
          <mesh position={[0, 0.56, 0]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color={node.color} />
          </mesh>

          {/* Floating Tag */}
          <Html
            position={[0, 0.85, 0]}
            center
            distanceFactor={8}
            style={{ pointerEvents: "none", transition: "all 0.2s" }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                background: "rgba(10, 14, 20, 0.95)",
                border: `1px solid ${isHovered ? "var(--accent)" : "rgba(124, 196, 255, 0.25)"}`,
                color: isHovered ? "var(--accent)" : "var(--text)",
                padding: "2px 8px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <span style={{ color: node.color, fontSize: "9px" }}>●</span>
              <span style={{ fontWeight: 600 }}>{node.name}</span>
            </div>
          </Html>
        </group>
      </group>
    </Float>
  );
}

export default function HeroClusterScene() {
  const { tier, isBooting } = useApp();
  const navigate = useNavigate();
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.medium;
  const { viewport } = useThree();

  const groupRef = useRef();
  const coreRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [bootProgress, setBootProgress] = useState(isBooting ? 0 : 4);

  // Sync boot progression with terminal
  useFrame((state) => {
    if (isBooting) {
      const elapsed = state.clock.getElapsedTime();
      const count = Math.min(4, Math.floor(elapsed / 0.55) + 1);
      if (count !== bootProgress) setBootProgress(count);
    } else if (bootProgress < 4) {
      setBootProgress(4);
    }
  });

  const isMobile = viewport.width < 5.5;
  const clusterScale = isMobile ? 0.8 : 1.15;

  // Primary 4 Project Nodes positioned neatly around core
  const primaryNodes = useMemo(() => {
    const angleStep = (Math.PI * 2) / projectsData.length;
    return projectsData.map((p, idx) => {
      const angle = idx * angleStep + Math.PI / 4;
      const radius = isMobile ? 2.1 : 2.7;
      return {
        slug: p.slug,
        name: p.name,
        status: p.status,
        index: idx,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * (radius * 0.7),
          (idx % 2 === 0 ? 0.4 : -0.4)
        ],
        color: p.status === "healthy" ? "#34D3A1" : "#F5B544"
      };
    });
  }, [isMobile]);

  // Auxiliary background nodes based on tier
  const auxNodes = useMemo(() => {
    const count = Math.max(0, cfg.nodes - primaryNodes.length);
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dist = 3.2 + Math.random() * 3.2;
      nodes.push({
        id: i,
        position: [
          dist * Math.sin(phi) * Math.cos(theta),
          dist * Math.sin(phi) * Math.sin(theta) * 0.75,
          dist * Math.cos(phi) * 0.7
        ],
        size: 0.16 + Math.random() * 0.2,
        color: i % 4 === 0 ? "#7CC4FF" : i % 7 === 0 ? "#34D3A1" : "#253246"
      });
    }
    return nodes;
  }, [cfg.nodes, primaryNodes.length]);

  // Log Stream Particles
  const particleGeo = useMemo(() => {
    const count = cfg.particles;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [cfg.particles]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth physical parallax rotation
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = -(state.pointer.y * Math.PI) / 10;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetX + state.clock.getElapsedTime() * 0.05,
      2.5,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetY,
      2.5,
      delta
    );

    // Engineer core pulsing
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2.4) * 0.07;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef} scale={clusterScale}>
      {/* Subtle Starfield */}
      <Stars radius={20} depth={25} count={cfg.particles > 100 ? 400 : 120} factor={2} fade speed={0.5} />

      {/* Central Engineer Core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshPhysicalMaterial
          color="#06121F"
          emissive="#7CC4FF"
          emissiveIntensity={isBooting ? 0.8 : 1.4}
          roughness={0.1}
          metalness={0.95}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Core Halo Glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.76, 24, 24]} />
        <meshBasicMaterial color="#7CC4FF" transparent opacity={0.15} wireframe />
      </mesh>

      {/* Curved Data-Flow Lines between Nodes and Core */}
      {primaryNodes.map((node) => {
        const isNodeBooted = bootProgress > node.index;
        if (!isNodeBooted) return null;

        const midX = node.position[0] * 0.5 + 0.2;
        const midY = node.position[1] * 0.5 + 0.3;
        const midZ = node.position[2] * 0.5;

        return (
          <QuadraticBezierLine
            key={`line-${node.slug}`}
            start={[0, 0, 0]}
            end={node.position}
            mid={[midX, midY, midZ]}
            color={node.color}
            lineWidth={1.5}
            transparent
            opacity={0.45}
          />
        );
      })}

      {/* Primary Project Pods */}
      {primaryNodes.map((node) => (
        <ProjectNode
          key={node.slug}
          node={node}
          isBooted={bootProgress > node.index}
          isHovered={hoveredNode === node.slug}
          onHover={setHoveredNode}
          onSelect={(slug) => navigate(`/projects#${slug}`)}
          isMobile={isMobile}
        />
      ))}

      {/* Auxiliary Background Cluster Nodes */}
      {auxNodes.map((n) => (
        <mesh key={n.id} position={n.position}>
          <boxGeometry args={[n.size, n.size, n.size]} />
          <meshStandardMaterial
            color={n.color}
            roughness={0.35}
            metalness={0.8}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}

      {/* Ambient Log Stream Points */}
      <points geometry={particleGeo}>
        <pointsMaterial
          size={isMobile ? 0.03 : 0.045}
          color="#7CC4FF"
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
