# Portfolio: "Portfolio as a Live Production System"

A DevOps student's personal portfolio built as a live production platform:
interactive terminal UI, 3D container cluster, live pipeline conveyor, real-time status page, chaos engineering sandbox, and an OCI artifact registry for certificates.

## Completed Stages
- [x] **Stage 1A: Static Site + Production Docker**
- [x] **Stage 1B: Complete 3D Experience (The Cluster)**

## Tech Stack
- **Frontend**: Vite 6, React 19, React Router 7, Plain CSS (Tokens per `docs/PREMIUM_DESIGN.md`)
- **3D Layer**: Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `maath`
- **Fonts**: Self-hosted Variable Fonts (`@fontsource-variable/{bricolage-grotesque, instrument-sans, jetbrains-mono}`)
- **Container**: Multi-stage Alpine Dockerfile with Nginx 1.27 serving SPA routes with gzip and health probes

## How to Run

### Option 1: Docker Compose (Production Build)
```bash
docker compose up --build
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Local Node.js Preview / Dev Server
```bash
cd frontend
npm install
npm run build
npm run preview
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

## Testing 3D Quality Tiers
Test quality tiers via query parameter or using the interactive toggle in the navbar:
- High (Postprocessing Bloom + 60 nodes + 400 particles): `http://localhost:8080/?3d=high`
- Medium (Additive glow + 28 nodes + 150 particles): `http://localhost:8080/?3d=medium`
- Low (14 nodes + 40 particles, 30fps cap): `http://localhost:8080/?3d=low`
- Off (Static CSS/SVG cluster fallback poster): `http://localhost:8080/?3d=off`
