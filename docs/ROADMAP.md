# Roadmap (check off each stage)

- [x] **Stage 1A: Static site + Docker** (terminal landing, projects, registry, resume, mock status/pipeline/chaos)
  - Accept: `docker compose up` serves all routes; all content comes from JSON; skip button visible; mobile OK; premium finish per `PREMIUM_DESIGN.md` and its quality bar passes.
- [x] **Stage 1B: 3D experience** (see `3D_EXPERIENCE.md`)
  - Accept: every route has its scene; tiers and `?3d=` override work; static fallback shown when WebGL is off; 60 fps desktop, 30+ fps mid phone;
    HTML content and keyboard access intact; 3D chunk lazy-loaded within budget.
- [ ] **Stage 2: CI/CD**
  - GitHub Actions: lint, build, build image, push to GHCR; add pipeline status badge to the site.
  - Accept: push to `main` runs the workflow green.
- [ ] **Stage 3: Cloud hosting + HTTPS**
  - Deploy image to a free-tier VM or Render/Fly.io; domain + HTTPS (Cloudflare / Let's Encrypt); auto-deploy on push.
  - Accept: public HTTPS URL updates after a push.
- [ ] **Stage 4: Infrastructure as Code**
  - Terraform for VM, networking, DNS; remote state notes; documented in `/architecture`.
  - Accept: `terraform apply` from scratch recreates the host.
- [ ] **Stage 5: Monitoring + status page**
  - docker-compose with Uptime Kuma, Prometheus, Grafana; alerts to Telegram/Discord webhook; wire `/status` to real checks.
  - Accept: stopping the app container triggers an alert and the status page turns red.
- [ ] **Stage 6: Live pipeline view**
  - Fetch GitHub Actions runs via API with caching and static fallback; show on `/pipeline` and project cards.
  - Accept: latest runs visible; works when API is rate-limited.
- [ ] **Stage 7: Chaos button + rollback**
  - Sandbox container is killed or a feature flag flipped; show alert, auto-restart, rollback timeline.
  - Accept: never affects the real site; rate-limited.
- [ ] **Stage 8 (optional): Kubernetes**
  - k3s/minikube, Helm chart, migration notes.
- [ ] **Stage 9: Final polish and audit**
  - Re-run the full quality bar in `PREMIUM_DESIGN.md` section 8 on the deployed site; fix regressions from later stages
    (real status data, live pipeline, chaos page); add Open Graph image, sitemap and robots.txt; write the final README with diagram.
  - Accept: Lighthouse targets met on the production URL.
