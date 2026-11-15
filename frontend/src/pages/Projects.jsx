import React, { useState, useEffect } from "react";
import projectsData from "../data/projects.json";
import SceneCanvas from "../three/SceneCanvas";
import ProjectRacksScene from "../three/scenes/ProjectRacksScene";
import ClusterFallback from "../components/ClusterFallback";

function PlaceholderText({ value }) {
  if (!value) return <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Not configured</span>;
  if (value.startsWith("{{")) {
    return (
      <span className="placeholder-tag font-mono">
        {value} <span className="placeholder-note">(details pending)</span>
      </span>
    );
  }
  return <span>{value}</span>;
}

export default function Projects() {
  const [expandedPostmortems, setExpandedPostmortems] = useState({
    argus: true
  });

  // Handle hash navigation (e.g. /projects#argus)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setExpandedPostmortems((prev) => ({ ...prev, [hash]: true }));
      const elem = document.getElementById(hash);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const togglePostmortem = (slug) => {
    setExpandedPostmortems((prev) => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  return (
    <div className="projects-page">
      <div className="container">
        {/* Page Header */}
        <div className="projects-header">
          <div className="header-meta">
            <span className="section-eyebrow">infrastructure & services</span>
            <span className="badge badge--ok">4 services deployed</span>
          </div>
          <h1 className="projects-title">Production Services</h1>
          <p className="projects-desc">
            Production-grade systems, microservices, and AI/blockchain architectures operated as verifiable software services.
          </p>
        </div>

        {/* 3D Project Racks Visualization */}
        <div className="panel projects-racks-panel">
          <div className="racks-panel-header">
            <span className="racks-title">cluster racks &bull; hardware & pod layout</span>
            <span className="racks-sub">Click a pod to inspect service details</span>
          </div>
          <div className="racks-canvas-box">
            <SceneCanvas
              fallback={<ClusterFallback title="Server Racks" />}
              className="racks-scene-canvas"
            >
              <ProjectRacksScene onSelectProject={(slug) => togglePostmortem(slug)} />
            </SceneCanvas>
          </div>
          <div className="racks-legend">
            {projectsData.map((p) => (
              <button
                key={p.slug}
                type="button"
                className="racks-legend-chip font-mono"
                onClick={() => togglePostmortem(p.slug)}
              >
                <span className={`legend-dot legend-dot--${p.status === "healthy" ? "ok" : "warn"}`} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards List */}
        <div className="services-list">
          {projectsData.map((project) => {
            const isExpanded = !!expandedPostmortems[project.slug];
            const isHealthy = project.status === "healthy";

            return (
              <article key={project.slug} id={project.slug} className="panel service-card">
                {/* Header row */}
                <div className="service-card-header">
                  <div>
                    <div className="service-badge-row">
                      <span className="service-year">{project.year}</span>
                      <span className="meta-sep">&bull;</span>
                      <span className="font-mono service-slug">svc/{project.slug}</span>
                    </div>
                    <h2 className="service-name">{project.name}</h2>
                    <p className="service-tagline">{project.tagline}</p>
                  </div>

                  <div className="service-status-box">
                    <span className={`badge badge--${isHealthy ? "ok" : "warn"} ${!isHealthy ? "badge--pulse" : ""}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Problem definition */}
                <div className="service-problem-box">
                  <div className="problem-label">Problem statement</div>
                  <p className="problem-text">{project.problem}</p>
                </div>

                {/* Architectural Highlights */}
                <div className="service-highlights">
                  <div className="highlights-title">Engineering Highlights:</div>
                  <ul className="highlights-list">
                    {project.highlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Stack Tags */}
                <div className="service-stack">
                  <div className="stack-label">Stack:</div>
                  <div className="stack-chips">
                    {project.stack.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Postmortem Accordion (Expandable) */}
                <div className="postmortem-section">
                  <button
                    type="button"
                    className="postmortem-toggle-btn"
                    onClick={() => togglePostmortem(project.slug)}
                    aria-expanded={isExpanded}
                  >
                    <span className="postmortem-title">
                      <span className="postmortem-icon">{isExpanded ? "▼" : "▶"}</span> Incident Postmortem & Fix Log
                    </span>
                    <span className="postmortem-status-hint">
                      {isExpanded ? "collapse postmortem" : "view postmortem details"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="postmortem-content">
                      <div className="postmortem-grid">
                        <div className="postmortem-item">
                          <span className="pm-label">Incident / What broke:</span>
                          <div className="pm-val"><PlaceholderText value={project.incident} /></div>
                        </div>

                        <div className="postmortem-item">
                          <span className="pm-label">Root cause:</span>
                          <div className="pm-val"><PlaceholderText value={project.rootCause} /></div>
                        </div>

                        <div className="postmortem-item">
                          <span className="pm-label">Mitigation & Fix:</span>
                          <div className="pm-val"><PlaceholderText value={project.fix} /></div>
                        </div>

                        <div className="postmortem-item">
                          <span className="pm-label">Automation guardrail:</span>
                          <div className="pm-val"><PlaceholderText value={project.automation} /></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="service-card-links">
                  {project.links.repo && !project.links.repo.startsWith("{{") ? (
                    <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="btn btn--sm">
                      GitHub repository
                    </a>
                  ) : project.links.repo ? (
                    <span className="placeholder-btn">
                      Repo: <PlaceholderText value={project.links.repo} />
                    </span>
                  ) : null}

                  {project.links.demo && (
                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--primary">
                      Live demo
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .projects-page {
          padding: var(--space-6) 0 var(--space-8);
        }
        .projects-header {
          margin-bottom: var(--space-6);
        }
        .header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        .projects-title {
          font-size: var(--step-5);
          margin-bottom: var(--space-2);
        }
        .projects-desc {
          font-size: var(--step-1);
          color: var(--text-muted);
          max-width: 65ch;
        }

        /* 3D Racks Panel */
        .projects-racks-panel {
          margin-bottom: var(--space-7);
          overflow: hidden;
          padding: 0;
        }
        .racks-panel-header {
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
        .racks-canvas-box {
          height: 320px;
          position: relative;
          background: var(--ink);
        }
        .racks-scene-canvas {
          width: 100%;
          height: 100%;
        }
        .racks-legend {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px 14px;
          border-top: 1px solid var(--line);
          background: var(--panel);
        }
        .racks-legend-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 36px;
          padding: 0 14px;
          background: var(--panel-raised);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }
        .racks-legend-chip:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-muted);
        }
        .legend-dot--ok { background: var(--ok); }
        .legend-dot--warn { background: var(--warn); }

        /* Services List */
        .services-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .service-card {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }
        .service-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .service-slug {
          color: var(--accent);
        }
        .service-name {
          font-size: var(--step-3);
          margin: 0 0 4px;
        }
        .service-tagline {
          color: var(--text-muted);
          font-size: var(--step-0);
          margin: 0;
        }
        .service-problem-box {
          background: rgba(10, 14, 20, 0.6);
          border-left: 3px solid var(--accent);
          padding: 10px 14px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .problem-label {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--accent);
          margin-bottom: 2px;
          text-transform: uppercase;
        }
        .problem-text {
          margin: 0;
          color: var(--text);
          font-size: 0.92rem;
        }
        .service-highlights {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .highlights-title {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .highlights-list {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: var(--text);
          font-size: 0.92rem;
        }
        .service-stack {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .stack-label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .stack-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        /* Postmortem Accordion */
        .postmortem-section {
          background: rgba(17, 24, 33, 0.5);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .postmortem-toggle-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(24, 33, 45, 0.6);
          border: none;
          color: var(--text);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          text-align: left;
        }
        .postmortem-toggle-btn:hover {
          background: rgba(24, 33, 45, 0.9);
        }
        .postmortem-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text);
        }
        .postmortem-icon {
          font-size: 0.7rem;
          color: var(--accent);
        }
        .postmortem-status-hint {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .postmortem-content {
          padding: 16px;
          border-top: 1px solid var(--line);
          background: rgba(10, 14, 20, 0.4);
        }
        .postmortem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-4);
        }
        .postmortem-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pm-label {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--accent);
        }
        .pm-val {
          font-size: 0.88rem;
          color: var(--text);
        }
        .placeholder-tag {
          color: var(--warn);
          background: rgba(245, 181, 68, 0.1);
          border: 1px dashed rgba(245, 181, 68, 0.35);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .placeholder-note {
          color: var(--text-muted);
          font-size: 0.75rem;
        }
        .placeholder-btn {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
          padding: 6px 12px;
          border: 1px dashed var(--line);
          border-radius: var(--radius-sm);
        }
        .service-card-links {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: var(--space-2);
        }

        @media (max-width: 768px) {
          .service-card-header {
            flex-direction: column;
          }
          .postmortem-toggle-btn {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
}
