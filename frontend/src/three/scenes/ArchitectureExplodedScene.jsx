import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import FitGroup from "../FitGroup";

const LAYERS = [
  { id: "github", name: "GitHub Repo (GitOps)", y: 2.2, color: "#7CC4FF", desc: "Branch protection & trunk flow" },
  { id: "actions", name: "GitHub Actions CI/CD", y: 1.35, color: "#7CC4FF", desc: "Trivy scan, test & Vite build" },
  { id: "ghcr", name: "GHCR Container Registry", y: 0.45, color: "#34D3A1", desc: "Signed OCI images & digests" },
  { id: "cloudflare", name: "Cloudflare Global Edge", y: -0.45, color: "#F5B544", desc: "Anycast DNS & SSL/TLS" },
  { id: "vm", name: "Host Runtime (Docker)", y: -1.35, color: "#7CC4FF", desc: "Alpine Nginx reverse proxy" },
  { id: "monitoring", name: "Prometheus + Grafana", y: -2.25, color: "#34D3A1", desc: "Probes, latency & alerts" }
];

export default function ArchitectureExplodedScene() {
  const groupRef = useRef();
  const [hoveredLayer, setHoveredLayer] = useState(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Damped orbit with cursor
      const targetY = (state.pointer.x * Math.PI) / 6;
      const targetX = -(state.pointer.y * Math.PI) / 10;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 2.5, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 2.5, delta);
    }
  });

  return (
    <FitGroup contentWidth={9.5} contentHeight={6.2} maxScale={1.22}>
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central data spine conduit */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 5.2, 16]} />
        <meshBasicMaterial color="#7CC4FF" transparent opacity={0.35} />
      </mesh>

      {/* Floating Architecture Plates */}
      {LAYERS.map((layer) => {
        const isHovered = hoveredLayer === layer.id;
        return (
          <group key={layer.id} position={[0, layer.y, 0]}>
            {/* Horizontal Layer Plate using RoundedBox */}
            <RoundedBox
              args={[4.0, 0.12, 2.3]}
              radius={0.06}
              smoothness={4}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredLayer(layer.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredLayer(null);
                document.body.style.cursor = "auto";
              }}
              scale={isHovered ? 1.05 : 1.0}
            >
              <meshPhysicalMaterial
                color="#0B1017"
                emissive={layer.color}
                emissiveIntensity={isHovered ? 1.1 : 0.28}
                roughness={0.12}
                metalness={0.92}
                clearcoat={1}
                transparent
                opacity={0.94}
              />
            </RoundedBox>

            {/* Glowing border */}
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(4.0, 0.12, 2.3)]} />
              <lineBasicMaterial color={layer.color} transparent opacity={isHovered ? 1.0 : 0.5} />
            </lineSegments>

            {/* Layer Label floating on the right */}
            <Html position={[2.5, 0, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  background: "rgba(10, 14, 20, 0.95)",
                  border: `1px solid ${isHovered ? "var(--accent)" : "rgba(124, 196, 255, 0.25)"}`,
                  color: isHovered ? "var(--accent)" : "var(--text)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.7)"
                }}
              >
                <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: layer.color }}>●</span>
                  {layer.name}
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {layer.desc}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
    </FitGroup>
  );
}
