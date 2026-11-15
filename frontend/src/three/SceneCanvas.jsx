import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

const Canvas3D = lazy(() => import("./Canvas3D"));

export default function SceneCanvas({
  fallback = null,
  className = "",
  style = {},
  isChaosActive = false,
  children,
  ...rest
}) {
  const wrapRef = useRef(null);
  const { tier } = useApp();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  // Start loading after first paint so the HTML headline stays the LCP element.
  useEffect(() => {
    const id =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => setReady(true))
        : setTimeout(() => setReady(true), 200);
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, []);

  // Pause rendering when off-screen.
  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "120px"
    });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        touchAction: "pan-y",
        ...style
      }}
    >
      {tier === "off" || !ready ? (
        fallback
      ) : (
        <Suspense fallback={fallback}>
          <Canvas3D tier={tier} visible={visible} isChaosActive={isChaosActive} {...rest}>
            {children}
          </Canvas3D>
        </Suspense>
      )}
    </div>
  );
}
