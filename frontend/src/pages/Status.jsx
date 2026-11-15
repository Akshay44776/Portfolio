import React, { useState } from "react";
import statusData from "../data/status.mock.json";
import SceneCanvas from "../three/SceneCanvas";
import StatusSkylineScene from "../three/scenes/StatusSkylineScene";
import ClusterFallback from "../components/ClusterFallback";

export default function Status() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const services = statusData.services || [
    { name: "portfolio-web", status: "up", uptime30d: 99.98, latencyMs: 24 },
    { name: "argus", status: "up", uptime30d: 99.6, latencyMs: 110 },
    { name: "verifarm-gateway", status: "up", uptime30d: 99.95, latencyMs: 45 },
    { name: "axiom-relayer", status: "up", uptime30d: 99.8, latencyMs: 82 }
  ];

  // 30 days uptime bars generator
  const get30DaysBars = (seed) => {
    const bars = [];
    for (let i = 0; i < 30; i++) {
      const isDown = seed === "argus" && i === 12;
      const isDegraded = i === 5 || i === 22;
      bars.push({
        day: 30 - i,
        status: isDown ? "down" : isDegraded ? "degraded" : "up",
        latency: isDown ? 0 : isDegraded ? 220 : Math.round(35 + Math.sin(i + seed.length) * 15)
      });
    }
    return bars;
  };

  return (
    <div className="status-page">
      <div className="container">
        {/* Header */}
        <div className="status-header">
          <div className="header-meta">
            <span className="section-eyebrow">system health & telemetry</span>
            <span className="badge badge--ok">all systems operational</span>
          </div>
          <h1 className="status-title">System Status</h1>
          <p className="status-desc">
            Real-time synthetic monitoring, multi-region health checks, and historical uptime metrics for all active services.
          </p>
        </div>

        {/* 3D Skyline Panel */}
        <div className="panel status-skyline-panel">
          <div className="skyline-header">
            <span className="skyline-title">uptime skyline &bull; 30-day extruded metric city</span>
            <span className="skyline-sub">Scanning radar beam monitors regional latencies</span>
          </div>
          <div className="skyline-canvas-box">
            <SceneCanvas
              fallback={<ClusterFallback title="Status Skyline" />}
              className="skyline-scene-canvas"
            >
              <StatusSkylineScene />
            </SceneCanvas>
          </div>
        </div>

        {/* Banner Alert */}
        <div className="panel status-banner-panel">
          <div className="banner-left">
            <span className="banner-dot" />
            <div>
              <div className="banner-heading">All Systems Operational</div>
              <div className="banner-sub font-mono">
                Last checked: 12 seconds ago &bull; Target SLA: 99.9% &bull; Incidents: 0 active
              </div>
            </div>
          </div>
          <div className="banner-metrics">
            <div className="b-metric">
              <span className="b-label font-mono">cluster uptime</span>
              <span className="b-val font-mono ok-text">99.92%</span>
            </div>
            <div className="b-metric">
              <span className="b-label font-mono">avg p95 latency</span>
              <span className="b-val font-mono">42ms</span>
            </div>
          </div>
        </div>

        {/* Latency SVG Sparkline */}
        <div className="panel latency-card">
          <div className="latency-header">
            <h2 className="latency-title">Regional Latency & Sparkline (24 Hours)</h2>
            <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
              p95 latency: 42ms
            </span>
          </div>

          <div className="sparkline-wrapper">
            <svg viewBox="0 0 800 120" className="sparkline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7CC4FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7CC4FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,80 Q50,70 100,75 T200,60 T300,68 T400,50 T500,58 T600,45 T700,52 T800,48 L800,120 L0,120 Z"
                fill="url(#latencyFill)"
              />
              <path
                d="M0,80 Q50,70 100,75 T200,60 T300,68 T400,50 T500,58 T600,45 T700,52 T800,48"
                fill="none"
                stroke="#7CC4FF"
                strokeWidth="2"
              />
              {/* Highlight points */}
              <circle cx="400" cy="50" r="4" fill="#34D3A1" />
              <circle cx="600" cy="45" r="4" fill="#34D3A1" />
              <circle cx="800" cy="48" r="4" fill="#7CC4FF" />
            </svg>
          </div>
          <div className="sparkline-labels font-mono">
            <span>24h ago</span>
            <span>18h ago</span>
            <span>12h ago</span>
            <span>6h ago</span>
            <span>now (18ms)</span>
          </div>
        </div>

        {/* Per-Service 30-Day Uptime Rows */}
        <div className="panel uptime-services-card">
          <h2 className="services-uptime-title">Per-Service Uptime History (30 Days)</h2>

          <div className="service-rows-list">
            {services.map((svc) => {
              const bars = get30DaysBars(svc.name);
              return (
                <div key={svc.name} className="service-status-row">
                  <div className="ssr-top">
                    <div className="ssr-name-group">
                      <span className="ssr-name font-mono">{svc.name}</span>
                      <span className="badge badge--ok" style={{ fontSize: "0.72rem", padding: "1px 6px" }}>
                        operational
                      </span>
                    </div>
                    <div className="ssr-metrics font-mono">
                      <span className="ok-text">{svc.uptime30d}%</span>
                      <span className="meta-sep">&bull;</span>
                      <span>{svc.latencyMs}ms</span>
                    </div>
                  </div>

                  {/* 30 Discrete Bars */}
                  <div className="ssr-bars-track">
                    {bars.map((b) => (
                      <div
                        key={b.day}
                        className={`uptime-bar bar--${b.status}`}
                        onMouseEnter={() => setActiveTooltip(`${svc.name}-Day ${b.day}: ${b.status} (${b.latency}ms)`)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        title={`Day -${b.day}: ${b.status} (${b.latency}ms)`}
                      />
                    ))}
                  </div>

                  <div className="ssr-bottom font-mono">
                    <span>30 days ago</span>
                    <span>{activeTooltip && activeTooltip.startsWith(svc.name) ? activeTooltip.split("-")[1] : "100% operational"}</span>
                    <span>today</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .status-page {
          padding: var(--space-6) 0 var(--space-8);
        }
        .status-header {
          margin-bottom: var(--space-6);
        }
        .status-title {
          font-size: var(--step-5);
          margin-bottom: var(--space-2);
        }
        .status-desc {
          font-size: var(--step-1);
          color: var(--text-muted);
          max-width: 65ch;
        }

        /* 3D Skyline */
        .status-skyline-panel {
          margin-bottom: var(--space-6);
          overflow: hidden;
          padding: 0;
        }
        .skyline-header {
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
        .skyline-canvas-box {
          height: 320px;
          position: relative;
          background: var(--ink);
        }
        .skyline-scene-canvas {
          width: 100%;
          height: 100%;
        }

        /* Banner */
        .status-banner-panel {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-4);
          background: rgba(52, 211, 161, 0.05);
          border-color: rgba(52, 211, 161, 0.3);
        }
        .banner-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .banner-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--ok);
          box-shadow: 0 0 12px rgba(52, 211, 161, 0.6);
        }
        .banner-heading {
          font-size: var(--step-2);
          font-weight: 700;
          color: var(--text);
        }
        .banner-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .banner-metrics {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .b-metric {
          display: flex;
          flex-direction: column;
        }
        .b-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .b-val {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .ok-text {
          color: var(--ok);
        }

        /* Sparkline */
        .latency-card {
          padding: var(--space-5);
          margin-bottom: var(--space-6);
        }
        .latency-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }
        .latency-title {
          font-size: var(--step-1);
          margin: 0;
        }
        .sparkline-wrapper {
          height: 100px;
          width: 100%;
        }
        .sparkline-svg {
          width: 100%;
          height: 100%;
        }
        .sparkline-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* 30-day rows */
        .uptime-services-card {
          padding: var(--space-5);
        }
        .services-uptime-title {
          font-size: var(--step-2);
          margin: 0 0 var(--space-4);
        }
        .service-rows-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .service-status-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: rgba(10, 14, 20, 0.4);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
        }
        .ssr-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ssr-name-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ssr-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text);
        }
        .ssr-metrics {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ssr-bars-track {
          display: grid;
          grid-template-columns: repeat(30, 1fr);
          gap: 4px;
          height: 32px;
          align-items: stretch;
        }
        .uptime-bar {
          background: var(--ok);
          border-radius: 2px;
          cursor: pointer;
          transition: transform var(--dur-fast), filter var(--dur-fast);
        }
        .uptime-bar:hover {
          transform: scaleY(1.15);
          filter: brightness(1.2);
        }
        .bar--degraded {
          background: var(--warn);
        }
        .bar--down {
          background: var(--fail);
        }
        .ssr-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
