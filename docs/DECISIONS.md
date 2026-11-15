# Decisions Log
The build agent records every non-obvious decision and every added dependency here (date, decision, reason).

## 2026-11-15: Initial Setup & Dependencies
- **React 19 + Vite 6**: Fast build, modern ESM support, lean bundle size.
- **React Router 7**: Modern routing for client-side navigation across `/`, `/projects`, `/registry`, `/pipeline`, `/status`, `/architecture`, `/chaos`, `/resume`.
- **Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing + maath**: Permitted and required by `docs/3D_EXPERIENCE.md`.
- **@fontsource-variable/bricolage-grotesque, @fontsource-variable/instrument-sans, @fontsource-variable/jetbrains-mono**: Self-hosted variable fonts ensuring high Lighthouse score, no external Google Fonts requests, and exact matching of font design tokens.
- **Custom Terminal Component**: As required by `AGENT_PROMPT.md`, avoided `xterm.js` to keep initial bundle size well below the 200 KB budget.
- **No external icon library**: Used lightweight inline SVGs to keep bundle overhead minimal.
- **Docker environment note**: Windows host does not have the `docker` daemon CLI installed in PATH. Multi-stage Dockerfile and docker-compose.yml are created and configured to run Nginx serving the Vite production build.
