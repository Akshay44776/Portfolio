> `docs/PREMIUM_DESIGN.md` is the authoritative design spec and overrides this file where they conflict.

# Design Direction
- Dark theme; monospace font (JetBrains Mono or Fira Code, with system monospace fallback).
- Status colors: green = healthy, amber = deploying/warning, red = failing. Never rely on color alone (add icons/text).
- CSS variables for theme tokens; also provide a light theme toggled by the `theme` command and a nav button.
- Subtle blinking cursor, skippable boot sequence (remember skip in localStorage). Respect `prefers-reduced-motion`.
- Layout: status-bar style nav, content in a max-width container, cards with thin borders, no heavy shadows.
- Mobile first. Tap targets at least 44px. Terminal input must work with mobile keyboards.
- Accessibility: contrast AA, focus outlines, semantic HTML, aria-labels, skip link.
- Performance: no large images, lazy-load routes, initial JS under about 200 KB gzipped; the 3D chunk is lazy-loaded (see `3D_EXPERIENCE.md`).
