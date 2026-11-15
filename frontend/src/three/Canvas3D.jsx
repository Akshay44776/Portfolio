import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { Vector2 } from "three";
import { TIER_CONFIG, downgrade } from "./quality";
import { useApp } from "../context/AppContext";

export default function Canvas3D({ tier: initialTier, visible, children, isChaosActive = false }) {
  const [tier, setTier] = useState(initialTier);
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.medium;
  const { theme } = useApp();

  const fogColor = theme === "light" ? "#F5F7FA" : "#0A0E14";

  return (
    <Canvas
      dpr={[1, cfg.dpr]}
      frameloop={visible ? "always" : "never"}
      gl={{
        antialias: tier === "high",
        powerPreference: "high-performance",
        alpha: true,
        preserveDrawingBuffer: false
      }}
      camera={{ position: [0, 0, 8.5], fov: 46 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        touchAction: "pan-y"
      }}
    >
      <PerformanceMonitor onDecline={() => setTier((t) => downgrade(t))} />
      <AdaptiveDpr pixelated />

      {/* Atmospheric depth fog */}
      <fog attach="fog" args={[fogColor, 7, 28]} />

      {/* Key light, fill light, and subtle rim light for depth */}
      <ambientLight intensity={theme === "light" ? 0.65 : 0.35} />
      <directionalLight position={[5, 8, 5]} intensity={theme === "light" ? 1.5 : 1.2} color="#7CC4FF" />
      <pointLight position={[-6, -4, 3]} intensity={theme === "light" ? 18 : 22} color="#34D3A1" />
      <pointLight position={[0, -6, -4]} intensity={14} color="#7CC4FF" />

      {children}

      {/* Postprocessing Bloom: High tier only per docs/3D_EXPERIENCE.md */}
      {tier === "high" && cfg.bloom && (
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.85}
            intensity={1.2}
            mipmapBlur
          />
          {isChaosActive && (
            <ChromaticAberration
              offset={new Vector2(0.007, 0.007)}
              radialModulation={false}
              modulationOffset={0.5}
            />
          )}
        </EffectComposer>
      )}
    </Canvas>
  );
}
