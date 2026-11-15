import React from "react";
import { useThree } from "@react-three/fiber";

/**
 * Scales its children so a scene of `contentWidth` x `contentHeight` world units
 * always fits inside the canvas, whatever the panel's aspect ratio (desktop or phone).
 */
export default function FitGroup({
  contentWidth = 10,
  contentHeight = 5,
  maxScale = 1.6,
  position = [0, 0, 0],
  children
}) {
  const viewport = useThree((s) => s.viewport);
  const scale = Math.max(
    0.25,
    Math.min(maxScale, viewport.width / contentWidth, viewport.height / contentHeight)
  );
  return (
    <group position={position} scale={scale}>
      {children}
    </group>
  );
}
