import React from "react";
import { Link } from "react-router-dom";
import profile from "../data/profile.json";
import projectsData from "../data/projects.json";
import registryData from "../data/registry.json";
import Terminal from "../components/Terminal";
import ReleaseCard from "../components/ReleaseCard";
import SceneCanvas from "../three/SceneCanvas";
import HeroClusterScene from "../three/scenes/HeroClusterScene";
import ClusterFallback from "../components/ClusterFallback";

export default function Home() {
  const featuredProjects = projectsData.slice(0, 3);
  const featuredSkills = registryData.skills.slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* Left Column: Bio, Credentials, Actions, Terminal */}
          <div className="hero-left">
            <div className="hero-status-strip">
              <span className="badge badge--ok">cluster operational</span>
              <span className="hero-meta-tag font-mono">control-plane: blr-1</span>
              <span className="hero-meta-tag font-mono">uptime: 99.95%</span>
            </div>

            <h1 className="hero-headline">{profile.name}</h1>
            <p className="hero-role">DevOps Engineer &amp; Distributed Systems Builder</p>

            {/* Real Achievement Badges */}
            <div className="hero-achievements-row">
              <span className="achievement-pill">
                <span className="pill-icon">&#x1F3C6;</span> Best Paper Award &bull; ICRIET-2025
              </span>
              <span className="achievement-pill">
                <span className="pill-icon">&#x1F947;</span> 1st Place &bull; ADVAYA 2.0 Hackathon
              </span>
              <span className="achievement-pill">
                <span className="pill-icon">&#x1F393;</span> 8.67 CGPA &bull; SJBIT Bengaluru
              </span>
            </div>

            <p className="hero-summary">
              Computer Science engineer building containerized microservices, automated CI/CD pipelines, and verifiable distributed systems across AI, blockchain, and cloud.
            </p>

            <div className="hero-actions">
              <Link to="/projects" className="btn btn--primary">
                Explore production systems
              </Link>
              <Link to="/resume" className="btn">
                View resume
              </Link>
              <Link to="/registry" className="btn btn--sm font-mono" style={{ marginLeft: "auto" }}>
                Artifact registry &rarr;
              </Link>
            </div>

            {/* Interactive Terminal */}
            <div className="hero-terminal-box">
              <Terminal />
            </div>
          </div>

          {/* Right Column: Dedicated 3D Cluster Stage & Live Release Card */}
          <div className="hero-right">
            <div className="panel hero-cluster-panel">
              <div className="cluster-stage-header">
                <div className="stage-title-group">
                  <span className="stage-dot" />
                  <span className="stage-title font-mono">cluster topology &bull; regional mesh</span>
                </div>
                <span className="badge badge--ok" style={{ fontSize: "0.72rem", padding: "1px 6px" }}>
                  live 60fps
                </span>
              </div>

              {/* 3D Scene Viewport */}
              <div className="cluster-canvas-frame">
                <SceneCanvas fallback={<ClusterFallback />}>
                  <HeroClusterScene />
                </SceneCanvas>
              </div>

              <div className="cluster-stage-footer font-mono">
                <span>hover pod for telemetry &bull; click to inspect service</span>
              </div>
            </div>

            {/* Release Card */}
            <div className="hero-release-wrapper">
              <ReleaseCard />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Below the Fold */}
      <section className="featured-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker font-mono">production deployments</span>
              <h2 className="section-heading">Featured systems</h2>
            </div>
            <Link to="/projects" className="section-link font-mono">
              View all 4 projects &rarr;
            </Link>
          </div>

          <div className="featured-grid">
            {/* Spotlight Card */}
            {featuredProjects[0] && (
              <div className="panel featured-card featured-card--spotlight">
                <div className="card-header-row">
                  <div>
                    <span className="card-meta font-mono">{featuredProjects[0].year}</span>
                    <h3 className="card-heading">{featuredProjects[0].name}</h3>
                  </div>
                  <span className={`badge badge--${featuredProjects[0].status === "healthy" ? "ok" : "warn"}`}>
                    {featuredProjects[0].status}
                  </span>
                </div>

                <p className="card-tagline">{featuredProjects[0].tagline}</p>

                <div className="card-box">
                  <span className="card-box-label font-mono">challenge</span>
                  <p className="card-box-body">{featuredProjects[0].problem}</p>
                </div>

                <div className="card-chips">
                  {featuredProjects[0].stack.slice(0, 5).map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="card-action-bar">
                  <Link to={`/projects#${featuredProjects[0].slug}`} className="btn btn--sm btn--primary">
                    Service postmortem
                  </Link>
                  {featuredProjects[0].links.demo && (
                    <a
                      href={featuredProjects[0].links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--sm font-mono"
                    >
                      Live demo &#x2197;
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Side Stack Cards */}
            <div className="featured-side-list">
              {featuredProjects.slice(1, 3).map((proj) => (
                <div key={proj.slug} className="panel featured-card featured-card--compact">
                  <div className="card-header-row">
                    <div>
                      <span className="card-meta font-mono">{proj.year}</span>
                      <h3 className="card-heading" style={{ fontSize: "var(--step-0)" }}>
                        {proj.name}
                      </h3>
                    </div>
                    <span className={`badge badge--${proj.status === "healthy" ? "ok" : "warn"}`}>
                      {proj.status}
                    </span>
                  </div>

                  <p className="card-tagline" style={{ fontSize: "0.88rem" }}>
                    {proj.tagline}
                  </p>

                  <div className="card-chips">
                    {proj.stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="card-action-bar" style={{ marginTop: "auto", paddingTop: "8px" }}>
                    <Link to={`/projects#${proj.slug}`} className="btn btn--sm">
                      Inspect
                    </Link>
                    {proj.slug === "verifarm" && (
                      <span className="award-tag font-mono">&#x1F947; 1st Place ADVAYA 2.0</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subsystems Health Strip */}
      <section className="skills-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker font-mono">subsystem telemetry</span>
              <h2 className="section-heading">Core capabilities</h2>
            </div>
            <Link to="/registry" className="section-link font-mono">
              Full registry &amp; skills &rarr;
            </Link>
          </div>

          <div className="skills-grid-row">
            {featuredSkills.map((s) => (
              <div key={s.name} className="panel skill-widget">
                <div className="skill-widget-top">
                  <span className="skill-name">{s.name}</span>
                  <span className={`badge badge--${s.status === "healthy" ? "ok" : "warn"}`}>
                    {s.status}
                  </span>
                </div>
                <div className="skill-track">
                  <div
                    className={`skill-bar ${s.status === "healthy" ? "fill--ok" : "fill--warn"}`}
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <div className="skill-widget-bottom font-mono">
                  <span>{s.level}% mastery</span>
                  <span style={{ color: "var(--text-muted)" }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          padding-bottom: var(--space-9);
        }

        /* Hero Section */
        .hero-section {
          padding: var(--space-6) 0 var(--space-8);
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: var(--space-6);
          align-items: start;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .hero-status-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: var(--space-1);
        }

        .hero-meta-tag {
          font-size: var(--step--1);
          color: var(--text-muted);
        }

        .hero-headline {
          font-size: clamp(2.4rem, 2rem + 2.5vw, 4rem);
          margin: 0;
          line-height: 1.05;
          letter-spacing: -0.025em;
        }

        .hero-role {
          font-family: var(--font-display);
          font-size: var(--step-2);
          color: var(--accent);
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Achievement Badges */
        .hero-achievements-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin: 2px 0 var(--space-2);
        }

        .achievement-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          background: rgba(124, 196, 255, 0.08);
          border: 1px solid rgba(124, 196, 255, 0.25);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text);
        }

        .pill-icon {
          font-size: 0.85rem;
        }

        .hero-summary {
          font-size: var(--step-0);
          color: var(--text-muted);
          max-width: 60ch;
          margin: 0 0 var(--space-2);
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
          margin-bottom: var(--space-3);
        }

        .hero-terminal-box {
          margin-top: var(--space-2);
        }

        /* Hero Right: 3D Stage & Release Card */
        .hero-right {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .hero-cluster-panel {
          padding: 0;
          overflow: hidden;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5), var(--highlight);
        }

        .cluster-stage-header {
          padding: 8px 14px;
          background: var(--panel-raised);
          border-bottom: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stage-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stage-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--ok);
        }

        .stage-title {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .cluster-canvas-frame {
          height: 420px;
          position: relative;
          background: #06090e;
        }

        .cluster-stage-footer {
          padding: 6px 14px;
          background: var(--panel-raised);
          border-top: 1px solid var(--line);
          font-size: 0.72rem;
          color: var(--text-muted);
          text-align: center;
        }

        /* Featured Projects Section */
        .featured-section {
          padding: var(--space-8) 0;
          border-top: 1px solid var(--line);
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-6);
        }

        .section-kicker {
          font-size: var(--step--1);
          color: var(--accent);
          display: block;
          margin-bottom: 4px;
        }

        .section-heading {
          font-size: var(--step-3);
          margin: 0;
        }

        .section-link {
          font-size: var(--step--1);
          color: var(--text-muted);
          text-decoration: none;
        }

        .section-link:hover {
          color: var(--accent);
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: var(--space-5);
        }

        .featured-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .featured-card--spotlight {
          padding: var(--space-6);
        }

        .featured-side-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .card-meta {
          font-size: 0.78rem;
          color: var(--text-muted);
          display: block;
        }

        .card-heading {
          margin: 2px 0 0;
          font-size: var(--step-2);
        }

        .card-tagline {
          color: var(--text-muted);
          margin: 0;
          font-size: 0.95rem;
        }

        .card-box {
          background: rgba(6, 9, 14, 0.7);
          border-left: 2px solid var(--accent);
          padding: 10px 14px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }

        .card-box-label {
          font-size: 0.75rem;
          color: var(--accent);
          display: block;
          margin-bottom: 2px;
          text-transform: uppercase;
        }

        .card-box-body {
          margin: 0;
          font-size: 0.88rem;
          color: var(--text);
          line-height: 1.5;
        }

        .card-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .card-action-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: var(--space-2);
        }

        .award-tag {
          font-size: 0.75rem;
          color: var(--ok);
          padding: 2px 6px;
          border-radius: 3px;
          background: rgba(52, 211, 161, 0.1);
          border: 1px solid rgba(52, 211, 161, 0.25);
        }

        /* Skills Section */
        .skills-section {
          padding: var(--space-8) 0 0;
          border-top: 1px solid var(--line);
        }

        .skills-grid-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--space-4);
        }

        .skill-widget {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skill-widget-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name {
          font-weight: 600;
          font-size: 0.92rem;
        }

        .skill-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }

        .skill-bar {
          height: 100%;
          border-radius: var(--radius-pill);
          transition: width 0.8s var(--ease);
        }

        .fill--ok { background: var(--ok); }
        .fill--warn { background: var(--warn); }

        .skill-widget-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }
          .featured-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Phones: headline + CTAs first, shorter 3D stage, stacked section head */
        @media (max-width: 640px) {
          .hero-section { padding: var(--space-5) 0 var(--space-6); }
          .cluster-canvas-frame { height: 260px; }
          .section-head {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-2);
          }
          .hero-actions .btn { flex: 1 1 100%; }
          .hero-actions .btn.btn--sm { margin-left: 0 !important; flex: 0 0 auto; }
        }
      `}</style>
    </div>
  );
}
