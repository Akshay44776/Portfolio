import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ReleaseCard() {
  const { isBooting } = useApp();
  const gitSha = (import.meta.env.VITE_GIT_SHA || "a1b2c3d").slice(0, 7);

  const status = isBooting ? "deploying" : "healthy";

  return (
    <div className="panel release-card">
      <div className="release-card-header">
        <div className="release-title-row">
          <span className="release-version">v2.4.0</span>
          <span
            className={`badge badge--${status === "healthy" ? "ok" : "warn"} ${status === "deploying" ? "badge--pulse" : ""}`}
          >
            {status}
          </span>
        </div>
        <span className="release-badge-env">prod-cluster</span>
      </div>

      <div className="release-card-metrics">
        <div className="metric-row">
          <span className="metric-label">commit</span>
          <span className="metric-value font-mono">{gitSha}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">deployed</span>
          <span className="metric-value">
            {isBooting ? "in progress (syncing...)" : "2 hours ago"}
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-label">30d uptime</span>
          <span className="metric-value font-mono ok-text">99.95%</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">active pods</span>
          <span className="metric-value font-mono">4 / 4 synced</span>
        </div>
      </div>

      <div className="release-card-footer">
        <Link to="/status" className="release-action-link">
          Open live status board &rarr;
        </Link>
      </div>

      <style>{`
        .release-card {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          background: var(--panel-raised);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
        }
        .release-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .release-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .release-version {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text);
        }
        .release-badge-env {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          background: rgba(124, 196, 255, 0.08);
          color: var(--accent);
          border: 1px solid rgba(124, 196, 255, 0.2);
        }
        .release-card-metrics {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }
        .metric-label {
          color: var(--text-muted);
        }
        .metric-value {
          color: var(--text);
        }
        .font-mono {
          font-family: var(--font-mono);
        }
        .ok-text {
          color: var(--ok);
        }
        .release-card-footer {
          display: flex;
          justify-content: flex-end;
        }
        .release-action-link {
          font-size: 0.82rem;
          font-family: var(--font-mono);
          color: var(--accent);
          text-decoration: none;
        }
        .release-action-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
