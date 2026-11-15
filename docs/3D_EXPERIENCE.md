# 3D Experience Spec (mandatory, builds on PREMIUM_DESIGN.md)

The portfolio must feel like walking through a living cloud platform. The 3D layer is the signature of the site:
bold, cinematic and unmistakably "DevOps", while the HTML content stays crisp, readable and accessible.
**This file overrides the "one memorable moment only" rule in `PREMIUM_DESIGN.md`.** Everything else in that file
(tokens, type, spacing, copywriting, component standards) still applies. Keep the UI chrome calm so the 3D can be loud.

## 1. Concept: "The Cluster"
A glowing cluster of container cubes floats in a dark void, orbiting a bright core that represents the engineer.
Data packets stream between nodes along curved light lines (pipelines). The cluster reacts to the cursor/finger,
to scroll position, and to real data (pipeline status, uptime). It boots, deploys, breaks and heals on screen.

Visual language
- Dark ink void with a faint volumetric fog and a subtle starfield of tiny "log" particles.
- Nodes are rounded cubes with a glass-metal material (physical material, low roughness, emissive edges).
- Light colors only from the design tokens: accent `#7CC4FF` for flow, `--ok` for healthy, `--warn` for deploying,
  `--fail` for failing. Bloom makes active nodes glow. No random rainbow.
- Motion is smooth and physical: damped springs, easing, slow drift. No jittery constant spinning.

## 2. Tech stack (allowed dependencies)
- `three`, `@react-three/fiber`, `@react-three/drei` (View, Html, Text, Float, useTexture, PerformanceMonitor, AdaptiveDpr)
- `@react-three/postprocessing` (Bloom, subtle ChromaticAberration for the chaos scene only), high tier only
- `maath` for damping, `lenis` for smooth scroll (optional). Avoid physics engines and big GLTF models.
- Geometry is procedural (instanced meshes, tubes, planes). Any asset must be under 150 KB; textures max 1024px.
- Record every dependency in `docs/DECISIONS.md`.

## 3. Architecture
- **One WebGL context** for the whole site. Use a persistent full-viewport `<Canvas>` in the layout with drei `<View>` tracking
  DOM placeholders per section, or a single fixed canvas whose camera is driven by scroll progress. Never create a canvas per section.
- The canvas is lazy-loaded (`React.lazy`) and starts after first paint. LCP must be HTML text (headline), never the canvas.
- Canvas is `aria-hidden="true"`, `pointer-events: none` except inside interactive regions (hero, registry shelf, chaos).
- Scroll state lives in a small store (scroll progress 0 to 1, active section, pointer position). Scenes read it in `useFrame`.
- Starter files already in the repo: `frontend/src/three/quality.js` (tier detection) and `SceneCanvas.jsx` / `Canvas3D.jsx`
  (lazy, visibility-aware canvas wrapper). Extend them; do not replace the tier logic.

## 4. Scenes (map every route to a scene)

| Route / section | 3D scene | Interaction |
|---|---|---|
| `/` hero | **Cluster boot:** nodes spawn from the core, light up one by one in sync with the terminal boot; the release card flips to healthy when the last node ignites | Pointer parallax, drag to orbit (damped), hover node shows its name, click opens that project |
| `/` scroll | **Camera fly-through:** the camera dives through the cluster into each featured project's pod; pods expand into HTML cards | Scroll-driven, reversible |
| `/projects` | **Project racks:** each project is a tall rack/pod with status lights on its side (color = status); stack chips orbit as small tags | Hover lifts the pod, click expands the postmortem |
| `/registry` | **The registry vault:** certificates are floating image plates on a curved shelf/helix (textures from `/certs`); the shelf rotates with scroll or drag; selected plate flies to front and opens the Inspect drawer | Drag/scroll to rotate, click to pull (flip and zoom), filter chips dim non-matching plates |
| `/registry` pipeline row | Courses in progress as capsules moving through four gates (build, test, scan, deploy) | Auto-looping |
| `/pipeline` | **Conveyor line:** a glowing build capsule travels through lint, build, scan, deploy gates; gate color comes from real or mock run data; failures flash the gate red and stop the capsule | Hover a gate for stage details |
| `/status` | **Uptime skyline:** 30 days of uptime per service as extruded bars forming a city skyline; a slow scanning light sweeps across | Hover a bar for the day's value |
| `/architecture` | The cluster in exploded view: layers (GitHub, Actions, GHCR, VM, Nginx, monitoring) float apart with labeled links; hover highlights the data path | Orbit, hover |
| `/chaos` | **Break and heal:** pressing the button glitches the cluster (shake, chromatic aberration, red pulse, a node cracks and goes dark), an alert ring expands, the node reboots and rejoins | Button-driven, replayable, sandbox only |
| `/resume` | No 3D (print and accessibility first) | None |
| 404 | A single lost node drifting away from the cluster | None |

## 5. Quality tiers and responsiveness (fully responsive, no exceptions)
Detect the tier at load with `quality.js` and expose it through context. Tiers:

| Tier | When | Instances | DPR max | Postprocessing | FPS cap |
|---|---|---|---|---|---|
| `high` | desktop, 8+ cores, 8 GB+ memory | 60 nodes, 400 particles | 1.75 | Bloom (+ aberration on chaos) | 60 |
| `medium` | tablets, mid phones, laptops | 28 nodes, 150 particles | 1.5 | none, fake glow with additive sprites | 60 |
| `low` | weak devices, save-data | 14 nodes, 40 particles | 1.0 | none | 30 |
| `off` | no WebGL, reduced motion, user toggled 3D off | none | n/a | n/a | n/a |

Rules
- `PerformanceMonitor` downgrades the tier live if the average FPS drops below 40 for 2 seconds; never upgrade back in the same session.
- `off` tier shows a high-quality **static fallback**: a pre-rendered SVG/CSS cluster poster with a gentle CSS-only glow animation
  (disabled with reduced motion). Content and navigation are identical in every tier.
- Camera adapts to aspect ratio: portrait screens pull the camera back and narrow the cluster so nothing is cropped;
  landscape uses a wider spread. Recompute on resize and orientation change.
- Touch: vertical page scroll must always work (`touch-action: pan-y` on the canvas wrapper). Orbit drag is horizontal only on touch
  and only inside the hero or registry regions.
- Breakpoints to verify: 360, 390, 768, 1024, 1440, 1920 px widths, plus landscape phone.
- Pause rendering (`frameloop="never"`) when the canvas is off-screen (IntersectionObserver) or the tab is hidden.
- Dispose geometries, materials and textures on unmount. No memory growth after 10 route changes.
- Nav includes a visible **"3D: on/off"** toggle persisted in `localStorage` (`3d-mode`). Default follows the detected tier.

## 6. Performance budget
- Initial route JS (excluding the lazy 3D chunk) under 200 KB gzipped; the 3D chunk under 450 KB gzipped, loaded after first paint.
- Draw calls under 150, triangles under 300k on high tier; use `InstancedMesh` for nodes and particles.
- No real-time shadows; fake depth with fog, rim light and emissive materials.
- Lighthouse: desktop performance 90+, mobile performance 75+ with 3D enabled, accessibility 95+. Total blocking time under 300 ms.
- Cumulative layout shift under 0.05 (reserve the hero canvas area with CSS aspect ratio).

## 7. Accessibility and safety
- Every fact shown in 3D (project names, certificates, statuses) also exists as real HTML text in the DOM.
- `prefers-reduced-motion: reduce` switches to the `off` tier or a still frame; chaos scene becomes a static before/after.
- No flashing faster than 3 times per second; the chaos glitch must stay under that limit.
- Text over 3D always sits on a panel with sufficient contrast (AA). Never put paragraphs directly on the canvas.
- Keyboard: every 3D interaction has an equivalent button or link (e.g. registry plates are focusable list items that also fly to front).

## 8. Quality bar for the 3D layer
- [ ] Looks cinematic on a 1440p desktop and still beautiful on a 360px phone (not just a shrunken desktop)
- [ ] Tier detection works; forcing each tier through a `?3d=low|medium|high|off` query parameter works for testing
- [ ] Stable 60 fps on desktop, 30+ fps on a mid-range phone
- [ ] Fallback poster renders when WebGL is disabled
- [ ] Scroll fly-through is reversible, jank-free and never traps scrolling
- [ ] No console warnings (no context lost, no disposed-texture errors)
- [ ] Remove one effect from each scene as a final restraint pass: spectacle without noise
