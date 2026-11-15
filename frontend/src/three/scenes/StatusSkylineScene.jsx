import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import statusData from "../../data/status.mock.json";
import FitGroup from "../FitGroup";

export default function StatusSkylineScene() {
  const scannerRef = useRef();
  const groupRef = useRef();
  const [hoveredBar, setHoveredBar] = useState(null);

  // Generate 30 days of bar heights for 2 rows of services
  const bars = useMemo(() => {
    const items = [];
    const days = 30;
    const services = statusData.services || [{ name: "portfolio-web" }, { name: "argus" }];

    services.forEach((svc, svcIdx) => {
      const zOffset = svcIdx === 0 ? -0.85 : 0.85;
      for (let day = 0; day < days; day++) {
        const uptime = 99.0 + (Math.sin(day * 0.7 + svcIdx) * 0.5 + 0.45);
        const height = (uptime / 100) * 2.2;
        const x = (day - days / 2) * 0.32;
        items.push({
          id: `${svc.name}-${day}`,
          service: svc.name,
          day: 30 - day,
          uptime: uptime.toFixed(2),
          position: [x, height / 2 - 1.1, zOffset],
          size: [0.24, height, 0.45],
          color: uptime > 99.4 ? "#34D3A1" : "#F5B544"
        });
      }
    });
    return items;
  }, []);

  useFrame((state, delta) => {
    if (scannerRef.current) {
      // Sweeping radar scanning light
      const t = (state.clock.getElapsedTime() * 0.4) % 1;
      scannerRef.current.position.x = -5.2 + t * 10.4;
    }
    if (groupRef.current) {
      // Subtle tilt responsive to mouse
      const targetY = (state.pointer.x * Math.PI) / 12;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 2.5, delta);
    }
  });

  return (
    <FitGroup contentWidth={12} contentHeight={3.8} maxScale={1.18} position={[0, -0.15, 0]}>
    <group ref={groupRef}>
      {/* Ground plane grid */}
      <mesh position={[0, -1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11.0, 3.8]} />
        <meshStandardMaterial color="#06090e" roughness={0.9} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[11.0, 22, "#253246", "#141D28"]} position={[0, -1.11, 0]} />

      {/* 30-day extruded bars with glass-metal look */}
      {bars.map((bar) => {
        const isHovered = hoveredBar === bar.id;
        return (
          <mesh
            key={bar.id}
            position={bar.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredBar(bar.id);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredBar(null);
            }}
          >
            <boxGeometry args={bar.size} />
            <meshPhysicalMaterial
              color="#0F1722"
              emissive={bar.color}
              emissiveIntensity={isHovered ? 1.5 : 0.45}
              roughness={0.12}
              metalness={0.9}
              clearcoat={1}
              clearcoatRoughness={0.08}
            />
          </mesh>
        );
      })}

      {/* Sweeping Scanner Beam */}
      <group ref={scannerRef} position={[-5.2, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.08, 2.6, 2.6]} />
          <meshBasicMaterial color="#7CC4FF" transparent opacity={0.35} />
        </mesh>
        <pointLight color="#7CC4FF" intensity={9} distance={2.0} />
      </group>

      {/* Tooltip on hover */}
      {hoveredBar && (
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: "none" }}>
          {(() => {
            const b = bars.find((item) => item.id === hoveredBar);
            if (!b) return null;
            return (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  background: "rgba(10, 14, 20, 0.95)",
                  border: "1px solid var(--accent)",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.8)"
                }}
              >
                <span style={{ color: "var(--accent)" }}>{b.service}</span> &bull; Day -{b.day}:{" "}
                <span style={{ color: b.color, fontWeight: 600 }}>{b.uptime}%</span>
              </div>
            );
          })()}
        </Html>
      )}
    </group>
    </FitGroup>
  );
}
