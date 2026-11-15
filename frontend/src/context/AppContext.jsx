import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { detectQuality, TIERS } from "../three/quality";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme: dark / light - defaults to dark ("Control room at night")
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      return "dark";
    } catch {
      return "dark";
    }
  });

  // 3D Quality Tier
  const [tier, setTierState] = useState(() => detectQuality());

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Boot status on home page (deploying -> healthy)
  const [isBooting, setIsBooting] = useState(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      return !localStorage.getItem("boot_completed");
    } catch {
      return false;
    }
  });

  // Chaos event state
  const [chaosState, setChaosState] = useState("normal"); // 'normal' | 'glitch' | 'alert' | 'recovering'

  const showToast = useCallback((message, duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  }, []);

  const setTier = useCallback((newTier) => {
    if (!TIERS.includes(newTier)) return;
    try {
      localStorage.setItem("3d-mode", newTier);
    } catch {}
    setTierState(newTier);
  }, []);

  const toggle3D = useCallback(() => {
    if (tier === "off") {
      const restored = "medium";
      setTier(restored);
      showToast("3D mode enabled (medium tier)");
    } else {
      setTier("off");
      showToast("3D mode disabled (static fallback)");
    }
  }, [tier, setTier, showToast]);

  const finishBoot = useCallback(() => {
    setIsBooting(false);
    try {
      localStorage.setItem("boot_completed", "true");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Support live query parameter changes for ?3d=
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("3d");
    if (q && TIERS.includes(q) && q !== tier) {
      setTierState(q);
    }
  }, [tier]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        tier,
        setTier,
        toggle3D,
        toasts,
        showToast,
        isBooting,
        finishBoot,
        chaosState,
        setChaosState
      }}
    >
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span style={{ color: "var(--accent)" }}>&gt;</span> {t.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
