// Quality tier detection for the 3D layer. See docs/3D_EXPERIENCE.md section 5.
export const TIERS = ["off", "low", "medium", "high"];

export const TIER_CONFIG = {
  off:    { nodes: 0,  particles: 0,   dpr: 1,    bloom: false, fpsCap: 0 },
  low:    { nodes: 14, particles: 40,  dpr: 1,    bloom: false, fpsCap: 30 },
  medium: { nodes: 28, particles: 150, dpr: 1.5,  bloom: false, fpsCap: 60 },
  high:   { nodes: 60, particles: 400, dpr: 1.75, bloom: true,  fpsCap: 60 },
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function safeStorageGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

export function detectQuality() {
  if (typeof window === "undefined") return "off";

  // Manual override for testing: ?3d=low|medium|high|off
  const q = new URLSearchParams(window.location.search).get("3d");
  if (q && TIERS.includes(q)) return q;

  if (safeStorageGet("3d-mode") === "off") return "off";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  if (!hasWebGL()) return "off";

  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const saveData = navigator.connection && navigator.connection.saveData;

  if (saveData || memory <= 2 || cores <= 2) return "low";
  if (!coarse && !small && memory >= 8 && cores >= 8) return "high";
  if (coarse && small && memory < 6) return "low";
  return "medium";
}

// Downgrade only, never upgrade within a session. high -> medium -> low (low and off stay as they are).
export function downgrade(tier) {
  if (tier === "high") return "medium";
  if (tier === "medium") return "low";
  return tier;
}
