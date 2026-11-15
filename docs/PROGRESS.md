# PROGRESS LOG (handoff context for next agent)

Newest entries at the bottom. Update after every milestone.
Project: Portfolio (React + Vite + react-three-fiber), dark "DevOps control room" theme. Code in frontend/src. Design tokens: frontend/src/styles/tokens.css.

## Original design audit (priority order) and status
1. Mobile layout            -> DONE in M3 (needs visual verify)
2. Label clipping (racks/pipeline) -> DONE in M1/M2 (needs visual verify)
3. Registry legibility      -> DONE in M2 (needs visual verify)
4. Chaos hero polish        -> DONE in M2 (needs visual verify)
5. Repo hygiene             -> DONE in M4

## Milestones

### M0 - Audit + partial cleanup (previous agent)
- Moved screenshot-architecture.png and screenshot-new-projects.png into docs/dev-screenshots/.
- Prior audit claim "light theme on mobile" was NOT reproducible: AppContext defaults to dark, and the latest frontend/screenshots/viewport-390px-home.png is dark. Likely a stale screenshot or a saved localStorage "theme=light".

### M1 - Projects racks (DONE)
- ARGUS label was missing with plenty of canvas room, so this was not simple edge clipping. Root cause of the drei <Html> first-item drop is unconfirmed.
- Removed <Html> labels from ProjectRacksScene.jsx; added DOM legend chips (clickable) under the canvas in pages/Projects.jsx.
- Added src/three/FitGroup.jsx (scales a scene to the canvas viewport). Racks wrapped in it.

### M2 - Pipeline, Chaos, Registry (DONE)
- PipelineConveyorScene.jsx: removed <Html> stage labels, wrapped in FitGroup, now exports GATES; Pipeline.jsx shows a DOM gate legend (name + description).
- ChaosGlitchScene.jsx: wrapped in FitGroup; Chaos.jsx got a legend naming node-a, sandbox-pod-0x4f (colour follows chaosState), node-b.
- Registry.jsx: replaced the 3D floating-plate vault with a flat credential gallery (thumbnail, kind, title, issuer; click opens the existing Pull modal). RegistryVaultScene.jsx is now UNUSED (kept on disk, safe to delete).

### M3 - Mobile home (DONE)
- Home.jsx: removed `.hero-right { order: -1 }` so headline and CTAs come before the 3D stage on small screens; added a max-width 640px block (260px 3D stage, stacked section headers, full-width CTAs).

### M4 - Repo hygiene (DONE)
- Moved all loose screenshots from frontend/ root to docs/dev-screenshots/. frontend/screenshots/ (viewport/tier test output) left in place.

### M5 - FitGroup rollout (DONE)
- ArchitectureExplodedScene.jsx and StatusSkylineScene.jsx now wrapped in FitGroup (their <Html> labels kept; they rendered fine in the audit). HeroClusterScene intentionally left alone (already has its own isMobile scaling).
- Reviewed edited files by reading them; unused imports removed (Registry.jsx SceneCanvas/RegistryVaultScene/ClusterFallback, Pipeline scene Html/THREE, Racks scene Html).

### M6 - Pipeline page wired to real GitHub Actions data (DONE, UNTESTED)
- New src/lib/githubActions.js: fetchRuns() (GET /repos/{repo}/actions/runs) and fetchRunStages() (GET .../runs/{id}/jobs, lazy per selected run), cached 5 min in sessionStorage. Unauthenticated: 60 req/hr per visitor IP, repo must be public.
- Pipeline.jsx: loads live runs when VITE_GITHUB_REPO is set to a valid owner/repo; otherwise (or on any API error/rate limit) falls back to the old sample runs. Header badge says "sample data" vs "latest run passing"/"latest run: <conclusion>". Strip shows commit message, link to the run on GitHub, real step list (install/lint/build/build docker image) with success/failure/in_progress styling.
- Gates in the 3D scene: scan and deploy are marked `planned: true` (amber, legend says "(planned)") because ci.yml has no Trivy/GHCR/deploy steps yet.
- VITE_GITHUB_REPO plumbed through docker/Dockerfile (ARG), docker-compose.yml (arg), ci.yml (env + --build-arg using github.repository). .env.example documents it.
- USER TODO: the real repo name is unknown to the agent. Create frontend/.env with VITE_GITHUB_REPO=Akshay44776/<repo-name> (and root .env for docker compose). Repo has to be public and have at least one Actions run.
- Known gap: `npm run lint --if-present` in ci.yml is a no-op (no lint script in package.json), so the lint stage always "passes". Stage 2 (Trivy scan, GHCR push, deploy) is still a TODO in ci.yml.

## NOT YET DONE / next agent

### M7 - CI stage 2 (DONE, UNTESTED)
- ci.yml: removed the no-op Lint step (no lint script exists, so it always falsely passed). Docker image is now tagged ghcr.io/<lowercased repo>:<sha>, scanned with Trivy (aquasecurity/trivy-action@0.28.0, fails on fixable HIGH/CRITICAL), and on push to main logged in to GHCR and pushed (:sha and :latest). Not run on GitHub yet; first run may need tweaks (e.g. Trivy findings in nginx/alpine base image failing the job).
- PipelineConveyorScene.jsx GATES: lint is now marked planned (amber, "not configured yet"); scan and deploy are real (green). Deploy means GHCR push only; no hosting deploy exists.
- Did NOT add ESLint: adding devDependencies without regenerating frontend/package-lock.json would break `npm ci` in CI. Do it locally: cd frontend && npm i -D eslint @eslint/js eslint-plugin-react globals, add a "lint" script and eslint.config.js, commit the lockfile, then re-add a Lint step to ci.yml and un-plan the lint gate.
- Folder is not a git repo (no .git), so the repo name could not be read. USER TODO still open: VITE_GITHUB_REPO in frontend/.env.

- Nothing has been run or visually checked. Next step: `cd frontend && npm run dev`, then check /, /projects, /pipeline, /chaos, /registry at 390px and 1440px; fix any build errors.
- Confirm Html-label root cause is irrelevant now (labels no longer use drei <Html> on Projects/Pipeline).
- Optional polish: HeroClusterScene/ArchitectureExplodedScene/StatusSkylineScene could use FitGroup too; consider moving frontend/screenshots/ to docs; delete RegistryVaultScene.jsx.
