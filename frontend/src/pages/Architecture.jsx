import React, { useState } from "react";
import SceneCanvas from "../three/SceneCanvas";
import ArchitectureExplodedScene from "../three/scenes/ArchitectureExplodedScene";
import ClusterFallback from "../components/ClusterFallback";

export default function Architecture() {
  const [highlightedPath, setHighlightedPath] = useState(null);

  const architectureLayers = [
    {
      id: "source",
      name: "1. Version Control & GitOps",
      tech: "GitHub Repository",
      details: "Branch-protected trunk-based development with signed commits and automated pull request workflows.",
      file: "https://github.com/Akshay44776/Portfolio"
    },
    {
      id: "ci",
      name: "2. Continuous Integration & Quality",
      tech: "GitHub Actions (.github/workflows/ci.yml)",
      details: "Runs automated linting, security analysis via Trivy, unit validation, and multi-stage container building.",
      file: "https://github.com/Akshay44776/Portfolio/blob/main/.github/workflows/ci.yml"
    },
    {
      id: "registry",
      name: "3. Container Image Registry",
      tech: "GitHub Container Registry (GHCR)",
      details: "Publishes immutable tagged OCI container images with SHA256 cryptographic signatures.",
      file: "https://github.com/Akshay44776"
    },
    {
      id: "edge",
      name: "4. Global Edge & Ingress",
      tech: "Cloudflare (DNS & Strict SSL/TLS)",
      details: "Global Anycast edge proxy providing SSL/TLS offloading, DDoS mitigation, and edge caching headers.",
      file: "#"
    },
    {
      id: "runtime",
      name: "5. Production Container Runtime",
      tech: "Linux VM + Docker Compose + Nginx",
      details: "Multi-stage Alpine Nginx container serving SPA routing, gzip compression, and secure HTTP response headers.",
      file: "https://github.com/Akshay44776/Portfolio/blob/main/docker/nginx.conf"
    },
    {
      id: "observability",
      name: "6. Monitoring & Telemetry",
      tech: "Uptime Kuma, Prometheus, Grafana",
      details: "Real-time synthetic probing of /healthz endpoint, p95 latency tracking, and automated Telegram alert dispatch.",
      file: "https://github.com/Akshay44776/Portfolio/blob/main/docker/nginx.conf"
    }
  ];

  return (
    <div className="architecture-page">
      <div className="container">
        {/* Header */}
        <div className="architecture-header">
          <div className="header-meta">
            <span className="section-eyebrow">target system topology</span>
            <span className="badge badge--ok">gitops &bull; docker &bull; edge</span>
          </div>
          <h1 className="architecture-title">System Architecture</h1>
          <p className="architecture-desc">
            Complete topology of the production deployment: from local commit to CI/CD pipeline, edge TLS termination, containerized web servers, and telemetry probes.
          </p>
        </div>

        {/* 3D Exploded Layer Scene */}
        <div className="panel architecture-exploded-panel">
          <div className="exploded-header">
            <span className="exploded-title">exploded cluster view &bull; floating platform layers</span>
            <span className="exploded-sub">Hover to inspect layer &bull; Drag to orbit</span>
          </div>
          <div className="exploded-canvas-box">
            <SceneCanvas
              fallback={<ClusterFallback title="System Architecture Exploded View" />}
              className="exploded-scene-canvas"
            >
              <ArchitectureExplodedScene />
            </SceneCanvas>
          </div>
        </div>

        {/* Interactive SVG Topology Diagram */}
        <div className="panel diagram-card">
          <div className="diagram-header">
            <h2 className="diagram-title">Interactive Deployment Topology</h2>
            <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
              Hover node to highlight pipeline data path
            </span>
          </div>

          <div className="svg-container">
            <svg
              viewBox="0 0 920 380"
              className="architecture-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7CC4FF" />
                  <stop offset="100%" stopColor="#34D3A1" />
                </linearGradient>
              </defs>

              {/* Connecting Pipeline Paths */}
              {/* Dev -> GitHub */}
              <line
                x1="120" y1="100" x2="220" y2="100"
                stroke={highlightedPath === "source" ? "url(#edgeGlow)" : "#253246"}
                strokeWidth={highlightedPath === "source" ? "3" : "2"}
                strokeDasharray={highlightedPath === "source" ? "none" : "4 4"}
              />
              {/* GitHub -> Actions */}
              <line
                x1="360" y1="100" x2="440" y2="100"
                stroke={highlightedPath === "ci" ? "url(#edgeGlow)" : "#253246"}
                strokeWidth={highlightedPath === "ci" ? "3" : "2"}
              />
              {/* Actions -> GHCR */}
              <line
                x1="580" y1="100" x2="660" y2="100"
                stroke={highlightedPath === "registry" ? "url(#edgeGlow)" : "#253246"}
                strokeWidth={highlightedPath === "registry" ? "3" : "2"}
              />
              {/* GHCR -> VM Deploy */}
              <path
                d="M730,140 L730,220 L580,220"
                fill="none"
                stroke={highlightedPath === "runtime" ? "url(#edgeGlow)" : "#253246"}
                strokeWidth="2"
              />
              {/* User -> Cloudflare */}
              <line
                x1="120" y1="280" x2="220" y2="280"
                stroke={highlightedPath === "edge" ? "url(#edgeGlow)" : "#253246"}
                strokeWidth="2"
              />
              {/* Cloudflare -> Nginx VM */}
              <line
                x1="360" y1="280" x2="440" y2="250"
                stroke={highlightedPath === "runtime" ? "url(#edgeGlow)" : "#253246"}
                strokeWidth="2"
              />
              {/* VM -> Monitoring */}
              <line
                x1="510" y1="290" x2="510" y2="340"
                stroke={highlightedPath === "observability" ? "url(#edgeGlow)" : "#253246"}
                strokeWidth="2"
              />

              {/* NODE 1: Developer */}
              <g transform="translate(40, 60)">
                <rect width="80" height="80" rx="8" fill="#111821" stroke="#253246" strokeWidth="1.5" />
                <text x="40" y="44" textAnchor="middle" fill="#E8EEF6" fontSize="12" fontFamily="monospace">Dev</text>
                <text x="40" y="60" textAnchor="middle" fill="#8C9BB0" fontSize="10" fontFamily="sans-serif">Local Workstation</text>
              </g>

              {/* NODE 2: GitHub Repo */}
              <g
                transform="translate(220, 60)"
                onMouseEnter={() => setHighlightedPath("source")}
                onMouseLeave={() => setHighlightedPath(null)}
                style={{ cursor: "pointer" }}
              >
                <rect width="140" height="80" rx="8" fill="#18212D" stroke="#7CC4FF" strokeWidth="1.5" />
                <circle cx="20" cy="24" r="4" fill="#7CC4FF" />
                <text x="32" y="28" fill="#7CC4FF" fontSize="11" fontFamily="monospace">GitHub Repo</text>
                <text x="14" y="52" fill="#E8EEF6" fontSize="12" fontWeight="600">Trunk Main</text>
                <text x="14" y="68" fill="#8C9BB0" fontSize="10">Webhook Trigger</text>
              </g>

              {/* NODE 3: GitHub Actions */}
              <g
                transform="translate(440, 60)"
                onMouseEnter={() => setHighlightedPath("ci")}
                onMouseLeave={() => setHighlightedPath(null)}
                style={{ cursor: "pointer" }}
              >
                <rect width="140" height="80" rx="8" fill="#18212D" stroke="#34D3A1" strokeWidth="1.5" />
                <circle cx="20" cy="24" r="4" fill="#34D3A1" />
                <text x="32" y="28" fill="#34D3A1" fontSize="11" fontFamily="monospace">GitHub Actions</text>
                <text x="14" y="52" fill="#E8EEF6" fontSize="12" fontWeight="600">Lint, Test, Scan</text>
                <text x="14" y="68" fill="#8C9BB0" fontSize="10">Multi-stage Docker</text>
              </g>

              {/* NODE 4: GHCR Registry */}
              <g
                transform="translate(660, 60)"
                onMouseEnter={() => setHighlightedPath("registry")}
                onMouseLeave={() => setHighlightedPath(null)}
                style={{ cursor: "pointer" }}
              >
                <rect width="140" height="80" rx="8" fill="#18212D" stroke="#7CC4FF" strokeWidth="1.5" />
                <circle cx="20" cy="24" r="4" fill="#7CC4FF" />
                <text x="32" y="28" fill="#7CC4FF" fontSize="11" fontFamily="monospace">GHCR Registry</text>
                <text x="14" y="52" fill="#E8EEF6" fontSize="12" fontWeight="600">OCI Image Store</text>
                <text x="14" y="68" fill="#8C9BB0" fontSize="10">Signed Artifacts</text>
              </g>

              {/* NODE 5: User Client */}
              <g transform="translate(40, 240)">
                <rect width="80" height="80" rx="8" fill="#111821" stroke="#253246" strokeWidth="1.5" />
                <text x="40" y="44" textAnchor="middle" fill="#E8EEF6" fontSize="12" fontFamily="monospace">Client</text>
                <text x="40" y="60" textAnchor="middle" fill="#8C9BB0" fontSize="10" fontFamily="sans-serif">Global Visitors</text>
              </g>

              {/* NODE 6: Cloudflare */}
              <g
                transform="translate(220, 240)"
                onMouseEnter={() => setHighlightedPath("edge")}
                onMouseLeave={() => setHighlightedPath(null)}
                style={{ cursor: "pointer" }}
              >
                <rect width="140" height="80" rx="8" fill="#18212D" stroke="#F5B544" strokeWidth="1.5" />
                <circle cx="20" cy="24" r="4" fill="#F5B544" />
                <text x="32" y="28" fill="#F5B544" fontSize="11" fontFamily="monospace">Cloudflare Edge</text>
                <text x="14" y="52" fill="#E8EEF6" fontSize="12" fontWeight="600">DNS & Strict TLS</text>
                <text x="14" y="68" fill="#8C9BB0" fontSize="10">DDoS & Edge Cache</text>
              </g>

              {/* NODE 7: Host VM & Nginx */}
              <g
                transform="translate(440, 210)"
                onMouseEnter={() => setHighlightedPath("runtime")}
                onMouseLeave={() => setHighlightedPath(null)}
                style={{ cursor: "pointer" }}
              >
                <rect width="140" height="80" rx="8" fill="#18212D" stroke="#34D3A1" strokeWidth="1.5" />
                <circle cx="20" cy="24" r="4" fill="#34D3A1" />
                <text x="32" y="28" fill="#34D3A1" fontSize="11" fontFamily="monospace">Host VM (Docker)</text>
                <text x="14" y="52" fill="#E8EEF6" fontSize="12" fontWeight="600">Nginx Container</text>
                <text x="14" y="68" fill="#8C9BB0" fontSize="10">Port 80 &bull; SPA Router</text>
              </g>

              {/* NODE 8: Monitoring */}
              <g
                transform="translate(660, 210)"
                onMouseEnter={() => setHighlightedPath("observability")}
                onMouseLeave={() => setHighlightedPath(null)}
                style={{ cursor: "pointer" }}
              >
                <rect width="140" height="80" rx="8" fill="#18212D" stroke="#7CC4FF" strokeWidth="1.5" />
                <circle cx="20" cy="24" r="4" fill="#7CC4FF" />
                <text x="32" y="28" fill="#7CC4FF" fontSize="11" fontFamily="monospace">Observability</text>
                <text x="14" y="52" fill="#E8EEF6" fontSize="12" fontWeight="600">Uptime Kuma</text>
                <text x="14" y="68" fill="#8C9BB0" fontSize="10">Prometheus & Grafana</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Layer Breakdown Cards */}
        <div className="layers-grid">
          {architectureLayers.map((layer) => (
            <div
              key={layer.id}
              className={`panel layer-card ${highlightedPath === layer.id ? "layer-card--active" : ""}`}
              onMouseEnter={() => setHighlightedPath(layer.id)}
              onMouseLeave={() => setHighlightedPath(null)}
            >
              <div className="layer-top">
                <span className="layer-step font-mono">{layer.name}</span>
                <span className="badge badge--ok" style={{ fontSize: "0.72rem" }}>active</span>
              </div>
              <h3 className="layer-tech font-mono">{layer.tech}</h3>
              <p className="layer-details">{layer.details}</p>
              {layer.file !== "#" && (
                <a
                  href={layer.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="layer-file-link font-mono"
                >
                  View Repo Manifest &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .architecture-page {
          padding: var(--space-6) 0 var(--space-8);
        }
        .architecture-header {
          margin-bottom: var(--space-6);
        }
        .architecture-title {
          font-size: var(--step-5);
          margin-bottom: var(--space-2);
        }
        .architecture-desc {
          font-size: var(--step-1);
          color: var(--text-muted);
          max-width: 65ch;
        }

        /* 3D Exploded Panel */
        .architecture-exploded-panel {
          margin-bottom: var(--space-6);
          overflow: hidden;
          padding: 0;
        }
        .exploded-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: var(--panel-raised);
          border-bottom: 1px solid var(--line);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .exploded-canvas-box {
          height: 340px;
          position: relative;
          background: var(--ink);
        }
        .exploded-scene-canvas {
          width: 100%;
          height: 100%;
        }

        /* Diagram */
        .diagram-card {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
        }
        .diagram-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
          gap: 8px;
        }
        .diagram-title {
          font-size: var(--step-2);
          margin: 0;
        }
        .svg-container {
          overflow-x: auto;
          background: rgba(10, 14, 20, 0.6);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
        }
        .architecture-svg {
          width: 100%;
          min-width: 700px;
          height: auto;
        }

        /* Layers Grid */
        .layers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-4);
        }
        .layer-card {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          transition: border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
        }
        .layer-card--active {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        .layer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .layer-step {
          font-size: 0.8rem;
          color: var(--accent);
        }
        .layer-tech {
          font-size: 0.95rem;
          margin: 0;
          color: var(--text);
        }
        .layer-details {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .layer-file-link {
          margin-top: auto;
          padding-top: 8px;
          font-size: 0.8rem;
          color: var(--accent);
          text-decoration: none;
        }
        .layer-file-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
