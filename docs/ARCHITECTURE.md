# Target Architecture

```
Developer -> GitHub repo -> GitHub Actions (lint, build, scan, push image to GHCR)
                                   |
                                   v
                          Deploy (SSH / Render / Fly.io)
                                   |
                                   v
User -> Cloudflare (DNS + HTTPS) -> VM -> Nginx container (React build)
                                   |
                                   +-> Uptime Kuma -> /status
                                   +-> Prometheus -> Grafana
                                   +-> Alerts -> Telegram/Discord
                                   +-> Chaos sandbox container
```

## Tool choices
| Layer | Choice |
|---|---|
| Frontend | Vite + React + plain CSS |
| 3D | three.js via react-three-fiber and drei (lazy-loaded, tiered) |
| Container | Docker multi-stage, Nginx |
| CI/CD | GitHub Actions + GHCR |
| Hosting | Free-tier VM or Render/Fly.io |
| IaC | Terraform |
| Monitoring | Uptime Kuma, Prometheus, Grafana |
| DNS/HTTPS | Cloudflare + Let's Encrypt |

The `/architecture` page should render this diagram (SVG or CSS) and link each box to the relevant file in the repo.
