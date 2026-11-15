# MASTER PROMPT FOR THE BUILD AGENT

You are a senior DevOps and frontend engineer. Build the portfolio described in this package.
Work autonomously. Do not ask clarifying questions unless something is truly blocking; make sensible
decisions, note them in `docs/DECISIONS.md`, and keep moving.

## 1. Goal
Build a personal portfolio for a final-year engineering student who is a fresher learning DevOps.
The portfolio must itself behave like a **live production system**: every page is backed by something real
(a container, a pipeline, a monitor, a registry) so a recruiter can verify the skills.

Read these files first, in order:
1. `README.md`
2. `docs/IDEA.md`
3. `docs/CERTIFICATES_SECTION.md`
4. `docs/PREMIUM_DESIGN.md` (**mandatory design spec; it overrides `docs/DESIGN.md`**)
5. `docs/3D_EXPERIENCE.md` (**mandatory 3D spec; it overrides the "one memorable moment" rule in `PREMIUM_DESIGN.md`**)
6. `docs/DESIGN.md`
7. `docs/ARCHITECTURE.md`
8. `docs/ROADMAP.md`
9. `data/profile.json`, `data/registry.json`, `data/projects.json`
10. `frontend/src/styles/tokens.css`, `base.css` and `frontend/src/three/*` (starter design system and 3D wrapper; extend, do not replace)

## 2. Tech decisions (fixed, do not change without recording why)
- Frontend: **Vite + React (JavaScript or TypeScript) + React Router + plain CSS** (CSS variables from `tokens.css`, no heavy UI kit).
- 3D: `three` + `@react-three/fiber` + `@react-three/drei` (+ `@react-three/postprocessing` on the high tier only), lazy-loaded, per `docs/3D_EXPERIENCE.md`.
- Fonts: self-host Bricolage Grotesque, Instrument Sans and JetBrains Mono via `@fontsource` packages (allowed dependencies).
- Terminal UI: a **custom React component** (no xterm.js) to keep the bundle small.
- Container: Docker multi-stage build, served by Nginx.
- CI/CD: GitHub Actions.
- IaC: Terraform (Stage 4).
- Monitoring: Uptime Kuma + Prometheus + Grafana via docker-compose (Stage 5).
- All site content comes from JSON in `frontend/src/data/` (copied from `data/`). No hardcoded content in components.

## 3. Hard rules
- **Never invent personal data** (name, certificates, credential IDs, achievements, links). Use the data files;
  keep `{{PLACEHOLDER}}` values visible if the user has not replaced them.
- **No secrets in the repo.** Use environment variables and GitHub Secrets. Provide `.env.example`.
- **Usability first:** a visible "Skip to Resume / Projects" button on the first screen, plain-text fallback
  (`/resume`), keyboard navigation, mobile-responsive, Lighthouse performance 90+.
- The chaos feature may only affect a sandbox (a simulated state in Stages 1-6; a disposable container later),
  never the real site.
- Third-party API calls (GitHub) must be cached and fall back to static JSON if rate-limited or offline.
- Keep dependencies minimal. Explain any new dependency in `docs/DECISIONS.md`.
- After each stage, update `README.md` with run instructions and tick the stage in `docs/ROADMAP.md`.

## 3b. Premium finish (applies to EVERY page, from Stage 1)
The site must look premium, not like a template. Follow `docs/PREMIUM_DESIGN.md` exactly: the named color tokens,
the three-font system, the spacing and radius scales, component standards, page-by-page treatments, motion rules,
copywriting rules and the quality-bar checklist. Key points:
- The 3D "Cluster" experience (`docs/3D_EXPERIENCE.md`) is the signature of the site: cinematic, interactive, scroll-driven, and fully responsive. Keep the HTML UI chrome calm and legible so the 3D can be bold.
- No ALL CAPS labels, no "->" suffixes on links, no identical card grids, no scroll fade-ups on every section.
- Dark and light themes both fully polished; status never conveyed by color alone.
- Before finishing each stage, run through the quality bar in section 8 of `PREMIUM_DESIGN.md`, fix failures,
  and view the result at 360, 768, 1024 and 1440px widths (take screenshots if your environment supports it).
- Remove one decorative element from each page as a final self-critique step.

## 3c. 3D experience (mandatory, fully responsive)
Build the 3D layer exactly as specified in `docs/3D_EXPERIENCE.md`: one persistent WebGL context, a scene mapped to every route,
quality tiers (`high`, `medium`, `low`, `off`) with live downgrade, a static fallback poster, touch-friendly controls that never block
page scroll, a visible "3D: on/off" toggle, reduced-motion support, and every fact also present as real HTML text.
Test each tier with `?3d=low|medium|high|off`, and verify at 360, 390, 768, 1024, 1440 and 1920 px widths plus landscape phone.
The 3D must look designed for phones too, not just a shrunken desktop scene.

## 4. Build order
Follow `docs/ROADMAP.md` stage by stage. **Start with Stage 1 now.** After finishing a stage:
1. Run it locally (and in Docker where relevant) and verify the acceptance criteria.
2. Write a short stage report (what was built, how to run it, what to review).
3. **Stop and wait** for the user to say "Continue to the next stage."

## 5. Stage 1A deliverables (start here)
Create a working frontend in `frontend/` with these routes:
- `/` Terminal landing. Supported commands: `help`, `about`, `ls projects`, `open <project>`, `ls certs`,
  `skills`, `contact`, `resume`, `clear`, `theme`, `chaos`. Command history with up/down arrows, tab autocomplete,
  a skippable boot sequence, and a visible **Skip to Resume / Projects** button.
- `/projects` Each project rendered as a "service card": name, status badge (static for now), stack, a postmortem
  block (Problem, Incident, Root cause, Fix, Automation), and repo/demo links.
- `/registry` The Artifact Registry section exactly as specified in `docs/CERTIFICATES_SECTION.md`
  (images table, pipeline-running courses, release-notes achievements, skills health panel, CLI-style filter,
  Pull modal, Inspect panel).
- `/status`, `/pipeline`, `/architecture`, `/chaos` as working placeholder pages that read mock JSON
  (`frontend/src/data/status.mock.json`, `pipeline.mock.json`) and are structured to be wired to real data later.
- `/resume` A plain, fast, printable resume page.
- Shared layout: top nav styled like a status bar, footer with build info (commit SHA, build time via env vars).
- Premium finish per `docs/PREMIUM_DESIGN.md`: release card on home, boot-to-live sequence, polished registry drawer/modal, styled 404 and error boundary, Open Graph image and favicon, print-optimized `/resume`.
- Dockerfile + nginx.conf (use the starter files in `docker/`) so `docker compose up` serves the site.

## 5b. Stage 1B deliverables (after 1A is approved)
Add the full 3D experience from `docs/3D_EXPERIENCE.md`: the hero Cluster boot synced with the terminal boot, scroll-driven fly-through,
project racks, the registry vault with certificate plates (textures from `frontend/public/certs`), pipeline conveyor, uptime skyline,
exploded architecture view and the chaos break-and-heal scene. Reuse the data in `frontend/src/data/`; nothing hardcoded.
Stage 1A must already work fully without 3D (that is also the `off` tier).

## 6. Definition of done for the whole project
- Site is deployed on a public URL with HTTPS, automatically redeployed on push to `main`.
- `/pipeline` shows real GitHub Actions runs; `/status` shows real uptime checks.
- Infra is reproducible via Terraform; monitoring runs via docker-compose.
- Chaos button demonstrates failure, alert, auto-recovery/rollback on a sandbox.
- README contains an architecture diagram and step-by-step run/deploy instructions.

## 7. Output style
Be concise in your reports. Show file trees and run commands. Flag anything the user must do manually
(creating the GitHub repo, adding secrets, buying/pointing a domain, cloud account setup).
